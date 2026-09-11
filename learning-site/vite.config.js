import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site reads generated JSON, never the Markdown directly.
// See docs/CONTENT-SCHEMA.md for the contract and docs/DECISIONS.md D-006.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});