// Shared post-generation pipeline used by api/generate-post.ts (Vercel) and
// server.ts (local dev). Keep all prompt text here so the two entry points
// never drift apart.
//
// Pipeline: draft -> sanitize -> edit pass -> sanitize -> (de-pitch pass if
// the post still reads as an ad) -> (one fit pass if the length is off) ->
// sanitize -> last-resort trim. The prompts ask for clean
// output; the code guarantees it (no hashtags, no em-dashes, no markdown,
// no commentary, length inside the window).
//
// Prompt hygiene rules learned from the persona audit (scripts/persona-run.ts):
// - Never put an em-dash in a prompt that forbids em-dashes. Models echo it.
// - Never give a quotable example sentence. It shows up verbatim in posts.
// - Anything that appears in more than one "random" list (Tuesday, the
//   quiet office, a lone number, a CFO question) shows up in most posts.
// - The edit pass must know the target length, or it grows the post.

import { promoTells } from "./lint.js";
import { sanitizePost } from "./sanitize.js";

export interface PostInput {
  profession: string;
  industry: string;
  style: string;
  specificMoment: string;
  keyOutcome: string;
}

export type Stage = "draft" | "edit" | "depitch" | "fit";

// The stage lets the adapter pick a thinking level per call: the draft is
// where reasoning pays off, the edit and fit passes are mechanical.
export type Llm = (prompt: string, stage: Stage) => Promise<string>;

export const MIN_CHARS = 600;
export const MAX_CHARS = 800;
// Models count words far more reliably than characters, so the prompts
// budget in words and paragraphs. 105-125 words lands at roughly 620-740
// characters, which leaves the edit pass room under the 800 ceiling.
const WORD_BUDGET = "about 100 words, 120 at the very most";

export const narrativeArchetypes = [
  {
    name: "One ordinary day",
    description:
      "Build the whole post from a single unglamorous working moment: the hour, what was on screen, who was waiting. Make the reader feel present in it. Close by showing the same kind of moment now, briefly.",
  },
  {
    name: "The private admission",
    description:
      "Start with something finance people admit to each other but rarely post: a workaround they were embarrassed by, a number they never fully trusted, a habit they hid. Then show what changed, without glossing the hard parts.",
  },
  {
    name: "Proven wrong",
    description:
      "Begin from real resistance. The writer had good reasons to doubt any new tool, and says what those reasons were. Show the moment the doubt cracked. This is a mind changing, not a pitch; keep the skepticism visible to the end.",
  },
  {
    name: "The question",
    description:
      "Frame the story around one specific question a leader or auditor asked, the kind that used to trigger a scramble, and what answering it looks like now. Focus on the people in the room and how their posture changed, not on software.",
  },
  {
    name: "The cost nobody counted",
    description:
      "Lead with a cost that was easy to ignore: the evenings, the re-checking, the meeting that always slipped a day. Make it concrete without turning it into a statistic. Then show what that cost bought back once it was gone.",
  },
  {
    name: "The team, not me",
    description:
      "Make it about the people around the writer: what a specific colleague's week looks like now, told through one exchange with them. First person, but the writer is not the hero, and neither is the colleague; nobody performs a feat with the tool.",
  },
  {
    name: "Then and now",
    description:
      "Two scenes only. One from before, one from now. Do not list differences; render both moments with enough texture that the contrast does the work. The 'now' scene should feel like a breath out.",
  },
  {
    name: "The handoff",
    description:
      "Anchor on explaining the process to someone new: a hire, a successor, an auditor. The explanation is shorter than it used to be, but it is still an explanation, with a part the writer is a little embarrassed by. No punchline about there being nothing left to explain.",
  },
  {
    name: "The thing I stopped doing",
    description:
      "Center on one specific habit or ritual that simply vanished: the Sunday laptop hour, the reconciliation tab, the re-sent board pack. Describe the habit fondly and precisely. Let its absence carry the story.",
  },
];

