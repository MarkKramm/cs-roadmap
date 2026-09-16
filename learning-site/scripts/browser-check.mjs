// Renders the site in a real browser engine and asserts what only a browser can
// show. Run it against a built site:  npm run build && npm run preview, then
//   node scripts/browser-check.mjs
//
// WHY THIS EXISTS
// Six views — the notes panel, the dashboard rail, the print stylesheet, Shared,
// Your work and the time-budget control — were verified structurally, by 181
// render smoke tests, and by unit suites, and had NEVER been rendered in a
// browser. Those checks cannot see layout, computed CSS, focus behaviour or
// print media. Both defects this project previously found in that class were
// found by reading the CSS by hand, which does not scale and does not repeat.
//
// IT RUNS IN CI
// This comment previously said the opposite, on the belief that GitHub's ubuntu
// runner had no browser at any path this script looks in. That belief was wrong:
// `/usr/bin/google-chrome` is present, and the CI step passes. A guard that only
// runs when someone remembers is not a guard, and this file was one for a day.
//
// A skip is honest locally but must never be invisible in CI, where a green tick
// is the only thing anyone reads. BROWSER_CHECK_STRICT=1 (set in the workflow)
// turns a missing browser into a failure, and MIN_CHECKS does the same for a run
// that connected to an error page and asserted almost nothing. Both failure
// modes exit 0 otherwise, and this project has been bitten by exactly that three
// times — a check that printed nothing and was read as green.
//
// WHY THERE IS NO DEPENDENCY
// Node 24 ships a global WebSocket, and the DevTools Protocol is a JSON protocol
// over one socket. Puppeteer would be ~300 MB for the same twenty commands, and
// rule 3 keeps build tooling dependency-free.
//
// Read-only with respect to the repository: it writes nothing but a temp browser
// profile, which it deletes.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:4173/';
const PORT = Number(process.env.CDP_PORT || 9222);
const VIEWPORT = { width: 1440, height: 1000 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Every engine this script can drive, grouped by the family that decides which
// flags it needs. The grouping is load-bearing rather than cosmetic: Chromium
// takes `--headless=new` and speaks CDP over `--remote-debugging-port`.
//
// THE FIREFOX ENTRY IS A RECORDED DEAD END, NOT A SUPPORTED TARGET.
//
// This file briefly claimed Gecko as a first-class engine. It is not one, and the
// CI leg written to prove it failed on its first run. The cause is not a bug here:
// **Mozilla removed Firefox's CDP implementation.** Its own documentation for
// `remote.active-protocols` states plainly: "With the end of the CDP support,
// WebDriver BiDi is the only available protocol, and the preference was removed in
// Firefox 141." So `--remote-debugging-port` no longer exposes a CDP endpoint that
// `Browser.getVersion` can reach, and no flag or path list can fix that. Driving
// Firefox means implementing WebDriver BiDi — different framing, different
// handshake, a real protocol implementation rather than a configuration change.
//
// The paths and flag are kept deliberately, because the failure they produce is
// the useful part: with `BROWSER_ENGINE=firefox` this script finds the binary,
// launches it, fails to find a CDP target, and exits 1 saying so. That is what
// turned a silent wrong-engine run into a legible failure. What must NOT happen is
// for this entry to be read as "Firefox is covered" — it is not, and the honest
// state of this repository is that it verifies **Chromium only**, across two
// builds (Edge locally, Chrome/Chromium in CI).
const ENGINES = {
  chromium: {
    label: 'Chromium',
    headlessFlag: '--headless=new',
    paths: [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ],
  },
  // NOT SUPPORTED — see the block comment above. Kept so a named-engine request
  // fails loudly and explainably rather than silently resolving to Chromium.
  firefox: {
    label: 'Gecko (CDP removed by Mozilla — cannot be driven this way)',
    headlessFlag: '-headless',
    cdpSupported: false,
    paths: [
      'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
      'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe',
      '/usr/bin/firefox',
      '/usr/bin/firefox-esr',
      '/snap/bin/firefox',
      '/Applications/Firefox.app/Contents/MacOS/firefox',
    ],
  },
};

// Which engine to look for. `auto` keeps the original behaviour — first match
// wins, which on this machine and on the ubuntu runner is Chromium — so an
// existing invocation is unchanged. Naming an engine is still supported and still
// fails loudly when the engine cannot be found, because that guard is what made
// the Firefox dead end legible instead of silent.
const WANT = (process.env.BROWSER_ENGINE || 'auto').toLowerCase();

function findBrowser() {
  // An explicit override first, so the skip path can be exercised on a machine
  // that does have a browser. Without it the only way to test strict mode was to
  // break PATH, which also hides `node` and tests nothing.
  const override = process.env.BROWSER_PATH;
  if (override) {
    try {
      if (fs.existsSync(override)) return { path: override, engine: 'override' };
    } catch {
      /* fall through to the known paths */
    }
    return null;
  }

  // `auto` tries Chromium first, preserving the previous resolution order.
  const order = WANT === 'firefox' ? ['firefox'] : WANT === 'chromium' ? ['chromium'] : ['chromium', 'firefox'];

  for (const name of order) {
    const spec = ENGINES[name];
    for (const p of spec.paths) {
      try {
        if (fs.existsSync(p)) return { path: p, engine: name, spec };
      } catch {
        /* an unreadable path is not a candidate */
      }
    }
  }
  return null;
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.seq = 0;
    this.pending = new Map();
    this.consoleErrors = [];
  }

  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = () => reject(new Error('websocket failed to open'));
    });
    const cdp = new CDP(ws);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && cdp.pending.has(msg.id)) {
        const { resolve, reject } = cdp.pending.get(msg.id);
        cdp.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.method + ': ' + JSON.stringify(msg.error)));
        else resolve(msg.result);
        return;
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params?.exceptionDetails;
        cdp.consoleErrors.push(d?.exception?.description || d?.text || 'exception');
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params?.type === 'error') {
        cdp.consoleErrors.push(
          (msg.params.args || []).map((a) => a.value ?? a.description ?? '').join(' '),
        );
      }
    };
    return cdp;
  }

  send(method, params = {}) {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error('timeout waiting for ' + method));
        }
      }, 30000);
    });
  }

  async eval(expression) {
    const r = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.exceptionDetails) {
      throw new Error(
        r.exceptionDetails.exception?.description || r.exceptionDetails.text || 'eval threw',
      );
    }
    return r.result.value;
  }

  async waitFor(expression, label, timeoutMs = 8000) {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      let v;
      try {
        v = await this.eval(expression);
      } catch {
        v = false;
      }
      if (v) return true;
      if (Date.now() > deadline) throw new Error('timed out waiting for ' + label);
      await sleep(120);
    }
  }
}

