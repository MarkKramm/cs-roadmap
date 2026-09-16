// Truth table for the DNS-record class. Every case below is a REAL line from the
// corpus, labelled with what it should do. This is the guard's own test: the
// pattern is only correct if it accepts all three real claims AND rejects all
// six false positives. Eyeballing the output can't tell you that.
import fs from "node:fs";

const re = new RegExp(
  [
    "\\b(?:AAAA|CNAME|MX|TXT|NS|SOA|PTR|SRV|CAA)\\s+records?\\b",
    "`A`\\s*records?\\b",
    "(?:nslookup|dig|host|resolve|lookup)[^\\n]{0,60}?\\bA\\s+records?\\b",
    "\\brecord\\s+types?\\b(?=[^.\\n]*\\b(?:DNS|nslookup|resolver|zone|nameserver|domain)\\b)",
    "\\bresolv(?:e|es|ing)\\b[^.\\n]{0,40}\\brecord\\b",
  ].join("|"),
  "gi",
);

const CASES = [
  // --- must MATCH: genuine DNS claims ---
  [true, "IT03:54", "- DNS: A, AAAA, CNAME, MX, TXT, NS records |"],
  [true, "IT03:180", "2. **`AAAA` records are the DNS counterpart to IPv4's `A` records.** If a name resolves over IPv4 but not over IPv6"],
  [true, "IT03:231", "nslookup google.com                      # the A record"],
  [true, "IT03:233", "nslookup -type=txt google.com            # TXT records"],
  // --- must NOT match: the word "record" in ordinary English ---
  [false, "IT01:754", "A **ticket** is a record of a request or a problem, created so that the work can be tracked"],
  [false, "IT06:83", "2. **A record of what was done** — the audit trail. If someone asks in three months what changed"],
  [false, "IT08:676", "This is the single most valuable artefact you can produce. It is a record of *you* doing a thing"],
  [false, "IT09:242", "Everything else is a record; that column is what tells you what to do today."],
  [false, "IT09:503", "They build a record and mistake it for a system. A record tells you what happened"],
  [false, "IT09:971", "**Why:** Every other column is a record of what happened; only a date tells you what to do today."],
  // --- edge cases worth pinning down ---
  [true, "IT03:217x", "#### The record types you will actually meet in DNS"],
  [false, "IT02:999", "Reachability record type of the ticket is unchanged"],
];

let fail = 0;
for (const [shouldMatch, where, text] of CASES) {
  re.lastIndex = 0;
  const m = text.match(re);
  const matched = !!m;
  const ok = matched === shouldMatch;
  if (!ok) fail++;
  const tag = ok ? "ok  " : "FAIL";
  const want = shouldMatch ? "match   " : "no-match";
  console.log(`${tag} expect ${want}  got ${(matched ? "match   " : "no-match")}  ${where.padEnd(10)} ${JSON.stringify(m || [])}`);
}

console.log("");
if (fail) {
  console.log(`DNS-RECORD PATTERN FAILED: ${fail} of ${CASES.length} cases wrong.`);
  process.exit(1);
}
console.log(`DNS-record pattern correct: ${CASES.length}/${CASES.length} cases.`);
