# Questions to verify externally

Two open items from the 2026-09-17 full audit that could not be closed without
web access. Each is written as a **self-contained message** — paste the whole
block into a chat with web search; it carries its own context and needs nothing
from this repository.

Record the verdict back in the row it came from, including the source URL. A
verdict without a source is not a verdict — this repository has already been
burned once by a citation that rested on a third-party tutorial returning 403.

---

## Q1 — Is VMware Workstation Player still free for personal use?

**Why this matters:** the curriculum is deliberately $0-budget, and it offers
VMware Workstation Player as the free alternative to VirtualBox in five places.
If that tier no longer exists, five files are telling a beginner to install
software they cannot legally use for free.

### The message to paste

> I need a current, sourced answer about VMware desktop virtualization licensing.
>
> Background: Broadcom acquired VMware and there were reports in 2024 that the
> free-for-personal-use tier of VMware Workstation Player was discontinued, and
> that the product line was consolidated. I need to know the situation as it
> stands now.
>
> Please answer these specifically:
>
> 1. **Is there a version of VMware Workstation (or Workstation Player) that an
>    individual can legally use at no cost for personal, non-commercial
>    learning?** Yes or no.
> 2. If yes — what is it currently called, and where is the official download
>    page? Please give the URL.
> 3. If no — when did the free tier end, and what did Broadcom's own
>    announcement or documentation say? Quote it.
> 4. **Separately:** is Oracle VirtualBox still free and open source for
>    personal use under the same terms it has historically been? (I want to be
>    sure the *primary* recommendation in my material is still correct, not just
>    the fallback.)
> 5. If the free VMware tier is gone, **what is the best genuinely free
>    alternative** on Windows for someone building a home lab to learn
>    cybersecurity — specifically one that supports host-only networking and
>    snapshots? Name at least two, and say which you would pick and why.
>
> **Important:** please cite Broadcom's or VMware's own documentation or
> official announcement for questions 1–4. Do not rely on blog posts,
> Stack Overflow answers, or AI-generated summary sites — I have been misled by
> those before. If you cannot find a primary source, say so explicitly rather
> than giving me a plausible answer.

### What to do with the answer

- If the free tier still exists → close this item, no content change.
- If it ended → **five files need editing**, and the fix differs per site:
  - `career-roadmaps/it-roadmap/02-phase-operating-systems.md` line 1336 — tools table row ("VMware Workstation Player personal use")
  - `career-roadmaps/it-roadmap/02-phase-operating-systems.md` line 1523 — prose saying paid VMware tools are "unnecessary here"
  - `career-roadmaps/cybersec-roadmap/04-phase-hands-on-labs.md` line 250 — **the strongest claim**: "Both are genuinely free, and both will complete this phase"
  - `career-roadmaps/cybersec-roadmap/04-phase-hands-on-labs.md` line 252 — a comparison table
  - `career-roadmaps/cybersec-roadmap/04-phase-hands-on-labs.md` line 884 — tools table row
  - `career-roadmaps/cybersec-roadmap/15-phase-ot-ics-security.md` line 1132 — tools table row
- After editing, run: `node scripts/lint-content.mjs && node scripts/audit-content.mjs`

---

## Q2 — Is the macOS claim in the IT track true of the actual remote job market?

**Why this matters:** the IT track's macOS material is the **only content in the
repository written to a market claim** rather than to an existing syllabus. The
claim is that remote entry-level IT work now expects macOS and cloud-managed
devices, so a Windows-only technician loses the screening call. If that is
wrong, the sections are wasted effort — and worse, they may be teaching a
beginner to worry about a requirement that does not exist.

### The message to paste

> I am writing self-study material for someone in the Philippines targeting
> **remote entry-level IT support / helpdesk roles** for overseas (mainly US)
> employers. I have made a claim in my material and I want it tested against
> real job postings rather than assumed. Here is the claim:
>
> *"Remote work skews heavily toward Macs. Startups, design agencies, and most
> US-based software companies issue MacBooks, and 'can you support Macs?' is a
> question asked in the screening call. Answering 'I only know Windows' costs
> you the interview. A candidate should also expect cloud-managed devices
> (Intune, Jamf, MDM) rather than on-premises Active Directory."*
>
> Please evaluate this against actual current job postings, and answer:
>
> 1. **Search for current remote entry-level IT support / helpdesk / service
>    desk postings that are open to Philippines-based applicants.** Roughly 15–20
>    if you can. For each, note whether it mentions **macOS** support, and
>    whether it mentions a **cloud MDM** (Intune, Jamf, Kandji, Addigy).
> 2. **What proportion mention macOS?** Give me a rough number and say how many
>    postings you actually looked at, so I can judge the sample.
> 3. **Is macOS typically listed as Required, Preferred, or merely Mentioned?**
>    This distinction matters more than the raw count.
> 4. **How often is Active Directory still named**, versus Entra ID / Intune?
>    Has AD actually been displaced at the entry level, or do postings still
>    expect it?
> 5. **What skills do these postings actually ask for most often?** Give me the
>    top handful, roughly in order.
> 6. **Where does my claim overreach?** Be direct — I would rather delete a
>    weak section than keep a plausible-sounding one that is not true.
>
> If you cannot retrieve live job postings, **say so rather than answering from
> general knowledge** — I need to know whether this is evidence or an
> impression, because I will act differently on each.

### What to do with the answer

- **If the claim holds** → close the item, and consider recording the evidence
  in `docs/IT-CONTENT-AUDIT.md`, which is where this claim originated.
- **If it overreaches** → the affected material is:
  - the macOS subsection in `career-roadmaps/it-roadmap/02-phase-operating-systems.md`, **lines 400–424** (heading at 400, "why you cannot skip it" — this is where the claim is stated most strongly, including *"remote work skews heavily toward Macs"* and *"Answering 'I only know Windows' costs you the interview"*)
  - the MDM material in `career-roadmaps/it-roadmap/05-phase-sysadmin-basics.md` — **not IT 02** (section opens around line 155, with the topic-list bullet at line 39). It contains the load-bearing sentence *"for remote work it is not optional"*.
  - Softening is a real edit, not a wording tweak: this repository's rule is that a claim in the text must be one the text can keep.
- **Either way:** record the sample size. "Twelve of eighteen postings named
  macOS" is checkable; "macOS is expected" is not.

---

## Note on both

Neither of these is a defect in the sense the guards check — no file contradicts
itself, and every internal cross-reference resolves. They are **claims about the
world** that happen to sit in the curriculum, which is a class this repository
has explicitly recorded as one no guard can see (`docs/DECISIONS.md` → D-036).
That is why they are queued here for a human with search rather than fixed.
