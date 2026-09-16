---
id: cyber-12-scripting-automation
track: cyber
phase: 12
order: 120
title: "Phase 12 — Scripting and Automation for Security"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/12-scripting-automation.md"
exit_criteria: "You can write a small tool that takes real security data in, produces a defensible answer out, handles untrusted input without breaking or leaking secrets, and comes with a README someone else could follow."
---

# Phase 12 — Scripting and Automation for Security

## Goal of this phase

Learn just enough Python and PowerShell to automate the repetitive parts of security work, and learn the judgement to know which parts should not be automated at all.

## Estimated time

**6 weeks** at about 8–11 focused hours a week. Roughly 51–66 hours, and most of it is spent writing code rather than reading about it.

## Skills you'll gain

- Read and write Python well enough to parse logs, call APIs, and produce a report.
- Use PowerShell to triage a Windows host with `Get-WinEvent`, `Get-Process`, and `Get-NetTCPConnection`.
- Make authenticated HTTP requests to a real API and handle the responses and errors properly.
- Parse messy real-world log data with regular expressions, and know when not to use them.
- Handle untrusted input without crashing, and without creating a security problem.
- Store secrets in environment variables or a vault rather than in source code.
- Decide deliberately when automation is worth building and when it is not.
- Write a README that lets someone else run your tool without asking you a question.

## Specific topics to learn

- Python basics: variables, lists, dictionaries, loops, conditionals, functions
- File handling: reading logs, writing reports, working with CSV and JSON
- The `json` module and why every API speaks JSON
- The `re` module for log parsing, and the limits of regular expressions
- The `requests` library: GET, POST, headers, authentication, timeouts, retries
- Error handling with `try` and `except`, and why silent failure is dangerous
- Command-line arguments with `argparse`
- Virtual environments and dependency pinning with `requirements.txt`
- Secrets management: environment variables, `.env` files, and `.gitignore`
- PowerShell for triage: `Get-WinEvent`, `Get-Process`, `Get-NetTCPConnection`, `Get-Service`
- PowerShell objects and pipes, and why `Select-Object` beats text parsing
- Calling REST APIs from PowerShell with `Invoke-RestMethod`
- Hash computation with `hashlib` and `Get-FileHash` for IOC matching
- Defanging indicators so they are safe to paste into reports
- Input validation and the risks of `eval`, shell string interpolation, and unsafe deserialisation
- Logging and audit trails for automated actions
- Idempotency — running the same script twice has the same effect as running it once — and what breaks when it does not
- When not to automate: the judgement call

## Lesson: Automate the Boring Parts, Never the Judgement

### Why this lesson exists

Phases 4, 10, and 11 asked you to do repetitive things by hand: read logs, compare hashes, extract fields, build timelines, check indicators.

Doing them by hand once is how you learn what they mean. Doing them by hand every day is how you stop learning anything and start resenting the work.

**That is the gap this phase closes.** You are going to learn enough code to automate the mechanical parts, and — more importantly — enough judgement to know which parts must stay manual.

The judgement half is the part that matters most, and it is the one beginners get backwards.

| Tempting to automate | Should stay manual |
|---|---|
| Extracting fields from a log file | Deciding whether an alert is a true positive |
| Checking 4,000 hashes against a list | Deciding whether to contain a production server |
| Converting timestamps to one timezone | Deciding what to tell the customer |
| Pulling the last 24 hours of failed logons | Deciding whether the pattern is an attack or a broken script |
| Deduplicating alerts | Deciding which alert to work first |
| Producing a timeline table | Deciding what the timeline means |

Look at the right-hand column. Every item there is a decision with a consequence, made under uncertainty, where being wrong has a cost. **Automation does not do those, and a tool that pretends to is worse than no tool at all** — because a confident wrong answer is harder to catch than an obviously missing one.

The rule this phase teaches: **automate the collection and the transformation; keep the judgement and the decision.**

#### What you already have, and why it is a real advantage

You have a web development background. That matters more in this phase than in any other, and it is worth naming precisely.

| What you already know | How it applies here |
|---|---|
| HTTP requests and status codes | Every security API is an HTTP API, and the error handling is identical |
| JSON parsing | API responses, configuration, and log exports are all JSON |
| Authentication flows | API keys, bearer tokens, OAuth — the same patterns, new names |
| Version control and `.gitignore` | The habit that prevents the most common security mistake in this phase |
| Reading documentation | Half of security automation is reading an API reference carefully |

The half you probably do *not* have is defensive programming for hostile input. Web development usually assumes the input is roughly what you expect. Security tooling cannot: it processes attacker-controlled data constantly, and a script that crashes on a malformed log line is a script that fails at the exact moment you need it.

#### Time to complete

**Roughly 51–66 hours over 6 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 4–5 | Once, properly |
| Python fundamentals, if you need them | 8–12 | Skip entirely if you already write Python |
| The log parser tool | 12–15 | The core build |
| The API tool | 10–12 | Where authentication and error handling are learned |
| The PowerShell triage script | 8–10 | A different language, the same ideas |
| Secrets, packaging, and the README | 6–8 | The part that makes it usable |
| The "what I decided not to automate" write-up | 3–4 | Short, and the most mature artefact |

#### What this phase is not

It is not a software engineering phase. You will not learn design patterns, async frameworks, or a full test suite, and you do not need to for entry-level security work. You will write three small tests per tool — a known-good input, a malformed one, and an empty one — because hostile input is the thing your scripts must survive, and that is the whole of the testing this phase asks for.

It is not a malware analysis or exploit development phase either. You are writing defensive tooling that processes data, and the hardest thing it does is handle input that was designed to break it.

### Part 1 — Python for security work, without the detour

#### The five minutes of syntax you actually need

Python is worth learning because every security tool you will touch either is Python or has a Python library. The subset that matters is small.

```python
# Variables and the two data structures that do most of the work.
hostname = "LAB-WIN10"                 # a string
event_count = 42                       # an integer
severity = 7.5                         # a float
is_alert = True                        # a boolean

failures = ["admin", "root", "postgres"]        # a list — ordered
event = {"id": 4625, "user": "admin", "host": hostname}   # a dict — keyed

# Accessing them.
print(failures[0])                     # admin
print(event["user"])                   # admin
print(event.get("source_ip", "unknown"))  # dict.get with a default

# Iterating, which is what you do to logs.
for attempt in failures:
    print(attempt)

for key, value in event.items():
    print(f"{key}: {value}")

# Conditionals, including the one you will use constantly.
if event["id"] == 4625 and event.get("user") == "admin":
    print("Failed logon for the admin account")

# A function, with a type hint that costs nothing and helps a reader.
def is_privileged(user: str) -> bool:
    """Return True if the account is a built-in privileged account."""
    return user.lower().rstrip("$") in {"administrator", "admin", "root"}
```

That is genuinely most of what you need for the tools in this phase. Lists, dictionaries, loops, conditionals, and functions cover the work; the rest is library knowledge, and library knowledge is looked up rather than memorised.

#### Reading a log file without loading it into memory

The first real skill is reading a file safely. Security logs are large, and lines can be malformed.

```python
from pathlib import Path

def read_lines(path: str):
    """Yield non-empty lines from a file, one at a time."""
    with Path(path).open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            line = line.rstrip("\n")
            if line:
                yield line

for line in read_lines("/var/log/auth.log"):
    if "Failed password" in line:
        print(line)
```

Three details in that function are deliberate and each prevents a real problem.

| Detail | Why it matters |
|---|---|
| `with ... open(...)` | Closes the file even if an exception occurs, which matters when you are processing thousands of files |
| `errors="replace"` | A log written in a different encoding will not crash your run; the damaged character becomes a placeholder |
| Yielding lines rather than returning a list | A 2 GB log does not need to be in memory all at once |

**The beginner's version of this reads the whole file with `.read()` and splits it.** That works on your test data and fails on the first real log you point it at, usually at the worst possible moment.

#### Dictionaries are how security data is shaped

Almost every piece of security data is a dictionary: an event, an alert, a finding, a user record. Getting comfortable with them is most of the work.

```python
events = [
    {"id": 4625, "user": "admin", "src": "203.0.113.44", "time": "2026-03-14T04:52:11Z"},
    {"id": 4625, "user": "root",  "src": "203.0.113.44", "time": "2026-03-14T04:52:13Z"},
    {"id": 4624, "user": "deploy", "src": "203.0.113.44", "time": "2026-03-14T04:52:15Z"},
]

# Count failures by source address — the most common security aggregation.
from collections import Counter

failures = [e for e in events if e["id"] == 4625]
by_source = Counter(e["src"] for e in failures)
print(by_source.most_common(5))
# [('203.0.113.44', 2)]

# Group events by a key, which is how you turn a log into a report.
from collections import defaultdict

by_user = defaultdict(list)
for event in events:
    by_user[event["user"]].append(event["time"])

for user, times in sorted(by_user.items()):
    print(f"{user}: {len(times)} event(s), first {min(times)}")
```

