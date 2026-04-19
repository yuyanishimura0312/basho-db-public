#!/usr/bin/env python3
"""
Assign curated Unsplash photos to facilities by category/subcategory.
Uses Unsplash Source for free, attribution-free photos.
"""

import sqlite3
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "basho.db"

# Curated Unsplash photo IDs for each category
# These are specific, high-quality photos selected for basho-sei aesthetic
PHOTO_SETS = {
    # Japanese restaurants - warm, intimate, traditional
    "soba": [
        "photo-1553621042-f6e147245754",  # soba noodles
        "photo-1617196034183-421b4917c92d",  # japanese noodles
        "photo-1585032226651-759b368d7246",  # japanese restaurant
        "photo-1580442151529-343f2f6e0e27",  # japanese food
    ],
    "sushi": [
        "photo-1579871494447-9811cf80d66c",  # sushi counter
        "photo-1553621042-f6e147245754",  # japanese dining
        "photo-1617196034183-421b4917c92d",  # sushi
    ],
    "tempura": [
        "photo-1580442151529-343f2f6e0e27",  # japanese food
        "photo-1553621042-f6e147245754",  # tempura
    ],
    "kaiseki": [
        "photo-1553621042-f6e147245754",  # kaiseki
        "photo-1585032226651-759b368d7246",  # fine dining japan
    ],
    "wagashi": [
        "photo-1563245372-f21724e3856d",  # japanese sweets
        "photo-1558618666-fcd25c85f82e",  # matcha
    ],
    "unagi": [
        "photo-1580442151529-343f2f6e0e27",  # grilled eel
    ],
    # Western restaurants
    "french": [
        "photo-1414235077428-338989a2e8c0",  # fine dining
        "photo-1550966871-3ed3cdb51f3a",  # elegant restaurant
        "photo-1517248135467-4c7edcad34c4",  # restaurant interior
        "photo-1559339352-11d035aa65de",  # french cuisine
    ],
    "italian": [
        "photo-1555396273-367ea4eb4db5",  # italian restaurant
        "photo-1498579150354-977475b7ea0b",  # pasta
        "photo-1517248135467-4c7edcad34c4",  # restaurant
    ],
    "yoshoku": [
        "photo-1551218808-94e220e084d2",  # western style
        "photo-1414235077428-338989a2e8c0",  # dining
    ],
    "bistro": [
        "photo-1555396273-367ea4eb4db5",  # bistro
        "photo-1517248135467-4c7edcad34c4",  # casual dining
    ],
    "steak": [
        "photo-1558030006-450675393462",  # steak
        "photo-1546833999-b9f581a1996d",  # grilled meat
    ],
    "bar": [
        "photo-1470337458703-46ad1756a187",  # cocktail bar
        "photo-1572116469696-31de0f17cc34",  # bar interior
        "photo-1525268323446-0505b6fe7778",  # whiskey
    ],
    # Patisserie & Bakery
    "patisserie": [
        "photo-1558961363-fa8fdf82db35",  # patisserie
        "photo-1488477181946-6428a0291777",  # cakes
        "photo-1563729784474-d77dbb933a9e",  # french pastry
    ],
    "bakery": [
        "photo-1509440159596-0249088772ff",  # artisan bread
        "photo-1549931319-a545dcf3bc73",  # bakery
        "photo-1517433670267-08bbd4be890f",  # baguette
    ],
    "chocolatier": [
        "photo-1481391319762-47dff72954d9",  # chocolate
        "photo-1606312619070-d48b4c652a52",  # chocolatier
    ],
    # Cafes
    "kissaten": [
        "photo-1445116572660-236099ec97a0",  # vintage cafe
        "photo-1501339847302-ac426a4a7cbb",  # coffee shop
        "photo-1521017432531-fbd92d768814",  # retro cafe
    ],
    "cafe": [
        "photo-1501339847302-ac426a4a7cbb",  # cafe
        "photo-1445116572660-236099ec97a0",  # coffee
        "photo-1554118811-1e0d58224f24",  # cafe interior
    ],
    "coffee": [
        "photo-1495474472287-4d71bcdd2085",  # specialty coffee
        "photo-1501339847302-ac426a4a7cbb",  # pour over
    ],
    "tearoom": [
        "photo-1556679343-c7306c1976bc",  # tea room
        "photo-1544787219-7f47ccb76574",  # afternoon tea
    ],
    "tea": [
        "photo-1558618666-fcd25c85f82e",  # japanese tea
        "photo-1556679343-c7306c1976bc",  # tea ceremony
    ],
    # Hotels & Ryokan
    "classic_hotel": [
        "photo-1566073771259-6a8506099945",  # hotel lobby
        "photo-1551882547-ff40c63fe5fa",  # classic hotel
        "photo-1520250497591-112f2f40a3f4",  # hotel exterior
    ],
    "onsen_ryokan": [
        "photo-1540541338287-41700207dee6",  # onsen
        "photo-1503899036084-c55cdd92da26",  # ryokan
        "photo-1578683010236-d716f9a3f461",  # japanese inn
    ],
    "traditional_ryokan": [
        "photo-1503899036084-c55cdd92da26",  # traditional ryokan
        "photo-1578683010236-d716f9a3f461",  # tatami
    ],
    # Other
    "curry": [
        "photo-1565557623262-b51c2513a641",  # curry
    ],
    "beer_hall": [
        "photo-1525268323446-0505b6fe7778",  # beer hall
    ],
    "chinese": [
        "photo-1563245372-f21724e3856d",  # chinese dining
    ],
}

# Fallback by category
CATEGORY_PHOTOS = {
    "restaurant_japanese": "photo-1553621042-f6e147245754",
    "restaurant_western": "photo-1414235077428-338989a2e8c0",
    "restaurant_cafe": "photo-1501339847302-ac426a4a7cbb",
    "hotel": "photo-1566073771259-6a8506099945",
    "ryokan": "photo-1503899036084-c55cdd92da26",
    "minshuku": "photo-1578683010236-d716f9a3f461",
}


def get_photo_url(photo_id: str, width: int = 800, height: int = 600) -> str:
    """Generate Unsplash image URL from photo ID."""
    return f"https://images.unsplash.com/{photo_id}?w={width}&h={height}&fit=crop&auto=format&q=80"


def assign_photos():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row

    rows = conn.execute("SELECT id, name, category, subcategory FROM facilities").fetchall()

    updated = 0
    for i, row in enumerate(rows):
        subcat = row["subcategory"] or ""
        cat = row["category"] or ""

        # Get photo set for subcategory, then fallback to category
        photos = PHOTO_SETS.get(subcat, [])
        if not photos:
            fallback_id = CATEGORY_PHOTOS.get(cat, "photo-1414235077428-338989a2e8c0")
            photos = [fallback_id]

        # Rotate through photos based on facility index
        photo_id = photos[i % len(photos)]
        photo_url = get_photo_url(photo_id)

        conn.execute(
            "UPDATE facilities SET image_url = ? WHERE id = ?",
            (photo_url, row["id"]),
        )
        updated += 1

    conn.commit()
    conn.close()
    print(f"Assigned photos to {updated} facilities")


if __name__ == "__main__":
    assign_photos()
