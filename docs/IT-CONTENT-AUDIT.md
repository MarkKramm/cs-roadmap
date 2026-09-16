# IT Curriculum — Content Gap Audit vs. Real Entry-Level Remote IT Requirements

> **Status: actioned.** All four MISSING gaps and all five THIN gaps were fixed in the same pass that produced this report, along with three of the four corpus defects. See "Resolved in this pass" at the end for what changed and, importantly, where this report's own diagnosis was wrong.
>
> **Where this lives:** `docs/`, not `career-roadmaps/it-roadmap/`. It was written beside the track it audits, which mixed meta-documentation into the study material a reader is meant to read straight through. Every other audit of this kind lives in `docs/`.

**Scope audited:** `career-roadmaps/it-roadmap/` — `00-overview.md`, phases `01`–`09`, `checklist-master.md`, `TOOLBOX.md` (12 files, ~143,000 words).
**Reader profile:** Philippines-based, targeting remote work, $0 budget, no IT background.
**Method:** full read of all nine phase files (headings, `## Specific topics to learn`, `### Part N` headings, `## Skills you'll gain`), a bulk term-frequency sweep across all 12 files, then targeted per-term greps to prove absence or presence.

---

## 1. Verdict

**The track is strong, genuinely job-ready in breadth, and unusually deep — but it has one real structural blind spot: it teaches a Windows-plus-Linux world, and the remote entry-level market it targets increasingly expects a Windows-plus-macOS-plus-cloud-managed-device world.** The single biggest hole is **macOS support combined with MDM/device management** (Intune/Autopilot, mobile devices, BYOD): these are effectively absent from 143,000 words, and together they are the most common reason a strong PH-based remote candidate is filtered out at the "can you support our fleet?" question. Secondary verified holes are **docking-station/peripheral-topology hardware**, **VoIP/softphone support**, **imaging/provisioning depth**, and **malware removal**, which is listed as a topic but never actually taught. Everything else I suspected as a gap turned out to be covered — often better than most commercial study material.

---

## 2. Verified gaps

