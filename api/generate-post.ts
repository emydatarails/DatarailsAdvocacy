import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const narrativeArchetypes = [
  {
    name: "The Specific Tuesday",
    description:
      "Open with one hyper-specific, unglamorous scene - a late Tuesday, a pre-board scramble, a 2am spreadsheet crash. Make the reader feel like they were in that room. Build the entire post from that single moment. End by contrasting where things stand now.",
  },
  {
    name: "The Honest Admission",
    description:
      "Open with a vulnerable, candid confession about what the work was really like - the kind of thing finance pros say to each other privately but rarely post. Then show how that reality changed. No glossing over the hard parts.",
  },
  {
    name: "The Skeptic Turned Believer",
    description:
      "Start from a place of resistance or doubt. Something like: I've seen tools come and go. Or: I figured this was just another vendor promise. Take the reader on a journey of being genuinely proven wrong, step by step. Don't make it sound like a sales pitch - make it sound like a real mind-change.",
  },
  {
    name: "The Leadership Question",
    description:
      "Frame the whole story around one specific question a senior leader or board member asked - the kind that used to cause internal panic - and how answering it is now effortless. Show the shift in team confidence and dynamics, not just the software.",
  },
  {
    name: "The Number That Haunted Me",
    description:
      "Lead with one relatable, honest number - days lost, file versions, hours on a Sunday, late nights in a month. Not boasting, just honest. Let that number carry the emotional weight of the story, then take the reader through what changed it.",
  },
  {
    name: "The Team Story",
    description:
      "Make it about more than personal productivity. Talk about what changed for the people around you - the analyst who stopped dreading Mondays, the team lead who finally had weekends back, the CFO who stopped waiting on manual reports. Personal perspective, but human and zoomed out.",
  },
  {
    name: "Two Scenes",
    description:
      "Paint exactly two scenes: one from 'before' and one from 'now'. Don't list differences - make the reader feel both states. The before scene should be visceral and specific. The after scene should feel like exhaling. The contrast carries the whole post.",
  },
];

const styleInstructions: Record<string, string> = {
  punchy: `
FORMAT RULES FOR THIS STYLE:
- Short. Hard-hitting. Lots of white space between ideas.
- 1 to 4 word sentences for key beats. One longer sentence to carry the story.
- Every paragraph: 1-3 lines max. Then a line break.
- Start with something that stops the scroll - not a question, not "I was". A statement or a fragment.
- Think: rhythm like a boxer. Jab. Jab. Cross. Let the combo land.
- No long text blocks. People should want to keep scrolling down.`,

  professional: `
FORMAT RULES FOR THIS STYLE:
- Measured, structured, earns authority through specificity not jargon.
- Write like a senior leader who is comfortable being real.
- 3-5 sentence paragraphs with clear transitions between them.
- Show competence through the story itself - never through self-congratulation.
- Confident tone, but grounded. The outcome earns the credibility, not the adjectives.`,

  casual: `
FORMAT RULES FOR THIS STYLE:
- Write like a Slack message to a smart colleague who gets it.
- Informal but never flippant. It's okay to use "honestly," "look -", or "here's the thing."
- Short to medium paragraphs. Conversational rhythm throughout.
- Should feel like the person wrote this in 20 minutes because they just had to share it.
- Relatable over impressive. Connection over authority.`,

  detailed: `
FORMAT RULES FOR THIS STYLE:
- Full narrative arc: setup, tension, turning point, resolution, reflection.
- Give the reader the real texture of what daily work was like - before and after.
- Longer paragraphs are fine here. Small details make it feel true.
- End with a broader honest reflection or takeaway, not a call to action.
- This is the style for someone who wants to really tell their story.`,
};

