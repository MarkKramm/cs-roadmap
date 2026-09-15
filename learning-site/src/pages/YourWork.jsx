// Read back everything the reader has written: one note per phase plus one
// answer per practice task, gathered from all 23 phases into one page.
//
// WHY THIS EXISTS
// D-019 shipped the writing side and, deliberately, no reading side: a note was
// reachable only by navigating to the phase that owned it. Writing that can only
// be found by remembering where you put it is a silo, not a workspace. This is
// the other half.
//
// WHY IT COUNTS NOTHING
// The summary line says how many phases hold writing — a statement about where
// things are, with no denominator and no "of 23". There is no progress bar, no
// percentage, and no ordering by how much was written. A reader who wrote one
// line in one phase sees the same page a reader with 40 answers sees. See
// docs/DECISIONS.md → D-019, D-020.
//
// WHY readNotes AND NOT useNotes
// useNotes owns the key and writes to it. This page only reads, and two live
// copies of one localStorage key drift — the same rule the dashboard rail
// follows with readPortfolio(). The page reads once at mount; switching views
// unmounts it, so returning to it re-reads.

import { useState } from "react";
import { readNotes } from "../hooks/useNotes.js";
import { tracks } from "../data/roadmaps.js";
import { collectWork, summariseWork } from "../lib/yourWork.js";
import { renderInline } from "../lib/renderInline.jsx";

// The sidebar strips "Phase 3 — " from titles for width; this page has room, so
// it keeps the number for orientation and drops only the redundant "Phase".
function shortTitle(title) {
  return String(title || "").replace(/^Phase /, "");
}

export default function YourWork({ onOpenPhase }) {
  const [notes] = useState(readNotes);

  const groups = collectWork(notes, tracks);
  const summary = summariseWork(groups);

  if (groups.length === 0) {
    return (
      <>
        <h1>Your work</h1>
        <div className="empty-state">
          <p>
            Nothing written yet. Every phase has a <strong>Your notes</strong>{" "}
            panel and an answer box under each practice task — anything you write
            there collects here, so you can find it again without remembering
            which phase it was in.
          </p>
          <p className="muted">
            Nothing on this page is scored or counted. It is a place to read your
            own writing back.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="work__header">
        <h1>Your work</h1>
        <p className="muted">
          {summary.phases === 1
            ? "One phase has writing."
            : summary.phases + " phases have writing."}{" "}
          {summary.answers > 0 &&
            (summary.answers === 1
              ? "One answer to a practice task."
              : summary.answers + " answers to practice tasks.")}{" "}
          Kept on this machine, and carried by{" "}
          <strong>Back up &amp; restore</strong>.
        </p>
      </header>

      {groups.map((group) => (
        <article className="card work__phase" key={group.phaseId}>
          <div className="work__phase-head">
            <div>
              <div className="muted work__track">{group.trackLabel}</div>
              <h2 className="work__title">{shortTitle(group.phaseTitle)}</h2>
            </div>
            {onOpenPhase && (
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => onOpenPhase(group.phaseId)}
              >
                Open phase
              </button>
            )}
          </div>

          {group.note && (
            <section className="work__note">
              <h3 className="work__label">Your note</h3>
              <p className="work__note-text">{group.note}</p>
            </section>
          )}

          {group.answers.length > 0 && (
            <section className="work__answers">
              <h3 className="work__label">
                {group.answers.length === 1 ? "Your answer" : "Your answers"}
              </h3>
              {group.answers.map((a) => (
                <div
                  className={"work__answer" + (a.orphaned ? " is-orphaned" : "")}
                  key={a.taskId}
                >
                  {a.orphaned ? (
                    <p className="muted work__task">
                      This task is no longer in the curriculum, so its text
                      cannot be shown. Your answer is kept rather than dropped.
                    </p>
                  ) : (
                    <p className="work__task">
                      {renderInline(a.taskText, "wt-" + a.taskId)}
                    </p>
                  )}
                  <p className="work__answer-text">{a.answer}</p>
                </div>
              ))}
            </section>
          )}
        </article>
      ))}
    </>
  );
}