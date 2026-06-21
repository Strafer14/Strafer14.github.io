#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// Build a Reactive Resume ResumeData object from:
//   • the Bank's JSON Resume export   (dist/resume.json)  → identity + content
//   • a per-listing tailoring spec    (optional)          → tailored overrides
//   • the look-only onyx skeleton     (rr-onyx-style-skeleton.json)
//
// The Bank (src/data/achievements.ts → /resume.json) stays the single source of
// truth: identity, education and profiles are pulled from it automatically, so
// nothing is re-typed here. The spec only carries the *tailored* parts.
//
// Usage:
//   node tools/rxresume/build-variant.mjs <out.json> [spec.json]
//     no spec  → full "master" ResumeData (every achievement, authored order)
//     spec     → tailored variant (see spec shape below)
//
// Spec shape (all fields optional; omitted → falls back to the Bank master):
//   {
//     "headline": "Staff Data Platform Engineer",   // basics.headline (mirror the listing's title)
//     "summary":  "One or two sentences …",          // plain text or HTML
//     "experience": [                                  // role-grouped, reverse-chronological
//       { "company":"Tastewise", "position":"…", "period":"July 2023 - August 2026",
//         "summary":"role one-liner",
//         "bullets":[ "selected + reworded achievement", "…" ] }   // string, or {id,text}
//     ],
//     "skills": [ { "name":"Data Engineering", "keywords":["…"] } ] // reordered / trimmed
//   }
// ─────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

const [, , outPath, specPath] = process.argv;
if (!outPath) {
  console.error("usage: build-variant.mjs <out.json> [spec.json]");
  process.exit(1);
}

const jr = JSON.parse(readFileSync(resolve(repoRoot, "dist", "resume.json"), "utf8"));
const skeleton = JSON.parse(readFileSync(resolve(here, "rr-onyx-style-skeleton.json"), "utf8"));
const spec = specPath ? JSON.parse(readFileSync(resolve(process.cwd(), specPath), "utf8")) : {};

const PHOTO = jr.basics?.image || "https://www.strafer.dev/michael.jpg";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const id = () => randomUUID();

const MONTHS = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
// "2023-07" → "July 2023"; "2019" → "2019"; "" → ""
const human = (iso) => {
  if (!iso) return "";
  const m = String(iso).match(/^(\d{4})-(\d{2})$/);
  if (m) return `${MONTHS[+m[2]]} ${m[1]}`;
  return String(iso);
};
const period = (a, b) => [human(a), human(b)].filter(Boolean).join(" - ");
const para = (t) => (!t ? "" : String(t).trim().startsWith("<") ? t : `<p>${esc(t)}</p>`);
const bulletsHtml = (arr) =>
  !arr || !arr.length ? "" : `<ul>${arr.map((b) => `<li>${esc(typeof b === "string" ? b : b.text)}</li>`).join("")}</ul>`;

const ICON = { github: "github-logo", linkedin: "linkedin-logo", x: "x-logo", twitter: "x-logo" };
const iconFor = (network) => ICON[String(network || "").toLowerCase()] || "";

const rd = structuredClone(skeleton);
delete rd._comment;

// ── identity (FIXED — straight from the Bank) ──────────────────────────────
rd.picture.url = PHOTO;
rd.basics.name = jr.basics.name;
rd.basics.headline = spec.headline || jr.basics.label;
rd.basics.email = jr.basics.email;
rd.basics.location = [jr.basics.location?.city, jr.basics.location?.countryCode].filter(Boolean).join(", ");
rd.basics.website = { url: jr.basics.url, label: jr.basics.url };

rd.sections.profiles.items = (jr.basics.profiles || []).map((p) => ({
  id: id(), hidden: false, icon: iconFor(p.network), iconColor: "",
  network: p.network, username: p.username,
  website: { url: p.url, label: p.username, inlineLink: false },
}));

// ── summary (tailorable) ───────────────────────────────────────────────────
rd.summary.content = para(spec.summary || jr.basics.summary);

// ── experience (tailorable; default = full master from the Bank) ───────────
const masterExperience = (jr.work || []).map((w) => ({
  company: w.name, position: w.position, period: period(w.startDate, w.endDate),
  summary: w.summary, bullets: w.highlights || [],
}));
rd.sections.experience.items = (spec.experience || masterExperience).map((e) => ({
  id: id(), hidden: false,
  company: e.company, position: e.position, location: e.location || "",
  period: e.period || "",
  website: { url: e.url || "", label: e.urlLabel || "", inlineLink: false },
  description: para(e.summary) + bulletsHtml(e.bullets),
  roles: [],
}));

// ── skills (tailorable order/trim; default = full master) ──────────────────
rd.sections.skills.items = (spec.skills || jr.skills || []).map((s) => ({
  id: id(), hidden: false, icon: "star", iconColor: "",
  name: s.name, proficiency: "", level: 0, keywords: s.keywords || [],
}));

// ── education (FIXED — from the Bank) ──────────────────────────────────────
rd.sections.education.items = (jr.education || []).map((e) => ({
  id: id(), hidden: false,
  school: e.institution,
  degree: [e.studyType, e.area].filter(Boolean).join(" in "),
  area: e.area || "", grade: "", location: "", period: period(e.startDate, e.endDate),
  website: { url: "", label: "", inlineLink: false }, description: "",
}));

writeFileSync(resolve(process.cwd(), outPath), JSON.stringify(rd, null, 2));
console.log(
  `wrote ${outPath} — ${rd.sections.experience.items.length} roles, ` +
  `${rd.sections.experience.items.reduce((n, i) => n + (i.description.match(/<li>/g) || []).length, 0)} bullets, ` +
  `${rd.sections.skills.items.length} skill groups${specPath ? ` (tailored: ${specPath})` : " (master)"}`,
);