`Counter` and `defaultdict` are two lines of import that replace twenty lines of manual counting, and both come with the standard library.

#### Worked example: parsing an auth log into a finding

Here is a complete, realistic script. It reads an SSH log, finds successful logins that followed a burst of failures from the same address, and prints a finding.

```python
#!/usr/bin/env python3
"""Find successful SSH logins that follow a burst of failures from one IP.

Usage:
    python suspicious_logins.py /var/log/auth.log --threshold 3
"""

import argparse
import re
from collections import defaultdict
from pathlib import Path

FAILED = re.compile(
    r"Failed password for (?:invalid user )?(?P<user>\S+) "
    r"from (?P<ip>\d+\.\d+\.\d+\.\d+)"
)
ACCEPTED = re.compile(
    r"Accepted \S+ for (?P<user>\S+) "
    r"from (?P<ip>\d+\.\d+\.\d+\.\d+)"
)


def parse(path: str):
    """Yield (kind, user, ip) for each recognisable line."""
    for line in Path(path).open("r", encoding="utf-8", errors="replace"):
        for kind, pattern in (("fail", FAILED), ("success", ACCEPTED)):
            match = pattern.search(line)
            if match:
                yield kind, match["user"], match["ip"]
                break


def find_suspicious(path: str, threshold: int):
    failures = defaultdict(int)
    successes = defaultdict(list)      # ip -> list of (user, failures_before)

    for kind, user, ip in parse(path):
        if kind == "fail":
            failures[ip] += 1
        else:
            # A success only counts if a burst came *before* it. Reset the
            # running count either way, so a success that arrives first is not
            # credited to failures that happen afterwards — the mistake this
            # script made in its first version.
            if failures[ip] >= threshold:
                successes[ip].append((user, failures[ip]))
            failures[ip] = 0

    findings = []
    for ip, hits in successes.items():
        findings.append({
            "source_ip": ip,
            "failures_before": max(count for _, count in hits),
            "accounts_logged_in": sorted({user for user, _ in hits}),
        })
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("logfile")
    parser.add_argument("--threshold", type=int, default=3)
    args = parser.parse_args()

    findings = find_suspicious(args.logfile, args.threshold)
    if not findings:
        print("No suspicious login sequences found.")
        return 0

    for finding in findings:
        print(
            f"{finding['source_ip']} produced {finding['failures_before']} failures "
            f"then logged in as: {', '.join(finding['accounts_logged_in'])}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

That script is small, and it demonstrates the pattern every tool in this phase follows.

| Element | Purpose |
|---|---|
| A module docstring with usage | The tool explains itself |
| Compiled regular expressions at module level | Compiled once, not per line, which matters on large files |
| Named groups in the pattern | `match["user"]` reads better than `match.group(1)` and survives a pattern change |
| A generator for parsing | Streams rather than loading |
| A pure function for the logic | Testable without a file |
| `argparse` | The tool is usable by someone else without editing the code |
| A return code from `main` | Scriptable, so it can run in automation |
| `raise SystemExit(main())` | The conventional entry point |

**The separation of parsing from logic is the design decision that matters.** `find_suspicious` takes a path and returns data. It is not entangled with printing. That means you can test it, reuse it, and change the output without touching the detection.

### Part 2 — Data formats, and the shapes you will meet

#### JSON, and why every API speaks it

JSON is the interchange format of security tooling. It is also Python's native dictionary shape, which is why parsing it is one line.

```python
import json
from pathlib import Path

# Reading an API response or an exported alert from disk.
with Path("alert.json").open(encoding="utf-8") as handle:
    alert = json.load(handle)

print(alert["rule"]["name"])
print(alert["agent"]["name"])
print(alert["data"].get("win", {}).get("eventdata", {}).get("commandLine"))

# Writing a structured report.
report = {
    "generated": "2026-03-14T12:00:00Z",
    "findings": [{"id": 1, "severity": "high", "summary": "Encoded PowerShell"}],
}
Path("report.json").write_text(
    json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
)
```

Two traps in JSON handling catch beginners repeatedly.

| Trap | What happens | Fix |
|---|---|---|
| Assuming a key exists | `KeyError` and the script stops mid-run | Use `.get()` with a default, always |
| Assuming the shape is fixed | A vendor changes the schema and your tool breaks silently | Validate, and fail loudly when the shape is unexpected |
| Nested keys several levels deep | `alert["data"]["win"]["eventdata"]["commandLine"]` raises on any missing level | Chain `.get()` calls, or write a small helper |
| Large files loaded fully | Memory exhaustion | Use `json.load` only on files you know are small |

```python
def dig(data: dict, *keys, default=None):
    """Walk nested dictionaries safely, returning a default if any level is missing."""
    for key in keys:
        if not isinstance(data, dict):
            return default
        data = data.get(key)
        if data is None:
            return default
    return data

# One call instead of a chain that raises on the first missing level.
command_line = dig(alert, "data", "win", "eventdata", "commandLine", default="")
```

That helper is eight lines and it removes a whole class of crash from every script you write afterwards.

#### CSV, and why you should still care

JSON is for machines. CSV is for people, and for the spreadsheet a manager will open.

```python
import csv

rows = [
    {"time": "2026-03-14T04:52:11Z", "user": "admin", "src": "203.0.113.44", "result": "fail"},
    {"time": "2026-03-14T04:52:15Z", "user": "deploy", "src": "203.0.113.44", "result": "success"},
]

with open("findings.csv", "w", newline="", encoding="utf-8") as handle:
    writer = csv.DictWriter(handle, fieldnames=["time", "user", "src", "result"])
    writer.writeheader()
    writer.writerows(rows)
```

| Detail | Why it matters |
|---|---|
| `newline=""` | Without it, Windows writes blank lines between rows |
| `encoding="utf-8"` | Default encoding on Windows is not UTF-8, and a curly quote in a username will corrupt the output |
| `DictWriter` with explicit fieldnames | The column order is fixed rather than dependent on dictionary ordering |
| `writerows` rather than a loop | Shorter and faster |

**A CSV as a deliverable matters more than it sounds.** An analyst who produces a spreadsheet a manager can filter has produced something usable. An analyst who produces a raw JSON dump has produced something the manager will ask someone else to interpret.

#### Regular expressions: powerful, and easy to regret

Regular expressions ("regex") match patterns in text. They are essential for log parsing and they are overused in ways that cause real bugs.

```python
import re

# A well-formed pattern with named groups and anchored structure.
SYSLOG_SSH = re.compile(
    r"^(?P<month>\w{3})\s+(?P<day>\d{1,2})\s+(?P<time>\d{2}:\d{2}:\d{2})\s+"
    r"(?P<host>\S+)\s+sshd\[(?P<pid>\d+)\]:\s+"
    r"(?P<message>.*)$"
)

line = "Mar 11 04:52:15 web-01 sshd[21483]: Accepted publickey for deploy from 203.0.113.44 port 51264 ssh2"
match = SYSLOG_SSH.match(line)
if match:
    print(match.groupdict())
```

When regex is the right tool, and when it is not:

| Use regex for | Do not use regex for |
|---|---|
| Extracting a field from a semi-structured log line | Parsing structured JSON, which has a parser |
| Validating a simple format such as an IP or a hash prefix | Parsing HTML, which has a parser |
| Finding a substring pattern across many lines | Parsing CSV, which has a parser that handles quoting |
| Extracting an indicator from free text | Splitting a path, which has `pathlib` |
| Recognising a known-bad pattern in a command line | Full grammar, which needs a real parser |

**The most common regex mistake in security tooling is validating something with a pattern that is too loose.** An IP address pattern of `\d+\.\d+\.\d+\.\d+` matches `999.999.999.999`, which is not an address. It also fails on IPv6 entirely.

| Loose pattern | What it wrongly accepts |
|---|---|
| `\d+\.\d+\.\d+\.\d+` | `999.1.1.1`, and anything that merely looks like an address |
| `\S+@\S+` for an email | `not@an@email`, and `@` on its own |
| `.*` for a filename | Everything, including a newline in some modes |
| `[A-Fa-f0-9]+` for a SHA-256 | A 3-character string |

The fix is either a stricter pattern or, often better, a real library. Python has `ipaddress` for addresses and `email.utils` for email, and both are stricter than a pattern you will write by hand.

```python
from ipaddress import ip_address

def is_ip(value: str) -> bool:
    """Return True if the string is a valid IPv4 or IPv6 address."""
    try:
        ip_address(value)
        return True
    except ValueError:
        return False

