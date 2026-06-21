# job-ranker

Pulls [mluggy/techmap](https://github.com/mluggy/techmap) `software.csv`, filters to roles that
fit your profile, and ranks them with an LLM (via the local `claude` CLI — no API key, uses your plan).

> Your personal rubric lives in `profile.md`, which is **gitignored**. Copy the template to start:
> ```bash
> cp profile.example.md profile.md   # then edit profile.md with your background + preferences
> ```

## Run
```bash
cd tools/job-ranker
python3 rank.py                  # fetch → filter → dedupe applied → LLM rank → report.md + ranked.csv
python3 rank.py --no-llm         # just the deterministic pre-filter (instant, free) — sanity check
python3 rank.py --limit 40       # LLM-score only the first 40 survivors (fast/cheap test)
python3 rank.py --model haiku    # cheaper/faster model (default: sonnet)
```

## Mark jobs you've applied to (so they never resurface)
```bash
python3 rank.py mark-applied "<apply-url>"
python3 rank.py mark-applied <url1> <url2> ...   # several at once
python3 rank.py applied                          # list what's recorded
```
Jobs in `applied.json` are excluded from every future run.

## How it ranks
1. **Pre-filter — structured fields only (deterministic, free):** drops `level == Student` and
   anything whose `city` isn't in the location allowlist (set at the top of `rank.py`). These are
   exact set-membership checks on structured columns — no language understanding, so no LLM.
2. **Dedupe:** removes everything already in `applied.json`.
3. **LLM rank:** scores survivors 0–100 against `profile.md`, batched through `claude`.
   The profile carries the calibration anchors (e.g. a hands-on Tech Lead at a target company ≈ 90;
   a pure-management Director ≈ 60), the company-type nuance (boost the kinds of companies you want
   even with generic titles), and the **dealbreakers** — which the model scores **0** with a visible
   reason rather than a regex silently dropping them. Excluded rows show in their own report section +
   `ranked.csv`, so the filter is auditable and never deletes a good job by accident.

> Why not regex the title dealbreakers too? Because that's *semantic* judgment, not a structured lookup.
> Regex is brittle (it false-*negatives*, e.g. an unbounded `c++`, and false-*positives*, e.g. `\btest\b`
> killing a legit "A/B Testing Platform" backend role — silently). The model reads the title and explains
> itself. Deterministic for structured data; the LLM for anything that needs reading.

## Tune it
Edit **`profile.md`** (your private copy) — it's the whole rubric (strengths, seniority preference,
anchors, exclusions). The location allowlist lives at the top of **`rank.py`**.

## State files (gitignored — personal, never committed to this public repo)
`profile.md` (your rubric) · `applied.json` · `seen.json` (powers the 🆕 "new since last run" marker) ·
`software.csv` (cache) · `report.md` · `ranked.csv`.
