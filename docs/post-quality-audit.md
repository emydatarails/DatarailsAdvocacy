# Post generator quality audit

Date: 2026-09-30. Method: `scripts/persona-run.ts` built the exact production
prompts for 12 finance personas (FP&A manager, controller, CFO, finance
director, VP finance, analyst, head of finance, across SaaS, manufacturing,
healthcare, retail, services, real estate, nonprofit and e-commerce; all four
tones), two seeds each. No Gemini key was available in the session, so a
Claude model stood in for Gemini and executed each stage prompt literally.
Repeated tropes come from the prompts, not the model, so the findings carry
over; absolute quality of any single post should be re-checked with
`GEMINI_API_KEY=... npm run personas` before trusting it.

## Baseline (prompts before this change), 24 posts

Mechanical failures:

| Check | Posts failing |
|---|---|
| Hashtags present | 24 of 24 |
| Over 800 characters | 8 of 24 (all professional/detailed) |
| Verbatim example sentence from the edit prompt | 3 of 24 |

Repetition across personas, which is the real "these came from one machine"
tell once dozens of employees post:

| Trope | Posts |
|---|---|
| "Honestly," | 10 |
| "Tuesday" as the anchor day | 9 |
| A lone number or word as the first line ("Eleven.", "Seventeen.") | 6 |
| "the quiet" / "quieter" as the payoff | 6 |
| File-name joke (v7_FINAL, use_this_one) | 5 |
| "the room" / "It was the room" | 5 |
| "I still catch myself" / "old habits" | 3 |
| "Turns out I was wrong", "I genuinely didn't think" (copied from the edit prompt's examples) | 3 |

Causes found in the prompts:

- Hashtags were explicitly allowed ("3-4 relevant hashtags at the very end").
- The prompts contained em-dashes while forbidding them.
- The edit prompt gave quotable example sentences, which were copied.
- "Tuesday", "quiet", "a number" and "a CFO question" each appeared in two
  or three of the random lists (archetypes, openings, triggers), so most
  combinations produced the same scene.
- The "casual" style suggested "honestly" and "look" by name.
- The "punchy" style asked for boxer rhythm, producing fragment chains.
- The edit pass had no persona context and no length target, and its
  "add texture" step grew posts by 20 to 80 characters.
- Inputs contain up to three percentages, and posts quoted all of them,
  reading like a slide.

## Round 2 (new prompts, same 24 persona/seed pairs)

| Trope | Baseline | Round 2 |
|---|---|---|
| Hashtags | 24 | 0 (stripped in code as well) |
| "Honestly," | 10 | 0 |
| "Tuesday" | 9 | 1 |
| File-name joke | 5 | 0 |
| "old habits" | 3 | 0 |
| "the room" | 5 | 0 |
| Copied example sentences | 3 | 0 |
| Distinct opening lines | 18 of 24 | 24 of 24 |

New cluster: "For years I assumed..." / "I used to believe..." opened 7
posts, from two opening patterns that rendered the same way. Merged into one
pattern that forbids those first words.

Length: stage-1 drafts still ran 830 to 1070 characters in the professional
and detailed styles. The edit pass cut too little because it was told to be
light-touch, and two posts ended at 803 and 807 after one fit pass. Fixes:
budget in words (105 to 125) with a fixed paragraph count per style, put
length first in the edit prompt with a concrete number of sentences to cut,
run the fit pass up to twice, and peel trailing sentences in code before
dropping paragraphs.

## What the code now guarantees regardless of the model

`lib/sanitize.ts` runs on every model output: hashtag lines and inline
hashtags removed, markdown and code fences removed, "Here is the post"
preambles and character-count footers removed, wrapping quotes removed,
em/en dashes replaced, whitespace normalised. `generatePost` then enforces
600-800 characters with a fit pass and a trim fallback that never drops the
sentence carrying @Datarails. `npm test` covers all of it with a
deliberately misbehaving fake model.

## Round 3 (verification of the length fix)

See the table appended below.

12 fresh seeds, weighted toward the professional and detailed styles that
overshot before:

| Metric | Round 2 (24 posts) | Round 3 (12 posts) |
|---|---|---|
| Final length inside 600-800 | 21 of 23 | 12 of 12 |
| Final length range | 654 to 807 | 702 to 794 |
| Needed a fit pass | 15 | 2 |
| Lint issues | 6 | 0 |
| Any trope from the baseline table | 5 posts | 0 posts |

Stage-1 drafts still run long for the detailed and casual styles (up to 990
characters), so the edit pass does real length work; that is acceptable
because it now lands inside the window on its own in 10 of 12 runs.

One new pair of near-identical openings ("...and I only counted them when
I sat down") came from the "count of something mundane" pattern; its
wording was adjusted after this round.

## How to re-run

```
GEMINI_API_KEY=... npm run personas      # real model, 24 posts
npm run personas:lint
```

Read the posts side by side. The lint catches mechanics; the eye catches
sameness.

## Thinking level: quality versus wait time

The pipeline is three sequential model calls, so the user's wait is the sum
of three latencies. Thinking level is the main lever on each. Expectations,
to be confirmed with `npm run bench` against the live model:

| Stage | What thinking buys | Recommended |
|---|---|---|
| Draft | Picking a coherent scene from the persona, archetype, opening and seed; keeping to the word budget | `low` by default; try `medium` if drafts feel generic |
| Edit | Removing template moves and cutting to length: a rewrite-and-count job | `low` |
| Fit | Removing whole sentences to a count | `minimal` |

`high` everywhere is the wrong trade: it multiplies latency on the two
mechanical passes for no quality gain, and the draft prompt already carries
the creative constraints. The mixed `draft=medium+edit=low+fit=minimal`
configuration is the one to compare against the all-`low` default.

The wizard's overlay now names the stage as time passes (draft, editing,
trimming) so a 20 to 40 second wait reads as progress.
