#!/usr/bin/env python3
"""
Job ranker — pull the techmap software.csv, drop non-fits, and rank what's left by
relevance to your profile (profile.md — gitignored; copy profile.example.md) using the
local `claude` CLI as the LLM.

Filtering philosophy: deterministic only for *structured* fields (location, level) where
set-membership is exact and free; everything that needs *reading* a title — including the
dealbreaker exclusions — is the model's job. Dealbreakers come back as score 0 with a
reason, so they're visible/auditable instead of silently regex-dropped.

State is persistent across runs:
  - applied.json : jobs already applied to → excluded from every future ranking
  - seen.json    : job ids seen on a prior run → new postings get a 🆕 marker

Usage:
  python3 rank.py                       # full run: fetch → filter → dedupe → LLM rank → report
  python3 rank.py --no-llm              # structured pre-filter only (instant, free) — for testing
  python3 rank.py --limit 40            # only LLM-score the top N survivors (testing)
  python3 rank.py --model haiku         # override the model (default: sonnet)
  python3 rank.py mark-applied <url>... # record application(s); accepts apply URLs or job ids
  python3 rank.py applied               # list everything marked applied

Requires: the `claude` CLI on PATH (uses your existing Claude plan — no API key needed).
"""
from __future__ import annotations
import argparse, csv, io, json, subprocess, sys, urllib.request
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
CSV_URL = "https://raw.githack.com/mluggy/techmap/main/jobs/software.csv"
CSV_CACHE = HERE / "software.csv"
APPLIED = HERE / "applied.json"
SEEN = HERE / "seen.json"
PROFILE = HERE / "profile.md"
REPORT = HERE / "report.md"
RANKED_CSV = HERE / "ranked.csv"

DEFAULT_MODEL = "sonnet"
BATCH = 30  # jobs per claude call

# ── Location filter (deterministic — structured `city` column) ───────────────
LOC_ALLOW = {
    "tel aviv-yafo", "tel aviv", "tel-aviv", "tel-aviv-yafo", "תל אביב-יפו",
    "תל אביב", "תל-אביב", "תל-אביב-יפו",
    "ramat gan", "רמת גן",
    "givatayim", "גבעתיים",
}
TLV_FORMS = {"tel aviv-yafo", "tel aviv", "tel-aviv", "tel-aviv-yafo",
             "תל אביב-יפו", "תל אביב", "תל-אביב", "תל-אביב-יפו"}

# Dealbreakers are NOT filtered here — they're in profile.md and the model scores them 0.


# ── small helpers ───────────────────────────────────────────────────────────
def job_id(url: str) -> str:
    """Stable id = the URL minus its query string (only utm params live there)."""
    return url.split("?")[0].rstrip("/")


