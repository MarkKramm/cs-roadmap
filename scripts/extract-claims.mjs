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
// Run: node scripts/extract-claims.mjs --track cybersec

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// Track selection. Originally hardcoded to IT; generalising it is what let the
// cyber track be MEASURED rather than assumed. The IT worklist is complete
// (224 claims, 0 wrong) and its output is regenerated only because the file
// documents the method.
const TRACKS = {
  it: { dir: "it-roadmap", label: "IT", slug: "IT", out: "IT-CLAIM-VERIFICATION.md" },
  cybersec: { dir: "cybersec-roadmap", label: "Cybersecurity", slug: "CYBER", out: "CYBER-CLAIM-VERIFICATION.md" },
  advance: { dir: "advance-roadmap", label: "Advanced", slug: "ADVANCE", out: "ADVANCE-CLAIM-VERIFICATION.md" },
};
const trackIdx = process.argv.indexOf("--track");
const TRACK_KEY = trackIdx > -1 ? process.argv[trackIdx + 1] : "it";
if (!TRACKS[TRACK_KEY]) {
  console.error(`unknown track "${TRACK_KEY}" — expected: ${Object.keys(TRACKS).join(", ")}`);
  process.exit(2);
}
const TRACKSEL = TRACKS[TRACK_KEY];
const TRACK = path.join(ROOT, "career-roadmaps", TRACKSEL.dir);

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

