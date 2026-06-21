# LLM adapts Achievement phrasing at the output layer, with a human in the loop

**Status:** Superseded by [ADR-0005](0005-cvs-render-via-rxresume.md) on *mechanism* — there is no in-repo LLM rewording step; tailoring (selecting, ordering, and rewording) happens manually in the rxresu.me editor. The *principle* below still holds: facts/metrics are never changed or broadened, the Bank is never mutated, and Michael is the honesty check (now exercised as he edits each CV Variant).

When tailoring to a Job Listing, an LLM may produce a **Variant phrasing** of a selected Achievement — reworded and re-emphasised to mirror the listing's language. It works only from the Achievement's **canonical phrasing** (in the Bank) plus the job description.

Hard constraints:
- It must not change a number/metric, broaden a claim's scope, swap the named technology, or add anything not present in the canonical Achievement.
- It never writes back to the Bank — the canonical phrasing is untouched; Variant phrasings are derived and live with the Variant.
- **No automatic send.** Michael reviews and approves every Variant before it goes out; he is the honesty check.

Supersedes [ADR-0002](0002-tailoring-selects-never-rewrites.md), which forbade rewriting outright. [ADR-0001](0001-achievement-bank-single-source-of-truth.md) still holds: the Bank is the single source of truth; Variant phrasings are views over it.
