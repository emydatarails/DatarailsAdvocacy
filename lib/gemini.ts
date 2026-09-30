// Gemini adapter shared by the Vercel function and the dev server.
//
// Each pipeline step is a separate request, so a single slow call cannot be
// allowed to run for minutes: the client gives up on the HTTP request after
// PER_CALL_TIMEOUT_MS. Thinking is set to low because the prompts do all the
// steering and a long reasoning phase only adds latency for a short post.

import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { Llm } from "./generator.js";

export const MODEL = "gemini-3-flash-preview";
export const PER_CALL_TIMEOUT_MS = 40_000;

export function createGeminiLlm(apiKey: string): Llm {
  const genAI = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" },
      timeout: PER_CALL_TIMEOUT_MS,
    },
  });

  const call = async (prompt: string, withThinkingConfig: boolean) => {
    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: withThinkingConfig
        ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
        : undefined,
    });
    return response.text || "";
  };

  return async (prompt: string) => {
    try {
      return await call(prompt, true);
    } catch (err) {
      // If this model version rejects the thinking config, retry without it
      // rather than failing the whole generation.
      const message = err instanceof Error ? err.message : String(err);
      if (/thinking/i.test(message)) {
        console.warn("Retrying without thinkingConfig:", message);
        return await call(prompt, false);
      }
      throw err;
    }
  };
}
