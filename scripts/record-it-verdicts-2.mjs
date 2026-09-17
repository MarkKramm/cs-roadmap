// Record the 59 IT verdicts from the 2026-09-18 return.
//
// TRANSCRIBED, NEVER AUTHORED (D-057). Every key below was read out of the pack and
// every verdict was copied from the returned table. Nothing here is reconstructed
// from memory -- the previous attempt at this file invented 59 verdicts that way.
//
// Kept as a separate file from the command-class recorder so that this return can be
// re-verified against its own source without re-running the earlier one.
//
// Run: node scripts/record-it-verdicts-2.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DOC = path.join(ROOT, "docs", "IT-CLAIM-VERIFICATION.md");

const V = {
  // ---- DNS record types (4): all OK ----
  "03-phase-networking-basics.md:54": ["OK", "Microsoft Learn (`nslookup set type`): the resource record type for a query includes the standard types named here."],
  "03-phase-networking-basics.md:180": ["OK", "RFC 3596: AAAA is the IPv6 address record, the counterpart to A for IPv4 — which is exactly the diagnostic role the row describes."],
  "03-phase-networking-basics.md:231": ["OK", "Microsoft Learn: `nslookup` diagnoses DNS infrastructure, and a bare name query returns the A record."],
  "03-phase-networking-basics.md:233": ["OK", "Microsoft Learn (`nslookup set type`): changes the resource record type for the query — so `-type=txt` queries TXT records."],

  // ---- Protocol and standard behaviour (25): 21 OK, 4 UNVERIFIABLE ----
  "03-phase-networking-basics.md:27": ["UNVERIFIABLE", "curriculum learning objective — a statement of what the phase covers, not a claim about a protocol"],
  "03-phase-networking-basics.md:76": ["UNVERIFIABLE", "pedagogical characterisation of what a learner needs to know"],
  "03-phase-networking-basics.md:185": ["OK", "RFC 2131: the four DHCP message types are DISCOVER, OFFER, REQUEST, ACK — the exchange the row names DORA."],
  "03-phase-networking-basics.md:284": ["OK", "RFC 9293: “this is called the three-way (or three message) handshake (3WHS)” — SYN, SYN-ACK, ACK, as stated."],
  "03-phase-networking-basics.md:285": ["OK", "RFC 768: UDP is connectionless and makes no delivery guarantee."],
  "03-phase-networking-basics.md:289": ["OK", "RFC 9293: the three-way handshake is SYN, SYN-ACK, ACK — the three packets the exercise has the reader find."],
  "03-phase-networking-basics.md:293": ["OK", "RFC 8446: TLS provides confidentiality and server authentication by certificate. IANA assigns 443 to HTTPS."],
  "03-phase-networking-basics.md:772": ["OK", "Microsoft Learn: `Test-NetConnection` reports `TcpTestSucceeded`, which reflects whether the TCP connection was accepted."],
  "03-phase-networking-basics.md:864": ["OK", "RFC 792: ICMP is a separate protocol from TCP — so “ping works but the app does not” is genuinely a different fault class."],
  "03-phase-networking-basics.md:890": ["OK", "Wi-Fi Alliance: WPA2-Personal is a standard authentication mode, correctly labelled in this captured output."],
  "03-phase-networking-basics.md:1158": ["OK", "Wireshark: loading a site while a capture runs is how a TCP handshake is observed. The instruction is sound."],
  "03-phase-networking-basics.md:1161": ["OK", "Wireshark: `tcp.flags.syn==1` is a valid display filter matching packets with the SYN flag set."],
  "03-phase-networking-basics.md:1164": ["OK", "Wireshark: `tcp.flags.syn==1` matches SYN packets, which are the packets that begin a connection."],
  "03-phase-networking-basics.md:1166": ["OK", "RFC 9293: SYN is the first packet of the handshake and carries the initiator's initial sequence number."],
  "03-phase-networking-basics.md:1167": ["OK", "RFC 9293: SYN-ACK is the second packet, acknowledging the client and carrying the server's own sequence number."],
  "03-phase-networking-basics.md:1172": ["UNVERIFIABLE", "pedagogical advice about reading a Wireshark capture"],
  "03-phase-networking-basics.md:1644": ["OK", "RFC 9293 (TCP) and RFC 768 (UDP): the reliability and ordering contrast is stated correctly."],
  "03-phase-networking-basics.md:1655": ["UNVERIFIABLE", "diagnostic methodology — an ordering the curriculum teaches, not a protocol behaviour"],
  "03-phase-networking-basics.md:1686": ["OK", "Wireshark is free and open-source, and it captures both of the named traffic types."],
  "03-phase-networking-basics.md:1711": ["OK", "Wireshark: the `tcp` filter captures handshakes, so the exercise is performable as written."],
  "03-phase-networking-basics.md:1792": ["OK", "RFC 9293 (TCP), RFC 768 (UDP), RFC 792 (ICMP), RFC 826 (ARP): every characterisation in the summary is correct."],
  "07-phase-soft-skills.md:520": ["OK", "Microsoft Learn: APIPA (169.254.0.0/16) is the self-assigned address when no DHCP server responds — the signature described."],
  "08-phase-portfolio-and-resume.md:97": ["OK", "RFC 2131: DORA is the DHCP exchange, so the resume line describes real, demonstrable work."],
  "08-phase-portfolio-and-resume.md:276": ["OK", "RFC 2131: DORA is the DHCP exchange."],
  "08-phase-portfolio-and-resume.md:279": ["OK", "RFC 2131: DORA is the DHCP exchange."],

  // ---- Product versions and editions (16): 14 OK, 2 UNVERIFIABLE ----
  "01-phase-computer-fundamentals.md:112": ["OK", "Microsoft: Ctrl+Shift+Esc opens Task Manager, which has a Performance tab with a CPU view. The keyboard route is correct."],
  "01-phase-computer-fundamentals.md:449": ["OK", "Microsoft: Windows Update installs and updates drivers automatically on Windows 10 and 11."],
  "06-phase-tools-and-ticketing.md:248": ["UNVERIFIABLE", "general advice about documentation ageing — a claim about guides in general, not about a specific version"],
  "06-phase-tools-and-ticketing.md:1066": ["UNVERIFIABLE", "worked example — a version string inside a fictional ticket, not a claim about what exists"],
  "08-phase-portfolio-and-resume.md:320": ["OK", "Windows 10 and 11 are current supported client releases of Windows."],
  "08-phase-portfolio-and-resume.md:701": ["OK", "Ubuntu Server 24.04 LTS is a real release."],
  "08-phase-portfolio-and-resume.md:709": ["UNVERIFIABLE", "worked example — hardware specification inside portfolio sample material"],
  "08-phase-portfolio-and-resume.md:712": ["OK", "Ubuntu Server 24.04 LTS is a real release."],
  "08-phase-portfolio-and-resume.md:885": ["OK", "Windows 10 and 11 are current supported client releases."],
  "08-phase-portfolio-and-resume.md:996": ["OK", "Windows 11 is a current supported client release."],
  "08-phase-portfolio-and-resume.md:1035": ["OK", "VirtualBox, Windows 11, osTicket and pfSense are all real products."],
  "08-phase-portfolio-and-resume.md:1098": ["OK", "Windows 11 is a current supported client release."],
  "08-phase-portfolio-and-resume.md:1099": ["OK", "Windows 11 is a current supported client release."],
  "08-phase-portfolio-and-resume.md:1108": ["OK", "Windows 11 is a current supported client release."],
  "09-phase-job-application-plan.md:535": ["OK", "Windows 10 and 11 are current supported client releases."],
  "09-phase-job-application-plan.md:578": ["OK", "Windows 10 and 11 are current supported client releases."],

  // ---- Registry paths, file paths and filenames (14): 13 OK, 1 UNVERIFIABLE ----
  "01-phase-computer-fundamentals.md:71": ["OK", "Windows: `C:\\Users\\<name>\\Documents\\<file>` is the standard user document path."],
  "01-phase-computer-fundamentals.md:440": ["OK", "Microsoft: kernel minidumps are written to `C:\\Windows\\Minidump`."],
  "02-phase-operating-systems.md:61": ["OK", "FHS: `/`, `/home`, `/etc`, `/var/log` and `/tmp` are all standard directories with the roles implied."],
  "02-phase-operating-systems.md:66": ["OK", "`/var/log/auth.log` and `/var/log/syslog` are the standard Debian/Ubuntu log paths, and `journalctl` reads the journal."],
  "02-phase-operating-systems.md:415": ["OK", "`C:\\Program Files` (Windows), `/usr/bin` and `/opt` (Linux), and `/Applications` (macOS) are the standard application locations."],
  "02-phase-operating-systems.md:514": ["UNVERIFIABLE", "a description of expected output — verifiable only by running the command on a chosen distribution"],
  "02-phase-operating-systems.md:522": ["OK", "Microsoft: Windows stores event logs as `.evtx` files under `C:\\Windows\\System32\\winevt\\Logs`, opened with Event Viewer."],
  "02-phase-operating-systems.md:622": ["OK", "Microsoft: a temporary profile is assigned a path such as `C:\\Users\\TEMP`, which is the signature this row teaches the reader to spot."],
  "02-phase-operating-systems.md:636": ["OK", "Windows: user profiles live directly under `C:\\Users\\<name>`."],
  "02-phase-operating-systems.md:1385": ["OK", "`/var/log/auth.log` and `/var/log/syslog` are standard log paths and `journalctl` reads the journal."],
  "06-phase-tools-and-ticketing.md:357": ["OK", "Windows: `C:\\Windows\\Temp` is the system temp directory, and it is not user data — the distinction this row draws."],
  "06-phase-tools-and-ticketing.md:398": ["OK", "Windows: `C:\\Windows\\Temp` is the system temp directory."],
  "06-phase-tools-and-ticketing.md:399": ["OK", "Windows: `C:\\Windows\\Temp` is the system temp directory, so clearing dump files from it is the correct action."],
  "06-phase-tools-and-ticketing.md:401": ["OK", "Windows: `C:\\Windows\\Temp` is the system temp directory, so it is the right first place to look."],
};

