# The Achievement Bank is a structured in-repo data file

The Bank lives in the repo as a structured data file (leaning TS, to match the existing `resume.ts` — alternatively YAML) where each Achievement is an object with `text`, `role`, `tags`, `strength`, `core`. Not markdown, and not an external service.

Chosen because Tailoring must filter by `tags`/`strength`/`core`, which is clean against structured data and painful against loose markdown; and an external store (Notion) would add an API integration and make the static build depend on a third-party service.

**Consequence:** drafting may still happen in prose (e.g. `src/data/past.md`), but that is compiled/merged into the canonical structured Bank. The structured file is the source of truth the tailoring skill and the site consume.