const openingPatterns = [
  "Open cold, mid-scene. Don't set the stage — drop the reader into a specific moment as if they just walked in.",
  "Open with a specific number. Hours, versions, tabs, days. Let the number carry the whole weight of before.",
  "Open with a question your boss or CFO asked — one that used to cause real dread — and answer it in one sentence.",
  "Open with a task that used to ruin your weekend. Be specific: which day, which recurring nightmare.",
  "Open with one word or a short fragment. Then pause. Then expand from there slowly.",
  "Open with a comparison: two versions of the same moment, then vs. now. Keep it tight — two sentences max.",
  "Open with something a colleague said to you — just the quote, cold, no context yet.",
  "Open with what you noticed was different. Not the tool. The feeling. The absence of something stressful.",
  "Open with a physical detail — the relief, the quiet, the Tuesday that felt different from all the others.",
  "Open with an admission you'd only say to a peer, not a boss. Something vulnerable and real.",
  "Open with the moment you realized you'd been wrong about something for years.",
  "Open with a result that surprised even you — lead with the outcome, build backward to the story.",
];

const postTriggers = [
  "A colleague on your team asked how you handle deadlines so calmly now. You realized you had an actual answer.",
  "You just closed the books two days early and found yourself just... sitting with that.",
  "You saw someone post about spreadsheet chaos and muscle-memory made you type a reply before you stopped yourself.",
  "A junior analyst said something this morning that made you realize how much the team dynamic has shifted.",
  "Your CFO asked a scenario question on the fly and you answered it in under a minute. First time that's ever happened.",
  "It's Sunday afternoon and you're not dreading Monday. You've been trying to figure out how to explain that.",
  "You were updating your LinkedIn bio and realized your actual job has gotten quieter in ways that matter.",
  "A board meeting wrapped today and it was the least stressful one you can remember.",
  "A peer at a different company was venting about a problem you haven't had in months. You felt the urge to say something.",
  "You were onboarding a new hire and they asked how you do X — and the answer you gave surprised you.",
];

