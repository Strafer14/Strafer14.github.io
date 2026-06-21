// ─────────────────────────────────────────────────────────────────────────
// JSON Resume export — the CV view over the Achievement Bank (ADR-0005).
//
// Builds at `/resume.json` (and dist/resume.json on `npm run build`). Import it
// into rxresu.me (https://rxresu.me): it speaks the JSON Resume schema natively.
// Tailor a CV Variant per Job Listing inside the rxresu.me editor, then export
// the PDF. This file never invents facts — it only reshapes the canonical Bank.
// ─────────────────────────────────────────────────────────────────────────
import type { APIRoute } from 'astro';
import {
  identity, socials, about, roles, achievements, skills, education, projects,
} from '../data/achievements';

// ── period strings → JSON Resume dates ("Jul 2023" → "2023-07", "2019" → "2019")
const MONTHS: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

function toISO(token: string): string {
  const t = token.trim();
  const md = t.match(/^([A-Za-z]{3})\s+(\d{4})$/);
  if (md && MONTHS[md[1]]) return `${md[2]}-${MONTHS[md[1]]}`;
  const yr = t.match(/^(\d{4})$/);
  if (yr) return yr[1];
  return t; // leave anything unexpected untouched rather than guess
}

function splitPeriod(period: string): { startDate?: string; endDate?: string } {
  const [start, end] = period.split(/\s*[–-]\s*/); // hyphen or en-dash
  return { startDate: start ? toISO(start) : undefined, endDate: end ? toISO(end) : undefined };
}

const abs = (path: string) => new URL(path, identity.site).href;
const DEGREE = /^(B\.A\.|B\.Sc\.|M\.A\.|M\.Sc\.|Ph\.D\.|B\.Eng\.)\s+(.*)$/;
const [city] = identity.location.split(',').map((s) => s.trim());

const resume = {
  $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
  basics: {
    name: identity.name,
    label: identity.role,
    image: abs(identity.photo),
    email: identity.email,
    url: identity.site,
    summary: about.join(' '),
    location: { city, countryCode: 'IL' },
    profiles: socials.map((s) => ({ network: s.label, username: s.handle, url: s.href })),
  },
  work: roles.map((r) => ({
    name: r.org,
    position: r.title,
    ...splitPeriod(r.period),
    summary: r.summary,
    highlights: achievements.filter((a) => a.role === r.id).map((a) => a.text),
  })),
  education: education.map((e) => {
    const m = e.qualification.match(DEGREE);
    return {
      institution: e.org,
      studyType: m ? m[1] : e.qualification,
      area: m ? m[2] : undefined,
      ...splitPeriod(e.period),
    };
  }),
  skills: skills.map((g) => ({ name: g.title, keywords: g.items })),
  projects: projects.map((p) => ({
    name: p.title,
    description: p.blurb,
    highlights: [p.outcome],
    keywords: p.stack,
    ...splitPeriod(p.years),
  })),
  meta: {
    canonical: abs('/resume.json'),
    note: 'Generated from src/data/achievements.ts (the Achievement Bank). Import into rxresu.me; tailor per Job Listing in the editor.',
  },
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(resume, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
