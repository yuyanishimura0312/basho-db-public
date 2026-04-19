#!/usr/bin/env python3
"""Export basho.db data to JSON for static site generation."""

import sqlite3
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "basho.db"
OUT_DIR = Path(__file__).parent.parent / "web" / "src" / "data"


def export():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row

    # Export facilities
    rows = conn.execute("""
        SELECT f.*, bs.total_score,
               bs.historical_continuity, bs.cultural_practice_depth,
               bs.regional_rootedness, bs.material_heritage,
               bs.insideness, bs.cultural_complexity,
               bs.narrative_quality, bs.authenticity,
               bs.rationale as score_rationale
        FROM facilities f
        LEFT JOIN basho_scores bs ON f.id = bs.facility_id
        ORDER BY f.founded_year ASC NULLS LAST
    """).fetchall()

    facilities = []
    for r in rows:
        d = dict(r)
        # Parse features JSON
        if d.get("features"):
            try:
                d["features"] = json.loads(d["features"])
            except (json.JSONDecodeError, TypeError):
                d["features"] = []
        else:
            d["features"] = []
        # Parse signature_dishes JSON
        if d.get("signature_dishes"):
            try:
                d["signature_dishes"] = json.loads(d["signature_dishes"])
            except (json.JSONDecodeError, TypeError):
                d["signature_dishes"] = []
        else:
            d["signature_dishes"] = []
        # Parse image_gallery JSON
        if d.get("image_gallery"):
            try:
                d["image_gallery"] = json.loads(d["image_gallery"])
            except (json.JSONDecodeError, TypeError):
                d["image_gallery"] = []
        else:
            d["image_gallery"] = []
        # Track enrichment
        d["is_enriched"] = bool(d.get("detailed_description"))
        facilities.append(d)

    with open(OUT_DIR / "facilities.json", "w", encoding="utf-8") as f:
        json.dump(facilities, f, ensure_ascii=False, indent=2)

    # Export stats
    stats = {
        "total": len(facilities),
        "by_category": {},
        "by_prefecture": {},
        "by_subcategory": {},
        "with_enriched": sum(1 for f in facilities if f.get("is_enriched")),
        "with_score": sum(1 for f in facilities if f.get("total_score")),
        "with_year": sum(1 for f in facilities if f.get("founded_year")),
        "oldest_year": min((f["founded_year"] for f in facilities if f.get("founded_year")), default=None),
        "category_labels": {
            "restaurant_japanese": "和食",
            "restaurant_western": "洋食",
            "restaurant_cafe": "カフェ・喫茶",
            "hotel": "ホテル",
            "ryokan": "旅館",
            "minshuku": "民宿",
            "other": "その他",
        },
    }

    for f in facilities:
        cat = f.get("category", "other")
        stats["by_category"][cat] = stats["by_category"].get(cat, 0) + 1
        pref = f.get("prefecture", "不明")
        stats["by_prefecture"][pref] = stats["by_prefecture"].get(pref, 0) + 1
        sub = f.get("subcategory", "other")
        stats["by_subcategory"][sub] = stats["by_subcategory"].get(sub, 0) + 1

    # Sort by count
    stats["by_category"] = dict(sorted(stats["by_category"].items(), key=lambda x: -x[1]))
    stats["by_prefecture"] = dict(sorted(stats["by_prefecture"].items(), key=lambda x: -x[1]))
    stats["by_subcategory"] = dict(sorted(stats["by_subcategory"].items(), key=lambda x: -x[1]))

    # Timeline data
    timeline = {}
    for f in facilities:
        y = f.get("founded_year")
        if y:
            century = f"{(y // 100) + 1}世紀" if y < 1600 else f"{(y // 100) * 100}年代"
            timeline[century] = timeline.get(century, 0) + 1
    stats["timeline"] = dict(sorted(timeline.items()))

    with open(OUT_DIR / "stats.json", "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    conn.close()
    print(f"Exported {len(facilities)} facilities to {OUT_DIR / 'facilities.json'}")
    print(f"Exported stats to {OUT_DIR / 'stats.json'}")


if __name__ == "__main__":
    export()
