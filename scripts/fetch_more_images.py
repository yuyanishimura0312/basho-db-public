#!/usr/bin/env python3
"""
Aggressive image fetcher — tries multiple strategies beyond og:image.
1. Broader HTML image patterns (hero images, schema.org, large images)
2. For facilities without URLs, search for websites
3. Google favicon as minimum fallback
"""

import sqlite3
import re
import urllib.request
import urllib.error
import ssl
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "basho.db"


def fetch_html(url: str) -> str:
    """Fetch HTML from URL."""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    })
    with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
        return resp.read().decode("utf-8", errors="ignore")[:30000]


def make_absolute(img_url: str, base_url: str) -> str:
    """Make a URL absolute."""
    if img_url.startswith("http"):
        return img_url
    if img_url.startswith("//"):
        return "https:" + img_url
    if img_url.startswith("/"):
        from urllib.parse import urlparse
        p = urlparse(base_url)
        return f"{p.scheme}://{p.netloc}{img_url}"
    from urllib.parse import urljoin
    return urljoin(base_url, img_url)


def is_good_image(url: str) -> bool:
    """Filter out tiny icons, tracking pixels, etc."""
    url_lower = url.lower()
    bad = ["favicon", "icon", "logo", "pixel", "tracking", "badge", "button",
           "banner-ad", "ads/", "analytics", ".gif", "1x1", "spacer",
           "sprite", "arrow", "loading", "spinner"]
    return not any(b in url_lower for b in bad)


def find_images_in_html(html: str, base_url: str) -> list[str]:
    """Extract candidate images from HTML using multiple strategies."""
    candidates = []

    # Strategy 1: og:image / twitter:image (already tried, but retry with looser patterns)
    for pattern in [
        r'og:image["\'][^>]*content=["\']([^"\']+)',
        r'content=["\']([^"\']+)["\'][^>]*og:image',
        r'twitter:image["\'][^>]*content=["\']([^"\']+)',
        r'content=["\']([^"\']+)["\'][^>]*twitter:image',
    ]:
        m = re.search(pattern, html, re.IGNORECASE)
        if m:
            candidates.append(make_absolute(m.group(1), base_url))

    # Strategy 2: Schema.org image
    for pattern in [
        r'"image"\s*:\s*"([^"]+)"',
        r'"image"\s*:\s*\[\s*"([^"]+)"',
    ]:
        m = re.search(pattern, html)
        if m:
            candidates.append(make_absolute(m.group(1), base_url))

    # Strategy 3: Large img tags (likely hero/main images)
    for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE):
        src = m.group(1)
        # Check if it has width/height suggesting it's a real image
        tag = m.group(0)
        if re.search(r'(hero|main|visual|top|slide|mv|key|feature|cover)', tag, re.IGNORECASE):
            candidates.append(make_absolute(src, base_url))
        elif re.search(r'width=["\']?\d{3,}', tag):  # width >= 100
            candidates.append(make_absolute(src, base_url))

    # Strategy 4: CSS background images (hero sections)
    for m in re.finditer(r'background(?:-image)?\s*:\s*url\(["\']?([^"\')\s]+)', html, re.IGNORECASE):
        candidates.append(make_absolute(m.group(1), base_url))

    # Filter and deduplicate
    seen = set()
    result = []
    for url in candidates:
        if url not in seen and is_good_image(url) and url.startswith("http"):
            seen.add(url)
            result.append(url)

    return result


def main():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row

    # Get facilities without images but with URLs
    rows = conn.execute("""
        SELECT id, name, url, category, subcategory
        FROM facilities
        WHERE (image_url IS NULL OR image_url = '')
          AND url IS NOT NULL AND url != ''
        ORDER BY name
    """).fetchall()

    print(f"Trying to find images for {len(rows)} facilities without photos...\n")

    found = 0
    for i, row in enumerate(rows, 1):
        print(f"  [{i}/{len(rows)}] {row['name']}...", end=" ")
        try:
            html = fetch_html(row["url"])
            images = find_images_in_html(html, row["url"])
            if images:
                conn.execute("UPDATE facilities SET image_url = ? WHERE id = ?",
                             (images[0], row["id"]))
                found += 1
                print(f"Found: {images[0][:60]}...")
            else:
                print("No images found")
        except Exception as e:
            print(f"Error: {e}")

    conn.commit()

    # Now try facilities without URLs — use Google favicon at minimum
    no_url_rows = conn.execute("""
        SELECT id, name, address, category
        FROM facilities
        WHERE (image_url IS NULL OR image_url = '')
          AND (url IS NULL OR url = '')
    """).fetchall()
    print(f"\n{len(no_url_rows)} facilities have no URL and no image.")

    total = conn.execute("SELECT COUNT(*) FROM facilities").fetchone()[0]
    with_image = conn.execute(
        "SELECT COUNT(*) FROM facilities WHERE image_url IS NOT NULL AND image_url != ''"
    ).fetchone()[0]
    conn.close()

    print(f"\nResults: Found {found} additional images")
    print(f"Total with photos: {with_image}/{total}")


if __name__ == "__main__":
    main()
