// Measure how many machine-checkable claims the CYBER track carries, using the
// same pattern classes as the IT extractor.
//
// WHY MEASURE BEFORE BUILDING
// Generalising extract-claims.mjs to take a track argument is real work. Whether
// it is worth doing depends on the answer to one question: does the cyber track
// carry checkable claims at all? It is 15 phases of technique, judgement, and
// procedure, and my prior was that it carries far fewer than IT. This replaces
// that guess with a number.
//
// This script does NOT emit a worklist. It counts.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TRACKS = {
  it: "career-roadmaps/it-roadmap",
  cybersec: "career-roadmaps/cybersec-roadmap",
  advance: "career-roadmaps/advance-roadmap",
};

// Same class patterns as the IT extractor, minus the settled ones (cidr, port)
// which are recomputed by scripts rather than verified by a model.
const CLASSES = {
  command:
    /`(?:ipconfig|ping|tracert|nslookup|netsh|Test-NetConnection|Get-\w+|Set-\w+|New-\w+|Resolve-DnsName|sfc|dism|chkdsk|systemctl|chmod|chown|grep|awk|sed|curl|ssh|netstat|nltest|gpresult|gpupdate|wmic|robocopy|schtasks|tasklist|taskkill|net user|net share|diskpart|bcdedit|nmap|hydra|john|hashcat|sqlmap|burp|gobuster|ffuf|nikto|wireshark|tcpdump|volatility|strings|xxd|base64|openssl|gpg|iptables|ufw|auditd|sysmon|zeek|suricata|splunk|yara|osquery|bloodhound|mimikatz|impacket|crackmapexec|responder|ettercap|aircrack|reaver|metasploit|msfconsole)[^`]*`/g,
  protocol:
    /\b(?:SYN|SYN-ACK|DORA|802\.1X|WPA2|WPA3|OAuth|SAML|TLS|SSL|AES|RSA|SHA-\d|MD5|Kerberos|NTLM|LDAP|SMB|RDP|SSH|HTTP|HTTPS|DNS|DHCP|ARP|ICMP|TCP|UDP|IPsec|WPA)\b[^.\n]{0,50}\b(?:layer|port|handshake|three-way|reliable|connectionless|encrypt|plaintext|broadcast|multicast|unicast|TTL|header|flag|code \d|status|version|strength|bits?|hash)\b/gi,
  // A version claim needs an actual VERSION: a number, optionally dotted.
  // The first attempt allowed `[A-Z]{2,}` as an alternative and matched
  // "NIST CSF", "OWASP Top", "Burp Suite", "Splunk free" -- any capitalised
  // word after a product name. That produced 143 cyber "version claims" of
  // which almost none was one. A measurement you have to caveat is not a
  // measurement, so the pattern now requires digits.
  version:
    /\b(?:Windows|Ubuntu|Kali|Debian|PowerShell|Python|macOS|iOS|Android|Windows Server|CentOS|RHEL|Fedora|Nmap|Wireshark|Burp Suite|Metasploit|Splunk|Sysmon|Zeek|Suricata)\s+\d+(?:\.\d+)*\b|\b(?:NIST SP|ISO\/IEC|PCI DSS|OWASP Top 10)\s*\d+(?:\.\d+)?\b/g,
  registry:
    /`[A-Za-z]:\\[^`]+`|`\/(?:etc|var|usr|opt|home|root|tmp)\/[^`]+`|\bHKEY_[A-Z_]+\\[^\s]+/g,
  record: /\b(?:AAAA|CNAME|MX|TXT|NS|SOA|PTR|SRV|CAA)\s+records?\b|\brecord\s+types?\b(?=[^.\n]*\b(?:DNS|nslookup|resolver|zone|nameserver|domain)\b)/gi,
  number: /\b\d+(?:\.\d+)?\s*(?:%|GB|MB|KB|TB|ms|seconds?|minutes?|hours?|days?|weeks?|months?|years?)\b/gi,
  cve: /\bCVE-\d{4}-\d{4,7}\b|\bCVSS\s*(?:score\s*)?\d+(?:\.\d+)?\b|\bATT&CK\s*T\d{4}(?:\.\d{3})?\b/g,
};

function phaseFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d\d-.*\.md$/.test(f))
    .sort();
}

const results = {};
for (const [track, rel] of Object.entries(TRACKS)) {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) continue;
  const files = phaseFiles(dir);
  let words = 0;
  const byClass = {};
  for (const k of Object.keys(CLASSES)) byClass[k] = 0;

  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    words += raw.split(/\s+/).filter(Boolean).length;
    const lines = raw.split("\n");
    let inFence = false;
    let skip = false;
    for (const line of lines) {
      if (/^\s*(?:```|~~~)/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (/^#{1,6}\s/.test(line)) continue; // headings assert nothing
      if (/^\s*-\s*\[[ xX]\]/.test(line)) continue; // checklist items
      if (/^## /.test(line)) {
        skip = /^## (?:Quiz|Specific topics to learn|Skills you'll gain|Tools for This Phase|Free\/cheap resources|Estimated time)\b/.test(line);
      }
      if (skip) continue;
      for (const [k, re] of Object.entries(CLASSES)) {
        re.lastIndex = 0;
        const m = line.match(re);
        if (m) byClass[k] += m.length;
      }
    }
  }
  results[track] = { phases: files.length, words, byClass };
}

console.log("");
console.log("Claim density by track (same patterns, headings and checklists excluded)");
console.log("=".repeat(78));
console.log(
  "track".padEnd(12) +
    "phases".padStart(7) +
    "words".padStart(9) +
    Object.keys(CLASSES).map((k) => k.padStart(10)).join("") +
    "TOTAL".padStart(9),
);
console.log("-".repeat(78));
for (const [track, r] of Object.entries(results)) {
  const total = Object.values(r.byClass).reduce((a, b) => a + b, 0);
  console.log(
    track.padEnd(12) +
      String(r.phases).padStart(7) +
      String(r.words).padStart(9) +
      Object.values(r.byClass).map((v) => String(v).padStart(10)).join("") +
      String(total).padStart(9),
  );
}
console.log("");

// Per-class reading, so the number can be interpreted rather than just quoted.
const it = results.it;
const cyber = results.cybersec;
if (it && cyber) {
  console.log("Per 1,000 words, so track size does not decide the comparison:");
  console.log("-".repeat(78));
  const itRate = Object.values(it.byClass).reduce((a, b) => a + b, 0) / (it.words / 1000);
  const cyRate = Object.values(cyber.byClass).reduce((a, b) => a + b, 0) / (cyber.words / 1000);
  console.log(`  it        ${itRate.toFixed(1)} checkable claim(s) per 1,000 words`);
  console.log(`  cybersec  ${cyRate.toFixed(1)} checkable claim(s) per 1,000 words`);
  console.log("");
  console.log("Classes where cyber exceeds IT (the checkable part of the cyber track):");
  for (const k of Object.keys(CLASSES)) {
    if (cyber.byClass[k] > it.byClass[k]) {
      console.log(`  ${k.padEnd(10)} cyber ${cyber.byClass[k]}  vs  it ${it.byClass[k]}`);
    }
  }
}
console.log("");
