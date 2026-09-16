// Where the reader has been, across every phase in a track.
//
// WHY THIS EXISTS
// The sidebar allows opening any phase in any order, and this curriculum is a
// sequence. A reader who jumps to Phase 9 to answer a question from work has
// lost the thread, and there was nothing in the site showing them that. The
// roadmap recorded this as deliberately unbuilt — "it risks becoming a
// completion-scold, which the anti-patterns forbid — but the case for a neutral
// list exists."
//
// HOW THE SCOLD IS AVOIDED
// Three structural choices, each of which a rewrite could undo, so each is
// asserted in `test-path-order.mjs` rather than left to care:
//
//   1. **No denominator.** Nothing on this page says "N of 29" or "6 left". The
//      classification lives in `lib/pathOrder.js`, whose rows carry no
//      `remaining`, `percent` or `missing` field — so the absence is a property
//      of the data, not of the rendering. This is D-020's rule for "Your work",
//      applied again.
//   2. **Where, not how far.** The two lists are "Not started yet" and "Started,
//      not finished". Neither is a ranking, neither is ordered by volume, and
//      neither is coloured as a warning.
//   3. **The reader's own file.** Every row describes work the reader recorded.
//      An empty list means an empty list, not a failure.
//
// It is reachable from the sidebar, not pushed at the reader, because a page
// whose purpose is to point out untouched phases should never be what opens by
// default. See docs/DESIGN-SYSTEM.md → Anti-patterns.

import { findTrack, tracks } from "../data/roadmaps.js";
import { readStarts } from "../hooks/useSchedule.js";
import { readNotes } from "../hooks/useNotes.js";
import { countDone } from "../hooks/useProgress.js";
import { classifyPhases, untouchedPhases, openPhases } from "../lib/pathOrder.js";

function PhaseRow({ row, onOpenPhase }) {
  const { phase, done, total, hasNote, answers } = row;
  // Facts about the reader's own file, phrased as presence rather than absence.
  const marks = [];
  if (done > 0) marks.push(done + " of " + total + " ticked");
  else if (total > 0) marks.push(total + " to tick");
  if (hasNote) marks.push("note");
  if (answers > 0) marks.push(answers === 1 ? "1 answer" : answers + " answers");

  return (
    <li className="path-row">
      <button
        type="button"
        className="path-row__open"
        onClick={() => onOpenPhase(phase.id)}
      >
        <span className="path-row__title">{phase.title}</span>
        <span className="muted path-row__meta">
          {phase.duration}
          {marks.length > 0 && " · " + marks.join(" · ")}
        </span>
      </button>
    </li>
  );
}

function Section({ title, blurb, rows, empty, onOpenPhase }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <p className="muted">{blurb}</p>
      {rows.length === 0 ? (
        <p className="muted path-empty">{empty}</p>
      ) : (
        <ol className="path-list">
          {rows.map((row) => (
            <PhaseRow key={row.phase.id} row={row} onOpenPhase={onOpenPhase} />
          ))}
        </ol>
      )}
    </section>
  );
}

export default function PathOrder({ trackId, done, onOpenPhase, onOpenTrack }) {
  const track = findTrack(trackId);
  // A plain read, not the hook — same rule the dashboard rail follows (D-015).
  // Two live copies of one storage key drift, and the stale one writing back
  // would drop a record the reader just added on the page that owns it.
  const notes = readNotes();
  const rows = classifyPhases(track, done, notes);

  const open = openPhases(track, done, notes);
  const untouched = untouchedPhases(track, done, notes);
  const complete = rows.filter((r) => r.state === "complete");

  return (
    <div className="path-order">
      <header className="path-order__header">
        <h1>Where you've been</h1>
        <p className="muted">
          Every phase in {track.label}, grouped by whether you have left anything
          in it. Nothing here is scored, and nothing is expected of you — this is a
          description of your own file, not a plan for catching up.
        </p>
      </header>

      <nav className="path-order__tracks" aria-label="Track">
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            className={"chip" + (t.id === track.id ? " is-active" : "")}
            aria-pressed={t.id === track.id}
            onClick={() => onOpenTrack && onOpenTrack(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <Section
        title="Started, not finished"
        blurb="Phases with something of yours in them. This is the list to come back to after a break."
        rows={open}
        empty="Nothing open right now."
        onOpenPhase={onOpenPhase}
      />

      <Section
        title="Not started yet"
        blurb="Phases with nothing recorded in them. On a plan this long that is the normal state of most of the curriculum."
        rows={untouched}
        empty="Every phase has something in it."
        onOpenPhase={onOpenPhase}
      />

      {complete.length > 0 && (
        <Section
          title="Finished"
          blurb="Every checklist item ticked."
          rows={complete}
          empty=""
          onOpenPhase={onOpenPhase}
        />
      )}
    </div>
  );
}
