#!/usr/bin/env python3
"""
Find missing URLs for facilities using web search.
"""

import sqlite3
import json
import os
import subprocess
import urllib.request
import urllib.parse
import ssl
import re
import time
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "basho.db"


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


def search_url_with_claude(name: str, address: str, category: str) -> str | None:
    """Use Claude to determine the most likely official URL."""
    api_key = _get_api_key()
    if not api_key:
        return None

    import anthropic
    client = anthropic.Anthropic(api_key=api_key)

    prompt = f"""以下の日本の施設の公式WebサイトURLを教えてください。

施設名: {name}
住所: {address}
カテゴリ: {category}

公式サイトのURLだけを1行で回答してください。確信が持てない場合や、公式サイトが存在しないと思われる場合は「なし」と回答してください。食べログやRetty等のレビューサイトのURLは不可です。"""

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}],
        )
        answer = response.content[0].text.strip()
        if answer == "なし" or "なし" in answer or len(answer) > 200:
            return None
        # Extract URL from answer
        url_match = re.search(r'https?://[^\s<>"\']+', answer)
        if url_match:
            return url_match.group(0).rstrip("/.,;:)")
        return None
    except Exception as e:
        print(f"    [error] {e}")
        return None


def verify_url(url: str) -> bool:
    """Check if URL is reachable."""
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = urllib.request.Request(url, method="HEAD", headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
        })
        with urllib.request.urlopen(req, timeout=5, context=ctx) as resp:
            return resp.status < 400
    except Exception:
        # Try GET if HEAD fails
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
            })
            with urllib.request.urlopen(req, timeout=5, context=ctx) as resp:
                return resp.status < 400
        except Exception:
            return False


def main():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row

    rows = conn.execute("""
        SELECT id, name, address, category, subcategory
        FROM facilities
        WHERE url IS NULL OR url = ''
        ORDER BY name
    """).fetchall()

    print(f"Finding URLs for {len(rows)} facilities...\n")

    found = 0
    for i, row in enumerate(rows, 1):
        print(f"  [{i}/{len(rows)}] {row['name']}...", end=" ")

        url = search_url_with_claude(row["name"], row["address"] or "", row["category"])

        if url:
            conn.execute("UPDATE facilities SET url = ? WHERE id = ?", (url, row["id"]))
            found += 1
            print(f"-> {url}")
        else:
            print("No URL")

        if i % 20 == 0:
            conn.commit()
            time.sleep(1)

    conn.commit()
    conn.close()
    print(f"\nFound URLs for {found}/{len(rows)} facilities")


if __name__ == "__main__":
    main()
