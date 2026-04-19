#!/usr/bin/env python3
"""
Basho Agent - 場所性評価エージェント

Evaluates the "basho-sei" (placeness) of restaurants and accommodation
facilities using an 8-axis framework grounded in Nishida philosophy,
Bourdieu's cultural capital, and phenomenological place theory.

Usage:
  python3 basho_agent.py evaluate "facility name or URL"
  python3 basho_agent.py evaluate --text "description text"
  python3 basho_agent.py batch [--limit N]    # Evaluate unevaluated facilities
  python3 basho_agent.py search "keyword"     # Search facilities by basho score
"""

import sqlite3
import json
import os
import sys
import subprocess
import argparse
from pathlib import Path

DB_PATH = Path(__file__).parent / "data" / "basho.db"

AXES = [
    ("historical_continuity", "歴史的継続性", "その場所で営みが継続してきた時間の長さと、歴史の層の厚さ"),
    ("cultural_practice_depth", "文化的営みの深度", "文化的実践の専門性、独自性、継承の質"),
    ("regional_rootedness", "地域的固有性", "特定の地域・土地と結びついている度合い"),
    ("material_heritage", "物質的文化財性", "建築物、空間、調度品の文化的価値"),
    ("insideness", "場所の内側性", "訪れる人がその場所に包まれていると感じる度合い"),
    ("cultural_complexity", "文化的複雑性", "文化的要素の多層性と異種混交性"),
    ("narrative_quality", "ナラティブ性", "場所が持つ物語の豊かさと喚起力"),
    ("authenticity", "本物性", "文化的表現が内在的な必然性に基づいている度合い"),
]

SYSTEM_PROMPT = """あなたは「場所性（basho-sei）」を評価する専門エージェントです。

## 理論的基盤
- 西田幾多郎の「場所」概念: 存在が成立する根拠としての場。有の場所（物質）→相対無の場所（意識・活動）→絶対無の場所（究極的意味）
- ブルデューの文化資本論: 身体化された資本（職人の技）、客体化された資本（建築・調度）、制度化された資本（文化財指定）
- レルフの場所の現象学: 内側性(insideness)、没場所性(placelessness)批判、本物の場所 vs 人工的な場所
- トゥアンのトポフィリア: 場所への愛着、空間が経験を通じて場所になる
- 文化地理学: パリンプセスト（重層的歴史）、場所のナラティブ性
- 人類学: 場所の感覚(sense of place)、非場所(non-places)、間(ma)

## 評価の8軸（各1-5点）

1. **歴史的継続性** (historical_continuity): 営みの継続年数、代替わりの歴史、歴史的出来事との関わり、重層的歴史
2. **文化的営みの深度** (cultural_practice_depth): 伝統技法の継承、職人的身体知、文化的実践の独自性
3. **地域的固有性** (regional_rootedness): 地元素材の使用、風土との関係、地域コミュニティとの結びつき
4. **物質的文化財性** (material_heritage): 建築の歴史的価値、文化財指定、空間デザイン、調度品の価値
5. **場所の内側性** (insideness): 空間の親密性、雰囲気・佇まい、五感への訴え、包み込む力
6. **文化的複雑性** (cultural_complexity): 複数文化の融合、和洋の交差、異なる時代の共存、文脈の重なり
7. **ナラティブ性** (narrative_quality): まつわる逸話・伝説、著名人との関わり、場所の物語性
8. **本物性** (authenticity): 実践の自然さ、観光演出でない真正性、没場所性からの距離

## 出力形式
必ず以下のJSON形式で出力してください。他の文章は含めないでください。

```json
{
  "historical_continuity": {"score": 3, "rationale": "根拠の説明"},
  "cultural_practice_depth": {"score": 3, "rationale": "根拠の説明"},
  "regional_rootedness": {"score": 3, "rationale": "根拠の説明"},
  "material_heritage": {"score": 3, "rationale": "根拠の説明"},
  "insideness": {"score": 3, "rationale": "根拠の説明"},
  "cultural_complexity": {"score": 3, "rationale": "根拠の説明"},
  "narrative_quality": {"score": 3, "rationale": "根拠の説明"},
  "authenticity": {"score": 3, "rationale": "根拠の説明"},
  "summary": "この施設の場所性についての総合的な評価（2-3文）"
}
```"""


def _get_api_key() -> str:
    """Get Anthropic API key from env or macOS keychain."""
    key = os.environ.get("ANTHROPIC_API_KEY")
    if key:
        return key
    try:
        result = subprocess.run(
            ["security", "find-generic-password", "-s", "ANTHROPIC_API_KEY", "-a", "anthropic", "-w"],
            capture_output=True, text=True, check=True,
        )
        return result.stdout.strip()
    except Exception:
        return ""


def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def evaluate_facility(text: str, model: str = "claude-sonnet-4-20250514") -> dict:
    """Evaluate a facility's basho-sei using Claude API."""
    api_key = _get_api_key()
    if not api_key:
        print("Error: No Anthropic API key found. Set ANTHROPIC_API_KEY or add to keychain.")
        sys.exit(1)

    import anthropic
    client = anthropic.Anthropic(api_key=api_key)

    response = client.messages.create(
        model=model,
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": f"以下の施設情報から場所性を評価してください。\n\n{text}"
        }],
    )

    content = response.content[0].text.strip()
    # Extract JSON from response
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()

    return json.loads(content)


