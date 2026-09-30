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
//   npx tsx scripts/persona-run.ts prompt --persona K --stage depitch --draft FILE
//       Prints the de-pitch prompt for a post, or says it would not run.
//   npx tsx scripts/persona-run.ts prompt --persona K --stage 3 --draft FILE
//       Prints the stage-3 (length fit) prompt for a post.
//   npx tsx scripts/persona-run.ts sanitize FILE
//       Prints the sanitized version of a post and its length.
//   npx tsx scripts/persona-run.ts lint DIR
//       Lints every *.txt / *.json post in DIR and prints a report.
//   npx tsx scripts/persona-run.ts bench [--configs minimal,low,medium,high,draft=medium+edit=low+fit=minimal]
//                                        [--personas 4] [--seeds 1] [--judge] [--out bench-output]
//       Runs the full pipeline for each thinking configuration and reports
//       latency per stage, length-fit rate, lint issues and (with --judge) a
//       blind 1-10 naturalness score from the model, so the thinking level
//       can be chosen on evidence. Needs GEMINI_API_KEY.

import fs from "fs";
import path from "path";
import {
  buildDraftPrompt,
  buildDepitchPrompt,
  buildEditPrompt,
  buildFitPrompt,
  generatePost,
  narrativeArchetypes,
  openingPatterns,
  postTriggers,
  sceneSeeds,
  mentionStyles,
  writerVoices,
  type DraftContext,
  type PostInput,
} from "../lib/generator.js";
import { sanitizePost } from "../lib/sanitize.js";
import { lintPost, promoTells } from "../lib/lint.js";

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
    mentionStyle: seededPick(mentionStyles, seed, 6),
  };
}

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

async function geminiLlm(): Promise<import("../lib/generator.js").Llm> {
  const { createGeminiLlm } = await import("../lib/gemini.js");
  return createGeminiLlm(process.env.GEMINI_API_KEY || "");
}

// Blind quality judge. Scores are only comparable within one bench run and
// one judge model; they are a tie-breaker for reading the posts, not a
// replacement for it.
export function buildJudgePrompt(post: string): string {
  return `You are a finance professional who spends a lot of time on LinkedIn and has a sharp eye for posts written by AI tools. Read the post below and score it.

POST:
${post}

Score three things from 1 to 10:
- natural: does this read like a specific person typed it, as opposed to a template or a model? 10 means you would not suspect a tool.
- specific: are the details concrete and plausible for this person's job (systems, reports, timing, who was waiting)? 10 means every detail could only come from someone who does this work.
- restraint: is it free of marketing tone, stacked outcomes and slogan endings? 10 means nothing reads like a vendor wrote it.

Also list up to five short phrases from the post that read as AI or LinkedIn cliches, or an empty list.

Return only JSON: {"natural": n, "specific": n, "restraint": n, "tells": ["..."]}`;
}

interface BenchRow {
  config: string;
  persona: string;
  seed: number;
  chars: number;
  totalMs: number;
  draftMs: number;
  editMs: number;
  fitMs: number;
  fitted: boolean;
  lintIssues: string[];
  judge?: { natural: number; specific: number; restraint: number; tells: string[] };
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}
function p95(xs: number[]): number {
  if (!xs.length) return 0;
  const sorted = [...xs].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
}

