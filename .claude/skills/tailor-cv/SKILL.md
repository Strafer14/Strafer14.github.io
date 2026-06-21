---
name: tailor-cv
description: Tailor Michael's CV to a specific job listing and produce a 2-page, ATS-aware PDF via the local self-hosted Reactive Resume. Use when given a job posting/description and asked to make or adjust a CV/resume for that role.
---

# Tailor CV to a job listing

Given a **job listing**, select + reword achievements from the Achievement Bank (fact-locked),
build a Reactive Resume `ResumeData` object, import it into the **local self-hosted RR**, and
download the **server-side PDF**. Output: `variants/<company>-<role>.pdf` + a tailoring report.

## Ground rules (non-negotiable)
- **Source of truth = the Bank** `src/data/achievements.ts`. **Never edit it.**
- **Honesty (ADR-0003/0005):** reword for emphasis/keywords only. NEVER invent or inflate a
  metric, swap a named technology, broaden scope, or add a claim absent from the canonical
  achievement text. Selection drops/reorders; rewording rephrases — facts stay identical.
- **Approval gate:** before producing the PDF, show the user a *canonical → variant* diff for
  every reworded line and the list of dropped achievements. The user is the honesty check.
- **Tone:** confident, substantive, "dugri" (Israeli market). NOT over-humble/apologetic; NO
  bragging metric-walls. Lead with *building*; leadership is a credential, not the pitch
  (targeting hands-on IC / Team Lead). See memory `resume-site-rebuild`.

## Prereqs (verify first)
1. RR up: `docker compose --project-directory tools/rxresume -f tools/rxresume/docker-compose.yml up -d` → http://localhost:3000
2. API key: `grep -q RR_API_KEY .env` (else RR → Account → API Keys, add to `.env` as `RR_API_KEY=…`)
3. Fresh Bank content: `npm run build` (writes `dist/resume.json`, which the converter reads for identity/education/profiles)

## Inputs (ask if missing)
- The **full, verbatim job listing** — especially the Requirements/Qualifications block (that's the keyword source).
- **Company** + exact **role title**.
- **Format:** default = onyx template, photo, 2-column. For **ATS-strict**, say so → single-column, no photo.

## Procedure
1. Read the Bank `src/data/achievements.ts` (roles; achievements with `id`/`text`/`tags`/`strength`; skill groups) and the listing.
2. **Select:** baseline = achievements whose `tags` match the role's focus (see `selectAchievements`) refined by judgment against the listing. Keep **role-grouped, reverse-chronological** — do not reshuffle across roles. Drop the irrelevant. Trim by `strength` to fit ~2 pages.
3. **Reword** into variant phrasings that mirror the listing's language/keywords, fact-locked. Expand a key acronym once for ATS (e.g. "LLM (Large Language Model)").
4. Tailor the **summary** and **headline**; **reorder/trim skills** to lead with what the listing wants.
5. Write the spec → `variants/<company>-<role>.spec.json` (shape documented in `tools/rxresume/build-variant.mjs`). Use bullets as `{ "id": "<bank-id>", "text": "<reworded>" }` so the diff stays traceable.
6. Build: `node tools/rxresume/build-variant.mjs variants/<company>-<role>.resumedata.json variants/<company>-<role>.spec.json`
7. **Approval gate:** print per-bullet canonical (Bank text by `id`) vs variant, plus dropped achievements; confirm no facts changed; wait for the user's OK (or apply their edits to the spec and rebuild).
8. **Import + PDF** — prefer the MCP tools (present in a normal session); REST always works:
   - MCP: `import_resume` (data = the resumedata) → id → `download_resume_pdf` (id) → fetch the returned URL.
   - REST: see commands below.
9. **Verify:** `pdfinfo` → pages ≤ 2; `pdftotext` → confirm the listing's must-have keywords are present (report any missing).
10. **Deliver** the PDF (SendUserFile) + a short report (emphasized / dropped / ATS keyword coverage). Offer to open it in RR (localhost:3000) for a final visual tweak.

## REST commands (validated against RR 5.1.9)
```bash
KEY=$(grep -E '^(export )?RR_API_KEY=' .env | head -1 | cut -d= -f2- | tr -d '\r"' | xargs)
B=http://localhost:3000/api/openapi
F=variants/<company>-<role>

# import — returns the new resume id as a bare JSON string
node -e 'const d=require("./'"$F"'.resumedata.json");require("fs").writeFileSync("/tmp/imp.json",JSON.stringify({data:d}))'
ID=$(curl -s -X POST "$B/resumes/import" -H "x-api-key: $KEY" -H 'content-type: application/json' --data @/tmp/imp.json | tr -d '"')

# server-side PDF (no headless browser)
curl -s "$B/resumes/$ID/pdf" -H "x-api-key: $KEY" -o "$F.pdf"

# verify
pdfinfo "$F.pdf" | grep Pages
pdftotext "$F.pdf" - | grep -ciw <must-have-keyword>

# housekeeping:  list = GET $B/resumes   |   delete = curl -X DELETE "$B/resumes/$ID" -H "x-api-key: $KEY"
```

## Notes
- `variants/` is gitignored (per-application artifacts — private, not for the public repo).
- Each import creates a resume in RR. Reuse one per company or delete stale ones (`DELETE $B/resumes/{id}`).
- Photo: the skeleton points `picture.url` at the live `https://www.strafer.dev/michael.png`; RR fetches it when rendering the PDF.
- RR's own AI scorecard (`/ai/analyze-resume`) is optional (needs `ENCRYPTION_SECRET` + a provider key in RR). Don't rely on it — do the ATS keyword check yourself in step 9.
- The converter & skeleton live in `tools/rxresume/` (`build-variant.mjs`, `rr-onyx-style-skeleton.json`).
