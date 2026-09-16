import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import { tracks } from "../data/roadmaps.js";
import { usePortfolio, STATUSES } from "../hooks/usePortfolio.js";

// Artifacts you have actually built, and where they live.
//
// The curriculum lists a deliverable per phase; this is the other half of that
// — what exists, what is unfinished, and what you can send someone a link to.
// A phase link is offered but never required: the tracker should not make you
// file paperwork before you are allowed to record something you built.
// See docs/DESIGN-SYSTEM.md → <EmptyState>.

const STATUS_LABELS = Object.fromEntries(STATUSES.map((s) => [s.id, s.label]));

const EMPTY_DRAFT = {
  title: "",
  phaseId: "",
  repoUrl: "",
  liveUrl: "",
  status: "idea",
  notes: "",
};

// Every phase across all three tracks, so an entry can point at its origin.
function phaseOptions() {
  const out = [];
  for (const track of tracks) {
    for (const phase of track.phases) {
      out.push({
        id: phase.id,
        label: track.short + " · " + phase.title.replace(/^Phase \d+ — /, ""),
      });
    }
  }
  return out;
}

export default function Portfolio() {
  const { entries, add, setStatus, remove } = usePortfolio();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  const options = useMemo(() => phaseOptions(), []);

  const counts = useMemo(() => {
    const c = { all: entries.length };
    for (const s of STATUSES) c[s.id] = 0;
    for (const e of entries) if (c[e.status] !== undefined) c[e.status]++;
    return c;
  }, [entries]);

  const shown = useMemo(
    () =>
      filter === "all" ? entries : entries.filter((e) => e.status === filter),
    [entries, filter]
  );

  function submit(e) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    add(draft);
    setDraft(EMPTY_DRAFT);
    setShowForm(false);
  }

  return (
    <div className="portfolio">
      <h1>Portfolio</h1>
      <p className="muted">
        What you have built, and where to find it. Link a phase if the project
        came from one — otherwise leave it blank.
      </p>

      {entries.length > 0 && (
        <div className="card tools-filters">
          <fieldset className="tools-filters__tones">
            <legend className="tools-filters__label">Status</legend>
            <div className="tools-filters__chips">
              <button
                type="button"
                className={"chip" + (filter === "all" ? " is-active" : "")}
                onClick={() => setFilter("all")}
              >
                All <span className="chip__count">{counts.all}</span>
              </button>
              {STATUSES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={"chip" + (filter === s.id ? " is-active" : "")}
                  onClick={() => setFilter(s.id)}
                >
                  {s.label} <span className="chip__count">{counts[s.id]}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {showForm ? (
        <form className="card entry-form" onSubmit={submit}>
          <h2>Add an entry</h2>

          <label className="entry-form__field">
            <span className="tools-filters__label">Title</span>
            <input
              className="tools-filters__input"
              type="text"
              value={draft.title}
              autoFocus
              placeholder="Home lab: pfSense + two VLANs"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>

          <label className="entry-form__field">
            <span className="tools-filters__label">Phase (optional)</span>
            <select
              className="tools-filters__select"
              value={draft.phaseId}
              onChange={(e) => setDraft({ ...draft, phaseId: e.target.value })}
            >
              <option value="">Not from a phase</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="entry-form__field">
            <span className="tools-filters__label">Repository (optional)</span>
            <input
              className="tools-filters__input"
              type="url"
              value={draft.repoUrl}
              placeholder="https://github.com/…"
              onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })}
            />
          </label>

          <label className="entry-form__field">
            <span className="tools-filters__label">Live link (optional)</span>
            <input
              className="tools-filters__input"
              type="url"
              value={draft.liveUrl}
              placeholder="https://…"
              onChange={(e) => setDraft({ ...draft, liveUrl: e.target.value })}
            />
          </label>

          <label className="entry-form__field">
            <span className="tools-filters__label">Status</span>
            <select
              className="tools-filters__select"
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value })}
            >
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="entry-form__field">
            <span className="tools-filters__label">Notes (optional)</span>
            <textarea
              className="tools-filters__input"
              rows={3}
              value={draft.notes}
              placeholder="What it demonstrates, what is left to do"
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
          </label>

          <div className="entry-form__actions">
            <button type="submit" className="btn" disabled={!draft.title.trim()}>
              Add entry
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setDraft(EMPTY_DRAFT);
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p>
          <button type="button" className="btn" onClick={() => setShowForm(true)}>
            Add an entry
          </button>
        </p>
      )}

      {entries.length === 0 ? (
        <EmptyState message="No portfolio entries yet. Add the first thing you built — even a half-finished lab counts, and marking it in progress is the honest status.">
          <button type="button" className="btn" onClick={() => setShowForm(true)}>
            Add an entry
          </button>
        </EmptyState>
      ) : shown.length === 0 ? (
        <EmptyState message="No entries with that status.">
          <button type="button" className="btn" onClick={() => setFilter("all")}>
            Show all
          </button>
        </EmptyState>
      ) : (
        <div className="entry-list">
          {shown.map((e) => (
            <article className="card entry" key={e.id}>
              <div className="entry__head">
                <h2 className="entry__title">{e.title}</h2>
                <span className={"badge badge--" + e.status}>
                  {STATUS_LABELS[e.status] || e.status}
                </span>
              </div>

              {e.notes && <p className="entry__notes muted">{e.notes}</p>}

              <div className="entry__meta">
                {e.phaseId && <span className="muted">{e.phaseId}</span>}
                {e.repoUrl && (
                  <a href={e.repoUrl} target="_blank" rel="noreferrer">
                    Repository
                  </a>
                )}
                {e.liveUrl && (
                  <a href={e.liveUrl} target="_blank" rel="noreferrer">
                    Live
                  </a>
                )}
              </div>

              <div className="entry__actions">
                <label className="entry__status">
                  <span className="tools-filters__label">Status</span>
                  <select
                    className="tools-filters__select"
                    value={e.status}
                    onChange={(ev) => setStatus(e.id, ev.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    if (window.confirm("Remove this entry? This cannot be undone.")) {
                      remove(e.id);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}