const writerVoices = [
  "You're precise and calm. Every sentence earns its place. You understate — the facts do the work.",
  "You're reflective and honest. You think out loud, admit what you got wrong, and don't wrap things up too neatly.",
  "You're a slow builder. You set a scene with texture before you get to the point. When the point lands, it lands.",
  "You're collegial — this is as much about your team as yourself. You can't tell your story without mentioning them.",
  "You're energized but not breathless. You're still a little surprised by how different things are.",
  "You're a skeptic at heart. It took a while for you to be convinced. You want the reader to know that.",
  "You're a leader who zooms out. Results matter, but team dynamics and culture changes matter more to you.",
  "You write like you talk — natural rhythm, a little dry, occasionally wry. You don't try to sound like a LinkedIn post.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { profession, industry, style, specificMoment, keyOutcome } =
      req.body;

    const archetype = pickRandom(narrativeArchetypes);
    const openingPattern = pickRandom(openingPatterns);
    const postTrigger = pickRandom(postTriggers);
    const writerVoice = pickRandom(writerVoices);
    const styleGuide =
      styleInstructions[style as string] || styleInstructions.professional;

    const prompt = `You are a ghostwriter. Your client is a ${profession} in the ${industry} industry. They want to post on LinkedIn about their real experience using Datarails. Your job is to write in their voice - not like a press release, not like a testimonial. Like a real person who sat down and just wrote something honest.

WHO YOU'RE WRITING FOR:
- Role: ${profession} in the ${industry} sector
- What was hard before: ${specificMoment}
- What changed: ${keyOutcome}
- Tone they want: ${style}

THIS PERSON'S VOICE:
${writerVoice}

WHAT PROMPTED THEM TO WRITE THIS TODAY:
${postTrigger}
Use this as invisible context that shapes the post's energy - don't state it literally, just let it inform the feeling behind why they're sharing now.

YOUR NARRATIVE APPROACH FOR THIS POST:
Use the "${archetype.name}" structure: ${archetype.description}

HOW TO OPEN THIS POST:
${openingPattern}
This opening instruction overrides any default you'd reach for. Commit to it fully.

${styleGuide}

HOW REAL PEOPLE WRITE (follow these closely):
- Finance professionals talk like smart humans, not like vendor case studies. Match that.
- Mix short punchy sentences with longer ones. Monotone rhythm kills a post.
- Starting with "And" or "But" is fine. People do it.
- Include one small honest moment - a frustration, a doubt, an admission. That's the thing that makes a post feel true instead of polished.
- Pick ONE specific, concrete scene to anchor the story. Not "meetings were stressful" - more like "I had 40 minutes to build a new scenario before the board call."
- Vary paragraph length based on the style guide above.
- Do NOT start with "I was" or "I remember" or "It was" - those are lazy openings. Honor the opening instruction above instead.

WORDS AND PHRASES TO NEVER USE:
game-changer, revolutionize, synergy, leverage (as a verb), streamline, empower, unlock potential, transform, journey, impactful, robust, cutting-edge, best-in-class, paradigm, holistic, seamless, effortless

DO NOT explain what Datarails is or does as a product. Just write about what changed for this person and their team.

HARD REQUIREMENTS:
- Written in first person ("I") throughout
- Tag @Datarails naturally inside the post body - woven in, not stapled on at the end
- Between 600 and 800 characters total (no more, no less)
- Zero em-dashes (—). Use commas, colons, semi-colons, or a plain hyphen (-) instead
- No bracket placeholders like [Your Name] or [Company]
- 3-4 relevant hashtags at the very end only, if used at all
- Return ONLY the post text. No titles, no commentary, no explanations.`.trim();

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const draft = response.text || "";
    if (!draft) {
      return res.json({ post: "Failed to generate post." });
    }

    // Humanization pass — 8-pass editing process based on the humanize-writing skill
    const humanizePrompt = `You are an expert editor who specializes in detecting and removing AI writing patterns. You've been given a LinkedIn post draft. Rewrite it so it sounds like a real finance professional typed it themselves — not a language model, not a PR team.

AI writing has a recognizable smell: predictable structure, hedge-then-assert phrasing, relentless parallelism, significance inflation, and a tendency to wrap everything in a tidy bow. Human writing is messier, more opinionated, and varies in rhythm. Your job is not to dumb it down — it's to make it sound like it came from someone who actually lived this and has opinions about it.

DRAFT TO EDIT:
${draft}

Run all 8 passes below, in order. Only change what each pass targets.

--- PASS 1: KILL STRUCTURE TELLS ---
LinkedIn posts can still be formulaic. Look for:
- Every paragraph following the same shape (setup, point, mini-conclusion)
- A tidy "what this means" wrapper at the end that sounds like a press release
- Perfectly balanced before/after contrasts that feel engineered, not remembered
Fix: Let some thoughts end abruptly. Not everything needs a bow on it. If the conclusion feels like a bumper sticker, cut it or make it more specific.

--- PASS 2: STRIP SIGNIFICANCE INFLATION ---
Delete or replace any of these patterns:
- "stands/serves as a testament to", "a vital/significant/crucial/pivotal role/moment"
- "underscores/highlights its importance", "reflects broader", "setting the stage for"
- "marking/shaping the", "represents a shift", "key turning point", "evolving landscape"
- "indelible mark", "deeply rooted", "commitment to"
- Promotional puffery: "vibrant", "profound", "nestled", "in the heart of", "groundbreaking", "renowned"
The fix is NOT a synonym. Replace with a specific fact, or delete entirely.

--- PASS 3: REPLACE AI VOCABULARY ---
TIER 1 — immediate red flags, always replace:
delve, landscape (metaphorical), tapestry, paradigm shift, leverage (verb), harness, navigate (metaphorical), realm, embark on a journey, myriad, plethora, multifaceted, groundbreaking, revolutionize, synergy, ecosystem (non-technical), resonate, streamline, testament, enduring

TIER 2 — replace if 3+ appear in this short post:
robust, seamless, cutting-edge, innovative, comprehensive, pivotal, nuanced, compelling, transformative, bolster, underscore, evolving, fostering, imperative, intricate, overarching, unprecedented, vibrant, profound, renowned, showcasing, exemplifies, garner, valuable

The fix is often NOT a synonym — restructure the sentence.

--- PASS 4: FIX GRAMMAR-LEVEL PATTERNS ---
Copula avoidance: if "serves as", "stands as", "represents", "boasts", "features" are clustering (used more than once), replace with "is"/"are"/"has".
Superficial -ing phrases: delete tacked-on participle phrases like "highlighting the importance of...", "underscoring the need for...", "reflecting the broader trend...", "showcasing how...", "contributing to..." — or expand them into their own sentence.
Negative parallelisms: "It's not just about X, it's about Y" — fine once, AI uses it like punctuation. Cut extras.
Synonym cycling: if the post uses different words for the same concept ("change... shift... evolution... transition" all in one short post), pick the best one and stick with it.

--- PASS 5: FIX RHYTHM AND STYLE ---
AI writes in metronomic cadence: medium sentence, medium sentence, medium sentence. Fix this hard.
- Add short punchy sentences (under 8 words). "That changed." "It works." "Not anymore."
- Let some sentences run longer when the idea needs room.
- Start some sentences with "But," "And," "So," or "Look," — humans do this.
- Use fragments occasionally if the context is informal.
- Count em-dashes: if any remain in the draft, replace them with commas, colons, or a plain hyphen.

--- PASS 6: CUT HEDGING, FILLER, AND VAGUE ATTRIBUTIONS ---
Remove:
- "It's worth noting that..." / "It's important to note..." → just state the thing
- "While there are certainly..." / "To be sure..." / "That said..." → pick a side or delete
- "In order to" → "To" | "Due to the fact that" → "Because" | "Has the ability to" → "Can"
- Generic positive closers: "The future looks bright", "Exciting times lie ahead", "Only time will tell"
Just say the thing. One hedge per post is fine. Three is AI.

--- PASS 7: FIX CONNECTIVE TISSUE ---
Replace or remove AI's favorite transitions:
- "Moreover" / "Furthermore" / "Additionally" → drop entirely or use "And" / "But" / "So"
- "In conclusion" / "To sum up" → just start the final thought
- "That being said" / "With that in mind" / "Moving forward" / "When it comes to" → cut or rewrite
Often you don't need a transition at all. Let paragraph breaks do the work.

--- PASS 8: ADD HUMAN TEXTURE AND SOUL ---
Sterile, clean writing is still obviously AI. Add:
- At least one opinion or reaction — not neutral reporting, a perspective. "I genuinely didn't think it would matter this much." "Turns out I was wrong."
- One moment of lived texture — something specific and slightly informal. A day. A feeling. A detail that only someone who was there would mention.
- Vary the voice: a dry observation, a blunt statement after a complex one, one sentence that sounds like something you'd say out loud.
Do NOT overdo it. One or two human touches per short post is enough. Don't add slang or try to be hip.

--- HARD REQUIREMENTS (preserve exactly, no exceptions) ---
- First person ("I") throughout
- @Datarails tag must stay in the body, exactly where it is — do not move it to the end
- Total character count must stay between 600 and 800 characters (count carefully)
- Zero em-dashes (—) anywhere — use commas, colons, semi-colons, or a plain hyphen (-) instead
- No bracket placeholders like [Name] or [Company]
- Hashtags stay at the very end only, exactly as they appear in the draft
- Return ONLY the final post text. No "Here is the revised version:", no commentary, no explanation.`.trim();

    const humanized = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: humanizePrompt,
    });

    const text = humanized.text || draft;
    res.json({ post: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate post. Please try again." });
  }
}
