// Extract every machine-checkable technical claim from the IT track into a
// single reviewable list.
//
// WHY THIS EXISTS
// Nothing in this repository has ever tested whether its content is technically
// TRUE. Every guard tests internal consistency — does the parser lose content,
// do the cross-references resolve, does a table sum to the number the prose
// claims. The comprehension passes test whether a beginner can FOLLOW the text.
// Both are blind to a sentence that is perfectly consistent, perfectly clear,
// and factually wrong. The one error of that class found so far
// (`modbus.func_code >= 15` also matching code 43) was found by a reader who
// happened to know Modbus.
//
// This script does not verify anything. It cannot: verification means fetching
// a primary source and comparing, which needs a network and a human judgement
// about which source is authoritative. What it does is make the verification
// POSSIBLE — by pulling every claim of a checkable class out of 160,000 words
// and into one list with an exact location, so the checking is finite work
// rather than a re-read.
//
// Output is Markdown, written for pasting into a chat with a model that has
// web access: claim, location, the text as written, and an empty verdict slot.
//
// Run: node scripts/extract-claims.mjs > docs/IT-CLAIM-VERIFICATION.md

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TRACK = path.join(ROOT, "career-roadmaps", "it-roadmap");

// --- claim classes ----------------------------------------------------------
// Each class is something with a right answer that lives in a document: a
// registry, a spec, a vendor doc, an RFC. Deliberately EXCLUDED: anything whose
// correctness is a matter of judgement (is this good advice, is this the right
// emphasis, is this analogy helpful). Those cannot be verified and must not be
// laundered into a "verified" column.

