#!/usr/bin/env python3
"""
Web Collector - Collect additional historically significant facilities
from public data sources and curated knowledge.

Adds more facilities from Tokyo/Kanto to reach 100+ target.
"""

import sqlite3
import json
import uuid
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "basho.db"


def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def gen_id():
    return f"f-{uuid.uuid4().hex[:12]}"


def insert_facility(conn, data: dict):
    """Insert a facility, skip if name already exists."""
    existing = conn.execute(
        "SELECT id FROM facilities WHERE name = ?", (data.get("name", ""),)
    ).fetchone()
    if existing:
        return None

    fid = gen_id()
    conn.execute("""
        INSERT INTO facilities (id, name, name_kana, category, subcategory, url, address,
                                prefecture, city, overview, features, founded_year,
                                cultural_designation, source_type, source_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        fid,
        data.get("name", ""),
        data.get("name_kana", ""),
        data.get("category", "other"),
        data.get("subcategory", ""),
        data.get("url", ""),
        data.get("address", ""),
        data.get("prefecture", ""),
        data.get("city", ""),
        data.get("overview", ""),
        json.dumps(data.get("features", []), ensure_ascii=False),
        data.get("founded_year"),
        data.get("cultural_designation", ""),
        data.get("source_type", "manual"),
        data.get("source_url", ""),
    ))
    return fid


# Additional curated facilities - Tokyo/Kanto expansion + notable nationwide

ADDITIONAL_DATA = [
    # --- More Tokyo historic restaurants ---
    {
        "name": "吉兆 東京本店",
        "category": "restaurant_japanese",
        "subcategory": "kaiseki",
        "url": "https://www.kitcho.com/",
        "address": "東京都中央区銀座8-17-4",
        "prefecture": "東京都",
        "city": "中央区",
        "overview": "1930年大阪で創業。日本料理の最高峰の一つ。湯木貞一が確立した懐石料理の美意識。器・空間・もてなしの総合芸術。",
        "features": ["懐石料理", "1930年創業", "銀座", "日本料理の最高峰"],
        "founded_year": 1930,
        "source_type": "manual",
    },
    {
        "name": "つきじ宮川本廛",
        "category": "restaurant_japanese",
        "subcategory": "unagi",
        "url": "",
        "address": "東京都中央区築地1-4-6",
        "prefecture": "東京都",
        "city": "中央区",
        "overview": "1893年創業。築地の老舗鰻店。江戸前鰻の伝統を守り、築地の食文化を代表する存在。",
        "features": ["鰻", "1893年創業", "築地", "江戸前", "老舗"],
        "founded_year": 1893,
        "source_type": "manual",
    },
    {
        "name": "天ぷら 近藤",
        "category": "restaurant_japanese",
        "subcategory": "tempura",
        "url": "",
        "address": "東京都中央区銀座5-5-13",
        "prefecture": "東京都",
        "city": "中央区",
        "overview": "ミシュラン二つ星。野菜天ぷらの革新者・近藤文夫の店。さつまいもの天ぷらが象徴する、素材の本質を引き出す職人技。",
        "features": ["天ぷら", "銀座", "ミシュラン二つ星", "野菜天ぷら", "職人技"],
        "source_type": "manual",
    },
    {
        "name": "鮨 さいとう",
        "category": "restaurant_japanese",
        "subcategory": "sushi",
        "url": "",
        "address": "東京都港区六本木1-4-5",
        "prefecture": "東京都",
        "city": "港区",
        "overview": "ミシュラン三ツ星。齋藤孝司による江戸前鮨の極致。シャリの温度、ネタの熟成、握りの圧まで極められた身体知の結晶。",
        "features": ["寿司", "六本木", "ミシュラン三ツ星", "江戸前鮨", "身体知"],
        "source_type": "manual",
    },
    {
        "name": "篁 日本料理",
        "category": "restaurant_japanese",
        "subcategory": "kaiseki",
        "url": "",
        "address": "東京都港区西麻布4-18-20",
        "prefecture": "東京都",
        "city": "港区",
        "overview": "西麻布の隠れ家的日本料理店。古い一軒家を使い、茶道の精神を料理に落とし込んだ空間。場所の親密性が際立つ。",
        "features": ["日本料理", "西麻布", "一軒家", "茶道の精神", "隠れ家"],
        "source_type": "manual",
    },

    # --- Tokyo Kissaten Culture ---
    {
        "name": "喫茶 茶亭 羽當",
        "category": "restaurant_cafe",
        "subcategory": "kissaten",
        "url": "",
        "address": "東京都渋谷区渋谷1-15-19",
        "prefecture": "東京都",
        "city": "渋谷区",
        "overview": "渋谷の喧騒の中に静寂を保つ純喫茶。一杯ずつネルドリップで淹れる珈琲と骨董の器。喫茶店文化の本質を体現。",
        "features": ["喫茶店", "渋谷", "ネルドリップ", "骨董の器", "純喫茶"],
        "source_type": "manual",
    },
    {
        "name": "トリコロール 本店",
        "category": "restaurant_cafe",
        "subcategory": "kissaten",
        "url": "https://www.tricolore.co.jp/",
        "address": "東京都中央区銀座5-9-17",
        "prefecture": "東京都",
        "city": "中央区",
        "overview": "1936年創業。銀座の老舗喫茶店。自家焙煎珈琲と銀座の文化が調和。文化人・芸術家が集った場所の記憶を継承。",
        "features": ["喫茶店", "1936年創業", "銀座", "自家焙煎", "文化人の集い"],
        "founded_year": 1936,
        "source_type": "manual",
    },
    {
        "name": "邪宗門",
        "category": "restaurant_cafe",
        "subcategory": "kissaten",
        "url": "",
        "address": "東京都文京区千駄木2-39-12",
        "prefecture": "東京都",
        "city": "文京区",
        "overview": "千駄木の名物喫茶。ステンドグラスとアンティークに囲まれた独特の空間。谷根千の文化的多層性を象徴。",
        "features": ["喫茶店", "千駄木", "ステンドグラス", "アンティーク", "谷根千"],
        "source_type": "manual",
    },

    # --- Kanto region expansion ---
    {
        "name": "丸山珈琲 軽井沢本店",
        "category": "restaurant_cafe",
        "subcategory": "coffee",
        "url": "https://www.maruyamacoffee.com/",
        "address": "長野県北佐久郡軽井沢町軽井沢1154-10",
        "prefecture": "長野県",
        "city": "軽井沢町",
        "overview": "1991年創業。スペシャルティコーヒーの先駆者。軽井沢の別荘文化と珈琲文化の融合。産地と直接繋がるコーヒーの哲学。",
        "features": ["珈琲", "1991年創業", "軽井沢", "スペシャルティコーヒー", "産地直結"],
        "founded_year": 1991,
        "source_type": "manual",
    },
    {
        "name": "鳥仙",
        "category": "restaurant_japanese",
        "subcategory": "yakitori",
        "url": "",
        "address": "東京都港区芝5-18-2",
        "prefecture": "東京都",
        "city": "港区",
        "overview": "1910年創業。田町の老舗焼鳥店。100年以上続く秘伝のタレ。下町の日常食としての焼鳥文化を継承。",
        "features": ["焼鳥", "1910年創業", "田町", "秘伝のタレ", "100年以上"],
        "founded_year": 1910,
        "source_type": "manual",
    },

    # --- Notable nationwide (for diversity) ---
    {
        "name": "奈良ホテル",
        "category": "hotel",
        "subcategory": "classic_hotel",
        "url": "https://www.narahotel.co.jp/",
        "address": "奈良県奈良市高畑町1096",
        "prefecture": "奈良県",
        "city": "奈良市",
        "overview": "1909年開業。辰野金吾設計による和洋折衷のクラシックホテル。「関西の迎賓館」と呼ばれ、皇族・国賓を迎えてきた歴史。",
        "features": ["クラシックホテル", "1909年開業", "辰野金吾設計", "関西の迎賓館", "和洋折衷"],
        "founded_year": 1909,
        "source_type": "manual",
    },
    {
        "name": "蔦温泉旅館",
        "category": "ryokan",
        "subcategory": "onsen_ryokan",
        "url": "https://tsutaonsen.com/",
        "address": "青森県十和田市奥瀬蔦野湯1",
        "prefecture": "青森県",
        "city": "十和田市",
        "overview": "平安時代開湯とされる秘湯。ブナの原生林に囲まれた一軒宿。足元湧出の温泉。大町桂月が晩年を過ごした場所。",
        "features": ["温泉旅館", "秘湯", "ブナ原生林", "足元湧出", "大町桂月"],
        "source_type": "manual",
    },
    {
        "name": "雲仙観光ホテル",
        "category": "hotel",
        "subcategory": "classic_hotel",
        "url": "https://www.unzenkankohotel.com/",
        "address": "長崎県雲仙市小浜町雲仙320",
        "prefecture": "長崎県",
        "city": "雲仙市",
        "overview": "1935年開業。国立公園内初のリゾートホテル。スイスシャレー様式の建築。登録有形文化財。国際避暑地としての歴史。",
        "features": ["クラシックホテル", "1935年開業", "国立公園", "スイスシャレー", "登録有形文化財"],
        "founded_year": 1935,
        "cultural_designation": "registered_tangible",
        "source_type": "manual",
    },
    {
        "name": "川久ミュージアム&ホテル",
        "category": "hotel",
        "subcategory": "resort",
        "url": "https://www.hotel-kawakyu.jp/",
        "address": "和歌山県西牟婁郡白浜町3745",
        "prefecture": "和歌山県",
        "city": "白浜町",
        "overview": "1993年開業。世界各地の職人技術を結集した建築。中国紫禁城の瑠璃瓦、イタリアの大理石、フランスの金箔。建築自体が文化資本の集積。",
        "features": ["ホテル", "建築美", "世界の職人技", "白浜", "文化資本の集積"],
        "founded_year": 1993,
        "source_type": "manual",
    },
    {
        "name": "星のや 軽井沢",
        "category": "ryokan",
        "subcategory": "resort_ryokan",
        "url": "https://hoshinoya.com/karuizawa/",
        "address": "長野県北佐久郡軽井沢町星野",
        "prefecture": "長野県",
        "city": "軽井沢町",
        "overview": "星野温泉の歴史（大正4年開湯）を継承しつつ現代に再解釈した宿。谷の集落という場所性を活かした設計。自然との共生。",
        "features": ["リゾート旅館", "星野温泉", "大正開湯", "谷の集落", "自然との共生"],
        "source_type": "manual",
    },
    {
        "name": "山の上ホテル",
        "category": "hotel",
        "subcategory": "classic_hotel",
        "url": "https://www.yamanoue-hotel.co.jp/",
        "address": "東京都千代田区神田駿河台1-1",
        "prefecture": "東京都",
        "city": "千代田区",
        "overview": "1954年開業。ウィリアム・メレル・ヴォーリズ設計のアール・デコ様式。川端康成、三島由紀夫、池波正太郎など多くの作家が缶詰になった「文人の宿」。",
        "features": ["クラシックホテル", "1954年開業", "ヴォーリズ設計", "アール・デコ", "文人の宿"],
        "founded_year": 1954,
        "source_type": "manual",
    },

    # --- More Tokyo old-town (下町) ---
    {
        "name": "どぜう 飯田屋",
        "category": "restaurant_japanese",
        "subcategory": "dojo",
        "url": "https://www.dozeu.com/iidaya/",
        "address": "東京都台東区西浅草3-3-2",
        "prefecture": "東京都",
        "city": "台東区",
        "overview": "1903年創業。浅草のどじょう料理専門店。鉄鍋で供されるどじょう鍋。浅草の庶民の味を120年守り続ける。",
        "features": ["どじょう料理", "1903年創業", "浅草", "鉄鍋", "庶民の味"],
        "founded_year": 1903,
        "source_type": "manual",
    },
    {
        "name": "尾花",
        "category": "restaurant_japanese",
        "subcategory": "unagi",
        "url": "",
        "address": "東京都荒川区南千住5-33-1",
        "prefecture": "東京都",
        "city": "荒川区",
        "overview": "南千住の鰻の名店。行列必至。備長炭で焼く鰻と伝統的な店構え。下町の鰻文化を体現する場所。",
        "features": ["鰻", "南千住", "備長炭", "行列", "下町文化"],
        "source_type": "manual",
    },
    {
        "name": "深大寺そば 元祖 嶋田家",
        "category": "restaurant_japanese",
        "subcategory": "soba",
        "url": "",
        "address": "東京都調布市深大寺元町5-12-10",
        "prefecture": "東京都",
        "city": "調布市",
        "overview": "深大寺門前の老舗蕎麦屋。江戸時代から続く深大寺そば文化の中心的存在。寺と蕎麦が一体となった場所性。",
        "features": ["蕎麦", "深大寺", "門前蕎麦", "江戸時代", "寺と蕎麦"],
        "source_type": "manual",
    },
    {
        "name": "ちんや",
        "category": "restaurant_japanese",
        "subcategory": "sukiyaki",
        "url": "https://www.chinya.co.jp/",
        "address": "東京都台東区浅草1-3-4",
        "prefecture": "東京都",
        "city": "台東区",
        "overview": "1880年創業。浅草のすき焼き老舗。明治時代の文明開化とともに牛肉食文化を広めた歴史を持つ。「適サシ肉」へのこだわり。",
        "features": ["すき焼き", "1880年創業", "浅草", "文明開化", "適サシ肉"],
        "founded_year": 1880,
        "source_type": "manual",
    },

    # --- Historic confectioneries ---
    {
        "name": "空也",
        "category": "restaurant_japanese",
        "subcategory": "wagashi",
        "url": "",
        "address": "東京都中央区銀座6-7-19",
        "prefecture": "東京都",
        "city": "中央区",
        "overview": "1884年創業。銀座の和菓子店。空也もなかで知られる。夏目漱石『吾輩は猫である』にも登場。予約でしか手に入らない希少性。",
        "features": ["和菓子", "1884年創業", "銀座", "空也もなか", "夏目漱石"],
        "founded_year": 1884,
        "source_type": "manual",
    },
    {
        "name": "とらや 赤坂店",
        "category": "restaurant_japanese",
        "subcategory": "wagashi_cafe",
        "url": "https://www.toraya-group.co.jp/",
        "address": "東京都港区赤坂4-9-22",
        "prefecture": "東京都",
        "city": "港区",
        "overview": "虎屋の赤坂直営店。内藤廣設計の現代建築に500年の伝統が宿る。併設の虎屋菓寮でお茶と和菓子を楽しめる。伝統と革新の対話。",
        "features": ["和菓子カフェ", "500年の伝統", "内藤廣設計", "赤坂", "伝統と革新"],
        "source_type": "manual",
    },

    # --- Yokohama / Kanagawa expansion ---
    {
        "name": "聘珍樓 横浜本店",
        "category": "restaurant_japanese",
        "subcategory": "chinese",
        "url": "https://www.heichin.com/",
        "address": "神奈川県横浜市中区山下町149",
        "prefecture": "神奈川県",
        "city": "横浜市",
        "overview": "1884年創業。横浜中華街最古の広東料理店。日本における中華料理文化の歴史を体現。港町横浜の多文化性の象徴。",
        "features": ["広東料理", "1884年創業", "横浜中華街", "最古", "多文化性"],
        "founded_year": 1884,
        "source_type": "manual",
    },
    {
        "name": "勝烈庵 馬車道総本店",
        "category": "restaurant_western",
        "subcategory": "tonkatsu",
        "url": "https://www.katsuretsuan.co.jp/",
        "address": "神奈川県横浜市中区常盤町5-58-2",
        "prefecture": "神奈川県",
        "city": "横浜市",
        "overview": "1927年創業。横浜のとんかつ老舗。棟方志功の版画が飾られた店内。横浜の食文化と芸術が交差する場所。",
        "features": ["とんかつ", "1927年創業", "横浜", "棟方志功", "芸術と食"],
        "founded_year": 1927,
        "source_type": "manual",
    },

    # --- Nikko / Tochigi ---
    {
        "name": "日光金谷ホテル ダイニングルーム",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.kanayahotel.co.jp/nkh/restaurant/",
        "address": "栃木県日光市上鉢石町1300",
        "prefecture": "栃木県",
        "city": "日光市",
        "overview": "日光金谷ホテル内のメインダイニング。百年カレーをはじめ、明治から続く洋食文化。登録有形文化財の建物で食事を楽しむ。",
        "features": ["洋食", "百年カレー", "日光", "登録有形文化財", "明治の洋食文化"],
        "cultural_designation": "registered_tangible",
        "source_type": "manual",
    },

    # --- More diverse Tokyo ---
    {
        "name": "東京會舘",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.kaikan.co.jp/",
        "address": "東京都千代田区丸の内3-2-1",
        "prefecture": "東京都",
        "city": "千代田区",
        "overview": "1922年設立。丸の内の社交場。直木賞・芥川賞の授賞式会場として知られる。クラシックマロンシャンテリーが名物。日本の社交文化の殿堂。",
        "features": ["フランス料理", "1922年設立", "丸の内", "文学賞授賞式", "社交場"],
        "founded_year": 1922,
        "source_type": "manual",
    },
    {
        "name": "アマン東京",
        "category": "hotel",
        "subcategory": "luxury",
        "url": "https://www.aman.com/hotels/aman-tokyo",
        "address": "東京都千代田区大手町1-5-6",
        "prefecture": "東京都",
        "city": "千代田区",
        "overview": "大手町タワー33-38階。ケリー・ヒル設計。日本の伝統的美意識（障子、行灯、和紙）を超高層ビルの中に再解釈。都市の中の聖域。",
        "features": ["ラグジュアリーホテル", "大手町", "ケリー・ヒル設計", "和の再解釈", "都市の聖域"],
        "source_type": "manual",
    },
    {
        "name": "紀尾井町 福田家",
        "category": "restaurant_japanese",
        "subcategory": "kaiseki",
        "url": "",
        "address": "東京都千代田区紀尾井町1-12",
        "prefecture": "東京都",
        "city": "千代田区",
        "overview": "赤坂の料亭。政財界の要人が利用してきた歴史を持つ。日本の料亭文化の正統を継承。庭園と数寄屋建築の美。",
        "features": ["料亭", "赤坂", "政財界", "料亭文化", "数寄屋建築"],
        "source_type": "manual",
    },

    # --- Saitama / Chiba / Ibaraki ---
    {
        "name": "小江戸 鉄板懐石 oNIwa",
        "category": "restaurant_japanese",
        "subcategory": "teppan",
        "url": "",
        "address": "埼玉県川越市元町1-9-8",
        "prefecture": "埼玉県",
        "city": "川越市",
        "overview": "川越の蔵造りの町並みに位置する鉄板懐石。小江戸川越の歴史的景観と食が融合した場所。蔵造りの建物を活用。",
        "features": ["鉄板懐石", "川越", "蔵造り", "小江戸", "歴史的景観"],
        "source_type": "manual",
    },
    {
        "name": "陶路子",
        "category": "restaurant_cafe",
        "subcategory": "cafe",
        "url": "",
        "address": "埼玉県川越市幸町7-1",
        "prefecture": "埼玉県",
        "city": "川越市",
        "overview": "川越の陶器店に併設されたカフェ。蔵造りの建物でさつまいもスイーツを提供。川越の芋文化と蔵文化が交差。",
        "features": ["カフェ", "川越", "蔵造り", "さつまいも", "陶器"],
        "source_type": "manual",
    },

    # --- Notable nationwide additions ---
    {
        "name": "旅館 花屋",
        "category": "ryokan",
        "subcategory": "onsen_ryokan",
        "url": "https://www.hanaya.ne.jp/",
        "address": "長野県上田市別所温泉169",
        "prefecture": "長野県",
        "city": "上田市",
        "overview": "1917年創業。別所温泉の旅館。大正ロマンの建築が残る登録有形文化財。14棟もの建物群が渡り廊下で結ばれた独特の構造。",
        "features": ["温泉旅館", "1917年創業", "大正ロマン", "登録有形文化財", "別所温泉"],
        "founded_year": 1917,
        "cultural_designation": "registered_tangible",
        "source_type": "manual",
    },
    {
        "name": "金具屋",
        "category": "ryokan",
        "subcategory": "onsen_ryokan",
        "url": "https://www.kanaguya.com/",
        "address": "長野県下高井郡山ノ内町平穏2202",
        "prefecture": "長野県",
        "city": "山ノ内町",
        "overview": "1758年創業。渋温泉の旅館。木造4階建ての斉月楼は登録有形文化財。「千と千尋の神隠し」のモデルの一つとされる。",
        "features": ["温泉旅館", "1758年創業", "渋温泉", "登録有形文化財", "千と千尋"],
        "founded_year": 1758,
        "cultural_designation": "registered_tangible",
        "source_type": "manual",
    },
    {
        "name": "加賀屋",
        "category": "ryokan",
        "subcategory": "onsen_ryokan",
        "url": "https://www.kagaya.co.jp/",
        "address": "石川県七尾市和倉町ヨ部80",
        "prefecture": "石川県",
        "city": "七尾市",
        "overview": "1906年創業。「プロが選ぶ日本の旅館100選」で36年連続1位。おもてなしの極致。能登の海と伝統文化が融合。",
        "features": ["温泉旅館", "1906年創業", "和倉温泉", "おもてなし日本一", "能登"],
        "founded_year": 1906,
        "source_type": "manual",
    },
    {
        "name": "旅荘 牧場の家",
        "category": "minshuku",
        "subcategory": "kominka",
        "url": "",
        "address": "岐阜県高山市奥飛騨温泉郷一重ヶ根",
        "prefecture": "岐阜県",
        "city": "高山市",
        "overview": "飛騨の合掌造りの古民家を活用した民宿。囲炉裏で食事を楽しむ。飛騨の山村文化と建築遺産が宿泊体験として継承される場所。",
        "features": ["民宿", "合掌造り", "古民家", "囲炉裏", "飛騨", "奥飛騨温泉"],
        "source_type": "manual",
    },
    {
        "name": "島崎藤村ゆかりの宿 中棚荘",
        "category": "ryokan",
        "subcategory": "onsen_ryokan",
        "url": "https://www.nakadanaso.com/",
        "address": "長野県小諸市古城中棚",
        "prefecture": "長野県",
        "city": "小諸市",
        "overview": "島崎藤村が『千曲川のスケッチ』の中で描いた温泉宿。初恋りんご風呂が名物。文学と温泉が交差する場所。",
        "features": ["温泉旅館", "島崎藤村", "小諸", "文学の宿", "初恋りんご風呂"],
        "source_type": "manual",
    },

    # --- More Tokyo diversity ---
    {
        "name": "根津 釜竹",
        "category": "restaurant_japanese",
        "subcategory": "udon",
        "url": "https://www.kamatake.co.jp/",
        "address": "東京都文京区根津2-14-18",
        "prefecture": "東京都",
        "city": "文京区",
        "overview": "築90年以上の蔵を改装したうどん店。讃岐うどんの技法と東京の場所性が融合。根津の歴史的景観の中で営む食文化。",
        "features": ["うどん", "蔵改装", "築90年", "根津", "讃岐うどん"],
        "source_type": "manual",
    },
    {
        "name": "おにぎり 浅草 宿六",
        "category": "restaurant_japanese",
        "subcategory": "onigiri",
        "url": "",
        "address": "東京都台東区浅草3-9-10",
        "prefecture": "東京都",
        "city": "台東区",
        "overview": "1954年創業。東京最古のおにぎり専門店。カウンターで握りたてを提供。日本の食文化の原点であるおにぎりを専門店として守り続ける。",
        "features": ["おにぎり", "1954年創業", "浅草", "東京最古", "カウンター"],
        "founded_year": 1954,
        "source_type": "manual",
    },
    {
        "name": "如水会館",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.josui-kaikan.or.jp/",
        "address": "東京都千代田区一ツ橋2-1-1",
        "prefecture": "東京都",
        "city": "千代田区",
        "overview": "東京大学（旧東京帝国大学）の同窓会館。1928年設立。学術と社交の場としての歴史。一ツ橋の知的文化圏を体現。",
        "features": ["レストラン", "1928年設立", "同窓会館", "学術文化", "一ツ橋"],
        "founded_year": 1928,
        "source_type": "manual",
    },
    {
        "name": "學士會館",
        "category": "hotel",
        "subcategory": "classic_hotel",
        "url": "https://www.gakushikaikan.co.jp/",
        "address": "東京都千代田区神田錦町3-28",
        "prefecture": "東京都",
        "city": "千代田区",
        "overview": "1928年竣工。旧帝国大学卒業生の倶楽部。高橋貞太郎設計のスクラッチタイル建築。登録有形文化財。学術文化の殿堂。",
        "features": ["クラシックホテル", "1928年竣工", "旧帝大倶楽部", "登録有形文化財", "学術文化"],
        "founded_year": 1928,
        "cultural_designation": "registered_tangible",
        "source_type": "manual",
    },
]


def main():
    conn = get_db()
    inserted = 0
    skipped = 0

    for data in ADDITIONAL_DATA:
        fid = insert_facility(conn, data)
        if fid:
            inserted += 1
        else:
            skipped += 1

    conn.commit()
    total = conn.execute("SELECT COUNT(*) FROM facilities").fetchone()[0]
    conn.close()

    print(f"Additional collection complete:")
    print(f"  Inserted: {inserted}")
    print(f"  Skipped (duplicate): {skipped}")
    print(f"  Total facilities in DB: {total}")


if __name__ == "__main__":
    main()