export const styleInstructions: Record<string, string> = {
  punchy: `
FORMAT RULES FOR THIS STYLE:
- Five or six short paragraphs, one to three lines each, with a blank line between them.
- Mostly complete sentences. At most two fragments of one to three words in the whole post; more than that reads as a template.
- Open with a statement, not a question and not "I was".
- One longer sentence somewhere that carries the actual story.
- Ends when the story ends. No sign-off line, no moral.`,

  professional: `
FORMAT RULES FOR THIS STYLE:
- Measured and specific. Authority comes from detail, never from adjectives.
- Three paragraphs of two or three sentences each. That is the whole post. A fourth paragraph means something else has to go.
- Write like a senior person who is comfortable being plain.
- Competence shows in the story. No self-congratulation, no lesson at the end.`,

  casual: `
FORMAT RULES FOR THIS STYLE:
- Write like a message to a smart colleague who already knows the context.
- Informal, not flippant. Contractions are fine. Interjections like "honestly" or "look" are fine at most once, and not as the first word.
- Three or four short paragraphs, conversational rhythm.
- It should read like it was typed in fifteen minutes because the writer wanted to say it, not because they wanted to post something.`,

  detailed: `
FORMAT RULES FOR THIS STYLE:
- "Detailed" means texture, not length. The character cap still applies, so spend the words on specifics and cut everything generic.
- A real arc in exactly three paragraphs: setup, the moment it turned, where things stand.
- Small true-sounding details (which system, which day of close, who was waiting) do the work.
- End on a plain reflection, not a call to action and not a one-line slogan.`,
};

export const openingPatterns = [
  "Open cold, mid-scene. No stage setting. The reader arrives in the middle of a moment that is already happening.",
  "Open with a count of something mundane: exports, tabs, sign-offs, reminders. A full sentence that says what the things were and where they went, never a bare number and never a remark about counting them. Then move on.",
  "Open with the question a leader, auditor or board member asked, in their words, then answer it in one line.",
  "Open with a recurring task that used to eat a specific evening or weekend. Name the task, not the feeling.",
  "Open with a belief the writer held about their own process, stated the way they would have said it in a meeting at the time. Do not start with 'For years' or 'I used to'. Then take it apart.",
  "Open on something a colleague said. Just the remark, then the context.",
  "Open with the absence of something: a message that did not arrive, a meeting that did not slip, a file nobody asked for.",
  "Open with the result, stated flatly, then go back and earn it.",
  "Open with a concrete thing the writer did every month that, in hindsight, was the problem. Name the task in the first sentence; do not start with 'For years' or 'I used to'.",
  "Open in the middle of explaining something to a new hire or an auditor.",
  "Open with the calendar: budget season, year-end, the first close after a change. Place the reader in that stretch of the year.",
  "Open with a small physical action at the desk: closing a laptop, deleting a folder, leaving a tab open out of habit.",
];

// Invisible context: shapes why the person is writing today. It must not
// appear in the post as an event. Worded as an inner state so it leaks less.
export const postTriggers = [
  "They are a little surprised at themselves for writing this. They are not the type to post.",
  "They have been asked twice this month how their team handles deadlines, and they want to answer it properly once.",
  "They just finished a close that felt uneventful, and uneventful is new.",
  "They noticed a younger person on the team is not learning the workarounds they had to learn, and it made them think.",
  "They saw someone else's post complaining about a problem they no longer have, and felt an urge to say so without gloating.",
  "They are writing this on a weekday evening, at a normal hour, which is the point.",
  "They want to be honest about how skeptical they were, because they know their peers are skeptical too.",
  "Budget season is coming and, for once, they are not dreading it.",
  "A leader thanked them for something that used to be a fight, and they are still turning it over.",
  "They are writing for the version of themselves from two years ago.",
];