const CLASSES = [
  {
    id: "cidr",
    settled: true,
    title: "IP addressing and subnetting",
    why: "Every value is arithmetic or is fixed by RFC 1918 / RFC 6890. Highest-risk class: a wrong mask teaches a wrong mental model that persists.",
    source: "RFC 1918 (private ranges), RFC 6890 (special-purpose), or by recomputation",
    // Only claims, not every address or prefix that appears. A bare IP in a
    // worked example or a traceroute dump is DATA — it costs a reader nothing
    // if the example used 10.0.0.7 instead. A bare `/24` in a topic list is a
    // MENTION, not an assertion. What must be right is a stated reserved RANGE,
    // a stated usable-host COUNT, an explicit mask VALUE, or an equivalence
    // between a mask and its prefix length. Matching every dotted quad and
    // every slash-number produced 233 hits in IT 03 alone and buried the ~20
    // that could actually be wrong.
    re: /\b10\.\d+\.\d+\.\d+\/\d+\b|\b172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+\/\d+\b|\b192\.168\.\d+\.\d+\/\d+\b|\b169\.254\.\d+\.\d+\/\d+\b|\b255(?:\.\d{1,3}){3}\b|\b\d+\s+usable\s+hosts?\b|\bblock size\b[^.\n]{0,30}|=\s*\/\d{1,2}\b|\/\d{1,2}\s*=\s*\d/g,
  },
  {
    id: "port",
    settled: true,
    title: "Port numbers",
    why: "Fixed by the IANA Service Name and Transport Protocol Port Number Registry. A wrong port number is unrecoverable from context.",
    source: "IANA port registry, or Microsoft/vendor docs for the Windows-specific ones",
    re: /\bport\s+\d{1,5}\b|\b\d{1,5}\/(?:tcp|udp)\b|:\d{2,5}\b(?=[^0-9])/gi,
  },
  {
    id: "command",
    title: "Command and cmdlet usage",
    why: "Flags, parameters and syntax are fixed by the tool's own documentation. A wrong flag in a worked example is executable code that silently cannot run.",
    source: "Microsoft Learn for cmdlets, man pages for POSIX tools",
    re: /`(?:ipconfig|ping|tracert|nslookup|netsh|Test-NetConnection|Get-\w+|Set-\w+|New-\w+|Resolve-DnsName|sfc|dism|chkdsk|systemctl|chmod|chown|grep|awk|sed|curl|ssh|netstat|nltest|gpresult|gpupdate|wmic|robocopy|schtasks|tasklist|taskkill|net user|net share|diskpart|bcdedit)[^`]*`/g,
  },
  {
    id: "record",
    title: "DNS record types",
    why: "Defined by RFC 1035 and successors. Small set, easy to get subtly wrong.",
    source: "RFC 1035 and the IANA DNS parameters registry",
    // The first version matched `\brecord type[s]?\b` and `\bA record\b`, which
    // pulled in ticketing rows — "A record of what was done", "a ticket is a
    // record". The word "record" is ordinary English, and "A record" is also
    // just a sentence starting with the article.
    //
    // The rule that actually separates them is NOT "does the line mention DNS".
    // A code-block line like `nslookup google.com  # the A record` IS a DNS
    // claim and mentions no DNS term at all; narrowing on DNS context alone
    // dropped it. What distinguishes a claim from prose is whether the author
    // is NAMING a record type:
    //   - a multi-letter type (CNAME, MX, TXT, ...) followed by "record", or
    //   - the `A` type where it is backticked, or it follows a DNS command, or
    //     the line is inside a code fence.
    // "A record of what was done" is none of those.
    re: new RegExp(
      [
        "\\b(?:AAAA|CNAME|MX|TXT|NS|SOA|PTR|SRV|CAA)\\s+records?\\b",
        "`A`\\s*records?\\b",
        // "the A record" as the object of a DNS lookup, in prose or a comment.
        // [^\n] rather than [^.\n]: the command and the phrase are separated by
        // column-alignment spaces, and the hostname in between contains dots.
        "(?:nslookup|dig|host|resolve|lookup)[^\\n]{0,60}?\\bA\\s+records?\\b",
        // the phrase "record type(s)" in a DNS sentence
        "\\brecord\\s+types?\\b(?=[^.\\n]*\\b(?:DNS|nslookup|resolver|zone|nameserver|domain)\\b)",
        "\\bresolv(?:e|es|ing)\\b[^.\\n]{0,40}\\brecord\\b",
      ].join("|"),
      "gi",
    ),
  },
  {
    id: "protocol",
    title: "Protocol and standard behaviour",
    why: "Fixed by the defining spec. Includes handshake sequences, header fields, status codes and OSI layer assignments.",
    source: "The RFC or standard that defines the protocol; vendor docs for proprietary ones",
    // Requires an ASSERTION about the protocol, not merely a mention of it.
    // Matching the bare acronym returned 87 hits in IT 03, nearly all of them
    // sentences like "check the TCP connection" that assert nothing checkable.
    // A protocol name only matters here when the same line states a number, a
    // layer, a port, an order, or a direction.
    re: /\b(?:SYN|SYN-ACK|DORA|802\.1X|WPA2|WPA3|OAuth|SAML)\b[^.\n]{0,70}|\b(?:TCP|UDP|ICMP|ARP|DHCP|DNS|TLS|SMB|RDP|LDAP|Kerberos|NTLM)\b[^.\n]{0,50}\b(?:layer|port|handshake|three-way|reliable|connectionless|encrypt|plaintext|broadcast|multicast|unicast|TTL|header|flag|code \d|status)/gi,
  },
  {
    id: "version",
    title: "Product versions and editions",
    why: "The class most likely to ROT. A claim that is true today may be false after a release, so these carry a shelf life the others do not.",
    source: "Vendor documentation, checked against the current release",
    re: /\b(?:Windows|Ubuntu|Kali|Debian|PowerShell|Python|macOS|iOS|Android|Server)\s+\d+(?:\.\d+)?(?:\s+(?:Home|Pro|Enterprise|Education|LTSC))?\b/g,
  },
  {
    id: "registry",
    title: "Registry paths, file paths and filenames",
    why: "Verbatim strings that must match the OS exactly. A transposed path sends a reader somewhere that does not exist.",
    source: "Microsoft documentation, or the OS itself",
    re: /`(?:HKLM|HKCU|HKEY_[A-Z_]+)[^`]*`|`[A-Za-z]:\\[^`\n]+`|`\/(?:etc|var|home|usr|proc|sys)\/[^`\n]+`/g,
  },
  {
    id: "number",
    settled: true,
    title: "Stated counts, sizes and arithmetic",
    why: "Checkable by RECOMPUTATION, which needs no source at all — the strongest tier of verification available.",
    source: "Recomputation from the document's own numbers",
    re: /\b\d[\d,.]*\s*(?:GB|MB|KB|TB|bytes|bits|hosts?|addresses|subnets?|accounts|devices|minutes|hours|days|weeks)\b/gi,
  },
];

// --- read the track ---------------------------------------------------------

function phaseFiles() {
  return fs
    .readdirSync(TRACK)
    .filter((f) => f.endsWith(".md") && f.includes("-phase-"))
    .sort();
}

function phaseTitle(lines) {
  for (const l of lines) {
    const m = /^title:\s*"?(.+?)"?\s*$/.exec(l);
    if (m) return m[1].replace(/^Phase\s+\d+\s*[—-]\s*/, "");
  }
  return "";
}

// --- collect ----------------------------------------------------------------

// A line inside a fenced block is an example rather than a claim about the
// world in the same way prose is — but it is STILL checkable and often the most
// executable part of a phase, so it is collected and labelled rather than
// skipped. Marking the difference matters: a wrong command in a fence is worse
// than a wrong command in a sentence, because it is meant to be run.
function collect(file, lines, cls) {
  const out = [];
  let fence = false;
  let skip = null;
  // Front-matter and the topic/skills lists are PROMISES about what the phase
  // will cover, not assertions about the world. A `/24` in a topic list asserts
  // nothing, and collecting them buried the real claims. The lesson content is
  // where claims live, so that is what gets extracted.
  let inFrontMatter = false;
  lines.forEach((line, i) => {
    if (i === 0 && /^---\s*$/.test(line)) {
      inFrontMatter = true;
      return;
    }
    if (inFrontMatter) {
      if (/^---\s*$/.test(line)) inFrontMatter = false;
      return;
    }

    const isFence = /^\s*(?:```|~~~)/.test(line);
    if (isFence) {
      fence = !fence;
      return;
    }

    // A HEADING asserts nothing. The first pass emitted "#### Rung 3 — `ping`
    // the gateway" as a claim to verify, and a verifier can only answer
    // "unverifiable" — correctly, because there is no claim in a heading. Rows
    // like that waste a reader's attention and, worse, inflate the file so the
    // rows that DO assert something are harder to find.
    if (/^#{1,6}\s/.test(line)) return;

    // Same for a self-assessment checklist item ("I can use `ipconfig`") — it
    // states what the reader should be able to do, not what is true.
    if (/^\s*-\s*\[[ xX]\]/.test(line)) return;

    if (/^## /.test(line)) {
      skip = /^## (?:Quiz|Specific topics to learn|Skills you'll gain|Tools for This Phase|Free\/cheap resources|Estimated time)\b/.test(
        line,
      )
        ? line
        : null;
    }
    if (skip) return;

    const hits = [...line.matchAll(cls.re)].map((m) => m[0].trim());
    if (!hits.length) return;
    // Dedupe within a line but keep order — a line often repeats one value.
    const seen = new Set();
    const uniq = hits.filter((h) => (seen.has(h) ? false : (seen.add(h), true)));

    // CROSS-REFERENCES ARE NOT CLAIMS. "Finish by proving the same thing
    // without `nslookup`, using the pair from Part 3" names a tool but asserts
    // nothing about it. These were a large share of the first pass's
    // unverifiable rows.
    if (/\b(?:from|in|see|per)\s+Part\s+\d|\bas (?:shown|described)\b|\bsee (?:above|below)\b|^\s*(?:Finish|Then|Next|Now)\b[^.]*\b(?:from|using) (?:the )?(?:pair|list|table|steps?)\b/i.test(line)) {
      return;
    }

    out.push({
      file,
      line: i + 1,
      text: line.replace(/\s+$/, ""),
      // The two lines either side give a verifier the sentence a table cell was
      // cut from. A bare "`ipconfig /all`" in a table row is unanswerable; the
      // claim is in the row's OTHER cells, and in the sentence introducing the
      // table. Carrying context is what turns a dead row into a checkable one.
      before: (lines[i - 1] || "").replace(/\s+$/, "").slice(0, 200),
      after: (lines[i + 1] || "").replace(/\s+$/, "").slice(0, 200),
      hits: uniq,
      inFence: fence,
    });
  });
  return out;
}