def save_score(facility_id: str, result: dict, model: str = "claude-sonnet-4-20250514"):
    """Save evaluation result to the database."""
    conn = get_db()
    rationale = {}
    scores = {}
    for col, _, _ in AXES:
        axis_data = result.get(col, {})
        scores[col] = axis_data.get("score", 0)
        rationale[col] = axis_data.get("rationale", "")

    total = sum(scores.values()) / len(scores) if scores else 0

    conn.execute("""
        INSERT INTO basho_scores (
            facility_id, historical_continuity, cultural_practice_depth,
            regional_rootedness, material_heritage, insideness,
            cultural_complexity, narrative_quality, authenticity,
            total_score, rationale, model_used
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        facility_id,
        scores.get("historical_continuity", 0),
        scores.get("cultural_practice_depth", 0),
        scores.get("regional_rootedness", 0),
        scores.get("material_heritage", 0),
        scores.get("insideness", 0),
        scores.get("cultural_complexity", 0),
        scores.get("narrative_quality", 0),
        scores.get("authenticity", 0),
        total,
        json.dumps(rationale, ensure_ascii=False),
        model,
    ))
    conn.commit()
    conn.close()
    return total


def cmd_evaluate(args):
    """Evaluate a single facility."""
    if args.text:
        text = args.text
    elif args.facility:
        conn = get_db()
        row = conn.execute(
            "SELECT * FROM facilities WHERE name LIKE ? OR id = ?",
            (f"%{args.facility}%", args.facility)
        ).fetchone()
        if not row:
            print(f"Facility not found: {args.facility}")
            return
        text = f"施設名: {row['name']}\nカテゴリ: {row['category']}\n住所: {row['address']}\n概要: {row['overview']}\n特徴: {row['features']}\nURL: {row['url']}"
        conn.close()
    else:
        print("Error: Specify facility name/id or --text")
        return

    print("Evaluating basho-sei...")
    result = evaluate_facility(text)

    # Print results
    print(f"\n{'='*60}")
    print(f"場所性評価結果")
    print(f"{'='*60}")
    total = 0
    for col, name_ja, _ in AXES:
        axis = result.get(col, {})
        score = axis.get("score", 0)
        total += score
        bar = "█" * score + "░" * (5 - score)
        print(f"  {name_ja:<12} [{bar}] {score}/5  {axis.get('rationale', '')[:60]}")

    avg = total / len(AXES)
    print(f"\n  総合スコア: {avg:.1f}/5.0")
    if "summary" in result:
        print(f"\n  {result['summary']}")

    # Save if facility exists in DB
    if not args.text and row:
        save_score(row["id"], result)
        print(f"\n  -> DB保存完了 (facility_id: {row['id']})")


def cmd_batch(args):
    """Batch evaluate unevaluated facilities."""
    conn = get_db()
    limit = args.limit or 10

    rows = conn.execute("""
        SELECT f.* FROM facilities f
        LEFT JOIN basho_scores bs ON f.id = bs.facility_id
        WHERE bs.id IS NULL
        ORDER BY f.collected_at
        LIMIT ?
    """, (limit,)).fetchall()

    if not rows:
        print("No unevaluated facilities found.")
        return

    print(f"Evaluating {len(rows)} facilities...")
    for i, row in enumerate(rows, 1):
        text = f"施設名: {row['name']}\nカテゴリ: {row['category']}\n住所: {row['address']}\n概要: {row['overview']}\n特徴: {row['features']}\nURL: {row['url']}"
        try:
            result = evaluate_facility(text, model=args.model or "claude-haiku-4-5-20251001")
            total = save_score(row["id"], result, model=args.model or "claude-haiku-4-5-20251001")
            print(f"  [{i}/{len(rows)}] {row['name']}: {total:.1f}/5.0")
        except Exception as e:
            print(f"  [{i}/{len(rows)}] {row['name']}: ERROR - {e}")

    conn.close()


def cmd_search(args):
    """Search facilities by basho score."""
    conn = get_db()
    query = args.keyword

    rows = conn.execute("""
        SELECT f.name, f.category, f.address, f.overview,
               bs.total_score, bs.historical_continuity, bs.cultural_practice_depth,
               bs.regional_rootedness, bs.authenticity
        FROM facilities f
        LEFT JOIN basho_scores bs ON f.id = bs.facility_id
        WHERE f.name LIKE ? OR f.overview LIKE ? OR f.features LIKE ?
        ORDER BY bs.total_score DESC NULLS LAST
        LIMIT 20
    """, (f"%{query}%", f"%{query}%", f"%{query}%")).fetchall()

    if not rows:
        print(f"No facilities found for: {query}")
        return

    print(f"\n{'Name':<30} {'Score':>5} {'Category':<15} {'Address':<20}")
    print("-" * 75)
    for r in rows:
        score = f"{r['total_score']:.1f}" if r["total_score"] else "N/A"
        print(f"{r['name']:<30} {score:>5} {r['category']:<15} {(r['address'] or '')[:20]:<20}")

    conn.close()


def main():
    parser = argparse.ArgumentParser(description="Basho Agent - 場所性評価エージェント")
    sub = parser.add_subparsers(dest="command")

    # evaluate
    ev = sub.add_parser("evaluate", help="Evaluate a facility's basho-sei")
    ev.add_argument("facility", nargs="?", help="Facility name or ID")
    ev.add_argument("--text", help="Raw text to evaluate")

    # batch
    ba = sub.add_parser("batch", help="Batch evaluate unevaluated facilities")
    ba.add_argument("--limit", type=int, default=10, help="Max facilities to evaluate")
    ba.add_argument("--model", default="claude-haiku-4-5-20251001", help="Model to use")

    # search
    se = sub.add_parser("search", help="Search facilities")
    se.add_argument("keyword", help="Search keyword")

    args = parser.parse_args()
    if args.command == "evaluate":
        cmd_evaluate(args)
    elif args.command == "batch":
        cmd_batch(args)
    elif args.command == "search":
        cmd_search(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
