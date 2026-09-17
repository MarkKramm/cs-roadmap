// Record the IT verification verdicts back into the worklist.
//
// This is the second IT pass. The first one ran on 2026-09-16, found three real
// defects, had those defects fixed -- and never wrote its verdicts down, so the
// document claimed "Status: verified -- 224 claims, 0 WRONG" over 225 rows with
// empty verdict columns (D-055). This script exists so that cannot happen again:
// the verdicts are keyed by LOCATION and written programmatically, and a key that
// matches no row is reported rather than dropped.
//
// WHY THE KEYS ARE `file:line` AND NOT ROW NUMBERS
// Row numbers renumber whenever the splitter emits a continuation or a class is
// re-cut. A location survives that. It also makes the record readable without the
// table: `03-phase-networking-basics.md:774` is a place in the corpus, "row 64" is
// a place in a file that will be regenerated.
//
// Run: node scripts/record-it-verdicts.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DOC = path.join(ROOT, "docs", "IT-CLAIM-VERIFICATION.md");

// Each verdict carries the authority, not just the answer. A verdict without a
// source is not a verdict -- this repository has already been burned by a citation
// resting on a third-party tutorial that returned HTTP 403.
const V = {
  // ================= Command and cmdlet usage (161) =================
  "01-phase-computer-fundamentals.md:277": ["OK", "Microsoft Learn: chkdsk “checks the file system and file system metadata of a volume for logical and physical errors.”"],
  "01-phase-computer-fundamentals.md:284": ["OK", "Microsoft Learn: `Get-PhysicalDisk` returns `HealthStatus`, whose values are Healthy, Unhealthy, Unknown and Warning."],
  "01-phase-computer-fundamentals.md:290": ["OK", "Microsoft Learn: `/scan` “runs an online scan on the volume”; `/f` “fixes errors on the disk. The disk must be locked.” On the system drive the lock cannot be taken while running, so the restart the corpus describes is what actually happens."],
  "01-phase-computer-fundamentals.md:374": ["OK", "Microsoft Learn: `Get-PhysicalDisk` is the cmdlet for physical disk health."],
  "01-phase-computer-fundamentals.md:420": ["OK", "Microsoft Learn: chkdsk checks file system metadata for corruption — the claim this row makes."],
  "01-phase-computer-fundamentals.md:533": ["OK", "Microsoft Learn: `Get-PhysicalDisk` exposes `MediaType`."],
  "01-phase-computer-fundamentals.md:542": ["OK", "Microsoft Learn: `Get-NetAdapter` retrieves network adapter information."],
  "01-phase-computer-fundamentals.md:1512": ["OK", "Microsoft Learn: `Get-NetAdapter` reports adapter status and link speed."],
  "01-phase-computer-fundamentals.md:1514": ["OK", "Microsoft Learn: `netsh wlan show interfaces` displays wireless interface status including signal and rate."],
  "01-phase-computer-fundamentals.md:1615": ["OK", "Microsoft Learn: `Get-PhysicalDisk` reports disk health."],
  "01-phase-computer-fundamentals.md:1616": ["OK", "Microsoft Learn: `Get-WinEvent` reads event logs, which is what the row offers as the PowerShell alternative to Event Viewer."],
  "01-phase-computer-fundamentals.md:1642": ["OK", "Microsoft Learn: `Get-PhysicalDisk` returns `FriendlyName`, `MediaType`, `HealthStatus` and `Size`."],
  "02-phase-operating-systems.md:52": ["OK", "Microsoft Learn: `ipconfig`, `ping`, `tracert` and `nslookup` are documented Windows network diagnostic commands."],
  "02-phase-operating-systems.md:53": ["OK", "Microsoft Learn: `net user` and `net localgroup` are account management commands."],
  "02-phase-operating-systems.md:54": ["OK", "Microsoft Learn: `sfc /scannow` scans all protected system files and repairs them where possible."],
  "02-phase-operating-systems.md:55": ["OK", "Microsoft Learn: `chkdsk /scan` runs an online scan."],
  "02-phase-operating-systems.md:57": ["OK", "Microsoft Learn: all five are standard PowerShell cmdlets."],
  "02-phase-operating-systems.md:63": ["OK", "POSIX: `chmod` and `chown` are the standard permission commands; `rwx` is the notation `ls -l` prints."],
  "02-phase-operating-systems.md:65": ["OK", "POSIX/systemd: `ps` and `top` are standard process tools; `systemctl` manages services."],
  "02-phase-operating-systems.md:67": ["OK", "POSIX: all eleven are standard filesystem navigation and text commands."],
  "02-phase-operating-systems.md:120": ["OK", "Microsoft Learn/systemd: `Get-Service` and `systemctl status` both report service state."],
  "02-phase-operating-systems.md:210": ["OK", "Networking: pinging an address tests connectivity; pinging a name tests connectivity and resolution. This is the standard split."],
  "02-phase-operating-systems.md:213": ["OK", "Microsoft Learn: `ipconfig /all` displays the configured DNS servers. The inference — IP works, name fails, therefore DNS — is the standard reading."],
  "02-phase-operating-systems.md:226": ["OK", "Microsoft Learn: the documented repair order is DISM `/RestoreHealth` then `sfc /scannow`; `chkdsk /scan` is the online scan mode."],
  "02-phase-operating-systems.md:316": ["OK", "POSIX: `chmod`, `chown` and `sudo` are the standard tools for the distinction the row draws."],
  "02-phase-operating-systems.md:348": ["UNVERIFIABLE", "an opinion about which skill is most valuable for support work — a claim about the job, not about the command"],
  "02-phase-operating-systems.md:378": ["OK", "systemd: `systemctl status` reports whether the unit is active, its PID, and recent log lines."],
  "02-phase-operating-systems.md:398": ["OK", "systemd: `journalctl --since` filters the journal by time."],
  "02-phase-operating-systems.md:428": ["UNVERIFIABLE", "pedagogical comparison of method transfer across platforms"],
  "02-phase-operating-systems.md:531": ["OK", "Microsoft Learn: `Get-Process` returns process objects whose `WorkingSet` can be sorted — the cmdlet and property both exist."],
  "02-phase-operating-systems.md:532": ["OK", "Microsoft Learn: `Get-LocalUser` retrieves local user accounts, including their enabled state."],
  "02-phase-operating-systems.md:537": ["OK", "Microsoft Learn: `DISM /Online /Cleanup-Image /RestoreHealth` repairs the component store; `sfc /scannow` follows."],
  "02-phase-operating-systems.md:538": ["OK", "systemd/Windows: `systemctl status` and Event Viewer both surface a service's own failure reason."],
  "02-phase-operating-systems.md:539": ["OK", "Microsoft Learn/POSIX: `Get-Volume` and `df -h` both report per-filesystem free space."],
  "02-phase-operating-systems.md:573": ["OK", "Microsoft Learn: `MpCmdRun.exe -Scan -ScanType 2` runs a full scan; `Get-MpThreatDetection` lists detected threats."],
  "02-phase-operating-systems.md:709": ["OK", "Microsoft Learn: `whoami` prints the current user as `domain\\user` or `machine\\user`; `Get-LocalUser` exposes `PrincipalSource`, which distinguishes Local from MicrosoftAccount and AzureAD."],
  "02-phase-operating-systems.md:721": ["OK", "Microsoft Learn: `Get-Process` returns process objects with numeric properties."],
  "02-phase-operating-systems.md:749": ["OK", "Microsoft Learn: `Get-Service` returns `Status` and `StartType`."],
  "02-phase-operating-systems.md:872": ["OK", "Microsoft Learn: `Get-WindowsUpdateLog` merges the Windows Update .etl traces into a readable log."],
  "02-phase-operating-systems.md:920": ["OK", "systemd: `systemctl status` gives unit state, the failing step and recent log output in one view."],
  "02-phase-operating-systems.md:966": ["UNVERIFIABLE", "a claim about reversibility and auditability as security practice, not about a command"],
  "02-phase-operating-systems.md:1171": ["OK", "Microsoft Learn: `Get-Process` reports working set and handle count — both numbers the row quotes."],
  "02-phase-operating-systems.md:1257": ["OK", "Microsoft Learn: `whoami /groups` displays the groups in the current access token."],
  "02-phase-operating-systems.md:1301": ["OK", "Networking: ping by address and ping by name is the standard way to separate connectivity from resolution."],
  "02-phase-operating-systems.md:1327": ["UNVERIFIABLE", "pedagogical advice about reversibility and auditability"],
  "02-phase-operating-systems.md:1368": ["OK", "Microsoft Learn: all four are documented Windows network commands."],
  "02-phase-operating-systems.md:1369": ["OK", "POSIX/systemd: all five are standard Linux commands."],
  "02-phase-operating-systems.md:1383": ["OK", "All named commands are real and correctly described as standard."],
  "03-phase-networking-basics.md:28": ["OK", "All seven are standard network diagnostic tools."],
  "03-phase-networking-basics.md:127": ["OK", "Microsoft Learn: `ipconfig /all` displays the physical (MAC) address and IPv4 address for each adapter."],
  "03-phase-networking-basics.md:228": ["OK", "Microsoft Learn: `nslookup` queries DNS."],
  "03-phase-networking-basics.md:251": ["OK", "Microsoft Learn: `ipconfig /all` shows configured DNS servers. 1.1.1.1 and 8.8.8.8 are public resolvers."],
  "03-phase-networking-basics.md:304": ["OK", "Microsoft Learn: `ipconfig /all` shows IP configuration; 169.254.x.x is the APIPA range assigned when DHCP fails."],
  "03-phase-networking-basics.md:305": ["OK", "Networking: pinging the gateway is the standard test of local link and default-gateway reachability."],
  "03-phase-networking-basics.md:306": ["OK", "Networking: this is the standard DNS split test, in the correct order."],
  "03-phase-networking-basics.md:307": ["OK", "Microsoft Learn: `Test-NetConnection -Port` tests TCP port reachability."],
  "03-phase-networking-basics.md:330": ["OK", "Microsoft Learn: `ipconfig /release` and `/renew` release and renew DHCP leases."],
  "03-phase-networking-basics.md:350": ["OK", "Networking: “could not find host” with working IP connectivity is the DNS failure signature."],
  "03-phase-networking-basics.md:566": ["OK", "Microsoft Learn: `ipconfig /all` displays the subnet mask."],
  "03-phase-networking-basics.md:600": ["OK", "Microsoft Learn: `ipconfig /all` reports adapter state and media status."],
  "03-phase-networking-basics.md:602": ["OK", "Microsoft Learn: `ipconfig /all` shows IP configuration; a 169.254.x.x address indicates APIPA."],
  "03-phase-networking-basics.md:608": ["OK", "Microsoft Learn: `Test-NetConnection` tests a specific port. 443 is HTTPS, 3389 RDP, 445 SMB — all correct per IANA."],
  "03-phase-networking-basics.md:686": ["UNVERIFIABLE", "diagnostic reasoning about a hypothetical failure, not a claim about a command"],
  "03-phase-networking-basics.md:774": ["OK", "Microsoft Learn: `Test-NetConnection` reports a `TcpTestSucceeded` boolean."],
  "03-phase-networking-basics.md:778": ["OK", "Microsoft Learn: `tracert` traces the route to a destination."],
  "03-phase-networking-basics.md:843": ["OK", "Microsoft Learn: `route print` shows the routing table, where the default route appears as 0.0.0.0 with the gateway in the Gateway column."],
  "03-phase-networking-basics.md:847": ["OK", "Networking: ping reports round-trip time in milliseconds and packet loss as a percentage."],
  "03-phase-networking-basics.md:857": ["OK", "Microsoft Learn: `Test-NetConnection` tests a port, which is the stronger test the row recommends."],
  "03-phase-networking-basics.md:868": ["OK", "ICMP is commonly blocked by policy and by default on many hosts, so a failed ping is not proof of an unreachable host."],
  "03-phase-networking-basics.md:950": ["OK", "Microsoft Learn: 169.254.x.x is APIPA, the signature of a failed DHCP lease."],
  "03-phase-networking-basics.md:951": ["OK", "Networking: gateway then external address is the standard connectivity ladder."],
  "03-phase-networking-basics.md:952": ["OK", "Microsoft Learn: `nslookup <name> <server>` queries a specific DNS server — which is how you compare your resolver against 8.8.8.8."],
  "03-phase-networking-basics.md:954": ["OK", "Microsoft Learn: `Test-NetConnection -Port 443` tests the HTTPS port."],
  "03-phase-networking-basics.md:965": ["UNVERIFIABLE", "advice about what evidence a customer can gather for an ISP"],
  "03-phase-networking-basics.md:982": ["OK", "Microsoft Learn: `ipconfig /all` shows IP, mask and default gateway. 169.254.88.4/16 is APIPA."],
  "03-phase-networking-basics.md:983": ["OK", "Microsoft Learn: `ipconfig /release` then `/renew` forces a fresh DHCP exchange."],
  "03-phase-networking-basics.md:1154": ["OK", "Wireshark: DNS query and response packets, and the Answers section of a response, are as described."],
  "03-phase-networking-basics.md:1182": ["OK", "All four are standard diagnostic commands and the ladder is correctly ordered."],
  "03-phase-networking-basics.md:1190": ["OK", "Microsoft Learn: `Get-NetAdapter` retrieves adapter names, which is what the command substitution needs."],
  "03-phase-networking-basics.md:1193": ["OK", "Microsoft Learn: `ipconfig /all` reports the adapter's current IP configuration."],
  "03-phase-networking-basics.md:1194": ["OK", "These are the standard Windows ping failure messages for an unreachable gateway."],
  "03-phase-networking-basics.md:1195": ["OK", "Networking: ping to 8.8.8.8 tests external connectivity."],
  "03-phase-networking-basics.md:1196": ["OK", "Microsoft Learn: `nslookup` queries DNS; a cached negative or positive answer can genuinely mislead."],
  "03-phase-networking-basics.md:1203": ["OK", "RFC 5737: 192.0.2.0/24 is TEST-NET-1, reserved for documentation and guaranteed not to be routable. A good deliberate-blackhole address."],
  "03-phase-networking-basics.md:1210": ["OK", "Networking: this is exactly the DNS failure signature the exercise is designed to produce."],
  "03-phase-networking-basics.md:1218": ["OK", "Microsoft Learn: `nslookup` queries DNS."],
  "03-phase-networking-basics.md:1223": ["OK", "Microsoft Learn: Windows labels a 169.254.x.x address “Autoconfiguration IPv4 Address”."],
  "03-phase-networking-basics.md:1427": ["OK", "Microsoft Learn: `ipconfig /all` shows the DNS servers line."],
  "03-phase-networking-basics.md:1428": ["OK", "Microsoft Learn: `Set-DnsClientServerAddress -ResetServerAddresses` resets a client's DNS servers."],
  "03-phase-networking-basics.md:1429": ["OK", "Microsoft Learn: `nslookup` resolves names."],
  "03-phase-networking-basics.md:1433": ["OK", "Networking: this is the DNS split test and the inference drawn from it is correct."],
  "03-phase-networking-basics.md:1435": ["UNVERIFIABLE", "diagnostic advice about a habit, not a claim about a command"],
  "03-phase-networking-basics.md:1595": ["OK", "Networking: ping tests reachability."],
  "03-phase-networking-basics.md:1607": ["OK", "The subnet arithmetic is correct: 192.168.10.200/26 falls in 192.168.10.192/26."],
  "03-phase-networking-basics.md:1626": ["OK", "Networking: the address-versus-name comparison is the cheap and decisive test."],
  "03-phase-networking-basics.md:1628": ["OK", "Microsoft Learn: `ipconfig` output includes the DNS Servers line and the Subnet Mask line."],
  "03-phase-networking-basics.md:1642": ["OK", "Networking: the split test is correctly described."],
  "03-phase-networking-basics.md:1645": ["OK", "Microsoft Learn: `Test-NetConnection` tests ports; `nslookup` queries DNS."],
  "03-phase-networking-basics.md:1687": ["OK", "Microsoft Learn: the linked `ipconfig` page is the correct documentation."],
  "03-phase-networking-basics.md:1688": ["OK", "Microsoft Learn: the linked `ping` page is the correct documentation."],
  "03-phase-networking-basics.md:1689": ["OK", "Microsoft Learn: the linked `nslookup` page is the correct documentation."],
  "03-phase-networking-basics.md:1707": ["OK", "Microsoft Learn/POSIX: `ipconfig /all`, `ifconfig` and `ip a` all display IP configuration."],
  "03-phase-networking-basics.md:1709": ["OK", "Microsoft Learn: `nslookup -type=<record>` queries a specific record type."],
  "03-phase-networking-basics.md:1747": ["OK", "Microsoft Learn: `nslookup <name> <server>` queries a named server, which is exactly the comparison described."],
  "03-phase-networking-basics.md:1810": ["OK", "Microsoft Learn: `Test-NetConnection` reports resolution, the resolved address, reachability and port state. The contrast with ping is correct — ICMP answering says nothing about a TCP service."],
  "03-phase-networking-basics.md:1846": ["OK", "Microsoft Learn: `/release` gives up the lease so `/renew` must obtain a fresh one; `/flushdns` clears the resolver cache. The three-way distinction is correct."],
  "04-phase-helpdesk-skills.md:381": ["OK", "Microsoft Learn: `Test-NetConnection -Port 445` tests the SMB port."],
  "04-phase-helpdesk-skills.md:744": ["OK", "Microsoft Learn: `Get-ADPrincipalGroupMembership` retrieves the groups an account belongs to."],
  "04-phase-helpdesk-skills.md:769": ["OK", "Microsoft Learn: `ipconfig /all` displays IP, mask, gateway, DNS, DHCP and MAC."],
  "04-phase-helpdesk-skills.md:770": ["OK", "Networking: this is the DNS split test."],
  "04-phase-helpdesk-skills.md:771": ["OK", "Microsoft Learn: `nslookup <name> <server>` queries a specific server, which answers “is my own resolver working?”."],
  "04-phase-helpdesk-skills.md:775": ["OK", "Microsoft Learn: `Get-Volume` reports volume information including free space."],
  "04-phase-helpdesk-skills.md:776": ["OK", "Microsoft Learn: `Get-WinEvent -FilterHashtable` filters logs by LogName and Level."],
  "04-phase-helpdesk-skills.md:777": ["OK", "Microsoft Learn: `Get-Service` reports Status and StartType, so filtering on Automatic and Stopped is valid."],
  "04-phase-helpdesk-skills.md:798": ["OK", "Microsoft Learn: `ipconfig /all` produces the output described."],
  "04-phase-helpdesk-skills.md:829": ["OK", "Windows ping prints the resolved address in square brackets in the reply header — the observation the row teaches the reader to make."],
  "04-phase-helpdesk-skills.md:869": ["UNVERIFIABLE", "a threshold stated as general guidance (“about 15 %”, “below 10 %”) rather than a documented figure"],
  "04-phase-helpdesk-skills.md:897": ["OK", "Microsoft Learn/POSIX: `Get-Volume` and `df -h` both report per-filesystem usage."],
  "04-phase-helpdesk-skills.md:900": ["OK", "Microsoft Learn/POSIX: `netstat -ano` and `ss -tulpn` both list listening sockets."],
  "04-phase-helpdesk-skills.md:901": ["OK", "Microsoft Learn/POSIX: `ipconfig /all` and `ip a` plus `ip route` show address and gateway."],
  "04-phase-helpdesk-skills.md:938": ["OK", "Microsoft Learn: `ipconfig /all` shows this configuration."],
  "04-phase-helpdesk-skills.md:939": ["OK", "Networking: the split test, correctly reported."],
  "04-phase-helpdesk-skills.md:941": ["OK", "Microsoft Learn: `Get-Service` reports Status; an empty filtered list means what the row says."],
  "04-phase-helpdesk-skills.md:999": ["OK", "Microsoft Learn: `Get-WinEvent -FilterHashtable` filters by LogName and Level."],
  "04-phase-helpdesk-skills.md:1000": ["OK", "Microsoft Learn: `Get-Volume` reports free space."],
  "04-phase-helpdesk-skills.md:1094": ["OK", "Networking: ping tests reachability."],
  "04-phase-helpdesk-skills.md:1095": ["OK", "Microsoft Learn: `Test-NetConnection -Port` tests a port. 9100 is IANA-registered for raw printing (PJL), and is the port nearly every network printer listens on."],
  "04-phase-helpdesk-skills.md:1135": ["OK", "Networking: a continuous ping is the standard way to observe intermittent connectivity."],
  "04-phase-helpdesk-skills.md:1447": ["OK", "Networking: ping tests reachability."],
  "04-phase-helpdesk-skills.md:1464": ["OK", "Networking: the reasoning is the standard split test."],
  "04-phase-helpdesk-skills.md:1542": ["OK", "Microsoft Learn: `ipconfig /flushdns` clears the DNS client resolver cache."],
  "04-phase-helpdesk-skills.md:1545": ["OK", "Microsoft Learn: `Get-Volume` reports free space."],
  "05-phase-sysadmin-basics.md:289": ["OK", "Microsoft Learn: `wmic` is deprecated; the CIM cmdlets (`Get-CimInstance`) are the documented replacement."],
  "05-phase-sysadmin-basics.md:527": ["OK", "Microsoft Learn: `Get-LocalGroupMember` retrieves the members of a local group."],
  "05-phase-sysadmin-basics.md:626": ["OK", "Microsoft Learn: `Get-Acl` retrieves the security descriptor for a resource — the same information `icacls` prints."],
  "05-phase-sysadmin-basics.md:628": ["UNVERIFIABLE", "a caveat about how a cmdlet presents data, which would need a specific test to confirm rather than a documentation page"],
  "05-phase-sysadmin-basics.md:660": ["OK", "Microsoft Learn: `icacls` works on NTFS permissions on a path; `Get-SmbShareAccess` reports share-level permissions. The two are genuinely different layers."],
  "05-phase-sysadmin-basics.md:691": ["OK", "Microsoft Learn: `net user` reads the account database; `whoami /groups` reads the current token. The distinction is exactly as the row states."],
  "05-phase-sysadmin-basics.md:704": ["OK", "Microsoft Learn: `whoami /groups` shows the current token, which is why a fresh group membership needs a new logon."],
  "05-phase-sysadmin-basics.md:707": ["OK", "Microsoft Learn: `Get-SmbShareAccess` reports share permissions."],
  "05-phase-sysadmin-basics.md:709": ["OK", "Microsoft Learn: `net user <name>` shows Account active, Password expires and Last logon."],
  "05-phase-sysadmin-basics.md:710": ["OK", "Microsoft Learn: `Get-LocalGroupMember -Group` lists members, and the returned objects carry `PrincipalSource`."],
  "05-phase-sysadmin-basics.md:853": ["OK", "Microsoft Learn: `Get-LocalUser` exposes `PrincipalSource`, which reads Local for a locally-created account."],
  "05-phase-sysadmin-basics.md:979": ["OK", "Microsoft Learn: `Get-LocalUser` and `Get-LocalGroup` retrieve local accounts and groups."],
  "05-phase-sysadmin-basics.md:1032": ["OK", "Microsoft Learn: `whoami /groups` shows current token groups — the single observation the diagnosis rests on."],
  "05-phase-sysadmin-basics.md:1067": ["OK", "Microsoft Learn: `nltest /dsgetdc:` locates a domain controller — the documented diagnostic for exactly this situation."],
  "05-phase-sysadmin-basics.md:1081": ["OK", "Microsoft Learn: `whoami /groups` shows current token groups."],
  "05-phase-sysadmin-basics.md:1257": ["OK", "Microsoft Learn: `Get-CimInstance` replaces `wmic` and `Get-WmiObject`."],
  "05-phase-sysadmin-basics.md:1265": ["OK", "Microsoft Learn: share and NTFS permissions both apply and the more restrictive wins."],
  "05-phase-sysadmin-basics.md:1281": ["OK", "Microsoft Learn: `whoami /groups` shows the token, `Get-LocalGroupMember` reads the group — which is why they disagree until re-logon."],
  "06-phase-tools-and-ticketing.md:397": ["OK", "Microsoft Learn: `Get-PSDrive` reports per-drive usage including free space."],
  "06-phase-tools-and-ticketing.md:1204": ["OK", "Microsoft Learn: `Get-PSDrive` reports drive usage."],
  "08-phase-portfolio-and-resume.md:112": ["OK", "All three are standard network diagnostic tools, correctly described."],
  "08-phase-portfolio-and-resume.md:114": ["OK", "All named tools and paths are standard Linux administration."],
  "08-phase-portfolio-and-resume.md:489": ["OK", "Networking: ping and tracert are the standard tools for verifying routed connectivity."],
  "08-phase-portfolio-and-resume.md:755": ["OK", "systemd: `systemctl status` reports `active (running)`."],
  "08-phase-portfolio-and-resume.md:768": ["OK", "systemd: `systemctl status` reports the unit's active state."],
  "08-phase-portfolio-and-resume.md:770": ["OK", "OpenSSH: `ssh user@host -p <port>` connects to a non-default port."],
  "08-phase-portfolio-and-resume.md:776": ["OK", "systemd: `systemctl status` is the standard first command for a service problem."],
  "08-phase-portfolio-and-resume.md:1067": ["OK", "Microsoft Learn: all named cmdlets are standard PowerShell 7."],
  "09-phase-job-application-plan.md:719": ["OK", "This describes the standard DNS split test performed correctly, including the resolver comparison."],
};

// A raw pipe in a verdict would terminate the table cell and silently truncate the
// claim for every downstream reader, including audit-claim-drift.mjs. Refuse rather
// than repair silently -- this produced a phantom GONE finding once already.
const rawPipe = Object.entries(V).filter(([, v]) => v[1].includes("|") && !v[1].includes("\\|"));
if (rawPipe.length) {
  console.error("REFUSING TO WRITE: these verdicts contain an unescaped '|', which would");
  console.error("split the table row. Escape it as \\| :\n");
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
console.log(`supplied but UNMATCHED in the doc: ${missing.length}`);
for (const k of missing) console.log("   ! " + k);
// `used.size`, not filled+already: on a second run the rows written by the first
// appear as `already`, so the sum would exceed the total and a correct run would
// report a mismatch.
if (missing.length || used.size !== Object.keys(V).length) {
  console.error(
    `\nMISMATCH: ${Object.keys(V).length} supplied, ${used.size} placed. ` +
      `A verdict that cannot be placed must not disappear.`,
  );
  process.exit(1);
}
console.log("\nAll supplied verdicts are recorded.");
