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

// Patterns that make a post read as an ad or a testimonial rather than a
// person talking about their work. Any hit triggers a de-pitch rewrite in
// the pipeline, so keep this list to things that are wrong every time.
const PROMO_PATTERNS: Array<[RegExp, string]> = [
  [/@?Datarails\s+(lets|let|allows|allowed|gives|gave|makes|made|helps|helped|handles|handled|does|did|takes|took|enables|enabled|saves|saved|turned|changed|solved|fixed|delivers|delivered)\b/i, "Datarails is the subject doing something for the writer"],
  [/\b(with|thanks to|because of|using|through|via)\s+@?Datarails\b/i, "benefit attributed directly to Datarails"],
  [/@?Datarails('s| is| has been| was)\s+(a |an |the )?(game|life|huge|massive|incredible|amazing|fantastic|great|brilliant|best|perfect)/i, "praise of the tool"],
  [/\b(highly|strongly|can't|cannot|would) recommend\b/i, "recommendation"],
  [/\b(check (it|them) out|reach out|dm me|message me|link in (the )?(bio|comments)|happy to (chat|share|talk|walk)|feel free to|let me know if)\b/i, "call to action"],
  [/\bif (you|your team)('re| are)? (still|struggling|dealing|drowning|stuck|spending|tired)\b/i, "addressing the reader as a prospect"],
  [/\b(game[- ]chang|life[- ]chang|no[- ]brainer|best decision|worth every|trust me|shout[- ]?out|kudos to|hats off)\b/i, "marketing superlative"],
  [/\b(the|this|our) (platform|tool|solution|software|system) (is|was|has)\b/i, "talking about the product as a product"],
  [/\bI no longer\b/i, "case-study 'I no longer'"],
  [/\b(one|single) (place|source|version) of (the )?truth\b|\bslightly different truth\b|\bsingle source\b/i, "single-source-of-truth vocabulary"],
  [/!/, "exclamation mark"],
  [/\d+\s?%[^.]*\d+\s?%/, "two percentages in one sentence"],
];

export function promoTells(post: string): string[] {
  const tells: string[] = [];
  for (const [re, label] of PROMO_PATTERNS) {
    const m = post.match(re);
    if (m) tells.push(`${label}: "${m[0].trim()}"`);
  }
  // A wholesome reward as the final sentence is the case-study payoff.
  const sentences = post.trim().split(/(?<=[.!?])\s+/);
  const last = sentences[sentences.length - 1] || "";
  const reward = last.match(/\b(walked the dog|went to bed at|(daughter|son|kid)'?s? (game|recital|match)|made (dinner|pasta)|went home (early|at)|signed off at|left at \d|closed the laptop at)\b/i);
  // A reward closer is a short payoff line; a long sentence that mentions
  // the dog on the way to something unresolved is just a sentence.
  if (reward && last.split(/\s+/).length <= 12) tells.push(`reward closer: "${last.trim()}"`);
  const percentages = (post.match(/\d+\s?%/g) || []).length;
  if (percentages >= 3) tells.push(`${percentages} percentage figures in one post`);
  return tells;
}

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

  for (const tell of promoTells(post)) issues.push(`promo tell, ${tell}`);

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
