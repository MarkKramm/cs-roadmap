import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site reads generated JSON, never the Markdown directly.
// See docs/CONTENT-SCHEMA.md for the contract and docs/DECISIONS.md D-006.
//
// BASE PATH
// GitHub Pages serves this project from a subdirectory — the repository name —
// so https://markkramm.github.io/cs-roadmap/ rather than a domain root. Vite
// emits absolute asset URLs (/assets/...), which would 404 under a
// subdirectory, so the base has to match where the site is actually served.
//
// The Pages workflow sets VITE_BASE to /cs-roadmap/. Everywhere else the base
// falls back to "/", which is correct for local dev, `vite preview`, and
// Netlify (all of which serve from a domain root). Keeping this in one
// environment-driven value means the Pages build and the Netlify build cannot
// drift apart.
const base = process.env.VITE_BASE || "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
  },
});