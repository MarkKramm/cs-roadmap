import { useMemo, useState } from "react";
import ToolCard from "../components/ToolCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { tracks } from "../data/roadmaps.js";
import { allTools, costTone, TONES } from "../data/tools.js";

// Browse every tool across all three tracks.
//
// Read-only: the curriculum is the source of truth for what tools exist, so
// there is nothing to add or edit here. The filters exist to answer "what
// should I use for this, given I have no budget?" — which is why cost is a
// first-class filter rather than a badge you have to scan for.
// See docs/DESIGN-SYSTEM.md → <ToolCard>.

const TONE_LABELS = { free: "Free", freemium: "Freemium", paid: "Paid" };

export default function ToolsLibrary({ onOpenPhase }) {
  const [query, setQuery] = useState("");
  const [tone, setTone] = useState("all");
  const [trackId, setTrackId] = useState("all");

  // The data is static, so flatten once rather than on every keystroke.
  const tools = useMemo(() => allTools(), []);

  // Counts for the tone chips, computed from the unfiltered set so the chips
  // do not renumber themselves as you type a search.
  const toneCounts = useMemo(() => {
    const counts = { all: tools.length };
    for (const t of TONES) counts[t] = 0;
    for (const t of tools) counts[costTone(t.cost)]++;
    return counts;
  }, [tools]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (tone !== "all" && costTone(t.cost) !== tone) return false;
      if (trackId !== "all" && t.trackId !== trackId) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q)
      );
    });
  }, [tools, query, tone, trackId]);

  const filtered = tone !== "all" || trackId !== "all" || query.trim() !== "";

  function clearFilters() {
    setQuery("");
    setTone("all");
    setTrackId("all");
  }

  return (
    <div className="tools-library">
      <h1>Tools library</h1>
      <p className="muted">
        Every tool named in the curriculum, with the mini-task it belongs to.
        Filter by cost first if your budget is $0 — most of these are free.
      </p>

      <div className="card tools-filters">
        <div className="tools-filters__row">
          <label className="tools-filters__field">
            <span className="tools-filters__label">Search</span>
            <input
              className="tools-filters__input"
              type="search"
              value={query}
              placeholder="Name or purpose"
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <label className="tools-filters__field">
            <span className="tools-filters__label">Track</span>
            <select
              className="tools-filters__select"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
            >
              <option value="all">All tracks</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="tools-filters__tones">
          <legend className="tools-filters__label">Cost</legend>
          <div className="tools-filters__chips">
            <button
              type="button"
              className={"chip" + (tone === "all" ? " is-active" : "")}
              onClick={() => setTone("all")}
            >
              All <span className="chip__count">{toneCounts.all}</span>
            </button>
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                className={"chip" + (tone === t ? " is-active" : "")}
                onClick={() => setTone(t)}
              >
                {TONE_LABELS[t]}{" "}
                <span className="chip__count">{toneCounts[t]}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="muted tools-count">
        {results.length} of {tools.length} tools
        {filtered && (
          <>
            {" · "}
            <button type="button" className="link-btn" onClick={clearFilters}>
              clear filters
            </button>
          </>
        )}
      </p>

      {results.length === 0 ? (
        <EmptyState message="No tool matches those filters. Try a broader search, or clear the filters to see all of them.">
          <button type="button" className="btn" onClick={clearFilters}>
            Clear filters
          </button>
        </EmptyState>
      ) : (
        <div className="tool-grid">
          {results.map((tool) => (
            <div className="tool-result" key={tool.trackId + ":" + tool.phaseId + ":" + tool.name}>
              <button
                type="button"
                className="tool-result__from"
                onClick={() => onOpenPhase(tool.phaseId)}
                title={"Open " + tool.phaseTitle}
              >
                {tool.trackLabel} · {tool.phaseTitle.replace(/^Phase \d+ — /, "")}
              </button>
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}