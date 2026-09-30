// Gemini adapter shared by the Vercel function, the dev server and the
// persona harness.
//
// Each pipeline step is a separate request, so a single slow call cannot be
// allowed to run for minutes: the client gives up on the HTTP request after
// PER_CALL_TIMEOUT_MS.
//
// Thinking level is set per stage. The draft is the only step where extra
// reasoning can improve the post; the edit and fit passes are mechanical and
// gain nothing from it but latency. Tune with the environment variables
// below, and measure with `npm run bench` before changing the defaults.

import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { Llm, Stage } from "./generator.js";

// Newest generally available Flash model as of September 2026. The Pro line
// is still preview, several times the price and slower, which matters here:
// the pipeline is three sequential calls for a 700-character post, so Flash
// at a low thinking level is the better fit. Override with GEMINI_MODEL.
export const DEFAULT_MODEL = "gemini-3.8-flash";
export const PER_CALL_TIMEOUT_MS = 40_000;

export type ThinkingName = "minimal" | "low" | "medium" | "high";
export type ThinkingPlan = Record<Stage, ThinkingName>;

// Draft gets a little reasoning for scene selection; edit and fit are
// rewrite-and-count jobs.
export const DEFAULT_THINKING: ThinkingPlan = { draft: "low", edit: "low", fit: "minimal" };

const LEVELS: Record<ThinkingName, ThinkingLevel> = {
  minimal: ThinkingLevel.MINIMAL,
  low: ThinkingLevel.LOW,
  medium: ThinkingLevel.MEDIUM,
  high: ThinkingLevel.HIGH,
};

export function isThinkingName(value: string): value is ThinkingName {
  return value in LEVELS;
}

export function resolveModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

/**
 * Thinking plan from the environment:
 *   GEMINI_THINKING            one level for every stage
 *   GEMINI_THINKING_DRAFT      per-stage overrides
 *   GEMINI_THINKING_EDIT
 *   GEMINI_THINKING_FIT
 * Unknown values are ignored so a typo cannot break generation.
 */
export function resolveThinking(env: NodeJS.ProcessEnv = process.env): ThinkingPlan {
  const plan: ThinkingPlan = { ...DEFAULT_THINKING };
  const all = env.GEMINI_THINKING?.trim().toLowerCase();
  if (all && isThinkingName(all)) {
    plan.draft = plan.edit = plan.fit = all;
  }
  for (const stage of ["draft", "edit", "fit"] as const) {
    const v = env[`GEMINI_THINKING_${stage.toUpperCase()}`]?.trim().toLowerCase();
    if (v && isThinkingName(v)) plan[stage] = v;
  }
  return plan;
}

/** Parses "low" or "draft=medium,edit=low,fit=minimal" into a plan. */
export function parseThinkingPlan(spec: string): ThinkingPlan {
  const plan: ThinkingPlan = { ...DEFAULT_THINKING };
  const trimmed = spec.trim().toLowerCase();
  if (isThinkingName(trimmed)) {
    plan.draft = plan.edit = plan.fit = trimmed;
    return plan;
  }
  for (const part of trimmed.split(",")) {
    const [stage, level] = part.split("=").map((x) => x.trim());
    if ((stage === "draft" || stage === "edit" || stage === "fit") && level && isThinkingName(level)) {
      plan[stage] = level;
    } else {
      throw new Error(`Bad thinking spec "${spec}". Use a level (minimal|low|medium|high) or draft=..,edit=..,fit=..`);
    }
  }
  return plan;
}

export interface GeminiOptions {
  model?: string;
  thinking?: ThinkingPlan;
}

export function createGeminiLlm(apiKey: string, options: GeminiOptions = {}): Llm {
  const model = options.model || resolveModel();
  const thinking = options.thinking || resolveThinking();
  const genAI = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" },
      timeout: PER_CALL_TIMEOUT_MS,
    },
  });

  const call = async (prompt: string, stage: Stage, withThinkingConfig: boolean) => {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: withThinkingConfig
        ? { thinkingConfig: { thinkingLevel: LEVELS[thinking[stage]] } }
        : undefined,
    });
    return response.text || "";
  };

  return async (prompt: string, stage: Stage) => {
    try {
      return await call(prompt, stage, true);
    } catch (err) {
      // If this model version rejects the thinking config, retry without it
      // rather than failing the whole generation.
      const message = err instanceof Error ? err.message : String(err);
      if (/thinking/i.test(message)) {
        console.warn(`Retrying ${stage} without thinkingConfig:`, message);
        return await call(prompt, stage, false);
      }
      throw err;
    }
  };
}
