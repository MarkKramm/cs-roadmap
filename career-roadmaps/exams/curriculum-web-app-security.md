---
id: curriculum-web-app-security
exam: "CS Roadmap Web Application Security Assessment"
code: CS-WEB-APP-SECURITY
kind: curriculum-practice
track: cyber
phases: "cyber-03-security-fundamentals,cyber-14-web-app-security"
scope: "Cyber Phase 14, reinforced by Phase 3 security fundamentals"
questions: 20
source: curriculum
---

# CS Roadmap Web Application Security Assessment — curriculum practice exam

**Unofficial curriculum practice exam; not a certification exam or a job-readiness guarantee.** This diagnostic set integrates authorized web-application assessment, HTTP and browser security, common vulnerability classes, evidence, and remediation. It is free practice; use only systems you own or have explicit written authorization to test.

## How to use and score it

Answer all 20 questions before checking the marked answers. Give one point per correct answer, then read each explanation. **There is no pass/fail score or readiness threshold.** Use the question map to find a lesson or lab to revisit. These multiple-choice scenarios do not replace hands-on testing in an authorized lab or a reviewed report.

## Domain 1 — Authorization and access control (4 questions)

### Q1. A user changes `/account/1042` to `/account/1043` and sees another customer’s profile. Which issue is most directly indicated?
<!-- phases: cyber-14-web-app-security -->

- [ ] A missing Content Security Policy
- [x] **Broken object-level access control (IDOR): the server failed to verify ownership or authorization**
- [ ] A DNS cache poisoning attack
- [ ] A weak TLS cipher suite

**Why:** Changing an object identifier should not grant access. The server must check that the authenticated user is authorized for the requested record on every relevant operation; an unpredictable ID alone is not an authorization control.

### Q2. A tester can access an administrative function by sending a request directly, even though the admin link is hidden in the interface. What should be assessed?
<!-- phases: cyber-14-web-app-security -->

- [ ] Whether the page background is the right color
- [ ] Whether the user knows the admin URL
- [x] **Server-side authorization on the function, including the user’s role and requested action**
- [ ] Whether the route uses a short URL

**Why:** Hiding a link is not access control. The server must enforce authorization for each request and object. A direct request is a useful authorized test of the control, not proof that obscuring the route is sufficient.

### Q3. A user may view an invoice but must not change its billing address. Which control is needed?
<!-- phases: cyber-14-web-app-security -->

- [ ] A read-only button style in the browser alone
- [x] **Server-side authorization that distinguishes read from update actions**
- [ ] A longer session cookie
- [ ] A `robots.txt` entry

**Why:** UI restrictions can be bypassed by editing or replaying requests. The server needs action-level authorization so permission to read an object does not imply permission to modify it.

### Q4. A multi-tenant application uses a tenant ID supplied by the browser. What should the tester verify?
<!-- phases: cyber-14-web-app-security -->

- [ ] That all tenants use the same identifier
- [ ] That the ID is hidden by CSS
- [x] **That the server binds each requested tenant and object to the authenticated user’s authorized scope**
- [ ] That changing the ID always returns a 404, even for authorized administrators

**Why:** Client-supplied identifiers are input, not proof of entitlement. The application should derive or validate tenant access from authenticated identity and policy. The response should not disclose another tenant’s data.

## Domain 2 — Injection and output handling (4 questions)

### Q5. A login form concatenates a username directly into a SQL query. Which remediation is the strongest baseline?
<!-- phases: cyber-03-security-fundamentals, cyber-14-web-app-security -->

- [ ] Hide SQL error messages but keep concatenation
- [ ] Block the word `SELECT` in the browser
- [x] **Use parameterized queries and appropriate least-privilege database permissions**
- [ ] Encrypt the username with Base64

**Why:** Parameterization separates data from query structure, preventing input from becoming executable SQL syntax. Least privilege limits impact if another flaw exists. Client-side filtering and encoding alone do not safely fix the query construction.

### Q6. A comment field is displayed in other users’ browsers without context-appropriate encoding. What is the primary concern?
<!-- phases: cyber-14-web-app-security -->

- [ ] SQL backup failure
- [ ] DNS tunneling
- [x] **Cross-site scripting, because untrusted content may be interpreted as executable browser markup or script**
- [ ] A route-specific authorization bypass

**Why:** Output encoding must match the context where data is inserted. If untrusted text is rendered as active markup or script, an attacker may execute code in another user’s browser. A content security policy can add defense in depth but does not replace safe output handling.

