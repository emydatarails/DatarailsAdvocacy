import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generatePost, type PostInput } from "../lib/generator.js";
import { createGeminiLlm } from "../lib/gemini.js";

// The pipeline makes up to three model calls of at most 40s each.
export const maxDuration = 120;

const gemini = createGeminiLlm(process.env.GEMINI_API_KEY || "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const input = req.body as PostInput;
    const { post } = await generatePost(input, gemini);
    if (!post) {
      return res.json({ post: "Failed to generate post." });
    }
    res.json({ post });
  } catch (error) {
    console.error("Gemini Error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate post. Please try again." });
  }
}
