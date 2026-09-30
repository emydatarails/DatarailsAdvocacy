import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_MODEL, resolveModel } from "./gemini.js";

test("defaults to the current Flash model and honours GEMINI_MODEL", () => {
  delete process.env.GEMINI_MODEL;
  assert.equal(resolveModel(), DEFAULT_MODEL);
  process.env.GEMINI_MODEL = " gemini-4-flash ";
  assert.equal(resolveModel(), "gemini-4-flash");
  process.env.GEMINI_MODEL = "";
  assert.equal(resolveModel(), DEFAULT_MODEL);
  delete process.env.GEMINI_MODEL;
});
