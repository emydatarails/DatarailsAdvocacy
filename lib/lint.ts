// Mechanical quality checks for a generated post. Used by the persona
// harness and by the generator's final validation step.

export interface LintResult {
  chars: number;
  words: number;
  sentences: number;
  avgSentenceWords: number;
  paragraphs: number;
  issues: string[];
}

export const BANNED_PHRASES = [
  "game-changer",
  "game changer",
  "revolutioniz",
  "synergy",
  "leverage",
  "streamline",
  "empower",
  "unlock",
  "transform",
  "journey",
  "impactful",
  "robust",
  "cutting-edge",
  "best-in-class",
  "paradigm",
  "holistic",
  "seamless",
  "effortless",
  "delve",
  "landscape",
  "tapestry",
  "harness",
  "navigate",
  "realm",
  "myriad",
  "plethora",
  "testament",
  "elevate",
  "single source of truth",
  "peace of mind",
  "at the end of the day",
  "fast forward",
  "turns out i was wrong",
  "i genuinely didn't think",
  "it's not about",
  "isn't about",
  "let that sink in",
  "here's the thing",
  "spoiler",
];

export function lintPost(post: string): LintResult {
  const issues: string[] = [];
  const chars = post.length;
  const words = post.split(/\s+/).filter(Boolean).length;
  const sentenceList = post
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
  const sentences = sentenceList.length;
  const avgSentenceWords = sentences ? words / sentences : 0;
  const paragraphs = post.split(/\n\s*\n/).filter((p) => p.trim()).length;

  if (chars < 600) issues.push(`too short (${chars} < 600)`);
  if (chars > 800) issues.push(`too long (${chars} > 800)`);
  if (/#\w/.test(post)) issues.push("contains hashtag");
  if (/[—–]/.test(post)) issues.push("contains em/en dash");
  if (!/@Datarails/.test(post)) issues.push("missing @Datarails tag");
  const tagIdx = post.indexOf("@Datarails");
  if (tagIdx >= 0 && tagIdx > post.length * 0.85) issues.push("@Datarails tag stapled near the end");
  if (/\[[^\]]+\]/.test(post)) issues.push("contains bracket placeholder");
  if (/\*\*|^#+\s|^\s*[-*]\s/m.test(post)) issues.push("contains markdown formatting");
  if (/^(here('s| is)|sure|below|revised)/i.test(post.trim())) issues.push("starts with commentary");
  if (/^["“]/.test(post.trim()) && /["”]$/.test(post.trim())) issues.push("wrapped in quotes");
  if (!/\bI\b/.test(post)) issues.push("not first person");
  if (/^(I was|I remember|It was)\b/i.test(post.trim())) issues.push("lazy opening");

  const lower = post.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) issues.push(`banned phrase: "${phrase}"`);
  }

  // Rhythm: everything the same length reads as machine-written.
  const lens = sentenceList.map((s) => s.split(/\s+/).length);
  if (lens.length >= 4) {
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
    const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);
    if (sd < 3) issues.push(`flat rhythm (sentence length sd ${sd.toFixed(1)})`);
  }
  // Too many one-line "punch" fragments in a row is its own tell.
  const shortRun = lens.reduce(
    (acc, l) => {
      acc.cur = l <= 3 ? acc.cur + 1 : 0;
      acc.max = Math.max(acc.max, acc.cur);
      return acc;
    },
    { cur: 0, max: 0 },
  ).max;
  if (shortRun >= 4) issues.push(`${shortRun} fragments in a row`);

  // "Not X. Y." contrast pattern overuse.
  const notPattern = (post.match(/\bNot (a|the|because|just|anymore|more)\b/g) || []).length;
  if (notPattern >= 3) issues.push(`"Not X." contrast used ${notPattern} times`);

  // Rhetorical question overuse.
  const questions = (post.match(/\?/g) || []).length;
  if (questions >= 3) issues.push(`${questions} rhetorical questions`);

  return { chars, words, sentences, avgSentenceWords, paragraphs, issues };
}
