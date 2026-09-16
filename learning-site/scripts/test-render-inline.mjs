// Unit tests for src/lib/renderInline.jsx — the inline Markdown formatter.
//
// WHY THIS FILE EXISTS
// renderInline is small and looks obviously correct, which is exactly why its
// one real bug survived. The tokenizer matched emphasis and code in a single
// alternation over the whole string, so a string where a code span CONTAINS an
// emphasis character shredded both spans:
//
//     **The third statement uses `Resource: "*"` inside a key policy.**
//
// The bold branch excludes `*`, so the bold run did not match. The engine then
// fell back to *italic*, pairing the two asterisks ACROSS the code span, and
// the rendered prose leaked a literal backtick. The build passed, the smoke
// render passed on every other phase, and only advance-04 tripped it — because
// that is the one phase that happens to write a quoted asterisk inside a code
// span inside a bold run.
//
// The smoke test catches the symptom, but only for content that exists today.
// These cases pin the RULE, so the next lesson to write `"*"` inside a code
// span is covered the moment it is authored rather than the next time someone
// runs the full suite.
//
// The module is JSX, so it cannot be evaluated with `new Function` the way the
// plain-JS tests do. It is loaded through Vite's SSR transform instead, the
// same mechanism smoke-render.mjs uses.
//
// Run: npm run test:render-inline

import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

let pass = 0;
let fail = 0;

function check(label, got, want) {
  if (got === want) {
    pass++;
    return;
  }
  fail++;
  console.log(
    "  FAIL " + label + "\n       got:  " + JSON.stringify(got) + "\n       want: " + JSON.stringify(want)
  );
}

const server = await createServer({
  root: ROOT,
  logLevel: "silent",
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { renderInline } = await server.ssrLoadModule("/src/lib/renderInline.jsx");

  // React escapes text nodes, so an assertion on rendered text has to decode
  // before comparing or `"` reads back as `&quot;` and the test fails on entity
  // encoding rather than on content.
  const decode = (s) =>
    s
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");

  // Render to an HTML string and strip the tags, so the assertion is about the
  // reader-visible text. `**bold**` becoming "<strong>bold</strong>" and
  // becoming "**bold**" are then distinguishable without inspecting the tree.
  const text = (input) =>
    decode(
      renderToStaticMarkup(createElement("span", null, renderInline(input, "t"))).replace(
        /<[^>]+>/g,
        ""
      )
    );

  // The tag check is separate, because a formatter that dropped every marker
  // would pass a text-only assertion while silently deleting the emphasis.
  const html = (input) =>
    decode(renderToStaticMarkup(createElement("span", null, renderInline(input, "t"))));

  console.log("=== plain text passes through ===\n");
  check("no markers unchanged", text("just words"), "just words");
  check("empty string", text(""), "");
  check("non-string is returned as-is", renderInline(42, "t"), 42);

  console.log("\n=== single constructs ===\n");
  check("bold", text("a **b** c"), "a b c");
  check("bold emits strong", html("a **b** c").includes("<strong>"), true);
  check("code", text("a `b` c"), "a b c");
  check("code emits code", html("a `b` c").includes("<code>"), true);
  check("italic", text("a *b* c"), "a b c");
  check("italic emits em", html("a *b* c").includes("<em>"), true);

  console.log("\n=== code span inside bold (the shipped defect) ===\n");
  // The exact shape that broke: bold containing a code span whose content
  // includes an asterisk used as data.
  const QUOTED_STAR =
    '**The third statement uses `Resource: "*"` inside a key policy, and that is correct.**';
  check(
    "no backtick survives in the text",
    text(QUOTED_STAR),
    'The third statement uses Resource: "*" inside a key policy, and that is correct.'
  );
  check("no asterisk survives in the text", text(QUOTED_STAR).includes("*"), true);
  check("outer run is bold", html(QUOTED_STAR).includes("<strong>"), true);
  check("inner run is code", html(QUOTED_STAR).includes("<code>"), true);
  check(
    "code holds the quoted asterisk",
    /<code>Resource: "\*"<\/code>/.test(html(QUOTED_STAR)),
    true
  );

  console.log("\n=== related nesting shapes ===\n");
  check("code containing bold markers", text("a `**not bold**` b"), "a **not bold** b");
  check("code is not emphasis", html("a `**not bold**` b").includes("<strong>"), false);
  check("code containing italic markers", text("a `*not italic*` b"), "a *not italic* b");
  check("bold containing code", text("a **`b`** c"), "a b c");
  check("bold containing code emits both", /<strong>.*<code>.*<\/code>.*<\/strong>/.test(html("a **`b`** c")), true);
  check("italic containing code", text("a *`b`* c"), "a b c");
  check("two code spans in one bold run", text("**`a` and `b`**"), "a and b");
  check("two code spans in one bold run, both code", (html("**`a` and `b`**").match(/<code>/g) || []).length, 2);
  // `2 * 3 * 4` is genuinely emphasis under CommonMark — the two asterisks pair
  // and mark " 3 " as italic. Asserting the literal text back would be asserting
  // that the formatter is wrong. Pinned here so the behaviour is a decision
  // rather than an accident, and so the next reader does not "fix" it.
  check("bare asterisks pair as emphasis, per CommonMark", text("2 * 3 * 4"), "2  3  4");
  check("bare asterisks emit em", html("2 * 3 * 4").includes("<em>"), true);
  check("spaced asterisks stay literal", text("2 * 3"), "2 * 3");

  console.log("\n=== adjacent and repeated spans ===\n");
  check("bold then code", text("**a** `b`"), "a b");
  check("code then bold", text("`a` **b**"), "a b");
  check("back-to-back bold", text("**a****b**"), "ab");
  check("unmatched backtick renders literally", text("a `b c"), "a `b c");
  check("unmatched double asterisk renders literally", text("a **b c"), "a **b c");

  console.log("\n=== the real corpus string that shipped the bug ===\n");
  const CORPUS =
    '**The third statement uses `Resource: "*"` inside a key policy, and that is correct.** ' +
    'A key policy is scoped to one key, so `*` means "this key." That is not the same as `*` ' +
    "in an identity policy, and reading a key policy with identity-policy instincts is a common " +
    "source of confusion.";
  const out = html(CORPUS);
  const prose = out.replace(/<pre[\s\S]*?<\/pre>/g, "").replace(/<code[\s\S]*?<\/code>/g, "");
  check("full corpus: no literal backtick in prose", prose.includes("`"), false);
  check("full corpus: no literal ** in prose", prose.includes("**"), false);
  check("full corpus: still bold", out.includes("<strong>"), true);
  check("full corpus: three code spans", (out.match(/<code>/g) || []).length, 3);
} finally {
  await server.close();
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);