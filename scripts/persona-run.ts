// Persona harness for the post generator.
//
// Runs the exact production pipeline (lib/generator.ts) for a set of
// realistic finance personas so the output can be reviewed for quality.
//
// Modes:
//   npx tsx scripts/persona-run.ts run [--count N] [--out DIR]
//       Calls Gemini (needs GEMINI_API_KEY) for every persona and writes
//       one JSON file per run plus a lint summary.
//   npx tsx scripts/persona-run.ts prompt --persona K --stage 1 [--seed S]
//       Prints the stage-1 (draft) prompt for persona K. The chosen
//       archetype/opening/trigger/voice is derived from the seed.
//   npx tsx scripts/persona-run.ts prompt --persona K --stage 2 --draft FILE
//       Prints the stage-2 (edit) prompt for a draft (after sanitizing it).
//   npx tsx scripts/persona-run.ts prompt --persona K --stage 3 --draft FILE
//       Prints the stage-3 (length fit) prompt for a post.
//   npx tsx scripts/persona-run.ts sanitize FILE
//       Prints the sanitized version of a post and its length.
//   npx tsx scripts/persona-run.ts lint DIR
//       Lints every *.txt / *.json post in DIR and prints a report.

import fs from "fs";
import path from "path";
import {
  buildDraftPrompt,
  buildEditPrompt,
  buildFitPrompt,
  generatePost,
  narrativeArchetypes,
  openingPatterns,
  postTriggers,
  sceneSeeds,
  writerVoices,
  type DraftContext,
  type PostInput,
} from "../lib/generator.js";
import { sanitizePost } from "../lib/sanitize.js";
import { lintPost } from "../lib/lint.js";

// Realistic personas that mirror what the wizard in src/App.tsx sends:
// profession + industry chips, 1-3 moments joined by ", ", 0-3 outcomes
// (with the metric text resolved) joined by ", ", and a style.
export const personas: Record<string, PostInput> = {
  fpa_saas_punchy: {
    profession: "FP&A Manager",
    industry: "SaaS",
    style: "punchy",
    specificMoment: "Month-end close taking multiple days, Spreadsheet version control nightmares",
    keyOutcome: "Saved 40% time on month-end close, Replaced 30+ manual spreadsheets",
  },
  controller_mfg_professional: {
    profession: "Controller",
    industry: "Manufacturing",
    style: "professional",
    specificMoment: "Manual consolidation from multiple systems, Errors found in critical board reports",
    keyOutcome: "Automated 80% of data consolidation, Faster, self-service board reporting",
  },
  cfo_healthcare_detailed: {
    profession: "CFO",
    industry: "Healthcare",
    style: "detailed",
    specificMoment: "Dreading unexpected CFO questions, Last minute notice for budget scenarios",
    keyOutcome: "Real-time visibility for leadership, Improved forecast accuracy by 20%",
  },
  analyst_retail_casual: {
    profession: "Finance Analyst",
    industry: "Retail",
    style: "casual",
    specificMoment: "Spreadsheet version control nightmares, rebuilding the same weekly sales report every Monday",
    keyOutcome: "Replaced 50+ manual spreadsheets",
  },
  findir_services_professional: {
    profession: "Finance Director",
    industry: "Services",
    style: "professional",
    specificMoment: "Month-end close taking multiple days, Manual consolidation from multiple systems",
    keyOutcome: "Saved 50% time on month-end close, Real-time visibility for leadership",
  },
  vpfin_realestate_punchy: {
    profession: "VP Finance",
    industry: "Real Estate",
    style: "punchy",
    specificMoment: "Last minute notice for budget scenarios, Errors found in critical board reports",
    keyOutcome: "Faster, self-service board reporting, Improved forecast accuracy by 30%",
  },
  controller_nonprofit_casual: {
    profession: "Controller",
    industry: "Nonprofit",
    style: "casual",
    specificMoment: "Manual consolidation from multiple systems, grant reporting pulled from four different systems",
    keyOutcome: "Automated 90% of data consolidation, Saved 60% time on month-end close",
  },
  fpa_manufacturing_detailed: {
    profession: "FP&A Manager",
    industry: "Manufacturing",
    style: "detailed",
    specificMoment: "Dreading unexpected CFO questions, Spreadsheet version control nightmares, Month-end close taking multiple days",
    keyOutcome: "Real-time visibility for leadership, Replaced 70+ manual spreadsheets, Improved forecast accuracy by 15%",
  },
  cfo_saas_punchy: {
    profession: "CFO",
    industry: "SaaS",
    style: "punchy",
    specificMoment: "Errors found in critical board reports",
    keyOutcome: "Faster, self-service board reporting",
  },
  analyst_healthcare_professional: {
    profession: "Finance Analyst",
    industry: "Healthcare",
    style: "professional",
    specificMoment: "Month-end close taking multiple days, Manual consolidation from multiple systems",
    keyOutcome: "Saved 35% time on month-end close",
  },
  findir_retail_casual: {
    profession: "Finance Director",
    industry: "Retail",
    style: "casual",
    specificMoment: "Last minute notice for budget scenarios, Dreading unexpected CFO questions",
    keyOutcome: "Real-time visibility for leadership, Improved forecast accuracy by 25%",
  },
  head_of_finance_ecommerce_detailed: {
    profession: "Head of Finance",
    industry: "E-commerce",
    style: "detailed",
    specificMoment: "Spreadsheet version control nightmares, Errors found in critical board reports, Month-end close taking multiple days",
    keyOutcome: "Saved 50% time on month-end close, Automated 85% of data consolidation",
  },
};

