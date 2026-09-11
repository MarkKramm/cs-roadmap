// M1 Step 1 shell. Navigation, phase rendering, and the dashboard land in
// Steps 3 and 4. Nothing here reads the Markdown yet — see docs/CONTENT-SCHEMA.md.

const TRACKS = [
  {
    id: "it",
    label: "IT Roadmap",
    note: "First goal — remote entry-level IT in 3–6 months.",
  },
  {
    id: "cyber",
    label: "Cybersecurity Roadmap",
    note: "Second goal — entry-level cyber in 6–18 months.",
  },
];

export default function App() {
  return (
    <div className="app-shell">
      <nav className="sidebar">
        <div className="sidebar__title">CS Roadmap</div>
        <div className="sidebar__nav">
          {TRACKS.map((track) => (
            <span key={track.id} className="muted">
              {track.label}
            </span>
          ))}
        </div>
      </nav>

      <main className="content">
        <h1>Personal learning site</h1>
        <p className="muted">
          Scaffold is running. The curriculum renders here once the content
          pipeline exists.
        </p>

        <div className="card">
          <h2>What should I do today?</h2>
          <p className="muted">
            The dashboard answers this question. It lands in Step 4.
          </p>
        </div>

        <div className="empty-state">
          No generated content yet. <code>scripts/build-content.mjs</code> is
          added in Step 2 and will emit JSON from{" "}
          <code>career-roadmaps/</code>.
        </div>
      </main>
    </div>
  );
}