export const writerVoices = [
  "Precise and calm. Every sentence earns its place. Understates; the facts do the work.",
  "Reflective. Thinks out loud, admits what they got wrong, does not wrap things up too neatly.",
  "A slow builder. Sets a scene with texture before getting to the point, and the point lands quietly.",
  "Collegial. Cannot tell this story without the team in it.",
  "Energized but not breathless. Still a little surprised by how different things are.",
  "Skeptical by temperament. Took a while to be convinced and wants the reader to know that.",
  "A leader who zooms out. Results matter, but what changed for the people matters more.",
  "Writes like they talk: natural rhythm, a little dry, occasionally wry, never trying to sound like a post.",
];

// Where in the year and the work the story sits. Keeps every post from
// landing on "day three of close".
export const sceneSeeds = [
  "the middle of budget season, with department heads sending revised numbers daily",
  "year-end, with auditors in the building asking for support on balances",
  "the first close after a system change, when nothing is trusted yet",
  "a mid-quarter reforecast triggered by a leadership request",
  "the week a new hire joined the team and needed the process explained",
  "the run-up to a board meeting, with the pack due in two days",
  "a routine month-end close in an otherwise quiet month",
  "the week after a mistake was found in a report that had already gone out",
  "a half-year review with the leadership team",
  "the week the team was short-staffed and everything landed on one person",
];

// How the brand appears in the post. One is picked per post so the mention
// does not converge on a single stock phrase. Described, never quoted: a
// quoted example would be copied into every post.
export const mentionStyles = [
  "as a place where a specific report or model now sits, named once in passing, the way you would name a folder or a system",
  "inside a sentence about a colleague doing something themselves, where the brand is just where they did it",
  "as the thing the writer doubted, named at the point the doubt showed up",
  "in the middle of a list of the systems involved in the story, with no more weight than the ERP or the ledger",
  "as the thing one specific process was moved into, mentioned in passing, with no claim about what that caused",
  "as what was on screen during the scene, named once, then never mentioned again",
];

// The one honest, unflattering element in the post. Rotated so it does not
// always land as "X still comes in on paper and I still key it in" in the
// penultimate paragraph.
export const honestyBeats = [
  "the migration is partial: one process moved, a related one did not, and the writer says which",
  "the first month or quarter on the new setup was worse than before, and the writer says how",
  "a mistake of the writer's own from before, told plainly, that the new setup had nothing to do with",
  "a habit the writer refuses to give up, stated without apology and without a lesson",
  "the writer was annoyed by something about the change itself and is still a bit annoyed",
  "a colleague was right about something and the writer was not, and it is left there",
  "nothing extra: the scene itself is unflattering enough, so no separate confession is added",
  "nothing extra: the scene itself is unflattering enough, so no separate confession is added",
];

// How the post ends. The audit found eight of twelve ending on a wholesome
// reward (went home, walked the dog, bed at ten), which reads as a
// case-study payoff. None of these are that.
export const endings = [
  "ends on a complete sentence about a small next task, with no wrap-up sentence after it",
  "ends on a flat statement of what is on the calendar next, with no feeling attached",
  "ends on a question the writer still has about their own process, asked plainly",
  "ends on something mundane a colleague said that is not a verdict on anything",
  "ends the moment the scene ends, one sentence after the last concrete action",
  "ends on a detail from outside the story that the writer noticed at the time, unconnected to the point",
  "ends on one thing the writer will handle differently at the next close, stated as a plan, not a lesson, and not starting with the words next month",
];

// What the move to the new setup cost, if it is mentioned at all. The blind
// review found "I built the mappings myself over two weekends" in ten of
// twelve posts once the prompt asked for effort; the cost has to vary or
// be absent.
export const setupCosts = [
  "nothing is said about how it was set up; the post starts after that",
  "nothing is said about how it was set up; the post starts after that",
  "IT held up a system connection for months and the writer ran a workaround in the meantime",
  "the person who did most of the setup has since left, and the writer inherited it half-documented",
  "a handful of accounts still do not map and get journaled by hand every month",
  "the first quarter was run in parallel with the old files, which doubled the work for a while",
  "the writer argued against the spend and lost, and does not say whether they were wrong",
  "a mapping decision made early turned out to be wrong and reversing it was ugly",
];

