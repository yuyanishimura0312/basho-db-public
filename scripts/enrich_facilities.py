#!/usr/bin/env python3
"""
Enrich facilities with detailed content by reading their websites
and generating basho-sei narratives using Claude API.

Usage:
  python3 scripts/enrich_facilities.py --limit 10
  python3 scripts/enrich_facilities.py --id f-xxxx
  python3 scripts/enrich_facilities.py --scored  # Only scored facilities
"""

import sqlite3
import json
import os
import sys
import subprocess
import argparse
import time
import urllib.request
import urllib.error
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "basho.db"

UNSPLASH_KEYWORDS = {
    "restaurant_japanese": "japanese restaurant interior",
    "restaurant_western": "french restaurant elegant",
    "restaurant_cafe": "japanese coffee shop vintage",
    "hotel": "classic hotel japan",
    "ryokan": "japanese ryokan traditional",
    "minshuku": "japanese farmhouse inn",
}

SUBCATEGORY_KEYWORDS = {
    "soba": "soba noodles japan",
    "sushi": "sushi counter japan",
    "tempura": "tempura japan",
    "unagi": "unagi eel japan",
    "kaiseki": "kaiseki japanese cuisine",
    "wagashi": "japanese wagashi sweets",
    "french": "french fine dining",
    "italian": "italian restaurant elegant",
    "yoshoku": "japanese western food yoshoku",
    "bar": "classic cocktail bar",
    "bakery": "artisan bakery bread",
    "patisserie": "french patisserie cake",
    "kissaten": "japanese kissaten coffee",
    "classic_hotel": "classic hotel lobby japan",
    "onsen_ryokan": "onsen hot spring ryokan",
    "steak": "steak restaurant japan",
    "curry": "japanese curry rice",
    "cafe": "cafe interior japan",
}


def _get_api_key() -> str:
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


def fetch_url_content(url: str, max_length: int = 8000) -> str:
    """Fetch text content from a URL."""
    if not url or url.strip() == "":
        return ""
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) BashoBot/1.0"
        })
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
        # Strip HTML tags roughly
        import re
        text = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL)
        text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text[:max_length]
    except Exception as e:
        print(f"    [fetch error] {url}: {e}")
        return ""


def get_unsplash_url(category: str, subcategory: str, name: str) -> str:
    """Generate Unsplash source URL for a facility."""
    keyword = SUBCATEGORY_KEYWORDS.get(subcategory, "")
    if not keyword:
        keyword = UNSPLASH_KEYWORDS.get(category, "japan restaurant")
    return f"https://source.unsplash.com/800x600/?{keyword.replace(' ', ',')}"


def generate_rich_content(facility: dict, web_content: str) -> dict:
    """Use Claude to generate rich content for a facility."""
    api_key = _get_api_key()
    if not api_key:
        print("Error: No API key")
        return {}

    import anthropic
    client = anthropic.Anthropic(api_key=api_key)

    features = facility.get("features", "[]")
    if isinstance(features, str):
        try:
            features = json.loads(features)
        except (json.JSONDecodeError, TypeError):
            features = []

    prompt = f"""以下の施設について、詳細な情報を生成してください。

## 施設情報
- 名前: {facility['name']}
- カテゴリ: {facility['category']} / {facility.get('subcategory', '')}
- 住所: {facility.get('address', '')}
- 概要: {facility.get('overview', '')}
- 特徴: {', '.join(features) if isinstance(features, list) else features}
- 創業年: {facility.get('founded_year', '不明')}
- 文化財指定: {facility.get('cultural_designation', 'なし')}

## Webサイトから取得した情報（参考）
{web_content[:4000] if web_content else '（取得できませんでした）'}

## 生成してほしい情報
以下のJSON形式で出力してください。すべて日本語で記述してください。

```json
{{
  "detailed_description": "場所性の8軸（歴史的継続性、文化的営みの深度、地域的固有性、物質的文化財性、場所の内側性、文化的複雑性、ナラティブ性、本物性）の観点を織り交ぜた、200-300字程度の詳細な解説",
  "history_text": "この施設の歴史的変遷を100-200字程度で。創業の経緯、時代ごとの変化、重要な出来事など",
  "cultural_context": "文化的文脈を100-150字で。どのような文化的意義を持つか、地域や時代の中での位置づけ",
  "signature_dishes": ["看板メニュー1", "看板メニュー2", "看板メニュー3"],
  "price_range": "ランチ ¥X,XXX〜 / ディナー ¥XX,XXX〜 のような形式。不明なら推定で",
  "atmosphere": "空間の雰囲気を50-100字で。五感に訴える描写",
  "basho_narrative": "この場所の「場所の物語」を150-250字で。訪問者の視点から、この場所でしか得られない体験を物語的に描写",
  "hours": "営業時間（不明なら推定）",
  "closed_days": "定休日（不明なら推定）",
  "access": "最寄り駅からのアクセス",
  "reservation_note": "予約に関する情報（予約必須、予約推奨、予約不要など）"
}}
```"""

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )
        content = response.content[0].text.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        print(f"    [generate error] {e}")
        return {}


