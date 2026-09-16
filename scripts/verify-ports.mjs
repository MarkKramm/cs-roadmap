// Tier-2 verification: the IT track's port claims, checked against the IANA
// Service Name and Transport Protocol Port Number Registry.
//
// WHY THIS IS THE RIGHT SOURCE
// The IANA registry is the authority that ASSIGNS these numbers. Checking a
// port claim against it is not "a source that agrees" — it is the assignment
// record itself. That is the difference between this and asking a model, whose
// answer would be recall of the same registry with no way to tell a correct
// recollection from a plausible one.
//
// The registry is downloaded once to a local cache and parsed. Re-running with
// a fresh download re-checks against the CURRENT registry, which is what makes
// this able to detect rot rather than merely reproducing today's answer.
//
// Run: node scripts/verify-ports.mjs            (uses cache if present)
//      node scripts/verify-ports.mjs --refresh  (re-downloads first)
//
// NOT WIRED INTO CI, deliberately. It needs the network, and a guard whose
// failure mode is "IANA was unreachable" is a guard that will one day fail for
// a reason that has nothing to do with the content — which teaches people to
// ignore it. `verify-cidr` and `verify-metrics` recompute from the repository
// alone and DO run in CI. Run this one by hand when the port table changes,
// and with --refresh when it has been a while.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CACHE = path.join(ROOT, ".cache", "iana-ports.csv");
const URL = "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.csv";

async function registry() {
  const refresh = process.argv.includes("--refresh");
  if (!refresh && fs.existsSync(CACHE)) {
    return fs.readFileSync(CACHE, "utf8");
  }
  process.stderr.write("downloading IANA port registry…\n");
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`IANA fetch failed: HTTP ${res.status}`);
  const text = await res.text();
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(CACHE, text, "utf8");
  return text;
}

/** port -> { service, description } for the tcp/udp rows IANA actually assigns. */
function parseRegistry(csv) {
  const byPort = new Map();
  const lines = csv.split("\n");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    // Minimal CSV split: the registry quotes fields containing commas.
    const cells = [];
    let cur = "";
    let inQ = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        if (inQ && line[j + 1] === '"') {
          cur += '"';
          j++;
        } else inQ = !inQ;
      } else if (ch === "," && !inQ) {
        cells.push(cur);
        cur = "";
      } else cur += ch;
    }
    cells.push(cur);
    const [service, port, proto, description] = cells;
    if (!/^\d+$/.test(port)) continue;
    if (proto !== "tcp" && proto !== "udp") continue;
    const p = Number(port);
    if (!byPort.has(p)) byPort.set(p, []);
    byPort.get(p).push({ service: service.trim(), description: (description || "").trim(), proto });
  }
  return byPort;
}

// The claims, as the IT track states them. Kept in step with the phase by hand
// rather than by regex, because the point of this check is to compare a MEANING
// against the registry — "445 is SMB, Windows file and printer sharing" is the
// claim, and no pattern extracts that reliably.
const CLAIMS = [
  { port: 20, expect: /ftp/i, text: "FTP data transfer", where: "it 03 port table" },
  { port: 21, expect: /ftp/i, text: "FTP control", where: "it 03 port table" },
  { port: 22, expect: /ssh/i, text: "SSH secure remote shell", where: "it 03 port table" },
  { port: 25, expect: /smtp|simple mail/i, text: "SMTP sending mail", where: "it 03 port table" },
  { port: 53, expect: /domain|dns/i, text: "DNS name resolution", where: "it 03 port table" },
  { port: 67, expect: /bootp|dhcp/i, text: "DHCP server", where: "it 03 port table" },
  { port: 68, expect: /bootp|dhcp/i, text: "DHCP client", where: "it 03 port table" },
  { port: 80, expect: /http|world wide web/i, text: "HTTP web, unencrypted", where: "it 03 port table" },
  { port: 110, expect: /pop3|post office/i, text: "POP3 receiving mail", where: "it 03 port table" },
  { port: 143, expect: /imap/i, text: "IMAP receiving mail", where: "it 03 port table" },
  { port: 443, expect: /https|http/i, text: "HTTPS web, TLS", where: "it 03 port table" },
  { port: 445, expect: /microsoft-ds|smb|directory service/i, text: "SMB file and printer sharing", where: "it 03 port table" },
  { port: 3389, expect: /ms-wbt-server|rdp|remote desktop/i, text: "RDP Windows Remote Desktop", where: "it 03 port table" },
  { port: 389, expect: /ldap/i, text: "LDAP (if referenced)", where: "it 05 / cyber references" },
  { port: 636, expect: /ldaps|ldap/i, text: "LDAPS (if referenced)", where: "it 05 / cyber references" },
  { port: 123, expect: /ntp|network time/i, text: "NTP (if referenced)", where: "general" },
  { port: 137, expect: /netbios/i, text: "NetBIOS name service (if referenced)", where: "it 05" },
  { port: 139, expect: /netbios/i, text: "NetBIOS session service (if referenced)", where: "it 05" },
  { port: 9100, expect: /pdl-datastream|pdl data|printer/i, text: "raw printing — IT 04 says 'nearly every network printer' listens here", where: "it 04 printer triage" },
];

const csv = await registry();
const byPort = parseRegistry(csv);
console.log(`IANA registry parsed: ${byPort.size} assigned TCP/UDP ports\n`);

const findings = [];
let checked = 0;
let skipped = 0;

for (const c of CLAIMS) {
  const rows = byPort.get(c.port);
  if (!rows) {
    findings.push(`port ${c.port} — NOT ASSIGNED in the IANA registry (claim: ${c.text})`);
    continue;
  }
  const match = rows.some((r) => c.expect.test(r.service) || c.expect.test(r.description));
  if (!match) {
    findings.push(
      `port ${c.port} — claim "${c.text}" does not match IANA. Registry says: ` +
        rows.map((r) => `${r.service || "(no name)"} [${r.proto}] "${r.description}"`).join("; "),
    );
    continue;
  }
  checked++;
  const shown = rows.find((r) => c.expect.test(r.service) || c.expect.test(r.description));
  console.log(
    `  ${String(c.port).padEnd(5)} ${(shown.service || "(none)").padEnd(18)} ${shown.description.slice(0, 52).padEnd(54)} ok`,
  );
}

console.log("");
if (findings.length) {
  console.log(`TIER 2 FAILED — ${findings.length} of ${CLAIMS.length} port claims wrong:\n`);
  for (const f of findings) console.log("  " + f);
  process.exit(1);
}
console.log(`TIER 2 PASSED — ${checked} port claims match the IANA registry.`);
console.log("Source: IANA Service Name and Transport Protocol Port Number Registry");
console.log(`        ${URL}`);
console.log("Re-run with --refresh to check against the current registry rather than the cache.");
