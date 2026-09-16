# FAQ

Why the curriculum is structured the way it is. This is the design rationale — for the study material itself, see [`../career-roadmaps/`](../career-roadmaps/).

## Strategy

### Why IT before cybersecurity?

Cybersecurity roles overwhelmingly prefer candidates with prior IT experience. Real tickets, real users, real accounts, and real endpoints teach context that no lab can fully replace. Skipping straight to cyber means competing against people who already understand how systems behave when they break — a harder fight for a beginner with no professional experience.

The IT roadmap is the fastest realistic path to paid work. The cyber roadmap builds on that base.

### Why 3–6 months for IT and 6–18 months for cyber?

Those are realistic windows, not targets. They assume 10–15 focused hours per week, a beginner starting point, and buffer weeks for the inevitable off-weeks. Optimistic timelines ("become a SOC analyst in 3 months") are common online and set beginners up to feel like failures when they do not hit them.

### There is a third track. Do I have to do it?

No, and this is the one place in the curriculum where **not finishing is the expected outcome**. The IT and cyber tracks are sequential and completion-oriented: each ends at a hire, and skipping a phase leaves a gap that shows up later. The mid-level track (`career-roadmaps/advance-roadmap/`) is different on purpose. It assumes you already hold a security role, and it is built so each of its six phases stands alone.

Take the two or three your current job is actually asking for. Working through all six because the list has six items is the wrong reason to read a phase. The `00-overview.md` has a table matching common situations to the phases that address them.

### What makes the mid-level track different from the other two?

Three things, and each one is a deliberate choice rather than a scope increase.

**It gates on prior employment.** The overview says plainly that it is not for someone who has not held a security role, because every phase assumes context — real alerts, real users, real consequences — that a lab cannot supply. That is the same honesty the entry-level tracks apply to themselves.

**Most of the hours are writing, not reading.** From Phase 3 onward the deliverable is a document somebody else acts on: a decision log, a runbook, a business case, a coverage map. At this level the writing *is* the work, so the weekly rhythm puts the writing block midweek rather than at the end.

**The $0 rule still holds, with no exception.** Everything is doable at zero cost, every paid or freemium row names a free alternative in the same row, and the single TryHackMe Premium exception in the cyber track does not carry over — nothing in the mid-level track depends on it.

### Why a $0 budget?

Two reasons. First, the person this was built for does not have $500 for a bootcamp. Second, most paid courses teach the same material that is available for free — the money buys structure and accountability, not knowledge. Free resources are enough to reach entry-level employability, and the curriculum proves it by using only free tools.

The one exception is a single month of TryHackMe Premium, and only when a phase explicitly says it is worth it. Everything else has a free alternative in the same row of the tools table.

## Pacing

### Why 2–4 hours/day and not more?

Because burnout is real and the plan is long. A sustainable 10–15 hours per week for 6 months beats an unsustainable 30 hours per week for 6 weeks followed by 6 weeks of nothing. The anti-burnout rules in [`../career-roadmaps/shared/anti-burnout-rules.md`](../career-roadmaps/shared/anti-burnout-rules.md) formalize this.

### Why buffer weeks?

Because the plan will not go as scheduled. Sick days, tired days, days where a lab breaks and you spend three hours fixing it — those are not failures, they are expected. A plan without buffer is a plan that breaks on contact.

### Why does every phase need a deliverable?

Because visible progress is the main defense against demotivation. A phase that ends with "you understand X" produces nothing you can look at, show, or add to a portfolio. A phase that ends with a specific artifact — a network diagram, a Wireshark screenshot, a troubleshooting write-up — produces items the learner can point to and a hiring manager can review.

## Tools

### Why Wazuh and not Splunk?

Wazuh is free, open-source, and installable locally. Splunk is the industry standard but expensive and unnecessary for a beginner's home lab. The curriculum teaches SIEM concepts with Wazuh, and links to Splunk's free training so the learner recognizes the commercial tool when they encounter it on a job.

### Why Packet Tracer and not GNS3?

Packet Tracer is a Cisco product, free with an account, and runs on low-end hardware. GNS3 is more realistic but heavier and harder to set up. For someone on a modest laptop, Packet Tracer is the pragmatic choice.

### Why so many "free alternatives" in the tools tables?

Because no single tool is the only way to learn a concept, and locking a beginner into one vendor's ecosystem is a disservice. The free-alternative column also teaches an important habit: when a tool costs money or is unavailable, look for the free path before paying.

## Structure

### Why "You're ready to move on when…" instead of grades or scores?

Because the goal is a working ability, not a test score. "You can troubleshoot a basic internet issue using IP, gateway, DNS, and Wi-Fi checks, and explain your process clearly in a ticket" is a bar the learner can self-assess against. A percentage grade is not.

### Why are the anti-burnout rules in `shared/` and not repeated in each phase?

Because they apply to every phase and should be read once, not skipped fourteen times. Repeating them in each phase would train the reader to skip them.

### Why is `checklist-master.md` a separate file from the phase checklists?

The phase checklists are scoped to one phase. The master checklist is the single flat list for the whole track, useful for tracking progress over months without scrolling through every phase file. When a phase checklist changes, the master is regenerated.

### Why no certifications first?

Certifications cost money (exam fees), take months to study for, and do not substitute for hands-on evidence. A portfolio with three real labs and a clear write-up is stronger than a Security+ badge with nothing behind it, at least for entry-level roles that actually look at what a candidate has built. Certifications are covered — they come after the learner has practical proof, and only when a specific certification removes a real hiring filter for the target role.

## Honest answers

### Will this get me a job?

The curriculum gives you the skills, the portfolio, and the application plan that entry-level IT and cybersecurity roles require. It does not guarantee a job. Hiring depends on the market, timing, how many applications you send, how well you interview, and factors outside any curriculum. What it does do is remove the most common reasons a self-taught candidate gets filtered out: no proof of work, no tools experience, no documentation habit.

### Can I skip phases?

You can, but each phase depends on the ones before it. Skipping Phase 3 (Networking) to jump into cybersecurity means every SIEM alert, every Nmap scan, and every firewall rule will be confusing. The order is deliberate.

### Can I do this while working full-time?

Yes, but plan for the longer end of the timeline. The weekly rhythm in [`../career-roadmaps/README.md`](../career-roadmaps/README.md) assumes a few hours most days. If you can only manage weekends, expect the cyber track to take closer to 18 months than 6.