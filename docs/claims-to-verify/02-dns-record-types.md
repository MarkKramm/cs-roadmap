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

1. **Every `OK` and every `WRONG` must carry a source URL.** If you cannot
   find a URL, the verdict is `UNVERIFIABLE`. A recollection is not a source.
2. **Do not guess to fill a row.** An honest `UNVERIFIABLE` is a useful
   result; an invented URL is worse than no answer, because it will be acted on.
3. **Output the complete table, every row, in order.** Do not summarise, do not
   sample, do not stop early. If you run low on room, stop at a row boundary
   and say which row number to continue from.
4. **If any part of a row is unclear, say so in the verdict** (`UNVERIFIABLE —
   text truncated`) rather than inferring the claim. Never reconstruct a claim
   you cannot read.
5. Some short rows are followed by a small grey line showing the text above and
   below them. **That context is part of the claim** — use it.
6. `UNVERIFIABLE` is expected to be common and is not a failure. A great deal
   of this curriculum is teaching method, diagnostic reasoning, and worked
   examples, none of which is a fact about the world.

# DNS record types


*Defined by RFC 1035 and successors. Small set, easy to get subtly wrong.*

**Source to check against:** RFC 1035 and the IANA DNS parameters registry

4 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `03-phase-networking-basics.md:54` | - DNS: A, AAAA, CNAME, MX, TXT, NS records | |
| | | <sub>↓ - DHCP: Discover, Offer, Request, Acknowledge at a beginner level</sub> | |
| 2 | `03-phase-networking-basics.md:180` | 2. **`AAAA` records are the DNS counterpart to IPv4's `A` records.** If a name resolves over IPv4 but not IPv6, an `AAAA` lookup tells you. | |
| 3 | `03-phase-networking-basics.md:231` ▶ | nslookup google.com # the A record | |
| | | <sub>↑ ```powershell<br>↓ nslookup -type=mx gmail.com # mail servers</sub> | |
| 4 | `03-phase-networking-basics.md:233` ▶ | nslookup -type=txt google.com # TXT records | |
| | | <sub>↑ nslookup -type=mx gmail.com # mail servers<br>↓ nslookup google.com 8.8.8.8 # ask a SPECIFIC server</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._
