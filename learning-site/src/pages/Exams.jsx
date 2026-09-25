import { useMemo, useState } from "react";
import { renderInline } from "../lib/renderInline.jsx";
import { findPhase } from "../data/roadmaps.js";

// The content build may not emit this optional artifact until exam papers are
// added to the curriculum pipeline. Vite includes it when present; otherwise the
// view renders the explicit empty state below.
const generatedExamModules = import.meta.glob("../data/generated/exams.json", {
  eager: true,
  import: "default",
});
const examsData = generatedExamModules["../data/generated/exams.json"] || { papers: [] };

const KIND_LABELS = {
  "curriculum-practice": "Curriculum practice · diagnostic only",
  "certification-practice": "Unofficial certification practice",
};

function paperLabel(paper) {
  return KIND_LABELS[paper.kind] || "Practice questions";
}

function questionKey(question, index) {
  return question.id || `question-${index + 1}`;
}

export default function Exams({ onOpenPhase = null }) {
  return <ExamsView papers={examsData?.papers} onOpenPhase={onOpenPhase} />;
}

export function ExamsView({ papers: inputPapers, initialPaperId = null, onOpenPhase = null }) {
  const papers = Array.isArray(inputPapers) ? inputPapers : [];
  const curriculumPapers = useMemo(
    () => papers.filter((paper) => paper.kind === "curriculum-practice"),
    [papers]
  );
  const certificationPapers = useMemo(
    () => papers.filter((paper) => paper.kind === "certification-practice"),
    [papers]
  );
  const [selectedId, setSelectedId] = useState(initialPaperId);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [announcement, setAnnouncement] = useState("");

  const selectedPaper = papers.find((paper) => paper.id === selectedId) || null;
  const questions = Array.isArray(selectedPaper?.questions) ? selectedPaper.questions : [];
  const question = questions[questionIndex] || null;
  const currentKey = question ? questionKey(question, questionIndex) : null;
  const chosen = currentKey ? answers[currentKey] : undefined;

  function selectPaper(paper) {
    setSelectedId(paper.id);
    setQuestionIndex(0);
    setAnswers({});
    setAnnouncement(`${paper.title} opened. Question 1.`);
  }

  function answerQuestion(optionIndex) {
    if (!currentKey || chosen !== undefined) return;
    const option = question.options?.[optionIndex];
    if (!option) return;
    setAnswers((previous) => ({ ...previous, [currentKey]: optionIndex }));
    setAnnouncement("Answer recorded. Explanation shown.");
  }

  function moveQuestion(nextIndex) {
    if (!questions.length || nextIndex < 0 || nextIndex >= questions.length) return;
    setQuestionIndex(nextIndex);
    setAnnouncement(`Question ${nextIndex + 1} opened.`);
  }

  function restartPaper() {
    setQuestionIndex(0);
    setAnswers({});
    setAnnouncement("Paper restarted. Question 1.");
  }

  function returnToList() {
    setSelectedId(null);
    setQuestionIndex(0);
    setAnswers({});
    setAnnouncement("Practice paper list.");
  }

  if (!papers.length) {
    return (
      <section className="exams">
        <header className="exams__header">
          <h1>Practice exams</h1>
          <p className="muted">Practice questions for curriculum study and certification review.</p>
        </header>
        <div className="empty-state" role="status">
          No practice papers were generated. Run <code>npm run build:content</code> and try again.
        </div>
      </section>
    );
  }

  if (selectedPaper) {
    return (
      <section className="exams">
        <p className="exams__back-row">
          <button type="button" className="link-btn" onClick={returnToList}>
            ← All practice papers
          </button>
        </p>
        <header className="exams__header">
          <p className="exams__kind">{paperLabel(selectedPaper)}</p>
          <h1>{selectedPaper.title}</h1>
          <p className="muted">{selectedPaper.scope}</p>
          {selectedPaper.code && <p className="exams__code">Exam code: {selectedPaper.code}</p>}
        </header>

        {!questions.length ? (
          <div className="empty-state" role="status">
            This paper has no questions in the generated data yet.
          </div>
        ) : (
          <article className="card exams__question" aria-labelledby="exams-question-title">
            <div className="exams__question-meta">
              <span className="exams__position" aria-label={`Question ${questionIndex + 1}`}>
                Question {questionIndex + 1}
              </span>
              {question.domain && <span className="exams__domain">{question.domain}</span>}
            </div>
            <h2 id="exams-question-title" className="exams__prompt">
              {renderInline(question.question || "", "exam-question")}
            </h2>
            <div className="exams__options" role="group" aria-label="Answer choices">
              {(question.options || []).map((option, index) => {
                const isChosen = chosen === index;
                const revealed = chosen !== undefined;
                const isCorrect = option.correct === true;
                const className = [
                  "exams__option",
                  isChosen ? "is-chosen" : "",
                  revealed && isCorrect ? "is-correct" : "",
                  revealed && isChosen && !isCorrect ? "is-incorrect" : "",
                ].filter(Boolean).join(" ");
                return (
                  <button
                    type="button"
                    className={className}
                    key={`${questionKey(question, questionIndex)}-option-${index}`}
                    aria-pressed={isChosen}
                    disabled={revealed}
                    onClick={() => answerQuestion(index)}
                  >
                    <span className="exams__option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                    <span>{renderInline(option.text || "", "exam-option")}</span>
                    {revealed && isCorrect && <span className="exams__answer-label">Correct answer</span>}
                    {revealed && isChosen && !isCorrect && <span className="exams__answer-label">Your choice</span>}
                  </button>
                );
              })}
            </div>

            {chosen !== undefined && (
              <section className="exams__explanation" aria-labelledby="exams-explanation-title">
                <h3 id="exams-explanation-title">Explanation</h3>
                <p>{renderInline(question.explanation || "", "exam-explanation")}</p>
              </section>
            )}

            {Array.isArray(question.phases) && question.phases.length > 0 && (
              <div className="exams__curriculum-links">
                <h3>Related curriculum</h3>
                <ul>
                  {question.phases.map((phaseId, index) => {
                    const match = findPhase(phaseId);
                    return (
                      <li key={`${phaseId}-${index}`}>
                        {match && onOpenPhase ? (
                          <button type="button" className="link-btn" onClick={() => onOpenPhase(phaseId)}>
                            {match.phase.title}
                          </button>
                        ) : (
                          <code>{phaseId}</code>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="exams__controls">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => moveQuestion(questionIndex - 1)}
                disabled={questionIndex === 0}
              >
                Previous question
              </button>
              <button type="button" className="btn btn--ghost" onClick={restartPaper}>
                Restart paper
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => moveQuestion(questionIndex + 1)}
                disabled={questionIndex === questions.length - 1}
              >
                Next question
              </button>
            </div>
          </article>
        )}
        <p className="exams__sr-status" aria-live="polite" aria-atomic="true">{announcement}</p>
      </section>
    );
  }

  return (
    <section className="exams">
      <header className="exams__header">
        <h1>Practice exams</h1>
        <p className="muted">
          Work through one question at a time. Answers and explanations stay in this session only;
          no scores or readiness ratings are recorded.
        </p>
      </header>

      {curriculumPapers.length > 0 && (
        <section className="exams__section" aria-labelledby="exams-curriculum-heading">
          <h2 id="exams-curriculum-heading">Curriculum practice</h2>
          <p className="muted">These are diagnostic study prompts, not readiness tests or pass/fail assessments.</p>
          <div className="exams__list">
            {curriculumPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} onSelect={selectPaper} />
            ))}
          </div>
        </section>
      )}

      {certificationPapers.length > 0 && (
        <section className="exams__section" aria-labelledby="exams-certification-heading">
          <h2 id="exams-certification-heading">Certification practice</h2>
          <p className="muted">Unofficial practice questions for study. They are not vendor exam questions and do not predict a real exam result.</p>
          <div className="exams__list">
            {certificationPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} onSelect={selectPaper} />
            ))}
          </div>
        </section>
      )}

      {!curriculumPapers.length && !certificationPapers.length && (
        <div className="empty-state" role="status">No practice papers are available yet.</div>
      )}
      <p className="exams__sr-status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </section>
  );
}

function PaperCard({ paper, onSelect }) {
  const questionCount = Array.isArray(paper.questions) ? paper.questions.length : 0;
  return (
    <article className="card exams__paper">
      <div>
        <p className="exams__kind">{paperLabel(paper)}</p>
        <h3>{paper.title}</h3>
        {paper.code && <p className="exams__code">Exam code: {paper.code}</p>}
        <p className="muted">{paper.scope}</p>
        <p className="exams__count">{questionCount} {questionCount === 1 ? "question" : "questions"}</p>
      </div>
      <button type="button" className="btn" onClick={() => onSelect(paper)}>
        Open paper
      </button>
    </article>
  );
}