### Q7. A developer proposes removing angle brackets from all input to prevent XSS. What is the best response?
<!-- phases: cyber-14-web-app-security -->

- [ ] That is sufficient for every HTML and JavaScript context
- [x] **Validate input for business rules and encode output for its actual context; use safe templating**
- [ ] Store all input as a cookie
- [ ] Disable authentication on the form

**Why:** Blocklists are easy to bypass and can reject legitimate data. Contextual output encoding and safe framework APIs address how data is rendered; input validation serves a different purpose and should reflect the application’s expected values.

### Q8. An application builds a shell command by concatenating a request parameter. What is the safest design direction?
<!-- phases: cyber-14-web-app-security -->

- [ ] Add more quote characters around the parameter
- [ ] Run the web server as administrator
- [x] **Avoid shell invocation where possible; otherwise use safe argument APIs, strict validation, and least privilege**
- [ ] Log the raw parameter and run it twice

**Why:** Shell metacharacters can alter command meaning when untrusted values are concatenated. Prefer library APIs; if a process must be invoked, pass arguments safely, validate against a narrow expected format, and run with minimal permissions.

## Domain 3 — Authentication, sessions, and request protections (4 questions)

### Q9. A session cookie contains a session ID but lacks `Secure` and `HttpOnly`. What do these flags generally help with?
<!-- phases: cyber-14-web-app-security -->

- [x] **`Secure` limits transmission to HTTPS; `HttpOnly` prevents ordinary script access to the cookie**
- [ ] `Secure` encrypts the database; `HttpOnly` blocks SQL injection
- [ ] Both flags replace server-side authorization
- [ ] `HttpOnly` forces the browser to use a VPN

**Why:** These cookie attributes reduce specific exposure paths: `Secure` constrains transport, while `HttpOnly` limits access through browser scripting APIs. They do not eliminate XSS, CSRF, or authorization flaws, so other controls remain necessary.

### Q10. A user logs out, but the old session token still works in a second browser. What control is missing or ineffective?
<!-- phases: cyber-14-web-app-security -->

- [ ] DNSSEC on the application domain
- [ ] A longer password policy only
- [x] **Server-side session invalidation or equivalent token revocation on logout**
- [ ] A visible logout animation

**Why:** Clearing a browser cookie does not revoke a token copied elsewhere. The server should invalidate sessions or use a token design and revocation strategy that makes logout effective.

### Q11. A bank-themed site asks a user to enter credentials through a link in an unexpected text message. Which security lesson is most relevant?
<!-- phases: cyber-03-security-fundamentals, cyber-14-web-app-security -->

- [ ] The link is trustworthy if it uses HTTPS
- [ ] A phone’s screen size prevents phishing
- [x] **HTTPS protects the connection to that domain, not the user from a deceptive domain; verify through a trusted route**
- [ ] MFA prompts should always be approved after entering a password

**Why:** TLS does not certify that a site is the legitimate bank or that the message is authentic. Users should navigate through a known official app or address and report suspicious messages. Never approve an unexpected MFA prompt.

### Q12. A state-changing transfer endpoint accepts a browser cookie but has no CSRF defense. What risk should be assessed?
<!-- phases: cyber-14-web-app-security -->

- [ ] The endpoint may reveal DNS resolver settings only
- [x] **A malicious site may induce the authenticated browser to submit an unwanted state-changing request**
- [ ] The request will automatically be encrypted twice
- [ ] CSRF is impossible whenever cookies are used

**Why:** Browsers may attach ambient credentials such as cookies to cross-site requests. Use appropriate CSRF protections, such as anti-CSRF tokens and suitable cookie and origin controls, based on the application’s architecture.

## Domain 4 — SSRF, components, and configuration (4 questions)

### Q13. A server fetches a URL supplied by a user. Which test concern is central to SSRF risk?
<!-- phases: cyber-14-web-app-security, cyber-03-security-fundamentals -->

- [ ] Whether the browser has a dark theme
- [ ] Whether the URL contains a fragment identifier
- [x] **Whether the server can be induced to reach internal, loopback, link-local, or otherwise restricted destinations**
- [ ] Whether the user’s keyboard layout is US English

**Why:** Server-side request forgery abuses the server’s network position. Assess destination validation, redirects, DNS behavior, egress controls, and access to internal services in an authorized lab; do not probe real internal targets without permission.