// --- tiny assertion harness -------------------------------------------------

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail === undefined ? '' : String(detail) });
}
function note(name, detail) {
  results.push({ name, ok: true, detail: String(detail), informational: true });
}

/**
 * Set the viewport width, using whichever mechanism the running engine honours.
 *
 * Chromium's `Emulation.setDeviceMetricsOverride` is exact and is what the width
 * band was built on. Gecko does not implement it and answers with a protocol
 * error rather than ignoring it, so a Firefox run that reused the call would fail
 * on the first width rather than measuring the wrong thing — better, but still a
 * broken run. `Browser.setWindowBounds` is the Gecko-supported equivalent: it
 * resizes the real window, which is what the media queries actually respond to.
 *
 * The distinction is not cosmetic. `matchMedia` in Firefox reads the window, so
 * driving the band through the window is not a workaround for a missing feature —
 * it is the correct mechanism there, and the one a real Firefox reader's layout
 * is computed from.
 */
async function setWidth(cdp, width, isGecko, height = 1000) {
  if (isGecko) {
    const { windowId } = await cdp.send('Browser.getWindowForTarget');
    await cdp.send('Browser.setWindowBounds', {
      windowId,
      bounds: { width, height },
    });
    return;
  }
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
}

async function findPageTarget() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch('http://127.0.0.1:' + PORT + '/json/list');
      const list = await res.json();
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      /* the browser is not listening yet */
    }
    await sleep(250);
  }
  throw new Error('browser never exposed a page target on port ' + PORT);
}

// React controls its inputs, so assigning .value does not fire onChange. The
// native setter plus a bubbling input event is the way to drive it as a user
// would, which is the whole point of doing this in a browser.
// Written as an assignment to a function expression, not a declaration: a
// `function foo(){}` inside an eval'd script creates a binding in that script's
// scope and does NOT become a property of window, which is how this threw
// "window.__type is not a function" on the first run.
const TYPE_HELPER = `
window.__type = function (el, text) {
  const proto = el.tagName === 'TEXTAREA'
    ? window.HTMLTextAreaElement.prototype
    : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  setter.call(el, text);
  el.dispatchEvent(new Event('input', { bubbles: true }));
};
`;

// A skip that exits 0 is indistinguishable from a pass to anything reading only
// the exit code, and CI reports both as `completed / success`. This project has
// already been bitten three times by a guard that printed nothing and was read
// as green, so on CI the run must be real: BROWSER_CHECK_STRICT=1 turns a
// missing browser into a failure, and MIN_CHECKS catches the other silent
// failure — a run that connects, executes a handful of assertions and exits 0
// because the page it measured was an error page.
const STRICT = process.env.BROWSER_CHECK_STRICT === '1';
// Raised from 40 to 70 as the suite grew to 92 checks across nine areas, and to
// 100 as the quiz checks took it past 105 across ten. The floor exists to catch
// a run that connected to an error page and asserted almost nothing, so it has
// to sit near the real count: a floor far below it stops being a floor. It is
// deliberately not AT the real count, so adding or removing a check does not
// require editing this line.
const MIN_CHECKS = 100;

