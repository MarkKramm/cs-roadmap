// Flattened view of every tool in all three tracks, plus the cost → badge mapping.
//
// Tools live inside phases in the generated JSON, because that is how the
// Markdown tables are authored. The tools library needs them as one flat list
// with provenance attached, so each result can name its track and phase and
// link back to the source file.
//
// `costTone` lives here rather than inside ToolCard because two callers need
// it — the badge on the card and the cost filter in the library — and a
// second copy would drift the moment a cost string changed.
// See docs/CONTENT-SCHEMA.md → Tools table parsing.

import { tracks } from "./roadmaps.js";

// Maps a tools-table "Cost" cell to a badge tone.
//
// Order matters: "Freemium" contains "free", so freemium is checked first.
// A tool with any paid tier is not labelled free even when a free tier exists
// ("Free self-hosted/paid hosted" lands on paid), because the badge answers
// "might this cost me money?".
export function costTone(cost) {
  const c = String(cost || "").toLowerCase();
  if (c.includes("freemium")) return "freemium";
  if (c.includes("paid")) return "paid";
  return "free";
}

// Every tool in every phase of every track, with provenance.
export function allTools() {
  const out = [];
  for (const track of tracks) {
    for (const phase of track.phases) {
      for (const tool of phase.tools) {
        out.push({
          ...tool,
          trackId: track.id,
          trackLabel: track.label,
          phaseId: phase.id,
          phaseTitle: phase.title,
          sourcePath: phase.sourcePath,
        });
      }
    }
  }
  return out;
}

// The filter options offered by the tools library, derived from the data so
// they cannot fall out of step with the cost strings actually in use.
export const TONES = ["free", "freemium", "paid"];