print(is_ip("203.0.113.44"))   # True
print(is_ip("999.999.999.999"))  # False
```

**That pattern — reach for the standard library before writing a pattern — applies throughout this phase.** The library is stricter, better tested, and shorter.

#### Defanging indicators

An indicator of compromise is a URL, domain, IP address, or hash that identifies malicious activity. If you put a live URL in a report and someone clicks it, you have caused the incident you were documenting.

**Defanging** means making an indicator non-clickable while keeping it readable.

```python
def defang(indicator: str) -> str:
    """Make an indicator safe to paste into a report or an email."""
    return (
        indicator.replace("http://", "hxxp://")
        .replace("https://", "hxxps://")
        .replace(".", "[.]")
        .replace("@", "[at]")
    )

def refang(indicator: str) -> str:
    """Reverse defanging, for use in code rather than in prose."""
    return (
        indicator.replace("hxxps://", "https://")
        .replace("hxxp://", "http://")
        .replace("[.]", ".")
        .replace("[at]", "@")
    )

print(defang("https://malicious.example.com/payload?id=1"))
# hxxps://malicious[.]example[.]com/payload?id=1
```

| Rule | Why |
|---|---|
| Defang in every written output | A report is read by people who may click |
| Keep the original in machine-readable output | Your code needs to match the real value |
| Defang consistently | Mixed conventions make a report hard to read |
| Never defang a hash | A hash is not clickable and defanging it breaks matching |

**The third column of that last row is the one that catches people.** Defanging a SHA-256 by inserting `[.]` makes it unsearchable and unverifiable. Hashes, and only hashes, stay as they are.

### Part 3 — Talking to APIs

#### An API is a website for programs

Every security platform has one: a VirusTotal lookup, a threat-intelligence feed, an endpoint agent's alert list, a cloud provider's audit API. They all work the same way, and you already know the pattern from web development.

| Concept | What it means | Web development equivalent |
|---|---|---|
| **Endpoint** | The URL you call | A route |
| **Method** | GET to read, POST to create, PUT or PATCH to update, DELETE to remove | An HTTP verb |
| **Headers** | Metadata about the request, including authentication | Request headers |
| **Query parameters** | Filters appended to the URL | A query string |
| **Body** | The data you send, usually JSON | A request payload |
| **Status code** | 200 success, 401 unauthorised, 403 forbidden, 404 missing, 429 rate limited, 5xx server error | The same codes |
| **Rate limit** | How many calls you may make per minute | A quota |

**The one that surprises people is the rate limit.** Free tiers of threat-intelligence APIs are usually tightly limited — VirusTotal's public API allows only a small number of requests per minute — and a script that ignores this gets blocked, sometimes permanently.

#### A request that handles the things that go wrong

```python
import os
import time
from typing import Any

import requests

API_BASE = "https://www.virustotal.com/api/v3"


def lookup_file_hash(file_hash: str, api_key: str, retries: int = 3) -> dict[str, Any]:
    """Look up a file hash. Returns the parsed response, or a dict with an error."""
    url = f"{API_BASE}/files/{file_hash}"
    headers = {"x-apikey": api_key, "Accept": "application/json"}

    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers, timeout=15)
        except requests.Timeout:
            if attempt == retries - 1:
                return {"error": "timeout", "hash": file_hash}
            time.sleep(2 ** attempt)
            continue
        except requests.RequestException as exc:
            return {"error": f"request failed: {exc}", "hash": file_hash}

        if response.status_code == 200:
            return response.json()
        if response.status_code == 404:
            return {"error": "not found", "hash": file_hash}
        if response.status_code == 429:
            wait = int(response.headers.get("Retry-After", 60))
            time.sleep(wait)
            continue
        if response.status_code in (401, 403):
            return {"error": "authentication failed — check the API key", "hash": file_hash}
        if response.status_code >= 500:
            time.sleep(2 ** attempt)
            continue

        return {"error": f"unexpected status {response.status_code}", "hash": file_hash}

    return {"error": "retries exhausted", "hash": file_hash}


if __name__ == "__main__":
    key = os.environ.get("VT_API_KEY")
    if not key:
        raise SystemExit("Set VT_API_KEY in the environment before running.")
    print(lookup_file_hash("44d88612fea8a8f36de82e1278abb02f", key))
```

That function is longer than a beginner's version, and every extra line is doing something specific.

| Element | What it prevents |
|---|---|
| `timeout=15` | A hung connection that blocks your script forever |
| `except requests.Timeout` | A network problem crashing the run on hash 4,000 of 5,000 |
| Catching `requests.RequestException` | DNS failures, TLS errors, connection resets |
| Explicit handling of 404 | Distinguishing "not known" from "the API is broken" |
| Explicit handling of 401 and 403 | Telling the user their key is wrong rather than looping |
| `Retry-After` on 429 | Being polite to the rate limit instead of being blocked |
| `2 ** attempt` backoff | Waiting longer each retry, which is the standard pattern |
| Returning errors rather than raising | The caller decides; a batch job does not die on one bad hash |

**The `timeout` line alone is worth the whole function.** A `requests.get` without a timeout can hang indefinitely on a bad connection, and a script that hangs in a cron job is a script nobody notices is broken.

#### Where the API key comes from

Never in the source file. This is the single most common security mistake made by people learning to automate, and it has a specific, damaging consequence.

```python
import os

# Correct: read from the environment.
api_key = os.environ.get("VT_API_KEY")
if not api_key:
    raise SystemExit("VT_API_KEY is not set. See README.md for setup.")

# Also acceptable for local development: a .env file that is gitignored.
# from dotenv import load_dotenv
# load_dotenv()
# api_key = os.environ["VT_API_KEY"]
```

```text
# .env — never committed. This file holds real secrets.
VT_API_KEY=your-real-key-here

# .env.example — committed, and holds no secrets. This is documentation.
VT_API_KEY=replace-with-your-key

# .gitignore — the line that prevents the mistake.
.env
*.env
!.env.example
```

| Practice | Why |
|---|---|
| Environment variables for secrets | The secret is not in the code, so it cannot be committed |
| `.env.example` with placeholder values | Someone else can set up without asking you |
| `.gitignore` covering `.env` **before** the first commit | A secret committed once is a secret in the history forever |
| A pre-commit secret scanner | Catches the mistake automatically rather than by discipline |
| Rotation when a leak is suspected | Assume any exposed key is already used |

**Why git history makes this urgent:** deleting the file in a later commit does not remove the secret. It stays in the history, and secret-scanning bots watch public repositories specifically for this. A key committed and deleted ninety seconds later has been found and used.

```bash
# Run before every push, over the whole history.
gitleaks detect --source . --verbose

# If a secret was committed: rotate it first, then clean the history.
# Rotation is the fix. History rewriting is tidiness.
```

**Rotate first.** Cleaning the history does not un-expose a key that was live for an hour, and the only remedy that works is invalidating the credential.

#### Worked example: enriching a list of hashes

This is the shape of a genuinely useful security script: take a list, enrich it from an API, respect the rate limit, handle failures, and produce a report.

```python
#!/usr/bin/env python3
"""Check a list of file hashes against VirusTotal and report the verdicts.

Usage:
    python check_hashes.py hashes.txt --out report.csv --sleep 16
"""

import argparse
import csv
import os
import time
from pathlib import Path

from lookup import lookup_file_hash          # save the previous example as lookup.py