function seededPick<T>(arr: T[], seed: number, salt: number): T {
  // Small deterministic hash so a seed reproduces the same context.
  let h = (seed * 2654435761 + salt * 40503) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  return arr[h % arr.length];
}

export function contextForSeed(seed: number): DraftContext {
  return {
    archetype: seededPick(narrativeArchetypes, seed, 1),
    openingPattern: seededPick(openingPatterns, seed, 2),
    postTrigger: seededPick(postTriggers, seed, 3),
    writerVoice: seededPick(writerVoices, seed, 4),
    sceneSeed: seededPick(sceneSeeds, seed, 5),
  };
}

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

async function geminiLlm(prompt: string): Promise<string> {
  const { createGeminiLlm } = await import("../lib/gemini.js");
  return createGeminiLlm(process.env.GEMINI_API_KEY || "")(prompt);
}

async function main() {
  const mode = process.argv[2];

  if (mode === "prompt") {
    const key = arg("persona")!;
    const persona = personas[key];
    if (!persona) throw new Error(`Unknown persona ${key}. Known: ${Object.keys(personas).join(", ")}`);
    const stage = arg("stage", "1");
    if (stage === "1") {
      const seed = Number(arg("seed", "1"));
      const ctx = contextForSeed(seed);
      process.stdout.write(buildDraftPrompt(persona, ctx));
    } else if (stage === "2") {
      const draft = sanitizePost(fs.readFileSync(arg("draft")!, "utf8"));
      process.stdout.write(buildEditPrompt(persona, draft));
    } else {
      const post = sanitizePost(fs.readFileSync(arg("draft")!, "utf8"));
      process.stdout.write(buildFitPrompt(post));
    }
    return;
  }

  if (mode === "sanitize") {
    const out = sanitizePost(fs.readFileSync(process.argv[3], "utf8"));
    process.stdout.write(out);
    process.stderr.write(`\n[${out.length} chars]\n`);
    return;
  }

  if (mode === "lint") {
    const dir = process.argv[3];
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".txt") || f.endsWith(".json")).sort();
    const rows: string[] = [];
    let issues = 0;
    for (const f of files) {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const post = f.endsWith(".json") ? JSON.parse(raw).post : raw;
      const r = lintPost(post);
      issues += r.issues.length;
      rows.push(`${f}\n  chars=${r.chars} words=${r.words} sentences=${r.sentences} avgSentence=${r.avgSentenceWords.toFixed(1)} paragraphs=${r.paragraphs}\n  ${r.issues.length ? r.issues.map((i) => `! ${i}`).join("\n  ") : "ok"}`);
    }
    console.log(rows.join("\n"));
    console.log(`\n${files.length} posts, ${issues} issues`);
    return;
  }

  if (mode === "run") {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is required for run mode");
    const count = Number(arg("count", "1"));
    const out = arg("out", "persona-output")!;
    fs.mkdirSync(out, { recursive: true });
    for (const [key, persona] of Object.entries(personas)) {
      for (let i = 0; i < count; i++) {
        const result = await generatePost(persona, geminiLlm);
        const lint = lintPost(result.post);
        const file = path.join(out, `${key}_${i + 1}.json`);
        fs.writeFileSync(file, JSON.stringify({ persona, ...result, lint }, null, 2));
        console.log(`${file}: ${lint.chars} chars, ${lint.issues.length} issues`);
      }
    }
    return;
  }

  console.error("Usage: persona-run.ts run|prompt|lint ...");
  process.exit(1);
}

if (process.argv[1] && /persona-run\.ts$/.test(process.argv[1])) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
