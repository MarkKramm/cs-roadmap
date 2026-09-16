// Text-integrity linter. Scans every tracked text file for the damage this
// repository has actually suffered: CRLF, UTF-8 BOM, U+FFFD replacement
// characters, invalid UTF-8, and ASCII "?" standing in for a typographic
// character. It also checks Markdown heading spacing — a heading with no
// blank line before it renders as body text, which has silently swallowed
// whole sections in this repository. Zero dependencies. Exits non-zero on
// any error.
//
// Scope is deliberately narrow. Structural validation of phase files
// (mandatory sections, task IDs, tools-table columns) belongs to the build
// pipeline — see scripts/build-content.mjs.
//
// Read-only by design: it reports, it does not rewrite. Repair procedure is
// in docs/TROUBLESHOOTING.md.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Directories never worth scanning. "generated" is build output.
const SKIP_DIRS = new Set([".git", "node_modules", "dist", ".vite", "generated"]);

const CHECK_EXT = new Set([
  ".md", ".mdx", ".txt", ".json", ".jsonc",
  ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx",
  ".css", ".scss", ".html", ".htm", ".svg",
  ".yml", ".yaml", ".toml", ".ini", ".cfg", ".sh",
]);

// Extensionless files that still matter.
const CHECK_NAMES = new Set([".gitattributes", ".gitignore", ".editorconfig", "LICENSE"]);

// CRLF is correct for these; LF everywhere else.
const CRLF_EXT = new Set([".bat", ".cmd", ".ps1", ".psm1", ".psd1"]);

// Files where "?" is an operator, not prose. Only these get the ? rules.
const PROSE_EXT = new Set([".md", ".mdx", ".txt"]);

// Markdown files where heading structure matters. Only these get the
// blank-line-before-heading rule.
const MARKDOWN_EXT = new Set([".md", ".mdx"]);

// Each pattern is unambiguous: no legitimate English sentence produces it.
const QUESTION_RULES = [
  { re: /\d\?\d/, what: "digit ? digit — expected an en-dash (–)" },
  { re: / \? /, what: "space ? space — expected an em-dash (—)" },
  { re: /\?[A-Za-z]/, what: "? immediately followed by a letter — expected an opening curly quote (“)" },
  { re: /[,.!]\?\s/, what: ", . or ! before ? — expected a closing curly quote (”)" },
];

const errors = [];

function err(file, line, msg) {
  errors.push({ file, line, msg });
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function shouldCheck(file) {
  const name = basename(file);
  if (CHECK_NAMES.has(name)) return true;
  return CHECK_EXT.has(extname(file).toLowerCase());
}

function lineAt(bytes, offset) {
  let n = 1;
  for (let i = 0; i < offset && i < bytes.length; i++) {
    if (bytes[i] === 10) n++;
  }
  return n;
}

// Byte-level damage. Runs before any decoding, because these are the failures
// that survive a decode/re-encode cycle unnoticed.
function checkBytes(file, bytes) {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
  ) {
    err(file, 1, "UTF-8 BOM present — required encoding is UTF-8 without BOM");
  }

  const ext = extname(file).toLowerCase();
  const crlfOk = CRLF_EXT.has(ext);
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] === 13) {
      const isCrlf = bytes[i + 1] === 10;
      if (!crlfOk && isCrlf) {
        err(file, lineAt(bytes, i), "CRLF line ending — expected LF");
      } else if (!isCrlf) {
        err(file, lineAt(bytes, i), "bare CR byte — expected LF");
      }
    }
  }

  for (let i = 0; i + 2 < bytes.length; i++) {
    if (bytes[i] === 0xef && bytes[i + 1] === 0xbf && bytes[i + 2] === 0xbd) {
      err(file, lineAt(bytes, i), "U+FFFD replacement character — a character was lost");
    }
  }

  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    err(file, 1, "not valid UTF-8");
    return null;
  }

  return new TextDecoder("utf-8").decode(bytes);
}