### Q14. A web server runs an outdated framework with a publicly documented vulnerability. What is the most responsible first assessment?
<!-- phases: cyber-14-web-app-security -->

- [ ] Immediately exploit the production service to prove impact
- [x] **Confirm the deployed version and exposure from authorized evidence, then follow the organization’s remediation process**
- [ ] Assume the application is compromised without checking
- [ ] Delete the dependency manifest

**Why:** Version evidence and configuration determine whether the issue applies. Validate safely within scope, assess exploitability and business impact, and coordinate patching or mitigation through change control.

### Q15. A test environment displays full stack traces and database paths to unauthenticated visitors. What category of concern is most direct?
<!-- phases: cyber-14-web-app-security -->

- [ ] Strong authentication
- [ ] Correct object ownership checks
- [x] **Security misconfiguration and information exposure through verbose errors**
- [ ] Proper certificate pinning

**Why:** Detailed errors can reveal implementation and internal paths, helping an attacker refine later attempts. Configure safe error handling and retain diagnostic detail in protected server-side logs.

### Q16. A team wants to add a new JavaScript package to production. What should be checked before approval?
<!-- phases: cyber-14-web-app-security -->

- [ ] Whether the package has a memorable name only
- [x] **Whether it is needed, maintained, appropriately licensed, and free of known relevant vulnerabilities**
- [ ] Whether it disables the browser’s same-origin policy
- [ ] Whether its source code can be omitted from all inventory

**Why:** Third-party components introduce maintenance, licensing, and security risk. Inventory dependencies, review provenance and update practices, scan for known issues, and use the organization’s approved dependency process.

## Domain 5 — Assessment evidence and remediation (4 questions)

### Q17. You confirm an IDOR in an authorized test account. Which evidence best supports a useful finding while limiting data exposure?
<!-- phases: cyber-14-web-app-security -->

- [ ] Download every tenant’s records
- [x] **Capture the minimal request/response showing an unauthorized record access, with sensitive values safely redacted**
- [ ] Publish a working exploit against the production service
- [ ] Keep no record of the tested account or request

**Why:** A finding needs reproducible evidence and clear scope, but should minimize access and retention of sensitive data. Use approved test records, redact secrets, and record the account and environment used.

### Q18. A report says “XSS is possible” but has no steps, impact, or remediation. What would most improve it?
<!-- phases: cyber-14-web-app-security -->

- [ ] Add an unsupported severity number
- [ ] Name the tester’s preferred browser
- [x] **Provide scoped reproduction steps, affected input/output context, realistic impact, and a specific fix**
- [ ] Include a copy of unrelated customer data

**Why:** A useful finding lets the owner reproduce and prioritize the issue. Describe the vulnerable context, provide minimal evidence, explain realistic consequences, and recommend an actionable remediation such as context-aware encoding.

### Q19. A scanner flags a missing security header, but manual review shows the header is set on the relevant response. What should the tester do?
<!-- phases: cyber-14-web-app-security -->

- [ ] Report the finding as confirmed without checking the response
- [ ] Change the application during the test without approval
- [x] **Recheck the exact request, redirect path, and response; then document whether it is a false positive or a scoped inconsistency**
- [ ] Delete the scanner output

**Why:** Scanner results are leads that need validation. Confirm the relevant route, status, and final response, preserve the evidence, and report the scanner limitation or any real route-specific gap accurately.

### Q20. A developer asks you to test a public production endpoint that is outside the written assessment scope. What is the correct action?
<!-- phases: cyber-14-web-app-security -->

- [ ] Test it gently without telling anyone
- [x] **Pause and obtain explicit written authorization and an updated scope before testing**
- [ ] Ask a third party to test it instead
- [ ] Assume that public availability implies consent

**Why:** Testing authority is defined by explicit scope, not by accessibility or an informal request. Confirm authorization, target, methods, timing, and contacts before sending test traffic.

## Question-to-phase map

| Question | Main phase(s) |
|---|---|
| Q1–Q4, Q6–Q8, Q11–Q12, Q17–Q20 | `cybersec-roadmap/14-phase-web-app-security.md` |
| Q5 | `cybersec-roadmap/03-phase-security-fundamentals.md`, `cybersec-roadmap/14-phase-web-app-security.md` |
| Q9–Q10, Q13–Q16 | `cybersec-roadmap/14-phase-web-app-security.md`, `cybersec-roadmap/03-phase-security-fundamentals.md` |
