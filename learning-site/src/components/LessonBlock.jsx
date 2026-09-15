// Renders the lesson block AST produced by scripts/lesson-ast.mjs.
//
// One component per block type, so adding a type to the parser without handling
// it here fails loudly (the switch's default) rather than rendering nothing.
// Inline emphasis (bold, code, italic) goes through renderInline, which already
// exists for the structured sections.

import { useCallback, useEffect, useRef, useState } from "react";
import { renderInline } from "../lib/renderInline.jsx";

/**
 * Copy control for a fenced code block.
 *
 * The curriculum ships 464 code blocks, most of them commands a reader is meant
 * to run. Retyping them by hand is where a flag gets mistyped and a beginner
 * concludes the lesson is wrong, so copy is a correctness aid, not a
 * convenience.
 *
 * navigator.clipboard needs a secure context. localhost and the deployed HTTPS
 * site both qualify, but a reader who opens the built site over plain HTTP on
 * another machine does not, so the fallback keeps the button working there
 * rather than failing silently.
 */
function CopyButton({ text }) {
  const [state, setState] = useState("idle");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    const flash = (next) => {
      setState(next);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), 1600);
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Deprecated, but it is the only route when the page is not a secure
        // context, and it is still implemented everywhere that matters.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      flash("copied");
    } catch {
      // Denied permission or no clipboard at all. Say so instead of pretending.
      flash("failed");
    }
  }, [text]);

  const label = state === "copied" ? "Copied" : state === "failed" ? "Press Ctrl+C" : "Copy";

  return (
    <button
      type="button"
      className="lesson__copy"
      data-state={state}
      onClick={copy}
      aria-label={state === "copied" ? "Code copied to clipboard" : "Copy code to clipboard"}
    >
      {label}
    </button>
  );
}

function List({ list, keyPrefix }) {
  const Tag = list.ordered ? "ol" : "ul";
  return (
    <Tag>
      {list.items.map((item, i) => (
        <li key={keyPrefix + "-" + i}>
          {renderInline(item.text, keyPrefix + "-" + i)}
          {item.children.map((child, j) =>
            child.type === "list" ? (
              <List key={j} list={child} keyPrefix={keyPrefix + "-" + i + "-" + j} />
            ) : null
          )}
        </li>
      ))}
    </Tag>
  );
}

function Table({ head, rows, keyPrefix }) {
  // Wide tables get their own horizontal scroll container. The curriculum has
  // up to six columns, which cannot fit a phone screen without either scrolling
  // or unreadable wrapping.
  return (
    <div className="lesson__table-wrap">
      <table className="lesson__table">
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th key={i}>{renderInline(cell, keyPrefix + "-h" + i)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c}>{renderInline(cell, keyPrefix + "-" + r + "-" + c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LessonBlock({ block, index }) {
  const key = "b" + index;

  switch (block.type) {
    case "heading": {
      // The lesson's own h3/h4 sit inside a phase page that already has an h1
      // and h2, so the levels are shifted down to keep the outline valid.
      const Tag = block.level === 3 ? "h3" : block.level === 4 ? "h4" : "h5";
      return (
        <Tag id={block.id} className="lesson__heading">
          {renderInline(block.text, key)}
        </Tag>
      );
    }

    case "para":
      return <p>{renderInline(block.text, key)}</p>;

    case "code":
      return (
        <div className="lesson__code-wrap">
          <CopyButton text={block.text} />
          <pre className="lesson__code" data-lang={block.lang || undefined}>
            <code>{block.text}</code>
          </pre>
        </div>
      );

    case "quote":
      return (
        <blockquote className="lesson__quote">
          {block.paras.map((p, i) => (
            <p key={i}>{renderInline(p, key + "-" + i)}</p>
          ))}
        </blockquote>
      );

    case "table":
      return <Table head={block.head} rows={block.rows} keyPrefix={key} />;

    case "list":
      return <List list={block} keyPrefix={key} />;

    default:
      // A new block type in the parser with no renderer here would otherwise
      // vanish silently, which is exactly the failure this whole feature exists
      // to prevent. Fail visibly instead.
      return (
        <p className="lesson__unsupported">
          Unsupported block type: <code>{String(block.type)}</code>
        </p>
      );
  }
}