async function bench() {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is required for bench mode");
  const { createGeminiLlm, parseThinkingPlan, resolveModel } = await import("../lib/gemini.js");
  const configs = (arg("configs", "minimal,low,medium,high,draft=medium+edit=low+fit=minimal") as string)
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const personaCount = Number(arg("personas", "4"));
  const seeds = Number(arg("seeds", "1"));
  const judge = process.argv.includes("--judge");
  const out = arg("out", "bench-output")!;
  const model = resolveModel();
  fs.mkdirSync(out, { recursive: true });

  const chosen = Object.entries(personas).slice(0, personaCount);
  const rows: BenchRow[] = [];
  const judgeLlm = judge ? createGeminiLlm(process.env.GEMINI_API_KEY!, { thinking: parseThinkingPlan("high") }) : null;

  for (const config of configs) {
    const plan = parseThinkingPlan(config);
    const llm = createGeminiLlm(process.env.GEMINI_API_KEY!, { thinking: plan });
    const dir = path.join(out, config.replace(/[^a-z0-9=]+/gi, "_"));
    fs.mkdirSync(dir, { recursive: true });
    for (const [key, persona] of chosen) {
      for (let seed = 1; seed <= seeds; seed++) {
        const started = Date.now();
        const result = await generatePost(persona, llm);
        const totalMs = Date.now() - started;
        const lint = lintPost(result.post);
        const row: BenchRow = {
          config,
          persona: key,
          seed,
          chars: result.post.length,
          totalMs,
          draftMs: result.timings.draft,
          editMs: result.timings.edit,
          fitMs: result.timings.fit,
          fitted: result.fitted,
          lintIssues: lint.issues,
        };
        if (judgeLlm && result.post) {
          try {
            const raw = await judgeLlm(buildJudgePrompt(result.post), "edit");
            const json = raw.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();
            row.judge = JSON.parse(json);
          } catch (e) {
            console.warn(`judge failed for ${config}/${key}: ${e}`);
          }
        }
        rows.push(row);
        fs.writeFileSync(path.join(dir, `${key}_${seed}.json`), JSON.stringify({ persona, plan, ...result, ...row }, null, 2));
        fs.writeFileSync(path.join(dir, `${key}_${seed}.txt`), result.post);
        console.log(
          `${config.padEnd(34)} ${key.padEnd(36)} ${String(totalMs).padStart(6)}ms ` +
            `(d ${result.timings.draft} / e ${result.timings.edit} / p ${result.timings.depitch} / f ${result.timings.fit})  ` +
            `${result.post.length} chars  ${lint.issues.length} lint` +
            (row.judge ? `  judge ${row.judge.natural}/${row.judge.specific}/${row.judge.restraint}` : ""),
        );
      }
    }
  }

  // Summary table.
  const lines: string[] = [];
  lines.push(`# Thinking level benchmark`);
  lines.push(``);
  lines.push(`Model: ${model}. ${chosen.length} personas x ${seeds} seed(s) per configuration. Times are wall-clock seconds.`);
  lines.push(``);
  const judgeCols = judge ? ` natural | specific | restraint | tells/post |` : ``;
  lines.push(`| config | mean total | p95 total | draft | edit | fit | needed fit | lint issues/post |${judgeCols}`);
  lines.push(`|---|---|---|---|---|---|---|---|${judge ? "---|---|---|---|" : ""}`);
  for (const config of configs) {
    const rs = rows.filter((r) => r.config === config);
    const sec = (ms: number) => (ms / 1000).toFixed(1);
    const cells = [
      config,
      sec(mean(rs.map((r) => r.totalMs))),
      sec(p95(rs.map((r) => r.totalMs))),
      sec(mean(rs.map((r) => r.draftMs))),
      sec(mean(rs.map((r) => r.editMs))),
      sec(mean(rs.filter((r) => r.fitted).map((r) => r.fitMs))),
      `${rs.filter((r) => r.fitted).length}/${rs.length}`,
      mean(rs.map((r) => r.lintIssues.length)).toFixed(2),
    ];
    if (judge) {
      const js = rs.map((r) => r.judge).filter(Boolean) as NonNullable<BenchRow["judge"]>[];
      cells.push(
        mean(js.map((j) => j.natural)).toFixed(1),
        mean(js.map((j) => j.specific)).toFixed(1),
        mean(js.map((j) => j.restraint)).toFixed(1),
        mean(js.map((j) => j.tells.length)).toFixed(1),
      );
    }
    lines.push(`| ${cells.join(" | ")} |`);
  }
  lines.push(``);
  lines.push(`## Posts side by side`);
  for (const [key] of chosen) {
    lines.push(``, `### ${key}`);
    for (const config of configs) {
      const r = rows.find((x) => x.config === config && x.persona === key && x.seed === 1);
      if (!r) continue;
      const text = fs.readFileSync(path.join(out, config.replace(/[^a-z0-9=]+/gi, "_"), `${key}_1.txt`), "utf8");
      lines.push(``, `**${config}** (${(r.totalMs / 1000).toFixed(1)}s, ${r.chars} chars${r.judge ? `, judge ${r.judge.natural}/${r.judge.specific}/${r.judge.restraint}` : ""})`, ``, text.split("\n").map((l) => `> ${l}`).join("\n"));
      if (r.judge?.tells.length) lines.push(``, `> tells: ${r.judge.tells.join(" | ")}`);
    }
  }
  fs.writeFileSync(path.join(out, "summary.md"), lines.join("\n"));
  fs.writeFileSync(path.join(out, "rows.json"), JSON.stringify(rows, null, 2));
  console.log(`\nWrote ${path.join(out, "summary.md")}`);
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
    } else if (stage === "depitch") {
      const post = sanitizePost(fs.readFileSync(arg("draft")!, "utf8"));
      const tells = promoTells(post);
      if (!tells.length) {
        process.stderr.write("no promo tells; de-pitch pass would not run\n");
        return;
      }
      process.stdout.write(buildDepitchPrompt(persona, post, tells));
    } else {
      const post = sanitizePost(fs.readFileSync(arg("draft")!, "utf8"));
      process.stdout.write(buildFitPrompt(post));
    }
    return;
  }

  if (mode === "sanitize") {
    const out = sanitizePost(fs.readFileSync(process.argv[3], "utf8"));
    process.stdout.write(out);
    const tells = promoTells(out);
    process.stderr.write(`\n[${out.length} chars${tells.length ? `; promo tells: ${tells.join(" | ")}` : ""}]\n`);
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

  if (mode === "bench") {
    await bench();
    return;
  }

  if (mode === "run") {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is required for run mode");
    const llm = await geminiLlm();
    const count = Number(arg("count", "1"));
    const out = arg("out", "persona-output")!;
    fs.mkdirSync(out, { recursive: true });
    for (const [key, persona] of Object.entries(personas)) {
      for (let i = 0; i < count; i++) {
        const result = await generatePost(persona, llm);
        const lint = lintPost(result.post);
        const file = path.join(out, `${key}_${i + 1}.json`);
        fs.writeFileSync(file, JSON.stringify({ persona, ...result, lint }, null, 2));
        console.log(`${file}: ${lint.chars} chars, ${lint.issues.length} issues`);
      }
    }
    return;
  }

  console.error("Usage: persona-run.ts run|bench|prompt|sanitize|lint ...");
  process.exit(1);
}

if (process.argv[1] && /persona-run\.ts$/.test(process.argv[1])) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
