import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
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

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// API Routes
app.post("/api/generate-post", async (req, res) => {
  try {
    const { profession, industry, style, specificMoment, keyOutcome } = req.body;

    const archetype = pickRandom(narrativeArchetypes);
    const styleGuide = styleInstructions[style as string] || styleInstructions.professional;

    const prompt = `You are a ghostwriter. Your client is a ${profession} in the ${industry} industry. They want to post on LinkedIn about their real experience using Datarails. Your job is to write in their voice - not like a press release, not like a testimonial. Like a real person who sat down and just wrote something honest.

WHO YOU'RE WRITING FOR:
- Role: ${profession} in the ${industry} sector
- What was hard before: ${specificMoment}
- What changed: ${keyOutcome}
- Tone they want: ${style}

YOUR NARRATIVE APPROACH FOR THIS POST:
Use the "${archetype.name}" structure: ${archetype.description}

${styleGuide}

HOW REAL PEOPLE WRITE (follow these closely):
- Finance professionals talk like smart humans, not like vendor case studies. Match that.
- Mix short punchy sentences with longer ones. Monotone rhythm kills a post.
- Starting with "And" or "But" is fine. People do it.
- Include one small honest moment - a frustration, a doubt, an admission. That's the thing that makes a post feel true instead of polished.
- Pick ONE specific, concrete scene to anchor the story. Not "meetings were stressful" - more like "I had 40 minutes to build a new scenario before the board call."
- Vary paragraph length based on the style guide above.

WORDS AND PHRASES TO NEVER USE:
game-changer, revolutionize, synergy, leverage (as a verb), streamline, empower, unlock potential, transform, journey, impactful, robust, cutting-edge, best-in-class, paradigm, holistic

DO NOT explain what Datarails is or does as a product. Just write about what changed for this person and their team.

HARD REQUIREMENTS:
- Written in first person ("I") throughout
- Tag @Datarails naturally inside the post body - woven in, not stapled on at the end
- Minimum 600 characters total
- Zero em-dashes (—). Use commas, colons, semi-colons, or a plain hyphen (-) instead
- No bracket placeholders like [Your Name] or [Company]
- 3-4 relevant hashtags at the very end only, if used at all
- Return ONLY the post text. No titles, no commentary, no explanations.`.trim();

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "Failed to generate post.";
    res.json({ post: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate post. Please try again." });
  }
});

app.post("/api/submit-post", (req, res) => {
  // In a real app, this would save to a database
  console.log("Form Submission Received:", req.body);
  res.json({ success: true, message: "Post submitted successfully! We'll review it within 2 business days." });
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