| Gap | Class | Evidence (search + result) | Why it matters in month one | Suggested fix (smallest possible) |
|---|---|---|---|---|
| **macOS support** | **MISSING** | `Select-String -Path it-roadmap\*.md -Pattern 'macOS\|MacBook\|\bMac\b\|Apple\|Finder\|Keychain\|Time Machine\|\.dmg'` → **18 hits, of which only 2 are real.** All others are the string "MAC address". The 2 real ones: `02:89` "Every operating system, whether Windows, Linux, or macOS, does the same five things" (a list preamble, no macOS content follows) and `06:865` a parenthetical "macOS: **Do Not Disturb**" in a privacy table. Zero Finder, zero Keychain, zero Time Machine, zero `.dmg`, zero `/Applications`, zero macOS troubleshooting. | Remote-first and SaaS companies are Mac-heavy. A PH remote hire supporting a US startup will hit "my Mac won't connect to the printer / Keychain keeps asking / I need to reinstall this app" in week one. Saying "I don't use Mac" in a screening call is a common disqualifier. A+ Core 1/2 includes macOS and mobile OS objectives, which the track never mentions. | Add one ~600-word subsection to Phase 2: Finder vs Explorer, `/Applications` vs Program Files, System Settings vs Control Panel, Keychain Access as "Credential Manager", Time Machine as "File History", `.dmg` install, and a short macOS-vs-Windows translation table. Explicitly say "I support Macs at a first-line level; here is the mapping." |
| **MDM / Intune / device management** | **MISSING** | `-Pattern '\bMDM\b\|Intune\|Autopilot\|JAMF\|Jamf\|mobile device management\|device enrollment\|Company Portal'` → **2 hits, both false positives**: `02:210` is the pun "Record it as a script you can run on **autopilot**"; `09:513` is a fragment inside the sample job-tracker table ("Ad named 'Intune, ticketing, M365'"). Zero real coverage of enrollment, compliance policy, conditional access enforcement, remote wipe, or device provisioning. | Post-2020 remote onboarding *is* MDM-driven: the new hire's laptop ships and enrolls itself. "Have you used Intune?" is a standard interview question for remote support. The track names conditional access as a *concept* (05:145) and even attributes a ticket class to it, but never says who configures or enforces it. | Add to Phase 5, beside the existing conditional-access paragraph: 5 sentences on what MDM does (enroll, push config, enforce compliance, wipe), what an Intune/Autopilot enrolment looks like from the *technician's* view, and the first-line tickets it generates (device non-compliant, cannot enroll, app won't install). |
| **Mobile devices / BYOD (iOS + Android)** | **MISSING** | `-Pattern 'iOS\|Android\|iPhone\|iPad\|tablet'` → **no true matches.** Every hit is the substring inside "BIOS" (`01:47, 279, 310–361`, etc.). `-Pattern 'BYOD\|company phone\|mobile email\|phone setup'` → **0 hits.** | "Set up email on my phone", "Outlook app won't sync", "authenticator app is on my old phone" are among the highest-volume real helpdesk tickets, and PH/BPO desks handle them constantly. Also blocks the MFA-lost-phone path that Phase 5 raises (05:274) but never resolves. | Fold into the same Phase 5 sidebar as MDM. Cover: mobile email profile setup, Microsoft Authenticator / Google Authenticator enrolment and re-enrolment after a phone change, and the fact that a lost MFA device is a *security* ticket requiring identity re-verification, not a convenience ticket. |
| **Docking stations and peripheral topology** | **MISSING** | `-Pattern 'dock'` → **0 matches across all 12 files.** `-Pattern 'dock\|docking station\|KVM'` → **0.** | Almost every remote/hybrid worker runs a laptop + dock + two monitors + USB peripherals. "My monitors stopped working when I came back to my desk" is a dock/cable/DisplayPort-alt-mode ticket. Phase 1 covers internal desktop hardware thoroughly and has a good second-monitor ticket (01:1061), but the *dock* — the actual failure point in a modern remote setup — is never named. | Add 3 sentences and one row to the Phase 1 symptom→cause table: dock power vs host cable vs DisplayPort alt-mode vs monitor input selection, and "reseat the dock's host cable and confirm the monitor's input source before replacing hardware." |
| **VoIP / softphone / contact-centre telephony** | **MISSING** | `-Pattern 'VoIP\|softphone\|PBX\|\bSIP\b\|telephon\|call queue\|dial plan\|handset'` → **0 matches across all 12 files.** | The Philippines' largest entry-level IT employer category is BPO/call-centre helpdesk (the track itself says so at `01:613`). Those desks support softphones and headsets as a core duty. Even non-BPO remote roles use Zoom/Teams telephony. "Audio doesn't work in the softphone" is a first-month ticket with no coverage at all. | Add a short Phase 4 scenario alongside the existing eight: softphone has no audio — check default input/output device first, then headset (hardware mute switch), then app device selection, then network/QoS. Five sentences is enough. |
| **Imaging / provisioning / new-hire build** | **THIN** | `-Pattern 'imaging\|reimage\|provision\|onboard'` → the *only* substantive hit is a single bullet verb at `05:275`: "**Provision the device** — image it, join it to management, install the standard software set, apply the patching policy." No imaging tool, no Autopilot/MDT/Sysprep, no standard-image concept, no end-to-end walkthrough. By contrast, `09:91` lists "Desktop Support … **imaging**, deployments" as a target role the track does not prepare for. | A junior desktop/sysadmin hire is very often handed a stack of laptops and told to build them. The 8-step onboarding list (05:268–281) is an excellent *interview answer* but not a *procedure* — the reader can recite it and still not know how to do step 4. | Expand that one bullet into a 10-line subsection: what a standard image is, what "join it to management" means concretely, why imaging exists (consistency, not speed), and one free tool path (Windows `sysprep` + `dism`, or note Autopilot as the modern replacement). |
| **Malware removal** | **THIN** | `02:43` lists "Windows Defender and basic malware removal steps" under `## Specific topics to learn`. Searching the taught content for the procedure: `-Pattern 'Safe Mode\|offline scan\|MpCmdRun\|quarantine\|remediation'` → **2 hits, neither relevant**: `01:290` is a `chkdsk` line, `06:1052` is `outlook.exe /safe`. Defender is never opened, `MsMpEng`/`MpCmdRun` never appear, quarantine is never explained, offline scan is never named. The only malware content is a single scareware ticket at `06:703–725` ("I think I got a virus"), which correctly identifies it as scareware — i.e. *not* malware removal. | "I think I have a virus" is a weekly ticket. Knowing the difference between scareware, a real infection, and a browser hijack — and knowing that Safe Mode / offline scan / quarantine exists — is baseline first-line work. Right now the reader would pass the topic bullet and fail the ticket. | Add a 12-line subsection to Phase 2 Part 7: the triage decision tree (scareware pop-up vs. real infection vs. browser hijack vs. false positive), Defender's quick scan vs. offline scan, what quarantine means, and when to escalate to a rebuild instead of cleaning. |
| **Shift handover procedure / follow-the-sun** | **THIN** | `-Pattern 'handover\|hand-off\|shift change\|follow.the.sun'` → all hits are *escalation* handover (`04:358, 1237, 1298`; `06:237`) or one resume note (`07:176` "write the handover note when you finish"). There is **no ticket-queue shift-handover procedure**: no "what to do with your open queue at end of shift", no summary-of-shift convention, no definition of what a colleague in the next timezone needs to pick up safely. | The reader is explicitly told they will work PH night shifts covering US hours (`01:595–720`) and that tickets will be picked up while they sleep (`07:176`). End-of-shift queue handover is a daily ritual on every 24/7 desk, and it is the moment a new hire's documentation habits are judged. This is the one remote-work-specific gap the track genuinely misses. | Add a short block to Phase 6 (which already owns ticket lifecycle): a 5-line end-of-shift handover template — open tickets, current state, next action, who is waiting, and what you would do next. |

**Total: 9 gaps — 4 MISSING, 5 THIN.** I found no `OUT-OF-SCOPE-BUT-EXPECTED` items worth reporting: the track is candid about what it does not cover (no-degree path, contractor tax, role ceilings at `01:639–670`, and even "you will not have paid access to these services" at `05:148`), so the reader is not blindsided by the existence of harder topics.

---

## 3. Covered well — do not touch

These are genuinely strong. Do not "improve" them; the depth is the asset.

- **VPN troubleshooting** — `04:1103–1150` is a full worked ticket covering idle timeouts, re-keying intervals, MTU problems, split tunnelling, and dual-default-route conflicts (`route print -4`), plus a strong/weak reply pair and a correct "this is not fixable from the laptop" escalation. Better than most vendor training.
- **Printer troubleshooting** — `04:1073–1074` (port 9100 test, spooler queue), `02:496`, `03:1602` (explicitly *refusing* to reinstall the driver because it does not touch the cause), `01:906` ("one change at a time"). Multi-layer and evidence-driven.
- **SLA / priority / queue triage** — `06:554–575` derives priority from a real impact × urgency grid rather than typing it; `06:773–812` is a live-queue triage exercise with reasoning; `06:918–976` computes mean FRT, FCR, and SLA breaches from a ticket log. Outstanding.
- **Escalation writing** — `04:1231–1413` treats escalation as a *handover* with a scoring rubric (0–7), not a cry for help.
- **Phishing from the helpdesk angle** — `04:444` ("never click links to check", containment not blame), `04:503`, `06:176` (never ask for a password *because* it trains users to fall for phishing), `06:703–725`. Correct and well-reasoned.
- **Knowledge base article writing** — `04:452–474` gives a full article anatomy (problem-shaped title, symptoms, applies-to, steps, verification, escalation, review date), the economics of writing them, and the "out-of-date is worse than none" rule.
- **Email / M365 troubleshooting** — `04:584–634` (profile error code, stale credential in Credential Manager, *do not* reinstall Office) and `06:1041–1071` (Outlook crash after a KB update, safe mode, rollback). Real depth.
- **Remote support tooling** — `06:833–910` covers RustDesk/AnyDesk/Quick Assist with a consent/risk table, unattended-access-as-backdoor warning, and a session log.
- **Active Directory / Entra ID conceptual model** — `05:87–148, 469` correctly distinguishes local vs domain vs cloud identity, explains groups-as-the-answer, least privilege, access review, conditional access, and Entra vs Google Workspace. Appropriate depth for entry level, and honest that it is documentation-based practice.
- **Philippines / remote-work reality** — `01:589–720` (four employer buckets, contractor invoicing and tax, brownout/UPS/mobile-data backup planning, UTC+8 overlap tables that correctly note the PH has no DST), `09:672–684` (timezone interview answers), `08:303`. This is the strongest PH-specific content I have seen in a free curriculum.
- **NTFS vs share permissions, SMB, port 445, ACL reading** — `05:152–178`, `04:700–728`, `03:1608`. The stale-session-token ticket at `04:708–728` is expert-level reasoning.

---

## 4. Things I checked and found FINE

Suspected gaps that the searches **disproved**. Recorded so nobody re-opens them.

| Suspected gap | Search run | Result — why it is NOT a gap |
|---|---|---|
| VPN troubleshooting is only "what a VPN is" | `-Pattern '\bVPN\b'` in `04-phase-helpdesk-skills.md` | **86 VPN hits repo-wide**, incl. a full ticket at `04:1103–1150` with MTU, re-keying, split tunnelling, and dual default routes. Covered deeply. |
| Printer troubleshooting is shallow | `-Pattern 'spooler\|print queue\|print server\|print driver\|port 9100\|toner'` | **172 printer-related hits**. Covers spooler service, queue, port 9100 raw printing, driver-vs-port-vs-queue triage, and print-server change-management (`07:337, 486`). Covered. |
| SLA / priority handling in a real queue | `-Pattern 'SLA\|breach\|first response\|priority'` in `06` | **124 SLA/priority hits.** Derived priority grid, queue triage with reasoning, FRT/FCR/breach metrics from a real ticket log. Exceptionally covered. |
| Escalation paths and when to escalate | `-Pattern 'escalat'` | **155 hits.** Structured handover doctrine, a scoring rubric, and "stop and escalate when the fix needs access you do not have" (`03:1618`). Covered. |
| Knowledge base / writing KB articles | `-Pattern 'KB article\|knowledge base article\|article template'` | **67 hits**, incl. full article anatomy at `04:452–474` and a template requirement at `06:1188`. Covered. |
| Phishing / security awareness from a helpdesk angle | `-Pattern 'phish'` | **8 hits**, all correct and specific (`04:444, 503`; `06:176, 703–725`). Covered. |
| Hardware is desktop-internals-only, not laptops/peripherals | `-Pattern 'laptop\|monitor\|peripheral\|USB\|battery\|warranty\|headset\|webcam\|charger'` | **675 hits**, `laptop` alone 127 times. Includes a worked second-monitor ticket (`01:1061–1136`) and laptop thermal/throttling guidance. Covered. Only *docking stations* are missing (reported above). |
| CompTIA A+ alignment is absent | `-Pattern 'CompTIA\|A\+\|220-110'` | **10 hits**, and both A+ **and** Network+ free Professor Messer course URLs are cited as the primary resources (`01:1602`, `03:1698`). Destination is aligned even though the track does not label itself A+-mapped. |
| Time zones / shift coverage not addressed | `-Pattern 'time ?zone\|handover\|graveyard\|overlap'` | **49 hits.** UTC+8 overlap tables, DST-awareness, and five scripted interview answers for hours questions (`09:672–684`). Covered — only the *shift-handover procedure* is thin. |
| Password managers / SSO | `-Pattern 'SSO\|Bitwarden\|KeePass\|password manager\|self.service'` | Bitwarden/KeePassXC covered with lab tasks (`06:185, 1199, 1214`); self-service deflection covered (`04:470–474`). Covered. |
| Group Policy is only a mention | `-Pattern '\bGPO\|Group Policy'` | **6 hits** incl. a correct definition (`05:105`) and a resume-defence line (`08:1098`). Conceptually adequate for entry level given no domain lab is affordable. Covered. |
| Browser troubleshooting missing | `-Pattern 'browser cache\|clear cache\|incognito\|extensions'` | Present across files; Phase 4 tasks require a cache-clearing KB article (`04:1584`). Covered. |
| Corpus is not valid UTF-8 / has BOM / CRLF | Byte-level check: BOM flag and CRLF count on all 12 files | **All 12 clean** — no BOM, 0 CRLF, valid UTF-8. An apparent mojibake sequence in tool output (a UTF-8 em-dash rendered as three Latin-1 characters) was the PowerShell console decoding the pipe, not the file. A byte-level count confirms it: `04` holds **233 correct em-dashes and zero mojibake**. **Not a defect.** This entry originally reproduced the garbled bytes verbatim, which put the only invalid sequence in the repository inside this report; it is described rather than quoted now. |

---

## 5. Corpus defects found incidentally

### 5.1 CONFIRMED — `04-phase-helpdesk-skills.md` skips Parts 8 and 9
Your known issue is real. Full heading list from `Select-String -Pattern '^### Part'`:

```
L80  Part 1    L213 Part 2    L271 Part 3    L408 Part 4    L450 Part 5
L506 Part 6    L572 Part 7    L730 Part 10   L941 Part 11   L1231 Part 12
L1414 Part 13  L1547 Part 14
```

Parts 8 and 9 **do not exist**, are never referenced anywhere in the file, and line 732 reads *"Parts 1 to 7 taught you what to do"* — confirming the gap is in the numbering, not a truncation. **Fix:** renumber Parts 10–14 to Parts 8–12. Nothing appears to be missing content-wise, so renumbering is safe and is the minimal change.

### 5.2 NEW — `04-phase-helpdesk-skills.md` has its lesson tail out of order
Phase 4 is the only phase where `### Key takeaways` and `### Part 14 — Practice this next` appear **after** the numbered lesson parts are already concluding, and the sequence in the back matter is scrambled relative to every other phase:

```
L1414   ### Part 13 — What would you do next? Drill and answer key
L1530   ### Key takeaways          <-- unnumbered, sits BETWEEN two numbered parts
L1547   ### Part 14 — Practice this next
```

Every other phase ends its lesson with `Part N — Key takeaways` **then** `Part N+1 — Practice this next` as consecutive lesson parts (see `02: Part 14 Key takeaways / Part 15 Practice this next`; `06: Part 14 Key takeaways / Part 15 Practice this next`). In Phase 4, "Key takeaways" is an unnumbered H3 sitting *outside* the Part sequence, and Part 14 ("Practice this next") follows it — so the "takeaways" heading appears mid-sequence. **Fix:** renumber `Key takeaways` as `Part 13 — Key takeaways` and shift the drill/answer-key to Part 12, keeping takeaways last. (Should be done together with 5.1.)

### 5.3 NEW — `03-phase-networking-basics.md` breaks its own `### Part N` sequence
The lesson is Parts 1–9, but an unnumbered `### Common pitfalls, and how to avoid them` H3 is inserted at **line 363, between Part 5 (L297) and Part 6 (L373)**, breaking the Part sequence mid-lesson:

```
Part 1 … Part 5 → ### Common pitfalls, and how to avoid them → Part 6 … Part 9
```

Phase 4 has the identical section as a properly-placed `#### Common pitfalls, and how to avoid them` (`04:491`, H4, inside Part 5). Phase 3 promotes it to H3 and drops it between two numbered parts. **Fix:** demote to `####` and move it inside Part 5, matching Phase 4.

### 5.4 NEW — A+ objective claim is unverifiable as written
`01:1602` cites the Professor Messer A+ Core 1 URL, and `03:1698` the Network+ N10-009 URL. Both are correct live URLs, but **I could not fetch their content** to confirm the objectives still match: `professormesser.com` serves a JavaScript shell to `web_fetch`, and the CompTIA objective PDFs (`partners.comptia.org/.../comptia-a-220-1101-exam-objectives-(3-0).pdf`, `.../comptia-network-n10-009-exam-objectives-(4-0).pdf`) both cross-origin-redirect to `comptia.org` and cannot be followed. Per the A+ objective structure I *could* confirm via CompTIA's own certification page and Wikipedia's A+ summary, Core 1 covers "troubleshooting and maintaining **computers, phones, printers, and networking**" and Core 2 covers "operating systems, end of life, **deployment**, and very few hardware questions". **Two of those words — *phones* and *deployment* — map directly onto the mobile-device and imaging gaps reported in Section 2**, so if the reader is studying toward A+, those gaps are certification gaps too, not just job gaps. Flagging as a defect only in the sense that the track cites A+ resources without ever mapping itself to the objectives it is thereby implicitly promising.

### 5.5 Checked and CLEAN — no other structural defects
- `01` Parts 1–13 — sequential, no gaps.
- `02` Parts 1–15 — sequential, no gaps.
- `03` Parts 1–9 — complete (only the misplaced H3 in 5.3).
- `05` Parts 1–10 — sequential, no gaps.
- `06` Parts 1–15 — sequential, no gaps.
- `07` Parts 1–7 — sequential, no gaps.
- `08` Parts 1–17 — sequential, no gaps. (Note: `08` contains three `##`-level headings — `## What's here`, `## Background`, `## Contact` — that are *inside* the lesson as illustrative portfolio/README examples rather than real document sections. This is intentional and reads correctly, but it means `##`-level heading extraction of `08` looks broken at first glance. Worth knowing before anyone "fixes" it.)
- `09` Parts 1–9 — sequential, no gaps.
- All 12 files: no BOM, zero CRLF, valid UTF-8, typographic characters intact.
- `checklist-master.md` and `TOOLBOX.md` are internally consistent with the phases they summarise.

---

## Closing note on honesty

The brief asked me not to invent gaps, so the headline is deliberately small: **four things genuinely missing, five thing genuinely too thin, and a list of eleven suspected gaps that the corpus disproved.** On the specific checklist items you asked about, the track passes on printer depth, VPN troubleshooting, SLA/priority queues, escalation, KB writing, phishing-from-helpdesk, hardware/laptop/peripherals, A+ resource alignment, and remote-timezone context. It fails on macOS, MDM, mobile/BYOD, docking stations, VoIP, imaging depth, malware removal, and shift handover. The macOS + MDM combination is the one I would fix first: it is the only gap here that a remote employer is likely to test *in the screening call*, before the reader's genuine technical strength is ever visible.

---

## Resolved in this pass

Every gap above was fixed by adding to the phase that already owned the topic — no tenth phase, and no change to the $0 budget. Checklist items went from 66 to 75, one per gap.

| Gap | Where it landed |
|---|---|
| macOS | Phase 2, inside Part 4 — a Windows/Linux/macOS translation table, the four real macOS tickets, and what carries over from the method but not the commands |
| MDM / Intune | Phase 5, Part 1 — enrolment, configuration, compliance, wipe, the Autopilot path, and the four tickets it generates |
| Mobile / BYOD | Phase 5, same section — mobile email, authenticator enrolment, and why a lost MFA device is an identity ticket |
| Docking stations | Phase 1, Part 8 — three symptom-table rows plus the one test that splits a dock fault from a laptop fault |
| VoIP / softphone | Phase 4, Part 4 — a scenario in the established house style, ordered device → headset → app → network |
| Imaging / provisioning | Phase 5, Part 4 — why standard images exist, `sysprep` vs Autopilot, what enrolment means, and a free way to practise |
| Malware removal | Phase 2, Part 7 — the four things people call "a virus", Defender's scan types, quarantine, and when to rebuild instead of clean |
| Shift handover | Phase 6, Part 3 — a four-field handover template with a worked example |

### Where this report was wrong

Three corrections, recorded because a report that only lists its successes is not an audit.

1. **The `dock` count was wrong.** Report says 0 matches; that searched only the 12 IT files. Across all 31 phases `dock` appears **10 times — and every one is Docker**, from the cyber labs. The conclusion held, the evidence did not.
2. **The `Intune` count was wrong, likewise.** Report says 2; across all 31 phases it is **6**, five of them in the *advance* detection track (agent paths, rule filters). Still never taught in the IT track, so the gap was real.
3. **The diagnosis of defect 5.2 was wrong, and so was the proposed fix.** The report claims Phase 4's `Key takeaways` is misplaced and suggests renumbering the drill to Part 12. Checking the repository's own guard settles it: `scripts/audit-content.mjs` enforces **`Key takeaways` before `Practice this next`** (`CLOSING_ORDER`), so the original order was already correct. Reordering it — which was tried, on the strength of this report — made the guard fail. The real defect in Phase 4 was **only** the numbering gap, and the fix is what the report's 5.1 says: renumber Parts 10–14 down to 8–12. The mismatch between 02/06 (numbered closing parts) and 03/04/07 (unnumbered) is a genuine inconsistency, but it is cosmetic and the guard accepts both spellings.

One thing the report got right and worth repeating: the `â€œ` sequence it flagged was **not** a corpus defect. A byte-level check confirms all files are clean UTF-8 with no BOM and no CRLF. The only invalid bytes in the repository were in this report, which quoted the garbled sequence verbatim; that quotation has been replaced with a description.
