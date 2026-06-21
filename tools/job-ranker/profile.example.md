# Candidate profile — TEMPLATE

> Copy this to `profile.md` (gitignored) and fill it in. This is the rubric the LLM scores every
> job against — strengths, what you're targeting, calibration anchors, and dealbreakers.
> Keep the real one out of version control: it's your personal job-search strategy.

## Who you are
One paragraph: title, years of experience, the arc of your career, and whether you're hands-on,
a lead, or both.

## Core strengths (what a great-fit role uses)
- **<area 1>** — concrete tools/skills + a flagship result.
- **<area 2>** — …
- **<area 3>** — …
- Secondary: <things you can do but don't want to lead with>.

## What you're targeting (ranking preferences)
- **Seniority/shape:** which titles score highest (e.g. hands-on IC / Tech Lead), and what to
  down-rank (e.g. pure people-management).
- **Company nuance:** any "judge the company, not just the title" rules — e.g. boost roles at the
  kinds of companies you want even when the title is generic. (Note: techmap's `category` column is
  the company's *industry*, not the job function.)
- Your sweet spot in one line.

## Calibration anchors (score new jobs relative to these)
Give the model 4–6 reference points spanning the range so scores are consistent. Describe the
*shape* of the role rather than naming specific employers if you'd rather not bake opinions in:
- **~90** — <ideal role shape>.
- **~75** — <strong but not perfect>.
- **~60** — <real but off your preferred shape, e.g. pure management>.
- **~40** — <weak fit>.
- **0 / exclude** — anything in a dealbreaker bucket below, or outside your location.

## Hard exclusions — score these **0**, reason `excluded: <bucket>`
List your dealbreakers. The model gives them 0 (not a low-but-visible score) so they're clearly out.
- **<bucket 1>** — …
- **<bucket 2>** — …  (add a ⚠️ caveat if an exclusion shouldn't fire in some context)
- **<bucket 3>** — …

## Location
Which cities pass, and any preference ordering among them. (The hard location allowlist also lives
at the top of `rank.py`; keep the two in sync.)