def load_json(path: Path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def save_json(path: Path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def fetch_csv() -> list[dict]:
    try:
        req = urllib.request.Request(CSV_URL, headers={"User-Agent": "job-ranker"})
        raw = urllib.request.urlopen(req, timeout=30).read().decode("utf-8-sig")
        CSV_CACHE.write_text(raw, encoding="utf-8")
    except Exception as e:
        if CSV_CACHE.exists():
            print(f"  ! fetch failed ({e}); using cached CSV", file=sys.stderr)
            raw = CSV_CACHE.read_text(encoding="utf-8-sig")
        else:
            raise
    return list(csv.DictReader(io.StringIO(raw)))


def loc_ok(city: str) -> tuple[bool, str]:
    c = (city or "").strip().lower()
    if c == "":
        return True, "unknown"          # no city → maybe remote; keep, tag
    if c in LOC_ALLOW:
        return True, ("tlv" if c in TLV_FORMS else "near")
    return False, "out"


# ── pre-filter (deterministic, structured fields only) ──────────────────────
def prefilter(rows: list[dict]):
    """Only cuts that need no language understanding: student level + location allowlist."""
    survivors, drops = [], {"student": 0, "location": 0}
    for r in rows:
        if r.get("level") == "Student":
            drops["student"] += 1
            continue
        ok, tag = loc_ok(r["city"])
        if not ok:
            drops["location"] += 1
            continue
        r["_id"] = job_id(r["url"])
        r["_loc"] = tag
        survivors.append(r)
    return survivors, drops


# ── LLM scoring via local `claude` CLI ──────────────────────────────────────
def claude_call(system: str, prompt: str, model: str) -> tuple[str, float]:
    out = subprocess.run(
        ["claude", "-p", prompt, "--output-format", "json", "--model", model,
         "--append-system-prompt", system, "--disallowedTools", "*"],
        capture_output=True, text=True, timeout=300,
    )
    if out.returncode != 0:
        raise RuntimeError(f"claude exited {out.returncode}: {out.stderr[:400]}")
    env = json.loads(out.stdout)
    return env.get("result", ""), float(env.get("total_cost_usd") or 0)


def parse_scores(text: str) -> list[dict]:
    i, j = text.find("["), text.rfind("]")
    if i == -1 or j == -1:
        return []
    try:
        return json.loads(text[i:j + 1])
    except json.JSONDecodeError:
        return []


def score_batch(batch: list[dict], system: str, model: str) -> tuple[dict, float]:
    lines = [f"{n}. {r['title']} | {r['company']} ({r['category']}) | {r['level']} | "
             f"{r['city'] or 'unknown-city'}" for n, r in enumerate(batch, 1)]
    prompt = (
        "Score each job 0-100 for how well it fits the candidate (see system prompt), and give "
        "a reason of <=14 words. Calibrate against the anchors. If a job is in a hard-excluded "
        "bucket, score it 0 with reason 'excluded: <which bucket>'. Return ONLY a JSON array, no prose:\n"
        '[{"n": <line number>, "score": <int 0-100>, "reason": "<str>"}]\n\nJobs:\n'
        + "\n".join(lines)
    )
    text, cost = claude_call(system, prompt, model)
    by_n = {s["n"]: s for s in parse_scores(text) if "n" in s}
    result = {}
    for n, r in enumerate(batch, 1):
        s = by_n.get(n, {})
        result[r["_id"]] = {"score": int(s.get("score", -1)), "reason": s.get("reason", "(unscored)")}
    return result, cost


# ── report ──────────────────────────────────────────────────────────────────
def band(score: int) -> str:
    if score >= 88: return "🔥 Top picks (88+)"
    if score >= 75: return "Strong (75–87)"
    if score >= 60: return "Good (60–74)"
    if score >= 45: return "Worth a look (45–59)"
    return "Long shots (1–44)"


BAND_ORDER = ["🔥 Top picks (88+)", "Strong (75–87)", "Good (60–74)",
              "Worth a look (45–59)", "Long shots (1–44)"]


def write_report(scored: list[dict], drops: dict, applied_n: int, new_ids: set, total_in: int):
    loc_badge = {"tlv": "TLV", "near": "RG/Giv", "unknown": "remote?"}
    ranked = [r for r in scored if r["score"] > 0]
    excluded = [r for r in scored if r["score"] <= 0]   # model-excluded (0) or errored (-1)
    by_band: dict[str, list] = {b: [] for b in BAND_ORDER}
    for r in ranked:
        by_band[band(r["score"])].append(r)
    lines = [
        "# Ranked jobs — techmap/software.csv",
        f"\n_Run {datetime.now():%Y-%m-%d %H:%M}. {total_in} postings → {len(ranked)} ranked "
        f"(+{len(excluded)} model-excluded) after filters. {applied_n} already-applied hidden. "
        f"{len(new_ids)} 🆕 new since last run._\n",
        "Pre-filter is **structured-only** (location + level): kept Tel Aviv / Ramat Gan / "
        f"Givatayim / unknown(remote?), dropped {drops['location']} out-of-area + {drops['student']} "
        "student. Dealbreakers (C++/embedded · security-research · frontend/mobile · QA/DevOps) are "
        "scored **0 by the model** with a reason — full per-row reasons in `ranked.csv`.\n",
    ]
    for b in BAND_ORDER:
        group = sorted(by_band[b], key=lambda r: (-r["score"], r["_loc"] != "tlv", r["company"]))
        if not group:
            continue
        lines.append(f"\n## {b}  ·  {len(group)}\n")
        for r in group:
            new = " 🆕" if r["_id"] in new_ids else ""
            lines.append(
                f"- **{r['score']}** · {r['title']} — {r['company']} _({r['category']})_ · "
                f"{r['level']} · {loc_badge.get(r['_loc'], r['_loc'])}{new}  \n"
                f"  {r['reason']} · [apply]({r['url']})")
    if excluded:
        lines.append(f"\n## Excluded by the model · {len(excluded)}\n")
        lines.append("_Scored 0 (dealbreaker or off-profile). Listed for audit; reasons in ranked.csv._\n")
        for r in sorted(excluded, key=lambda r: (r["reason"], r["company"])):
            lines.append(f"- {r['title']} — {r['company']} _({r['category']})_ · {r['reason']}")
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    with RANKED_CSV.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["score", "title", "company", "category", "level", "city", "loc", "new", "reason", "url"])
        for r in sorted(scored, key=lambda r: -r["score"]):
            w.writerow([r["score"], r["title"], r["company"], r["category"], r["level"],
                        r["city"], r["_loc"], r["_id"] in new_ids, r["reason"], r["url"]])


# ── commands ────────────────────────────────────────────────────────────────
def cmd_rank(args):
    rows = fetch_csv()
    print(f"fetched {len(rows)} postings")
    survivors, drops = prefilter(rows)
    print(f"pre-filter kept {len(survivors)}  (dropped: " +
          ", ".join(f"{k} {v}" for k, v in drops.items() if v) + ")")

    applied = load_json(APPLIED, [])
    applied_ids = {a["id"] for a in applied}
    survivors = [r for r in survivors if r["_id"] not in applied_ids]
    print(f"after removing {len(applied_ids)} applied: {len(survivors)} to rank")

    seen = set(load_json(SEEN, []))
    new_ids = {r["_id"] for r in survivors} - seen

    if args.limit:
        survivors = survivors[:args.limit]

    if args.no_llm:
        for r in survivors:
            r["score"], r["reason"] = 0, "(--no-llm: not scored)"
        scored = survivors
    else:
        system = PROFILE.read_text(encoding="utf-8")
        scored, cost = [], 0.0
        batches = [survivors[i:i + BATCH] for i in range(0, len(survivors), BATCH)]
        for bi, batch in enumerate(batches, 1):
            print(f"  scoring batch {bi}/{len(batches)} ({len(batch)} jobs)…", flush=True)
            try:
                res, c = score_batch(batch, system, args.model)
            except Exception as e:
                print(f"    ! batch failed ({e}); marking unscored", file=sys.stderr)
                res, c = {r["_id"]: {"score": -1, "reason": "(batch error)"} for r in batch}, 0
            cost += c
            for r in batch:
                r.update(res.get(r["_id"], {"score": -1, "reason": "(missing)"}))
                scored.append(r)
        print(f"done. approx LLM cost ${cost:.2f}")

    write_report(scored, drops, len(applied_ids), new_ids, len(rows))
    save_json(SEEN, sorted(seen | {r["_id"] for r in survivors}))
    top = sorted([r for r in scored if r["score"] > 0], key=lambda r: -r["score"])[:10]
    print(f"\nwrote {REPORT.name} and {RANKED_CSV.name}. Top 10:")
    for r in top:
        print(f"  {r['score']:>3} {r['title'][:48]:48} {r['company']}")


def cmd_mark_applied(args):
    applied = load_json(APPLIED, [])
    ids = {a["id"] for a in applied}
    rows = {job_id(r["url"]): r for r in fetch_csv()}
    added = 0
    for token in args.targets:
        jid = job_id(token) if token.startswith("http") else token
        if jid in ids:
            print(f"  already recorded: {jid}")
            continue
        r = rows.get(jid)
        applied.append({"id": jid, "url": token,
                        "company": r["company"] if r else "?",
                        "title": r["title"] if r else "?",
                        "applied_at": f"{datetime.now():%Y-%m-%d}"})
        ids.add(jid)
        added += 1
        print(f"  + {r['title'] + ' @ ' + r['company'] if r else jid}")
    save_json(APPLIED, applied)
    print(f"recorded {added}; {len(applied)} total applied.")


def cmd_applied(args):
    applied = load_json(APPLIED, [])
    if not applied:
        print("nothing marked applied yet.")
        return
    for a in applied:
        print(f"  {a.get('applied_at', '?')}  {a['title']} @ {a['company']}")
    print(f"{len(applied)} total.")


def main():
    p = argparse.ArgumentParser(description="Rank techmap jobs against your profile.")
    sub = p.add_subparsers(dest="cmd")
    p.add_argument("--no-llm", action="store_true", help="structured pre-filter only")
    p.add_argument("--limit", type=int, help="LLM-score only the first N survivors")
    p.add_argument("--model", default=DEFAULT_MODEL, help="claude model (default: sonnet)")

    ma = sub.add_parser("mark-applied", help="record application(s) by URL or id")
    ma.add_argument("targets", nargs="+")
    sub.add_parser("applied", help="list applied jobs")

    args = p.parse_args()
    if args.cmd == "mark-applied":
        cmd_mark_applied(args)
    elif args.cmd == "applied":
        cmd_applied(args)
    else:
        cmd_rank(args)


if __name__ == "__main__":
    main()
