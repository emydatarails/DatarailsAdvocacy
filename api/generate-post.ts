import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import { generatePost, type PostInput } from "../lib/generator";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function gemini(prompt: string): Promise<string> {
  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text || "";
}

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
