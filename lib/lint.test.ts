import { test } from "node:test";
import assert from "node:assert/strict";
import { promoTells } from "./lint.js";

test("flags marketing copy", () => {
  assert.ok(promoTells("@Datarails is a game changer for our close.").length > 0);
  assert.ok(promoTells("Thrilled to partner with such an innovative team.").length > 0);
  assert.ok(promoTells("If you're still closing in spreadsheets, reach out.").length > 0);
  assert.ok(promoTells("We saved 50% on close and improved accuracy by 25% in one quarter.").length > 0);
  assert.ok(promoTells("Best decision we made this year!").length > 0);
});

test("does not flag genuine advocacy", () => {
  const post = "The plant data was already sitting in @Datarails when the request came in, refreshed that morning. Honestly the best decision we made on tooling this year, and I'd tell any controller to look at it. Close is two days shorter. I still keep one tab I probably should delete.";
  assert.deepEqual(promoTells(post), []);
});

test("flags slogans but not plain liking", () => {
  assert.ok(promoTells("Everything now comes from one place, a single source of truth.").length > 0);
  assert.deepEqual(promoTells("I no longer dread the board pack, and I'm glad we did this."), []);
});

