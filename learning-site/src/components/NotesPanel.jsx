// The reader's workspace for one phase: a free-text note and a place to think.
//
// WHY IT IS NOT A CHECKLIST
// Every other control on this page measures something. This one deliberately
// measures nothing: no count of answers, no "3 of 7 done", no percentage, and
// nothing here is reported to the dashboard. The curriculum's whole register is
// no-shame, and turning "write down what you noticed" into a progress bar would
// make an empty box feel like a failure. A reader who writes three words and one
// who writes nothing look identical to the rest of the site.
//
// Collapsed by default, for the same reason the finder is: this is a
// 5,000–24,000 word reading page, and a large always-open textarea would push
// the teaching down for a control used occasionally.
//
// See docs/DECISIONS.md → D-019.

import { useState } from "react";

export default function NotesPanel({ phaseId, note, hasAnswers, onChange, onClear }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const written = note && note.trim() !== "";

  function handleClear() {
    onClear(phaseId);
    setConfirming(false);
    setOpen(false);
  }

  return (
    <section className={"card notes" + (open ? " notes--open" : "")}>
      <div className="notes__head">
        <h2>Your notes</h2>
        <button
          type="button"
          className="chip"
          aria-expanded={open}
          aria-pressed={open}
          onClick={() => {
            setOpen((v) => !v);
            setConfirming(false);
          }}
        >
          {open ? "Hide notes" : written ? "Your notes" : "Add a note"}
        </button>
      </div>

      {!open && (
        <p className="muted notes__hint">
          {written
            ? "You have written something here. It stays on this machine and travels with your backup."
            : "Somewhere to write. Nothing here is scored, counted, or shown anywhere else in the site."}
          {hasAnswers && " Your answers to the practice tasks are below."}
        </p>
      )}

      {open && (
        <>
          <label className="notes__label" htmlFor={"note-" + phaseId}>
            What you noticed, what confused you, what you want to come back to
          </label>
          <textarea
            id={"note-" + phaseId}
            className="notes__area"
            value={note || ""}
            rows={8}
            spellCheck="true"
            placeholder="Nothing is graded here. Write as much or as little as is useful."
            onChange={(e) => onChange(phaseId, e.target.value)}
          />
          <p className="muted notes__foot">
            Saved as you type, on this machine only. It is included in{" "}
            <strong>Back up &amp; restore</strong>.
          </p>

          {written && (
            <div className="notes__actions">
              {confirming ? (
                <>
                  <span className="muted">
                    Delete this phase&rsquo;s note and all your answers to it?
                  </span>
                  <button type="button" className="btn btn--small" onClick={handleClear}>
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => setConfirming(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => setConfirming(true)}
                >
                  Clear this phase&rsquo;s notes
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}