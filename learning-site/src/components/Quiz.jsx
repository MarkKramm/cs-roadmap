// Multiple-choice quiz for a phase.
//
// WHY THIS IS NOT A SCORED TEST
// The reader is a beginner studying alone, and the surrounding site is
// deliberately free of counts, percentages and completion language — the
// "Your work" view carries no `N of M` at all (see docs/DECISIONS.md → the
// no-shame rule). A quiz that announces "3 out of 10" at the end would be the
// one place in the product that grades the reader.
//
// So this reports what happened without judging it: each question says whether
// the chosen answer is right, the explanation is always shown, and the summary
// names the questions to revisit rather than a score. "Two to look at again" is
// actionable; "80%" is not.
//
// WHY THE EXPLANATION SHOWS EVEN WHEN CORRECT
// A right answer for the wrong reason is the most common way a beginner
// mis-learns, and it is invisible to any score. The explanation names the
// misconception each distractor represents, so it is worth reading either way.
//
// WHY ANSWERS ARE KEYED BY QUESTION ID
// Never by position in the list. Inserting a question above another must not
// move one reader's answer onto a different question — the same reasoning as
// TaskList's answers and the authored task ids (D-019). The id comes from the
// authored `<!-- id: phase-qNN -->` comment in the Markdown.
//
// WHERE THE ANSWERS LIVE, AND WHY THAT CHANGED
//
// This component originally held its answers in `useState` and the comment here
// said that was deliberate: "a quiz is for the moment you take it, and persisting
// it would turn a self-check into a permanent record of how you did."
//
// That reasoning was sound and the outcome was still wrong. Answering a set and
// navigating away discarded the only evidence the reader had produced about what
// they did not yet understand -- and the most useful thing the curriculum says
// about a missed question is the `**Why:**` line, which names the misconception
// the distractor represents. Throwing that away on every navigation left the quiz
// as something you perform rather than something you learn from.
//
// SO THE CONFLICT IS RESOLVED BY NARROWING WHAT IS STORED, NOT BY DROPPING THE
// OBJECTION. Persisted is the minimum needed to build a revisit list: **which
// option was picked, keyed by question id**. Not persisted anywhere: whether it
// was right, how many were right, how many were answered, any ratio, or any
// history of a phase getting better or worse. The review page therefore shows
// *what to look at again*, which is a statement about a pile of paper, and never
// *how you did*, which would be the report card this file was right to refuse.
// See docs/DECISIONS.md -> D-044.
//
// "Start over" still clears the set, and still exists for the reader who wants a
// clean run at it.

import { renderInline } from "../lib/renderInline.jsx";
import { correctIndex, summarise } from "../lib/quiz.js";
import { useQuizAnswers } from "../hooks/useQuizAnswers.js";

const LETTERS = "ABCDEFGH";

export default function Quiz({ questions }) {
  const ids = (questions || []).map((q) => q.id);
  const { picked, choose, reset } = useQuizAnswers(ids);

  if (!questions || !questions.length) {
    return <p className="muted">This phase has no quiz yet.</p>;
  }

  // All the scoring lives in lib/quiz.js, where it is tested under plain Node.
  const summary = summarise(questions, picked);
  const answeredTotal = summary.answered ?? questions.length;

  return (
    <div className="quiz">
      {questions.map((q, qi) => {
        const choice = picked[q.id];
        const answerIdx = correctIndex(q);
        const isAnswered = choice !== undefined;
        const isRight = isAnswered && choice === answerIdx;

        return (
          <div
            key={q.id}
            className={
              "quiz__q" +
              (isAnswered ? (isRight ? " quiz__q--right" : " quiz__q--wrong") : "")
            }
          >
            <p className="quiz__prompt">
              <span className="quiz__num" aria-hidden="true">
                {qi + 1}
              </span>
              {renderInline(q.question, `quiz-q-${qi}`)}
              {q.energy && <span className="quiz__energy">{q.energy}</span>}
            </p>

            <ul className="quiz__options">
              {q.options.map((opt, oi) => {
                const chosen = choice === oi;
                // Only reveal which option is correct once this question has
                // been answered, so the quiz is a question rather than a
                // reading exercise.
                const showAsCorrect = isAnswered && oi === answerIdx;
                const showAsWrongPick = isAnswered && chosen && oi !== answerIdx;

                return (
                  <li key={oi}>
                    <button
                      type="button"
                      className={
                        "quiz__opt" +
                        (showAsCorrect ? " quiz__opt--correct" : "") +
                        (showAsWrongPick ? " quiz__opt--wrong" : "") +
                        (chosen ? " quiz__opt--chosen" : "")
                      }
                      aria-pressed={chosen}
                      disabled={isAnswered}
                      onClick={() => choose(q.id, oi)}
                    >
                      <span className="quiz__letter" aria-hidden="true">
                        {LETTERS[oi]}
                      </span>
                      <span>{renderInline(opt.text, `quiz-o-${qi}-${oi}`)}</span>
                      {showAsCorrect && (
                        <span className="quiz__badge" aria-label="correct answer">
                          Correct
                        </span>
                      )}
                      {showAsWrongPick && (
                        <span className="quiz__badge quiz__badge--wrong" aria-label="your answer">
                          Your answer
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {isAnswered && q.explanation && (
              <p className="quiz__why">
                <strong>{isRight ? "Why that's right:" : "Why:"}</strong>{" "}
                {renderInline(q.explanation, `quiz-why-${qi}`)}
              </p>
            )}
          </div>
        );
      })}

      <div className="quiz__foot">
        {summary.kind === "partial" || summary.kind === "empty" ? (
          <p className="muted">
            {summary.text ||
              "Pick an answer to see the explanation. Nothing is recorded."}
          </p>
        ) : (
          <p className="quiz__summary">{summary.text}</p>
        )}
        {answeredTotal > 0 && (
          <button
            type="button"
            className="chip chip--tiny"
            onClick={reset}
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
