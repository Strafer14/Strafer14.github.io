# Self-hosted Reactive Resume (CV tailoring)

The public [rxresu.me](https://rxresu.me) has new signups disabled, so we run
Reactive Resume locally instead. It renders our CV PDFs from the Achievement
Bank's JSON Resume export. See [`../../docs/adr/0005-cvs-render-via-rxresume.md`](../../docs/adr/0005-cvs-render-via-rxresume.md).

As of v5.1.0 it's two containers (app + Postgres); PDF export is client-side.
Everything stays on this machine.

## Run it

```bash
cd tools/rxresume
docker compose up -d            # first run pulls images + migrates the DB (~1 min)
# open http://localhost:3000
docker compose down             # stop when done (data persists in the volume)
```

First visit: **sign up** to create your local account (this instance has signups
enabled — it's just you). No email server is configured, so if it asks to verify
your email, see "Email verification" below.

## Get your data in

1. Regenerate the JSON Resume export from the Bank whenever facts change:
   ```bash
   cd ../..            # repo root
   npm run build       # writes dist/resume.json
   # or: npm run dev  →  http://localhost:4321/resume.json
   ```
2. In Reactive Resume: dashboard → **Import an existing resume** → Filetype
   **JSON Resume (.json)** → pick `dist/resume.json` → **Import**.
3. Pick a template, rename it **"Master"**. This is canonical; you don't send it.

## Tailor per job

- Dashboard → master resume **⋮ → Duplicate** → rename `Company — Role`.
- Drop irrelevant items, reorder so relevant ones lead, reword to the listing.
- **Honesty rule (ADR-0005):** never change a metric, swap named tech, or broaden
  a claim beyond the Bank. The Bank stays the source of truth.
- **Download PDF** from the builder.
- Save your **master** PDF to `../../public/cv.pdf` so the site's "Download CV"
  links work.

## Email verification (if signup blocks you)

No SMTP is set, so verification emails can't send. If the app won't let you in
until verified, mark the account verified directly in Postgres:

```bash
docker compose exec postgres \
  psql -U postgres -d postgres -c \
  "UPDATE \"User\" SET \"emailVerified\" = true;"
```

(Then log in.) Alternatively, add SMTP_* vars to `.env` — see the
[self-hosting docs](https://docs.rxresu.me/self-hosting/docker).

## Notes

- `data/` (uploads) and `.env` (secret) are gitignored; `postgres_data` is a
  named Docker volume.
- Pin `amruthpillai/reactive-resume:latest` to a specific tag for reproducibility
  once you've confirmed a version you like.
