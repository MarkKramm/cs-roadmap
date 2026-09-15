import ProgressBar from "../components/ProgressBar.jsx";
import ChecklistItem from "../components/ChecklistItem.jsx";
import ToolCard from "../components/ToolCard.jsx";
import Lesson from "../components/Lesson.jsx";
import PhaseNav from "../components/PhaseNav.jsx";
import { ReadingBar, ResumePrompt, useReadingProgress } from "../components/ReadingPosition.jsx";
import { countDone } from "../hooks/useProgress.js";
import { useLesson } from "../hooks/useLesson.js";
import { renderInline } from "../lib/renderInline.jsx";

// Full detail for one phase, rendered from the generated JSON.
// The raw Markdown stays the source of truth; the link at the top opens it.
//
// Layout order is deliberate and unchanged from D-011: goal → lesson → skills →
// topics → checklist → tools → tasks → deliverable → free vs paid → exit
// criteria. What is new is the navigation at both ends and the reading-position
// machinery, which exist because a 9–14 phase track had no "next" anywhere.

const REPO = "https://github.com/MarkKramm/cs-roadmap/blob/main/";

export default function PhaseDetail({
  phase,
  done,
  onToggle,
  onBack,
  anchorRef,
  prev,
  next,
  index,
  phaseCount,
  onOpenPhase,
  onVisitSection,
  lastSection,
  size,
  onSizeChange,
  scale,
}) {
  const doneCount = countDone(done, phase.checklist);

  // The lesson is the substance of the phase; everything else is scaffolding
  // around it. It sits directly after the goal so the reader reaches the
  // teaching before the checklist.
  const { status: lessonStatus, lesson, message } = useLesson(phase);
  const headingCount = phase.lessonHeadingCount || 0;

  // Depth through the lesson region only — not the page, which is mostly
  // scaffolding below the lesson and would make the bar flatter than the truth.
  // Gated on the lesson being rendered, because there is no region to measure
  // until then and the hook would query for an element that does not exist yet.
  const fraction = useReadingProgress(lessonStatus === "ready");

  const toc = lesson ? lesson.toc || [] : [];
  const firstSectionId = toc.length ? toc[0].id : null;

  function handleActiveSection(id, text) {
    if (onVisitSection) onVisitSection(phase.id, id, text);
  }

  function jumpToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="phase-detail">
      <ReadingBar fraction={fraction} />

      <div className="phase-detail__topbar">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Back to dashboard
        </button>
        <PhaseNav
          variant="compact"
          prev={prev}
          next={next}
          index={index}
          count={phaseCount}
          onOpenPhase={onOpenPhase}
        />
      </div>

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

      {lessonStatus === "ready" && lastSection && (
        <ResumePrompt
          section={lastSection}
          firstSectionId={firstSectionId}
          onJump={jumpToSection}
        />
      )}

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
          toc={toc}
          anchorRef={anchorRef}
          phaseId={phase.id}
          onActiveSection={handleActiveSection}
          size={size}
          onSizeChange={onSizeChange}
          scale={scale}
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

      <section className="card" id="phase-checklist">
        <h2>Checklist</h2>
        <p className="muted phase-detail__hint">
          This is the phase's completion test. The sections you ticked inside the
          lesson are counted separately, above.
        </p>
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

      {phase.resources && phase.resources.length > 0 && (
        <section className="card">
          <h2>Free and cheap resources</h2>
          <ul>
            {phase.resources.map((r, i) => (
              <li key={i}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {renderInline(r.name, `resource-${i}`)}
                  </a>
                ) : (
                  renderInline(r.name, `resource-${i}`)
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

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

      <PhaseNav
        variant="full"
        prev={prev}
        next={next}
        index={index}
        count={phaseCount}
        onOpenPhase={onOpenPhase}
      />
    </div>
  );
}
