// The lesson body: a table of contents plus the rendered blocks.
//
// A lesson runs 5,000–24,000 words, so the TOC is not decoration — without it
// the page is unnavigable. The active section is tracked with IntersectionObserver
// so the reader always knows where they are, and clicking an entry scrolls to it.

import { useEffect, useRef, useState } from "react";
import LessonBlock from "./LessonBlock.jsx";
import { renderInline } from "../lib/renderInline.jsx";

export default function Lesson({ title, blocks, toc, anchorRef }) {
  const [activeId, setActiveId] = useState(toc.length ? toc[0].id : null);
  const bodyRef = useRef(null);

  // A search result opens a phase with a specific heading in mind. Scroll there
  // once the blocks have rendered, then clear the ref so a later navigation does
  // not jump again. Uses an instant scroll because the reader is arriving, not
  // moving within a page they are already reading.
  useEffect(() => {
    if (!anchorRef || !anchorRef.current) return;
    const id = anchorRef.current;
    anchorRef.current = "";
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: "start" });
      setActiveId(id);
    }
  }, [anchorRef, blocks]);

  // Track which heading is currently on screen. Observing the headings rather
  // than scroll offsets keeps this correct when images or tables change height.
  useEffect(() => {
    if (!toc.length) return;
    const nodes = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      // A band near the top of the viewport: a heading counts as "current"
      // once it reaches the upper third, which matches where the eye is.
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [toc, blocks]);

  function jump(id) {
    const el = document.getElementById(id);
    if (!el) return;
    // scroll-margin-top on the heading keeps it clear of the sticky topbar.
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }

  if (!blocks || !blocks.length) {
    return (
      <section className="card">
        <h2>{title || "Lesson"}</h2>
        <p className="muted">
          This phase has no lesson body. The checklist and practice tasks below
          are the whole of it.
        </p>
      </section>
    );
  }

  return (
    <section className="lesson" aria-labelledby="lesson-heading">
      <h2 id="lesson-heading">{title || "Lesson"}</h2>

      {toc.length > 0 && (
        <nav className="lesson__toc" aria-label="Lesson contents">
          <div className="lesson__toc-title">On this page</div>
          <ol>
            {toc.map((t) => (
              <li
                key={t.id}
                className={
                  "lesson__toc-item" +
                  (t.level === 4 ? " is-sub" : "") +
                  (t.id === activeId ? " is-active" : "")
                }
              >
                <button type="button" onClick={() => jump(t.id)}>
                  {renderInline(t.text, "toc-" + t.id)}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="lesson__body" ref={bodyRef}>
        {blocks.map((b, i) => (
          <LessonBlock key={i} block={b} index={i} />
        ))}
      </div>
    </section>
  );
}