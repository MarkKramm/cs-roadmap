// One tool from a phase's tools table.
// See docs/DESIGN-SYSTEM.md → <ToolCard>.
//
// The cost → badge tone mapping lives in ../data/tools.js, because the tools
// library filters on the same mapping and two copies would drift.

import { costTone } from "../data/tools.js";

export default function ToolCard({ tool }) {
  return (
    <div className="tool-card">
      <div className="tool-card__head">
        <span className="tool-card__name">{tool.name}</span>
        <span className={"badge badge--" + costTone(tool.cost)}>
          {tool.cost}
        </span>
      </div>
      <p className="tool-card__purpose muted">{tool.purpose}</p>
      <p className="tool-card__task">
        <strong>Practice:</strong> {tool.task}
      </p>
      {tool.freeAlternative && (
        <p className="tool-card__alt muted">
          <strong>Free alternative:</strong> {tool.freeAlternative}
        </p>
      )}
      {tool.url && (
        <a
          className="tool-card__link"
          href={tool.url}
          target="_blank"
          rel="noreferrer"
        >
          Official site
        </a>
      )}
    </div>
  );
}