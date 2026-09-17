# Cybersecurity track — technical claim verification

**Status: verification in progress — 123 of 761 extracted claims settled, 284 outstanding.**

Four of the nine claim classes are complete and are **no longer emitted as worklists**:
standards/frameworks (105 rows), CVE identifiers (4), cryptography (5) and product versions (9),
all verified **2026-09-17 with zero `WRONG` verdicts**. Five classes remain — ATT&CK identifiers,
tool commands, protocol behaviour, registry/paths, and command/cmdlet usage — bundled as three
self-contained messages in [`claims-to-verify-cyber/bundles/`](claims-to-verify-cyber/bundles/).

Every verdict column below is otherwise empty. This is still a worklist, not a result.

## Result of the first completed pass (2026-09-17)

| Class | Rows | `OK` | `WRONG` | `UNVERIFIABLE` |
|---|---:|---:|---:|---:|
| Standards, frameworks and control identifiers | 105 | 66 | **0** | 39 |
| CVE identifiers and vulnerability claims | 4 | 4 | **0** | 0 |
| Cryptography algorithm claims | 5 | 3 | **0** | 2 |
| Product versions and editions | 9 | 2 | **0** | 7 |
| **Total** | **123** | **75** | **0** | **48** |

**Zero `WRONG` verdicts in 123 rows, and the 39% `UNVERIFIABLE` rate is the honest part.** Almost
every row marked unverifiable is a curriculum instruction, a deliverable description, or a
worked example in a scenario — *"Read OWASP Top 10 and summarize each risk in 2–3 sentences"* is
not a factual claim and marking it `OK` would be theatre. The rate is higher than the IT pass
(21%) because this batch is dominated by the standards class, whose rows are largely pedagogy
*about* frameworks rather than assertions about them — and the pack's own rules say not to invent
a verdict to fill a column.

> **These figures are counted from the rows below, not typed.** The first two versions of this
> table were hand-written and both were wrong (83/40, then 70/53) — in a document whose entire
> purpose is to be the trustworthy record of what was checked. `record-cyber-verdicts.mjs` writes
> the rows; the count is derived from them.

**Verdicts are recorded per row below, keyed by location.** Four locations legitimately appear in
more than one class — `02-phase-networking-and-linux.md:683` (*"Windows has no `ssh-copy-id`"*) is a
product-version claim, a command-usage claim and a tool-flag claim at once — so **123 distinct
locations fill 127 rows.** No row carries a verdict that was not explicitly supplied, and
`record-cyber-verdicts.mjs` fails rather than dropping one it cannot place.

**Two claims were re-checked against the primary source before this result was recorded**, because
both were the class most likely to be confidently wrong — a versioned standard summarised in
beginner material, which is exactly the `NIST CSF 5-vs-6` and `OWASP A09` shape that has already
produced real defects in this repository:

- **`14-phase-web-app-security.md:40` and `:252`** claim the current OWASP Top 10 edition is
  **2025**. [owasp.org](https://owasp.org/www-project-top-ten/) states: *"The most current released
  version is the OWASP Top 10 2025."* **CONFIRMED** — the corpus was already updated, and both
  lines correctly tell the reader the numbering moved and that 2021 is still widely quoted.
- **`13-phase-grc-compliance.md:443`** and **`01-phase-foundations.md:478`** claim NIST CSF is
  organised around **six** functions. NIST: *"The CSF 2.0 is organized by six Functions — Govern,
  Identify, Protect, Detect, Respond, and Recover."* **CONFIRMED.** These are the exact rows that
  returned four false `WRONG` verdicts earlier in the day from a **stale worklist**; see D-053.
  They now agree with the corpus, and the drift guard prevents a recurrence.

**A verdict is not a source, and the re-check above is the rule rather than an exception.** The
verifier disclosed that where it marked `OK` without a direct quote, it relied on stable
well-established facts rather than a fetched page. That disclosure is exactly right and is why
`WRONG`-in-the-other-direction matters more than a missing quote: **a wrong `OK` is invisible,
while a wrong `WRONG` sends someone to re-read correct content.** The two OWASP/CSF rows above
were the only high-rot claims in this batch, and both hold.

Nothing in this repository has ever tested whether its content is technically *true*. Every
guard tests internal consistency — does the parser lose content, do cross-references resolve,
does a table sum to the number the prose claims. The comprehension passes test whether a
beginner can *follow* the text. Both are blind to a sentence that is perfectly consistent,
perfectly clear, and factually wrong.

The one error of that class found so far (`modbus.func_code >= 15`, which also matches function
code 43 and every exception response) was caught by a reader who happened to know Modbus. That
is not a method. This file is the method: every checkable claim, in one place, with its
location, so the checking is finite work instead of a re-read of 160,000 words.

## How to verify

For each claim below, fetch the source named for its class and compare. Then fill in the
verdict line. Three outcomes, and the third is the important one:

| Verdict | Meaning |
|---|---|
| `OK` | The claim matches the source. Quote the source line that settles it. |
| `WRONG` | The claim contradicts the source. Give the correct value **and** the source. |
| `UNVERIFIABLE` | The claim is a judgement, an analogy, or a simplification rather than a fact. |

**`UNVERIFIABLE` is a real result, not a failure to try.** A phase may say a `/26` is "the point
where most beginners close the tab" — that is pedagogy, not a fact, and marking it OK would be
laundering an opinion into a verified column. Sorting those out honestly is what makes the
`OK` column mean anything.

## Already verified, without needing a source

**Three classes are settled without an external source.** They need no document to settle, so
they are checked by **recomputation** and against the registry that *assigns* the values — the
strongest tier available, because it does not depend on trusting anyone's documentation:

| Script | What it settles | Result | In CI? |
|---|---|---|---|
| `scripts/verify-cidr.mjs` | Every CIDR table row, every mask-to-prefix equivalence, and each RFC 1918 range's actual span | 42 checks, 0 wrong (IT) | yes |
| `scripts/verify-metrics.mjs` | The stated service-desk metrics, recomputed from their own ticket table | 15 checks, 0 wrong (IT 06) | yes |
| `scripts/verify-ports.mjs` | Every port number in the Cybersecurity track against the **IANA Service Name and Transport Protocol Port Number Registry** — the authority that assigns them | 19 checks, 0 wrong (IT) | no (needs network; run by hand) |

Run all three before trusting this section. If any ever fails, the claims below it are stale.

**So the settled classes are already recomputed and are NOT listed for verification:**

- **IP addressing and subnetting** — 27 claims, recomputed by `verify-cidr.mjs`.
- **Port numbers** — 185 claims. Those appearing in a phase's own port table were checked
  against the IANA registry. The remainder appear inside worked examples
  (`Test-NetConnection … -Port 445`), which are illustrative rather than assertions —
  a reader loses nothing if an example used a different port to demonstrate the syntax.
- **Stated counts and arithmetic** — 138 claims, recomputed from the documents' own numbers.
  Most are inventory figures ("a 10-device practice asset inventory") that are **illustrative
  examples rather than claims about the world**, so they are unverifiable by construction.

## Result of the verification passes

**No verification pass has been recorded for the Cybersecurity track yet.** This file is a
worklist: it says what needs checking and where. It deliberately does **not** carry a results
table, because there are no results to carry — and the previous revision of this file carried
one anyway, copied from the IT pass, which claimed all classes verified and zero claims wrong.

**411 claim(s) below need an external source.** Every verdict column is empty. If you
are reading this expecting a completed result, there is not one.

> **Why there is no results table here.** Verification verdicts live in a conversation, not in
> the repository (D-038), so a generator cannot read them back. Rather than print a stale or
> borrowed number, this file prints none. Record real verdicts in
> [`claims-to-verify-cyber/`](claims-to-verify-cyber/) when a pass completes.

## `UNVERIFIABLE` is expected to be common, and is not a failure

A great deal of this track is teaching method, diagnostic reasoning, worked examples and career
advice, none of which is a fact about the world. **On the IT pass 48 of 224 rows (21%) came back
`UNVERIFIABLE`, and that was the honest result** — a phase saying a `/26` is "the point where most
beginners close the tab" is pedagogy, not fact, and stamping it OK would have made the OK column
mean nothing. Do not push a verifier to fill a column; an invented URL is worse than a gap,
because it will be acted on.

## What a clean result does NOT mean

**This is not a verdict on the curriculum.** It means the classes above were checked against
sources. The extractor cannot see a bad analogy, a misleading emphasis, or outdated practice that
reads as current — and those are the errors most likely to actually mislead a beginner. That
layer has only ever been tested by the comprehension passes, and it remains the largest
unexamined risk in the repository.

## What this file does NOT claim

- **It is not exhaustive of the content.** It finds claims of the classes above. Prose that is
  wrong in a way no pattern catches — a bad analogy, a misleading emphasis, an outdated practice
  — is invisible here and always will be.
- **It is not a comprehension check.** Whether a beginner can follow the text is a different
  question, answered by [`COMPREHENSION-AUDIT.md`](COMPREHENSION-AUDIT.md).
- **A clean result does not mean the phase is correct.** It means these classes were checked.

**Claims extracted: 761** across 15 phases and 13 classes.

Three classes are settled by recomputation or by the assigning registry (**350 claims**),
leaving **411 claims** that genuinely need a source. Those are the ones listed below.

| Class | Claims | Source | Status |
|---|---|---|---|
| IP addressing and subnetting | 27 | RFC 1918 (private ranges), RFC 6890 (special-purpose), or by recomputation | **settled** |
| Port numbers | 185 | IANA port registry, or Microsoft/vendor docs for the Windows-specific ones | **settled** |
| Command and cmdlet usage | 60 | Microsoft Learn for cmdlets, man pages for POSIX tools | needs checking |
| DNS record types | 4 | RFC 1035 and the IANA DNS parameters registry | needs checking |
| Protocol and standard behaviour | 44 | The RFC or standard that defines the protocol; vendor docs for proprietary ones | needs checking |
| Product versions and editions | 9 | Vendor documentation, checked against the current release | needs checking |
| Registry paths, file paths and filenames | 47 | Microsoft documentation, or the OS itself | needs checking |
| Stated counts, sizes and arithmetic | 138 | Recomputation from the document's own numbers | **settled** |
| CVE identifiers and vulnerability claims | 4 | The NVD or the vendor advisory for that CVE | needs checking |
| MITRE ATT&CK technique identifiers | 34 | The MITRE ATT&CK matrix for the named technique ID | needs checking |
| Standards, frameworks and control identifiers | 105 | The published standard itself (NIST CSRC, ISO, PCI SSC, OWASP) | needs checking |
| Security tool commands and flags | 99 | The tool's own man page or vendor documentation | needs checking |
| Cryptography algorithm claims | 5 | The defining standard (NIST FIPS), or the IETF RFC for the protocol | needs checking |

---

## IP addressing and subnetting

*Every value is arithmetic or is fixed by RFC 1918 / RFC 6890. Highest-risk class: a wrong mask teaches a wrong mental model that persists.*

**Source to check against:** RFC 1918 (private ranges), RFC 6890 (special-purpose), or by recomputation

**27 claim(s) — already verified by recomputation, not listed.**

See "Already verified, without needing a source" above. Re-run the verifying script if you
doubt it; do not re-check these by hand.

---

## Port numbers

*Fixed by the IANA Service Name and Transport Protocol Port Number Registry. A wrong port number is unrecoverable from context.*

**Source to check against:** IANA port registry, or Microsoft/vendor docs for the Windows-specific ones

**185 claim(s) — already verified by recomputation, not listed.**

See "Already verified, without needing a source" above. Re-run the verifying script if you
doubt it; do not re-check these by hand.

---

## Command and cmdlet usage

*Flags, parameters and syntax are fixed by the tool's own documentation. A wrong flag in a worked example is executable code that silently cannot run.*

**Source to check against:** Microsoft Learn for cmdlets, man pages for POSIX tools

60 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:53` | - SSH keys and `sshd` | |
| | | <sub>↑ - Users/groups/sudo<br>↓ - Services with `systemctl`</sub> | |
| 2 | `02-phase-networking-and-linux.md:54` | - Services with `systemctl` | |
| | | <sub>↑ - SSH keys and `sshd`<br>↓ - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog`</sub> | |
| 3 | `02-phase-networking-and-linux.md:56` | - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file | |
| 4 | `02-phase-networking-and-linux.md:57` | - Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl` | |
| | | <sub>↑ - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file<br>↓ - Text processing: `grep`, `awk` basics, `sed` basics, pipes/redirection</sub> | |
| 5 | `02-phase-networking-and-linux.md:58` | - Text processing: `grep`, `awk` basics, `sed` basics, pipes/redirection | |
| | | <sub>↑ - Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl`</sub> | |
| 6 | `02-phase-networking-and-linux.md:115` | \| `ssh user@your-vm` \| Learning \| Unauthorised access \| | |
| | | <sub>↑ \| `tcpdump` on your own interface \| Learning \| Potentially unlawful interception \|</sub> | |
| 7 | `02-phase-networking-and-linux.md:405` | **ICMP** is the diagnostic protocol behind `ping` (echo request / echo reply) and the “destination unreachable” and “time exceeded” messages. | |
| 8 | `02-phase-networking-and-linux.md:436` | \| **Headers** \| Metadata about the request or response \| `Set-Cookie` (and whether it has `HttpOnly` and `Secure` flags), `Content-Security-Policy`, `Server` (leaks software versions, useful to an attacker), `Authorization` \| | |
| 9 | `02-phase-networking-and-linux.md:439` | You can read all of this with `curl`, which is phase task 7's companion. `curl -I https://example.com` printing real response headers is worth more than any description. | |
| 10 | `02-phase-networking-and-linux.md:575` | \| `chmod 755 script.sh` \| Owner full rights; everyone else read-and-execute \| A script other people need to run \| | |
| 11 | `02-phase-networking-and-linux.md:576` | \| `chmod 600 id_rsa` \| Only the owner may read and write \| Exactly what SSH requires for a private key — and the reason you will see “permissions are too open” errors when you get it wrong \| | |
| 12 | `02-phase-networking-and-linux.md:577` | \| `chmod 644 file.txt` \| Owner reads and writes; everyone else reads \| The ordinary setting for a non-executable file \| | |
| 13 | `02-phase-networking-and-linux.md:579` | Ownership changes with `chown user:group file`. Only root can give a file away to another user, which is a deliberate restriction. | |
| 14 | `02-phase-networking-and-linux.md:607` | The `chmod 600 id_rsa` habit above protects one file after the fact. **A umask protects every file you are about to create**, including the ones you forget about. That is the difference between fixing a problem and preventing a class of them, and it is the rea … | |
| 15 | `02-phase-networking-and-linux.md:609` | **Where this becomes a finding.** A service account or an automated job running with a permissive umask writes world-readable files without anyone choosing to. When you find credentials, tokens, or logs readable by every user on the box, the root cause is ofte … | |
| 16 | `02-phase-networking-and-linux.md:661` | **SSH** gives you an encrypted shell on a remote machine. The server is `sshd` — the SSH *daemon*, where a daemon is a background service. It is configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default. | |
| 17 | `02-phase-networking-and-linux.md:683` | **Windows has no `ssh-copy-id`.** The OpenSSH client ships with Windows 10 and 11, but the key-install helper does not. Append the key yourself instead — from PowerShell: | **OK** — Microsoft: the Windows OpenSSH client does not include `ssh-copy-id`. |
| 18 | `02-phase-networking-and-linux.md:702` | Modern Linux uses **systemd** to manage services, through `systemctl`: | |
| 19 | `02-phase-networking-and-linux.md:730` | The security relevance of this command is direct: **you cannot defend a host whose services you cannot enumerate.** Asking “what is running, and should it be?” is the first question of host hardening, and `systemctl list-units --type=service` answers it. | |
| 20 | `02-phase-networking-and-linux.md:757` | Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`. | |
| 21 | `02-phase-networking-and-linux.md:796` | \| `grep "Failed password"` \| Keep only the failure lines \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `awk '{print $(NF-3)}'` \| Print the fourth field **from the end** — which is the source IP in this log format \|</sub> | |
| 22 | `02-phase-networking-and-linux.md:797` | \| `awk '{print $(NF-3)}'` \| Print the fourth field **from the end** — which is the source IP in this log format \| | |
| 23 | `02-phase-networking-and-linux.md:813` | The `--line-buffered` matters and is easy to miss. Without it, `grep` buffers its output when writing to a pipe, so the lines appear in bursts rather than as they happen. You will think the log is broken. | |
| 24 | `02-phase-networking-and-linux.md:847` | This is `sed`'s range form: print from the line matching the first pattern to the line matching the second. It is the fastest way to reduce a day of logs to the hour that matters. | |
| 25 | `02-phase-networking-and-linux.md:849` | **One safety habit, learned from breaking things.** Write the pipeline in pieces and run each stage before adding the next. `grep ... \| head` first — confirm you are matching the right lines. *Then* add the `awk`. A pipeline that returns nothing is ambiguous: … | |
| 26 | `02-phase-networking-and-linux.md:927` | \| `grep "Failed password" /var/log/auth.log` \| Find the failed-password lines \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \|</sub> | |
| 27 | `02-phase-networking-and-linux.md:928` | \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \| | |
| | | <sub>↑ \| `grep "Failed password" /var/log/auth.log` \| Find the failed-password lines \|<br>↓ \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \|</sub> | |
| 28 | `02-phase-networking-and-linux.md:929` | \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \| | |
| | | <sub>↑ \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \|<br>↓ \| `sort` \| Order them so identical addresses are adjacent \|</sub> | |
| 29 | `02-phase-networking-and-linux.md:935` | That is a real investigation query, built from small pieces, and it is the shape of most log analysis you will do. **`awk '{print $N}'` extracts the Nth whitespace-separated field** — that is the 90% of awk you need at this stage. | |
| 30 | `02-phase-networking-and-linux.md:937` | **Why not just `awk '{print $6}'`?** Because the field number moves. In `Failed password for root from 203.0.113.45 ...` the address is field 6, but in `Failed password for invalid user admin from 203.0.113.45 ...` the words `invalid user` push it to field 8.  … | |
| 31 | `02-phase-networking-and-linux.md:981` | \| 2 \| In another terminal, run `dig example.com` and `curl -I https://example.com` \| | |
| | | <sub>↑ \| 1 \| Start the capture in Wireshark or tcpdump \|<br>↓ \| 3 \| Stop the capture \|</sub> | |
| 32 | `02-phase-networking-and-linux.md:1087` | For this phase's scanning and SSH tasks, **Host-only** or **Bridged** is usually what you want, because you need your host and the VM to reach each other. Check the VM's address with `ip a` inside it, and verify connectivity with `ping` before concluding anyth … | |
| 33 | `02-phase-networking-and-linux.md:1105` | Each level is an SSH login to a server where the password for the next level is hidden somewhere. Finding it requires exactly the skills this phase covers: reading files, permissions, `grep`, pipes, and later `find` and encoding. | |
| 34 | `02-phase-networking-and-linux.md:1142` | - **Pipes build small tools into real investigations.** `grep \| awk \| sort \| uniq -c \| sort -rn \| head` is a genuine top-talkers query, not a toy example. | |
| 35 | `02-phase-networking-and-linux.md:1166` | 13. **Prove key-only SSH** (task 13). Generate a keypair, install the public key in `authorized_keys`, disable password authentication in `sshd_config`, and demonstrate that a password login now fails. "Demonstrate the failure" is the checklist item — anyone c … | |
| 36 | `02-phase-networking-and-linux.md:1196` | 5. Use `dig` or `nslookup` to inspect A, AAAA, MX, TXT records. <!-- id: cyber-02-t05 band: quick energy: low --> | |
| 37 | `02-phase-networking-and-linux.md:1204` | 13. Generate a keypair, place the public key in `authorized_keys`, disable password authentication in `sshd_config`, and prove a password login now fails. <!-- id: cyber-02-t13 band: focused energy: high --> | |
| 38 | `02-phase-networking-and-linux.md:1298` | **Why:** Two things happen at once. Anyone who can read the private key can use it, which is a full impersonation. And SSH itself refuses a private key that is readable by others, so the mistake announces itself as a `permissions are too open` error rather tha … | |
| 39 | `02-phase-networking-and-linux.md:1325` | **Why:** `-u sshd` matches a systemd unit by that exact name, and on some distributions the unit is `ssh.service` rather than `sshd.service`, so the filter matches nothing. Separately, not every distribution routes SSH into the journal — Debian and Ubuntu fami … | |
| 40 | `03-phase-security-fundamentals.md:429` | \| **Living off the land** \| Using legitimate built-in tools for malicious purposes: `powershell.exe`, `cmd.exe`, `wmic`, `certutil`, `bitsadmin`, `rundll32`, `mshta` \| Suspicious not because they are malicious but because they are frequently *abused*, and s … | |
| 41 | `03-phase-security-fundamentals.md:685` | You can check any site's headers with `curl -I`, which is a small, satisfying thing to do on a site you own. | |
| 42 | `04-phase-hands-on-labs.md:239` | \| Windows VM \| `netstat -ano` \| | |
| | | <sub>↑ \| Linux VM \| `ss -tulpn` \|</sub> | |
| 43 | `04-phase-hands-on-labs.md:275` | \| **Enough free disk space** \| `Get-PSDrive C` in PowerShell \| Guests grow, and a full host disk corrupts running VMs \| | |
| 44 | `04-phase-hands-on-labs.md:447` | \| **The host disk is full** \| Snapshot deltas, or dynamically allocated disks that grew \| `Get-PSDrive C` on the host; check the VM folder's size \| Delete finished snapshots, delete unused VMs, move the VM folder to a larger drive \| | |
| 45 | `04-phase-hands-on-labs.md:455` | \| **`apt` or Windows Update fails inside the guest** \| No route out, or a corporate VPN on the host \| `curl -I https://archive.ubuntu.com` inside the guest \| Detach the VPN, or verify the NAT adapter is present and enabled \| | |
| 46 | `04-phase-hands-on-labs.md:484` | it can understand Windows events and `sshd` logs out of the box. | |
| | | <sub>↑ it. Wazuh ships with hundreds of decoders for common log formats — which is why</sub> | |
| 47 | `04-phase-hands-on-labs.md:543` | \| 1 \| **Generate one event** on the victim VM — for example, an SSH login attempt as a user that does not exist (`ssh fakeuser@localhost` and fail it) \| You need a known event to trace \| | |
| 48 | `04-phase-hands-on-labs.md:662` ▶ | `grep "Failed password" /var/log/auth.log \| tail -3` | |
| | | <sub>↑ - Raw excerpt from /var/log/auth.log, three of the six lines, captured with<br>↓ - Wazuh alert for rule 100001, level 10, timestamped 14:32:11 UTC</sub> | |
| 49 | `08-phase-job-application.md:294` | *I'd test resolution directly: `nslookup example.com` tells me whether the name resolves and which server answered. If it fails, I'd try a public resolver like `nslookup example.com 8.8.8.8`. If that works, the problem is our internal DNS server or its forward … | |
| 50 | `08-phase-job-application.md:308` | **Linux permissions — "What does `chmod 777` do, and why is it a finding in a security review?"** | |
| 51 | `09-phase-cloud-and-identity.md:268` | Two details in that third command are worth naming, because both are the kind of thing that makes an audit script quietly wrong. The version id has to be fetched rather than assumed, and the `grep` pattern is written loosely enough to catch the several shapes  … | |
| 52 | `11-phase-incident-response.md:516` | \| 09:12:03 \| Sysmon 1 \| `schtasks.exe /create /tn Updater /tr ...` \| | |
| | | <sub>↑ \| 09:11:52 \| Sysmon 3 \| Outbound HTTPS from `powershell.exe` to `203.0.113.44:443` \|<br>↓ \| 09:12:20 \| Security 4698 \| Scheduled task `Updater` created \|</sub> | |
| 53 | `11-phase-incident-response.md:1065` | **On the Windows host this scenario actually describes, the same four steps are:** `winpmem_mini_x64.exe` for memory; `netstat -ano`, `arp -a`, and `route print` for network state; `Get-Process` for processes; and FTK Imager or `dc3dd.exe` for the disk image.  … | |
| 54 | `12-phase-scripting-automation.md:27` | - Use PowerShell to triage a Windows host with `Get-WinEvent`, `Get-Process`, and `Get-NetTCPConnection`. | |
| | | <sub>↑ - Read and write Python well enough to parse logs, call APIs, and produce a report.<br>↓ - Make authenticated HTTP requests to a real API and handle the responses and errors properly.</sub> | |
| 55 | `12-phase-scripting-automation.md:46` | - PowerShell for triage: `Get-WinEvent`, `Get-Process`, `Get-NetTCPConnection`, `Get-Service` | |
| | | <sub>↑ - Secrets management: environment variables, `.env` files, and `.gitignore`<br>↓ - PowerShell objects and pipes, and why `Select-Object` beats text parsing</sub> | |
| 56 | `12-phase-scripting-automation.md:49` | - Hash computation with `hashlib` and `Get-FileHash` for IOC matching | |
| | | <sub>↑ - Calling REST APIs from PowerShell with `Invoke-RestMethod`<br>↓ - Defanging indicators so they are safe to paste into reports</sub> | |
| 57 | `12-phase-scripting-automation.md:743` | `Get-WinEvent` is the workhorse, and its filtering syntax is worth learning properly because the difference between a good and a bad filter is minutes versus hours. | |
| 58 | `12-phase-scripting-automation.md:852` | The third command is the one to know best. **`Get-NetTCPConnection` joined to the owning process answers "what is this machine talking to, and what program is doing it"** — which is the first question in almost every host investigation. | |
| 59 | `12-phase-scripting-automation.md:1396` | - **`Get-WinEvent -FilterHashtable` is dramatically faster than piping to `Where-Object`**, and positional property indexes are found by inspection rather than memory. | |
| 60 | `12-phase-scripting-automation.md:1397` | - **`Get-NetTCPConnection` joined to the owning process answers the first question of almost every host investigation.** | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## DNS record types

*Defined by RFC 1035 and successors. Small set, easy to get subtly wrong.*

**Source to check against:** RFC 1035 and the IANA DNS parameters registry

4 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:38` | - IPv6 basics: link-local, global unicast, AAAA records, why NAT is less central | |
| | | <sub>↑ - IPv4 addressing, subnet masks, and CIDR — including working out the network, broadcast, and usable range for any prefix by hand<br>↓ - DNS: A, AAAA, CNAME, MX, TXT, NS, recursive resolver, authoritative server</sub> | |
| 2 | `02-phase-networking-and-linux.md:312` | You can inspect all of this from a terminal, and the phase's task 5 asks you to. `dig example.com MX` returns the mail records, and `dig example.com TXT` shows the anti-spoofing policy. Reading a real TXT record for a domain you care about is a small revelatio … | |
| 3 | `02-phase-networking-and-linux.md:1155` | 5. **Then DNS** (task 5). Run `dig` for A, AAAA, MX, TXT, and NS on a domain you care about, and read the TXT record to see the anti-spoofing policy. This connects the abstract record table to something real. | |
| 4 | `02-phase-networking-and-linux.md:1196` | 5. Use `dig` or `nslookup` to inspect A, AAAA, MX, TXT records. <!-- id: cyber-02-t05 band: quick energy: low --> | |

---

## Protocol and standard behaviour

*Fixed by the defining spec. Includes handshake sequences, header fields, status codes and OSI layer assignments.*

**Source to check against:** The RFC or standard that defines the protocol; vendor docs for proprietary ones

44 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:26` | - Understand IPv4, IPv6 basics, subnetting, DNS, DHCP, NAT, TCP/UDP, ICMP, TLS, HTTP, and common ports. | |
| | | <sub>↓ - Use Linux confidently for files, permissions, processes, services, SSH, logs, and networking.</sub> | |
| 2 | `02-phase-networking-and-linux.md:41` | - TCP handshake and connection teardown | |
| | | <sub>↑ - DHCP process<br>↓ - UDP use cases</sub> | |
| 3 | `02-phase-networking-and-linux.md:132` | \| 4 Transport \| Ports, reliability \| TCP, UDP \| Port closed, timeout \| | |
| | | <sub>↑ \| 5 Session \| Managing conversations \| Session setup \| Connection drops \|<br>↓ \| 3 Network \| Logical addressing, routing \| IP, ICMP \| Cannot reach the host \|</sub> | |
| 4 | `02-phase-networking-and-linux.md:342` | **DHCP** (Dynamic Host Configuration Protocol) hands out addresses automatically, through a four-step exchange known as **DORA**. | |
| 5 | `02-phase-networking-and-linux.md:366` | **TCP** is connection-oriented and reliable. It begins with the **three-way handshake**: | |
| 6 | `02-phase-networking-and-linux.md:369` ▶ | Client → Server: SYN ("I would like to connect, my sequence starts here") | |
| | | <sub>↑ ```text<br>↓ Server → Client: SYN-ACK ("Acknowledged, and here is mine")</sub> | |
| 7 | `02-phase-networking-and-linux.md:370` ▶ | Server → Client: SYN-ACK ("Acknowledged, and here is mine") | |
| | | <sub>↑ Client → Server: SYN ("I would like to connect, my sequence starts here")<br>↓ Client → Server: ACK ("Acknowledged — connection established")</sub> | |
| 8 | `02-phase-networking-and-linux.md:383` | \| A `SYN` that gets no reply \| The port is filtered, or the host is down \| | |
| | | <sub>↑ \| A completed handshake \| The port is open and something is listening \|<br>↓ \| A `SYN` answered by `RST` (reset) \| The host is alive but nothing is listening on that port \|</sub> | |
| 9 | `02-phase-networking-and-linux.md:384` | \| A `SYN` answered by `RST` (reset) \| The host is alive but nothing is listening on that port \| | |
| | | <sub>↑ \| A `SYN` that gets no reply \| The port is filtered, or the host is down \|</sub> | |
| 10 | `02-phase-networking-and-linux.md:392` | **UDP** is connectionless and unreliable: no handshake, no ordering, no retransmission. | |
| 11 | `02-phase-networking-and-linux.md:424` | Two of these deserve emphasis. **Port 445 (SMB)** and **port 3389 (RDP)** exposed to the internet are among the most common causes of ransomware incidents in the world, because both are legitimate services that attackers can authenticate to. | |
| 12 | `02-phase-networking-and-linux.md:861` ▶ | sudo ss -tulpn # listening TCP/UDP ports with owning processes | |
| | | <sub>↑ ip neigh # the ARP table — IP-to-MAC mappings<br>↓ dig example.com MX # DNS records</sub> | |
| 13 | `02-phase-networking-and-linux.md:955` ▶ | sudo tcpdump -i eth0 -n 'tcp port 80' # only HTTP, no name resolution | |
| | | <sub>↑ sudo tcpdump -i eth0 port 53 # only DNS<br>↓ sudo tcpdump -r capture.pcap -nn # read a saved capture</sub> | |
| 14 | `02-phase-networking-and-linux.md:970` ▶ | tcp.flags.syn == 1 connection attempts | |
| | | <sub>↑ ip.addr == 192.168.1.50 one host<br>↓ tcp.flags.reset == 1 resets — refused connections</sub> | |
| 15 | `02-phase-networking-and-linux.md:1014` | \| **open** \| A completed TCP handshake, or a UDP reply \| Something is listening and accepted the connection \| | |
| 16 | `02-phase-networking-and-linux.md:1136` | - **TCP's three-way handshake explains Nmap's output.** Completed handshake = open; `RST` = closed (host is up); silence = filtered. Learn the handshake and port states stop being arbitrary. | |
| 17 | `02-phase-networking-and-linux.md:1159` | 9. **Write the TCP handshake mini-report last** (task 9), once the capture work has given you the material. Follow the deliverable's structure and keep it short. If you can explain the handshake from your own capture — including why the packets are in that ord … | |
| 18 | `02-phase-networking-and-linux.md:1175` | \| Wireshark \| Packet analysis \| Free \| https://www.wireshark.org/ \| Capture DNS, HTTP, TCP handshake \| tcpdump \| | |
| 19 | `02-phase-networking-and-linux.md:1200` | 9. Write a mini-report explaining one TCP handshake capture. <!-- id: cyber-02-t09 band: focused energy: normal --> | |
| 20 | `02-phase-networking-and-linux.md:1307` | **Why:** The authoritative server is the source of truth for its zone and answers fresh every time, while a recursive resolver returns whatever it has cached until the TTL expires. So a disagreement between them is usually a timing difference rather than a con … | |
| 21 | `03-phase-security-fundamentals.md:466` | It also explains why the *direction* of a rule is essential context. RDP on port 3389 is an *inbound* service — the thing you are protecting — so an inbound deny on 3389 is the correct posture, and a separate outbound permit on 3389 is ordinary and unrelated t … | |
| 22 | `03-phase-security-fundamentals.md:500` | If TLS hides the content, signature matching cannot see inside without interception. This is why modern detection leans on metadata — connection patterns, volumes, timing, destinations, and JA3/JA4 fingerprints of the TLS handshake itself — rather than payload … | |
| 23 | `03-phase-security-fundamentals.md:549` | \| DNS-over-HTTPS clients \| The lookup is encrypted and leaves the network's resolver entirely \| | |
| | | <sub>↑ \| Direct-to-IP connections \| DNS filtering only works on names \|<br>↓ \| Domain generation algorithms \| Malware generates hundreds of candidate domains, so blocking a list catches only some \|</sub> | |
| 24 | `03-phase-security-fundamentals.md:956` | \| 5 \| Check for old app passwords and OAuth grants \| Access you granted years ago and forgot \| | |
| | | <sub>↑ \| 4 \| Find your recovery options for each \| A stale recovery email is an unlocked back door \|</sub> | |
| 25 | `06-phase-portfolio-projects.md:45` | - Capture DNS, HTTP, TLS handshake metadata, and failed connection attempts. | |
| | | <sub>↓ - Explain protocols and suspicious indicators.</sub> | |
| 26 | `06-phase-portfolio-projects.md:530` | features. The report becomes *"here is a DNS query, here is a TCP handshake, | |
| | | <sub>↑ Wireshark work has a specific failure mode: it turns into a tour of Wireshark's<br>↓ here is a TLS ClientHello"* — a textbook recap that demonstrates you can apply</sub> | |
| 27 | `06-phase-portfolio-projects.md:542` | \| **A name-resolution investigation** \| Browse to a domain: the DNS query and response, the resolved address, the TCP handshake, the TLS negotiation including SNI, the HTTP request if unencrypted \| Which resolver was used? Was the response cached? Did anyth … | |
| 28 | `06-phase-portfolio-projects.md:555` | \| `tcp.flags.syn == 1 && tcp.flags.ack == 0` \| Connection attempts \| | |
| | | <sub>↑ \| `dns` \| Name-resolution activity \|<br>↓ \| `tls.handshake.extensions_server_name` \| Which hostname was requested over TLS \|</sub> | |
| 29 | `08-phase-job-application.md:300` | **TCP — "Why does understanding the TCP three-way handshake matter for security analysis?"** | |
| 30 | `08-phase-job-application.md:302` | *"Because it tells you whether a connection actually completed, which distinguishes a scan or a blocked attempt from a real session. The handshake is SYN, SYN-ACK, ACK.* | |
| 31 | `08-phase-job-application.md:304` | *In a capture, a full handshake means the host connected successfully. A SYN with no response means the port is filtered or the host is down. A SYN followed by RST means the port is closed but the host is reachable — that pattern across many ports is character … | |
| 32 | `12-phase-scripting-automation.md:89` | \| Authentication flows \| API keys, bearer tokens, OAuth — the same patterns, new names \| | |
| | | <sub>↑ \| JSON parsing \| API responses, configuration, and log exports are all JSON \|<br>↓ \| Version control and `.gitignore` \| The habit that prevents the most common security mistake in this phase \|</sub> | |
| 33 | `14-phase-web-app-security.md:1282` | - **Injection is about an interpreter, not about SQL.** NoSQL, LDAP, template, command, and header injection are the same bug in different places. | |
| 34 | `15-phase-ot-ics-security.md:87` | \| TCP/IP, ports, sessions, and handshakes \| Nearly all modern industrial traffic rides on TCP or UDP \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Wireshark and reading a capture \| The core skill of this phase, unchanged in method \|</sub> | |
| 35 | `15-phase-ot-ics-security.md:330` | \| **Modbus TCP** \| Modicon, 1979, over serial first \| TCP, port 502 \| Read and write registers and coils on a device \| **None** \| | |
| 36 | `15-phase-ot-ics-security.md:331` | \| **DNP3** \| Utilities, early 1990s \| TCP or UDP, port 20000 \| Master-to-outstation telemetry for electric and water utilities \| Optional, and often unused \| | |
| 37 | `15-phase-ot-ics-security.md:332` | \| **EtherNet/IP** \| Rockwell and ODVA, late 1990s \| TCP port 44818, UDP port 2222 \| Industrial device messaging using the CIP object model \| **None** by default \| | |
| 38 | `15-phase-ot-ics-security.md:334` | \| **OPC UA** \| The OPC Foundation, 2006 onward \| TCP, commonly port 4840 \| Vendor-neutral data modelling and transport \| **Yes**, with certificates and sessions \| | |
| 39 | `15-phase-ot-ics-security.md:342` | A Modbus TCP packet begins with a seven-byte header, then a function code, then data. | |
| 40 | `15-phase-ot-ics-security.md:446` | \| **Implicit** \| UDP, port 2222, multicast \| Repeated at the control loop rate, carrying I/O data \| A heartbeat that never stops \| | |
| 41 | `15-phase-ot-ics-security.md:447` | \| **Explicit** \| TCP, port 44818 \| Request and response, for configuration and diagnostics \| A conversation \| | |
| 42 | `15-phase-ot-ics-security.md:717` | \| A TCP SYN to an unopened port \| Some older stacks crash or hang on unexpected packets \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| A service probe that speaks half a protocol \| A device may enter a fault state waiting for the rest \|</sub> | |
| 43 | `15-phase-ot-ics-security.md:767` | \| `ip.src == <controller> && tcp.flags.syn == 1` \| New connections to a controller — the highest-value alert \| | |
| 44 | `15-phase-ot-ics-security.md:802` | Read the rule as a sentence. It matches established TCP to port 502, checks that the protocol identifier field is zero, then tests the byte at offset seven — the function code — and alerts when it is fifteen or above. | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Product versions and editions

*The class most likely to ROT. A claim that is true today may be false after a release, so these carry a shelf life the others do not.*

**Source to check against:** Vendor documentation, checked against the current release

9 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:683` | **Windows has no `ssh-copy-id`.** The OpenSSH client ships with Windows 10 and 11, but the key-install helper does not. Append the key yourself instead — from PowerShell: | **OK** — Microsoft: the Windows OpenSSH client does not include `ssh-copy-id`. |
| 2 | `04-phase-hands-on-labs.md:814` ▶ | \| lab-wazuh \| SIEM manager \| 192.168.56.10 \| Ubuntu Server 24.04 \| clean-install \| | **UNVERIFIABLE** — lab environment configuration example |
| | | <sub>↑ \|---\|---\|---\|---\|---\|<br>↓ \| lab-ubuntu \| Victim \| 192.168.56.20 \| Ubuntu Server 24.04 \| clean-install \|</sub> | |
| 3 | `04-phase-hands-on-labs.md:815` ▶ | \| lab-ubuntu \| Victim \| 192.168.56.20 \| Ubuntu Server 24.04 \| clean-install \| | **UNVERIFIABLE** — lab environment configuration example |
| | | <sub>↑ \| lab-wazuh \| SIEM manager \| 192.168.56.10 \| Ubuntu Server 24.04 \| clean-install \|<br>↓ \| lab-win10 \| Victim \| 192.168.56.30 \| Windows 10 Eval \| clean-install \|</sub> | |
| 4 | `04-phase-hands-on-labs.md:816` ▶ | \| lab-win10 \| Victim \| 192.168.56.30 \| Windows 10 Eval \| clean-install \| | **UNVERIFIABLE** — lab environment configuration example |
| | | <sub>↑ \| lab-ubuntu \| Victim \| 192.168.56.20 \| Ubuntu Server 24.04 \| clean-install \|</sub> | |
| 5 | `11-phase-incident-response.md:486` | You have an image of a Windows 10 workstation, and a hypothesis: the user opened a malicious document, and something executed. | **UNVERIFIABLE** — scenario description |
| 6 | `11-phase-incident-response.md:688` ▶ | └── Target VM — Windows 10 evaluation, 4 GB RAM, snapshot taken | **UNVERIFIABLE** — scenario description |
| | | <sub>↑ │ Internet access is fine; it holds no malware<br>↓ Host-only network. No shared folders.</sub> | |
| 7 | `11-phase-incident-response.md:991` | \| Host \| `WKS-014`, Windows 10, user `LAB\jsantos` \| | **UNVERIFIABLE** — scenario description |
| | | <sub>↑ \| Alert \| Suspicious process execution from a user temp directory \|<br>↓ \| Detection \| EDR rule firing on `svchost.exe` running from `AppData\Local\Temp` \|</sub> | |
| 8 | `12-phase-scripting-automation.md:1240` ▶ | - Python 3.10 or newer | **OK** — Python 3.10 is a specific release; “3.10 or newer” is a valid version requirement. |
| | | <sub>↓ - A VirusTotal API key (the free public API is sufficient)</sub> | |
| 9 | `13-phase-grc-compliance.md:164` | \| **Baseline** \| The configured state of a system type \| Varies \| With each platform version \| "Windows 11 hardening baseline, v3." \| | **UNVERIFIABLE** — definition plus example |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Registry paths, file paths and filenames

*Verbatim strings that must match the OS exactly. A transposed path sends a reader somewhere that does not exist.*

**Source to check against:** Microsoft documentation, or the OS itself

47 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:203` | The **asset** is an old web server. The **vulnerability** is a known flaw in an outdated version of its software, published as CVE-2021-41773 in Apache's HTTP Server. The **threat** is an attacker scanning the internet for that exact version. The **exploit** i … | **OK** — NVD: “CVE-2021-41773: A flaw was found in a change made to path normalization in Apache HTTP Server 2.4.49.” |
| 2 | `01-phase-foundations.md:840` | **Why:** The exploit is the specific technique or piece of code that takes advantage of a vulnerability, and the crafted URL is exactly that. The vulnerability is the flaw in the outdated Apache version itself — it exists whether or not anyone writes a URL. Th … | |
| 3 | `02-phase-networking-and-linux.md:55` | - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog` | |
| | | <sub>↑ - Services with `systemctl`<br>↓ - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file</sub> | |
| 4 | `02-phase-networking-and-linux.md:89` | On Windows, network configuration is buried in GUI dialogs, and logging is abstracted away. On Linux, you type `ip a` and see your interfaces. You type `ss -tulpn` and see every listening service with the process that owns it. You read `/var/log/auth.log` to w … | |
| 5 | `02-phase-networking-and-linux.md:517` | \| **`/etc`** \| `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configuration), `/etc/hosts` \| Configuration is where misconfiguration is found \| | |
| 6 | `02-phase-networking-and-linux.md:518` | \| **`/var/log`** \| The logs you will investigate \| The evidence lives here \| | |
| | | <sub>↑ \| **`/etc`** \| `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configurati …<br>↓ \| **`/tmp`** \| Temporary files \| World-writable, which makes it a favourite location for attackers to stage files, because anything can be written  …</sub> | |
| 7 | `02-phase-networking-and-linux.md:625` | Every `sudo` invocation is logged, which is why it also serves the **accounting** part of AAA. Reading `/etc/sudoers` shows who has been granted what — and a common finding in security reviews is that far too many users are in the sudo group. | |
| 8 | `02-phase-networking-and-linux.md:645` | Reading `/etc/passwd` carefully is a genuinely useful skill. Two fields carry the security meaning. | |
| 9 | `02-phase-networking-and-linux.md:652` | \| **Login shell** \| `/usr/sbin/nologin` \| The account exists but cannot log in interactively — how service accounts are locked down \| | |
| 10 | `02-phase-networking-and-linux.md:661` | **SSH** gives you an encrypted shell on a remote machine. The server is `sshd` — the SSH *daemon*, where a daemon is a background service. It is configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default. | |
| 11 | `02-phase-networking-and-linux.md:738` | \| `/var/log/auth.log` \| Authentication: logins, `sudo` use, SSH attempts (Debian/Ubuntu) \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `/var/log/secure` \| The same role on RHEL/CentOS family \|</sub> | |
| 12 | `02-phase-networking-and-linux.md:739` | \| `/var/log/secure` \| The same role on RHEL/CentOS family \| | |
| | | <sub>↑ \| `/var/log/auth.log` \| Authentication: logins, `sudo` use, SSH attempts (Debian/Ubuntu) \|<br>↓ \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \|</sub> | |
| 13 | `02-phase-networking-and-linux.md:740` | \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \| | |
| | | <sub>↑ \| `/var/log/secure` \| The same role on RHEL/CentOS family \|<br>↓ \| `/var/log/messages` \| General system messages (RHEL/CentOS) \|</sub> | |
| 14 | `02-phase-networking-and-linux.md:741` | \| `/var/log/messages` \| General system messages (RHEL/CentOS) \| | |
| | | <sub>↑ \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \|<br>↓ \| `/var/log/apache2/`, `/var/log/nginx/` \| Web server access and error logs \|</sub> | |
| 15 | `02-phase-networking-and-linux.md:742` | \| `/var/log/apache2/`, `/var/log/nginx/` \| Web server access and error logs \| | |
| | | <sub>↑ \| `/var/log/messages` \| General system messages (RHEL/CentOS) \|</sub> | |
| 16 | `02-phase-networking-and-linux.md:757` | Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`. | |
| 17 | `02-phase-networking-and-linux.md:839` | `zgrep` searches compressed logs too. On a system that has been running a while, `/var/log/auth.log` is only the most recent slice, and the earlier evidence is in `auth.log.1.gz`, `auth.log.2.gz` and so on. `auth.log*` catches all of them. | |
| 18 | `02-phase-networking-and-linux.md:1140` | - **`/etc/passwd` UID 0 is root, and nothing else should be.** A non-root account with UID 0 is a backdoor; a service account with `/bin/bash` where `nologin` belongs is a misconfiguration. | |
| 19 | `02-phase-networking-and-linux.md:1152` | 2. **Then permissions** (task 2), because they are the foundation of Linux security thinking. Create two users, put them in a group, create a file, and try to read it as the wrong user. Read `/etc/passwd` and find the UID field. Being denied access is the less … | |
| 20 | `02-phase-networking-and-linux.md:1153` | 3. **Then SSH** (task 3), which turns your VM into a remote system you can work with comfortably. Set up keys, not just passwords, and read `/etc/ssh/sshd_config` while you are there. | |
| 21 | `02-phase-networking-and-linux.md:1244` | **Why:** Service accounts exist to run processes, not to be logged into, so the expected value is `/usr/sbin/nologin`. An interactive shell on one is a finding because it is an account an attacker can actually log in as, and service accounts are frequently wea … | |
| 22 | `02-phase-networking-and-linux.md:1325` | **Why:** `-u sshd` matches a systemd unit by that exact name, and on some distributions the unit is `ssh.service` rather than `sshd.service`, so the filter matches nothing. Separately, not every distribution routes SSH into the journal — Debian and Ubuntu fami … | |
| 23 | `03-phase-security-fundamentals.md:302` | In Linux the equivalent evidence lives where Phase 2 showed you: `/var/log/auth.log` or `/var/log/secure`, read through `journalctl -u sshd`. | |
| 24 | `03-phase-security-fundamentals.md:393` | \| `C:\Windows\System32\svchost.exe` \| The real one \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `C:\Users\Public\svchost.exe` \| Not the real one \|</sub> | |
| 25 | `03-phase-security-fundamentals.md:394` | \| `C:\Users\Public\svchost.exe` \| Not the real one \| | |
| | | <sub>↑ \| `C:\Windows\System32\svchost.exe` \| The real one \|</sub> | |
| 26 | `03-phase-security-fundamentals.md:408` | \| **Registry Run keys** \| `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` and its `HKLM` equivalent \| Causes a program to start at login. The classic location, and still heavily used \| | |
| 27 | `03-phase-security-fundamentals.md:431` | \| **Processes from odd locations** \| `C:\Users\Public\`, `C:\Temp\`, `%APPDATA%`, or `/tmp` on Linux \| Legitimate system binaries do not run from user-writable directories; that is the whole point of the expectation \| | |
| 28 | `03-phase-security-fundamentals.md:1208` | **Why:** The phase's masquerading section makes predictability the detection: the real `svchost.exe` lives in `C:\Windows\System32`, and legitimate binaries run from their expected directories, which is exactly what makes impersonation visible. The parent-proc … | |
| 29 | `04-phase-hands-on-labs.md:452` | \| **The agent checks in but no events arrive** \| The log file is not in the agent's configuration, or nothing is being written to it \| On the victim, generate an event and confirm it appears in `/var/log/auth.log` \| Add the log location to `ossec.conf` on  … | |
| 30 | `04-phase-hands-on-labs.md:544` | \| 2 \| **Find it in the raw log** on the victim (`/var/log/auth.log`, or Event Viewer) \| Proving it exists *at the source* is what lets you isolate a forwarding failure from a detection failure \| | |
| 31 | `10-phase-detection-engineering.md:41` | - Linux auditd rules and `/var/log/auth.log` interpretation | |
| | | <sub>↑ - Sysmon event IDs: 1, 3, 7, 8, 10, 11, 12, 13, 22<br>↓ - Syslog facilities, priorities, and severity</sub> | |
| 32 | `10-phase-detection-engineering.md:217` | \| SSH authentication \| Linux \| `/var/log/auth.log` \| High \| | |
| | | <sub>↑ \| Command executed as root \| Linux auditd \| `execve` with `auid=0` or a sudo tag \| Medium, depends on rules \|<br>↓ \| Cron job created \| Linux \| auditd file watch on `/etc/cron*` \| High \|</sub> | |
| 33 | `10-phase-detection-engineering.md:218` | \| Cron job created \| Linux \| auditd file watch on `/etc/cron*` \| High \| | |
| | | <sub>↑ \| SSH authentication \| Linux \| `/var/log/auth.log` \| High \|<br>↓ \| Web request \| Web server access log \| Request line, status, user agent \| High \|</sub> | |
| 34 | `10-phase-detection-engineering.md:349` | \| `/var/log/auth.log` or `/var/log/secure` \| Authentication, sudo, SSH, su \| Plain text, one event per line \| | |
| 35 | `10-phase-detection-engineering.md:352` | \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \| | |
| | | <sub>↑ \| `journald` \| Systemd service logs, kernel messages \| `journalctl` with filters \|<br>↓ \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \|</sub> | |
| 36 | `10-phase-detection-engineering.md:353` | \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \| | |
| | | <sub>↑ \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \|<br>↓ \| Cron \| Scheduled job definitions and execution \| `/var/log/cron` or journald \|</sub> | |
| 37 | `10-phase-detection-engineering.md:354` | \| Cron \| Scheduled job definitions and execution \| `/var/log/cron` or journald \| | |
| | | <sub>↑ \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \|</sub> | |
| 38 | `10-phase-detection-engineering.md:358` | The auditd rules worth writing first, because they cover the persistence and privilege-escalation behaviours that matter. Put them in `/etc/audit/rules.d/10-lab.rules`, load them with `augenrules --load`, and confirm they are live with `auditctl -l` — a rule t … | |
| 39 | `10-phase-detection-engineering.md:1113` | \| auditd \| Linux syscall and file auditing \| Free/open-source \| https://man7.org/linux/man-pages/man8/auditd.8.html \| Write file watches for `/etc/passwd` and `/etc/cron.d` \| journald with targeted filters \| | |
| 40 | `11-phase-incident-response.md:456` | \| **Prefetch** \| `C:\Windows\Prefetch` \| Which programs ran, when, and how often \| | |
| | | <sub>↑ \| **USN Journal** \| `$Extend\$UsnJrnl` \| What changed, in order, with reasons — created, written, renamed, deleted \|<br>↓ \| **ShimCache** \| Registry `AppCompatCache` \| Which executables existed on the system, even if deleted \|</sub> | |
| 41 | `11-phase-incident-response.md:458` | \| **AmCache** \| `C:\Windows\AppCompat\Programs\Amcache.hve` \| Program execution with SHA-1 hashes and install paths \| | **OK** — Forensics documentation: Amcache.hve in C:\Windows\AppCompat\Programs stores path, size, compile time and SHA-1 hash. |
| 42 | `11-phase-incident-response.md:462` | \| **Event logs** \| `C:\Windows\System32\winevt\Logs` \| Security, System, Application, and Sysmon records \| | |
| 43 | `11-phase-incident-response.md:512` | \| 09:11:40 \| LNK / Jump list \| `Invoice_4421.docm` opened from `C:\Users\jsantos\Downloads` \| | |
| | | <sub>↑ \| 09:04:12 \| Security 4624 type 2 \| User `LAB\jsantos` logs on interactively \|<br>↓ \| 09:11:44 \| Sysmon 11 \| `C:\Users\jsantos\AppData\Local\Temp\kx8f.tmp` created \|</sub> | |
| 44 | `11-phase-incident-response.md:513` | \| 09:11:44 \| Sysmon 11 \| `C:\Users\jsantos\AppData\Local\Temp\kx8f.tmp` created \| | |
| | | <sub>↑ \| 09:11:40 \| LNK / Jump list \| `Invoice_4421.docm` opened from `C:\Users\jsantos\Downloads` \|<br>↓ \| 09:11:46 \| Sysmon 1 \| `WINWORD.EXE` spawns `powershell.exe -nop -w hidden -enc ...` \|</sub> | |
| 45 | `11-phase-incident-response.md:952` | \| "Looked at the disk, found malware" \| "Mounted `/evidence/disk.img` read-only at 14:05 UTC. Ran `fls -o 1048576 -r -m C:/`; output to `bodyfile.txt`. Identified `C:\Users\jsantos\AppData\Local\Temp\svchost.exe` with an MFT creation timestamp of 2026-03-14  … | |
| 46 | `12-phase-scripting-automation.md:854` | The filters in commands 5 and 6 are doing the analytical work. A service whose binary lives outside `C:\Windows` is worth looking at; a scheduled task that has *run* recently on a machine nobody changed is worth looking at. | |
| 47 | `12-phase-scripting-automation.md:1133` | **What it got wrong.** Three weeks later, a real intrusion is found during an unrelated review. The entry point was a signed binary dropped into `C:\Program Files\Corp\`, with its timestamps set back by the attacker so the file appeared months old. The matchin … | |

---

## Stated counts, sizes and arithmetic

*Checkable by RECOMPUTATION, which needs no source at all — the strongest tier of verification available.*

**Source to check against:** Recomputation from the document's own numbers

**138 claim(s) — already verified by recomputation, not listed.**

See "Already verified, without needing a source" above. Re-run the verifying script if you
doubt it; do not re-check these by hand.

---

## CVE identifiers and vulnerability claims

*A CVE ID resolves to exactly one published record. The ID, the affected product, and the described impact are all fixed by that record — and an ID paired with the wrong product is a fabrication that reads as authoritative.*

**Source to check against:** The NVD or the vendor advisory for that CVE

4 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:203` | The **asset** is an old web server. The **vulnerability** is a known flaw in an outdated version of its software, published as CVE-2021-41773 in Apache's HTTP Server. The **threat** is an attacker scanning the internet for that exact version. The **exploit** i … | **OK** — NVD: “CVE-2021-41773: A flaw was found in a change made to path normalization in Apache HTTP Server 2.4.49.” |
| 2 | `01-phase-foundations.md:629` | Go to the National Vulnerability Database (nvd.nist.gov) and search for **CVE-2021-41773**, the Apache path-traversal flaw used as an example earlier in this lesson. | **OK** — NVD: CVE-2021-41773 is the Apache HTTP Server path traversal flaw. |
| 3 | `03-phase-security-fundamentals.md:723` | \| **CVE** \| Common Vulnerabilities and Exposures \| *Which vulnerability is this?* \| `CVE-2021-44228` \| | **OK** — NVD: CVE-2021-44228 is Log4Shell; the table correctly identifies CVE as an identifier format. |
| | | <sub>↑ \|---\|---\|---\|---\|<br>↓ \| **CVSS** \| Common Vulnerability Scoring System \| *How bad is it technically?* \| 0.0 to 10.0 \|</sub> | |
| 4 | `03-phase-security-fundamentals.md:740` | CVSS is computed from characteristics like whether the attack is remote, whether authentication is needed, and what the impact on confidentiality, integrity, and availability is. Note that this is the CIA triad from Phase 1 appearing inside the scoring formula … | **OK** — FIRST: CVSS metrics include Attack Vector, Privileges Required, and C/I/A Impact. |

---

## MITRE ATT&CK technique identifiers

*A technique ID resolves to one entry in a versioned, published matrix. The ID and its technique name are both fixed, and the matrix is renumbered between versions.*

**Source to check against:** The MITRE ATT&CK matrix for the named technique ID

34 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:502` | \| **Technique** \| A specific way of achieving that goal \| **T1566 Phishing** under the Initial Access tactic \| | |
| 2 | `01-phase-foundations.md:504` | When you see a phishing email, mapping it to T1566 joins your observation to a global, consistent vocabulary. That is why one of this phase's practice tasks is to pick five techniques and explain them. | |
| 3 | `01-phase-foundations.md:676` | \| Initial Access \| Phishing (T1566) \| Get a foothold by convincing a user to act \| Mail filters, user reports, suspicious sender domains \| | |
| 4 | `03-phase-security-fundamentals.md:387` | That last row introduces **masquerading** — naming a malicious file after a legitimate system process to blend in. It is a MITRE ATT&CK technique (T1036). | |
| 5 | `03-phase-security-fundamentals.md:875` | \| 02:14:03 \| Phishing email delivered to `j.dela+cruz@example.com` \| Mail gateway log \| Initial access attempt (ATT&CK T1566) \| | |
| 6 | `03-phase-security-fundamentals.md:890` | \| ATT&CK T1566 mapping \| Phase 1 \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Event IDs 4624 and 4688, logon types 3 and 10 \| Part 1 \|</sub> | |
| 7 | `04-phase-hands-on-labs.md:494` ▶ | <id>T1110</id> | |
| | | <sub>↑ <mitre><br>↓ </mitre></sub> | |
| 8 | `04-phase-hands-on-labs.md:506` | - **`mitre`** — maps the detection to **T1110, Brute Force** in MITRE ATT&CK. Phase 1 introduced ATT&CK as a shared vocabulary; this is what using it looks like in practice. It means an analyst who sees this alert immediately knows what class of behaviour it r … | |
| 9 | `10-phase-detection-engineering.md:152` | **T1059.001 — Command and Scripting Interpreter: PowerShell.** | |
| 10 | `10-phase-detection-engineering.md:508` | **ATT&CK T1543.003 — Create or Modify System Process: Windows Service.** | |
| 11 | `10-phase-detection-engineering.md:553` ▶ | - https://attack.mitre.org/techniques/T1059/001/ | |
| | | <sub>↑ references:<br>↓ author: Your Name</sub> | |
| 12 | `10-phase-detection-engineering.md:633` ▶ | <id>T1059.001</id> | |
| | | <sub>↑ <mitre><br>↓ </mitre></sub> | |
| 13 | `10-phase-detection-engineering.md:735` ▶ | Invoke-AtomicTest T1543.003 -ShowDetailsBrief | |
| | | <sub>↑ # List the atomic tests for one technique, without running anything.</sub> | |
| 14 | `10-phase-detection-engineering.md:738` ▶ | Invoke-AtomicTest T1543.003 -TestNumbers 1 | |
| | | <sub>↑ # Run one test.</sub> | |
| 15 | `10-phase-detection-engineering.md:741` ▶ | Invoke-AtomicTest T1543.003 -TestNumbers 1 -Cleanup | |
| | | <sub>↑ # Clean up after the test, which also tests your rule's noise profile.<br>↓ ```</sub> | |
| 16 | `10-phase-detection-engineering.md:757` ▶ | ATT&CK T1059.001 | |
| | | <sub>↑ Title Encoded PowerShell outside known management tools</sub> | |
| 17 | `10-phase-detection-engineering.md:760` ▶ | Command Invoke-AtomicTest T1059.001 -TestNumbers 1 | |
| | | <sub>↑ True positive test<br>↓ Result Rule fired 4 seconds after execution</sub> | |
| 18 | `10-phase-detection-engineering.md:848` | A learner writes a rule for T1110, brute force: alert when more than five failed logons occur for one account within five minutes. | |
| 19 | `10-phase-detection-engineering.md:909` | \| **Technique** \| *How* they achieve the goal \| T1059 Command and Scripting Interpreter \| | |
| | | <sub>↑ \| **Tactic** \| The attacker's goal — the *why* \| Execution, Persistence, Credential Access \|<br>↓ \| **Sub-technique** \| A specific variant \| T1059.001 PowerShell \|</sub> | |
| 20 | `10-phase-detection-engineering.md:910` | \| **Sub-technique** \| A specific variant \| T1059.001 PowerShell \| | |
| | | <sub>↑ \| **Technique** \| *How* they achieve the goal \| T1059 Command and Scripting Interpreter \|<br>↓ \| **Procedure** \| The specific implementation an actor used \| `powershell.exe -enc <base64>` in a macro \|</sub> | |
| 21 | `10-phase-detection-engineering.md:919` | \| "We detect T1059.001" \| "We detect T1059.001 via the encoded-command procedure. Non-encoded PowerShell is not covered by this rule and is covered only by process-creation logging." \| | |
| 22 | `10-phase-detection-engineering.md:920` | \| "T1059 — covered" \| "T1059 partially covered by one sub-technique. T1059.003 (Windows Command Shell) is not covered." \| | |
| 23 | `10-phase-detection-engineering.md:931` | \| Initial Access \| T1566 Phishing \| .001 Attachment \| — \| **None** \| No email gateway feed into the SIEM \| | |
| 24 | `10-phase-detection-engineering.md:932` | \| Execution \| T1059 \| .001 PowerShell \| DET-003 \| Partial \| Encoded only; plain PowerShell not covered \| | |
| 25 | `10-phase-detection-engineering.md:933` | \| Execution \| T1059 \| .003 Windows Command Shell \| — \| **None** \| Planned, low priority \| | |
| | | <sub>↑ \| Execution \| T1059 \| .001 PowerShell \| DET-003 \| Partial \| Encoded only; plain PowerShell not covered \|<br>↓ \| Persistence \| T1543 \| .003 Windows Service \| DET-001 \| **Good** \| Signature checks not yet implemented \|</sub> | |
| 26 | `10-phase-detection-engineering.md:934` | \| Persistence \| T1543 \| .003 Windows Service \| DET-001 \| **Good** \| Signature checks not yet implemented \| | |
| 27 | `10-phase-detection-engineering.md:935` | \| Persistence \| T1053 \| .005 Scheduled Task \| DET-006 \| Partial \| Linux cron covered; Windows tasks partial \| | |
| 28 | `10-phase-detection-engineering.md:936` | \| Persistence \| T1136 \| .001 Local Account \| DET-002 \| **Good** \| Requires correlation with the group-change rule \| | |
| 29 | `10-phase-detection-engineering.md:937` | \| Privilege Escalation \| T1098 \| .001 Account Manipulation \| DET-002 \| **Good** \| — \| | |
| | | <sub>↑ \| Persistence \| T1136 \| .001 Local Account \| DET-002 \| **Good** \| Requires correlation with the group-change rule \|<br>↓ \| Credential Access \| T1003 \| .001 LSASS Memory \| DET-004 \| Partial \| Heavily filtered; a documented bypass exists \|</sub> | |
| 30 | `10-phase-detection-engineering.md:938` | \| Credential Access \| T1003 \| .001 LSASS Memory \| DET-004 \| Partial \| Heavily filtered; a documented bypass exists \| | |
| 31 | `10-phase-detection-engineering.md:939` | \| Discovery \| T1087 \| .001 Account Discovery \| — \| **None** \| Not detected \| | |
| | | <sub>↑ \| Credential Access \| T1003 \| .001 LSASS Memory \| DET-004 \| Partial \| Heavily filtered; a documented bypass exists \|<br>↓ \| Command and Control \| T1071 \| .001 Web Protocols \| DET-008 \| Partial \| DNS-based only \|</sub> | |
| 32 | `10-phase-detection-engineering.md:940` | \| Command and Control \| T1071 \| .001 Web Protocols \| DET-008 \| Partial \| DNS-based only \| | |
| | | <sub>↑ \| Discovery \| T1087 \| .001 Account Discovery \| — \| **None** \| Not detected \|<br>↓ \| Exfiltration \| T1041 \| — \| — \| **None** \| No egress anomaly baseline \|</sub> | |
| 33 | `10-phase-detection-engineering.md:941` | \| Exfiltration \| T1041 \| — \| — \| **None** \| No egress anomaly baseline \| | |
| | | <sub>↑ \| Command and Control \| T1071 \| .001 Web Protocols \| DET-008 \| Partial \| DNS-based only \|</sub> | |
| 34 | `10-phase-detection-engineering.md:991` ▶ | ATT&CK T1059.001 | |
| | | <sub>↑ Level High<br>↓ Author / date Your Name, 2026-03-11</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Standards, frameworks and control identifiers

*NIST SP numbers, ISO/IEC numbers, PCI DSS requirements and OWASP categories are versioned documents with fixed numbering. A wrong control number points a reader at the wrong requirement.*

**Source to check against:** The published standard itself (NIST CSRC, ISO, PCI SSC, OWASP)

105 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:44` | - Basic frameworks: NIST CSF, MITRE ATT&CK, OWASP Top 10 | **UNVERIFIABLE** — curriculum topic outline, not a claim about a standard's content |
| | | <sub>↑ - Legal/ethical boundaries</sub> | |
| 2 | `01-phase-foundations.md:478` | \| **NIST CSF** \| Organises security work into six functions: Govern, Identify, Protect, Detect, Respond, Recover \| A coverage checklist. It shows you which part of the job an organisation is neglecting \| | **OK** — NIST: “The CSF 2.0 is organized by six Functions — Govern, Identify, Protect, Detect, Respond, and Recover.” |
| 3 | `01-phase-foundations.md:480` | \| **OWASP Top 10** \| The ten most critical web application security risks, maintained by the Open Worldwide Application Security Project \| Web-specific. Because your background includes web development, this is the framework you are best positioned to under … | **OK** — OWASP: the Top 10 is “The Ten Most Critical Web Application Security Risks.” |
| 4 | `01-phase-foundations.md:510` | It is genuinely useful in interviews. Being able to say “I have read the OWASP Top 10 and I understand why injection happens when you concatenate user input into a query” is a concrete, verifiable claim. | **UNVERIFIABLE** — pedagogical advice about interview preparation |
| 5 | `01-phase-foundations.md:737` | - **Frameworks are shared vocabularies.** NIST CSF is a coverage checklist, MITRE ATT&CK describes attacker behaviour, OWASP Top 10 covers web risk specifically. | **UNVERIFIABLE** — pedagogical characterisation of three frameworks |
| 6 | `01-phase-foundations.md:746` | 3. **Read the OWASP Top 10 through the lens of your web development background** (task 4). You have an advantage here over most beginners: you have probably written code that was vulnerable to injection without knowing it. Write your summary with that in mind. | **UNVERIFIABLE** — curriculum instruction |
| 7 | `01-phase-foundations.md:749` | 6. **Close with the NIST CSF task** (task 7) and read your own one-page summary back. If you can explain all six functions using an example of your own rather than one from this lesson, the phase's exit criteria are met and you are ready for Phase 2. | **OK** — NIST: CSF 2.0 has six functions — Govern, Identify, Protect, Detect, Respond, Recover. |
| 8 | `01-phase-foundations.md:760` | \| NIST CSF \| Security framework \| Free \| https://www.nist.gov/cyberframework \| Summarize Govern/Identify/Protect/Detect/Respond/Recover \| CIS Controls \| | **OK** — NIST: the six functions are correctly listed. |
| 9 | `01-phase-foundations.md:767` | - OWASP Top 10 — https://owasp.org/www-project-top-ten/ | **OK** — owasp.org — resolves to the official Top 10 project page. |
| | | <sub>↑ - MITRE ATT&CK — https://attack.mitre.org/<br>↓ - CISA security tips — https://www.cisa.gov/news-events/news/cybersecurity-tips</sub> | |
| 10 | `01-phase-foundations.md:776` | 4. Read OWASP Top 10 and summarize each risk in 2–3 sentences. <!-- id: cyber-01-t04 band: focused energy: normal --> | **UNVERIFIABLE** — curriculum task instruction |
| 11 | `01-phase-foundations.md:779` | 7. Read NIST CSF and write one example control for each function. <!-- id: cyber-01-t07 band: focused energy: normal --> | **UNVERIFIABLE** — curriculum task instruction |
| 12 | `01-phase-foundations.md:786` | - OWASP Top 10 summary | **UNVERIFIABLE** — deliverable description |
| | | <sub>↑ - 50-term glossary<br>↓ - 5 MITRE technique summaries</sub> | |
| 13 | `01-phase-foundations.md:789` | - NIST CSF one-page summary | **UNVERIFIABLE** — deliverable description |
| | | <sub>↑ - One phishing analysis report</sub> | |
| 14 | `03-phase-security-fundamentals.md:29` | - Map simple attacks to MITRE ATT&CK and OWASP Top 10. | **UNVERIFIABLE** — curriculum learning objective |
| | | <sub>↑ - Understand common weaknesses and controls.</sub> | |
| 15 | `03-phase-security-fundamentals.md:58` | - OWASP Top 10 | **UNVERIFIABLE** — topic outline |
| | | <sub>↓ - SQL injection concept</sub> | |
| 16 | `03-phase-security-fundamentals.md:558` | The OWASP Top 10 was introduced in Phase 1 as a shared vocabulary. This part is where you learn to actually find and reason about the categories, and where your web development history becomes an asset. | **UNVERIFIABLE** — curriculum narrative |
| 17 | `03-phase-security-fundamentals.md:652` | **Broken access control** is the wider category — the OWASP Top 10's number one entry in recent editions. It covers IDOR plus two related bugs. | **OK** — OWASP: A01:2021 is Broken Access Control, the number one entry. |
| 18 | `03-phase-security-fundamentals.md:781` | This is why CIS Controls puts inventory as Control 1 — first, before anything else — and why the phase's task asks you to map five controls to your home lab. Start where you are: for your home lab, list every machine, its OS, its services, and its purpose. Tha … | **OK** — CIS: Critical Security Controls v8 Control 1 is “Inventory and Control of Enterprise Assets.” |
| 19 | `03-phase-security-fundamentals.md:1031` | If you have an old project, you will almost certainly find that your session cookie lacks `HttpOnly`. That discovery is worth more than reading the OWASP Top 10, because you found it yourself in your own code. | **UNVERIFIABLE** — pedagogical opinion |
| 20 | `03-phase-security-fundamentals.md:1127` | \| CIS Controls \| Security controls framework \| Free \| https://www.cisecurity.org/controls \| Map 5 controls to home lab \| NIST CSF \| | **OK** — cisecurity.org — CIS Controls are freely available at the cited URL. |
| 21 | `03-phase-security-fundamentals.md:1131` | - OWASP Top 10 — https://owasp.org/www-project-top-ten/ | **OK** — owasp.org — resolves to the official Top 10 project page. |
| | | <sub>↓ - PortSwigger Web Security Academy — https://portswigger.net/web-security</sub> | |
| 22 | `03-phase-security-fundamentals.md:1135` | - CIS Controls — https://www.cisecurity.org/controls | **OK** — cisecurity.org — resolves to the official CIS Controls page. |
| | | <sub>↑ - Wazuh documentation — https://documentation.wazuh.com/<br>↓ - Microsoft security documentation — https://learn.microsoft.com/en-us/security/</sub> | |
| 23 | `05-phase-specialization-choice.md:835` | A pivot from SOC to GRC is mostly a **re-framing** exercise. Your Wazuh lab report becomes a control-effectiveness case study: the detection rule is a detective control, its tuning is a control gap you identified and closed, and the findings map to CIS Control … | **UNVERIFIABLE** — career-advice narrative |
| 24 | `05-phase-specialization-choice.md:937` | \| NIST CSF \| GRC framework \| Free \| https://www.nist.gov/cyberframework \| Map 10 controls \| CIS Controls \| | **OK** — NIST CSF is freely available at the cited URL. |
| 25 | `05-phase-specialization-choice.md:938` | \| CIS Controls \| Control framework \| Free \| https://www.cisecurity.org/controls \| Create small-business checklist \| NIST CSF \| | **OK** — CIS Controls are freely available at the cited URL. |
| 26 | `05-phase-specialization-choice.md:950` | - NIST CSF — https://www.nist.gov/cyberframework | **OK** — nist.gov — resolves to the official CSF page. |
| | | <sub>↑ - PortSwigger Academy — https://portswigger.net/web-security<br>↓ - CIS Controls — https://www.cisecurity.org/controls</sub> | |
| 27 | `05-phase-specialization-choice.md:951` | - CIS Controls — https://www.cisecurity.org/controls | **OK** — cisecurity.org — resolves to the official CIS Controls page. |
| | | <sub>↑ - NIST CSF — https://www.nist.gov/cyberframework<br>↓ - OWASP Web Security Testing Guide — https://owasp.org/www-project-web-security-testing-guide/</sub> | |
| 28 | `11-phase-incident-response.md:39` | - NIST SP 800-61 incident response lifecycle: preparation, detection and analysis, containment, eradication, recovery, post-incident activity | **OK** — NIST SP 800-61 Rev. 3: the life cycle model is Detect, Respond, Recover. |
| 29 | `11-phase-incident-response.md:117` | The canonical model is NIST SP 800-61, and it is worth learning by its real names because interviewers use them. **Note the revision:** SP 800-61 Rev. 3 (April 2025) superseded Rev. 2, and it restates these same stages as the *previous* life cycle model before … | **OK** — NIST: SP 800-61 Rev. 3 was published in 2025 and supersedes Rev. 2. |
| 30 | `11-phase-incident-response.md:1210` | - NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management — https://csrc.nist.gov/pubs/sp/800/61/r3/final | **OK** — csrc.nist.gov — resolves to the SP 800-61 Rev. 3 publication page. |
| 31 | `11-phase-incident-response.md:1211` | - NIST SP 800-86 Guide to Integrating Forensic Techniques into Incident Response — https://csrc.nist.gov/pubs/sp/800/86/final | **OK** — csrc.nist.gov — resolves to the SP 800-86 publication page. |
| 32 | `11-phase-incident-response.md:1389` | Volatility 3, Autopsy and The Sleuth Kit, FTK Imager, dc3dd, Eric Zimmerman's parsers, Plaso, CyberChef, WinPmem, and the SIFT Workstation together cover every technique this phase teaches, and every one of them is free and open source or free for the professi … | **UNVERIFIABLE** — curriculum tool-coverage and licensing claim |
| 33 | `13-phase-grc-compliance.md:29` | - Map a control to a framework such as ISO 27001, NIST CSF, SOC 2, PCI DSS, or HIPAA. | **UNVERIFIABLE** — learning objective |
| | | <sub>↑ - Build and score a risk register with a defined, defensible scale.<br>↓ - Write a policy a real employee could follow, and the standard it enforces.</sub> | |
| 34 | `13-phase-grc-compliance.md:33` | - Explain the privacy obligations in the Philippine Data Privacy Act and the GDPR in outline. | **UNVERIFIABLE** — learning objective |
| | | <sub>↑ - Assess a vendor's security posture with a questionnaire and a documented decision.<br>↓ - Describe how a junior GRC analyst actually spends their working day.</sub> | |
| 35 | `13-phase-grc-compliance.md:44` | - Control frameworks: ISO/IEC 27001 and Annex A, NIST CSF 2.0, CIS Controls, SOC 2 Trust Services Criteria, PCI DSS, HIPAA | **OK** — ISO: ISO/IEC 27001 is an ISMS standard with Annex A controls. |
| 36 | `13-phase-grc-compliance.md:51` | - Privacy: the Philippine Data Privacy Act of 2012, GDPR principles and data subject rights | **OK** — EU: GDPR (Regulation 2016/679) is the EU data protection law. |
| | | <sub>↑ - Third-party and vendor risk management, and the questionnaire<br>↓ - Business continuity and disaster recovery at a governance level</sub> | |
| 37 | `13-phase-grc-compliance.md:443` | \| **NIST CSF 2.0** \| A voluntary framework organised around six functions: Govern, Identify, Protect, Detect, Respond, Recover \| Any organisation, any size, any sector \| Free \| No — it is not a certification scheme \| | **OK** — NIST: “The CSF 2.0 is organized by six Functions — Govern, Identify, Protect, Detect, Respond, and Recover.” |
| 38 | `13-phase-grc-compliance.md:444` | \| **ISO/IEC 27001** \| An international standard for an information security management system, with Annex A controls \| Organisations wanting a certifiable management system \| The standard is paid \| **Yes** — certification by an accredited body \| | **OK** — ISO: “ISO/IEC 27001 is the world's best-known standard for information security management systems (ISMS).” |
| 39 | `13-phase-grc-compliance.md:445` | \| **CIS Controls** \| A prioritised set of 18 **Controls**, each broken into numbered **Safeguards**, with Implementation Groups for different maturity levels \| Organisations wanting a practical starting order \| Free \| No \| | **OK** — CIS: Controls v8 has 18 Controls with numbered Safeguards and Implementation Groups IG1–IG3. |
| 40 | `13-phase-grc-compliance.md:446` | \| **SOC 2** \| An attestation against the 2017 Trust Services Criteria (revised 2022) — security, availability, processing integrity, confidentiality, privacy \| Service organisations whose customers ask \| The criteria are free to read; the audit is not \| * … | **OK** — AICPA: SOC 2 examinations are against the Trust Services Criteria. |
| 41 | `13-phase-grc-compliance.md:447` | \| **PCI DSS** \| A mandatory standard for organisations handling card payments \| Anyone storing, processing, or transmitting card data \| Free to read \| **Yes** — compliance validated by an assessor or self-assessment \| | **OK** — PCI SSC: PCI DSS applies to all entities that store, process or transmit cardholder data. |
| 42 | `13-phase-grc-compliance.md:448` | \| **HIPAA** \| United States law governing protected health information \| Anyone handling US patient data \| Free \| No — it is law, not a scheme \| | **OK** — HHS: HIPAA is US law governing protected health information. |
| 43 | `13-phase-grc-compliance.md:449` | \| **GDPR** \| European Union law governing personal data of EU residents \| Anyone processing EU residents' data \| Free \| No \| | **OK** — EU: GDPR governs processing of EU residents' personal data. |
| 44 | `13-phase-grc-compliance.md:452` | **The certification column is the one that drives business decisions.** An organisation pursues ISO 27001 certification or a SOC 2 report because a customer, a tender, or a regulator requires it — not because the framework is better than the alternatives. | **UNVERIFIABLE** — business claim about organisational motivation |
| 45 | `13-phase-grc-compliance.md:454` | **One vocabulary trap worth knowing before you read any of them.** These frameworks each use the word "control" differently, and the CIS Controls are the easiest to get wrong. CIS has **18 Controls** — the numbered headings, such as *Control 1: Inventory and C … | **OK** — CIS: v8 has 18 Controls, each broken into Safeguards. |
| 46 | `13-phase-grc-compliance.md:456` | So when someone says "CIS Control 5", they mean a whole topic area, and when they say "Safeguard 5.3", they mean one specific thing to do. Mixing the two up in an interview is a small tell that you read a summary rather than the document. | **OK** — CIS: “Controls” names the 18 top-level categories; “Safeguards” the numbered items. |
| 47 | `13-phase-grc-compliance.md:458` | CIS also publishes **Implementation Groups (IG1, IG2, IG3)**, which are subsets of the Safeguards sized to an organisation's maturity and resources. IG1 is the basic hygiene set for a small organisation with limited security staff, and it is the sensible start … | **OK** — CIS: v8 defines three Implementation Groups as subsets of safeguards. |
| 48 | `13-phase-grc-compliance.md:518` | SOC 2 is not a standard you implement. It is a report an auditor produces about you, against the Trust Services Criteria. | **OK** — AICPA: SOC 2 is an attestation report produced by a CPA. |
| 49 | `13-phase-grc-compliance.md:534` | \| **PCI DSS** \| You store, process, or transmit cardholder data \| Twelve requirement groups covering network security, protection of stored data, access control, monitoring, and testing \| The card brands, through acquiring banks \| | **OK** — PCI SSC: PCI DSS has 12 core requirement groups. |
| 50 | `13-phase-grc-compliance.md:535` | \| **HIPAA** \| You handle protected health information of US individuals \| Administrative, physical, and technical safeguards, plus breach notification \| US Department of Health and Human Services \| | **OK** — HHS: the HIPAA Security Rule requires administrative, physical and technical safeguards. |
| 51 | `13-phase-grc-compliance.md:537` | \| **GDPR** \| You process personal data of EU residents \| Lawful basis, data subject rights, records of processing, breach notification within 72 hours of becoming aware where required \| EU supervisory authorities \| | **OK** — EU: GDPR Article 33 requires notification within 72 hours. |
| 52 | `13-phase-grc-compliance.md:539` | **On PCI DSS versions:** the current standard is v4.0.1, a limited revision of v4.0 that adds clarifications but no new or deleted requirements. v3.2.1 retired on 31 March 2024. The **future-dated** requirements inside v4 — the ones that were best practice at  … | **OK** — PCI SSC: v4.0.1 was published June 2024 as a limited revision of v4.0. |
| 53 | `13-phase-grc-compliance.md:541` | **One control satisfies several frameworks**, and this is the observation that makes control mapping efficient rather than exhausting. Note how the first row is worded: **wherever card data is reachable**, not "on remote access". PCI DSS v4.0 requires MFA for  … | **OK** — PCI SSC: v4.0 Requirement 8.5.1 requires MFA for all access into the CDE. |
| 54 | `13-phase-grc-compliance.md:543` | The identifiers in the right-hand column are framework-specific. `PR.AA`, `DE.CM` and `PR.AT` are NIST CSF categories; `CC1`–`CC9` are the SOC 2 Common Criteria (CC6 is logical access, CC7 is system operations, CC1 and CC2 cover the control environment and com … | **OK** — NIST CSF 2.0 includes PR.AA, DE.CM, PR.AT; SOC 2 Common Criteria are CC1–CC9. |
| 55 | `13-phase-grc-compliance.md:547` | \| Multi-factor authentication wherever card data is reachable \| NIST CSF PR.AA; ISO 27001 access control; PCI DSS requirement 8; SOC 2 CC6; a Data Privacy Act security measure \| | **OK** — PCI DSS Requirement 8 addresses MFA; NIST CSF PR.AA covers access control. |
| 56 | `13-phase-grc-compliance.md:548` | \| Centralised log collection with alerting \| NIST CSF DE.CM; ISO 27001 logging; PCI DSS requirement 10; SOC 2 CC7 \| | **OK** — PCI DSS Requirement 10 is “Log and monitor all access.” |
| 57 | `13-phase-grc-compliance.md:549` | \| Annual security awareness training with records \| NIST CSF PR.AT; ISO 27001 competence and awareness; PCI DSS requirement 12; SOC 2 CC1 and CC2 \| | **OK** — NIST CSF PR.AT covers “Awareness and Training.” |
| 58 | `13-phase-grc-compliance.md:638` | **The customer audit is the one that surprises people in a BPO or SaaS role**, and it is the reason SOC 2 exists. A large client will send a questionnaire, ask for evidence, and sometimes send an assessor. Answering those questionnaires accurately is a substan … | **UNVERIFIABLE** — career-advice narrative |
| 59 | `13-phase-grc-compliance.md:807` | \| **Payment processor** \| Card data and regulatory scope \| PCI DSS attestation of compliance \| | **OK** — PCI SSC: the Attestation of Compliance is the formal PCI DSS validation document. |
| | | <sub>↑ \| **Software vendor** \| Supply chain compromise \| Dependency scanning, patch process, vendor notification terms \|<br>↓ \| **Offshore BPO partner** \| Data protection and jurisdiction \| Data processing agreement, privacy assessment, audit rights \|</sub> | |
| 60 | `13-phase-grc-compliance.md:822` | \| **Certifications** \| Do you hold ISO 27001, SOC 2 Type II, or equivalent? \| "We follow industry best practice" \| | **UNVERIFIABLE** — vendor questionnaire guidance |
| 61 | `13-phase-grc-compliance.md:842` ▶ | SOC 2 Type II Yes — report dated 2025-11, no exceptions | **UNVERIFIABLE** — worked example in curriculum material |
| | | <sub>↑ Encryption at rest Yes — AES-256, stated<br>↓ Sub-processors disclosed Yes — three listed, one in a different jurisdiction</sub> | |
| 62 | `13-phase-grc-compliance.md:899` | If your employer serves European customers, GDPR applies to the personal data of EU residents regardless of where your organisation is. | **OK** — EU: GDPR applies to data subjects in the Union regardless of the controller's location. |
| 63 | `13-phase-grc-compliance.md:912` | \| Alignment between GDPR and the Philippine law \| Effect on your work \| | **UNVERIFIABLE** — table header |
| | | <sub>↓ \|---\|---\|</sub> | |
| 64 | `13-phase-grc-compliance.md:992` ▶ | 14:00 Vendor assessment: a new analytics tool. Read the SOC 2 report, | **UNVERIFIABLE** — worked example |
| | | <sub>↑ Chase two people who have not replied.<br>↓ note the sub-processors, and draft the decision record.</sub> | |
| 65 | `13-phase-grc-compliance.md:1019` ▶ | 15:00 Read the new NIST CSF mapping the auditor sent and check it | **UNVERIFIABLE** — worked example |
| | | <sub>↑ 13:00 Write up the workshop and update the register.<br>↓ against your control matrix.</sub> | |
| 66 | `13-phase-grc-compliance.md:1048` | \| Sharing a vendor's SOC 2 report \| Almost always restricted by the vendor's terms; check before circulating \| | **UNVERIFIABLE** — practical advice |
| 67 | `13-phase-grc-compliance.md:1094` | \| **Control matrix** \| Map ten controls to NIST CSF 2.0 subcategories, plus a second column showing the ISO 27001 or PCI DSS requirement each also satisfies \| | **UNVERIFIABLE** — deliverable description |
| 68 | `13-phase-grc-compliance.md:1121` | \| "Which framework would you use?" \| "It depends on what the business needs to demonstrate" — then name the trigger: a customer asking for SOC 2, a tender requiring ISO 27001, card payments requiring PCI DSS \| | **UNVERIFIABLE** — interview advice |
| 69 | `13-phase-grc-compliance.md:1198` | Ten controls mapped to NIST CSF 2.0, plus the second framework each also satisfies. Note that three rows are not "pass". | **UNVERIFIABLE** — deliverable description |
| 70 | `13-phase-grc-compliance.md:1273` | \| Independent assurance? \| SOC 2 report from 2023 \| Acceptable with **condition** — request the current report at renewal \| | **UNVERIFIABLE** — worked example |
| 71 | `13-phase-grc-compliance.md:1277` | **Residual risk accepted:** the 2023 SOC 2 report does not cover the current year. Accepted by the Compliance Manager, recorded in the risk register as R-05, with re-review at contract renewal. | **UNVERIFIABLE** — worked example |
| 72 | `13-phase-grc-compliance.md:1296` | - **Learn NIST CSF 2.0 first.** It is free, sector-neutral, and its six functions are the vocabulary the field actually uses. | **OK** — NIST: CSF 2.0 is freely available and organised by six functions. |
| 73 | `13-phase-grc-compliance.md:1298` | - **SOC 2 Type II tests operating effectiveness over a period**; Type I tests design at a point in time, and customers ask for Type II. | **OK** — AICPA: SOC 2 Type II tests operating effectiveness over a period. |
| 74 | `13-phase-grc-compliance.md:1316` | 4. **Read one framework properly** (task 4) — NIST CSF 2.0 is the right choice — and write down ten subcategory identifiers with your own paraphrase of each. Do not attempt to learn all of them; learn how the structure works. | **UNVERIFIABLE** — curriculum advice |
| 75 | `13-phase-grc-compliance.md:1329` | \| NIST Cybersecurity Framework 2.0 \| Voluntary risk framework \| Free \| https://www.nist.gov/cyberframework \| Write your own paraphrase of ten subcategories \| CIS Controls \| | **OK** — NIST: CSF 2.0 is voluntary and freely available at the cited URL. |
| 76 | `13-phase-grc-compliance.md:1330` | \| CIS Controls \| Prioritised safeguard list \| Free \| https://www.cisecurity.org/controls \| Map five of your controls to CIS safeguards \| NIST CSF \| | **OK** — CIS Controls are freely available at the cited URL. |
| 77 | `13-phase-grc-compliance.md:1331` | \| ISO/IEC 27001 \| Certifiable management system standard \| Paid \| https://www.iso.org/standard/27001 \| Read the public overview and list the Annex A themes \| NIST CSF, which is free and covers similar ground \| | **OK** — ISO: ISO/IEC 27001 is certifiable and the standard document is paid. |
| 78 | `13-phase-grc-compliance.md:1332` | \| SOC 2 Trust Services Criteria \| Attestation criteria \| Free \| https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 \| Read the security criteria and note three you could map to \| ISO 27001 Annex A, or NIST CSF \| | **OK** — AICPA: the Trust Services Criteria are freely available. |
| 79 | `13-phase-grc-compliance.md:1333` | \| PCI DSS \| Card payment standard \| Free \| https://www.pcisecuritystandards.org/ \| Read the twelve requirement groups and summarise each in a line \| PCI SSC document library, free with registration \| | **OK** — PCI SSC: PCI DSS has 12 requirement groups; the document library is free. |
| 80 | `13-phase-grc-compliance.md:1334` | \| HHS HIPAA resources \| US health data rules \| Free \| https://www.hhs.gov/hipaa/index.html \| Read the Security Rule safeguards summary \| NIST SP 800-66, free \| | **OK** — HHS: HIPAA resources are freely available. |
| 81 | `13-phase-grc-compliance.md:1335` | \| National Privacy Commission \| Philippine data privacy regulator \| Free \| https://privacy.gov.ph/ \| Read the breach notification guidance and note who decides \| GDPR guidance from the EDPB \| | **OK** — Philippine government: the National Privacy Commission is the data privacy regulator. |
| 82 | `13-phase-grc-compliance.md:1336` | \| NIST SP 800-30 \| Risk assessment guide \| Free \| https://csrc.nist.gov/pubs/sp/800/30/r1/final \| Use its likelihood and impact language in your scale \| ISO 31000 overview material \| | **OK** — NIST: SP 800-30 Rev. 1 is the Guide for Conducting Risk Assessments, free at the cited URL. |
| 83 | `13-phase-grc-compliance.md:1345` | - NIST SP 800-30 risk assessment guide — https://csrc.nist.gov/pubs/sp/800/30/r1/final | **OK** — csrc.nist.gov — resolves to the SP 800-30 Rev. 1 publication page. |
| | | <sub>↑ - NIST Cybersecurity Framework 2.0 — https://www.nist.gov/cyberframework<br>↓ - NIST SP 800-53 control catalogue — https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final</sub> | |
| 84 | `13-phase-grc-compliance.md:1346` | - NIST SP 800-53 control catalogue — https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final | **OK** — csrc.nist.gov — resolves to the SP 800-53 Rev. 5 publication page. |
| | | <sub>↑ - NIST SP 800-30 risk assessment guide — https://csrc.nist.gov/pubs/sp/800/30/r1/final<br>↓ - CIS Controls — https://www.cisecurity.org/controls</sub> | |
| 85 | `13-phase-grc-compliance.md:1347` | - CIS Controls — https://www.cisecurity.org/controls | **OK** — cisecurity.org — resolves to the official CIS Controls page. |
| | | <sub>↑ - NIST SP 800-53 control catalogue — https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final<br>↓ - CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks</sub> | |
| 86 | `13-phase-grc-compliance.md:1348` | - CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks | **OK** — cisecurity.org — resolves to the official CIS Benchmarks page. |
| | | <sub>↑ - CIS Controls — https://www.cisecurity.org/controls<br>↓ - AICPA SOC 2 overview — https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2</sub> | |
| 87 | `13-phase-grc-compliance.md:1349` | - AICPA SOC 2 overview — https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 | **OK** — aicpa-cima.com — resolves to the official AICPA SOC 2 page. |
| 88 | `13-phase-grc-compliance.md:1351` | - ISO/IEC 27001 overview — https://www.iso.org/standard/27001 | **OK** — iso.org — resolves to the official ISO/IEC 27001 page. |
| | | <sub>↑ - PCI Security Standards Council — https://www.pcisecuritystandards.org/<br>↓ - HHS HIPAA Security Rule — https://www.hhs.gov/hipaa/for-professionals/security/index.html</sub> | |
| 89 | `13-phase-grc-compliance.md:1352` | - HHS HIPAA Security Rule — https://www.hhs.gov/hipaa/for-professionals/security/index.html | **OK** — hhs.gov — resolves to the official HIPAA Security Rule page. |
| | | <sub>↑ - ISO/IEC 27001 overview — https://www.iso.org/standard/27001<br>↓ - National Privacy Commission of the Philippines — https://privacy.gov.ph/</sub> | |
| 90 | `13-phase-grc-compliance.md:1355` | - GDPR official text — https://eur-lex.europa.eu/eli/reg/2016/679/oj | **OK** — eur-lex.europa.eu — resolves to the official GDPR text. |
| | | <sub>↑ - Philippine Data Privacy Act of 2012 — https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html<br>↓ - EDPB guidelines and recommendations — https://www.edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en</sub> | |
| 91 | `13-phase-grc-compliance.md:1363` | 4. Read NIST CSF 2.0 and write your own paraphrase of ten subcategories with their identifiers. <!-- id: cyber-13-t04 band: focused energy: normal --> | **UNVERIFIABLE** — curriculum task instruction |
| 92 | `13-phase-grc-compliance.md:1378` | - A ten-row control matrix mapping to NIST CSF 2.0 and a second framework, including Partial, Fail, and Not-tested rows | **UNVERIFIABLE** — deliverable description |
| 93 | `13-phase-grc-compliance.md:1493` | **Why:** The phase asks for the privacy obligations in outline — the DPA and the GDPR principles and rights — not an exhaustive legal reading. Assuming the Act stops at cloud-hosted data is the trap, because where the data is stored does not decide whether the … | **UNVERIFIABLE** — pedagogical guidance |
| 94 | `13-phase-grc-compliance.md:1523` | NIST CSF 2.0, the CIS Controls and Benchmarks, NIST SP 800-30 and SP 800-53, the AICPA's published SOC 2 criteria, the PCI DSS document library, the HHS HIPAA guidance, the National Privacy Commission's guidance, and the GDPR text are all free and together the … | **OK** — All cited documents are freely available from their issuing authorities. |
| 95 | `13-phase-grc-compliance.md:1527` | The ISO/IEC 27001 standard itself is a paid document, and certification requires an accredited certification body, an audit, and annual surveillance — a five-figure commitment for a small organisation. GRC platforms such as ServiceNow GRC, Archer, and Vanta au … | **OK** — ISO: ISO/IEC 27001 is a paid document; certification requires an accredited body. |
| 96 | `13-phase-grc-compliance.md:1531` | Pay when a customer or a tender requires a certification you do not hold, or when the manual evidence collection has grown past what a person can maintain — and at that point the employer pays, not you. For a learner, the honest position is that this phase cos … | **UNVERIFIABLE** — career-advice narrative |
| 97 | `14-phase-web-app-security.md:27` | - Identify which OWASP Top 10 category a flaw belongs to, and explain why. | **UNVERIFIABLE** — learning objective |
| | | <sub>↑ - Read an HTTP request and response in full, including headers that carry security meaning.<br>↓ - Test for injection, cross-site scripting, CSRF, IDOR, and SSRF on an authorised target.</sub> | |
| 98 | `14-phase-web-app-security.md:40` | - OWASP Top 10 in depth: all ten categories, taught by name rather than by number because the numbering moves between editions (the current edition is **2025**; 2021 is still widely quoted) | **OK** — owasp.org: “The most current released version is the OWASP Top 10 2025.” |
| 99 | `14-phase-web-app-security.md:63` | Most people arriving at web application security have to learn two things at once: how the web works, and how it breaks. You already know the first. You know what a POST request is, and you know what a session cookie does. You have almost certainly written cod … | **UNVERIFIABLE** — pedagogical narrative |
| 100 | `14-phase-web-app-security.md:252` | **Read this before the sections below, because the numbering has moved.** The current edition is **OWASP Top 10:2025**, and it reordered six of the ten categories relative to 2021. The sections below are ordered and named to match **2025**. Learn the categorie … | **OK** — owasp.org: “The most current released version is the OWASP Top 10 2025.” |
| 101 | `14-phase-web-app-security.md:924` ▶ | **OWASP Top 10:** A01 Broken Access Control | **OK** — OWASP: A01 is Broken Access Control. |
| | | <sub>↑ **CVSS 3.1:** 6.5 — AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N<br>↓ **CWE:** CWE-639 — Authorization Bypass Through User-Controlled Key (CWE is the Common Weakness Enumeration, the shared catalogue of flaw types; the n …</sub> | |
| 102 | `14-phase-web-app-security.md:1271` | \| Work the OWASP Top 10 as a checklist \| Prioritise findings against a real threat model and a real deadline \| | **UNVERIFIABLE** — comparison of two approaches |
| 103 | `14-phase-web-app-security.md:1332` | - OWASP Top 10 — https://owasp.org/www-project-top-ten/ | **OK** — owasp.org — resolves to the official Top 10 project page. |
| | | <sub>↓ - OWASP Web Security Testing Guide — https://owasp.org/www-project-web-security-testing-guide/</sub> | |
| 104 | `14-phase-web-app-security.md:1505` | You can read a web application's request and response, identify which OWASP Top 10 category a flaw belongs to, demonstrate it safely against an authorised lab target with Burp Suite, and write a finding with reproduction steps and a specific remediation. | **UNVERIFIABLE** — learning outcome description |
| 105 | `14-phase-web-app-security.md:1511` | PortSwigger Web Security Academy is free and is the best structured web security training that exists, covering every OWASP category from Apprentice to Expert. OWASP Juice Shop, DVWA, WebGoat, and bWAPP are free and you run them locally. Burp Suite Community a … | **UNVERIFIABLE** — “best structured web security training that exists” is a subjective superlative |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Security tool commands and flags

*Flags are fixed by each tool's own manual. A wrong flag in a lab instruction is executable code that cannot run — the same failure shape as IT 02's DISM defect.*

**Source to check against:** The tool's own man page or vendor documentation

99 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:53` | - SSH keys and `sshd` | |
| | | <sub>↑ - Users/groups/sudo<br>↓ - Services with `systemctl`</sub> | |
| 2 | `02-phase-networking-and-linux.md:54` | - Services with `systemctl` | |
| | | <sub>↑ - SSH keys and `sshd`<br>↓ - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog`</sub> | |
| 3 | `02-phase-networking-and-linux.md:55` | - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog` | |
| | | <sub>↑ - Services with `systemctl`<br>↓ - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file</sub> | |
| 4 | `02-phase-networking-and-linux.md:56` | - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file | |
| 5 | `02-phase-networking-and-linux.md:57` | - Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl` | |
| | | <sub>↑ - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file<br>↓ - Text processing: `grep`, `awk` basics, `sed` basics, pipes/redirection</sub> | |
| 6 | `02-phase-networking-and-linux.md:58` | - Text processing: `grep`, `awk` basics, `sed` basics, pipes/redirection | |
| | | <sub>↑ - Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl`</sub> | |
| 7 | `02-phase-networking-and-linux.md:89` | On Windows, network configuration is buried in GUI dialogs, and logging is abstracted away. On Linux, you type `ip a` and see your interfaces. You type `ss -tulpn` and see every listening service with the process that owns it. You read `/var/log/auth.log` to w … | |
| 8 | `02-phase-networking-and-linux.md:113` | \| `nmap -sV` \| Learning \| Unauthorised access \| | |
| | | <sub>↑ \|---\|---\|---\|<br>↓ \| `tcpdump` on your own interface \| Learning \| Potentially unlawful interception \|</sub> | |
| 9 | `02-phase-networking-and-linux.md:114` | \| `tcpdump` on your own interface \| Learning \| Potentially unlawful interception \| | |
| | | <sub>↑ \| `nmap -sV` \| Learning \| Unauthorised access \|<br>↓ \| `ssh user@your-vm` \| Learning \| Unauthorised access \|</sub> | |
| 10 | `02-phase-networking-and-linux.md:115` | \| `ssh user@your-vm` \| Learning \| Unauthorised access \| | |
| | | <sub>↑ \| `tcpdump` on your own interface \| Learning \| Potentially unlawful interception \|</sub> | |
| 11 | `02-phase-networking-and-linux.md:436` | \| **Headers** \| Metadata about the request or response \| `Set-Cookie` (and whether it has `HttpOnly` and `Secure` flags), `Content-Security-Policy`, `Server` (leaks software versions, useful to an attacker), `Authorization` \| | |
| 12 | `02-phase-networking-and-linux.md:439` | You can read all of this with `curl`, which is phase task 7's companion. `curl -I https://example.com` printing real response headers is worth more than any description. | |
| 13 | `02-phase-networking-and-linux.md:661` | **SSH** gives you an encrypted shell on a remote machine. The server is `sshd` — the SSH *daemon*, where a daemon is a background service. It is configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default. | |
| 14 | `02-phase-networking-and-linux.md:683` | **Windows has no `ssh-copy-id`.** The OpenSSH client ships with Windows 10 and 11, but the key-install helper does not. Append the key yourself instead — from PowerShell: | **OK** — Microsoft: the Windows OpenSSH client does not include `ssh-copy-id`. |
| 15 | `02-phase-networking-and-linux.md:702` | Modern Linux uses **systemd** to manage services, through `systemctl`: | |
| 16 | `02-phase-networking-and-linux.md:730` | The security relevance of this command is direct: **you cannot defend a host whose services you cannot enumerate.** Asking “what is running, and should it be?” is the first question of host hardening, and `systemctl list-units --type=service` answers it. | |
| 17 | `02-phase-networking-and-linux.md:744` | `journalctl` queries the systemd journal, which on many distributions is where logs now primarily live: | |
| 18 | `02-phase-networking-and-linux.md:755` | A workflow worth adopting now. Open one terminal running `journalctl -u sshd -f` on your VM. Try to SSH in from your host with the wrong username, and then with the wrong password. | |
| 19 | `02-phase-networking-and-linux.md:757` | Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`. | |
| 20 | `02-phase-networking-and-linux.md:796` | \| `grep "Failed password"` \| Keep only the failure lines \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `awk '{print $(NF-3)}'` \| Print the fourth field **from the end** — which is the source IP in this log format \|</sub> | |
| 21 | `02-phase-networking-and-linux.md:797` | \| `awk '{print $(NF-3)}'` \| Print the fourth field **from the end** — which is the source IP in this log format \| | |
| 22 | `02-phase-networking-and-linux.md:798` | \| `sort` \| Group identical addresses together, because `uniq` only collapses *adjacent* duplicates \| | |
| | | <sub>↑ \| `awk '{print $(NF-3)}'` \| Print the fourth field **from the end** — which is the source IP in this log format \|<br>↓ \| `uniq -c` \| Replace each run with a count \|</sub> | |
| 23 | `02-phase-networking-and-linux.md:799` | \| `uniq -c` \| Replace each run with a count \| | |
| | | <sub>↑ \| `sort` \| Group identical addresses together, because `uniq` only collapses *adjacent* duplicates \|<br>↓ \| `sort -rn` \| Sort numerically, highest first \|</sub> | |
| 24 | `02-phase-networking-and-linux.md:800` | \| `sort -rn` \| Sort numerically, highest first \| | |
| | | <sub>↑ \| `uniq -c` \| Replace each run with a count \|<br>↓ \| `head` \| Show the top ten, because you never want the whole list \|</sub> | |
| 25 | `02-phase-networking-and-linux.md:813` | The `--line-buffered` matters and is easy to miss. Without it, `grep` buffers its output when writing to a pipe, so the lines appear in bursts rather than as they happen. You will think the log is broken. | |
| 26 | `02-phase-networking-and-linux.md:847` | This is `sed`'s range form: print from the line matching the first pattern to the line matching the second. It is the fastest way to reduce a day of logs to the hour that matters. | |
| 27 | `02-phase-networking-and-linux.md:849` | **One safety habit, learned from breaking things.** Write the pipeline in pieces and run each stage before adding the next. `grep ... \| head` first — confirm you are matching the right lines. *Then* add the `awk`. A pipeline that returns nothing is ambiguous: … | |
| 28 | `02-phase-networking-and-linux.md:871` | `ss -tulpn` is the Linux equivalent of a port scan against your own machine. Phase task 4 asks you to run it and identify every listening service. Run it with `sudo`: the `p` flag needs root to read the owning process for sockets that belong to other users, an … | |
| 29 | `02-phase-networking-and-linux.md:927` | \| `grep "Failed password" /var/log/auth.log` \| Find the failed-password lines \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \|</sub> | |
| 30 | `02-phase-networking-and-linux.md:928` | \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \| | |
| | | <sub>↑ \| `grep "Failed password" /var/log/auth.log` \| Find the failed-password lines \|<br>↓ \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \|</sub> | |
| 31 | `02-phase-networking-and-linux.md:929` | \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \| | |
| | | <sub>↑ \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \|<br>↓ \| `sort` \| Order them so identical addresses are adjacent \|</sub> | |
| 32 | `02-phase-networking-and-linux.md:930` | \| `sort` \| Order them so identical addresses are adjacent \| | |
| | | <sub>↑ \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \|<br>↓ \| `uniq -c` \| Collapse duplicates and count each \|</sub> | |
| 33 | `02-phase-networking-and-linux.md:931` | \| `uniq -c` \| Collapse duplicates and count each \| | |
| | | <sub>↑ \| `sort` \| Order them so identical addresses are adjacent \|<br>↓ \| `sort -rn` \| Sort by count, descending \|</sub> | |
| 34 | `02-phase-networking-and-linux.md:932` | \| `sort -rn` \| Sort by count, descending \| | |
| | | <sub>↑ \| `uniq -c` \| Collapse duplicates and count each \|<br>↓ \| `head` \| Show the top ten \|</sub> | |
| 35 | `02-phase-networking-and-linux.md:935` | That is a real investigation query, built from small pieces, and it is the shape of most log analysis you will do. **`awk '{print $N}'` extracts the Nth whitespace-separated field** — that is the 90% of awk you need at this stage. | |
| 36 | `02-phase-networking-and-linux.md:937` | **Why not just `awk '{print $6}'`?** Because the field number moves. In `Failed password for root from 203.0.113.45 ...` the address is field 6, but in `Failed password for invalid user admin from 203.0.113.45 ...` the words `invalid user` push it to field 8.  … | |
| 37 | `02-phase-networking-and-linux.md:981` | \| 2 \| In another terminal, run `dig example.com` and `curl -I https://example.com` \| | |
| | | <sub>↑ \| 1 \| Start the capture in Wireshark or tcpdump \|<br>↓ \| 3 \| Stop the capture \|</sub> | |
| 38 | `02-phase-networking-and-linux.md:1105` | Each level is an SSH login to a server where the password for the next level is hidden somewhere. Finding it requires exactly the skills this phase covers: reading files, permissions, `grep`, pipes, and later `find` and encoding. | |
| 39 | `02-phase-networking-and-linux.md:1139` | - **`ss -tulpn` is a self-scan, and `0.0.0.0` versus `127.0.0.1` is the finding.** A service bound to all interfaces is reachable from the network; one bound to localhost is not. | |
| 40 | `02-phase-networking-and-linux.md:1142` | - **Pipes build small tools into real investigations.** `grep \| awk \| sort \| uniq -c \| sort -rn \| head` is a genuine top-talkers query, not a toy example. | |
| 41 | `02-phase-networking-and-linux.md:1154` | 4. **Run `ss -tulpn` and identify every listener** (task 4). For each one, decide whether it *should* be listening and whether it is bound to all interfaces. This is host hardening in miniature. | |
| 42 | `02-phase-networking-and-linux.md:1166` | 13. **Prove key-only SSH** (task 13). Generate a keypair, install the public key in `authorized_keys`, disable password authentication in `sshd_config`, and demonstrate that a password login now fails. "Demonstrate the failure" is the checklist item — anyone c … | |
| 43 | `02-phase-networking-and-linux.md:1167` | 14. **Capture and filter with `tcpdump`** (task 14). Save to a `.pcap`, open it in Wireshark, and filter to a single protocol. This is the command-line half of the packet work, and it is what you would actually have on a server with no GUI. | |
| 44 | `02-phase-networking-and-linux.md:1198` | 7. Run `nmap -sV` against your own VM IP only. <!-- id: cyber-02-t07 band: quick energy: normal --> | |
| | | <sub>↑ 6. Capture DNS and HTTP traffic with Wireshark. <!-- id: cyber-02-t06 band: focused energy: normal --><br>↓ 8. Complete OverTheWire Bandit levels 0–10. <!-- id: cyber-02-t08 band: deep energy: high --></sub> | |
| 45 | `02-phase-networking-and-linux.md:1204` | 13. Generate a keypair, place the public key in `authorized_keys`, disable password authentication in `sshd_config`, and prove a password login now fails. <!-- id: cyber-02-t13 band: focused energy: high --> | |
| 46 | `02-phase-networking-and-linux.md:1205` | 14. Use `tcpdump` to capture traffic on your VM's interface, save it to a `.pcap`, then open it in Wireshark and filter to a single protocol. <!-- id: cyber-02-t14 band: focused energy: normal --> | |
| 47 | `02-phase-networking-and-linux.md:1325` | **Why:** `-u sshd` matches a systemd unit by that exact name, and on some distributions the unit is `ssh.service` rather than `sshd.service`, so the filter matches nothing. Separately, not every distribution routes SSH into the journal — Debian and Ubuntu fami … | |
| 48 | `03-phase-security-fundamentals.md:302` | In Linux the equivalent evidence lives where Phase 2 showed you: `/var/log/auth.log` or `/var/log/secure`, read through `journalctl -u sshd`. | |
| 49 | `03-phase-security-fundamentals.md:429` | \| **Living off the land** \| Using legitimate built-in tools for malicious purposes: `powershell.exe`, `cmd.exe`, `wmic`, `certutil`, `bitsadmin`, `rundll32`, `mshta` \| Suspicious not because they are malicious but because they are frequently *abused*, and s … | |
| 50 | `03-phase-security-fundamentals.md:685` | You can check any site's headers with `curl -I`, which is a small, satisfying thing to do on a site you own. | |
| 51 | `03-phase-security-fundamentals.md:1037` | Take five findings — from the `nmap -sV` scan you ran against your own VM in Phase 2, from a Nessus/OpenVAS scan of your own lab, or from the CVE exercise in Phase 1 — and score them. | |
| 52 | `04-phase-hands-on-labs.md:238` | \| Linux VM \| `ss -tulpn` \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Windows VM \| `netstat -ano` \|</sub> | |
| 53 | `04-phase-hands-on-labs.md:239` | \| Windows VM \| `netstat -ano` \| | |
| | | <sub>↑ \| Linux VM \| `ss -tulpn` \|</sub> | |
| 54 | `04-phase-hands-on-labs.md:275` | \| **Enough free disk space** \| `Get-PSDrive C` in PowerShell \| Guests grow, and a full host disk corrupts running VMs \| | |
| 55 | `04-phase-hands-on-labs.md:447` | \| **The host disk is full** \| Snapshot deltas, or dynamically allocated disks that grew \| `Get-PSDrive C` on the host; check the VM folder's size \| Delete finished snapshots, delete unused VMs, move the VM folder to a larger drive \| | |
| 56 | `04-phase-hands-on-labs.md:455` | \| **`apt` or Windows Update fails inside the guest** \| No route out, or a corporate VPN on the host \| `curl -I https://archive.ubuntu.com` inside the guest \| Detach the VPN, or verify the NAT adapter is present and enabled \| | |
| 57 | `04-phase-hands-on-labs.md:484` | it can understand Windows events and `sshd` logs out of the box. | |
| | | <sub>↑ it. Wazuh ships with hundreds of decoders for common log formats — which is why</sub> | |
| 58 | `04-phase-hands-on-labs.md:543` | \| 1 \| **Generate one event** on the victim VM — for example, an SSH login attempt as a user that does not exist (`ssh fakeuser@localhost` and fail it) \| You need a known event to trace \| | |
| 59 | `04-phase-hands-on-labs.md:662` ▶ | `grep "Failed password" /var/log/auth.log \| tail -3` | |
| | | <sub>↑ - Raw excerpt from /var/log/auth.log, three of the six lines, captured with<br>↓ - Wazuh alert for rule 100001, level 10, timestamped 14:32:11 UTC</sub> | |
| 60 | `04-phase-hands-on-labs.md:831` ▶ | **Observed:** `ossec.log` shows `Unable to connect to manager`. `ss -tulpn` | |
| | | <sub>↑ **Did:** Installed the agent, set MANAGER_IP to 192.168.56.10, restarted.<br>↓ on the manager shows nothing listening on 1514.</sub> | |
| 61 | `06-phase-portfolio-projects.md:1020` | \| 14:09 \| Generated test traffic \| `nmap -sS 192.168.56.10` \| 3 open ports found \| `02-scan.png` \| | |
| | | <sub>↑ \| 14:02 \| Started lab VM \| VirtualBox → `lab-ubuntu` → Start \| VM booted, IP 192.168.56.10 \| `01-vm-boot.png` \|<br>↓ \| 14:15 \| Confirmed alert fired \| Wazuh dashboard \| Rule 5710 triggered \| `03-alert.png` \|</sub> | |
| 62 | `09-phase-cloud-and-identity.md:235` | **Before any of this works you need the AWS CLI**: install it, then run `aws configure` once with the IAM user's access key, secret, and a default region. Every command below reads those stored credentials, so a bare `aws` command with no configuration fails i … | |
| 63 | `09-phase-cloud-and-identity.md:268` | Two details in that third command are worth naming, because both are the kind of thing that makes an audit script quietly wrong. The version id has to be fetched rather than assumed, and the `grep` pattern is written loosely enough to catch the several shapes  … | |
| 64 | `09-phase-cloud-and-identity.md:536` | \| `userAgent` \| What client made the call \| `aws-cli` at 3 a.m. from a service account is worth a look \| | |
| | | <sub>↑ \| `sourceIPAddress` \| Where the call came from \| A known office range versus an unfamiliar address \|<br>↓ \| `requestParameters` \| The details of the request \| This is where you see *what* was granted — `AdministratorAccess` here \|</sub> | |
| 65 | `09-phase-cloud-and-identity.md:581` | \| Was it a human or automation? \| `userAgent` of `aws-cli` plus the pattern suggests scripted activity, possibly a human at a terminal \| | |
| 66 | `10-phase-detection-engineering.md:341` | One practical note on the filename: the well-known community configurations publish their file under names such as `sysmonconfig.xml` and `sysmonconfig-export.xml`, and the name is only ever a convention — nothing reads it. What matters is that the file you pa … | |
| 67 | `10-phase-detection-engineering.md:350` | \| `auditd` with `auditctl` rules \| Syscalls and file watches, configurable in detail \| `ausearch` and `aureport` \| | |
| 68 | `10-phase-detection-engineering.md:351` | \| `journald` \| Systemd service logs, kernel messages \| `journalctl` with filters \| | |
| | | <sub>↑ \| `auditd` with `auditctl` rules \| Syscalls and file watches, configurable in detail \| `ausearch` and `aureport` \|<br>↓ \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \|</sub> | |
| 69 | `10-phase-detection-engineering.md:356` | **This half needs a Linux host.** The Windows telemetry above runs on your own PC; auditd does not. If you do not have a Linux machine yet, do this section after Phase 11, which walks you through building one in VirtualBox — or on WSL2, which is enough for `au … | |
| 70 | `10-phase-detection-engineering.md:358` | The auditd rules worth writing first, because they cover the persistence and privilege-escalation behaviours that matter. Put them in `/etc/audit/rules.d/10-lab.rules`, load them with `augenrules --load`, and confirm they are live with `auditctl -l` — a rule t … | |
| 71 | `11-phase-incident-response.md:516` | \| 09:12:03 \| Sysmon 1 \| `schtasks.exe /create /tn Updater /tr ...` \| | |
| | | <sub>↑ \| 09:11:52 \| Sysmon 3 \| Outbound HTTPS from `powershell.exe` to `203.0.113.44:443` \|<br>↓ \| 09:12:20 \| Security 4698 \| Scheduled task `Updater` created \|</sub> | |
| 72 | `11-phase-incident-response.md:1065` | **On the Windows host this scenario actually describes, the same four steps are:** `winpmem_mini_x64.exe` for memory; `netstat -ano`, `arp -a`, and `route print` for network state; `Get-Process` for processes; and FTK Imager or `dc3dd.exe` for the disk image.  … | |
| 73 | `12-phase-scripting-automation.md:27` | - Use PowerShell to triage a Windows host with `Get-WinEvent`, `Get-Process`, and `Get-NetTCPConnection`. | |
| | | <sub>↑ - Read and write Python well enough to parse logs, call APIs, and produce a report.<br>↓ - Make authenticated HTTP requests to a real API and handle the responses and errors properly.</sub> | |
| 74 | `12-phase-scripting-automation.md:46` | - PowerShell for triage: `Get-WinEvent`, `Get-Process`, `Get-NetTCPConnection`, `Get-Service` | |
| | | <sub>↑ - Secrets management: environment variables, `.env` files, and `.gitignore`<br>↓ - PowerShell objects and pipes, and why `Select-Object` beats text parsing</sub> | |
| 75 | `12-phase-scripting-automation.md:47` | - PowerShell objects and pipes, and why `Select-Object` beats text parsing | |
| | | <sub>↑ - PowerShell for triage: `Get-WinEvent`, `Get-Process`, `Get-NetTCPConnection`, `Get-Service`<br>↓ - Calling REST APIs from PowerShell with `Invoke-RestMethod`</sub> | |
| 76 | `12-phase-scripting-automation.md:48` | - Calling REST APIs from PowerShell with `Invoke-RestMethod` | |
| | | <sub>↑ - PowerShell objects and pipes, and why `Select-Object` beats text parsing<br>↓ - Hash computation with `hashlib` and `Get-FileHash` for IOC matching</sub> | |
| 77 | `12-phase-scripting-automation.md:49` | - Hash computation with `hashlib` and `Get-FileHash` for IOC matching | |
| | | <sub>↑ - Calling REST APIs from PowerShell with `Invoke-RestMethod`<br>↓ - Defanging indicators so they are safe to paste into reports</sub> | |
| 78 | `12-phase-scripting-automation.md:739` | That `Export-Csv` line is a complete deliverable. Compare it with the text-parsing approach, which requires fixed-width column offsets that change between Windows versions. | |
| 79 | `12-phase-scripting-automation.md:743` | `Get-WinEvent` is the workhorse, and its filtering syntax is worth learning properly because the difference between a good and a bad filter is minutes versus hours. | |
| 80 | `12-phase-scripting-automation.md:852` | The third command is the one to know best. **`Get-NetTCPConnection` joined to the owning process answers "what is this machine talking to, and what program is doing it"** — which is the first question in almost every host investigation. | |
| 81 | `12-phase-scripting-automation.md:1396` | - **`Get-WinEvent -FilterHashtable` is dramatically faster than piping to `Where-Object`**, and positional property indexes are found by inspection rather than memory. | |
| 82 | `12-phase-scripting-automation.md:1397` | - **`Get-NetTCPConnection` joined to the owning process answers the first question of almost every host investigation.** | |
| 83 | `12-phase-scripting-automation.md:1434` | \| CyberChef \| Decoding and transformation \| Free/open-source \| https://gchq.github.io/CyberChef/ \| Decode a base64 command line by hand before scripting it \| Python `base64` and `codecs` \| | |
| 84 | `14-phase-web-app-security.md:52` | - SQL injection testing with manual payloads and `sqlmap` on authorised targets | |
| | | <sub>↑ - Burp Suite Community and OWASP ZAP: proxy, intercept, repeater, and scanning<br>↓ - Content Security Policy and the other security response headers</sub> | |
| 85 | `14-phase-web-app-security.md:392` | **The password-storage rule is the one to know precisely.** Passwords are stored with a slow, salted, memory-hard hash: `bcrypt`, `scrypt`, or `Argon2`. Not SHA-256, and never MD5 or SHA-1. The reason is speed. A modern GPU computes billions of SHA-256 hashes  … | **OK** — OWASP Password Storage Cheat Sheet recommends Argon2id and scrypt, and warns against fast hashes such as MD5 and SHA-1. |
| 86 | `14-phase-web-app-security.md:841` | **On Windows, Docker needs WSL2.** Docker Desktop offers to install it on first run, which needs administrator rights and a reboot; if you cannot get either, run Juice Shop inside your Phase 2 Linux VM instead, where the same `docker run` line works. Git Bash  … | |
| 87 | `14-phase-web-app-security.md:865` | **Two cautions about `sqlmap` that matter more than the command.** It sends a large volume of requests, so it will be detected and rate-limited. On a fragile application it can also disrupt service. And running it against anything other than a target you own o … | |
| 88 | `14-phase-web-app-security.md:1092` | \| `script-src` \| Where JavaScript may be loaded from \| | |
| | | <sub>↑ \| `default-src` \| The fallback for every resource type not otherwise specified \|<br>↓ \| `style-src` \| Where stylesheets may be loaded from \|</sub> | |
| 89 | `14-phase-web-app-security.md:1133` | \| Requests with unusual user agents or methods \| `sqlmap`, `nikto`, or unexpected `PUT` \| Automated scanning \| | |
| 90 | `14-phase-web-app-security.md:1304` | 5. **Work through injection properly** (tasks 5 and 6): the SQL injection Apprentice labs by hand first, then confirm one with `sqlmap` against Juice Shop on localhost and compare what the tool reports with what you found manually. | |
| 91 | `14-phase-web-app-security.md:1324` | \| curl \| Command-line HTTP client \| Free/open-source \| https://curl.se/ \| Fetch a response with headers and inspect the security headers \| PowerShell `Invoke-WebRequest` \| | |
| 92 | `15-phase-ot-ics-security.md:40` | - Capture and analyse control traffic passively with Wireshark, `tcpdump`, and Zeek without sending a single packet at a device. | |
| 93 | `15-phase-ot-ics-security.md:114` | \| Wireshark, `tcpdump`, and Zeek on OT captures \| 14–18 \| The skill that gets used on day one \| | |
| | | <sub>↑ \| Protocol study and simulator work \| 12–16 \| One protocol at a time \|<br>↓ \| Building a simulation lab \| 10–14 \| Software PLCs, a simulator, a separate analysis host \|</sub> | |
| 94 | `15-phase-ot-ics-security.md:823` | \| Capture \| `tcpdump`, or a managed switch's mirror port \| Free \| The raw packets \| | |
| | | <sub>↑ \|---\|---\|---\|---\|<br>↓ \| Deep inspection \| Wireshark \| Free \| Understanding one exchange completely \|</sub> | |
| 95 | `15-phase-ot-ics-security.md:1121` | \| Wireshark \| Packet capture and protocol dissection \| Free/open-source \| https://www.wireshark.org/ \| Dissect a Modbus read and a write and annotate the function codes \| `tshark` on the command line \| | |
| 96 | `15-phase-ot-ics-security.md:1122` | \| Zeek \| Network security monitoring that produces structured logs \| Free/open-source \| https://zeek.org/ \| Capture a lab session and find every connection in `conn.log` \| Suricata in its logging mode, or `tcpdump` plus scripts \| | |
| 97 | `15-phase-ot-ics-security.md:1123` | \| Suricata \| Signature and protocol-aware intrusion detection \| Free/open-source \| https://suricata.io/ \| Write a rule that fires on Modbus write function codes \| Zeek scripts, or Python over `tshark` output \| | |
| 98 | `15-phase-ot-ics-security.md:1124` | \| `tcpdump` \| Command-line packet capture \| Free/open-source \| https://www.tcpdump.org/ \| Capture Modbus traffic to a file for later analysis \| Wireshark's own capture, or `dumpcap` \| | |
| 99 | `15-phase-ot-ics-security.md:1318` | Every tool this phase needs is free. Wireshark, Zeek, Suricata, `tcpdump`, and GRASSMARLIN are open source, and together they are a genuine passive monitoring stack rather than a demo. OpenPLC and the free protocol simulators give you a controller to talk to w … | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Cryptography algorithm claims

*Key sizes, hash lengths and the broken/sound status of an algorithm are fixed facts. Telling a beginner MD5 or SHA-1 is acceptable is the kind of error that persists into their work.*

**Source to check against:** The defining standard (NIST FIPS), or the IETF RFC for the protocol

5 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:677` ▶ | ssh-keygen -t ed25519 -C "lab key" # generate a keypair | **OK** — OpenSSH: `-t ed25519` generates an Ed25519 keypair. |
| | | <sub>↑ ```bash<br>↓ ssh-copy-id user@192.168.1.50 # install the public key (Linux/macOS)</sub> | |
| 2 | `11-phase-incident-response.md:458` | \| **AmCache** \| `C:\Windows\AppCompat\Programs\Amcache.hve` \| Program execution with SHA-1 hashes and install paths \| | **OK** — Forensics documentation: Amcache.hve in C:\Windows\AppCompat\Programs stores path, size, compile time and SHA-1 hash. |
| 3 | `11-phase-incident-response.md:466` | **AmCache is the single most under-used artefact by beginners.** It records executables with their SHA-1 hashes, which means you can take a hash you found in AmCache and check it against a public reputation service without ever having the file. | **UNVERIFIABLE** — “single most under-used artefact by beginners” is a subjective judgement; the SHA-1 component is verified at row 2 |
| 4 | `11-phase-incident-response.md:1244` | - A memory acquisition record with tool, time, and SHA-256 hash | **UNVERIFIABLE** — instruction about what a learner should record |
| | | <sub>↑ - Triage records for ten alerts with severity and escalation reasoning<br>↓ - A disk image hash verification and a timeline table built from at least three sources</sub> | |
| 5 | `14-phase-web-app-security.md:392` | **The password-storage rule is the one to know precisely.** Passwords are stored with a slow, salted, memory-hard hash: `bcrypt`, `scrypt`, or `Argon2`. Not SHA-256, and never MD5 or SHA-1. The reason is speed. A modern GPU computes billions of SHA-256 hashes  … | **OK** — OWASP Password Storage Cheat Sheet recommends Argon2id and scrypt, and warns against fast hashes such as MD5 and SHA-1. |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Claims per phase

| Phase | cidr | port | command | record | protocol | version | registry | number | cve | attack | standard | cybercmd | crypto | total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 foundations |  |  |  |  |  |  | 2 | 8 | 2 | 3 | 13 |  |  | **28** |
| 02 networking-and-linux | 23 | 22 | 39 | 4 | 20 | 1 | 20 | 11 |  |  |  | 47 | 1 | **188** |
| 03 security-fundamentals | 1 | 10 | 2 |  | 4 |  | 6 | 11 | 2 | 3 | 9 | 4 |  | **52** |
| 04 hands-on-labs | 1 | 15 | 7 |  |  | 3 | 2 | 15 |  | 2 |  | 9 |  | **54** |
| 05 specialization-choice |  |  |  |  |  |  |  | 7 |  |  | 5 |  |  | **12** |
| 06 portfolio-projects |  | 13 |  |  | 4 |  |  | 7 |  |  |  | 1 |  | **25** |
| 07 certifications |  |  |  |  |  |  |  | 13 |  |  |  |  |  | **13** |
| 08 job-application |  |  | 2 |  | 3 |  |  | 7 |  |  |  |  |  | **12** |
| 09 cloud-and-identity |  | 17 | 1 |  |  |  |  | 4 |  |  |  | 4 |  | **26** |
| 10 detection-engineering |  | 7 |  |  |  |  | 9 | 6 |  | 26 |  | 5 |  | **53** |
| 11 incident-response | 1 | 51 | 2 |  |  | 3 | 6 | 17 |  |  | 5 | 2 | 3 | **90** |
| 12 scripting-automation |  | 13 | 7 |  | 1 | 1 | 2 | 8 |  |  |  | 11 |  | **43** |
| 13 grc-compliance |  | 17 |  |  |  | 1 |  | 13 |  |  | 64 |  |  | **95** |
| 14 web-app-security | 1 | 10 |  |  | 1 |  |  | 2 |  |  | 9 | 8 | 1 | **32** |
| 15 ot-ics-security |  | 10 |  |  | 11 |  |  | 9 |  |  |  | 8 |  | **38** |