// The deadline the scene runs against. Left alone, every story runs on
// "board pack Thursday".
export const deadlines = [
  "the monthly management accounts",
  "a lender covenant report",
  "an audit request list with a date on it",
  "the annual budget submission",
  "a payroll cut-off",
  "an investor or owner update",
  "a grant or funder report",
  "a tax filing the accountants are waiting on",
  "a quarterly board pack",
  "a reforecast a leader asked for with a week's notice",
];

// Concrete world details, rotated so twelve writers do not share one plant,
// one colleague and one weekday. The prompt tells the model to swap a
// system for a neighbouring one if it does not fit the industry.
export const regions = [
  "the Midwest", "the Pacific Northwest", "Texas", "the Northeast", "the Southeast", "Ontario",
  "the north of England", "Ireland", "the Netherlands", "New South Wales", "Southern California", "Colorado",
];
export const sourceSystems = [
  "NetSuite", "Sage Intacct", "QuickBooks", "Dynamics 365 Business Central", "SAP Business One", "Oracle",
  "Epicor", "Xero", "Workday", "ADP", "Paylocity", "Salesforce", "HubSpot", "Bill.com", "Coupa", "Expensify",
];
export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Recurring tells from the persona audit. Any one of these is fine in a
// single post; across fifty posts they read as one machine. Both prompts
// carry this list.
const overusedMoves = `
PHRASES AND MOVES THAT ARE USED TO DEATH IN POSTS LIKE THIS (do not use any of them):
- A lone number or single word as the opening line
- An office being "quiet" as the payoff
- File names as a joke (anything like v7_FINAL, FINAL_final, use_this_one)
- Cold coffee, a laptop open on a Sunday, "muscle memory"
- "Honestly," or "Look," as the first word of the post or of a paragraph
- "Old habits", "old habit", "I still catch myself", "I still triple-check"
- "Turns out", "I genuinely", "Good weird", "Still a skeptic"
- "It was the room", "the room changed", "nobody flinched", "nobody measured"
- "What changed wasn't the numbers, it was X", "the real number is", "that's the number on the slide"
- "That surprised me more than the numbers"
- "Not X. Y." contrast constructions more than once in the post
- "Nobody" as the payoff word ("nobody asked", "nobody noticed", "nobody was waiting") more than once
- "For years I assumed", "For years I believed", "I used to think" as the first words
- "the version that lives in", "since we moved consolidation into", "pulls their own numbers" as the brand sentence
- A colleague or junior who "had already built it" in the tool before the writer got in, or did the hero move on their own
- A closing reward: went home early, walked the dog, made dinner, bed at ten, a child's game, a walk, signed off at four
- A before scene and an after scene staged at the same date ("August two years ago" then "August this year")
- Someone being out, on leave or having just resigned as the reason the writer had to do the work
- A "walked a new hire through it and there was nothing to explain" punchline
- "I no longer ...", "one place", "one version of the truth", "slightly different truth", "the whole workflow in one sentence"
- Opening with "Which one of these is the real ..." or "Closed the laptop ... and then opened it again"
- More than one clock time, more than two named source systems, any colleague's first name
- "I built the mappings myself" over evenings or weekends, or any footnote about the writer's own setup effort
- An unfinished final sentence as a way of sounding casual
- A colleague's quoted remark that delivers the point of the post
- "review instead of rebuild", "the same model", "nothing to paste", "on screen by the time", "matched to the pound/cent"
- A closing line that sounds like an aphorism or a bumper sticker
- Any sentence that could be lifted from a case study or a vendor page`;

