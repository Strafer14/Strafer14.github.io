# CV Tailoring — Handoff Plan

**Mission:** let Michael generate a CV tailored to a specific job listing — the
right subset of achievements, reworded to fit, as a PDF — from one canonical
**Achievement Bank**. Some achievements (e.g. the React/frontend migrations) are
irrelevant for a given role and should drop out; others should lead.

This document hands off from the *design + bank-build* agent (done) to the
*skill + integration* agent (you).

---

## Status

**Done (previous agent):**
- Design pinned through a grilling session. Decisions recorded in
  `docs/adr/0001`–`0004` and the glossary in `CONTEXT.md`. **Read those first.**
- Built the Bank: **`src/data/achievements.ts`** — merged from `src/data/resume.ts`
  (vetted phrasings), `src/data/past.md` (raw older-role facts), and the Obsidian
  *Career Timeline — Tastewise* note (authoritative Tastewise facts). Achievements
  are tagged with `tags` / `strength` / `core`. Type-checks clean.

**Not done (your DoD — see below):** wiring the Bank into the site, and building
the tailoring skill. The previous agent deliberately did **not** touch the site.

---

## The model (the rules you must honor)

- **ADR-0001** — the Bank is the single source of truth; the website and every
  **CV Variant** are *views* over it. No content lives in two editable places.
- **ADR-0003** (supersedes 0002) — when tailoring, an LLM **may re-word** a
  selected achievement to fit a listing, but **only at the output layer**: it
  must not change a number/metric, broaden a claim, swap the named tech, or add
  anything not in the canonical text. It **never writes back to the Bank**.
  **Michael reviews and approves every Variant — no automatic send.** He is the
  honesty check.
- **ADR-0004** — the Bank is a structured in-repo data file (TS), not markdown
  or an external service.
- **CONTEXT.md** — canonical terms: Achievement, Achievement Bank, View, CV
  Variant, Job Listing, Tailoring, Tag, Strength, Core Achievement, Canonical
  phrasing, Variant phrasing. Use these words.

---

## The Bank — `src/data/achievements.ts`

- `Achievement = { id, role, text /* canonical phrasing, Google XYZ */, tags[], strength 1–5, core? }`
- `Tag = 'data' | 'ai' | 'backend' | 'frontend' | 'infra' | 'leadership'`
- `core: true` → appears in **every** Variant regardless of tags. `strength` →
  ordering and what to drop when a Variant runs long.
- Also exports: `identity` (fixed), `roles`, `skills` (tagged), `education`
  (fixed), `projects` (curated deep-dives — note: these still duplicate some
  achievement facts; consider deriving them from achievement ids).
- **Derived default view** at the bottom mirrors `resume.ts`'s API
  (`profile`, `socials`, `about`, `experience`, `projects`, `skills`,
  `education`) so the site can repoint with a one-line import swap.
- **`selectAchievements(targetTags)`** — deterministic baseline selection
  (core ∪ tag-matches, ordered by strength). Use it as the pre-LLM starting point.

---

## Your DoD

### 1. Build the tailoring skill
A Claude Code skill (e.g. `tailor-cv`) that, given a **Job Listing**:
1. **Selects** achievements — start from `selectAchievements(tags)` + all `core`,
   refined against the listing. Keep it role-grouped and reverse-chronological;
   do **not** reshuffle achievements across roles into "relevance order".
2. **Re-words** the selected achievements into **Variant phrasings** with an LLM,
   grounded *only* in each canonical `text` + the listing. Enforce the ADR-0003
   fact-lock. May also write a per-Variant summary/headline line.
3. **Writes a draft Variant to a file** for Michael to review and edit. The
   file-edit step *is* the human-in-the-loop honesty gate — there is no auto-send.
4. **Renders** the approved Variant to PDF (see §3).
- Keep each Variant **1–2 pages**. Identity + education are fixed; summary line,
  achievement selection, and skills ordering are tailored.
- **Tone:** confident and honest ("dugri"), targeting the Israeli market. NOT
  over-humble/apologetic, and NO bragging metric-walls. (This was hard-won user
  feedback — see `…/memory/resume-site-rebuild.md`.)

### 2. Integrate the Bank into the web app
- Repoint `src/pages/index.astro` and `src/pages/cv.astro` from
  `'../data/resume'` → `'../data/achievements'`. The derived exports match the
  old API, so it should be ~one import line per file plus a render check.
- Then **retire `src/data/resume.ts`** and **archive `src/data/past.md`** (its
  content is folded into the Bank).
- Verify: `npm run dev` (http://localhost:4321) and `npm run build`; both `/`
  and `/cv` must render. Note the older-role bullets will now be the richer
  merged ones.

### 3. How Variants become PDFs — pick one
- **(a) Recommended:** reuse the existing bespoke `/cv` print route + Playwright
  (`scripts/generate-pdf.mjs`). On-brand "Swiss Signal" design, one source of
  truth, no new dependency. Parameterize `/cv` by a Variant.
- **(b) Reactive Resume** (https://rxresu.me, the library Michael flagged):
  export the Bank → JSON-Resume schema and import. Trade-off: templated/generic
  look, content duplicated into a second tool (drift risk). Only if you don't
  want the Playwright step.

---

## Open decisions left for you
- **Variant storage / traceability:** keep each Variant as a file
  (`variants/<company>-<role>.*`) for audit + reuse? (Recommended.)
- **Projects vs achievements:** derive `projects` from achievement ids to kill
  the duplication, or keep them as separate richer case-studies.
- **Selection balance:** how much the deterministic tags/strength drive selection
  vs the LLM reading the listing.
- **Standalone CLI:** we chose an interactive-in-Claude skill for the MVP; a
  `npm run tailor` CLI (with an API key) is a later option — ADR-worthy if built.

---

## Facts that are authoritative (user-corrected — do not regress)
- Tastewise **Jul 2023 – Aug 2026**; Zencity **Jun 2019 – Jul 2023**; B.A. **2019–2025**.
- Team grew **2 → 9** at Tastewise; **2 → 7** at Zencity.
- He was the first to **properly build** Tastewise's data platform — *not* the
  "first data hire" (that was wrong and is removed).
- Never invent metrics. Use only numbers present in the Bank / Career Timeline.

## Key files
| File | Role |
|---|---|
| `src/data/achievements.ts` | **the Bank** (source of truth going forward) |
| `src/data/resume.ts` | current site source — to be replaced |
| `src/data/past.md` | raw older-role input — folded in, archive it |
| `src/pages/index.astro`, `src/pages/cv.astro` | site + print CV |
| `scripts/generate-pdf.mjs` | Playwright PDF of `/cv` |
| `CONTEXT.md`, `docs/adr/0001`–`0004` | the design record |
| `~/Documents/Dev/Obsidian/Vault/Career Timeline — Tastewise.md` | authoritative Tastewise facts |
