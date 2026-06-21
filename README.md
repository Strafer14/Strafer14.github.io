# strafer.dev — résumé site

Personal résumé / portfolio for Michael Ostrovsky. Built with **Astro 5** (static, zero-JS by default), styled in an **International Typographic Style** ("Swiss Signal") system.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve the built site
```

## Edit content

All copy lives in one typed file — the **Achievement Bank**,
[`src/data/achievements.ts`](src/data/achievements.ts). The homepage (`/`) and
the JSON Resume export (`/resume.json`) are both *views* over it, so they never
drift. This is the only place to edit résumé content.

Items flagged `todo: true` (and anything wrapped in the `.todo` style) are
**placeholders** to fill in with real, defensible numbers. Search for `TODO` / `todo`.

## CV PDFs — via rxresu.me

CVs are produced in [Reactive Resume](https://rxresu.me), not in this repo. The
Bank exports the [JSON Resume](https://jsonresume.org) schema at **`/resume.json`**
(also written to `dist/resume.json` on build), which rxresu.me imports natively.

```bash
npm run dev        # then open http://localhost:4321/resume.json and save it
```

1. Import `resume.json` into rxresu.me.
2. Tailor a copy per job listing **in its editor** (drop/reorder/reword — keep the
   facts honest; the Bank stays canonical), then export the PDF.
3. Re-import after editing the Bank whenever the underlying facts change.

The homepage "Download CV" buttons point to `/cv.pdf` — drop your exported master
CV at [`public/cv.pdf`](public/) to wire them up.

## Deploy

Pushing to `master` builds and deploys to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**One-time setup:** GitHub repo → *Settings → Pages → Build and deployment →
Source = "GitHub Actions"*. The custom domain `www.strafer.dev` is published via
`public/CNAME`.