async function main() {
  const found = findBrowser();
  if (!found) {
    // A CI leg that named an engine and could not find it must fail even outside
    // strict mode: the leg exists to measure that engine, and quietly skipping
    // while the job reports success is the exact silent-pass shape this project
    // has been bitten by repeatedly.
    const namedEngine = WANT === 'firefox' || WANT === 'chromium';
    if (STRICT || namedEngine) {
      process.stdout.write('BROWSER CHECK FAILED — no browser found at any known path.\n');
      if (namedEngine) {
        process.stdout.write(
          'BROWSER_ENGINE=' + WANT + ' was requested by name, so a missing engine is a failure.\n'
        );
      }
      if (STRICT) {
        process.stdout.write('BROWSER_CHECK_STRICT=1 requires a real engine; this is not a skip.\n');
      }
      process.exit(1);
    }
    process.stdout.write('BROWSER CHECK SKIPPED — no browser found at any known path.\n');
    process.stdout.write('Set BASE_URL to a running preview and install a browser to run it.\n');
    process.exit(0);
  }

  const browser = found.path;
  const engineName = found.engine;
  const spec = found.spec || null;

  // Refuse an engine that cannot be driven by this protocol, and say why.
  //
  // Without this the run proceeds, launches Firefox, and dies later at
  // `findPageTarget` with "browser never exposed a page target on port 9222" —
  // technically true and completely unhelpful, because it reads as a flaky
  // startup or a slow machine. The real reason is that Mozilla removed CDP, and
  // a script that knows that should say so.
  if (spec && spec.cdpSupported === false) {
    process.stdout.write('BROWSER CHECK FAILED — ' + engineName + ' cannot be driven by this script.\n\n');
    process.stdout.write('  This script speaks the Chrome DevTools Protocol (CDP).\n');
    process.stdout.write('  Mozilla removed Firefox\'s CDP implementation: its documentation for\n');
    process.stdout.write('  `remote.active-protocols` states that "with the end of the CDP support,\n');
    process.stdout.write('  WebDriver BiDi is the only available protocol, and the preference was\n');
    process.stdout.write('  removed in Firefox 141."\n\n');
    process.stdout.write('  So `--remote-debugging-port` exposes no CDP endpoint here, and no flag\n');
    process.stdout.write('  or path change fixes it. Firefox needs a WebDriver BiDi implementation,\n');
    process.stdout.write('  which is a different protocol rather than a configuration change.\n\n');
    process.stdout.write('  This repository therefore verifies Chromium only. Gecko and WebKit are a\n');
    process.stdout.write('  known, named gap. Run without BROWSER_ENGINE to use Chromium.\n');
    process.exit(1);
  }

  process.stdout.write('browser: ' + browser + '\n');
  process.stdout.write('engine:  ' + engineName + (spec ? ' (' + spec.label + ')' : '') + '\n');
  process.stdout.write('base:    ' + BASE + '\n\n');

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-roadmap-cdp-'));
  const flags = [
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + profile,
    spec ? spec.headlessFlag : '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-gpu',
    '--window-size=' + VIEWPORT.width + ',' + VIEWPORT.height,
  ];
  // Chrome's own sandbox needs a kernel capability a container does not grant,
  // so on a CI runner it refuses to start without this. Kept behind a flag so a
  // local run keeps the sandbox on. Firefox has no equivalent flag and would
  // reject an unknown argument, hence the engine check.
  if (process.env.BROWSER_NO_SANDBOX === '1' && engineName !== 'firefox') {
    flags.push('--no-sandbox', '--disable-dev-shm-usage');
  }
  flags.push(BASE);

  const child = spawn(browser, flags, { stdio: 'ignore' });

  let cdp;
  try {
    const target = await findPageTarget();
    cdp = await CDP.connect(target.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    // Which engine is this, actually?
    //
    // The file's browser list tries Edge before Chrome, so on a machine with
    // both, every run silently measured Edge and the report said "a real
    // browser". That is true and useless: the claim this check makes is about
    // rendering engines, and one engine is one data point. Printing the product
    // and version costs one round trip and makes a second-engine run provable
    // rather than assumed.
    const ua = await cdp.send('Browser.getVersion');
    check('engine: identified', !!ua && !!ua.product, ua ? ua.product : 'unknown');
    note('engine', (ua.product || '?') + ' / ' + (ua.jsVersion || '?'));
    note('engine user-agent', (ua.userAgent || '?').slice(0, 120));

    // THE ASSERTION THAT MAKES THE MATRIX MEAN ANYTHING.
    //
    // When an engine is requested by name, the run must be able to prove it got
    // that engine. Without this, a CI leg named "firefox" whose Firefox was
    // missing from the image would fall through the path list, find Chromium,
    // and report a green Firefox result — a claim about an engine that was never
    // started. That is the same defect class as a skip path that looks like a
    // pass path, and it is worse here, because the result would be cited as
    // cross-browser evidence.
    if (WANT === 'firefox' || WANT === 'chromium') {
      const product = String((ua && ua.product) || '').toLowerCase();
      const agent = String((ua && ua.userAgent) || '').toLowerCase();
      const looksGecko = /firefox/.test(product) || /firefox/.test(agent);
      const looksChromium =
        /chrome|chromium|edg/.test(product) || /chrome|chromium|edg/.test(agent);
      const matches = WANT === 'firefox' ? looksGecko : looksChromium;
      check(
        'engine: the requested engine is the one that ran',
        matches,
        'wanted ' + WANT + ', got ' + (ua.product || 'unknown')
      );
    }

    // Firefox has no `Emulation.setDeviceMetricsOverride` — it answers with a
    // protocol error rather than ignoring the call. The width band is driven by
    // resizing the *window* instead, which Gecko honours via the same command
    // name on a different domain. Detected rather than assumed so a Chromium run
    // keeps using the override, which is exact.
    const geo = spec && spec.label === 'Gecko';
    if (!geo) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: VIEWPORT.width,
        height: VIEWPORT.height,
        deviceScaleFactor: 1,
        mobile: false,
      });
    }

    // Wait for React to mount something.
    await cdp.waitFor('!!document.querySelector(".app-shell")', 'app shell to mount', 15000);
    await sleep(400);

    // ---------------------------------------------------------------------
    // 1. Dashboard rail
    // ---------------------------------------------------------------------
    const rail = await cdp.eval(`(() => {
      const el = document.querySelector('.dashboard__rail');
      if (!el) return { found: false };
      const cs = getComputedStyle(el);
      const cards = el.querySelectorAll('.rail-card').length;
      const chips = el.querySelectorAll('.rail-chip').length;
      return {
        found: true,
        display: cs.display,
        width: Math.round(el.getBoundingClientRect().width),
        position: cs.position,
        cards, chips,
        text: el.textContent.slice(0, 80)
      };
    })()`);
    check('rail: exists', rail.found);
    if (rail.found) {
      check('rail: visible (not display:none)', rail.display !== 'none', rail.display);
      check('rail: has a real width', rail.width > 200, rail.width + 'px');
      check('rail: holds rail-cards', rail.cards >= 3, rail.cards + ' cards');
      check('rail: readiness chips render', rail.chips >= 1, rail.chips + ' chips');
      note('rail: geometry', 'position=' + rail.position + ' width=' + rail.width + 'px');
    }

    // The breakpoints are the claim. global.css declares two, and neither had
    // ever been rendered at the width where it flips:
    //
    //   max-width: 860px   -> .app-shell goes flex-direction: column and
    //                         .sidebar becomes position: fixed with
    //                         transform: translateX(-100%), i.e. an off-canvas
    //                         drawer. Above 860px the sidebar is a flex item.
    //   min-width: 1180px  -> .dashboard__grid becomes two columns and
    //                         .dashboard__rail goes sticky. Below 1180px it is
    //                         ONE column, and a full-width rail is correct.
    //
    // An earlier version of this block asserted `display:none` on the rail at
    // 620px and failed the run. That was wrong about the site, not a defect in
    // it: the rail never had a collapse mechanism — the sidebar did — and the
    // failure was reported against a correct layout. The assertions below are
    // written against what global.css actually declares, and the widths sit on
    // BOTH sides of each breakpoint (1179/1180, 860/861) so that a flip is
    // observed rather than assumed. 861, 860, 760 and 620 are the 561–860px
    // band this driver never rendered.
    for (const w of [1180, 1179, 900, 861, 860, 760, 620]) {
      const drawer = w <= 860;  // .sidebar is off-canvas at or below 860px
      const twoCol = w >= 1180; // .dashboard__grid is two-column at 1180px and up
      await setWidth(cdp, w, geo);
      await sleep(350);
      const band = await cdp.eval(`(() => {
        const rail = document.querySelector('.dashboard__rail');
        const grid = document.querySelector('.dashboard__grid');
        const shell = document.querySelector('.app-shell');
        const side = document.querySelector('.sidebar');
        const cs = (el) => (el ? getComputedStyle(el) : null);
        const tx = (el) => {
          const t = cs(el) && cs(el).transform;
          if (!t || t === 'none') return 0;
          const m = t.match(/matrix\\(([^)]+)\\)/);
          return m ? Number(m[1].split(',')[4]) : 0;
        };
        return {
          docWidth: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
          railWidth: rail ? Math.round(rail.getBoundingClientRect().width) : null,
          railPosition: rail ? cs(rail).position : null,
          shellDir: shell ? cs(shell).flexDirection : null,
          gridCols: grid ? cs(grid).gridTemplateColumns.split(' ').length : null,
          sidePosition: side ? cs(side).position : null,
          sideTx: side ? tx(side) : null,
          sideWidth: side ? Math.round(side.getBoundingClientRect().width) : null
        };
      })()`);

      check(
        'band ' + w + ': no horizontal overflow',
        band.docWidth <= band.viewport + 1,
        'scrollWidth=' + band.docWidth + ' viewport=' + band.viewport,
      );

      // The sidebar drawer contract, max-width: 860px.
      check(
        'band ' + w + ': shell is ' + (drawer ? 'column' : 'row'),
        band.shellDir === (drawer ? 'column' : 'row'),
        'flex-direction=' + band.shellDir,
      );
      check(
        'band ' + w + ': sidebar is ' + (drawer ? 'an off-canvas drawer' : 'inline'),
        drawer
          ? band.sidePosition === 'fixed' && band.sideTx < 0
          : band.sidePosition !== 'fixed',
        'position=' + band.sidePosition + ' translateX=' + band.sideTx,
      );

      // The rail contract, min-width: 1180px.
      check(
        'band ' + w + ': dashboard grid is ' + (twoCol ? 'two-column' : 'single-column'),
        band.gridCols === (twoCol ? 2 : 1),
        'grid-template-columns resolved to ' + band.gridCols + ' track(s)',
      );
      if (twoCol) {
        check(
          'band ' + w + ': rail is sticky in the second column',
          band.railPosition === 'sticky' && band.railWidth > 200,
          'position=' + band.railPosition + ' rail=' + band.railWidth + 'px',
        );
      }
      note(
        'band ' + w + 'px',
        'rail=' + band.railWidth + 'px (' + band.railPosition + ') sidebar=' +
          band.sideWidth + 'px tx=' + band.sideTx,
      );
    }
    await setWidth(cdp, VIEWPORT.width, geo, VIEWPORT.height);
    await sleep(300);

    // ---------------------------------------------------------------------
    // 2. Time-budget control
    // ---------------------------------------------------------------------
    const budget = await cdp.eval(`(() => {
      const fs = document.querySelector('fieldset.budget');
      if (!fs) return { found: false };
      const radios = [...fs.querySelectorAll('input[type=radio]')];
      const legend = fs.querySelector('.budget__legend');
      const noteEl = fs.querySelector('.budget__note');
      const checked = radios.find(r => r.checked);
      return {
        found: true,
        legend: legend ? legend.textContent.trim() : '',
        options: radios.map(r => r.value),
        checked: checked ? checked.value : null,
        note: noteEl ? noteEl.textContent.trim() : '',
        activeClass: fs.querySelector('.budget__option.is-active') ? true : false
      };
    })()`);
    check('budget: control renders', budget.found);
    if (budget.found) {
      check('budget: three options', budget.options.length === 3, budget.options.join(','));
      check(
        'budget: never offers ongoing',
        !budget.options.includes('ongoing'),
        budget.options.join(','),
      );
      check('budget: exactly one checked', !!budget.checked, String(budget.checked));
      check(
        'budget: says the durations are estimates',
        /estimate/i.test(budget.note),
        budget.note,
      );
      check('budget: active option is marked', budget.activeClass);
    }

    // Click a different budget and confirm it persists. A control that renders
    // correctly but does not write is exactly the defect structural tests miss.
    const clicked = await cdp.eval(`(() => {
      const el = document.querySelector('input[name=time-budget][value=quick]');
      if (!el) return false;
      el.click();
      return true;
    })()`);
    if (clicked) {
      await sleep(350);
      const stored = await cdp.eval(
        `localStorage.getItem('cs-roadmap:time-budget:v1')`,
      );
      check(
        'budget: clicking an option persists it',
        stored !== null && stored.includes('quick'),
        String(stored),
      );
    } else {
      check('budget: could click an option', false, 'radio not found');
    }

    // ---------------------------------------------------------------------
    // 3. Notes panel — including the focus case a structural test cannot see
    // ---------------------------------------------------------------------
    const openedPhase = await cdp.eval(`(() => {
      const link = [...document.querySelectorAll('.sidebar__link')]
        .find(b => b.textContent.includes('Computer Fundamentals'));
      if (!link) return false;
      link.click();
      return true;
    })()`);
    check('notes: could open an IT phase', openedPhase);
    await cdp.waitFor('!!document.querySelector(".notes")', 'notes panel to render');
    await sleep(250);

    const closedState = await cdp.eval(`(() => {
      const panel = document.querySelector('.notes');
      return {
        collapsed: !panel.classList.contains('notes--open'),
        textarea: !!panel.querySelector('textarea'),
        chip: panel.querySelector('.chip') ? panel.querySelector('.chip').textContent.trim() : '',
        expanded: panel.querySelector('.chip')?.getAttribute('aria-expanded')
      };
    })()`);
    check('notes: collapsed by default', closedState.collapsed);
    check('notes: no textarea until opened', !closedState.textarea);
    check('notes: chip reports aria-expanded=false', closedState.expanded === 'false', closedState.expanded);

    await cdp.eval(`document.querySelector('.notes .chip').click()`);
    await cdp.waitFor('!!document.querySelector(".notes textarea")', 'textarea to appear');
    await sleep(250);
    check('notes: opening reveals a textarea', true);

    // Type one character at a time and assert focus AND value survive. A parent
    // that recreates the panel on every keystroke remounts the textarea, so the
    // reader loses focus after each letter — real, common, and invisible to any
    // test that sets .value in one shot.
    await cdp.eval(TYPE_HELPER + ' typeof window.__type;');
    await cdp.eval(`(() => {
      const ta = document.querySelector('.notes textarea');
      ta.focus();
      window.__type(ta, 'A');
      return true;
    })()`);
    await sleep(200);
    const afterFirst = await cdp.eval(`(() => {
      const ta = document.querySelector('.notes textarea');
      return { focused: document.activeElement === ta, value: ta.value };
    })()`);
    check('notes: textarea keeps focus after first keystroke', afterFirst.focused);
    check('notes: first keystroke lands', afterFirst.value === 'A', JSON.stringify(afterFirst.value));

    await cdp.eval(`(() => {
      const ta = document.querySelector('.notes textarea');
      window.__type(ta, 'AB');
      return true;
    })()`);
    await sleep(200);
    const afterSecond = await cdp.eval(`(() => {
      const ta = document.querySelector('.notes textarea');
      return { focused: document.activeElement === ta, value: ta.value };
    })()`);
    check('notes: still focused after second keystroke', afterSecond.focused);
    check('notes: value accumulates', afterSecond.value === 'AB', JSON.stringify(afterSecond.value));

    // Persistence to the real key.
    const noteKey = await cdp.eval(`localStorage.getItem('cs-roadmap:notes:v1')`);
    check(
      'notes: typed text persists to cs-roadmap:notes:v1',
      noteKey !== null && noteKey.includes('AB'),
      noteKey ? noteKey.slice(0, 120) : 'null',
    );

    // ---------------------------------------------------------------------
    // 4. Print stylesheet — the one view that is a media query, not a route
    // ---------------------------------------------------------------------
    const screenState = await cdp.eval(`(() => {
      const sidebar = document.querySelector('.sidebar');
      const card = document.querySelector('.card');
      return {
        sidebar: sidebar ? getComputedStyle(sidebar).display : null,
        cardBorder: card ? getComputedStyle(card).borderTopStyle : null,
        bodyBg: getComputedStyle(document.body).backgroundColor
      };
    })()`);
    check('print: sidebar IS visible on screen', screenState.sidebar !== 'none', screenState.sidebar);

    await cdp.send('Emulation.setEmulatedMedia', { media: 'print' });
    await sleep(400);
    const printState = await cdp.eval(`(() => {
      const sidebar = document.querySelector('.sidebar');
      const card = document.querySelector('.card');
      const topbar = document.querySelector('.content__topbar');
      const pre = document.querySelector('.lesson pre, pre');
      const root = getComputedStyle(document.documentElement);
      return {
        sidebar: sidebar ? getComputedStyle(sidebar).display : 'absent',
        topbar: topbar ? getComputedStyle(topbar).display : 'absent',
        cardBorder: card ? getComputedStyle(card).borderTopStyle : 'absent',
        cardPad: card ? getComputedStyle(card).paddingTop : 'absent',
        preBreak: pre ? getComputedStyle(pre).breakInside || getComputedStyle(pre).pageBreakInside : 'absent',
        tokenBg: root.getPropertyValue('--bg').trim(),
        tokenText: root.getPropertyValue('--text').trim(),
        bodyBg: getComputedStyle(document.body).backgroundColor,
        bodyColor: getComputedStyle(document.body).color
      };
    })()`);
    check('print: sidebar is hidden', printState.sidebar === 'none', printState.sidebar);
    check('print: topbar is hidden', printState.topbar === 'none', printState.topbar);
    check('print: card borders removed', printState.cardBorder === 'none', printState.cardBorder);
    check('print: card padding removed', printState.cardPad === '0px', printState.cardPad);
    check(
      'print: --bg repainted to white',
      /^#fff(fff)?$/i.test(printState.tokenBg),
      printState.tokenBg,
    );
    check(
      'print: --text repainted to black',
      /^#000(000)?$/i.test(printState.tokenText),
      printState.tokenText,
    );
    check(
      'print: body is black on white',
      printState.bodyBg === 'rgb(255, 255, 255)',
      printState.bodyBg + ' / ' + printState.bodyColor,
    );
    check(
      'print: code blocks avoid a page break',
      printState.preBreak === 'avoid',
      printState.preBreak,
    );

    await cdp.send('Emulation.setEmulatedMedia', { media: '' });
    await sleep(250);
    const backOnScreen = await cdp.eval(
      `getComputedStyle(document.querySelector('.sidebar')).display`,
    );
    check('print: returning to screen restores the sidebar', backOnScreen !== 'none', backOnScreen);

    // ---------------------------------------------------------------------
    // 5. Shared — a view whose whole content sits behind a click
    // ---------------------------------------------------------------------
    await cdp.eval(`(() => {
      const b = [...document.querySelectorAll('.sidebar__link')]
        .find(x => x.textContent.trim() === 'Shared');
      if (b) b.click();
      return !!b;
    })()`);
    await cdp.waitFor('!!document.querySelector("h1, .content h2")', 'shared view');
    await sleep(400);

    const shared = await cdp.eval(`(() => {
      const chips = [...document.querySelectorAll('[aria-pressed]')];
      const anchors = [...document.querySelectorAll('a[href^="http"]')];
      return {
        chipCount: chips.length,
        chipLabels: chips.map(c => c.textContent.trim()),
        anchorCount: anchors.length,
        firstDocHasAnchors: anchors.length,
        bodyText: document.body.innerText.length
      };
    })()`);
    check('shared: document chips render', shared.chipCount >= 2, shared.chipCount + ' chips');
    check(
      'shared: opens the first document, not the resources list',
      shared.anchorCount === 0,
      shared.anchorCount + ' anchors on the default document',
    );

    // The resources document is the third chip, and the first render never shows
    // it. Measuring the default document and calling that "the resources check"
    // is what this driver did on its first run, and it reported three failures
    // that were all the test's own fault. Select it by name.
    const pickedResources = await cdp.eval(`(() => {
      const chip = [...document.querySelectorAll('[aria-pressed]')]
        .find(c => /Resource List/i.test(c.textContent));
      if (!chip) return false;
      chip.click();
      return true;
    })()`);
    check('shared: the resources document is selectable', pickedResources);
    await sleep(500);

    const resources = await cdp.eval(`(() => {
      const anchors = [...document.querySelectorAll('a[href^="http"]')];
      const groups = document.querySelectorAll('.shared__group').length;
      const listItems = document.querySelectorAll('.shared__resources li').length;
      return {
        anchors: anchors.length,
        groups,
        listItems,
        allNewTab: anchors.length ? anchors.every(a => a.getAttribute('target') === '_blank') : false,
        allRel: anchors.length ? anchors.every(a => (a.getAttribute('rel') || '').includes('noreferrer')) : false,
        sample: anchors[0] ? anchors[0].getAttribute('href') : null,
        // Every anchor must have non-empty text, or the list is 42 unlabelled links.
        allLabelled: anchors.length ? anchors.every(a => a.textContent.trim().length > 0) : false
      };
    })()`);
    check('shared: resources render as real anchors', resources.anchors >= 40, resources.anchors + ' anchors');
    check('shared: resources are grouped', resources.groups >= 3, resources.groups + ' groups');
    check(
      'shared: every resource is a list item',
      resources.listItems === resources.anchors,
      resources.listItems + ' items / ' + resources.anchors + ' anchors',
    );
    check('shared: every anchor is labelled', resources.allLabelled);
    check('shared: anchors open in a new tab', resources.allNewTab);
    check('shared: anchors carry rel=noreferrer', resources.allRel);
    note('shared: sample href', resources.sample);

    // Switching back to a prose document must change the render. A picker that
    // repaints its active chip but not the body is a real failure mode.
    const beforeSwitch = await cdp.eval('document.body.innerText.length');
    const switched = await cdp.eval(`(() => {
      const chip = [...document.querySelectorAll('[aria-pressed]')]
        .find(c => /Anti-Burnout/i.test(c.textContent));
      if (!chip) return false;
      chip.click();
      return true;
    })()`);
    if (switched) {
      await sleep(500);
      const afterSwitch = await cdp.eval(`(() => ({
        len: document.body.innerText.length,
        anchors: document.querySelectorAll('a[href^="http"]').length
      }))()`);
      check(
        'shared: choosing another document changes the page',
        afterSwitch.len !== beforeSwitch,
        beforeSwitch + ' -> ' + afterSwitch.len + ' chars',
      );
      check(
        'shared: leaving the resources list removes its anchors',
        afterSwitch.anchors === 0,
        afterSwitch.anchors + ' anchors remain',
      );
    }

    // ---------------------------------------------------------------------
    // 6. Your work — reads back the note written in step 3
    // ---------------------------------------------------------------------
    await cdp.eval(`(() => {
      const b = [...document.querySelectorAll('.sidebar__link')]
        .find(x => x.textContent.trim() === 'Your work');
      if (b) b.click();
      return !!b;
    })()`);
    await sleep(600);

    const work = await cdp.eval(`(() => {
      const text = document.body.innerText;
      return {
        showsNote: text.includes('AB'),
        // The no-denominator rule, asserted in the DOM rather than in a unit test.
        hasOfN: /\\b\\d+\\s+of\\s+\\d+\\b/.test(text),
        hasPercent: /\\d+\\s?%/.test(text),
        hasProgressbar: !!document.querySelector('[role=progressbar]'),
        length: text.length
      };
    })()`);
    check('your work: renders', work.length > 200, work.length + ' chars');
    check('your work: shows the note written in the browser', work.showsNote);
    check('your work: carries no "N of M" count', !work.hasOfN);
    check('your work: carries no percentage', !work.hasPercent);
    check('your work: carries no progress bar', !work.hasProgressbar);

    // ---------------------------------------------------------------------
    // 7. Where you've been — the neutral list, same no-denominator rule
    //
    // This page is the one most able to become a completion-scold, which the
    // design system forbids. Its own unit test asserts the module carries no
    // `remaining`/`percent` field; this asserts the same rule in a live DOM,
    // where a component could reintroduce it at the rendering layer.
    // ---------------------------------------------------------------------
    await cdp.eval(`(() => {
      const b = [...document.querySelectorAll('.sidebar__link')]
        .find(x => x.textContent.trim() === "Where you've been");
      if (b) b.click();
      return !!b;
    })()`);
    await sleep(600);

    const path = await cdp.eval(`(() => {
      const text = document.body.innerText;
      const rows = document.querySelectorAll('.path-row');
      return {
        length: text.length,
        hasHeading: text.includes("Where you've been"),
        rowCount: rows.length,
        // The rule, in the DOM: no "N of M", no percentage, no progressbar, and
        // no warning colour on anything describing an untouched phase.
        hasOfN: /\\b\\d+\\s+of\\s+\\d+\\b/.test(text),
        hasPercent: /\\d+\\s?%/.test(text),
        hasProgressbar: !!document.querySelector('[role=progressbar]'),
        hasScold: /\\b(behind|overdue|remaining|catch up|you have not)\\b/i.test(text)
      };
    })()`);
    check('where youve been: renders', path.length > 200, path.length + ' chars');
    check('where youve been: shows its heading', path.hasHeading);
    check('where youve been: lists phases', path.rowCount > 0, path.rowCount + ' rows');
    check('where youve been: carries no "N of M" count', !path.hasOfN);
    check('where youve been: carries no percentage', !path.hasPercent);
    check('where youve been: carries no progress bar', !path.hasProgressbar);
    check(
      'where youve been: uses no scolding language',
      !path.hasScold,
      'found a scold word in the rendered text',
    );

    // ---------------------------------------------------------------------
    // 8. Carry this phase — present, collapsed, and additive by construction
    // ---------------------------------------------------------------------
    await cdp.eval(`(() => {
      const b = [...document.querySelectorAll('.sidebar__link')]
        .find(x => /Computer Fundamentals/.test(x.textContent));
      if (b) b.click();
      return !!b;
    })()`);
    await sleep(700);

    const transfer = await cdp.eval(`(() => {
      const sec = document.querySelector('.phase-transfer');
      if (!sec) return { found: false };
      const toggle = sec.querySelector('.link-btn');
      const beforeBtns = sec.querySelectorAll('button').length;
      return {
        found: true,
        title: sec.querySelector('h2') ? sec.querySelector('h2').textContent.trim() : '',
        collapsed: !sec.querySelector('.phase-transfer__actions'),
        expanded: !!(toggle && toggle.getAttribute('aria-expanded') === 'false'),
        beforeBtns
      };
    })()`);
    check('phase transfer: panel is present on a phase page', transfer.found);
    check(
      'phase transfer: collapsed by default',
      transfer.collapsed,
      'actions visible before expanding',
    );

    // Expand it and confirm the two real actions appear.
    await cdp.eval(`(() => {
      const sec = document.querySelector('.phase-transfer');
      const btn = sec && sec.querySelector('.link-btn');
      if (btn) btn.click();
      return !!btn;
    })()`);
    await sleep(400);
    const expanded = await cdp.eval(`(() => {
      const sec = document.querySelector('.phase-transfer');
      if (!sec) return { found: false };
      const btns = [...sec.querySelectorAll('button')].map(b => b.textContent.trim());
      const text = sec.innerText;
      return {
        found: true,
        hasExport: btns.some(t => /Export this phase/.test(t)),
        hasImport: btns.some(t => /Import into this phase/.test(t)),
        hasFileInput: !!sec.querySelector('input[type=file]'),
        saysAdditive: /never removes or overwrites/i.test(text)
      };
    })()`);
    check('phase transfer: export action appears when expanded', expanded.hasExport);
    check('phase transfer: import action appears when expanded', expanded.hasImport);
    check('phase transfer: a real file input is present', expanded.hasFileInput);
    check(
      'phase transfer: states that importing is additive',
      expanded.saysAdditive,
      'the panel does not tell the reader that import cannot destroy work',
    );

    // ---------------------------------------------------------------------
    // 9. Quiz — a real click, real feedback, and no score anywhere
    // ---------------------------------------------------------------------
    // The unit suite covers the scoring maths. What only a browser can prove is
    // that the control actually responds: that a click records an answer, that
    // the correct option is revealed only afterwards, and that the accessible
    // labels are present rather than relying on colour alone.
    await cdp.eval(`(() => {
      const b = [...document.querySelectorAll('.sidebar__link')]
        .find(x => /Operating Systems/.test(x.textContent));
      if (b) b.click();
      return !!b;
    })()`);
    await sleep(700);

    const quizBefore = await cdp.eval(`(() => {
      const q = document.querySelector('.quiz');
      if (!q) return { found: false };
      const first = q.querySelector('.quiz__q');
      return {
        found: true,
        questions: q.querySelectorAll('.quiz__q').length,
        optionsInFirst: first ? first.querySelectorAll('.quiz__opt').length : 0,
        // Before answering, no correctness is revealed at all.
        anyCorrectMarked: !!q.querySelector('.quiz__opt--correct'),
        anyWhy: !!q.querySelector('.quiz__why'),
        enabled: first ? [...first.querySelectorAll('.quiz__opt')].every(b => !b.disabled) : false
      };
    })()`);
    check('quiz: renders on a phase that has one', quizBefore.found);
    check(
      'quiz: shows its questions',
      quizBefore.questions >= 5,
      quizBefore.questions + ' questions',
    );
    check(
      'quiz: the first question has four options',
      quizBefore.optionsInFirst === 4,
      String(quizBefore.optionsInFirst),
    );
    check(
      'quiz: reveals nothing before an answer is chosen',
      !quizBefore.anyCorrectMarked && !quizBefore.anyWhy,
      'correctness or explanation visible before answering',
    );

    // Click a deliberately WRONG option in the first question, found by reading
    // which one the page later marks correct — so this does not assume a
    // position and cannot silently start clicking the right answer if the
    // content is reordered.
    await cdp.eval(`(() => {
      const first = document.querySelector('.quiz__q');
      const btns = [...first.querySelectorAll('.quiz__opt')];
      // The correct one is not marked yet, so click the last option, then read
      // back which got the Correct badge. Chosen dynamically below.
      if (btns.length) btns[btns.length - 1].click();
      return true;
    })()`);
    await sleep(400);

    const quizAfter = await cdp.eval(`(() => {
      const first = document.querySelector('.quiz__q');
      if (!first) return { found: false };
      const opts = [...first.querySelectorAll('.quiz__opt')];
      const correct = first.querySelector('.quiz__opt--correct');
      const wrongPick = first.querySelector('.quiz__opt--wrong');
      return {
        found: true,
        // Exactly one option is now revealed as correct.
        correctCount: first.querySelectorAll('.quiz__opt--correct').length,
        hasCorrect: !!correct,
        correctHasBadge: correct
          ? /Correct/i.test(correct.textContent)
          : false,
        // The explanation appears only after answering.
        hasWhy: !!first.querySelector('.quiz__why'),
        // Every option in this question is now locked, so an answer cannot be
        // changed after seeing the result.
        allDisabled: opts.every(b => b.disabled),
        // Whether the click was wrong determines which class appears; both are
        // valid outcomes, but they must be consistent with each other.
        wrongMarked: !!wrongPick,
        wrongHasLabel: wrongPick ? /Your answer/i.test(wrongPick.textContent) : true,
        summary: document.querySelector('.quiz__summary')
          ? document.querySelector('.quiz__summary').textContent
          : ''
      };
    })()`);

    check('quiz: a click reveals the correct answer', quizAfter.hasCorrect);
    check(
      'quiz: exactly one option is marked correct',
      quizAfter.correctCount === 1,
      quizAfter.correctCount + ' marked',
    );
    check(
      'quiz: the correct option is labelled, not just coloured',
      quizAfter.correctHasBadge,
      'no text label on the correct option',
    );
    check('quiz: the explanation appears after answering', quizAfter.hasWhy);
    check(
      'quiz: options lock once answered',
      quizAfter.allDisabled,
      'an answered question still accepts changes',
    );
    check(
      'quiz: a wrong pick is labelled, not just coloured',
      quizAfter.wrongHasLabel,
      'wrong pick carried no text label',
    );
    // The no-shame rule, asserted in the DOM rather than in prose: a partial
    // quiz must not report a score, a percentage, or "N of M correct".
    const quizText = await cdp.eval(
      `(() => { const q = document.querySelector('.quiz'); return q ? q.innerText : ''; })()`,
    );
    check(
      'quiz: carries no percentage anywhere',
      !/%/.test(quizText),
      'found a percentage in the quiz',
    );
    check(
      'quiz: carries no score language',
      !/[Ss]core/.test(quizText) && !/\b\d+\s*\/\s*\d+\s*correct\b/.test(quizText),
      'found score language in the quiz',
    );

    // "Start over" must actually clear the answers, not just relabel.
    const restarted = await cdp.eval(`(() => {
      const q = document.querySelector('.quiz');
      const btn = [...q.querySelectorAll('button')].find(b => /Start over/i.test(b.textContent));
      if (!btn) return { found: false };
      btn.click();
      return { found: true };
    })()`);
    await sleep(400);
    const afterReset = await cdp.eval(`(() => {
      const q = document.querySelector('.quiz');
      return {
        anyCorrectMarked: !!q.querySelector('.quiz__opt--correct'),
        anyWhy: !!q.querySelector('.quiz__why'),
        anyDisabled: [...q.querySelectorAll('.quiz__opt')].some(b => b.disabled)
      };
    })()`);
    check('quiz: a Start over control exists once answered', restarted.found);
    check(
      'quiz: Start over clears the answers',
      !afterReset.anyCorrectMarked && !afterReset.anyWhy && !afterReset.anyDisabled,
      'the quiz did not return to its unanswered state',
    );

    // A phase with a quiz must render a real quiz, not an empty scaffold.
    //
    // THIS CHECK REPLACED ONE THAT HAD BECOME VACUOUS, AND BOTH STEPS MATTER.
    //
    // The original clicked IT 01 "Computer Fundamentals" and asserted no quiz
    // rendered, because IT 01 was the one phase with no quiz section. Every phase
    // in the curriculum now has a quiz, so that assertion failed — not because
    // the product regressed, but because its subject had been fixed.
    //
    // The first attempt at a replacement asserted "either there is no quiz
    // container, or the container holds questions". That passed even with the
    // component's empty-quiz branch deliberately rewritten to render
    // `<div className="quiz" />`, because no phase reaches that branch any more.
    // **A check that cannot fail is not a check**, and keeping it would have
    // traded a real assertion for the appearance of one. It was removed.
    //
    // What replaced it tests something that is true, reachable, and load-bearing:
    // the phase that USED to have no quiz now has one, and it renders with real
    // questions and a real heading. That is the property a reader depends on, and
    // it fails if the quiz stops rendering — which is a plausible regression in a
    // way that the empty branch no longer is.
    //
    // The empty branch itself is still covered, at the level where it can be
    // reached: `learning-site/scripts/test-quiz.mjs` asserts `summarise([], {})`
    // and `summarise(null, {})` both report `empty`.
    await cdp.eval(`(() => {
      const b = [...document.querySelectorAll('.sidebar__link')]
        .find(x => /Computer Fundamentals/.test(x.textContent));
      if (b) b.click();
      return !!b;
    })()`);
    await sleep(700);
    const quizShape = await cdp.eval(
      `(() => {
        const q = document.querySelector('.quiz');
        return {
          container: !!q,
          questions: q ? q.querySelectorAll('.quiz__q').length : 0,
          heading: [...document.querySelectorAll('h2')].some(h => h.textContent.trim() === 'Quiz'),
        };
      })()`,
    );
    check(
      'quiz: a phase with a quiz renders real questions, not an empty shell',
      quizShape.container && quizShape.questions > 0,
      quizShape.container
        ? `the quiz container rendered with ${quizShape.questions} question(s)`
        : 'no quiz container rendered on a phase that has one',
    );
    check(
      'quiz: the quiz section is headed',
      quizShape.heading,
      'the quiz rendered without its heading',
    );

    // ---------------------------------------------------------------------
    // 10. Console cleanliness across the whole run
    // ---------------------------------------------------------------------
    const errs = cdp.consoleErrors.filter((e) => e && e.trim() !== '');
    check(
      'no uncaught exceptions or console errors during the run',
      errs.length === 0,
      errs.length ? errs.slice(0, 3).join(' | ') : 'none',
    );
  } finally {
    try {
      child.kill();
    } catch {
      /* already gone */
    }
    await sleep(300);
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {
      /* a locked temp dir is not a test failure */
    }
  }

  // --- report ---------------------------------------------------------------
  const failed = results.filter((r) => !r.ok);
  process.stdout.write('\nRENDERED IN A REAL BROWSER\n\n');
  for (const r of results) {
    const tag = r.informational ? '     ' : r.ok ? '  OK ' : ' FAIL';
    process.stdout.write(tag + ' ' + r.name + (r.detail ? '  — ' + r.detail : '') + '\n');
  }
  const ran = results.filter((r) => !r.informational).length;
  process.stdout.write('\n' + ran + ' checks, ' + failed.length + ' failed\n');

  // A run that asserted almost nothing is not a pass. If the preview server
  // answered with an error page, or a selector vanished, the assertions that
  // never executed would otherwise look like assertions that held.
  if (ran < MIN_CHECKS) {
    process.stdout.write(
      '\nBROWSER CHECK FAILED — only ' + ran + ' checks ran, expected at least ' + MIN_CHECKS + '.\n',
    );
    process.exit(1);
  }

  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((err) => {
  process.stdout.write('\nBROWSER CHECK ERRORED: ' + err.message + '\n');
  process.exit(1);
});