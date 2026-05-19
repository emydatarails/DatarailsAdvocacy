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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { profession, industry, style, specificMoment, keyOutcome } =
      req.body;

    const prompt = `
      You are an expert LinkedIn content creator helping a finance professional write an authentic post about their experience with Datarails.

      User Profile:
      - Profession: ${profession}
      - Industry: ${industry}
      - Preferred Style: ${style} (e.g., punchy, detailed, professional, casual)
      - Specific Moment: ${specificMoment} (A pain point that was solved)
      - Key Outcome: ${keyOutcome} (What changed for the better)

      LinkedIn Post Guidelines:
      1. MUST be written in the first person ("I").
      2. Reflect genuine, authentic experience. Avoid corporate jargon where possible, focus on human impact.
      3. MUST be at least 600 characters long to meet eligibility requirements.
      4. MUST tag Datarails explicitly using "@Datarails".
      5. Do NOT include specific financial data, screenshots, or dashboard images.
      6. Use the style: ${style}.
      7. Start with/Incorporate a "moment" of transformation (e.g., "Then vs. Now").
      8. Ensure the post is unique, creative, and does not follow a generic template. Every output should feel like a fresh personal story.
      9. CRITICAL: Do NOT use em-dashes (—) in the text. Use commas, semi-colons, colons, or standard dashes (-) instead.

      Reference Styles (Based on successful examples):
      - Style 1 (Mark Webster type): Focus on "moving parts" and how manual work was replaced by a clearer view across the business.
      - Style 2 (Skip Kastroll type): Focus on "Source of Truth" and how leadership now goes directly to the data instead of asking the finance team for more reports.

      Return ONLY the text of the LinkedIn post. No placeholders like "[Your Name]" — just the narrative content. (Note: The dash in this instruction is an example, do not use em-dashes in the actual post text).
    `.trim();

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "Failed to generate post.";
    res.json({ post: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate post. Please try again." });
  }
}
