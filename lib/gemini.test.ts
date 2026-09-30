import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_MODEL, DEFAULT_THINKING, parseThinkingPlan, resolveModel, resolveThinking } from "./gemini.js";

test("defaults to the current Flash model and honours GEMINI_MODEL", () => {
  delete process.env.GEMINI_MODEL;
  assert.equal(resolveModel(), DEFAULT_MODEL);
  process.env.GEMINI_MODEL = " gemini-4-flash ";
  assert.equal(resolveModel(), "gemini-4-flash");
  process.env.GEMINI_MODEL = "";
  assert.equal(resolveModel(), DEFAULT_MODEL);
  delete process.env.GEMINI_MODEL;
});

test("thinking plan comes from the environment with per-stage overrides", () => {
  assert.deepEqual(resolveThinking({}), DEFAULT_THINKING);
  assert.deepEqual(resolveThinking({ GEMINI_THINKING: "medium" }), { draft: "medium", edit: "medium", fit: "medium" });
  assert.deepEqual(
    resolveThinking({ GEMINI_THINKING: "medium", GEMINI_THINKING_FIT: "minimal" }),
    { draft: "medium", edit: "medium", fit: "minimal" },
  );
  // A typo never breaks generation.
  assert.deepEqual(resolveThinking({ GEMINI_THINKING: "turbo", GEMINI_THINKING_EDIT: "hgih" }), DEFAULT_THINKING);
});

test("parseThinkingPlan accepts a level or per-stage pairs", () => {
  assert.deepEqual(parseThinkingPlan("high"), { draft: "high", edit: "high", fit: "high" });
  assert.deepEqual(parseThinkingPlan("draft=medium+edit=low+fit=minimal"), { draft: "medium", edit: "low", fit: "minimal" });
  assert.throws(() => parseThinkingPlan("draft=fast"));
});
