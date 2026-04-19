#!/usr/bin/env python3
"""Initialize the Basho DB (場所性データベース)."""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "basho.db"


def init():
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()

    # Facilities table - core entity
    c.execute("""
    CREATE TABLE IF NOT EXISTS facilities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_kana TEXT,
        category TEXT NOT NULL,  -- restaurant_japanese, restaurant_western, restaurant_cafe, hotel, ryokan, minshuku, other
        subcategory TEXT,        -- soba, sushi, kappo, classic_hotel, onsen_ryokan, etc.
        url TEXT,
        address TEXT,
        prefecture TEXT,
        city TEXT,
        latitude REAL,
        longitude REAL,
        overview TEXT,           -- brief description
        features TEXT,           -- JSON array of feature tags
        founded_year INTEGER,    -- establishment year
        cultural_designation TEXT, -- 文化財指定 (registered_tangible, important, etc.)
        source_type TEXT,        -- public_list, manual, web_search
        source_url TEXT,         -- where the info was found
        collected_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
    )
    """)

    # Basho scores - evaluation results from the basho agent
    c.execute("""
    CREATE TABLE IF NOT EXISTS basho_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        facility_id TEXT NOT NULL REFERENCES facilities(id),
        historical_continuity REAL,      -- axis 1: 歴史的継続性
        cultural_practice_depth REAL,    -- axis 2: 文化的営みの深度
        regional_rootedness REAL,        -- axis 3: 地域的固有性
        material_heritage REAL,          -- axis 4: 物質的文化財性
        insideness REAL,                 -- axis 5: 場所の内側性
        cultural_complexity REAL,        -- axis 6: 文化的複雑性
        narrative_quality REAL,          -- axis 7: ナラティブ性
        authenticity REAL,               -- axis 8: 本物性
        total_score REAL,                -- weighted average
        rationale TEXT,                  -- JSON with per-axis reasoning
        evaluated_at TEXT DEFAULT (datetime('now')),
        model_used TEXT                  -- which AI model was used
    )
    """)

    # Sources - track where information came from
    c.execute("""
    CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        facility_id TEXT NOT NULL REFERENCES facilities(id),
        source_type TEXT NOT NULL,  -- website, public_db, manual, article, book
        source_name TEXT,           -- e.g., "文化庁国指定文化財DB", "食べログ"
        source_url TEXT,
        retrieved_at TEXT DEFAULT (datetime('now')),
        raw_content TEXT            -- cached page content for re-evaluation
    )
    """)

    # Seed lists - curated lists of facilities to investigate
    c.execute("""
    CREATE TABLE IF NOT EXISTS seed_lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        list_name TEXT NOT NULL,    -- e.g., "registered_tangible_cultural_properties", "classic_hotels"
        facility_name TEXT NOT NULL,
        facility_url TEXT,
        facility_address TEXT,
        notes TEXT,
        status TEXT DEFAULT 'pending',  -- pending, collected, skipped
        created_at TEXT DEFAULT (datetime('now'))
    )
    """)

    # Indexes
    c.execute("CREATE INDEX IF NOT EXISTS idx_facilities_prefecture ON facilities(prefecture)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_facilities_category ON facilities(category)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_facilities_source ON facilities(source_type)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_basho_scores_facility ON basho_scores(facility_id)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_basho_scores_total ON basho_scores(total_score)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_sources_facility ON sources(facility_id)")

    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")
    print("Tables: facilities, basho_scores, sources, seed_lists")


if __name__ == "__main__":
    init()