def classify(result: dict) -> tuple[str, int]:
    """Turn an API response into (verdict, malicious_count)."""
    if "error" in result:
        return f"error: {result['error']}", 0
    stats = result.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
    malicious = int(stats.get("malicious", 0))
    suspicious = int(stats.get("suspicious", 0))
    if malicious >= 5:
        return "malicious", malicious
    if malicious + suspicious > 0:
        return "suspicious", malicious
    return "clean", 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("hashfile", help="one hash per line")
    parser.add_argument("--out", default="hash_report.csv")
    parser.add_argument("--sleep", type=float, default=16.0,
                        help="seconds between requests, to respect the rate limit")
    args = parser.parse_args()

    api_key = os.environ.get("VT_API_KEY")
    if not api_key:
        raise SystemExit("VT_API_KEY is not set. See README.md.")

    hashes = [h.strip() for h in Path(args.hashfile).read_text(encoding="utf-8").splitlines() if h.strip()]
    rows = []

    for index, file_hash in enumerate(hashes, start=1):
        result = lookup_file_hash(file_hash, api_key)
        verdict, count = classify(result)
        print(f"[{index}/{len(hashes)}] {file_hash} -> {verdict} ({count} engines)")
        rows.append({"hash": file_hash, "verdict": verdict, "malicious_engines": count})
        if index < len(hashes):
            time.sleep(args.sleep)

    with open(args.out, "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["hash", "verdict", "malicious_engines"])
        writer.writeheader()
        writer.writerows(rows)

    malicious = sum(1 for r in rows if r["verdict"] == "malicious")
    errors = sum(1 for r in rows if r["verdict"].startswith("error"))
    print(f"\nDone. {malicious} malicious, {errors} errors, {len(rows)} checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Four design decisions in that script are the ones to carry forward.

| Decision | Reasoning |
|---|---|
| Progress printed per item | A long run you cannot observe is a run you will interrupt and restart |
| Failures recorded as rows, not exceptions | The report is complete even when part of the input failed |
| Rate limit as a command-line argument | You can run it slower without editing code |
| A summary line at the end | The answer to "how did it go?" is in the output, not in a scroll-back |

**The second row is the professional habit.** A script that stops at the first bad input produces a partial report and no way to tell how partial. A script that records the failure and continues produces a complete report with a count of what it could not answer.

### Part 4 — PowerShell for Windows triage

#### Why PowerShell, and why it is not optional

Windows is where most enterprise security work happens, and PowerShell is the native tool for asking a Windows machine questions. It is installed everywhere, it needs no dependencies, and it returns objects rather than text.

**Objects are the point.** A PowerShell command returns structured data with named properties, which means you filter and select by name rather than parsing columns out of text.

```powershell
# Object-based: filter by property, select by name, export cleanly.
Get-Process |
  Where-Object { $_.WorkingSet64 -gt 500MB } |
  Sort-Object WorkingSet64 -Descending |
  Select-Object -First 10 Name, Id, WorkingSet64, Path |
  Format-Table -AutoSize

# Export the same objects as CSV with no column-parsing at all.
Get-Process |
  Select-Object Name, Id, WorkingSet64, Path |
  Export-Csv -Path triage\processes.csv -NoTypeInformation -Encoding UTF8
```

That `Export-Csv` line is a complete deliverable. Compare it with the text-parsing approach, which requires fixed-width column offsets that change between Windows versions.

#### Get-WinEvent: querying the event log properly

`Get-WinEvent` is the workhorse, and its filtering syntax is worth learning properly because the difference between a good and a bad filter is minutes versus hours.

```powershell
# Slow: read everything, then filter in PowerShell.
Get-WinEvent -LogName Security | Where-Object { $_.Id -eq 4625 }

# Fast: filter at the log provider, so Windows does the work.
$start = (Get-Date).AddDays(-1)
Get-WinEvent -FilterHashtable @{
    LogName   = 'Security'
    Id        = 4625
    StartTime = $start
} -ErrorAction SilentlyContinue |
  Select-Object TimeCreated, Id, @{n='User';e={$_.Properties[5].Value}},
                @{n='SourceIP';e={$_.Properties[19].Value}},
                @{n='LogonType';e={$_.Properties[10].Value}} |
  Format-Table -AutoSize
```

| Technique | Why |
|---|---|
| `-FilterHashtable` | The filter runs inside the event log service, which is dramatically faster |
| `StartTime` in the filter | Reduces the result set before it crosses the process boundary |
| `-ErrorAction SilentlyContinue` | A log with no matching events throws rather than returning nothing |
| `@{n=...;e=...}` calculated properties | Renames and extracts, producing a readable table |
| `Properties[19]` for the source IP | The event properties are positional; the index is the schema |

**The positional property access is a genuine trap.** `$_.Properties[5].Value` gives you the target username for event 4625, and it is not obvious from anywhere in the command. The way to find the right index is to look at one event in full:

```powershell
# Look at one event in full to find the property order.
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 1 |
  Select-Object -ExpandProperty Properties |
  ForEach-Object -Begin { $i = 0 } -Process {
    "{0,3}: {1}" -f $i, $_.Value; $i++
  }
```

Run that once and you have the schema. **This is a technique rather than a fact to memorise**, and it is the technique an interviewer is looking for — the ability to find the answer rather than to recall it.

#### The triage commands worth knowing cold

```powershell
# 1. Who is logged on, and from where.
Get-CimInstance Win32_LoggedOnUser | Select-Object -First 20
query user

# 2. Running processes with ownership and command lines.
Get-CimInstance Win32_Process |
  Select-Object ProcessId, ParentProcessId, Name, CommandLine |
  Sort-Object Name | Format-Table -AutoSize

# 3. Network connections with the owning process — the pivot that matters most.
Get-NetTCPConnection -State Established |
  Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort,
                State, OwningProcess,
                @{n='Process';e={(Get-Process -Id $_.OwningProcess).Name}} |
  Sort-Object RemoteAddress | Format-Table -AutoSize

# 4. Listening ports, which reveal unexpected services.
Get-NetTCPConnection -State Listen |
  Select-Object LocalAddress, LocalPort, OwningProcess |
  Sort-Object LocalPort | Format-Table -AutoSize

# 5. Services, including the binary path that reveals a bad install location.
Get-CimInstance Win32_Service |
  Where-Object { $_.PathName -notmatch 'C:\\Windows' } |
  Select-Object Name, State, StartMode, PathName, StartName |
  Format-Table -AutoSize

# 6. Scheduled tasks — a persistence favourite. Note that this surfaces tasks
#    that have RUN recently, not tasks that were CREATED recently; see the trap
#    below for why the difference matters and why .Date cannot be trusted.
#
# THE TRAP HERE IS SUBTLE AND WORTH UNDERSTANDING.
# Get-ScheduledTask does expose a Date property, so the obvious filter looks
# like it works:
#
#     Get-ScheduledTask | Where-Object { $_.Date -gt (Get-Date).AddDays(-30) }
#
# It returns results, which is what makes it dangerous. But .Date is a STRING,
# not a DateTime, so comparing it to a DateTime makes PowerShell coerce the
# right-hand side to a string and compare the two LEXICALLY. This machine
# returned 14 tasks registered in 2010 for a filter asking for the last 30 days,
# because "2010-..." sorts after "2026-..." character by character.
#
# It never errors. It just answers a different question than the one you asked.
#
# So: filter on TaskPath to drop Microsoft's own tasks, and get real timing
# from Get-ScheduledTaskInfo, whose LastRunTime IS a proper DateTime.
Get-ScheduledTask |
  Where-Object { $_.TaskPath -notlike '\Microsoft\*' } |
  ForEach-Object {
    $info = $_ | Get-ScheduledTaskInfo
    [PSCustomObject]@{
      TaskName = $_.TaskName
      TaskPath = $_.TaskPath
      State    = $_.State
      Author   = $_.Author
      LastRun  = $info.LastRunTime
    }
  } |
  Sort-Object LastRun -Descending |
  Format-Table -AutoSize

# 7. Local administrators.
Get-LocalGroupMember -Group Administrators
```

The third command is the one to know best. **`Get-NetTCPConnection` joined to the owning process answers "what is this machine talking to, and what program is doing it"** — which is the first question in almost every host investigation.

The filters in commands 5 and 6 are doing the analytical work. A service whose binary lives outside `C:\Windows` is worth looking at; a scheduled task that has *run* recently on a machine nobody changed is worth looking at.

**The filter encodes the judgement**, which is the part you do not automate away — and command 6's fifteen-line comment is the other half of that lesson. A filter that looks right and quietly answers a different question is worse than no filter, because it produces confident output you have no way to check.

#### Worked example: a triage script that produces a report

```powershell
<#
.SYNOPSIS
    Collects host triage data into a timestamped folder.
.DESCRIPTION
    Read-only. Writes CSV files under .\triage-<hostname>-<timestamp>\.
    Intended to be run as an administrator from an external drive.
.EXAMPLE
    .\Invoke-Triage.ps1 -OutputRoot D:\evidence
#>
[CmdletBinding()]
param(
    [string]$OutputRoot = "."
)

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$folder = Join-Path $OutputRoot "triage-$env:COMPUTERNAME-$stamp"
New-Item -ItemType Directory -Path $folder -Force | Out-Null

function Save-Report {
    param([string]$Name, [scriptblock]$Collect)
    $path = Join-Path $folder "$Name.csv"
    try {
        & $Collect | Export-Csv -Path $path -NoTypeInformation -Encoding UTF8
        Write-Host "  collected $Name"
    } catch {
        Write-Warning "  could not collect $Name : $_"
    }
}

Write-Host "Collecting triage data into $folder"

Save-Report 'processes' {
    Get-CimInstance Win32_Process |
        Select-Object ProcessId, ParentProcessId, Name, CommandLine, CreationDate
}

Save-Report 'connections' {
    Get-NetTCPConnection |
        Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort,
                      State, OwningProcess, CreationTime
}

Save-Report 'services' {
    Get-CimInstance Win32_Service |
        Select-Object Name, DisplayName, State, StartMode, PathName, StartName
}

Save-Report 'scheduled-tasks' {
    Get-ScheduledTask | Select-Object TaskName, TaskPath, State, Author
}

Save-Report 'local-admins' {
    Get-LocalGroupMember -Group Administrators |
        Select-Object Name, ObjectClass, PrincipalSource
}

Save-Report 'recent-security-events' {
    Get-WinEvent -FilterHashtable @{
        LogName   = 'Security'
        Id        = 4624, 4625, 4672, 4720, 4728, 7045
        StartTime = (Get-Date).AddDays(-7)
    } -ErrorAction SilentlyContinue |
        Select-Object TimeCreated, Id, LevelDisplayName, ProviderName, Message
}

Write-Host "Done. Files written to $folder"
Get-ChildItem $folder | Select-Object Name, Length | Format-Table -AutoSize
```

Three things about that script are deliberate.

**It is read-only.** Every command retrieves. Nothing changes the system, which is what makes it safe to run on a live host during an investigation.

**Each collection is wrapped in its own error handler.** If one query fails — a missing log, insufficient permission — the other five still complete. A triage script that stops halfway is worse than one that reports a partial result honestly.

**It writes to a named, timestamped folder.** Evidence needs to be attributable to a host and a time, and `triage-LAB-WIN10-20260314-091200` says both.

**One caveat worth stating:** running a PowerShell script writes to the PowerShell operational log, and that log is itself evidence. Note the time you ran it and where it wrote, and include it in your investigation notes. An investigator who alters the environment without recording it has created a discrepancy someone else will have to explain.

### Part 5 — Security of the tooling itself

#### Your script processes hostile input

This is the part a web development background does not automatically prepare you for. Half the data your tools process was created by someone trying to break whatever processes it.

| Input | Where it comes from | What it can do to a careless script |
|---|---|---|
| A log line | Attacker-controlled command lines are logged verbatim | Break parsing, or inject control characters into your report |
| A filename | An attacker can name a file almost anything | Path traversal in a script that builds paths from input |
| A URL from an alert | Attacker-controlled | Be fetched by your enrichment script, from inside your network |
| A JSON field | A third-party API or a compromised endpoint | Break `.get()` chains, or crash on unexpected types |
| A CSV cell starting with `=` | Data exported from a spreadsheet | Execute as a formula when a colleague opens the output |
| A very long field | A crafted payload | Memory exhaustion, or a terminal flooded with output |

**The URL row deserves emphasis because it is a live attack path.** If your enrichment script takes a URL from an alert and fetches it, an attacker who can influence that alert can make your script perform a request from inside your network. That is the server-side request forgery problem from Phase 9, arriving through your own tooling.

```python
from urllib.parse import urlparse

ALLOWED_SCHEMES = {"http", "https"}

def safe_url(value: str) -> bool:
    """Reject URLs that are not plain HTTP(S) to a non-internal host."""
    parsed = urlparse(value)
    if parsed.scheme not in ALLOWED_SCHEMES:
        return False
    if not parsed.hostname:
        return False
    # Reject anything that resolves into private or link-local space.
    import ipaddress
    import socket
    try:
        resolved = socket.gethostbyname(parsed.hostname)
        address = ipaddress.ip_address(resolved)
    except (socket.gaierror, ValueError):
        return False
    return not (address.is_private or address.is_loopback or address.is_link_local)
```

That function is not a complete SSRF defence, and saying so is part of the point. **Proper defence is an allowlist of destinations, not a denylist of bad ones**, and the honest version of this function says: prefer never fetching a URL from an alert automatically, and if you must, fetch it from an isolated environment that has no access to anything you care about.

#### Never build a command from a string

```python
# DANGEROUS — the input becomes part of a shell command.
import os
filename = alert["filename"]                # attacker-controlled
os.system(f"cp {filename} /evidence/")      # a filename of "; rm -rf /" is now a problem

# DANGEROUS — the same problem, one layer down.
subprocess.run(f"nslookup {hostname}", shell=True)

# SAFE — arguments are passed as a list, so no shell interprets them.
import subprocess
subprocess.run(["nslookup", hostname], shell=False, check=False, timeout=10)

# SAFEST for file work — no subprocess at all.
import shutil
from pathlib import Path
shutil.copy(Path(filename).name, "/evidence/")   # .name strips any directory part
```

| Rule | Reason |
|---|---|
| Never use `shell=True` with untrusted input | The shell interprets metacharacters in your data |
| Pass arguments as a list | Nothing parses the string, so nothing can inject |
| Prefer a library over a subprocess | `shutil`, `pathlib`, and `hashlib` cover most shell use |
| Use `.name` on any user-supplied path | Removes directory components and defeats traversal |
| Never use `eval` or `exec` on data | It executes whatever the data contains |
| Never `pickle.load` untrusted data | Deserialisation can execute arbitrary code |

**The `eval` row is not theoretical.** Learners reach for `eval` to parse a configuration or a list from a log, and it works on the sample, and it is a remote code execution vulnerability the moment the input is not yours.

#### Logging what your automation did

An automated action leaves no human memory behind it. If the tool does not log, nobody can reconstruct what happened.

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
    handlers=[
        logging.FileHandler("automation.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger("check_hashes")

log.info("starting run: %d hashes, rate limit %.1fs", len(hashes), args.sleep)
log.warning("hash %s returned error: %s", file_hash, result["error"])
log.info("run complete: %d malicious, %d errors", malicious, errors)
```

| Log | Why |
|---|---|
| Start and end of each run | Proves the tool ran, and when |
| Every failure with the input that caused it | Reproducible without guessing |
| Every action that changed something | The audit trail for an automated decision |
| The version of the tool | Two runs with different results need this to be explained |

**Never log a secret.** An API key in a log file is an API key in a log file that gets emailed, archived, and indexed. Redact before logging, and grep your logs for the key once as a test.

### Part 6 — When not to automate

#### The four questions

Automation has a cost that beginners do not price in, and the cost is paid in maintenance, in broken assumptions, and in the false confidence a tool provides when it is quietly wrong.

Before you build anything, answer four questions.

| Question | If the answer is no |
|---|---|
| **Will this run more than a handful of times?** | Do it by hand. A one-off script is a slower way to do a one-off task |
| **Is the input format stable, or will it change?** | Expect maintenance, and weigh it against the time saved |
| **Would a wrong answer be noticed?** | If not, the automation is dangerous rather than useful |
| **Do I already understand the task by hand?** | Do it manually first. Automating a process you do not understand encodes your misunderstanding |

The **third question** is the one that matters most in security, and it is the one nobody asks.

Consider a script that automatically closes alerts which match a list of known-benign patterns. It saves an hour a day. It also silently closes the one alert in ten thousand that was the real intrusion — and because the closure looks identical to every other closure, nobody notices until the incident is discovered months later by someone else.

| Automation | Failure is loud? | Verdict |
|---|---|---|
| Converting timestamps | Yes — the report looks wrong | Safe to automate |
| Deduplicating identical log lines | Yes — a missing line is noticed | Safe, with a count retained |
| Enriching indicators from an API | Yes — errors are visible in the output | Safe, with errors recorded |
| Auto-closing alerts matching a pattern | **No** | Dangerous |
| Auto-blocking an IP address | **Partly** — it may break something legitimate | Dangerous without a review step |
| Auto-disabling a user account | **Partly** — it may lock out the wrong person | Dangerous without a review step |
| Auto-remediating a "malware" file | **No** — a false positive is invisible | Dangerous |

**The pattern in that table is the rule for this phase:** automation may collect, transform, enrich, and present. Automation may act only when a human reviews the action, or when the action is trivially reversible and loudly logged.

#### The two failure modes

| Failure mode | What it looks like | How it happens |
|---|---|---|
| **Silent wrongness** | The tool runs, produces output, and the output is wrong | An input format changed; a filter is too broad; a timezone was assumed |
| **Silent absence** | The tool stops running and nobody notices | A credential expired; a path changed; a scheduled job was disabled |

**Silent absence is the more common and the more dangerous.** A script that crashes loudly gets fixed. A script that stops producing output gets forgotten, and the team believes it is still working.

| Defence against silent failure | What it looks like |
|---|---|
| A run log with a start and end line | A run with a start and no end is visibly incomplete |
| A heartbeat check | Something alerts if the tool has not run in 25 hours |
| A summary output even when there is nothing to report | "0 findings" is information; no output is ambiguous |
| A non-zero exit code on failure | The scheduler notices, even if nobody reads the log |
| A periodic manual sanity check | Once a month, run it by hand and compare |

The third row is a small design change with a large effect. **A tool that prints "checked 4,000 hashes, 0 malicious, 0 errors" every day is a tool you can trust.** A tool that prints nothing when there is nothing to say is a tool you cannot distinguish from a broken one.

#### What not to automate, stated plainly

| Do not automate | Why |
|---|---|
| The decision to declare an incident | It is a judgement about business impact, made by a person who is accountable |
| The decision to notify a regulator | A legal question with a legal owner |
| Contacting a user about a suspected compromise | The wording matters, and the channel matters more |
| Disciplinary conclusions from log evidence | Logs support inferences; they rarely establish intent |
| Anything irreversible | Deletion, encryption, mass password resets, bulk account changes |
| Anything that could break production | Unless it is tested, staged, and reversible |
| A process you have not done by hand | You will encode your misunderstanding, at scale, silently |

**The last row is the one to hold onto.** The value of doing a task by hand first is not nostalgia. It is that manual work teaches you the edge cases, and edge cases are where automation breaks.

#### Worked example: the auto-closer that worked perfectly

The tables above state conclusions. Judgement is not built by reading conclusions, so here is the same lesson as it actually happens — with the wrong answer first, and the reasoning that replaced it.

**The task.** A junior analyst on a small team handles roughly 300 alerts a day. About 260 of them are the same thing: an endpoint agent reporting a file that has been on the machine for months, already approved, and flagged only because a signature updated. Closing those by hand takes an hour.

**The first attempt.** The analyst writes a script to close them automatically.

```python
# auto_close.py — close alerts that look like the known-good pattern
APPROVED_PATHS = ["/opt/tools/", "C:\\Program Files\\Corp\\"]

for alert in open_alerts():
    if alert["rule"] != "SUSPICIOUS_FILE_HASH":
        continue
    if not any(alert["path"].startswith(p) for p in APPROVED_PATHS):
        continue
    if days_since(alert["file_mtime"]) < 30:
        continue
    close(alert, reason="known approved software, aged file")
```

The logic reads well. It only touches one rule, only inside approved directories, and only for files older than thirty days. The analyst tests it against last week's alerts, and it closes 264 of them. The other 36 are reviewed by hand.

**What it got wrong.** Three weeks later, a real intrusion is found during an unrelated review. The entry point was a signed binary dropped into `C:\Program Files\Corp\`, with its timestamps set back by the attacker so the file appeared months old. The matching alert had been closed at 04:12 by `auto_close.py`, with the reason “known approved software, aged file.”

| The script assumed | Reality |
|---|---|
| An approved path means approved software | A path is writable by anyone with the right permissions, including an installer the attacker controlled |
| An old timestamp means an old file | Timestamps are trivially forged. Phase 11 calls this timestomping |
| A consistent pattern means a consistent meaning | Three conditions that are *usually* benign are not three conditions that are *always* benign |
| Closing the alert records the decision | The closure was indistinguishable from 263 others, so nobody ever saw it |

**The deepest error was not in the code.** It was in the question the analyst asked. The script answers “does this alert look like the pattern?” when the question a security control must answer is **“if I am wrong about this one, will anyone find out?”**

That is the third question from the four above, and it was skipped. The answer for auto-close is always no.

| Failure property | Why auto-close fails it |
|---|---|
| Silent wrongness | A wrongly closed alert produces no error, no log entry anyone reads, and no output |
| Compounding | Each closure deletes the evidence that would have shown the pattern was wrong |
| Delayed discovery | The mistake surfaces months later, from a different investigation entirely |
| Unattributable | By the time it is found, the ticket says “known approved software” and nothing else |

The uncomfortable part is that the script made the team *less* safe while making it measurably faster. That is the trade nobody prices in when writing the first line of code.

**The correction.** The analyst did not delete the script. The pattern detection was genuinely useful, and the hour it saved was real.

What changed is what the script did with its answer.

| Before | After | Why |
|---|---|---|
| `close(alert, reason=...)` | `annotate(alert, note="matches known-approved pattern v1; aged file; approved path")` | The judgement is recorded without being made |
| The alert left the queue | The alert is routed to a digest, reviewed daily | A human still sees it, but in a batch rather than one at a time |
| No counter | Every run prints “evaluated N, matched M, routed M” | A run that matches nothing is visible as unusual rather than invisible |
| The pattern was a decision rule | The pattern is a **triage hint attached to the alert** | The analyst who opens it starts from the hint, not from zero |
| One rule, forever | The pattern is versioned, with a review date | A signature update changes the meaning of “known-good” |

```python
# triage_hint.py — annotate and route, never close
evaluated = 0
matched = 0
for alert in open_alerts():
    evaluated += 1
    if matches_known_approved_pattern(alert):   # same test as before
        annotate(alert, note=f"known-approved pattern {PATTERN_VERSION}; "
                             "aged file in approved path; verify before closing")
        route_to_digest(alert)
        matched += 1

print(f"evaluated={evaluated} matched={matched} routed={matched} closed=0")
```

**The corrected judgement, stated generally:** the script may narrow what a human must read. It may not decide that the human need not read it. Those two sentences look close together and they are the whole distance between a tool and a liability.

| The line the corrected script holds | Expressed as code |
|---|---|
| Enrich, do not decide | It adds a note; it does not set a status |
| Preserve the human step | Everything matching is still routed somewhere a person looks |
| Fail loudly | The run always prints its counts, including zero |
| Be reversible | Removing the script restores the previous state exactly, because nothing was closed |

**What the analyst wrote in the “what I chose not to automate” note** — and this is the artefact the phase asks for:

> I automate the *detection* of a known-benign pattern and I attach that finding to the alert. I do not automate the *closure*, because a wrongly closed alert is invisible by construction, and invisibility is the property that makes a failure permanent. The script saves the same typing either way; the difference is whether a human still gets to be wrong out loud.

**Where this sits against the tables above:** auto-closing alerts matching a pattern is row four of the earlier “failure is loud?” table, and it is precisely the judgement the later “do not automate” table opens with — a decision a person is accountable for. The script was not badly written. It was correctly written against the wrong question — which is the failure mode this whole part exists to prevent.

#### Worked example: automating the right part

A junior analyst is told to check every new alert's file hash against a threat-intelligence service, and to write up anything malicious. Done manually, that is twenty minutes per alert.

| Step | Automate? | Reason |
|---|---|---|
| Extract the hash from the alert | **Yes** | Mechanical, unambiguous, and the format is stable |
| Look the hash up | **Yes** | A repetitive API call with a clear answer |
| Record the result in the ticket | **Yes** | Mechanical, and it removes a transcription error |
| Decide whether the hash is malicious | **Partly** | Report the engine count; let the analyst interpret three detections out of seventy |
| Decide whether the alert is a true positive | **No** | The judgement, and the whole reason the analyst exists |
| Write the summary for the customer | **No** | Wording, context, and accountability |
| Close the ticket | **No** | Follows from the judgement |

That division is the answer this phase is aiming at. **Automate rows one to three, enrich row four, and leave rows five to seven to the person who is accountable for them.**

The result is not a tool that replaces the analyst. It is a tool that removes twenty minutes of typing so the analyst spends those twenty minutes on the part that required them.

### Part 7 — Packaging it so it is usable

#### The README is the deliverable

A tool nobody else can run is a tool that does not count. Phase 6 made this point about portfolio reports; it applies with more force to code, because code has more ways to fail on someone else's machine.

A README that works has six sections, and each one answers a question the reader will actually have.

| Section | The question it answers |
|---|---|
| **What it does** | Two sentences. Why does this exist? |
| **Requirements** | Which Python version, which packages, which operating system |
| **Setup** | The exact commands, including how to set the API key |
| **Usage** | A real example with real output |
| **What it does not do** | The limitations, stated before someone discovers them |
| **Troubleshooting** | The three failure modes you actually hit while building it |

```text
# check_hashes

Checks a list of file hashes against VirusTotal and writes a CSV report with a
verdict per hash. Read-only: it makes no changes to any system.

## Requirements

- Python 3.10 or newer
- A VirusTotal API key (the free public API is sufficient)

## Setup

    python -m venv .venv
    source .venv/bin/activate        # Windows: .venv\Scripts\activate
    pip install -r requirements.txt

    # Copy the example environment file. Linux/macOS: cp .env.example .env
    # Windows PowerShell: Copy-Item .env.example .env
    cp .env.example .env             # then put your key in .env

    # Load the key into the environment. Linux/macOS:
    export VT_API_KEY=$(grep VT_API_KEY .env | cut -d= -f2)

    # Windows PowerShell — same effect:
    #   $env:VT_API_KEY = (Select-String -Path .env -Pattern '^VT_API_KEY=').Line.Split('=')[1]

## Usage

    python check_hashes.py samples/hashes.txt --out report.csv --sleep 16

    [1/3] 44d88612fea8a8f36de82e1278abb02f -> malicious (58 engines)
    [2/3] 5d41402abc4b2a76b9719d911017c592 -> clean (0 engines)
    [3/3] e3b0c44298fc1c149afbf4c8996fb924 -> error: not found (0 engines)

    Done. 1 malicious, 1 errors, 3 checked.

## What it does not do

- It does not decide whether an alert is a true positive. It reports engine
  counts and lets the analyst interpret them.
- It does not handle more than one API key. A single key at 4 requests per
  minute means roughly 240 hashes per hour.
- It does not retry indefinitely. After three attempts on one hash it records
  an error row and moves on.
- The free API tier does not permit commercial use. Check the current terms.

## Troubleshooting

- **"VT_API_KEY is not set"** — the environment variable is not exported in
  this shell. Re-run the export line from Setup.
- **Every row is "error: authentication failed"** — the key is wrong or has
  been disabled. Check it in the VirusTotal UI.
- **Every row is "error: retries exhausted"** — you are being rate limited.
  Increase `--sleep` to 20 or higher.
```

**The "What it does not do" section is what separates a professional tool from a learner's script.** Writing your own limitations means a reader trusts the rest, and it means you do not get asked to defend a capability you never claimed.

#### Version control, for a reason beyond tidiness

| Practice | Why it matters in security tooling |
|---|---|
| Commit the code, not the data | Evidence and logs do not belong in a repository, and may contain personal data |
| `.gitignore` before the first commit | A secret in the history is permanent |
| Small, described commits | The history is how someone understands why a filter exists |
| `requirements.txt` with pinned versions | A changed dependency can silently change your results |
| A `LICENSE` file | Someone may want to reuse the code, and needs to know if they may |

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\Activate.ps1
pip install requests python-dotenv
pip freeze > requirements.txt      # pins exact versions
```

**Pinning matters more in security than in general development.** If your detection logic depends on a parsing library's behaviour, an unpinned upgrade can change what your tool reports — and a detection tool whose output changes without your knowledge is a detection tool you cannot trust.

#### Testing, at the level that matters

You do not need a full test suite. You need three tests per script, and they take twenty minutes.

| Test | What it proves |
|---|---|
| **One known-good input** | The happy path works |
| **One malformed input** | The script does not crash on real-world mess |
| **One empty input** | The script handles having nothing to do |

```python
# tests/test_parser.py — run with: python -m pytest -q
from suspicious_logins import find_suspicious, parse


def test_parses_a_failure_line(tmp_path):
    log = tmp_path / "auth.log"
    log.write_text(
        "Mar 11 04:52:11 web-01 sshd[21483]: Failed password for invalid user "
        "admin from 203.0.113.44 port 51234 ssh2\n",
        encoding="utf-8",
    )
    assert list(parse(str(log))) == [("fail", "admin", "203.0.113.44")]


def test_ignores_unrelated_lines(tmp_path):
    log = tmp_path / "auth.log"
    log.write_text("Mar 11 04:52:11 web-01 systemd[1]: Started Session 4.\n",
                   encoding="utf-8")
    assert list(parse(str(log))) == []


def test_empty_file_produces_no_findings(tmp_path):
    log = tmp_path / "auth.log"
    log.write_text("", encoding="utf-8")
    assert find_suspicious(str(log), threshold=3) == []


def test_malformed_encoding_does_not_crash(tmp_path):
    log = tmp_path / "auth.log"
    log.write_bytes(b"Mar 11 04:52:11 web-01 sshd[1]: Failed \xff\xfe password\n")
    assert list(parse(str(log))) == []
```

The fourth test is the one people forget and the one that matters most here. **A log with a byte your decoder cannot handle is normal**, not exceptional, and a script that raises on it will fail on the one file you most needed to process.

#### The portfolio artefact

This phase produces something specific and legible, and it is the single most demonstrable item in the whole roadmap.

| What a reviewer sees | What it proves |
|---|---|
| A repository with two or three small tools | You can write code that does a real job |
| A README with limitations | You are honest about what you built |
| A test file with a malformed-input case | You thought about hostile data |
| `.env.example` and a `.gitignore` covering `.env` | You understand secrets handling |
| An `automation.log` sample with a run history | You thought about operations, not just the happy path |
| A written "what I chose not to automate" note | You have judgement, which is the rarest of these |

That last row is unusual, and it is the one that makes an interviewer stop. A candidate who can explain why they did *not* automate alert closure has demonstrated that they understand what automation is for.

#### What you still cannot do after this phase

Be precise, because “I can automate security tasks” is a claim people will test.

You can now write a script that collects, parses, and enriches security data, and you can explain why a particular action should stay manual. You **cannot** yet write production-quality code that other people maintain — there are no unit tests beyond a malformed-input case, no packaging, and no dependency management. You have also never automated anything against a live production system, where a mistake is not a line in your own log file.

| You can | You cannot yet |
|---|---|
| Write a script that parses logs and produces a report | Write a library with tests, versioned releases, and a dependency lockfile |
| Handle hostile input without crashing | Reason about concurrency, retries, and rate limits under real load |
| Justify what you chose not to automate | Operate an automation pipeline with alerting, ownership, and a rollback path |
| Read and adapt someone else's script | Review code for security defects the way a developer would |

**In an interview, say:** “I write small Python and PowerShell tools for analysis and triage, and I keep the destructive steps manual. I have not shipped anything to production.” That is accurate, and it is more credible than a claim the follow-up question will dismantle.

### Key takeaways

- **Automate the collection and the transformation; keep the judgement and the decision.** A tool that makes a confident wrong decision is worse than no tool.
- **Do the task by hand once before automating it.** Manual work teaches you the edge cases, and edge cases are where automation breaks.
- **Read files with `with ... open(...)`, `errors="replace"`, and a generator.** The version that loads 2 GB into memory works on your test data and fails on contact.
- **Use `.get()` and a `dig()` helper rather than chained dictionary access.** One missing key should not end a five-thousand-item run.
- **Reach for the standard library before a regular expression.** `ipaddress` beats `\d+\.\d+\.\d+\.\d+`, which accepts `999.999.999.999`.
- **Always set a timeout on an HTTP request.** A request without one can hang forever, and a hung cron job is invisible.
- **Never put a secret in source code, and rotate first if one leaks.** History rewriting is tidiness; rotation is the fix.
- **Record per-item failures as rows rather than exceptions.** A complete report with an error count beats a partial report with no way to tell how partial.
- **`Get-WinEvent -FilterHashtable` is dramatically faster than piping to `Where-Object`**, and positional property indexes are found by inspection rather than memory.
- **`Get-NetTCPConnection` joined to the owning process answers the first question of almost every host investigation.**
- **Never build a shell command from a string.** Pass arguments as a list, prefer a library, and use `.name` on any user-supplied path.
- **Defang indicators in prose and never defang a hash.** A live URL in a report is a hazard; a defanged hash is unverifiable.
- **Automation that fails silently is the dangerous kind.** Log a start and an end, print a summary even when there is nothing to report, and exit non-zero on failure.
- **Automate collection, transformation, and enrichment; require a human for actions that are irreversible or unreviewable.**
- **The README is the deliverable, and its "What it does not do" section is what earns trust.**

### Practice this next

The nine tasks build toward a small toolbox with a README, and each task adds one capability a real security script needs.

1. **Write the log parser first** (tasks 1 and 2). Take a real log — your own `auth.log` or a Windows event export — and produce a script that extracts the fields you care about, counting failures by source and finding any success that followed them. Keep parsing and logic in separate functions from the start.
2. **Add the malformed-input test before you add features** (task 3). Feed your parser a truncated line, an empty file, and a file with an invalid byte. Fix whatever crashes. This is the habit that distinguishes a script from a tool.
3. **Build the API tool** (tasks 4 and 5). Write the request function with a timeout, explicit status handling, a retry with backoff, and errors returned rather than raised. Then run it over a list and produce a CSV.
4. **Move the key out of the code, and prove it** (task 6). Read the key from the environment, add `.env.example` and a `.gitignore` entry, commit, and run `gitleaks` over the repository. If the scan finds anything, rotate the credential rather than deleting the file.
5. **Write the PowerShell triage script** (task 7) as a read-only collector that writes timestamped CSV files. Wrap each collection in its own error handler so one failure does not stop the rest.
6. **Join the two languages** (task 8). Have the PowerShell script produce a CSV, and have a Python script consume it, apply a filter that encodes a judgement, and produce a short report. This is what real security automation looks like.
7. **Write the "what I chose not to automate" note** (task 8's second half, and worth doing carefully). Three things you deliberately left manual, with the reason. This is short and it is the most mature artefact in the phase.
8. **Package it** (task 9). Write the README with its six sections, add `requirements.txt` with pinned versions, and give the setup instructions to someone else — or to yourself in a fresh directory — and follow them literally. Every step that needed improvisation is a missing line in the README.

Then open `portfolio/cyber/12-scripting-automation.md` and assemble the deliverables. **The phase is done when your tool takes real security data in, produces a defensible answer out, handles untrusted input without breaking or leaking secrets, and comes with a README someone else could follow** — and when you can explain, without notes, which parts you left to a human and why.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Python | General-purpose scripting language | Free/open-source | https://www.python.org/ | Write a script that parses a log file and counts failures by IP | PowerShell for Windows-only work |
| Visual Studio Code | Code editor | Free | https://code.visualstudio.com/ | Install the Python extension and run a script with the debugger | Notepad++, Vim, or Thonny |
| requests | Python HTTP library | Free/open-source | https://requests.readthedocs.io/ | Call the VirusTotal API for one hash with a timeout | urllib from the standard library |
| PowerShell | Windows automation and triage | Free, built-in | https://learn.microsoft.com/en-us/powershell/ | Collect processes and connections into CSV files | Python with `pywin32` on Windows |
| Windows Terminal | Terminal for PowerShell | Free | https://learn.microsoft.com/en-us/windows/terminal/ | Run a triage script and capture the output | PowerShell ISE, or the built-in console |
| python-dotenv | Load secrets from a file | Free/open-source | https://github.com/theskumar/python-dotenv | Read an API key from `.env` rather than from source | Environment variables exported manually |
| Git | Version control | Free | https://git-scm.com/ | Commit a tool with a `.gitignore` that excludes `.env` | GitHub's web editor for small changes |
| gitleaks | Detect secrets in repositories | Free/open-source | https://github.com/gitleaks/gitleaks | Scan your repository history for a leaked key | GitGuardian free tier for public repositories |
| VirusTotal API | File and URL reputation | Freemium | https://developers.virustotal.com/reference/overview | Look up one hash and print the engine counts | MalwareBazaar and URLhaus, both free |
| pytest | Python testing | Free/open-source | https://docs.pytest.org/ | Write a test for a malformed log line | Python's built-in `unittest` |
| ruff | Python linter and formatter | Free/open-source | https://docs.astral.sh/ruff/ | Lint your tool and fix the reported issues | flake8 and black |
| CyberChef | Decoding and transformation | Free/open-source | https://gchq.github.io/CyberChef/ | Decode a base64 command line by hand before scripting it | Python `base64` and `codecs` |
| Detect-It-Easy | File type and packer identification | Free | https://github.com/horsicq/Detect-It-Easy | Identify the type of a sample file before scripting a check | `file` on Linux, or Python `magic` |

## Free/cheap resources

- Python official tutorial — https://docs.python.org/3/tutorial/
- Automate the Boring Stuff with Python — https://automatetheboringstuff.com/
- Python `requests` documentation — https://requests.readthedocs.io/
- Python `re` module documentation — https://docs.python.org/3/library/re.html
- Python `argparse` documentation — https://docs.python.org/3/library/argparse.html
- PowerShell documentation — https://learn.microsoft.com/en-us/powershell/
- Get-WinEvent reference — https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent
- Google Python Style Guide — https://google.github.io/styleguide/pyguide.html
- OWASP Input Validation Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- OWASP Secrets Management Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- VirusTotal API documentation — https://docs.virustotal.com/reference/overview
- gitleaks documentation — https://github.com/gitleaks/gitleaks

## Hands-on practice tasks

1. Write a Python script that reads a real log file line by line and counts failures by source address. <!-- id: cyber-12-t01 band: focused energy: normal -->
2. Extend it to find any successful login that followed a burst of failures from the same address. <!-- id: cyber-12-t02 band: focused energy: normal -->
3. Add tests for a malformed line, an empty file, and a file with an invalid byte, and fix what breaks. <!-- id: cyber-12-t03 band: focused energy: normal -->
4. Write an API function with a timeout, explicit status handling, retry with backoff, and errors returned rather than raised. <!-- id: cyber-12-t04 band: focused energy: normal -->
5. Run the API tool over a list of hashes and produce a CSV report with a verdict per row. <!-- id: cyber-12-t05 band: focused energy: normal -->
6. Move the API key to an environment variable, add `.env.example` and `.gitignore`, and run a secret scan over the history. <!-- id: cyber-12-t06 band: focused energy: normal -->
7. Write a read-only PowerShell triage script that collects processes, connections, services, tasks, and recent events into timestamped CSVs. <!-- id: cyber-12-t07 band: deep energy: high -->
8. Have a Python script consume the PowerShell CSV output, apply a documented filter, and produce a short report. <!-- id: cyber-12-t08 band: focused energy: normal -->
9. Write the README with all six sections, pin the dependencies, and follow your own setup instructions in a fresh directory. <!-- id: cyber-12-t09 band: focused energy: normal -->

## Deliverable / proof of work

Create `portfolio/cyber/12-scripting-automation.md` with:

- A Python log parser with separated parsing and logic functions, and its test file
- Test results including a malformed-input case and an empty-file case
- An API client function with timeout, status handling, retry, and returned errors
- A CSV report produced from a real API run over a list of indicators
- Proof of secret handling: `.env.example`, the `.gitignore` entry, and a clean secret-scan output
- A read-only PowerShell triage script and the CSV files it produced
- A Python report generator that consumes the triage output
- A README containing all six sections, including "What it does not do"
- An `automation.log` sample showing a run history including a failure
- A short written note on three things you deliberately did not automate, and why

## Checklist

- [ ] I can read a log file line by line without loading it all into memory. <!-- id: cyber-12-python-file-reading energy: low -->
- [ ] My scripts use `.get()` or a helper rather than chained dictionary access. <!-- id: cyber-12-safe-dict-access energy: low -->
- [ ] I parse log data with regular expressions where appropriate and use libraries where better. <!-- id: cyber-12-regex-and-libraries energy: normal -->
- [ ] I validate an IP address with a library rather than a pattern. <!-- id: cyber-12-input-validation energy: normal -->
- [ ] I wrote an HTTP request with a timeout, explicit status handling, and retry with backoff. <!-- id: cyber-12-api-client-energy energy: normal -->
- [ ] I read my API key from the environment and never from source code. <!-- id: cyber-12-secrets-out-of-code energy: normal -->
- [ ] I added a `.gitignore` entry and an `.env.example`, and ran a secret scan. <!-- id: cyber-12-secret-scan energy: normal -->
- [ ] I can use `Get-WinEvent -FilterHashtable` and find a property index by inspection. <!-- id: cyber-12-powershell-eventing energy: normal -->
- [ ] I can join a network connection to its owning process with `Get-NetTCPConnection`. <!-- id: cyber-12-powershell-triage energy: normal -->
- [ ] My PowerShell triage script is read-only and handles one collection failing. <!-- id: cyber-12-triage-script-built energy: normal -->
- [ ] I wrote tests for a known-good input, a malformed input, and an empty input. <!-- id: cyber-12-input-tests energy: normal -->
- [ ] I never build a shell command from a string with untrusted input. <!-- id: cyber-12-command-injection-avoidance energy: normal -->
- [ ] I defang indicators in written output and never defang a hash. <!-- id: cyber-12-defanging-habit energy: low -->
- [ ] My tool logs a start and an end, and exits non-zero on failure. <!-- id: cyber-12-automation-logging energy: low -->
- [ ] I wrote a README with a "What it does not do" section someone else could follow. <!-- id: cyber-12-readme-written energy: normal -->
- [ ] I wrote down three things I deliberately chose not to automate, and why. <!-- id: cyber-12-when-not-to-automate energy: normal -->

## You're ready to move on when...

You can write a small tool that takes real security data in, produces a defensible answer out, handles untrusted input without breaking or leaking secrets, and comes with a README someone else could follow.

## Free vs Paid

### What's free and enough

Python, PowerShell, `requests`, `json`, `re`, `argparse`, `pytest`, Git, gitleaks, and Visual Studio Code cover everything this phase teaches, and every one of them is free or built in. The free tier of the VirusTotal API is sufficient for learning, and MalwareBazaar and URLhaus provide free alternatives that need no key at all. The standard library alone — `csv`, `json`, `re`, `pathlib`, `hashlib`, `logging`, `ipaddress` — does most of the work, and knowing it is a more durable skill than knowing any paid platform.

### What's paid and why you'd upgrade

Paid threat-intelligence APIs raise rate limits and add historical data, which matters when you are enriching thousands of indicators rather than dozens. Commercial SOAR platforms such as Splunk Phantom, Palo Alto XSOAR, and Tines add visual workflow builders, connectors to hundreds of products, and case management that a folder of Python scripts does not provide. Paid code assistants can speed up boilerplate. A scripting or automation certification buys a hiring filter and nothing more.

### When it's worth paying

Pay when your scripts have outgrown their scheduler and you need orchestration, audit trails, and connectors that would take months to build — and by then you will be in a role where the employer pays. In a real SOC, the honest truth is that a great deal of automation is still Python in a cron job with a good README, because that is maintainable by whoever inherits it. For a learner on a $0 budget, this phase needs no money at all, and the artefacts it produces are the ones most likely to get you an interview: a working tool with tests, a README, and no secrets in the repository demonstrates more employable skill than any course completion badge, because it is evidence rather than a claim.