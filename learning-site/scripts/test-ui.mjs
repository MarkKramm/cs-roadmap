// Unit checks for the pure logic behind the UI features.
//
// WHY THIS EXISTS
// smoke-render.mjs proves components render; it runs no effects and no handlers,
// so it cannot see a bug in useShortcuts' key handling, in paceFor's arithmetic,
// or in the lesson-progress key namespacing. Those are the three places a defect
// would be silent: a shortcut that never fires, a pace figure that is wrong by a
// week, or two phases sharing a section key so ticking one ticks the other.
//
// The modules under test are imported through Vite's ssrLoadModule, because
// useShortcuts.js imports React and pace.js sits behind the same resolution.
//
// Run: npm run test:ui   (from learning-site/)

import { createServer } from "vite";

const failures = [];
let checks = 0;

function ok(cond, label, detail) {
  checks++;
  if (!cond) failures.push(label + (detail ? " — " + detail : ""));
}

const server = await createServer({
  root: ".",
  logLevel: "silent",
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const pace = await server.ssrLoadModule("/src/lib/pace.js");
  const shortcuts = await server.ssrLoadModule("/src/hooks/useShortcuts.js");
  const lessonProgress = await server.ssrLoadModule(
    "/src/hooks/useLessonProgress.js"
  );
  const roadmaps = await server.ssrLoadModule("/src/data/roadmaps.js");

  // ---- pace.js ------------------------------------------------------------
  const { daysBetween, addWeeks, paceFor, upcomingPhases, today } = pace;

  ok(
    daysBetween("2026-01-01", "2026-01-08") === 7,
    "daysBetween: one week",
    String(daysBetween("2026-01-01", "2026-01-08"))
  );
  ok(
    daysBetween("2026-01-08", "2026-01-01") === -7,
    "daysBetween: reversed order is negative"
  );
  ok(
    daysBetween("2026-03-01", "2026-03-15") === 14,
    "daysBetween: spans a DST boundary without drifting",
    // The US DST change is 2026-03-08. A local-time implementation returns
    // 13.958 days here and rounds to 14 only sometimes; this pins it.
    String(daysBetween("2026-03-01", "2026-03-15"))
  );
  ok(daysBetween("", "2026-01-01") === null, "daysBetween: empty input is null");

  const boundaryInstant = new Date("2026-09-18T01:00:00.000Z");
  ok(
    today(boundaryInstant, "America/Los_Angeles") === "2026-09-17",
    "today: uses the local calendar day across UTC midnight",
    today(boundaryInstant, "America/Los_Angeles")
  );
  ok(
    today(boundaryInstant, "Asia/Manila") === "2026-09-18",
    "today: respects a positive-offset local calendar day",
    today(boundaryInstant, "Asia/Manila")
  );

  ok(
    addWeeks("2026-01-01", 2) === "2026-01-15",
    "addWeeks: two weeks",
    addWeeks("2026-01-01", 2)
  );
  ok(
    addWeeks("2026-12-28", 1) === "2027-01-04",
    "addWeeks: crosses a year boundary",
    addWeeks("2026-12-28", 1)
  );

  const itTrack = roadmaps.findTrack("it");

  // No start date: the page must not invent a comparison.
  const unset = paceFor(itTrack, "", 0, 90);
  ok(unset.elapsedWeeks === null, "paceFor: no start date means no elapsed time");
  ok(unset.remaining === null, "paceFor: no start date means no remaining weeks");
  ok(unset.planned > 0, "paceFor: planned weeks still known without a start date");

  // Behind: started long ago, little done.
  const behind = paceFor(itTrack, "2026-01-01", 1, 90);
  ok(behind.verdict === "behind", "paceFor: behind when time outruns work", behind.verdict);

  // Ahead: the plan's own total duration of work finished on day one is not
  // possible, so assert the boundary directly instead — a start date of today
  // with everything done is ahead.
  const ahead = paceFor(itTrack, today(), 90, 90);
  ok(ahead.verdict === "ahead", "paceFor: ahead when everything is done", ahead.verdict);

  // The verge case that matters: a small gap must NOT be reported as behind,
  // because week-level precision on a part-time plan is false precision.
  const onPlan = paceFor(itTrack, today(), 0, 90);
  ok(
    onPlan.verdict === "ahead" || onPlan.verdict === "on-plan",
    "paceFor: a fresh start is not reported as behind",
    onPlan.verdict
  );

  ok(
    behind.finishOn === addWeeks(behind.startedOn, behind.planned),
    "paceFor: planned finish is start plus the whole plan"
  );

  // upcomingPhases must not schedule a phase it cannot fit whole.
  const upcoming = upcomingPhases(itTrack, "2026-01-01", {}, 4);
  const scheduled = upcoming.reduce((n, u) => n + u.weeks, 0);
  ok(
    scheduled <= 4,
    "upcomingPhases: never overruns the window",
    scheduled + " weeks scheduled into a 4-week window"
  );
  ok(
    upcoming.length > 0,
    "upcomingPhases: a 4-week window fits at least one IT phase"
  );
  // Dates must chain: each entry starts the day the previous one ends.
  for (let i = 1; i < upcoming.length; i++) {
    ok(
      upcoming[i].startsOn === upcoming[i - 1].endsOn,
      "upcomingPhases: entry " + i + " starts when the previous ends",
      upcoming[i].startsOn + " vs " + upcoming[i - 1].endsOn
    );
  }

  // ---- track weeks --------------------------------------------------------
  const weeks = roadmaps.trackWeeks(itTrack);
  const summed = itTrack.phases.reduce(
    (n, p) => n + (Number(p.durationWeeks) || 0),
    0
  );
  ok(
    weeks.weeks === summed,
    "trackWeeks: matches the sum of the phase durations",
    weeks.weeks + " vs " + summed
  );
  ok(
    weeks.counted === itTrack.phases.length,
    "trackWeeks: every IT phase declares a duration",
    weeks.counted + " of " + itTrack.phases.length
  );

  // ---- neighbours ---------------------------------------------------------
  const { neighbours } = roadmaps;
  const first = neighbours(itTrack, itTrack.phases[0].id);
  ok(first.prev === null, "neighbours: first phase has no previous");
  ok(first.next && first.next.id === itTrack.phases[1].id, "neighbours: next is the following phase");
  ok(first.index === 0, "neighbours: index of the first phase is 0");

  const lastPhase = itTrack.phases[itTrack.phases.length - 1];
  const last = neighbours(itTrack, lastPhase.id);
  ok(last.next === null, "neighbours: last phase has no next");
  ok(
    last.prev && last.prev.id === itTrack.phases[itTrack.phases.length - 2].id,
    "neighbours: previous is the preceding phase"
  );

  const missing = neighbours(itTrack, "does-not-exist");
  ok(
    missing.prev === null && missing.next === null && missing.index === -1,
    "neighbours: an unknown phase yields no neighbours rather than throwing"
  );

  // A one-phase track is both the first and the last; the pager must not offer
  // a neighbour that does not exist.
  const solo = neighbours({ phases: [{ id: "only", title: "Only" }] }, "only");
  ok(
    solo.prev === null && solo.next === null,
    "neighbours: a single-phase track has no neighbours"
  );

  // ---- firstUnfinishedPhase ----------------------------------------------
  const noDone = roadmaps.firstUnfinishedPhase(itTrack, {});
  ok(
    noDone && noDone.id === itTrack.phases[0].id,
    "firstUnfinishedPhase: starts at the first phase"
  );

  const firstDone = {};
  for (const c of itTrack.phases[0].checklist) firstDone[c.id] = true;
  const afterFirst = roadmaps.firstUnfinishedPhase(itTrack, firstDone);
  ok(
    afterFirst && afterFirst.id === itTrack.phases[1].id,
    "firstUnfinishedPhase: advances once a phase is complete",
    afterFirst && afterFirst.id
  );

  // A partly-finished phase still counts as unfinished.
  const partial = {};
  partial[itTrack.phases[0].checklist[0].id] = true;
  const p2 = roadmaps.firstUnfinishedPhase(itTrack, partial);
  ok(
    p2 && p2.id === itTrack.phases[0].id,
    "firstUnfinishedPhase: a partially done phase is still where you are"
  );

  // ---- isTypingTarget -----------------------------------------------------
  const { isTypingTarget } = shortcuts;
  ok(isTypingTarget({ tagName: "INPUT" }), "isTypingTarget: input");
  ok(isTypingTarget({ tagName: "TEXTAREA" }), "isTypingTarget: textarea");
  ok(isTypingTarget({ tagName: "SELECT" }), "isTypingTarget: select");
  ok(isTypingTarget({ tagName: "DIV", isContentEditable: true }), "isTypingTarget: contentEditable");
  ok(!isTypingTarget({ tagName: "DIV" }), "isTypingTarget: a plain div is not a field");
  ok(!isTypingTarget({ tagName: "BUTTON" }), "isTypingTarget: a button is not a field");
  ok(!isTypingTarget(null), "isTypingTarget: null is safe");

  // ---- lesson section key namespacing ------------------------------------
  // The failure this guards is silent and nasty: if two phases keyed their
  // sections the same way, ticking a section in one would show as ticked in the
  // other, and resetting one would clear the other.
  const toc = [
    { id: "part-1", text: "Part 1", level: 3 },
    { id: "part-2", text: "Part 2", level: 3 },
  ];
  const store = { "it-01#part-1": true, "it-02#part-1": true };
  ok(
    lessonProgress.countLessonSections(store, "it-01", toc) === 1,
    "countLessonSections: counts only this phase's sections",
    String(lessonProgress.countLessonSections(store, "it-01", toc))
  );
  ok(
    lessonProgress.countLessonSections(store, "cyber-09", toc) === 0,
    "countLessonSections: another phase's ticks do not leak in"
  );
  ok(
    lessonProgress.countLessonSections(store, "it-01", []) === 0,
    "countLessonSections: no sections means no count"
  );
  ok(
    lessonProgress.countLessonSections(null, "it-01", toc) === 0,
    "countLessonSections: a missing store is safe"
  );

  // ---- reading size -------------------------------------------------------
  const readingSize = await server.ssrLoadModule("/src/hooks/useReadingSize.js");
  const scales = readingSize.SIZES.map((s) => s.scale);
  ok(
    scales.every((s, i) => i === 0 || s > scales[i - 1]),
    "SIZES: scales are strictly ascending",
    scales.join(", ")
  );
  ok(
    scales.includes(1),
    "SIZES: one option is exactly 1x, so there is a true default"
  );
  ok(
    readingSize.scaleFor("m") === 1,
    "scaleFor: the default is unscaled"
  );
  ok(
    readingSize.scaleFor("nonsense") === 1,
    "scaleFor: an unknown size falls back to 1 rather than NaN"
  );
} finally {
  await server.close();
}

if (failures.length > 0) {
  console.error("UI TEST FAILED — " + failures.length + " issue(s):");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}

console.log("UI TEST PASSED — " + checks + " checks across pace, navigation, shortcuts and section keys.");