// SSR checks for the Exams view using a small self-contained fixture.
// Run with: node scripts/test-exams-view.mjs (from learning-site/)
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const failures = [];
let checks = 0;
function ok(condition, message) {
  checks++;
  if (!condition) failures.push(message);
}
function text(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const fixture = [
  {
    id: "curriculum-sample",
    title: "Study a topic",
    kind: "curriculum-practice",
    scope: "Self-check for one study topic.",
    code: "",
    questions: [
      {
        id: "mapped-q1",
        domain: "Networking",
        question: "Which phase link opens?",
        options: [
          { text: "Networking Basics", correct: true },
          { text: "Operating Systems", correct: false },
          { text: "Helpdesk", correct: false },
          { text: "Portfolio", correct: false },
        ],
        explanation: "This maps to a real phase.",
        phases: ["it-03-networking-basics"],
      },
      {
        id: "study-q1",
        domain: "Networking",
        question: "Which protocol resolves a name?",
        options: [
          { text: "DNS", correct: true },
          { text: "ARP", correct: false },
          { text: "DHCP", correct: false },
          { text: "NTP", correct: false },
        ],
        explanation: "DNS resolves names to addresses.",
        phases: ["it-roadmap/03-phase-networking-basics.md"],
      },
      {
        id: "study-q2",
        domain: "Networking",
        question: "Which protocol maps local IPv4 addresses to MAC addresses?",
        options: [
          { text: "DNS", correct: false },
          { text: "ARP", correct: true },
          { text: "DHCP", correct: false },
          { text: "NTP", correct: false },
        ],
        explanation: "ARP resolves a neighbor's IPv4 address to its link-layer address.",
        phases: ["it-roadmap/03-phase-networking-basics.md"],
      },
    ],
  },
  {
    id: "cert-sample",
    title: "Unofficial Security+ practice",
    kind: "certification-practice",
    scope: "Unofficial practice questions based on published objectives.",
    code: "SY0-701",
    questions: [
      {
        id: "cert-q1",
        domain: "Security operations",
        question: "Which principle limits access?",
        options: [
          { text: "Least privilege", correct: true },
          { text: "Availability", correct: false },
          { text: "Redundancy", correct: false },
          { text: "Obfuscation", correct: false },
        ],
        explanation: "Least privilege grants only the access needed for a task.",
        phases: ["cybersec-roadmap/03-phase-security-fundamentals.md"],
      },
    ],
  },
];

const server = await createServer({ root: ".", logLevel: "silent", server: { middlewareMode: true }, appType: "custom" });
try {
  const { ExamsView } = await server.ssrLoadModule("/src/pages/Exams.jsx");
  const renderMarkup = (props) => renderToStaticMarkup(createElement(ExamsView, props));
  const render = (props) => text(renderMarkup(props));
  const index = render({ papers: fixture });
  ok(index.includes("Curriculum practice · diagnostic only"), "curriculum paper is labelled diagnostic only");
  ok(index.includes("Unofficial certification practice"), "certification paper is labelled unofficial");
  ok(index.includes("diagnostic study prompts"), "index avoids pass/fail readiness claims for curriculum papers");
  ok(index.includes("do not predict a real exam result"), "certification scope is stated honestly");
  ok(index.includes("Open paper"), "paper list provides an open control");

  const selectedMarkup = renderMarkup({ papers: fixture, initialPaperId: "curriculum-sample", onOpenPhase: (phaseId) => phaseId });
  const selected = text(selectedMarkup);
  ok(selected.includes("Question 1"), "selected paper opens at its first question");
  ok(selected.includes("Which phase link opens?"), "selected question is rendered");
  ok((renderMarkup({ papers: fixture, initialPaperId: "curriculum-sample" }).match(/class=\"exams__option(?: |\")/g) || []).length === 4, "question renders four answer choices");
  ok(renderMarkup({ papers: fixture, initialPaperId: "curriculum-sample" }).includes('aria-live="polite"'), "selection feedback uses a polite live region");
  ok(selected.includes("Previous question") && selected.includes("Next question"), "question navigation controls render");
  ok(selected.includes("Restart paper"), "restart control renders");
  ok(!selected.includes("Score") && !selected.includes("of 2"), "question progress contains no score ratio or denominator");
  ok(!selected.includes("DNS resolves names"), "explanation is withheld until an answer is chosen");
  ok(selected.includes("Phase 3 — Networking Basics"), "mapped phase is shown as a navigation control");
  ok(selectedMarkup.includes("class=\"exams__curriculum-links\""), "curriculum mapping block renders");

  const empty = render({ papers: [] });
  ok(empty.includes("No practice papers were generated"), "data-empty state is provided");
  ok(empty.includes("npm run build:content"), "empty state explains how generated data is restored");
} finally {
  await server.close();
}

if (failures.length) {
  console.error(`EXAMS VIEW TEST FAILED — ${failures.length} of ${checks} checks failed:`);
  for (const failure of failures) console.error("  ✗ " + failure);
  process.exit(1);
}
console.log(`EXAMS VIEW TEST PASSED — ${checks} SSR assertions.`);
