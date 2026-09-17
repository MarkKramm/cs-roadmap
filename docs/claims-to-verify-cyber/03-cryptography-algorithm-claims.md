You are verifying technical claims from a training curriculum against
**primary sources** — Microsoft Learn, IANA, RFCs, POSIX man pages, and vendor
documentation.

The table below is complete and self-contained. Every row you need is here.

## What to do

For each row, replace the empty last column with exactly one of:

| Verdict | Format |
|---|---|
| `OK` | `OK` — then the **URL** that settles it, and a short quote from it |
| `WRONG` | `WRONG` — the correct value, **and** the URL that proves it |
| `UNVERIFIABLE` | `UNVERIFIABLE` — say briefly why (judgement, analogy, or simplification) |

## Rules

1. **Every `OK` and every `WRONG` must carry a source URL, and a quote from
   it that settles the claim.** The quote is not decoration: a URL alone says
   only that a page exists. If you cannot quote the line that decides the
   claim, the verdict is `UNVERIFIABLE`. A recollection is not a source.
2. **Prefer the authority over a page that agrees with it.** Rank sources:
   the standard itself (RFC, POSIX, FHS, IANA registry) > the vendor's own
   reference documentation > a vendor tutorial or blog > a forum answer or a
   third-party article. Use the highest rank you can reach, and **name the
   source type** in the verdict. A claim sourced to a forum post or a
   third-party tutorial is weaker evidence than the same claim sourced to the
   spec, and the reader needs to know which they are getting.
3. **Never cite a page you could not open or whose text you could not read.**
   If a source is paywalled, login-gated, blocked, or empty, it does not count
   as a source. Say so.
4. **Cite in the language you read.** If the only page you can reach is a
   localised version of the vendor's documentation, say that explicitly, and
   prefer finding the English original.
5. **Do not guess to fill a row.** An honest `UNVERIFIABLE` is a useful
   result; an invented URL is worse than no answer, because it will be acted on.
6. **Output the complete table, every row, in order.** Do not summarise, do not
   sample, do not stop early. If you run low on room, stop at a row boundary
   and say which row number to continue from.
7. **If any part of a row is unclear, say so in the verdict** (`UNVERIFIABLE —
   text truncated`) rather than inferring the claim. Never reconstruct a claim
   you cannot read.
8. Some short rows are followed by a small grey line showing the text above and
   below them. **That context is part of the claim** — use it.
9. `UNVERIFIABLE` is expected to be common and is not a failure. A great deal
   of this curriculum is teaching method, diagnostic reasoning, and worked
   examples, none of which is a fact about the world.

# Cryptography algorithm claims


*Key sizes, hash lengths and the broken/sound status of an algorithm are fixed facts. Telling a beginner MD5 or SHA-1 is acceptable is the kind of error that persists into their work.*

**Source to check against:** The defining standard (NIST FIPS), or the IETF RFC for the protocol

5 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:677` ▶ | ssh-keygen -t ed25519 -C "lab key" # generate a keypair | |
| | | <sub>↑ ```bash<br>↓ ssh-copy-id user@192.168.1.50 # install the public key (Linux/macOS)</sub> | |
| 2 | `11-phase-incident-response.md:458` | \| **AmCache** \| `C:\Windows\AppCompat\Programs\Amcache.hve` \| Program execution with SHA-1 hashes and install paths \| | |
| 3 | `11-phase-incident-response.md:466` | **AmCache is the single most under-used artefact by beginners.** It records executables with their SHA-1 hashes, which means you can take a hash you found in AmCache and check it against a public reputation service without ever having the file. | |
| 4 | `11-phase-incident-response.md:1244` | - A memory acquisition record with tool, time, and SHA-256 hash | |
| | | <sub>↑ - Triage records for ten alerts with severity and escalation reasoning<br>↓ - A disk image hash verification and a timeline table built from at least three sources</sub> | |
| 5 | `14-phase-web-app-security.md:392` | **The password-storage rule is the one to know precisely.** Passwords are stored with a slow, salted, memory-hard hash: `bcrypt`, `scrypt`, or `Argon2`. Not SHA-256, and never MD5 or SHA-1. The reason is speed. A modern GPU computes billions of SHA-256 hashes  … | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._
