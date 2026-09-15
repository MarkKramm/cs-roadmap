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
// WHY IT IS NOT IN CI
// It needs a browser binary. GitHub's ubuntu runner has none at any path this
// script looks in, and a guard that cannot run is a guard someone eventually
// deletes. It exits 0 with an explicit "skipped" line when no browser is found,
// so running it in CI is honest rather than red. This is a local verification
// tool, and the honest description of the gap it closes is: the views have been
// rendered in Edge, by a human running this, on one machine.
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

const BROWSERS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

function findBrowser() {
  for (const p of BROWSERS) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      /* an unreadable path is not a candidate */
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

async function main() {
  const browser = findBrowser();
  if (!browser) {
    process.stdout.write('BROWSER CHECK SKIPPED — no browser found at any known path.\n');
    process.stdout.write('Set BASE_URL to a running preview and install Edge/Chrome to run it.\n');
    process.exit(0);
  }

  process.stdout.write('browser: ' + browser + '\n');
  process.stdout.write('base:    ' + BASE + '\n\n');

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-roadmap-cdp-'));
  const flags = [
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + profile,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-gpu',
    '--window-size=' + VIEWPORT.width + ',' + VIEWPORT.height,
  ];
  // Chrome's own sandbox needs a kernel capability a container does not grant,
  // so on a CI runner it refuses to start without this. Kept behind a flag so a
  // local run keeps the sandbox on.
  if (process.env.BROWSER_NO_SANDBOX === '1') flags.push('--no-sandbox', '--disable-dev-shm-usage');
  flags.push(BASE);

  const child = spawn(browser, flags, { stdio: 'ignore' });

  let cdp;
  try {
    const target = await findPageTarget();
    cdp = await CDP.connect(target.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      deviceScaleFactor: 1,
      mobile: false,
    });

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

    // The rail must collapse below its breakpoint, not overflow. This is the
    // half of the D-015 claim a source read cannot confirm.
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 900,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(350);
    const narrow = await cdp.eval(`(() => {
      const el = document.querySelector('.dashboard__rail');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        width: Math.round(el.getBoundingClientRect().width),
        docWidth: document.documentElement.scrollWidth,
        viewport: window.innerWidth
      };
    })()`);
    if (narrow) {
      check(
        'rail: no horizontal overflow at 900px',
        narrow.docWidth <= narrow.viewport + 1,
        'scrollWidth=' + narrow.docWidth + ' viewport=' + narrow.viewport,
      );
    }
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
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
    // 7. Console cleanliness across the whole run
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
  process.stdout.write(
    '\n' + results.filter((r) => !r.informational).length + ' checks, ' + failed.length + ' failed\n',
  );
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((err) => {
  process.stdout.write('\nBROWSER CHECK ERRORED: ' + err.message + '\n');
  process.exit(1);
});