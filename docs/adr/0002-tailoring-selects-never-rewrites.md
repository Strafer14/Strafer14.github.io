# Tailoring selects and orders Achievements; it never rewrites them

**Status:** Superseded by [ADR-0003](0003-llm-adapts-phrasing-at-output.md). An LLM may now re-word Achievements at the *output* layer — facts stay locked and the Bank is still never mutated, but the blanket "never rewrites" rule below no longer holds.

Each Achievement carries one canonical phrasing. A CV Variant is produced by choosing *which* Achievements to include and *in what order* — never by rephrasing them per Job Listing.

Chosen over storing multiple phrasings per Achievement, or letting an AI rewrite bullets per job description: rewriting multiplies maintenance, reintroduces the content drift ADR-0001 exists to prevent, and invites per-application spin that erodes honesty (the Bank is a set of facts).

**Consequence:** where one fact genuinely needs two framings for very different roles, split it into two distinct Achievements with different angles — don't give one Achievement a wardrobe of wordings. A later AI layer may select, order, and write a per-Variant summary line, but must not rewrite Achievements.