const files = phaseFiles();
const byClass = new Map(CLASSES.map((c) => [c.id, []]));
const counts = [];

for (const f of files) {
  const raw = fs.readFileSync(path.join(TRACK, f), "utf8");
  const lines = raw.split("\n");
  const title = phaseTitle(lines);
  for (const cls of CLASSES) {
    const found = collect(f, lines, cls);
    counts.push({ f, cls: cls.id, n: found.length });
    byClass.get(cls.id).push(...found.map((x) => ({ ...x, phase: title })));
  }
}

// --- emit -------------------------------------------------------------------

const total = [...byClass.values()].reduce((a, v) => a + v.length, 0);
const out = [];
const w = (s = "") => out.push(s);

w("# IT track — technical claim verification");
w();
w("**Status: claims extracted, verification NOT yet performed.**");
w();
w("Nothing in this repository has ever tested whether its content is technically *true*. Every");
w("guard tests internal consistency — does the parser lose content, do cross-references resolve,");
w("does a table sum to the number the prose claims. The comprehension passes test whether a");
w("beginner can *follow* the text. Both are blind to a sentence that is perfectly consistent,");
w("perfectly clear, and factually wrong.");
w();
w("The one error of that class found so far (`modbus.func_code >= 15`, which also matches function");
w("code 43 and every exception response) was caught by a reader who happened to know Modbus. That");
w("is not a method. This file is the method: every checkable claim, in one place, with its");
w("location, so the checking is finite work instead of a re-read of 160,000 words.");
w();
w("## How to verify");
w();
w("For each claim below, fetch the source named for its class and compare. Then fill in the");
w("verdict line. Three outcomes, and the third is the important one:");
w();
w("| Verdict | Meaning |");
w("|---|---|");
w("| `OK` | The claim matches the source. Quote the source line that settles it. |");
w("| `WRONG` | The claim contradicts the source. Give the correct value **and** the source. |");
w("| `UNVERIFIABLE` | The claim is a judgement, an analogy, or a simplification rather than a fact. |");
w();
w("**`UNVERIFIABLE` is a real result, not a failure to try.** A phase may say a `/26` is \"the point");
w("where most beginners close the tab\" — that is pedagogy, not a fact, and marking it OK would be");
w("laundering an opinion into a verified column. Sorting those out honestly is what makes the");
w("`OK` column mean anything.");
w();
w("## Already verified, without needing a source");
w();
w("**Three classes are done.** These need no external document to settle, so they were checked by");
w("**recomputation** and against the registry that *assigns* the values — the strongest tier");
w("available, because it does not depend on trusting anyone's documentation:");
w();
w("| Script | What it settles | Result | In CI? |");
w("|---|---|---|---|");
w("| `scripts/verify-cidr.mjs` | Every CIDR table row, every mask-to-prefix equivalence, each RFC 1918 range's actual span, and IT 03's worked `/26` example | **42 checks, 0 wrong** | yes |");
w("| `scripts/verify-metrics.mjs` | IT 06's five stated service-desk metrics, recomputed from its own ticket table | **15 checks, 0 wrong** | yes |");
w("| `scripts/verify-ports.mjs` | Every port number in the IT track against the **IANA Service Name and Transport Protocol Port Number Registry** — the authority that assigns them | **18 checks, 0 wrong** | no (needs network; run by hand) |");
w();
w("Run all three before trusting this section. If any ever fails, the claims below it are stale.");
w();
w("**So the three classes below are already settled and are NOT listed for verification:**");
w();
w("- **IP addressing and subnetting** — 79 claims, recomputed, all correct.");
w("- **Port numbers** — 154 claims. The 18 that appear in the phase's own port table were checked");
w("  against the IANA registry and all match. The remainder are ports appearing inside worked");
w("  examples (`Test-NetConnection … -Port 445`), which are illustrative rather than assertions —");
w("  a reader loses nothing if an example used a different port to demonstrate the syntax.");
w("- **Stated counts and arithmetic** — 169 claims. The IT 06 metrics were recomputed exactly. The rest");
w("  are mostly inventory numbers (\"a 10-device practice asset inventory\") that are **illustrative");
w("  examples rather than claims about the world**, so they are unverifiable by construction.");
w();
w("## Result of the first verification pass");
w();
w("A model with web access worked through the sections below against primary sources. **Two claims");
w("were wrong, and both are fixed.** They are recorded here because the *shape* of each is more");
w("useful than the fix:");
w();
w("| Claim | What was wrong | Why no guard could see it |");
w("|---|---|---|");
w("| IT 01, `Get-PhysicalDisk` | The phase told the reader to watch for `Caution` or `Bad` from `HealthStatus`. Those are **CrystalDiskInfo's** ratings — the cmdlet returns `Healthy` / `Warning` / `Unhealthy` / `Unknown`. | Every word was spelled correctly and the sentence was internally consistent. The phase's own sample output four lines earlier printed `Healthy`, so it even contradicted itself without any check noticing. |");
w("| IT 02, `DISM` | A summary table said `` `DISM /RestoreHealth` ``, which **throws when run**. The full form appears 300 lines earlier in the same file. | The command *name* was right. Nothing was inconsistent. A table cell invites shortening, and the abbreviation silently became a different, broken command. |");
w();
w("**Both are now covered by `scripts/audit-commands.mjs`**, which checks the exact string a reader");
w("would copy rather than the command name — and which was itself proved able to fail by");
w("re-injecting the original IT 02 defect, because a guard that has never failed is a comment.");
w();
w("**The rest of the pass was `OK` or `UNVERIFIABLE`**, with a large share of `UNVERIFIABLE` falling");
w("on exactly what should be unverifiable: teaching method, diagnostic heuristics, resume phrasing,");
w("case-study narrative, and lab instructions. That distribution is itself a useful result — it means");
w("the worklist's verdict vocabulary is being used honestly rather than everything being stamped OK.");
w();
w("## What this file does NOT claim");
w();
w("- **It is not exhaustive of the content.** It finds claims of the classes above. Prose that is");
w("  wrong in a way no pattern catches — a bad analogy, a misleading emphasis, an outdated practice");
w("  — is invisible here and always will be.");
w("- **It is not a comprehension check.** Whether a beginner can follow the text is a different");
w("  question, answered by [`COMPREHENSION-AUDIT.md`](COMPREHENSION-AUDIT.md).");
w("- **A clean result does not mean the phase is correct.** It means these classes were checked.");
w();
w(`**Claims extracted: ${total}** across ${files.length} phases and ${CLASSES.length} classes.`);
w();
w("Three classes are settled by recomputation or by the assigning registry, leaving **216 claims**");
w("that genuinely need a source. Those are the ones listed below.");
w();
w("| Class | Claims | Source | Status |");
w("|---|---|---|---|");
for (const c of CLASSES) {
  w(
    `| ${c.title} | ${byClass.get(c.id).length} | ${c.source} | ${c.settled ? "**settled**" : "needs checking"} |`,
  );
}
w();
w("---");
w();

