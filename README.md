<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5ac8e67e-2186-4b19-afe5-5ea9879e1930

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Post generator

The generation pipeline lives in `lib/generator.ts` and is shared by the Vercel
function (`api/generate-post.ts`) and the local dev server (`server.ts`).
It runs three model calls at most: draft, edit, and a length-fit pass that
only fires when the edited post falls outside 600-800 characters. The model
is `gemini-3.8-flash` at a low thinking level (`lib/gemini.ts`); set
`GEMINI_MODEL` to override it. Every model
output goes through `lib/sanitize.ts`, which strips hashtags, markdown,
commentary, wrapping quotes and em-dashes before anything is returned.

### Checking output quality

`scripts/persona-run.ts` runs the real pipeline for a dozen finance personas
(role, industry, pains, outcomes, tone) so you can review the posts it makes:

```
GEMINI_API_KEY=... npm run personas        # 2 posts per persona into persona-output/
npm run personas:lint                      # mechanical checks on those posts
```

The lint (`lib/lint.ts`) flags length, hashtags, dashes, missing @Datarails,
banned vocabulary, flat sentence rhythm, fragment chains and the recurring
LinkedIn tells found in the last audit. Read the posts side by side as well;
the biggest tell is the same opening or phrase showing up across personas.

`npm test` runs the sanitizer and pipeline tests against a fake model.
