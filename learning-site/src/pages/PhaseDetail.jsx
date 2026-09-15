import ProgressBar from "../components/ProgressBar.jsx";
import ChecklistItem from "../components/ChecklistItem.jsx";
import ToolCard from "../components/ToolCard.jsx";
import Lesson from "../components/Lesson.jsx";
import { countDone } from "../hooks/useProgress.js";
import { useLesson } from "../hooks/useLesson.js";
import { renderInline } from "../lib/renderInline.jsx";

// Full detail for one phase, rendered from the generated JSON.
// The raw Markdown stays the source of truth; the link at the top opens it.

const REPO = "https://github.com/MarkKramm/cs-roadmap/blob/main/";

export default function PhaseDetail({ phase, done, onToggle, onBack }) {
  const doneCount = countDone(done, phase.checklist);

  // The lesson is the substance of the phase; everything else is scaffolding
  // around it. It sits directly after the goal so the reader reaches the
  // teaching before the checklist.
  const { status: lessonStatus, lesson, message } = useLesson(phase);
  const headingCount = phase.lessonHeadingCount || 0;

  return (
    <div className="phase-detail">
      <button type="button" className="btn btn--ghost" onClick={onBack}>
        ← Back
      </button>

      <h1>{phase.title}</h1>
      <p className="muted">
        {phase.duration} · {phase.checklist.length} checklist items
        {headingCount > 0 && " · " + headingCount + " lesson sections"} ·{" "}
        <a href={REPO + phase.sourcePath} target="_blank" rel="noreferrer">
          read the source
        </a>
      </p>

      <ProgressBar done={doneCount} total={phase.checklist.length} />

      <section className="card">
        <h2>Goal</h2>
        <p>{phase.goal}</p>
      </section>

      {lessonStatus === "loading" && (
        <section className="card">
          <h2>Lesson</h2>
          <p className="muted">Loading the lesson…</p>
        </section>
      )}

      {lessonStatus === "error" && (
        <section className="card">
          <h2>Lesson</h2>
          <p className="muted">
            The lesson could not be loaded ({message}). The source file is
            still readable in the repository.
          </p>
        </section>
      )}

      {lessonStatus === "ready" && (
        <Lesson
          title={lesson.title || phase.lessonTitle || "Lesson"}
          blocks={lesson.blocks || []}
          toc={lesson.toc || []}
        />
      )}

      <section className="card">
        <h2>Skills you'll gain</h2>
        <ul>
          {phase.skills.map((s, i) => (
            <li key={i}>{renderInline(s, `skill-${i}`)}</li>
          ))}
        </ul>
      </section>

      {phase.topics.map((t) => (
        <section className="card" key={t.heading}>
          <h2>{t.heading}</h2>
          <ul>
            {t.items.map((item, i) => (
              <li key={i}>{renderInline(item, `topic-${i}`)}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="card">
        <h2>Checklist</h2>
        {phase.checklist.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            checked={Boolean(done[item.id])}
            onToggle={onToggle}
          />
        ))}
      </section>

      <section className="card">
        <h2>Tools for this phase</h2>
        <div className="tool-grid">
          {phase.tools.map((tool, i) => (
            <ToolCard key={i} tool={tool} />
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Hands-on practice tasks</h2>
        <ol>
          {phase.tasks.map((t, i) => (
            <li key={i}>{renderInline(t, `task-${i}`)}</li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2>Deliverable</h2>
        <ul>
          {phase.deliverableItems.map((d, i) => (
            <li key={i}>{renderInline(d, `deliverable-${i}`)}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Free vs Paid</h2>
        <h3>What's free and enough</h3>
        <p>{renderInline(phase.freeVsPaid.freeEnough, "freePaid-free")}</p>
        <h3>What's paid and why you'd upgrade</h3>
        <p>{renderInline(phase.freeVsPaid.paidUpgrade, "freePaid-paid")}</p>
        <h3>When it's worth paying</h3>
        <p>{renderInline(phase.freeVsPaid.whenWorthPaying, "freePaid-when")}</p>
      </section>

      <section className="card">
        <h2>You're ready to move on when...</h2>
        <p>{renderInline(phase.exitCriteria, "exit-criteria")}</p>
      </section>
    </div>
  );
}