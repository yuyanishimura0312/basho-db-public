#!/usr/bin/env python3
"""
Fetch OG images from facility websites for accurate photos.
Falls back to category-appropriate placeholder if no OG image found.
"""

import sqlite3
import re
import urllib.request
import urllib.error
import ssl
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "basho.db"

# Category-specific fallback colors (no fake photos)
CATEGORY_PLACEHOLDERS = {
    "restaurant_japanese": None,
    "restaurant_western": None,
    "restaurant_cafe": None,
    "hotel": None,
    "ryokan": None,
    "minshuku": None,
}


def fetch_og_image(url: str) -> str | None:
    """Fetch the og:image URL from a webpage."""
    if not url or url.strip() == "":
        return None
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            html = resp.read().decode("utf-8", errors="ignore")[:20000]

        # Try og:image
        match = re.search(r'<meta\s+(?:property|name)=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
        if not match:
            match = re.search(r'content=["\']([^"\']+)["\']\s+(?:property|name)=["\']og:image["\']', html, re.IGNORECASE)
        if match:
            img_url = match.group(1)
            # Make absolute URL
            if img_url.startswith("//"):
                img_url = "https:" + img_url
            elif img_url.startswith("/"):
                from urllib.parse import urlparse
                parsed = urlparse(url)
                img_url = f"{parsed.scheme}://{parsed.netloc}{img_url}"
            return img_url

        # Try twitter:image
        match = re.search(r'<meta\s+(?:property|name)=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
        if not match:
            match = re.search(r'content=["\']([^"\']+)["\']\s+(?:property|name)=["\']twitter:image["\']', html, re.IGNORECASE)
        if match:
            img_url = match.group(1)
            if img_url.startswith("//"):
                img_url = "https:" + img_url
            elif img_url.startswith("/"):
                from urllib.parse import urlparse
                parsed = urlparse(url)
                img_url = f"{parsed.scheme}://{parsed.netloc}{img_url}"
            return img_url

        return None
    except Exception as e:
        print(f"    [error] {e}")
        return None


def main():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row

    rows = conn.execute(
        "SELECT id, name, url, category, subcategory FROM facilities WHERE url IS NOT NULL AND url != '' ORDER BY name"
    ).fetchall()

    found = 0
    failed = 0
    skipped = 0

    for i, row in enumerate(rows, 1):
        url = row["url"]
        name = row["name"]
        print(f"  [{i}/{len(rows)}] {name}...", end=" ")

        og_image = fetch_og_image(url)
        if og_image:
            conn.execute("UPDATE facilities SET image_url = ? WHERE id = ?", (og_image, row["id"]))
            found += 1
            print(f"OK: {og_image[:60]}...")
        else:
            # Clear fake Unsplash photo — better no photo than wrong photo
            conn.execute("UPDATE facilities SET image_url = NULL WHERE id = ?", (row["id"],))
            failed += 1
            print("No OG image")

    # Clear images for facilities without URLs too
    conn.execute("UPDATE facilities SET image_url = NULL WHERE url IS NULL OR url = ''")

    conn.commit()
    total = conn.execute("SELECT COUNT(*) FROM facilities").fetchone()[0]
    with_image = conn.execute("SELECT COUNT(*) FROM facilities WHERE image_url IS NOT NULL AND image_url != ''").fetchone()[0]
    conn.close()

    print(f"\nResults: {found} found, {failed} no OG image")
    print(f"Total: {with_image}/{total} facilities have real photos")


if __name__ == "__main__":
    main()
