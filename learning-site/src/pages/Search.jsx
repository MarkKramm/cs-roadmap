// Search across every lesson.
//
// Results show the segment's heading and a snippet. The snippet is built from
// the lesson JSON, which useLesson fetches — the search index itself holds no
// prose (see scripts/search-index.mjs for the measurements that decided this).
//
// Because a result can live in another track, clicking one switches track,
// opens the phase, and scrolls to the heading anchor.

import { useEffect, useState } from "react";
import { tracks } from "../data/roadmaps.js";
import { useSearch } from "../hooks/useSearch.js";
import { useLesson } from "../hooks/useLesson.js";

const FENCE = "```";

/** Plain text of a block, without markup. Used only to find a snippet. */
function blockText(b) {
  switch (b.type) {
    case "para":
      return b.text || "";
    case "quote":
      return (b.paras || []).join(" ");
    case "code":
      return b.text || "";
    case "table":
      return (b.head || []).join(" ") + " " + (b.rows || []).map((r) => r.join(" ")).join(" ");
    case "list": {
      const out = [];
      const walk = (list) => {
        for (const it of list.items || []) {
          out.push(it.text);
          (it.children || []).forEach((c) => (c.type === "list" ? walk(c) : out.push(c.text)));
        }
      };
      walk(b);
      return out.join(" ");
    }
    default:
      return "";
  }
}

/**
 * Build a snippet showing where the query actually matched.
 *
 * A fixed "first 200 characters" snippet is useless when the match is 3,000
 * characters into a worked ticket, which is the common case here — the
 * curriculum's longest segments are its walkthroughs. So locate the match and
 * window around it.
 */
function snippetFor(blocks, headingText, query) {
  const words = String(query || "")
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9'’._+-]*/g) || [];
  if (!words.length) return "";

  // Concatenate the blocks belonging to this heading, then find the match.
  let inSection = false;
  const parts = [];
  for (const b of blocks) {
    if (b.type === "heading") {
      const t = (b.text || "").trim();
      if (b.level === 3 || b.level === 4) {
        if (inSection) break;
        inSection = t === headingText;
        continue;
      }
    }
    if (inSection) parts.push(blockText(b));
  }
  let text = parts.join(" ").replace(/\s+/g, " ").trim();
  if (!text) return "";

  const lower = text.toLowerCase();
  // Prefer the position of the rarest-looking term, i.e. the longest one.
  const needle = words.slice().sort((a, b) => b.length - a.length)[0];
  let at = lower.indexOf(needle);
  if (at < 0) {
    for (const w of words) {
      at = lower.indexOf(w);
      if (at >= 0) break;
    }
  }
  if (at < 0) at = 0;

  const start = Math.max(0, at - 90);
  const end = Math.min(text.length, start + 260);
  let out = text.slice(start, end).trim();
  if (start > 0) out = "… " + out;
  if (end < text.length) out = out + " …";
  return out;
}

/** One result row. Loads its own lesson to build the snippet. */
function Result({ hit, query, onOpen }) {
  // Find the phase record so useLesson can resolve lessonPath.
  const track = tracks.find((t) => t.id === hit.k) || null;
  const phase = track ? track.phases.find((p) => p.id === hit.p) || null : null;
  const { status, lesson } = useLesson(phase);
  const [text, setText] = useState("");

  useEffect(() => {
    if (status === "ready" && lesson && lesson.blocks) {
      setText(snippetFor(lesson.blocks, hit.h, query));
    }
  }, [status, lesson, hit.h, query]);

  return (
    <li className="search__result">
      <button type="button" className="search__link" onClick={() => onOpen(hit)}>
        <span className="search__where">
          {hit.k === "cyber" ? "Cyber" : "IT"} · {hit.pt}
        </span>
        <span className="search__heading">{hit.h}</span>
        {text && <span className="search__snippet">{text}</span>}
      </button>
    </li>
  );
}

export default function Search({ onOpenResult }) {
  const [input, setInput] = useState("");
  const { status, message, results, ignored, missing, run } = useSearch();

  // Debounce so a fast typist does not run the query on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => run(input), 120);
    return () => clearTimeout(id);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  const ready = input.trim().length > 0;

  return (
    <section className="search">
      <header className="search__header">
        <h1>Search</h1>
        <p className="muted">
          Every lesson in both tracks. Type a term, a command, or an error string.
        </p>
      </header>

      <div className="search__box">
        <input
          type="search"
          className="search__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="auditd, subnet mask, STAR, Get-ScheduledTask…"
          aria-label="Search lessons"
          autoComplete="off"
        />
        {input && (
          <button
            type="button"
            className="search__clear"
            onClick={() => setInput("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {status === "error" && (
        <p className="search__note">
          The search index could not be loaded. {message}
        </p>
      )}

      {status === "loading" && <p className="search__note">Loading the index…</p>}

      {/* A word too common to narrow the search is dropped from the query
          rather than killing it. Saying so is the difference between "your
          words were ignored" and a search box that looks broken. */}
      {ignored.length > 0 && ready && (
        <p className="search__note">
          Ignored {ignored.map((w) => `“${w}”`).join(", ")} — too common to narrow the
          results.
        </p>
      )}

      {missing.length > 0 && ready && results.length > 0 && (
        <p className="search__note">
          No match for {missing.map((w) => `“${w}”`).join(", ")} — showing results for the
          rest.
        </p>
      )}

      {status === "ready" && ready && results.length === 0 && (
        <p className="search__note">
          Nothing matched “{input.trim()}”.
          {missing.length > 0
            ? ` No lesson contains ${missing.map((w) => `“${w}”`).join(", ")}.`
            : " Try a shorter term, or a word you expect to see on the page rather than a whole sentence."}
        </p>
      )}

      {results.length > 0 && (
        <>
          <p className="search__count">
            {results.length} {results.length === 1 ? "result" : "results"}
            {results.length === 30 ? " (showing the first 30)" : ""}
          </p>
          <ul className="search__list">
            {results.map((hit, i) => (
              <Result
                key={hit.p + "-" + (hit.a || "") + "-" + i}
                hit={hit}
                query={input}
                onOpen={onOpenResult}
              />
            ))}
          </ul>
        </>
      )}

      {!ready && status !== "error" && (
        <div className="search__hint">
          <h2>What you can search for</h2>
          <ul>
            <li>
              <strong>Concept</strong> — <code>subnet mask</code>, <code>least privilege</code>
            </li>
            <li>
              <strong>Command or flag</strong> — <code>auditctl</code>, <code>Get-ScheduledTaskInfo</code>
            </li>
            <li>
              <strong>Error string</strong> — <code>PAGE_FAULT_IN_NONPAGED_AREA</code>
            </li>
            <li>
              <strong>Interview term</strong> — <code>STAR</code>, <code>SLA</code>
            </li>
          </ul>
          <p className="muted">
            Partial words work: typing <code>subn</code> finds <code>subnet</code>. Multiple
            words must all appear in the same section.
          </p>
        </div>
      )}
    </section>
  );
}