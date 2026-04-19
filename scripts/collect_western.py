#!/usr/bin/env python3
"""
Western-style facilities with high basho-sei in Kanto region.
Restaurants, cafes, bars, bakeries, patisseries with cultural significance.
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
        fid, data.get("name", ""), data.get("name_kana", ""),
        data.get("category", "other"), data.get("subcategory", ""),
        data.get("url", ""), data.get("address", ""),
        data.get("prefecture", ""), data.get("city", ""),
        data.get("overview", ""),
        json.dumps(data.get("features", []), ensure_ascii=False),
        data.get("founded_year"), data.get("cultural_designation", ""),
        data.get("source_type", "manual"), data.get("source_url", ""),
    ))
    return fid


WESTERN_DATA = [
    # === Classic French / Italian ===
    {
        "name": "ロオジエ",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.shiseido.co.jp/losier/",
        "address": "東京都中央区銀座7-5-5",
        "prefecture": "東京都", "city": "中央区",
        "overview": "1973年開業。資生堂が運営する銀座のグランメゾン。フランス料理の最高峰。空間・サービス・料理が三位一体となった美の総合芸術。ミシュラン三ツ星。",
        "features": ["フランス料理", "1973年開業", "銀座", "資生堂", "ミシュラン三ツ星", "グランメゾン"],
        "founded_year": 1973,
    },
    {
        "name": "カンテサンス",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.quintessence.jp/",
        "address": "東京都品川区北品川6-7-29",
        "prefecture": "東京都", "city": "品川区",
        "overview": "岸田周三シェフによるフランス料理。ミシュラン三ツ星。素材の本質を引き出す「引き算の美学」。日本的感性とフランス料理技法の高度な融合。",
        "features": ["フランス料理", "ミシュラン三ツ星", "品川", "引き算の美学", "和仏融合"],
    },
    {
        "name": "ジョエル・ロブション",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.robuchon.jp/",
        "address": "東京都目黒区三田1-13-1",
        "prefecture": "東京都", "city": "目黒区",
        "overview": "恵比寿ガーデンプレイスに佇むフランスの城館を模した建物。ジョエル・ロブションの美学が凝縮された空間。ミシュラン三ツ星の歴史。",
        "features": ["フランス料理", "恵比寿", "城館建築", "ミシュラン三ツ星", "ジョエル・ロブション"],
    },
    {
        "name": "レフェルヴェソンス",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.leffervescence.jp/",
        "address": "東京都港区西麻布2-26-4",
        "prefecture": "東京都", "city": "港区",
        "overview": "生江史伸シェフのイノベーティブフレンチ。ミシュラン二つ星。「泡立ち」を意味する店名通り、日本の食材と季節感をフランス料理の文法で再解釈。",
        "features": ["フランス料理", "西麻布", "ミシュラン二つ星", "イノベーティブ", "日本食材"],
    },
    {
        "name": "アピシウス",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.apicius.co.jp/",
        "address": "東京都千代田区有楽町1-9-4",
        "prefecture": "東京都", "city": "千代田区",
        "overview": "1983年開業。有楽町のクラシックフレンチ。古代ローマの美食家アピシウスに由来。地下に広がる重厚な空間とワインセラー。フランス料理の正統を守り続ける。",
        "features": ["フランス料理", "1983年開業", "有楽町", "クラシック", "ワインセラー"],
        "founded_year": 1983,
    },
    {
        "name": "タテル ヨシノ 芝",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.tateruyoshino.com/",
        "address": "東京都港区芝公園1-5-10",
        "prefecture": "東京都", "city": "港区",
        "overview": "パリで成功した日本人シェフ・吉野建の東京店。芝公園の緑に面した開放的な空間。フランスと日本の文化が対話する料理。",
        "features": ["フランス料理", "芝公園", "パリの日本人シェフ", "和仏対話"],
    },
    {
        "name": "リストランテ ASO",
        "category": "restaurant_western",
        "subcategory": "italian",
        "url": "https://www.hiramatsurestaurant.jp/aso/",
        "address": "東京都渋谷区猿楽町29-3",
        "prefecture": "東京都", "city": "渋谷区",
        "overview": "代官山の一軒家イタリアン。築年数のある洋館を活用し、イタリアの食文化を日本で再現。庭園と建築が生み出す親密な場所性。",
        "features": ["イタリアン", "代官山", "一軒家レストラン", "洋館", "庭園"],
    },
    {
        "name": "アルポルト",
        "category": "restaurant_western",
        "subcategory": "italian",
        "url": "",
        "address": "東京都港区西麻布3-24-17",
        "prefecture": "東京都", "city": "港区",
        "overview": "1983年開業。片岡護シェフによるイタリアン。日本のイタリア料理の草分け的存在。40年以上にわたり西麻布で愛され続ける。",
        "features": ["イタリアン", "1983年開業", "西麻布", "草分け的存在", "片岡護"],
        "founded_year": 1983,
    },

    # === Classic Bars ===
    {
        "name": "バー ハイアット",
        "category": "restaurant_western",
        "subcategory": "bar",
        "url": "",
        "address": "東京都千代田区有楽町1-1-1",
        "prefecture": "東京都", "city": "千代田区",
        "overview": "帝国ホテル内のオーセンティックバー。1890年の開業以来、日本のバー文化の源流。歴代のバーテンダーが培ってきたカクテルの技と空間の格式。",
        "features": ["バー", "帝国ホテル", "1890年", "日本のバー文化の源流", "オーセンティック"],
        "founded_year": 1890,
    },
    {
        "name": "バー テンダリー",
        "category": "restaurant_western",
        "subcategory": "bar",
        "url": "",
        "address": "東京都中央区銀座6-5-15",
        "prefecture": "東京都", "city": "中央区",
        "overview": "銀座の名バー。上田和男が築いた日本のバーテンディングの美学。ハードシェイクの技法で知られる。カウンターの向こうに広がる職人の世界。",
        "features": ["バー", "銀座", "ハードシェイク", "上田和男", "バーテンディングの美学"],
    },
    {
        "name": "スタア・バー・ギンザ",
        "category": "restaurant_western",
        "subcategory": "bar",
        "url": "https://www.starbar.jp/",
        "address": "東京都中央区銀座1-5-13",
        "prefecture": "東京都", "city": "中央区",
        "overview": "岸久が主宰する銀座のバー。World's 50 Best Bars選出。日本的な繊細さとクラシックカクテルの伝統が融合。カクテル文化の聖地。",
        "features": ["バー", "銀座", "World's 50 Best Bars", "岸久", "カクテル文化"],
    },
    {
        "name": "バー ラジオ",
        "category": "restaurant_western",
        "subcategory": "bar",
        "url": "",
        "address": "東京都港区六本木3-14-12",
        "prefecture": "東京都", "city": "港区",
        "overview": "1951年開業。六本木の伝説的バー。尾崎朝子が開いた日本初の女性バーテンダーの店。70年以上の歴史を持つ東京のバー文化の生き証人。",
        "features": ["バー", "1951年開業", "六本木", "日本初の女性バーテンダー", "伝説的"],
        "founded_year": 1951,
    },

    # === Classic Bakeries & Patisseries ===
    {
        "name": "ペリカン",
        "category": "restaurant_western",
        "subcategory": "bakery",
        "url": "https://www.bakery-pelican.com/",
        "address": "東京都台東区寿4-7-4",
        "prefecture": "東京都", "city": "台東区",
        "overview": "1942年創業。浅草のパン屋。食パンとロールパンだけを80年以上焼き続ける。「余計なものを作らない」という哲学。映画にもなった東京の食文化遺産。",
        "features": ["パン屋", "1942年創業", "浅草", "食パン専門", "映画化", "80年以上"],
        "founded_year": 1942,
    },
    {
        "name": "木村屋總本店",
        "category": "restaurant_western",
        "subcategory": "bakery",
        "url": "https://www.kimuraya-sohonten.co.jp/",
        "address": "東京都中央区銀座4-5-7",
        "prefecture": "東京都", "city": "中央区",
        "overview": "1869年創業。あんパン発祥の店。明治天皇に献上したあんパンから始まる日本のパン文化の原点。銀座本店は150年以上の歴史。",
        "features": ["パン屋", "1869年創業", "銀座", "あんパン発祥", "明治天皇献上", "日本のパン文化の原点"],
        "founded_year": 1869,
    },
    {
        "name": "中村屋",
        "category": "restaurant_western",
        "subcategory": "bakery_restaurant",
        "url": "https://www.nakamuraya.co.jp/",
        "address": "東京都新宿区新宿3-26-13",
        "prefecture": "東京都", "city": "新宿区",
        "overview": "1901年創業。クリームパンの発祥。インドカリーの名店としても知られる。相馬黒光・愛蔵夫妻が文化人のサロンとして育てた場所。荻原守衛、中村彝らが集った。",
        "features": ["パン・カレー", "1901年創業", "新宿", "クリームパン発祥", "インドカリー", "文化人サロン"],
        "founded_year": 1901,
    },
    {
        "name": "近江屋洋菓子店",
        "category": "restaurant_western",
        "subcategory": "patisserie",
        "url": "https://www.ohmiyayougashiten.co.jp/",
        "address": "東京都千代田区神田淡路町2-4",
        "prefecture": "東京都", "city": "千代田区",
        "overview": "1884年創業。神田の老舗洋菓子店。ショートケーキ、アップルパイなど昭和の洋菓子を守り続ける。レトロな店内で味わう日本の洋菓子文化の原風景。",
        "features": ["洋菓子", "1884年創業", "神田", "老舗", "昭和レトロ", "洋菓子文化"],
        "founded_year": 1884,
    },
    {
        "name": "コロンバン 原宿本店",
        "category": "restaurant_western",
        "subcategory": "patisserie",
        "url": "https://www.colombin.co.jp/",
        "address": "東京都渋谷区神宮前6-31-19",
        "prefecture": "東京都", "city": "渋谷区",
        "overview": "1924年創業。フランス菓子の老舗。日本で初めてショートケーキを販売した店。原宿本店は100年の歴史を持つ洋菓子文化の殿堂。",
        "features": ["洋菓子", "1924年創業", "原宿", "ショートケーキ発祥", "フランス菓子", "100年"],
        "founded_year": 1924,
    },
    {
        "name": "ユーハイム 本店",
        "category": "restaurant_western",
        "subcategory": "patisserie",
        "url": "https://www.juchheim.co.jp/",
        "address": "神奈川県横浜市中区山下町",
        "prefecture": "神奈川県", "city": "横浜市",
        "overview": "1909年、ドイツ人カール・ユーハイムが日本に伝えたバウムクーヘン。横浜から始まった本物のドイツ菓子の伝統。異文化の種子が日本に根づいた場所性。",
        "features": ["洋菓子", "1909年", "横浜", "バウムクーヘン", "ドイツ菓子", "異文化定着"],
        "founded_year": 1909,
    },

    # === Western-style historic restaurants ===
    {
        "name": "グリル満天星",
        "category": "restaurant_western",
        "subcategory": "yoshoku",
        "url": "https://www.mantensei.com/",
        "address": "東京都港区麻布十番1-3-8",
        "prefecture": "東京都", "city": "港区",
        "overview": "1951年開業。麻布十番の洋食店。オムライスの名店として知られる。70年以上にわたり町の洋食文化を守り続ける。",
        "features": ["洋食", "1951年開業", "麻布十番", "オムライス", "町の洋食"],
        "founded_year": 1951,
    },
    {
        "name": "黒船亭",
        "category": "restaurant_western",
        "subcategory": "yoshoku",
        "url": "https://www.kurofunetei.co.jp/",
        "address": "東京都台東区上野2-13-13",
        "prefecture": "東京都", "city": "台東区",
        "overview": "1902年創業。上野の老舗洋食店。ハヤシライス、ビーフシチューなど明治の洋食文化を今に伝える。上野の文化圏と一体の場所。",
        "features": ["洋食", "1902年創業", "上野", "ハヤシライス", "明治の洋食文化"],
        "founded_year": 1902,
    },
    {
        "name": "香味屋",
        "category": "restaurant_western",
        "subcategory": "yoshoku",
        "url": "",
        "address": "東京都台東区根岸3-18-18",
        "prefecture": "東京都", "city": "台東区",
        "overview": "1925年創業。根岸の老舗洋食店。ビーフシチュー、コロッケが絶品。下町の洋食文化を100年守り続ける職人の店。",
        "features": ["洋食", "1925年創業", "根岸", "ビーフシチュー", "下町洋食", "100年"],
        "founded_year": 1925,
    },
    {
        "name": "キッチン南海",
        "category": "restaurant_western",
        "subcategory": "yoshoku",
        "url": "",
        "address": "東京都千代田区神田神保町1-5",
        "prefecture": "東京都", "city": "千代田区",
        "overview": "1966年創業。神保町の名物洋食店。黒いカツカレーが看板メニュー。学生街・古書店街の食文化を体現する庶民の洋食。",
        "features": ["洋食", "1966年創業", "神保町", "カツカレー", "学生街", "庶民の味"],
        "founded_year": 1966,
    },
    {
        "name": "レストラン 大宮",
        "category": "restaurant_western",
        "subcategory": "yoshoku",
        "url": "",
        "address": "東京都目黒区三田2-8-1",
        "prefecture": "東京都", "city": "目黒区",
        "overview": "1960年創業。恵比寿の老舗洋食店。ハンバーグステーキの名店。60年以上変わらぬ味と佇まいで地域に根づいた場所。",
        "features": ["洋食", "1960年創業", "恵比寿", "ハンバーグ", "地域密着"],
        "founded_year": 1960,
    },
    {
        "name": "グリルスイス",
        "category": "restaurant_western",
        "subcategory": "yoshoku",
        "url": "",
        "address": "東京都千代田区神田須田町1-1",
        "prefecture": "東京都", "city": "千代田区",
        "overview": "1947年創業。カツカレー発祥の店として知られる。巨人軍の千葉茂選手のために作ったカツカレーが日本中に広まった逸話を持つ。",
        "features": ["洋食", "1947年創業", "神田", "カツカレー発祥", "巨人軍"],
        "founded_year": 1947,
    },

    # === European-style cafes & tea rooms ===
    {
        "name": "ウエスト 青山ガーデン",
        "category": "restaurant_cafe",
        "subcategory": "tearoom",
        "url": "https://www.ginza-west.co.jp/",
        "address": "東京都港区南青山1-22-10",
        "prefecture": "東京都", "city": "港区",
        "overview": "1947年銀座で創業。青山の庭園付きティールーム。洋菓子の名門ウエストの空間美学。緑に囲まれた都心の静寂。ドライケーキとリーフパイが名物。",
        "features": ["ティールーム", "1947年創業", "青山", "庭園", "洋菓子の名門", "静寂"],
        "founded_year": 1947,
    },
    {
        "name": "フォション・ル・サロン・ド・テ",
        "category": "restaurant_cafe",
        "subcategory": "tearoom",
        "url": "",
        "address": "東京都千代田区丸の内3-1-1",
        "prefecture": "東京都", "city": "千代田区",
        "overview": "パリの老舗フォションの東京サロン。フランスの食文化を紅茶とパティスリーを通じて体現。国際フォーラム内の優雅な空間。",
        "features": ["ティールーム", "パリ老舗", "丸の内", "フランス食文化", "紅茶"],
    },
    {
        "name": "カフェ・ド・フロール 東京",
        "category": "restaurant_cafe",
        "subcategory": "cafe",
        "url": "",
        "address": "東京都渋谷区神宮前5-11-5",
        "prefecture": "東京都", "city": "渋谷区",
        "overview": "パリ・サンジェルマンの伝説的カフェの東京版。サルトルやボーヴォワールが通った知性の場の精神を表参道で。カフェ文化の系譜。",
        "features": ["カフェ", "表参道", "パリのカフェ文化", "サンジェルマン", "知性の場"],
    },
    {
        "name": "椿屋珈琲 銀座本店",
        "category": "restaurant_cafe",
        "subcategory": "kissaten",
        "url": "https://www.tsubakiya-coffee.com/",
        "address": "東京都中央区銀座7-2-20",
        "prefecture": "東京都", "city": "中央区",
        "overview": "大正ロマンをコンセプトにした珈琲店。サイフォン式で一杯ずつ淹れる珈琲と、アンティーク調の内装。銀座の喫茶文化と大正モダニズムの融合。",
        "features": ["珈琲店", "銀座", "大正ロマン", "サイフォン式", "アンティーク"],
    },

    # === Steak / Grill ===
    {
        "name": "スエヒロ 本店",
        "category": "restaurant_western",
        "subcategory": "steak",
        "url": "",
        "address": "東京都中央区京橋2-4-16",
        "prefecture": "東京都", "city": "中央区",
        "overview": "1910年創業。日本のステーキハウスの草分け。「ビフテキ」という言葉を広めた店。100年以上の歴史を持つ肉食文化の先駆者。",
        "features": ["ステーキ", "1910年創業", "京橋", "ビフテキの草分け", "100年以上"],
        "founded_year": 1910,
    },
    {
        "name": "あら皮",
        "category": "restaurant_western",
        "subcategory": "steak",
        "url": "",
        "address": "東京都中央区銀座5-7-19",
        "prefecture": "東京都", "city": "中央区",
        "overview": "銀座の高級ステーキ店。1968年開業。備長炭で焼く熟成肉。職人の焼きの技術が凝縮されたカウンター。銀座の食文化の深層。",
        "features": ["ステーキ", "1968年開業", "銀座", "備長炭", "熟成肉", "カウンター"],
        "founded_year": 1968,
    },
    {
        "name": "ビーフステーキ専門店 スエヒロ館",
        "category": "restaurant_western",
        "subcategory": "steak",
        "url": "",
        "address": "東京都港区新橋3-4-5",
        "prefecture": "東京都", "city": "港区",
        "overview": "新橋のサラリーマン街に佇むステーキ専門店。昭和の洋食文化とビジネス街の食文化が交差する場所。",
        "features": ["ステーキ", "新橋", "サラリーマン文化", "昭和洋食"],
    },

    # === Curry ===
    {
        "name": "デリー 上野店",
        "category": "restaurant_western",
        "subcategory": "curry",
        "url": "https://www.delhi.co.jp/",
        "address": "東京都台東区上野6-3-2",
        "prefecture": "東京都", "city": "台東区",
        "overview": "1956年創業。日本のインドカレーの先駆者。カシミールカレーの生みの親。辛さと深みの独自の哲学を持つカレー文化の聖地。",
        "features": ["カレー", "1956年創業", "上野", "カシミールカレー", "インドカレーの先駆者"],
        "founded_year": 1956,
    },
    {
        "name": "エチオピア",
        "category": "restaurant_western",
        "subcategory": "curry",
        "url": "",
        "address": "東京都千代田区神田小川町3-10-6",
        "prefecture": "東京都", "city": "千代田区",
        "overview": "1988年創業。神田のカレー激戦区で独自の地位を築く。豆カレーとチキンカレーの二本柱。神保町・神田のカレー文化圏の一角。",
        "features": ["カレー", "1988年創業", "神田", "豆カレー", "カレー激戦区"],
        "founded_year": 1988,
    },
    {
        "name": "ボンディ",
        "category": "restaurant_western",
        "subcategory": "curry",
        "url": "",
        "address": "東京都千代田区神田神保町2-3",
        "prefecture": "東京都", "city": "千代田区",
        "overview": "1973年創業。神保町カレーの代表格。欧風カレーの名店。じゃがいもが先に出てくるスタイルが有名。古書店街のカレー文化の象徴。",
        "features": ["カレー", "1973年創業", "神保町", "欧風カレー", "古書店街文化"],
        "founded_year": 1973,
    },

    # === Western-influenced Japanese-Western fusion ===
    {
        "name": "レストラン サカキ",
        "category": "restaurant_western",
        "subcategory": "yoshoku",
        "url": "",
        "address": "東京都中央区銀座4-13-17",
        "prefecture": "東京都", "city": "中央区",
        "overview": "銀座の名洋食店。ハンバーグステーキとオムライスが評判。築地市場の近くで海鮮も活かした洋食。銀座東側の食文化。",
        "features": ["洋食", "銀座", "ハンバーグ", "オムライス", "築地"],
    },
    {
        "name": "洋食 小春軒",
        "category": "restaurant_western",
        "subcategory": "yoshoku",
        "url": "",
        "address": "東京都中央区日本橋人形町1-7-9",
        "prefecture": "東京都", "city": "中央区",
        "overview": "1912年創業。人形町の老舗洋食店。カツ丼発祥の一説もある歴史を持つ。下町の洋食文化を110年守り続ける。",
        "features": ["洋食", "1912年創業", "人形町", "カツ丼", "老舗", "下町洋食"],
        "founded_year": 1912,
    },
    {
        "name": "厳選洋食 さくらい",
        "category": "restaurant_western",
        "subcategory": "yoshoku",
        "url": "",
        "address": "東京都台東区上野2-8-1",
        "prefecture": "東京都", "city": "台東区",
        "overview": "上野の洋食店。ハンバーグ、エビフライ、ナポリタンなど王道洋食をミシュラン品質で。上野の森の文化圏と連なる食の拠点。",
        "features": ["洋食", "上野", "ミシュラン", "王道洋食", "上野の森"],
    },

    # === Wine bars & bistros ===
    {
        "name": "祥瑞",
        "category": "restaurant_western",
        "subcategory": "wine_bar",
        "url": "",
        "address": "東京都新宿区荒木町",
        "prefecture": "東京都", "city": "新宿区",
        "overview": "荒木町の路地裏に佇むワインバー。花街の歴史が残る石畳の路地と、自然派ワインの文化が出会う場所。場所の記憶と新しい食文化の対話。",
        "features": ["ワインバー", "荒木町", "花街の歴史", "路地裏", "自然派ワイン"],
    },
    {
        "name": "ビストロ・ド・ラ・シテ",
        "category": "restaurant_western",
        "subcategory": "bistro",
        "url": "",
        "address": "東京都渋谷区恵比寿西1-4-1",
        "prefecture": "東京都", "city": "渋谷区",
        "overview": "恵比寿の老舗ビストロ。パリの下町ビストロの精神を東京で30年以上体現。気取らない本物のフランス料理と、常連が作り上げた場の温かみ。",
        "features": ["ビストロ", "恵比寿", "30年以上", "パリの精神", "常連文化"],
    },

    # === Chinese (Western-influenced) ===
    {
        "name": "重慶飯店 横浜本店",
        "category": "restaurant_western",
        "subcategory": "chinese",
        "url": "https://www.jukeihanten.com/",
        "address": "神奈川県横浜市中区山下町164",
        "prefecture": "神奈川県", "city": "横浜市",
        "overview": "1959年創業。横浜中華街の名店。四川料理の伝統を守りつつ、横浜の多文化性と融合。麻婆豆腐が絶品。港町の食文化の重層性。",
        "features": ["中華料理", "1959年創業", "横浜中華街", "四川料理", "多文化性"],
        "founded_year": 1959,
    },
    {
        "name": "萬珍樓",
        "category": "restaurant_western",
        "subcategory": "chinese",
        "url": "https://www.manchinro.com/",
        "address": "神奈川県横浜市中区山下町153",
        "prefecture": "神奈川県", "city": "横浜市",
        "overview": "1892年創業。横浜中華街最古級の広東料理店。130年以上の歴史。近代横浜の異文化交流の歴史を体現する場所。",
        "features": ["広東料理", "1892年創業", "横浜中華街", "130年", "異文化交流"],
        "founded_year": 1892,
    },

    # === Hotel dining (Western) ===
    {
        "name": "ニューヨーク グリル",
        "category": "restaurant_western",
        "subcategory": "grill",
        "url": "https://www.hyatt.com/park-hyatt-tokyo/",
        "address": "東京都新宿区西新宿3-7-1-2",
        "prefecture": "東京都", "city": "新宿区",
        "overview": "パークハイアット東京52階。映画『ロスト・イン・トランスレーション』の舞台。東京の夜景と共に味わうグリル料理。都市と食の壮大な場所性。",
        "features": ["グリル", "パークハイアット", "52階", "ロスト・イン・トランスレーション", "夜景"],
    },
    {
        "name": "カフェ ド ジュリアン",
        "category": "restaurant_cafe",
        "subcategory": "hotel_cafe",
        "url": "",
        "address": "東京都千代田区紀尾井町4-1",
        "prefecture": "東京都", "city": "千代田区",
        "overview": "ホテルニューオータニ内のパティスリー＆カフェ。日本庭園を望みながらのアフタヌーンティー。和と洋が溶け合う場所性。",
        "features": ["カフェ", "ホテルニューオータニ", "日本庭園", "アフタヌーンティー", "和洋融合"],
    },

    # === More cafes with character ===
    {
        "name": "珈琲 タイムス",
        "category": "restaurant_cafe",
        "subcategory": "kissaten",
        "url": "",
        "address": "東京都中央区日本橋室町1-12-10",
        "prefecture": "東京都", "city": "中央区",
        "overview": "日本橋の純喫茶。昭和の佇まいを残すカウンター喫茶。サラリーマンの日常と老舗街の歴史が交差する小さな場所。",
        "features": ["喫茶店", "日本橋", "昭和レトロ", "カウンター", "日常の場所"],
    },
    {
        "name": "ヘッケルン",
        "category": "restaurant_cafe",
        "subcategory": "kissaten",
        "url": "",
        "address": "東京都中央区銀座4-3-12",
        "prefecture": "東京都", "city": "中央区",
        "overview": "1946年創業。銀座の純喫茶。プリンとクリームソーダが名物。80年近く銀座の地下で変わらぬ空間を守り続ける。時間が止まった場所。",
        "features": ["喫茶店", "1946年創業", "銀座", "プリン", "地下喫茶", "時間が止まった場所"],
        "founded_year": 1946,
    },
    {
        "name": "フランソア喫茶室",
        "category": "restaurant_cafe",
        "subcategory": "kissaten",
        "url": "",
        "address": "京都府京都市下京区西木屋町通四条下ル",
        "prefecture": "京都府", "city": "京都市",
        "overview": "1934年創業。京都・四条の名喫茶。イタリアンバロック様式の内装が登録有形文化財。戦前の知識人が集ったサロン的空間。",
        "features": ["喫茶店", "1934年創業", "京都", "登録有形文化財", "バロック様式", "知識人サロン"],
        "founded_year": 1934,
        "cultural_designation": "registered_tangible",
    },

    # === More Kanto expansion ===
    {
        "name": "馬車道十番館",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.yokohama-jyubankan.co.jp/",
        "address": "神奈川県横浜市中区常盤町5-67",
        "prefecture": "神奈川県", "city": "横浜市",
        "overview": "明治時代の洋館を再現した建物で営業するフランス料理店。横浜開港の歴史と西洋文化受容の記憶が凝縮された場所。1階はカフェ、2-3階はレストラン。",
        "features": ["フランス料理", "横浜", "明治洋館", "開港の歴史", "西洋文化受容"],
    },
    {
        "name": "エリスマン邸 しょうゆ きゃふぇ",
        "category": "restaurant_cafe",
        "subcategory": "cafe",
        "url": "",
        "address": "神奈川県横浜市中区元町1-77-4",
        "prefecture": "神奈川県", "city": "横浜市",
        "overview": "アントニン・レーモンド設計の洋館（エリスマン邸）内のカフェ。山手の西洋館群の一つ。建築史的価値のある空間で珈琲を楽しむ。",
        "features": ["カフェ", "横浜山手", "アントニン・レーモンド", "西洋館", "建築史"],
    },
    {
        "name": "横浜 山手 えの木てい",
        "category": "restaurant_cafe",
        "subcategory": "cafe",
        "url": "https://www.enokitei.co.jp/",
        "address": "神奈川県横浜市中区山手町89-6",
        "prefecture": "神奈川県", "city": "横浜市",
        "overview": "1927年築のイギリス式洋館でケーキと紅茶を提供。横浜山手の異人館文化を今に伝える。洋館の暮らしを追体験できる場所。",
        "features": ["カフェ", "1927年築", "横浜山手", "イギリス式洋館", "異人館文化"],
        "founded_year": 1927,
    },
    {
        "name": "鎌倉 イワタコーヒー店",
        "category": "restaurant_cafe",
        "subcategory": "kissaten",
        "url": "",
        "address": "神奈川県鎌倉市小町1-5-7",
        "prefecture": "神奈川県", "city": "鎌倉市",
        "overview": "1945年創業。鎌倉駅前の名物喫茶。分厚いホットケーキが名物。ジョン・レノン、川端康成も訪れた。鎌倉の文化的場所性の結節点。",
        "features": ["喫茶店", "1945年創業", "鎌倉", "ホットケーキ", "ジョン・レノン", "川端康成"],
        "founded_year": 1945,
    },

    # === Pizza / Pasta ===
    {
        "name": "ナポリスタカ",
        "category": "restaurant_western",
        "subcategory": "pizza",
        "url": "",
        "address": "東京都港区西麻布1-9-9",
        "prefecture": "東京都", "city": "港区",
        "overview": "ナポリピッツァの名店。薪窯で焼く本格ナポリピッツァを東京で先駆的に広めた。イタリアの食文化と東京の食シーンの接点。",
        "features": ["ピッツァ", "西麻布", "薪窯", "ナポリピッツァ", "先駆者"],
    },

    # === Chocolatier ===
    {
        "name": "ミュゼ・ドゥ・ショコラ テオブロマ",
        "category": "restaurant_western",
        "subcategory": "chocolatier",
        "url": "https://www.theobroma.co.jp/",
        "address": "東京都渋谷区富ヶ谷1-14-9",
        "prefecture": "東京都", "city": "渋谷区",
        "overview": "土屋公二によるチョコレート専門店。カカオの産地と製法にこだわり、チョコレートを文化として昇華。「食べるアート」の場所性。",
        "features": ["ショコラティエ", "富ヶ谷", "カカオ文化", "土屋公二", "食べるアート"],
    },

    # === More restaurants ===
    {
        "name": "ブラッスリー ポール・ボキューズ ミュゼ",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.hiramatsurestaurant.jp/paul-bocuse-musee/",
        "address": "東京都港区六本木7-22-2",
        "prefecture": "東京都", "city": "港区",
        "overview": "国立新美術館内のフランス料理店。黒川紀章設計の美術館とポール・ボキューズの料理哲学が交差。美術と食の場所性。",
        "features": ["フランス料理", "六本木", "国立新美術館", "黒川紀章", "美術と食"],
    },
    {
        "name": "マキシム・ド・パリ",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "",
        "address": "東京都中央区銀座5-3-1（閉店）",
        "prefecture": "東京都", "city": "中央区",
        "overview": "1966年開業、2020年閉店。パリの伝説的レストランの東京版。アール・ヌーヴォー様式の内装。54年間銀座で輝いたフランス文化の灯。記録として保存。",
        "features": ["フランス料理", "1966年開業", "銀座", "閉店", "アール・ヌーヴォー", "記録保存"],
        "founded_year": 1966,
    },
    {
        "name": "精養軒",
        "category": "restaurant_western",
        "subcategory": "french",
        "url": "https://www.seiyoken.co.jp/",
        "address": "東京都台東区上野公園4-58",
        "prefecture": "東京都", "city": "台東区",
        "overview": "1876年創業。日本の西洋料理の草分け。上野公園内で150年近い歴史を刻む。不忍池を望むロケーション。明治の文明開化を食から体現した場所。",
        "features": ["フランス料理", "1876年創業", "上野公園", "西洋料理の草分け", "文明開化", "不忍池"],
        "founded_year": 1876,
    },
]


def main():
    conn = get_db()
    inserted = 0
    skipped = 0
    for data in WESTERN_DATA:
        data.setdefault("source_type", "manual")
        fid = insert_facility(conn, data)
        if fid:
            inserted += 1
        else:
            skipped += 1
    conn.commit()
    total = conn.execute("SELECT COUNT(*) FROM facilities").fetchone()[0]
    conn.close()
    print(f"Western collection complete:")
    print(f"  Inserted: {inserted}")
    print(f"  Skipped (duplicate): {skipped}")
    print(f"  Total facilities in DB: {total}")


if __name__ == "__main__":
    main()
