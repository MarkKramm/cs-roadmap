// One tool from a phase's tools table.
// See docs/DESIGN-SYSTEM.md → <ToolCard>.

// Maps a tools-table "Cost" cell to a badge tone.
//
// Order matters: "Freemium" contains "free", so freemium is checked first.
// A tool with any paid tier is not labelled free even when a free tier exists
// ("Free self-hosted/paid hosted" lands on paid), because the badge answers
// "might this cost me money?".
function costTone(cost) {
  const c = String(cost || "").toLowerCase();
  if (c.includes("freemium")) return "freemium";
  if (c.includes("paid")) return "paid";
  return "free";
}

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