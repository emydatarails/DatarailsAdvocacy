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
} from "./generator";

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
    const draft = prompt.split("DRAFT:\n")[1].split("\n\nLENGTH:")[0];
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

test("trimToLimit never drops the paragraph holding the tag", () => {
  const text = [body(300, false), body(350), body(300, false)].join("\n\n");
  const out = trimToLimit(text);
  assert.ok(out.includes("@Datarails"));
  assert.ok(out.length <= MAX_CHARS);
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
