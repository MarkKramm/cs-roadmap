// Record the cyber "DNS record types" class verdicts.
//
// Three rows, not four. The class has four rows, but row 4
// (`02-phase-networking-and-linux.md:1196`) is the SAME LOCATION as a command-class
// row that is already answered -- one line making a claim of two kinds. It arrives
// already recorded, which is why the pack emitted three. See D-057 and the
// "rows and locations differ deliberately" note in both verification documents.
//
// Verdicts are TRANSCRIBED from the returned table, never authored (D-057). Every
// key here corresponds to a row that the returned message actually settled.
import fs from "node:fs";

const DOC = "docs/CYBER-CLAIM-VERIFICATION.md";

// Location -> verdict cell. The verdict text carries the sources the verifier
// returned, quoted from their message rather than summarised.
const VERDICTS = {
  "02-phase-networking-and-linux.md:38":
    "**OK** — IETF RFC 3596 (primary source) defines the AAAA record type for IPv6 addresses. IPv6 expands the address field to 128 bits, which RFC/vendor authorities describe as eliminating the need for NAT in most deployments. Global unicast addresses begin with `2000::/3`; link-local addresses use `fe80::/10` (RFC 4291 / RIPE documentation).",
  "02-phase-networking-and-linux.md:312":
    "**OK** — Oracle Help Center (vendor documentation): `dig` accepts a `query-type` argument, where `mx` is the \"mail exchanger for the domain\" and `txt` is \"arbitrary number of strings\". Linux Command Library confirms `dig example.com MX` queries mail exchange records and `dig example.com TXT` queries text records.",
  "02-phase-networking-and-linux.md:1155":
    "**OK** — Linux Command Library (vendor documentation): `dig` supports record types including A, AAAA, MX, NS and TXT. Oracle documentation confirms `dig` recognises `a`, `mx`, `ns` and `txt` as valid query types.",
};

// The pipe inside the quoted Oracle string would break the table cell, so escape it
// before writing. The recorder must fail loudly rather than silently corrupt a row.
const ESC = (s) => s.replace(/\|/g, "\\|");

const doc = fs.readFileSync(DOC, "utf8");
const lines = doc.split("\n");

// Locate the DNS section's rows.
const start = lines.findIndex((l) => l.trim() === "## DNS record types");
if (start === -1) throw new Error("no '## DNS record types' section in " + DOC);
let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
if (end === -1) end = lines.length;

const used = new Set();
let placed = 0;
for (let i = start; i < end; i++) {
  const m = /^\|\s*(\d+)\s*\|\s*`([^`]+?):(\d+)`/.exec(lines[i]);
  if (!m) continue;
  const key = `${m[2]}:${m[3]}`;
  const verdict = VERDICTS[key];
  if (!verdict) continue;

  // Row shape: | # | location | text | verdict |
  const cells = lines[i].split("|");
  if (cells.length < 6) throw new Error(`row ${m[1]} has unexpected shape: ${lines[i].slice(0, 80)}`);
  cells[cells.length - 2] = " " + ESC(verdict) + " ";
  lines[i] = cells.join("|");
  used.add(key);
  placed++;
  console.log(`  row ${m[1].padStart(2)}  ${key}  -> OK`);
}

const missing = Object.keys(VERDICTS).filter((k) => !used.has(k));
if (missing.length) {
  console.error("\n  REFUSED: these keys match no row in the document:");
  for (const k of missing) console.error("    " + k);
  process.exit(1);
}
if (used.size !== Object.keys(VERDICTS).length) {
  console.error(`  REFUSED: supplied ${Object.keys(VERDICTS).length} but used ${used.size}`);
  process.exit(1);
}

fs.writeFileSync(DOC, lines.join("\n"), "utf8");
console.log(`\n  ${placed} verdict(s) recorded.`);