// Blank out code so prose rules only see prose. Line numbers are preserved.
//
// Bare URLs are blanked along with code, and that is a fix rather than a
// convenience. The `?` rules exist to catch a straight quote used as an opening
// quote, and their comment claimed "no legitimate English sentence produces
// it" — but a URL query string does: `?code=IS-100.c` is a delimiter, not a
// quote. The first phase to cite a URL with a query parameter (advance 03, three
// FEMA course links) made the rule fire three times on correct content. A guard
// that fails on a real URL is a guard a writer learns to route around, so the
// rule is narrowed rather than the URLs being rewritten to avoid it.
//
// Scope: `proseOnly` feeds `checkProse` only. `checkHeadingSpacing` reads the
// raw lines, so blanking here cannot hide a glued heading.
function proseOnly(text) {
  const lines = text.split("\n");
  let inFence = false;
  return lines.map((line) => {
    const t = line.trimStart();
    if (t.startsWith("```") || t.startsWith("~~~")) {
      inFence = !inFence;
      return "";
    }
    if (inFence) return "";
    return line
      .replace(/`[^`]*`/g, (m) => " ".repeat(m.length))
      .replace(/https?:\/\/\S+/g, (m) => " ".repeat(m.length));
  });
}

function checkProse(file, text) {
  if (!PROSE_EXT.has(extname(file).toLowerCase())) return;
  const lines = proseOnly(text);
  for (let i = 0; i < lines.length; i++) {
    for (const rule of QUESTION_RULES) {
      if (rule.re.test(lines[i])) {
        err(file, i + 1, "ASCII '?' in prose — " + rule.what);
      }
    }
  }
}

// A heading needs a blank line before it. Without one, Markdown folds the
// heading into the preceding paragraph and it renders as body text — so a
// whole section can silently vanish. This repository has shipped that defect
// seven times, which is why it is now checked rather than reviewed by eye.
//
// Fence-aware: a "## Something" line inside a code fence is sample content,
// not a heading. Tables and blockquotes are excluded because a heading may
// legitimately follow them without a blank line in neither case — the
// excluded set is deliberately small to avoid false negatives.
function checkHeadingSpacing(file, text) {
  if (!MARKDOWN_EXT.has(extname(file).toLowerCase())) return;
  const lines = text.split("\n");
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trimStart();
    if (t.startsWith("```") || t.startsWith("~~~")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (!/^#{1,6} /.test(lines[i])) continue;
    if (i === 0) continue;

    const prev = lines[i - 1];
    if (prev.trim() === "") continue;
    if (/^#{1,6} /.test(prev)) continue;
    if (/^\s*\|/.test(prev)) continue;
    if (/^\s*>/.test(prev)) continue;
    if (/^\s*<!--/.test(prev)) continue;

    err(
      file,
      i + 1,
      "heading has no blank line before it — it will render as body text: " +
        lines[i].trim(),
    );
  }
}

const files = walk(ROOT).filter(shouldCheck).sort();

for (const file of files) {
  let bytes;
  try {
    bytes = readFileSync(file);
  } catch {
    err(file, 1, "could not be read");
    continue;
  }
  const text = checkBytes(file, bytes);
  if (text !== null) {
    checkProse(file, text);
    checkHeadingSpacing(file, text);
  }
}

const rel = (f) => relative(ROOT, f).replace(/\\/g, "/");

if (errors.length === 0) {
  console.log("CONTENT LINT PASSED — " + files.length + " files checked, 0 issues.");
  process.exit(0);
}

console.error("CONTENT LINT FAILED — " + errors.length + " issue(s) in " + files.length + " files:");
const byFile = new Map();
for (const e of errors) {
  if (!byFile.has(e.file)) byFile.set(e.file, []);
  byFile.get(e.file).push(e);
}
for (const [file, list] of byFile) {
  console.error("");
  console.error("  " + rel(file));
  for (const e of list) {
    console.error("    line " + e.line + ": " + e.msg);
  }
}
console.error("");
console.error("Repair procedures: docs/TROUBLESHOOTING.md");
process.exit(1);