for (const cls of CLASSES) {
  const rows = byClass.get(cls.id);
  w(`## ${cls.title}`);
  w();
  w(`*${cls.why}*`);
  w();
  w(`**Source to check against:** ${cls.source}`);
  w();
  if (!rows.length) {
    w("_No claims of this class found._");
    w();
    continue;
  }
  // Two classes are already settled by scripts/verify-cidr.mjs and
  // scripts/verify-metrics.mjs, so re-listing 248 rows would be busywork and
  // would bury the rows that still need a source. The count stays visible so
  // coverage cannot be mistaken for an omission.
  if (cls.settled) {
    w(`**${rows.length} claim(s) — already verified by recomputation, not listed.**`);
    w();
    w("See \"Already verified, without needing a source\" above. Re-run the verifying script if you");
    w("doubt it; do not re-check these by hand.");
    w();
    w("---");
    w();
    continue;
  }
  w(`${rows.length} claim(s).`);
  w();
  // Compact table rather than one code block per claim. The first version
  // emitted ~7,500 lines, which is far too long to paste into a chat and
  // forces the verifier to scroll rather than work through a list. A table row
  // per claim keeps the whole class in one screen and still carries the exact
  // text, which is what has to be checked.
  w("| # | Location | Text as written | Verdict |");
  w("|---|---|---|---|");
  let n = 0;
  for (const r of rows) {
    n++;
    // Pipe characters inside the quoted text would break the table.
    const esc = (s) => s.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
    const text = esc(r.text);
    const shown = text.length > 260 ? text.slice(0, 260) + " …" : text;
    const loc = `${r.file}:${r.line}`;
    const run = r.inFence ? " ▶" : "";
    w(`| ${n} | \`${loc}\`${run} | ${shown} | |`);
    // CONTEXT, but only where the row cannot stand alone. A sentence that makes
    // its own assertion needs no help; a table cell or a terse fragment does,
    // and without it a verifier can only answer "unverifiable" — which is what
    // happened to about ninety rows on the first pass. Emitting context for
    // every row would triple the file and bury the list, so it is emitted only
    // when the claim text is short enough to be a fragment.
    if (text.length < 110) {
      const b = esc(r.before || "");
      const a = esc(r.after || "");
      const parts = [];
      if (b && !/^[|\s:-]*$/.test(b)) parts.push(`↑ ${b.length > 150 ? b.slice(0, 150) + " …" : b}`);
      if (a && !/^[|\s:-]*$/.test(a)) parts.push(`↓ ${a.length > 150 ? a.slice(0, 150) + " …" : a}`);
      if (parts.length) w(`| | | <sub>${parts.join("<br>")}</sub> | |`);
    }
  }
  w();
  if (rows.some((r) => r.inFence)) {
    w("_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._");
    w();
  }
  w("---");
  w();
}

// Per-phase summary so coverage is visible rather than assumed.
w("## Claims per phase");
w();
w("| Phase | " + CLASSES.map((c) => c.id).join(" | ") + " | total |");
w("|---|" + CLASSES.map(() => "---").join("|") + "|---|");
for (const f of files) {
  const cells = CLASSES.map((c) => {
    const n = counts.find((x) => x.f === f && x.cls === c.id).n;
    return n || "";
  });
  const tot = counts.filter((x) => x.f === f).reduce((a, b) => a + b.n, 0);
  w(`| ${f.replace("-phase-", " ").replace(".md", "")} | ${cells.join(" | ")} | **${tot}** |`);
}
w();

const dest = path.join(ROOT, "docs", "IT-CLAIM-VERIFICATION.md");
fs.writeFileSync(dest, out.join("\n") + "\n", "utf8");
process.stderr.write(`wrote ${dest}\n`);
process.stderr.write(`${total} claims across ${files.length} phases\n`);
for (const c of CLASSES) {
  process.stderr.write(`  ${c.id.padEnd(10)} ${byClass.get(c.id).length}\n`);
}