export interface DraftContext {
  archetype: { name: string; description: string };
  openingPattern: string;
  postTrigger: string;
  writerVoice: string;
  sceneSeed: string;
  mentionStyle: string;
  honestyBeat: string;
  ending: string;
  setupCost: string;
  deadline: string;
  region: string;
  sourceSystem: string;
  weekday: string;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickDraftContext(): DraftContext {
  return {
    archetype: pickRandom(narrativeArchetypes),
    openingPattern: pickRandom(openingPatterns),
    postTrigger: pickRandom(postTriggers),
    writerVoice: pickRandom(writerVoices),
    sceneSeed: pickRandom(sceneSeeds),
    mentionStyle: pickRandom(mentionStyles),
    honestyBeat: pickRandom(honestyBeats),
    ending: pickRandom(endings),
    setupCost: pickRandom(setupCosts),
    deadline: pickRandom(deadlines),
    region: pickRandom(regions),
    sourceSystem: pickRandom(sourceSystems),
    weekday: pickRandom(weekdays),
  };
}

function describePerson(input: PostInput): string {
  const { profession, industry, specificMoment, keyOutcome } = input;
  return `- Role: ${profession} in the ${industry} sector
- What was hard before: ${specificMoment}
- What changed: ${keyOutcome}`;
}

export function buildDraftPrompt(input: PostInput, ctx: DraftContext): string {
  const { style } = input;
  const { archetype, openingPattern, postTrigger, writerVoice, sceneSeed, mentionStyle, honestyBeat, ending, setupCost, deadline, region, sourceSystem, weekday } = ctx;
  const styleGuide = styleInstructions[style as string] || styleInstructions.professional;

  return `You are ghostwriting a LinkedIn post for a finance professional about their real experience using Datarails. It has to read like something they typed themselves in one sitting: not a press release, not a testimonial, not a "thought leadership" post. A real person, being specific about their own work.

SIZE, BEFORE ANYTHING ELSE:
${WORD_BUDGET} in total. That is a short post: one scene, one honest element, and they can share sentences. Drafts that run long get cut by an editor who does not know which detail mattered to you, so write short and keep the detail you care about.

WHO IS WRITING:
${describePerson(input)}
- Tone they asked for: ${style}

THEIR VOICE:
${writerVoice}

WHERE THE STORY SITS:
${sceneSeed}. Use this as the backdrop for the concrete scene. Pick details that belong to this moment in the year and to this industry.

THE WRITER'S WORLD (use these; they are this person's real context, not the first ones that come to mind):
- The business is in ${region}.
- The deadline the scene runs against is ${deadline}, and the day that matters is a ${weekday}.
- One source system in the story is ${sourceSystem}. If it does not fit this industry, use a neighbouring system of the same kind, not a famous one.
- Colleagues are referred to by role, never by first name.
- How the new setup came to be: ${setupCost}. Do not add a line about the writer's own effort building it unless that is the cost named here.

WHY THEY ARE WRITING TODAY (invisible context, never stated in the post):
${postTrigger}
Let this shape the energy of the post. Do not narrate it, do not mention the event or feeling directly.

NARRATIVE SHAPE: "${archetype.name}"
${archetype.description}

HOW TO OPEN:
${openingPattern}
This overrides whatever opening you would reach for by default. Do not open with "I was", "I remember" or "It was".

THE HONEST ELEMENT:
${honestyBeat}
Place it wherever it belongs in the story, not in a fixed slot before the ending.

HOW IT ENDS:
${ending}
No moral, no reward, no "I no longer", no line that sums up what changed.

${styleGuide}

HOW REAL PEOPLE WRITE THIS KIND OF POST:
- Not everything in the brief has to appear. Pick what fits the scene and leave the rest out.
- One concrete scene anchors everything. Which system, which report, which day of the process, who was waiting. Not "reporting was painful" but the specific afternoon it was.
- Details should belong to this industry and role. A controller in manufacturing and an analyst in retail do not have the same bad day.
- Mix sentence lengths. A long sentence that carries a whole thought, then a short one. Never three sentences of the same length in a row.
- Starting a sentence with "And", "But" or "So" is fine.
- The change was partial and unglamorous. Nobody else quietly did the work for the writer, and the writer does not footnote their own effort either. Do not stage a before scene and an after scene at the same date.
- Write the way this person talks: most people use contractions in a post. At most one clock time, at most two named source systems, no first names.
- The scene is not a demo. A leader asking a question and getting an answer in one click is a demo; a leader asking a question and getting an answer the writer had to think about is a story.
- The writer was not a skeptic who was won over. If they doubted the change, they are still allowed to doubt parts of it at the end.
- Mention @Datarails exactly once, ${mentionStyle}. It is never the subject of a sentence and never the reason something is good: the writer and the team do things, the brand is where or with what. Never "with @Datarails", "thanks to @Datarails", "@Datarails lets us". Never in the last two sentences.
- Do not explain what Datarails is or list features. Only what changed for this person and their team.

THIS IS NOT AN AD. A reader should be unable to tell whether the writer likes the vendor:
- The outcome phrases in the brief are marketing language. Do not reuse their wording. Translate each into what the writer saw and could point to on a calendar or a screen, or leave it out.
- No accuracy or speed claims phrased as results ("landed within a few points", "in under an hour"). Say what happened on the day, not what it proves.
- No recommendation, no invitation, no advice to the reader, no "if you're dealing with", no exclamation marks, no gratitude to the vendor.
- The post never ends on the product and never ends on a reward.

NUMBERS:
- The outcomes above may contain percentages. Use at most one of them as a stated figure. Express the rest in lived terms (two days instead of five, one folder instead of thirty files, an evening back) or leave them out.
- Never list outcomes back to back. That is a slide, not a post.
${overusedMoves}

WORDS TO NEVER USE:
game-changer, revolutionize, synergy, leverage, streamline, empower, unlock, transform, journey, impactful, robust, cutting-edge, best-in-class, paradigm, holistic, seamless, effortless, elevate, single source of truth, peace of mind, at the end of the day, fast forward, delve, harness, navigate

HARD REQUIREMENTS:
- First person throughout.
- Length: ${WORD_BUDGET}, following the paragraph count in the format rules. That is roughly ${MIN_CHARS} to ${MAX_CHARS} characters and the ceiling is enforced, so when in doubt write less. Count the words before you answer and cut whole sentences if you are over.
- No hashtags anywhere. Not at the end, not inline. Not one.
- No emojis, no bullet points, no headings, no bold, no markdown of any kind.
- No em-dashes or en-dashes. Use a comma, a colon, a full stop or a plain hyphen.
- No bracket placeholders like [Name] or [Company].
- Do not wrap the post in quotation marks.
- Return only the post text. No title, no preamble, no character count, no notes.`.trim();
}

export function buildEditPrompt(input: PostInput, draft: string): string {
  const { style } = input;
  const chars = draft.length;
  const lengthNote =
    chars > MAX_CHARS
      ? `The draft is ${chars} characters, which is ${chars - MAX_CHARS} over the ${MAX_CHARS} ceiling. Get it to about ${MAX_CHARS - 100}, not merely under ${MAX_CHARS}: remove ${Math.min(5, Math.ceil((chars - MAX_CHARS) / 70) + 2)} or more whole sentences, starting with setup and explanation, and tighten the rest. Count before you answer. Keep the sentence naming @Datarails and the one honest, unflattering detail; cut around them.`
      : chars < MIN_CHARS
        ? `The draft is ${chars} characters, under the ${MIN_CHARS} floor. Add one concrete detail to the existing scene. Do not add a new paragraph of reflection.`
        : `The draft is ${chars} characters. Keep it between ${MIN_CHARS} and ${MAX_CHARS}. Your edit must not make it longer; if you add a phrase, cut one.`;

  return `You are editing a LinkedIn post so it reads like the finance professional who lived it typed it themselves. Two jobs, in this order: get the length right, then remove anything that sounds generated. Beyond those two jobs, keep every sentence that already sounds like a person.

LENGTH (this comes first, it is a hard limit):
${lengthNote}
Count the characters of your final answer before you return it. A post over ${MAX_CHARS} characters is rejected, however good it reads.

WHO WROTE IT:
${describePerson(input)}
- Tone they asked for: ${style}

DRAFT:
${draft}

WHAT TO FIX, IN ORDER:

1. Template moves. LinkedIn posts written by models share a small set of tricks, and readers have learned to spot them. Remove any of these you find:
   - A run of three or more fragments in a row ("Board meeting. Mid-quarter. No warning.")
   - "Not X. Y." used more than once
   - A rhetorical question the writer then answers
   - A closing line that works as an aphorism or a slogan
   - A tidy "what this means" paragraph at the end
   - The same sentence shape repeated paragraph after paragraph
   Fix by rewriting as something the person would say out loud, or by deleting.

2. Anything that sounds like marketing or a case study. Outcomes listed back to back, percentages quoted like a slide, praise of the tool, words like seamless, streamline, transform, empower, game-changer, journey, robust, leverage, unlock, elevate, single source of truth, peace of mind. Replace with the specific thing that happened, or cut.

3. Rhythm. If sentences are all roughly the same length, vary them: one long sentence that carries a thought, then a short one. Do not create fragment chains to do this.

4. Voice. The post needs one opinion or reaction that is clearly this person's, and one detail only someone in that job would mention. If the draft already has both, leave them alone. If it lacks them, add one of each in the writer's own register. Do not add slang, do not add jokes, do not add a lesson.

5. Pitch check. Read it once more as a skeptical peer who assumes the vendor asked for this post. Any sentence that could be pasted into a vendor testimonial gets rewritten as a plain observation of what happened, or cut. @Datarails must appear exactly once, never as the subject of a sentence, never as the reason something is good, never in the last two sentences. If the post ends on a reward (went home, walked the dog, bed at ten, a child's game) or on a line that sums up what changed, cut that line and end one sentence earlier. If a colleague "had already built it" before the writer arrived, give the work back to the writer. If the post says the writer built the mappings themselves over evenings or weekends, cut that clause. If a colleague's quoted line delivers the point, replace it with something mundane they actually would have said. Replace any first name with a role. If the last sentence is unfinished, finish it or cut it. No exclamation marks.
${overusedMoves}

HARD REQUIREMENTS:
- First person throughout.
- Keep the @Datarails mention inside the body where it is. Do not move it to the end.
- No hashtags anywhere. If the draft has any, delete them.
- No emojis, no bullet points, no headings, no bold, no markdown.
- No em-dashes or en-dashes. Use a comma, a colon, a full stop or a plain hyphen.
- No bracket placeholders.
- Do not wrap the post in quotation marks.
- Return only the final post text. No preamble, no commentary, no character count.`.trim();
}

export function buildDepitchPrompt(input: PostInput, post: string, tells: string[]): string {
  return `This LinkedIn post by a ${input.profession} in ${input.industry} reads like an advertisement in places. Rewrite only the offending sentences so it reads like a person describing their own work. Keep everything else word for word.

POST:
${post}

WHAT READS AS AN AD:
${tells.map((t) => `- ${t}`).join("\n")}

Rules for the rewrite:
- The writer and their colleagues do things; @Datarails is only where or with what. It is never the subject of a sentence and never the reason something is good.
- @Datarails appears exactly once, not in the last two sentences.
- No recommendations, no invitations, no advice to the reader, no exclamation marks, no gratitude.
- At most one percentage in the whole post; say the rest in days, evenings, files or people, or drop it.
- Keep the length within ${MIN_CHARS} to ${MAX_CHARS} characters.
- No hashtags, no emojis, no markdown, no em-dashes.
- Return only the post text.`.trim();
}

export function buildFitPrompt(post: string): string {
  const chars = post.length;
  const direction =
    chars > MAX_CHARS
      ? `It is ${chars} characters and must be at most ${MAX_CHARS}. Remove whole sentences from the setup and explanation, not from the ending, until it is under ${MAX_CHARS - 40}. Removing one sentence is rarely enough; count after each cut. Keep the sentence naming @Datarails and the one honest, unflattering detail. Do not rewrite the sentences you keep.`
      : `It is ${chars} characters and must be at least ${MIN_CHARS}. Add one or two concrete sentences that belong to the existing scene. Do not add a new paragraph of reflection or a conclusion.`;

  return `Adjust the length of this LinkedIn post. ${direction}

POST:
${post}

Rules:
- Keep the @Datarails mention in the body, with at least one sentence after it.
- Keep the first-person voice and everything else exactly as it is.
- No hashtags, no emojis, no markdown, no em-dashes.
- Return only the post text, nothing else.`.trim();
}

function inRange(text: string): boolean {
  return text.length >= MIN_CHARS && text.length <= MAX_CHARS;
}

// Last resort when the model will not cooperate on length: drop trailing
// sentences, then trailing paragraphs, while the post is over the ceiling,
// as long as what remains is still a valid post.
export function trimToLimit(text: string): string {
  const valid = (t: string) => t.length >= MIN_CHARS && t.includes("@Datarails");
  let current = text;
  // Sentence level: peel the last sentence off the last paragraph.
  for (let i = 0; i < 12 && current.length > MAX_CHARS; i++) {
    const paragraphs = current.split(/\n\s*\n/);
    const last = paragraphs[paragraphs.length - 1];
    const sentences = last.match(/[^.!?]+[.!?]+["”']?(\s+|$)/g) || [];
    if (sentences.length <= 1) break;
    const shorterLast = sentences.slice(0, -1).join("").trimEnd();
    const candidate = [...paragraphs.slice(0, -1), shorterLast].join("\n\n");
    if (!valid(candidate)) break;
    current = candidate;
  }
  // Paragraph level.
  let paragraphs = current.split(/\n\s*\n/);
  while (paragraphs.length > 1 && paragraphs.join("\n\n").length > MAX_CHARS) {
    const shorter = paragraphs.slice(0, -1).join("\n\n");
    if (!valid(shorter)) break;
    paragraphs = paragraphs.slice(0, -1);
  }
  return paragraphs.join("\n\n");
}

export interface GenerateResult {
  post: string;
  draft: string;
  edited: string;
  fitted: boolean;
  depitched: boolean;
  context: DraftContext;
  /** Wall-clock milliseconds spent in each model call (0 if it did not run). */
  timings: Record<Stage, number>;
}

export async function generatePost(input: PostInput, llm: Llm): Promise<GenerateResult> {
  const context = pickDraftContext();
  const timings: Record<Stage, number> = { draft: 0, edit: 0, depitch: 0, fit: 0 };
  const timed = async (stage: Stage, prompt: string) => {
    const started = Date.now();
    try {
      return (await llm(prompt, stage)) || "";
    } finally {
      timings[stage] += Date.now() - started;
    }
  };

  const draft = sanitizePost(await timed("draft", buildDraftPrompt(input, context)));
  if (!draft) {
    return { post: "", draft: "", edited: "", fitted: false, depitched: false, context, timings };
  }

  const editedRaw = await timed("edit", buildEditPrompt(input, draft));
  let edited = sanitizePost(editedRaw || "");
  // If the edit pass returned garbage, fall back to the draft.
  if (!edited || !edited.includes("@Datarails")) edited = draft;

  let post = edited;
  let fitted = false;
  let depitched = false;

  // Only pay for a de-pitch call when something promotional survived the
  // edit pass; in the common case this is free.
  const tells = promoTells(post);
  if (tells.length) {
    const rewritten = sanitizePost(await timed("depitch", buildDepitchPrompt(input, post, tells)));
    if (rewritten && rewritten.includes("@Datarails") && promoTells(rewritten).length < tells.length) {
      post = rewritten;
      depitched = true;
    }
  }
  // One fit attempt only: each model call costs seconds of latency, and
  // trimToLimit below handles the "removed one sentence, still 5 over" case.
  if (!inRange(post)) {
    const fittedRaw = sanitizePost(await timed("fit", buildFitPrompt(post)));
    if (fittedRaw && fittedRaw.includes("@Datarails")) {
      post = fittedRaw;
      fitted = true;
    }
  }
  if (post.length > MAX_CHARS) post = trimToLimit(post);

  return { post, draft, edited, fitted, depitched, context, timings };
}