def save_enrichment(conn, facility_id: str, data: dict, image_url: str):
    """Save enriched data to DB."""
    fields = {
        "detailed_description": data.get("detailed_description", ""),
        "history_text": data.get("history_text", ""),
        "cultural_context": data.get("cultural_context", ""),
        "signature_dishes": json.dumps(data.get("signature_dishes", []), ensure_ascii=False),
        "price_range": data.get("price_range", ""),
        "atmosphere": data.get("atmosphere", ""),
        "basho_narrative": data.get("basho_narrative", ""),
        "hours": data.get("hours", ""),
        "closed_days": data.get("closed_days", ""),
        "access": data.get("access", ""),
        "reservation_note": data.get("reservation_note", ""),
        "image_url": image_url,
    }

    set_clause = ", ".join(f"{k} = ?" for k in fields.keys())
    values = list(fields.values()) + [facility_id]
    conn.execute(f"UPDATE facilities SET {set_clause} WHERE id = ?", values)


def main():
    parser = argparse.ArgumentParser(description="Enrich facility data")
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--id", type=str, help="Specific facility ID")
    parser.add_argument("--scored", action="store_true", help="Only scored facilities")
    parser.add_argument("--all", action="store_true", help="All unenriched facilities")
    args = parser.parse_args()

    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row

    if args.id:
        rows = conn.execute("SELECT * FROM facilities WHERE id = ?", (args.id,)).fetchall()
    elif args.scored:
        rows = conn.execute("""
            SELECT f.* FROM facilities f
            JOIN basho_scores bs ON f.id = bs.facility_id
            WHERE f.detailed_description IS NULL OR f.detailed_description = ''
            ORDER BY bs.total_score DESC
            LIMIT ?
        """, (args.limit,)).fetchall()
    elif args.all:
        rows = conn.execute("""
            SELECT * FROM facilities
            WHERE detailed_description IS NULL OR detailed_description = ''
            ORDER BY founded_year ASC NULLS LAST
            LIMIT ?
        """, (args.limit,)).fetchall()
    else:
        rows = conn.execute("""
            SELECT * FROM facilities
            WHERE detailed_description IS NULL OR detailed_description = ''
            ORDER BY
                CASE WHEN founded_year IS NOT NULL THEN 0 ELSE 1 END,
                founded_year ASC
            LIMIT ?
        """, (args.limit,)).fetchall()

    if not rows:
        print("No facilities to enrich.")
        return

    print(f"Enriching {len(rows)} facilities...")

    for i, row in enumerate(rows, 1):
        f = dict(row)
        print(f"  [{i}/{len(rows)}] {f['name']}...")

        # Fetch website content
        web_content = ""
        if f.get("url"):
            web_content = fetch_url_content(f["url"])
            if web_content:
                print(f"    Fetched {len(web_content)} chars from website")

        # Generate rich content
        data = generate_rich_content(f, web_content)
        if not data:
            print(f"    Skipped (generation failed)")
            continue

        # Get image URL
        image_url = get_unsplash_url(f["category"], f.get("subcategory", ""), f["name"])

        # Build reservation URL
        if f.get("url"):
            # Try common reservation paths
            reservation_url = f["url"]
        else:
            reservation_url = ""

        # Save
        save_enrichment(conn, f["id"], data, image_url)
        conn.commit()

        print(f"    Done: {data.get('signature_dishes', [])}")
        time.sleep(0.5)  # Rate limiting

    conn.close()
    print(f"\nEnrichment complete: {len(rows)} facilities updated")


if __name__ == "__main__":
    main()
