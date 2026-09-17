# Questions to verify externally

Two open items from the 2026-09-17 full audit that could not be closed without
web access. Each is written as a **self-contained message** — paste the whole
block into a chat with web search; it carries its own context and needs nothing
from this repository.

Record the verdict back in the row it came from, including the source URL. A
verdict without a source is not a verdict — this repository has already been
burned once by a citation that rested on a third-party tutorial returning 403.

---

## Verdicts — both answered 2026-09-17

### Q1 → **RESOLVED, and the audit's premise was the error.** Content corrected in six places.

Broadcom did **not** remove the free tier — it **widened** it. Effective
**November 2024, VMware Workstation Pro is free for all users** (commercial,
educational, personal), the paid subscription model was retired, and the
separate cut-down **Player** product was discontinued because Pro absorbed it.
Primary source: VMware's own announcement on the Broadcom-hosted VMware blog —
*"Starting November 11, 2024, these powerful desktop hypervisor products will
be available for free to everyone—commercial, educational, and personal users
alike"* — and Broadcom's KB confirming downloads now sit behind a free support
account.

**So the licensing claim was more true than when written; only the product name
was wrong.** Six sites offered "Workstation Player personal use" for a product
that no longer exists. Corrected. The one genuinely *false* claim was `it 02`'s
*"Paid VM tools like VMware Workstation Pro offer advanced features"*, which
asserted a paid tier that had been retired.

**VirtualBox was confirmed unchanged:** base package **GPLv3**; the **Extension Pack** is free for personal and educational use under the **PUEL** but needs a paid Enterprise licence for commercial use. **Host-only networking and snapshots are in the free GPL core**, not behind the Extension Pack — which is the specific fact that makes the $0 rule hold, and it was checked rather than assumed.

**The reply's own framing of the lesson, which is sharper than the audit's:** *"a second-hand report of a change was adopted as a premise, and nobody checked the change's direction."* The item nearly caused six files to be "fixed" in the wrong direction — and the six files it named are exactly the six that needed the *other* edit.

**Verification of the six sites** (`git grep "Workstation Player"` over `career-roadmaps/` returns **zero** stale rows). Every surviving occurrence is either a historical record in `docs/`/`CHANGELOG.md` or the deliberate explanatory note at `cybersec 04:252`, which now teaches the rename because a beginner will meet the old name in every tutorial written before November 2024.

**The lesson is about the audit, not about VMware:** a second-hand report of a
change was adopted as a premise and nobody checked the change's *direction*. The
item nearly caused six files to be "fixed" in the wrong direction.

### Q2 → **UNVERIFIABLE without live job-board access. Claim softened; item stays open.**

The model correctly declined to answer from training data — *"Any answer I gave
about what postings say would be an impression from training data, not
evidence."* It could not retrieve postings from Indeed or LinkedIn, which block
automated access.

**Its structural criticism was accepted.** The text carried three components at
different evidentiary burdens:

| Component | Was | Status |
|---|---|---|
| A | "Remote work skews heavily toward Macs" | **Overreached** — universal quantifier, no sample |
| B | "most US-based software companies issue MacBooks" | **Overreached** — empirical, unsupported |
| C | "Answering 'I only know Windows' costs you the interview" | **Overreached** — asserts a screening *outcome* |

**Acted on (D-048):** IT 02's macOS section and IT 05's MDM section now state
the weaker, defensible version and **name their own limits in the text** — *"a
reasonable read of the remote job market, not a measured one"*. The argument is
now the **cost asymmetry** (an afternoon to learn the mapping, versus a
conversation you never got to have), which is defensible without a sample. IT 02
also gained a paragraph on where macOS matters **less** (on-premises
Windows-heavy environments), so the section no longer reads as a universal
requirement.

**The strongest sentence in the MDM section was replaced, not reworded**, which
is worth recording because it is the kind of edit that is easy to only
half-make. The load-bearing claim *"for remote work it is not optional"* is
**gone**; `it 05:157` now reads *"You do not need MDM to pass an interview, but
you should be able to say what it is and why a remote-first company depends on
it."* That is a **weaker** claim, and it is the one the text can keep. Verified
by `git grep "not optional"` over `career-roadmaps/`: the nine surviving hits
are all about unrelated things (authorisation, cleanup steps, portfolio
sections, IP masks), **none about MDM or macOS.**

**Still open:** the 15–20 posting sample is the only thing that turns this from
a reasonable read into a number. **"Twelve of eighteen postings named macOS" is
checkable; "macOS is expected" is not.** The question below is unchanged and
still usable.

**Incidental findings from the search, recorded with their sample size attached
because that is the entire point.** The reply returned **two** postings, not
fifteen, and said so:

- A remote **L1 Help Desk** role at an **Apple-centric MSP** requiring macOS
  support and MDM navigation, with Windows "in the mix".
- A **first-level IT support** role requiring *"proven hands-on support
  experience for both macOS and Windows environments, including hardware
  diagnostics and OS-level troubleshooting"* and *"direct experience managing
  devices through an MDM platform (such as Jamf, Mosyle, Kandji, or Intune)"*.

**Both are consistent with the softened claim and neither proves it.** Two
postings selected by a search for macOS are not a sample of the market — they
are a sample of the search. **Two is not fifteen**, and the reply's own line is
the correct summary: *"Two is not a sample."*

**Countervailing market data, which is the more useful half.** Enterprise client
share still runs **Windows 72–85%**, with Windows 10 alone on a substantial
slice of enterprise PCs. This is *why* the added paragraph on where macOS
matters **less** is the right shape for the section: on-premises Windows-heavy
environments remain the majority of enterprise IT, so a universal framing was
wrong in both directions.

**The A/B/C table above is the durable output here, not the count.** Each
component failed for a *different* reason — a universal quantifier (A), an
unsupported empirical claim (B), and an asserted screening *outcome* rather than
a preference (C) — which is why softening needed three separate edits rather
than one. **The claim was never one claim.**

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

### What to do with the answer — **CLOSED, and this block was wrong**

Kept rather than deleted, because it is the artefact of the error. It framed the
outcome as a binary — free tier exists (no change) or it ended (five files) —
and **both branches were wrong**:

- The premise "reports say the free tier was discontinued" was itself the defect.
  There was no third branch for *"the report was wrong in the direction that
  matters"*, which is the one that occurred.
- It names **five** files; the real edit touched **six**, and the one it missed
  was the only genuinely false statement in the set (`it 02`'s *"Paid VM tools
  like VMware Workstation Pro offer advanced features"*, asserting a retired paid
  tier).
- Its first file, `it 02:1336`, was listed for a *licensing* fix. The licensing
  there was fine; only the product **name** was wrong.
- `cybersec 04:250` is annotated here as **"the strongest claim"**. It was — and
  it was **already true**, needing only the product rename. **The site flagged as
  most exposed was the least wrong**, which is worth keeping in view: the audit's
  confidence ranking of its own findings was not correlated with their accuracy.

**The two guards named on the last line are necessary and not sufficient.** They
passed before the fix and after it, because a product name is not something a
structural guard can see (D-036). The check that actually settles this is
`git grep "Workstation Player"` over `career-roadmaps/`, which must return zero
stale rows.

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
