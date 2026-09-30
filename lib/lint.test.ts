import { test } from "node:test";
import assert from "node:assert/strict";
import { promoTells } from "./lint.js";

test("flags ad language", () => {
  assert.ok(promoTells("With @Datarails, close is a breeze.").length > 0);
  assert.ok(promoTells("@Datarails lets us see everything in real time.").length > 0);
  assert.ok(promoTells("Highly recommend it to any finance team.").length > 0);
  assert.ok(promoTells("If you're still closing in spreadsheets, reach out.").length > 0);
  assert.ok(promoTells("We saved 50% on close and improved accuracy by 25% in one quarter.").length > 0);
  assert.ok(promoTells("Best decision we made this year!").length > 0);
});

test("does not flag a plain account of work", () => {
  const post = "The plant data was already sitting in @Datarails when the request came in, refreshed that morning. I still keep one tab I probably should delete. Close is two days shorter, and the pack went out once.";
  assert.deepEqual(promoTells(post), []);
});

test("flags case-study vocabulary and reward closers", () => {
  assert.ok(promoTells("I no longer dread the board pack.").length > 0);
  assert.ok(promoTells("Everything now comes from one place, a single source of truth.").length > 0);
  assert.ok(promoTells("The pack went out at three.\n\nThen I walked the dog before it got dark.").length > 0);
  assert.deepEqual(promoTells("I walked the dog at six and came back to a reconciliation that still did not tie."), []);
});
