import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildDraftPrompt,
  buildEditPrompt,
  generatePost,
  pickDraftContext,
  trimToLimit,
  MAX_CHARS,
  MIN_CHARS,
  type PostInput,
} from "./generator.js";

const input: PostInput = {
  profession: "Controller",
  industry: "Manufacturing",
  style: "professional",
  specificMoment: "Manual consolidation from multiple systems",
  keyOutcome: "Automated 80% of data consolidation",
};

const body = (n: number, tag = true) => {
  const sentence = "We pulled every plant export into one workbook by hand and hoped the intercompany lines tied. ";
  let t = "";
  while (t.length < n) t += sentence;
  t = t.slice(0, n);
  return tag ? t.replace("one workbook", "one workbook that now lives in @Datarails") : t;
};

test("prompts contain no em-dashes and forbid hashtags", () => {
  const p1 = buildDraftPrompt(input, pickDraftContext());
  const p2 = buildEditPrompt(input, body(700));
  for (const p of [p1, p2]) {
    assert.ok(!/[—–]/.test(p), "prompt contains an em/en dash");
    assert.match(p, /No hashtags anywhere/);
    assert.ok(!/3-4 relevant hashtags/.test(p));
  }
});

test("hashtags, markdown, commentary and dashes never reach the caller", async () => {
  const llm = async (prompt: string) => {
    if (prompt.startsWith("You are ghostwriting")) {
      return `Here is the post:\n\n**${body(650)}** — done.\n\n#FPA #Finance #Datarails`;
    }
    // Edit pass echoes the draft, adds an inline hashtag and an en-dash.
    const draft = prompt.split("DRAFT:\n")[1].split("\n\nWHAT TO FIX")[0];
    return `${draft} Closed early – #winning`;
  };
  const { post } = await generatePost(input, llm);
  assert.ok(!/#\w/.test(post), `hashtag survived: ${post}`);
  assert.ok(!/[—–]/.test(post));
  assert.ok(!/\*\*/.test(post));
  assert.ok(!/^Here is/.test(post));
  assert.ok(post.includes("@Datarails"));
});

test("an over-length edit triggers the fit pass and lands in range", async () => {
  let fitCalls = 0;
  const llm = async (prompt: string) => {
    if (prompt.startsWith("You are ghostwriting")) return body(700);
    if (prompt.startsWith("You are editing")) return body(1100);
    fitCalls++;
    return body(720);
  };
  const { post, fitted } = await generatePost(input, llm);
  assert.equal(fitCalls, 1);
  void MIN_CHARS;
  assert.ok(fitted);
  assert.ok(post.length >= MIN_CHARS && post.length <= MAX_CHARS);
});

test("if the fit pass also fails, trailing paragraphs are dropped", async () => {
  const paragraphs = [body(300), body(250, false), body(200, false), body(200, false)].join("\n\n");
  const llm = async (prompt: string) => {
    if (prompt.startsWith("You are ghostwriting")) return paragraphs;
    if (prompt.startsWith("You are editing")) return paragraphs;
    return paragraphs; // fit pass ignores the instruction
  };
  const { post } = await generatePost(input, llm);
  assert.ok(post.length <= MAX_CHARS, `still too long: ${post.length}`);
  assert.ok(post.includes("@Datarails"));
});

test("trimToLimit peels trailing sentences before whole paragraphs", () => {
  const first = body(500);
  const last = "One more sentence here. And another one that pushes it over the line for sure. Final sentence that should go.";
  const text = `${first}\n\n${last.repeat(4)}`;
  const out = trimToLimit(text);
  assert.ok(out.length <= MAX_CHARS, `${out.length}`);
  assert.ok(out.startsWith(first));
  assert.ok(out.split("\n\n").length === 2, "kept the second paragraph, shortened");
});

test("trimToLimit never drops the paragraph holding the tag", () => {
  const text = [body(300, false), body(350), body(300, false)].join("\n\n");
  const out = trimToLimit(text);
  assert.ok(out.includes("@Datarails"));
  assert.ok(out.length <= MAX_CHARS);
});

test("a promotional edit triggers the de-pitch pass, a clean one does not", async () => {
  let depitchCalls = 0;
  const clean = body(700);
  const promo = clean.replace("hoped the intercompany", "@Datarails is a game changer and hoped the intercompany");
  const llm = async (prompt: string, stage: string) => {
    if (stage === "draft") return clean;
    if (stage === "edit") return promo;
    if (stage === "depitch") {
      depitchCalls++;
      return clean;
    }
    return clean;
  };
  const r1 = await generatePost(input, llm);
  assert.equal(depitchCalls, 1);
  assert.ok(r1.depitched);
  assert.equal(r1.post, clean);

  const quiet = async (_p: string, stage: string) => {
    if (stage === "depitch") depitchCalls++;
    return clean;
  };
  depitchCalls = 0;
  const r2 = await generatePost(input, quiet);
  assert.equal(depitchCalls, 0);
  assert.ok(!r2.depitched);
});

test("prompts carry no quoted brand sentence to copy", () => {
  const p = buildDraftPrompt(input, pickDraftContext());
  assert.ok(!/lives in @Datarails/.test(p));
  assert.ok(!/moved consolidation into @Datarails/.test(p));
  assert.match(p, /AUTHENTIC, NOT COPY/);
});

test("a garbage edit pass falls back to the draft", async () => {
  const llm = async (prompt: string) => {
    if (prompt.startsWith("You are ghostwriting")) return body(700);
    if (prompt.startsWith("You are editing")) return "I cannot help with that.";
    return body(700);
  };
  const { post, draft } = await generatePost(input, llm);
  assert.equal(post, draft);
});