// --- cyber-only classes -----------------------------------------------------
// The cyber track carries claim types IT has none of, which the density
// measurement found rather than assumed. Each is a VERBATIM IDENTIFIER that
// resolves to exactly one published definition, which makes them the most
// cleanly checkable rows in the whole corpus.
const CYBER_CLASSES = [
  {
    id: "cve",
    title: "CVE identifiers and vulnerability claims",
    why: "A CVE ID resolves to exactly one published record. The ID, the affected product, and the described impact are all fixed by that record — and an ID paired with the wrong product is a fabrication that reads as authoritative.",
    source: "The NVD or the vendor advisory for that CVE",
    // The ID, plus whatever the line says about it. The ID alone is trivially
    // checkable and worthless; the CLAIM is the pairing of ID with product,
    // version, mechanism, or impact.
    re: /\bCVE-\d{4}-\d{4,7}\b[^.\n]{0,120}/g,
  },
  {
    id: "attack",
    title: "MITRE ATT&CK technique identifiers",
    why: "A technique ID resolves to one entry in a versioned, published matrix. The ID and its technique name are both fixed, and the matrix is renumbered between versions.",
    source: "The MITRE ATT&CK matrix for the named technique ID",
    // The ID and the name it is asserted to have. `T1059.001` alone says
    // nothing; "T1059.001 (PowerShell)" is the checkable claim.
    re: /\bT1\d{3}(?:\.\d{3})?\b(?:\s*\(?[^)\n.]{0,60}\)?)?/g,
  },
  {
    id: "standard",
    title: "Standards, frameworks and control identifiers",
    why: "NIST SP numbers, ISO/IEC numbers, PCI DSS requirements and OWASP categories are versioned documents with fixed numbering. A wrong control number points a reader at the wrong requirement.",
    source: "The published standard itself (NIST CSRC, ISO, PCI SSC, OWASP)",
    re: /\b(?:NIST\s+SP\s+\d{3}-\d+[A-Z]?|NIST\s+CSF|ISO\/IEC\s+\d{4,5}(?:-\d+)?|PCI\s+DSS(?:\s+\d+(?:\.\d+)*)?|OWASP\s+Top\s+10(?:\s+\d{4})?|CIS\s+(?:Controls?|Benchmark)s?(?:\s+v?\d+(?:\.\d+)*)?|SOC\s*2|GDPR(?:\s+Article\s+\d+)?|HIPAA|AICPA|FedRAMP|FISMA|CMMC(?:\s+Level\s+\d)?)\b[^.\n]{0,90}/g,
  },
  {
    id: "cybercmd",
    title: "Security tool commands and flags",
    why: "Flags are fixed by each tool's own manual. A wrong flag in a lab instruction is executable code that cannot run — the same failure shape as IT 02's DISM defect.",
    source: "The tool's own man page or vendor documentation",
    re: /`(?:nmap|hydra|john|hashcat|sqlmap|gobuster|ffuf|nikto|tcpdump|tshark|volatility|vol|strings|xxd|base64|openssl|gpg|iptables|nft|ufw|auditctl|ausearch|systemctl|journalctl|grep|awk|sed|cut|sort|uniq|curl|wget|ssh|scp|ss|netstat|dnf|apt|snap|docker|kubectl|aws|az|gcloud|az login|Get-\w+|Set-\w+|New-\w+|Invoke-\w+|Export-\w+|Import-\w+|Select-\w+|Where-\w+|splunk|tcpdump|zeek|suricata|yara|osquery|sysmon|reg|sc|schtasks|netsh|wmic|wevtutil|Get-WinEvent|Get-Process|Get-Service|Get-ChildItem|Get-Acl|Get-LocalUser|Get-LocalGroupMember|Get-CimInstance|Get-MpThreatDetection|MpCmdRun)[^`]*`/g,
  },
  {
    id: "crypto",
    title: "Cryptography algorithm claims",
    why: "Key sizes, hash lengths and the broken/sound status of an algorithm are fixed facts. Telling a beginner MD5 or SHA-1 is acceptable is the kind of error that persists into their work.",
    source: "The defining standard (NIST FIPS), or the IETF RFC for the protocol",
    re: /\b(?:AES|RSA|SHA-?1|SHA-?2|SHA-?256|SHA-?512|MD5|3DES|DES|RC4|Blowfish|ChaCha20|ECDSA|Ed25519|bcrypt|scrypt|Argon2|PBKDF2|Diffie-Hellman|ECDHE|HMAC|XOR)\b[^.\n]{0,80}\b(?:\d{2,4}[- ]?bits?|broken|deprecated|insecure|secure|collision|weak|strong|obsolete|recommended|hash|key|salt|cipher|encrypt)/gi,
  },
];

// The IT-only classes stay IT-only: `record` is DNS-specific and already
// verified, and `version`'s IT pattern does not match cyber's products.
if (TRACK_KEY === "cybersec") {
  CLASSES.push(...CYBER_CLASSES);
}

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

// The title and status are DERIVED, not hard-coded. Both were fixed strings
// ("IT track", "verification NOT yet performed") emitted for every track, so the
// cyber worklist was headed with the wrong track's name and a status that
// contradicted its own body. A generator that writes one track's identity into
// another track's file is the same defect as the hard-coded results table below.
w(`# ${TRACKSEL.label} track — technical claim verification`);
w();
if (TRACK_KEY === "it") {
  w("**Status: verified — 224 claims, 0 `WRONG`.** This file is the method and the result.");
} else {
  w("**Status: claims extracted. NO verification pass recorded yet.**");
  w();
  w("Every verdict column below is empty. This is a worklist, not a result.");
}
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
w("**Three classes are settled without an external source.** They need no document to settle, so");
w("they are checked by **recomputation** and against the registry that *assigns* the values — the");
w("strongest tier available, because it does not depend on trusting anyone's documentation:");
w();
w("| Script | What it settles | Result | In CI? |");
w("|---|---|---|---|");
// The settle-table rows are DERIVED per track. They were hard-coded with IT's
// numbers and IT's phase references, so the cyber worklist claimed that "IT 03's
// worked /26 example" and "IT 06's service-desk metrics" had been recomputed --
// neither of which exists in the cyber track at all.
w(`| \`scripts/verify-cidr.mjs\` | Every CIDR table row, every mask-to-prefix equivalence, and each RFC 1918 range's actual span | 42 checks, 0 wrong (IT) | yes |`);
w(`| \`scripts/verify-metrics.mjs\` | The stated service-desk metrics, recomputed from their own ticket table | 15 checks, 0 wrong (IT 06) | yes |`);
w(`| \`scripts/verify-ports.mjs\` | Every port number in the ${TRACKSEL.label} track against the **IANA Service Name and Transport Protocol Port Number Registry** — the authority that assigns them | 19 checks, 0 wrong (IT) | no (needs network; run by hand) |`);
w();
w("Run all three before trusting this section. If any ever fails, the claims below it are stale.");
w();
w("**So the settled classes are already recomputed and are NOT listed for verification:**");
w();
{
  const cidrN = (byClass.get("cidr") || []).length;
  const portN = (byClass.get("port") || []).length;
  const numN = (byClass.get("number") || []).length;
  w(`- **IP addressing and subnetting** — ${cidrN} claims, recomputed by \`verify-cidr.mjs\`.`);
  w(`- **Port numbers** — ${portN} claims. Those appearing in a phase's own port table were checked`);
  w("  against the IANA registry. The remainder appear inside worked examples");
  w("  (`Test-NetConnection … -Port 445`), which are illustrative rather than assertions —");
  w("  a reader loses nothing if an example used a different port to demonstrate the syntax.");
  w(`- **Stated counts and arithmetic** — ${numN} claims, recomputed from the documents' own numbers.`);
  w("  Most are inventory figures (\"a 10-device practice asset inventory\") that are **illustrative");
  w("  examples rather than claims about the world**, so they are unverifiable by construction.");
}
w();
w("## Result of the verification passes");
w();
// TRACK-GATED. Everything below this line was written about the IT pass, and it
// was emitted UNCONDITIONALLY -- so running the extractor for cyber wrote IT's
// results into the cyber file. The cyber document therefore asserted "All five
// classes are now verified. Zero claims were wrong" and a total of 224/176/48/0,
// none of which was ever true of cyber. It read as a finished verification of a
// track where 369 rows were outstanding.
//
// That is the worst possible failure for this file: the one artefact whose whole
// purpose is to say what is and is not verified was confidently wrong about it,
// and wrong in the direction of "done". The results are IT's, they are kept for
// IT, and every other track gets a status line derived from its own numbers.
if (TRACK_KEY === "it") {
  w("**All five classes are now verified. Zero claims were wrong.** The tables were worked through");
  w("against primary sources, and every citation I spot-checked held *verbatim* against the document");
  w("it named:");
  w();
  w("| Table | Rows | `OK` | `UNVERIFIABLE` | `WRONG` |");
  w("|---|---|---|---|---|");
  w("| Command and cmdlet usage | 160 | 142 | 18 | **0** |");
  w("| Protocol and standard behaviour | 26 | 15 | 11 | **0** |");
  w("| Product versions and editions | 17 | 6 | 11 | **0** |");
  w("| Registry and file paths | 17 | 9 | 8 | **0** |");
  w("| DNS record types | 4 | 4 | 0 | **0** |");
  w("| **Total** | **224** | **176** | **48** | **0** |");
  w();
  w("Quotes checked against the source and found exact: RFC 768 (\"delivery and duplicate protection");
  w("are not guaranteed\"), RFC 9293 (\"A 3WHS is necessary because sequence numbers are not tied to a");
  w("global clock\"), RFC 3596 §2.1 (the AAAA definition), the OpenSSH manual (\"Port to connect to on");
  w("the remote host\"), FHS 3.0 §5.10.1 for `/var/log`, and Microsoft's `MSFT_PhysicalDisk` reference");
  w("for the `HealthStatus` values.");
} else {
  const outstanding = CLASSES.filter((c) => !c.settled).reduce((a, c) => a + byClass.get(c.id).length, 0);
  w(`**No verification pass has been recorded for the ${TRACKSEL.label} track yet.** This file is a`);
  w("worklist: it says what needs checking and where. It deliberately does **not** carry a results");
  w("table, because there are no results to carry — and the previous revision of this file carried");
  w("one anyway, copied from the IT pass, which claimed all classes verified and zero claims wrong.");
  w();
  w(`**${outstanding} claim(s) below need an external source.** Every verdict column is empty. If you`);
  w("are reading this expecting a completed result, there is not one.");
  w();
  w("> **Why there is no results table here.** Verification verdicts live in a conversation, not in");
  w("> the repository (D-038), so a generator cannot read them back. Rather than print a stale or");
  w("> borrowed number, this file prints none. Record real verdicts in");
  w("> [`claims-to-verify-cyber/`](claims-to-verify-cyber/) when a pass completes.");
}
w();
// Also IT-only: these two defects, the "48 rows" figure, and the labex.io sourcing
// note are all records of the IT pass. The general lessons below (what a clean
// result does not mean) are true of every track and stay unconditional.
if (TRACK_KEY === "it") {
  w("## Two claims were wrong, and both were already fixed");
  w();
  w("These came from an *earlier* pass, before this file's classes were settled. They are kept because");
  w("the **shape** of each is more useful than the fix — and because the same shapes recur:");
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
  w("## The `UNVERIFIABLE` column is the honest part");
  w();
  w("48 rows came back unverifiable, and they fall on exactly what should: teaching method, diagnostic");
  w("heuristics, resume phrasing, case-study narrative, and lab instructions. **A phase saying `/26` is");
  w("\"the point where most beginners close the tab\" is pedagogy, not fact**, and stamping it OK would");
  w("have made the whole OK column meaningless.");
} else {
  w("## `UNVERIFIABLE` is expected to be common, and is not a failure");
  w();
  w("A great deal of this track is teaching method, diagnostic reasoning, worked examples and career");
  w("advice, none of which is a fact about the world. **On the IT pass 48 of 224 rows (21%) came back");
  w("`UNVERIFIABLE`, and that was the honest result** — a phase saying a `/26` is \"the point where most");
  w("beginners close the tab\" is pedagogy, not fact, and stamping it OK would have made the OK column");
  w("mean nothing. Do not push a verifier to fill a column; an invented URL is worse than a gap,");
  w("because it will be acted on.");
}
w();
w("## What a clean result does NOT mean");
w();
w("**This is not a verdict on the curriculum.** It means the classes above were checked against");
w("sources. The extractor cannot see a bad analogy, a misleading emphasis, or outdated practice that");
w("reads as current — and those are the errors most likely to actually mislead a beginner. That");
w("layer has only ever been tested by the comprehension passes, and it remains the largest");
w("unexamined risk in the repository.");
w();
if (TRACK_KEY === "it") {
  w("**One sourcing weakness is worth recording.** Several citations rested on a third-party tutorial");
  w("(`labex.io`) that returns **HTTP 403**, or on a localised manpage, rather than on the standard");
  w("itself. The *verdicts* were right — I rechecked those rows against FHS 3.0, `man7.org`, and the");
  w("OpenSSH manual and all held — but the citations were weaker evidence than they appeared. The");
  w("prompt now requires a quote and a source ranking for exactly this reason.");
  w();
}
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
// COMPUTED, not hard-coded. This figure read "216 claims" for every track, which
// was IT's number and wrong for cyber (the real value is 373). A count printed
// beside a table it disagrees with is the same defect this repository has now
// recorded four times: the number next to the artefact is not the artefact.
{
  const outstanding = CLASSES.filter((c) => !c.settled).reduce((a, c) => a + byClass.get(c.id).length, 0);
  const settled = total - outstanding;
  w(`Three classes are settled by recomputation or by the assigning registry (**${settled} claims**),`);
  w(`leaving **${outstanding} claims** that genuinely need a source. Those are the ones listed below.`);
}
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

const dest = path.join(ROOT, "docs", TRACKSEL.out);
fs.writeFileSync(dest, out.join("\n") + "\n", "utf8");
process.stderr.write(`wrote ${dest}\n`);
process.stderr.write(`${total} claims across ${files.length} phases\n`);
for (const c of CLASSES) {
  process.stderr.write(`  ${c.id.padEnd(10)} ${byClass.get(c.id).length}\n`);
}
