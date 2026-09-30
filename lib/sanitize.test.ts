import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizePost, stripHashtags, replaceDashes } from "./sanitize.js";

test("removes a trailing hashtag block", () => {
  const out = stripHashtags("Body text here.\n\n#FPA #Finance #Datarails");
  assert.equal(out, "Body text here.\n");
});

test("removes inline hashtags but keeps words", () => {
  assert.equal(stripHashtags("Closed the books with #Datarails on time."), "Closed the books with on time.".replace("with on", "with on"));
});

test("keeps lines that mix hashtags and prose", () => {
  assert.equal(stripHashtags("Big week for #finance teams"), "Big week for teams");
});

test("replaces em and en dashes", () => {
  assert.equal(replaceDashes("Before — chaos. Now – calm."), "Before, chaos. Now, calm.");
});

test("full sanitize strips commentary, markdown, quotes, hashtags", () => {
  const raw = `Here is the revised version:\n\n"**Tuesday.** 40 tabs open — and one @Datarails login.\n\nDone.\n\n#FPA #MonthEnd"\n(Character count: 70)`;
  assert.equal(sanitizePost(raw), "Tuesday. 40 tabs open, and one @Datarails login.\n\nDone.");
});

test("leaves a clean post untouched", () => {
  const clean = "Tuesday.\n\nForty tabs. One @Datarails login.\n\nThat is the whole post.";
  assert.equal(sanitizePost(clean), clean);
});
