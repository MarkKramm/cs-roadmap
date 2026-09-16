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
// State lives in the component rather than in storage, deliberately: a quiz is
// for the moment you take it, and persisting it would turn a self-check into a
// permanent record of how you did. Refreshing resets it, which is a feature.

import { useState } from "react";
import { renderInline } from "../lib/renderInline.jsx";
import { correctIndex, summarise } from "../lib/quiz.js";

const LETTERS = "ABCDEFGH";

export default function Quiz({ questions }) {
  // questionId -> chosen option index
  const [picked, setPicked] = useState({});

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
                      onClick={() => setPicked((p) => ({ ...p, [q.id]: oi }))}
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
            onClick={() => setPicked({})}
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
