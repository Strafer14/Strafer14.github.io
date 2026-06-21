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

All copy lives in one typed file: [`src/data/resume.ts`](src/data/resume.ts).
The homepage (`/`) and the print CV (`/cv`) both render from it, so they never drift.

Items flagged `todo: true` (and anything wrapped in the `.todo` style) are
**placeholders** to fill in with real, defensible numbers — currently the
team-size metric. Search the repo for `TODO` / `todo`.

## PDF CV

`/cv` is a print-optimised route. "Download CV" uses the browser's print-to-PDF.
To commit a real file, see [`scripts/generate-pdf.mjs`](scripts/generate-pdf.mjs):

```bash
npm run build && npm run preview &
npx playwright install chromium    # one-time
npm run pdf                        # → public/cv.pdf
```

## Deploy

Pushing to `master` builds and deploys to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**One-time setup:** GitHub repo → *Settings → Pages → Build and deployment →
Source = "GitHub Actions"*. The custom domain `www.strafer.dev` is published via
`public/CNAME`.
