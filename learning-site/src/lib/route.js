// Hash-based routing, dependency-free. See docs/DECISIONS.md → D-082.
//
// The hash encodes the reader's place as a small path:
//   #/<track>/<view>                 (e.g. #/it/dashboard)
//   #/<track>/phase/<phaseId>        (e.g. #/cyber/phase/02-phase-networking-and-linux)
//   #/<track>/shared/<docId>         (docId optional)
//
// Everything is pure so it can be tested without a browser. App.jsx owns the
// state and calls these two functions to move between the URL and the state.

const VALID_VIEWS = new Set([
  "dashboard", "schedule", "search", "shared", "your-work",
  "where-youve-been", "tools", "portfolio", "applications",
  "certifications", "exams", "phase",
]);

const TRACK_IDS = ["it", "cyber", "advance"];

export function defaultRoute() {
  return { trackId: "it", view: "dashboard", phaseId: null, sharedDocId: null };
}

// Parse a hash string (with or without the leading '#') into a route object.
// Unknown or malformed pieces fall back to defaults rather than throwing, so a
// stale or hand-typed link degrades to the dashboard instead of a blank page.
export function parseHash(hash) {
  const raw = (hash || "").replace(/^#/, "").trim();
  const parts = raw.split("/").filter(Boolean);
  const route = defaultRoute();
  if (parts.length === 0) return route;

  if (TRACK_IDS.includes(parts[0])) {
    route.trackId = parts[0];
    parts.shift();
  }
  if (parts.length === 0) return route;

  const view = parts[0];
  if (VALID_VIEWS.has(view)) route.view = view;
  else return route;

  if (view === "phase" && parts[1]) {
    route.phaseId = decodeURIComponent(parts[1]);
  }
  if (view === "shared" && parts[1]) {
    route.sharedDocId = decodeURIComponent(parts[1]);
  }
  return route;
}

// Build a hash string (with leading '#') from a route-ish state object.
export function buildHash(state) {
  const trackId = TRACK_IDS.includes(state.trackId) ? state.trackId : "it";
  const view = VALID_VIEWS.has(state.view) ? state.view : "dashboard";
  let path = `/${trackId}/${view}`;
  if (view === "phase" && state.phaseId) {
    path += `/${encodeURIComponent(state.phaseId)}`;
  } else if (view === "shared" && state.sharedDocId) {
    path += `/${encodeURIComponent(state.sharedDocId)}`;
  }
  return `#${path}`;
}