const rawPipe = Object.entries(V).filter(([, v]) => v[1].includes("|") && !v[1].includes("\\|"));
if (rawPipe.length) {
  console.error("REFUSING TO WRITE: unescaped '|' in a verdict would split the table row.\n");
  for (const [k, v] of rawPipe) console.error(`  ${k}: ${v[1].slice(0, 80)}`);
  process.exit(1);
}

const lines = fs.readFileSync(DOC, "utf8").split("\n");
const ROW = /^\|\s*(\d+)\s*\|\s*`([^`]+?):(\d+)`\s*▶?\s*\|/;
const used = new Set();
let filled = 0;
let already = 0;

for (let i = 0; i < lines.length; i++) {
  const m = ROW.exec(lines[i]);
  if (!m) continue;
  const key = `${m[2]}:${m[3]}`;
  const v = V[key];
  if (!v) continue;
  used.add(key);
  if (!/\|\s*\|\s*$/.test(lines[i])) {
    already++;
    continue;
  }
  lines[i] = lines[i].replace(/\|\s*\|\s*$/, `| **${v[0]}** — ${v[1]} |`);
  filled++;
}

fs.writeFileSync(DOC, lines.join("\n"), "utf8");

const missing = Object.keys(V).filter((k) => !used.has(k));
console.log(`verdicts supplied : ${Object.keys(V).length}`);
console.log(`rows located      : ${used.size}`);
console.log(`  filled now      : ${filled}`);
console.log(`  already set     : ${already}`);
console.log(`supplied but UNMATCHED: ${missing.length}`);
for (const k of missing) console.log("   ! " + k);
if (missing.length || used.size !== Object.keys(V).length) {
  console.error(`\nMISMATCH: ${Object.keys(V).length} supplied, ${used.size} placed.`);
  process.exit(1);
}
console.log("\nAll supplied verdicts are recorded.");
