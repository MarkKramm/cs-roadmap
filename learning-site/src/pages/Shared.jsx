// The shared strategy documents: the material that sits beside all three tracks
// rather than inside either one.
//
// WHY THIS VIEW EXISTS
// `career-roadmaps/shared/` has always been part of the curriculum and has never
// been reachable from the site. `build-content.mjs` walks for `*-phase-*.md`,
// and these are not phase files — so a reader on a 34–112 week plan, which is
// precisely the reader the anti-burnout rules were written for, had no path to
// them from the app. Three documents, no new concepts, one view.
//
// WHY IT DOES NOT USE <Lesson>
// The Lesson component carries a table of contents with scroll-spy, per-section
// done controls and a reading-position bar, all of which depend on
// `useLessonProgress` — state keyed by phase id and persisted. A shared document
// is reference material with no phase, no progress and nothing to tick, so
// borrowing that machinery would mean inventing a fake phase id to hang it on.
// The blocks are rendered directly instead, which is why there is a local TOC
// here rather than a reused one.
//
// The resource list is a different kind of document from the other two: it is a
// catalogue of `Name — https://url` lines, and `renderInline` deliberately does
// not autolink. Rendering it as prose would produce 42 unclickable URLs, so it
// is rendered from structured data as real anchors.

import { useEffect, useRef, useState } from "react";
import shared from "../data/generated/shared.json";
import LessonBlock from "../components/LessonBlock.jsx";

// Standalone documents are authored `# Title`, `## Section` — level 1, not the
// level 3 a lesson uses inside its `## Lesson` wrapper. The page already has one
// h1, so the document's title maps to h2 and its sections to h3/h4. See
// scripts/lesson-ast.mjs → the `headingBase` parameter.
const HEADING_BASE = 1;
const HEADING_TAG = 2;

function Resources({ doc }) {
  return (
    <>
      {doc.groups.map((group) => (
        <section className="shared__group" key={group.heading}>
          <h3>{group.heading}</h3>
          <ul className="shared__resources">
            {group.resources.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function Document({ doc }) {
  return (
    <>
      {doc.toc && doc.toc.length > 1 && (
        <nav className="lesson__toc" aria-label="On this page">
          <div className="lesson__toc-title">On this page</div>
          <ol>
            {doc.toc.map((entry) => (
              <li
                key={entry.id}
                className={
                  "lesson__toc-item" + (entry.level > HEADING_BASE ? " is-sub" : "")
                }
              >
                <a href={"#" + entry.id}>{entry.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="lesson__body">
        {(doc.blocks || []).map((block, i) => (
          <LessonBlock
            key={doc.id + "-b" + i}
            block={block}
            index={i}
            headingBase={HEADING_BASE}
            headingTag={HEADING_TAG}
          />
        ))}
      </div>
    </>
  );
}

// `initialId` picks which document opens, and `onSelect` reports the reader's own
// choice back up so the parent can remember it. Both exist because a page whose
// entire content sits behind a click is invisible to server rendering, so the
// resources document (the one whose value depends on its 42 links being real
// anchors) could not be covered by the smoke test at all.
//
// The split of ownership is deliberate. `initialId` is the *seed* — read when the
// view mounts and never again, because a prop that re-asserted itself would fight
// the reader's clicks. `onSelect` is the *echo* — it goes up so the parent can
// hand the same id back if the view remounts, which it does on every navigation.
// Without the echo, following a link to the resource list, leaving, and coming
// back through the sidebar would silently reopen the first document instead.
export default function Shared({ initialId = null, onSelect = null }) {
  const docs = shared.docs || [];
  const [activeId, setActiveId] = useState(() => {
    if (initialId && docs.some((d) => d.id === initialId)) return initialId;
    return docs.length ? docs[0].id : null;
  });
  const doc = docs.find((d) => d.id === activeId) || docs[0] || null;

  // Switching document is a navigation, and landing halfway down the third
  // document after picking the first is disorienting. The App resets scroll on a
  // view change; this is the same reset one level down.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeId]);

  // Keep the parent's copy in step. Guarded on a real change so mounting does
  // not immediately write the seed back as if the reader had chosen it.
  const lastReported = useRef(initialId);
  useEffect(() => {
    if (activeId && activeId !== lastReported.current) {
      lastReported.current = activeId;
      if (onSelect) onSelect(activeId);
    }
  }, [activeId, onSelect]);

  if (!doc) {
    return (
      <div className="empty-state">
        No shared documents were generated. Run <code>npm run build:content</code>.
      </div>
    );
  }

  return (
    <>
      <header className="shared__header">
        <h1>Shared</h1>
        <p className="muted">
          The strategy documents that sit beside all three tracks. Not lessons — the
          rules that make a long plan survivable, every free resource the tracks
          point at, and a weekly template to copy.
        </p>
      </header>

      <nav className="shared__picker" aria-label="Shared documents">
        {docs.map((d) => (
          <button
            key={d.id}
            type="button"
            className={"chip" + (d.id === doc.id ? " is-active" : "")}
            aria-pressed={d.id === doc.id}
            onClick={() => setActiveId(d.id)}
          >
            {d.title}
          </button>
        ))}
      </nav>

      <article className="card shared__doc">
        <h2>{doc.title}</h2>
        <p className="muted shared__blurb">{doc.blurb}</p>

        {doc.kind === "resources" ? (
          <Resources doc={doc} />
        ) : (
          <Document doc={doc} />
        )}

        <p className="muted shared__source">
          Source: <code>{doc.sourcePath}</code>
        </p>
      </article>
    </>
  );
}