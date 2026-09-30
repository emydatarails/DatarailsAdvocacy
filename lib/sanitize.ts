// Deterministic clean-up applied to every model output before it is
// returned to the user. The prompts ask for all of this, but models drift,
// so the code is the guarantee.

const HASHTAG_TOKEN = /(^|[\s(])#[\p{L}\p{N}_]+/gu;

export function stripHashtags(text: string): string {
  const lines = text.split("\n");
  // Drop any line that is nothing but hashtags (the classic trailing block).
  const kept = lines.filter((line) => {
    const t = line.trim();
    if (!t) return true;
    const withoutTags = t.replace(/#[\p{L}\p{N}_]+/gu, "").replace(/[\s,.;·|]+/g, "");
    return withoutTags.length > 0;
  });
  // Then remove inline hashtags anywhere else, keeping the leading space.
  return kept.map((line) => line.replace(HASHTAG_TOKEN, "$1").replace(/[ \t]{2,}/g, " ").trimEnd()).join("\n");
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/^```[a-z]*\n?/gim, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/(^|\s)\*([^*\n]+)\*(?=[\s.,;:!?]|$)/g, "$1$2")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "");
}

export function stripCommentary(text: string): string {
  const lines = text.split("\n");
  // Leading "Here is the revised post:" style lines.
  while (lines.length && /^(here('s| is)|sure[,!]?|below is|okay[,!]?|revised (post|version)|final (post|version)|post:|draft:)/i.test(lines[0].trim())) {
    lines.shift();
  }
  // Trailing "(Character count: 742)" or "Word count" notes.
  while (lines.length && /^\(?\s*(character|char|word)s?\s*(count)?\s*[:=]/i.test(lines[lines.length - 1].trim())) {
    lines.pop();
  }
  while (lines.length && /^\s*\(?\d{3}\s*(characters|chars)\)?\s*$/i.test(lines[lines.length - 1].trim())) {
    lines.pop();
  }
  return lines.join("\n");
}

export function stripWrappingQuotes(text: string): string {
  const t = text.trim();
  if (/^["“]/.test(t) && /["”]$/.test(t) && (t.match(/["“”]/g) || []).length === 2) {
    return t.slice(1, -1);
  }
  return t;
}

export function replaceDashes(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ", ")
    // Fix the case where the dash led straight into punctuation.
    .replace(/,\s*([.,;:!?])/g, "$1")
    // "So, that" style artifacts at line starts are fine; a leading comma is not.
    .replace(/^,\s*/gm, "");
}

export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizePost(raw: string): string {
  let t = raw;
  t = stripCommentary(t);
  t = stripMarkdown(t);
  t = stripWrappingQuotes(t);
  t = stripHashtags(t);
  t = replaceDashes(t);
  t = normalizeWhitespace(t);
  return t;
}
