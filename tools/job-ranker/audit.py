#!/usr/bin/env python3
"""
Audit the incremental dedup — prove a daily run only LLM-scores the diff.

It's a black-box check around rank.py: snapshot state, run the ranker, then classify today's
survivors against yesterday's baseline and assert the dedup invariants.

  python3 audit.py --snapshot   # capture today's baseline (run this once, today)
  python3 audit.py              # tomorrow: run rank.py + report NEW / CHANGED / REUSED / DISAPPEARED

Invariants checked:
  • scored (LLM calls)  ==  NEW + CHANGED        (nothing already-known was re-scored)
  • reused              ==  REUSED               (the rest came from cache, free)
  • applied jobs        ∉   today's survivors    (permanent dedup still holds)
"""
import csv, json, re, subprocess, sys
from datetime import date
import rank

BASELINE = rank.HERE / "audit-baseline.json"


def survivors_now():
    """Re-derive the post-filter, post-applied survivor list from the current local CSV."""
    rows = list(csv.DictReader(open(rank.CSV_CACHE, encoding="utf-8-sig")))
    surv, _ = rank.prefilter(rows)
    applied = {a["id"] for a in rank.load_json(rank.APPLIED, [])}
    return rows, [r for r in surv if r["_id"] not in applied]


def capture_baseline():
    rank.fetch_csv()
    rows, surv = survivors_now()
    base = {
        "captured": date.today().isoformat(),
        "survivor_updated": {r["_id"]: r.get("updated") for r in surv},
        "cache_ids": sorted(rank.load_json(rank.SCORES, {})),
        "applied_ids": sorted(a["id"] for a in rank.load_json(rank.APPLIED, [])),
    }
    BASELINE.write_text(json.dumps(base, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"baseline captured {base['captured']}: {len(surv)} survivors, "
          f"{len(base['cache_ids'])} cached, {len(base['applied_ids'])} applied")
    return base


def run_ranker():
    print("\n--- running rank.py ---")
    out = subprocess.run([sys.executable, str(rank.HERE / "rank.py")], capture_output=True, text=True)
    sys.stdout.write(out.stdout)
    if out.returncode != 0:
        sys.stderr.write(out.stderr)
        raise SystemExit("rank.py failed")
    grab = lambda pat: (m.group(1) if (m := re.search(pat, out.stdout)) else None)
    reused = grab(r"(\d+) from cache")
    scored = 0 if "nothing new to score" in out.stdout else grab(r"(\d+) to score")
    cost = grab(r"cost \$([0-9.]+)")
    return int(reused or 0), int(scored or 0), float(cost or 0)


def audit():
    if not BASELINE.exists():
        print("No baseline yet — capturing today's. Re-run `python3 audit.py` tomorrow to audit.")
        capture_baseline()
        return
    base = json.loads(BASELINE.read_text(encoding="utf-8"))
    before_cache = set(base["cache_ids"])
    before_upd = base["survivor_updated"]

    reused_n, scored_n, cost = run_ranker()

    rows, surv = survivors_now()
    surv_ids = {r["_id"] for r in surv}
    NEW = [r for r in surv if r["_id"] not in before_cache]
    CHANGED = [r for r in surv if r["_id"] in before_cache and before_upd.get(r["_id"]) != r.get("updated")]
    REUSED = [r for r in surv if r["_id"] in before_cache and before_upd.get(r["_id"]) == r.get("updated")]
    DISAPPEARED = before_cache - surv_ids
    applied = {a["id"] for a in rank.load_json(rank.APPLIED, [])}
    leaked = applied & surv_ids

    def chk(ok): return "✓" if ok else "✗ MISMATCH"
    print(f"\n===== DEDUP AUDIT  {base['captured']} → {date.today().isoformat()} =====")
    print(f"survivors today : {len(surv)}")
    print(f"  NEW (uncached)   : {len(NEW):4}  → expected to be LLM-scored")
    print(f"  CHANGED (updated): {len(CHANGED):4}  → expected to be re-scored")
    print(f"  REUSED (cached)  : {len(REUSED):4}  → expected free (no LLM)")
    print(f"  DISAPPEARED      : {len(DISAPPEARED):4}  (cached jobs no longer in CSV)")
    print(f"rank.py reported : {reused_n} from cache, {scored_n} scored, ${cost:.2f}")
    print()
    print(f"  scored == NEW+CHANGED : {scored_n} == {len(NEW) + len(CHANGED)}  {chk(scored_n == len(NEW) + len(CHANGED))}")
    print(f"  reused == REUSED      : {reused_n} == {len(REUSED)}  {chk(reused_n == len(REUSED))}")
    print(f"  applied excluded      : {chk(not leaked)}" + (f" ({len(leaked)} leaked!)" if leaked else ""))
    if NEW:
        print("\nNEW jobs scored this run:")
        for r in sorted(NEW, key=lambda r: r["company"])[:15]:
            print(f"  - {r['title'][:52]:52} {r['company']}")
        if len(NEW) > 15:
            print(f"  … +{len(NEW) - 15} more")

    capture_baseline()  # roll the baseline forward for the next day


if __name__ == "__main__":
    capture_baseline() if "--snapshot" in sys.argv else audit()
