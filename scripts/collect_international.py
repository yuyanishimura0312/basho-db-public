#!/usr/bin/env python3
"""
International heritage brands in Japan + hidden gems.
Facilities with cultural roots in foreign countries but significant basho-sei in Japan.
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


DATA = [
    # === French Heritage Patisseries in Japan ===
    {
        "name": "ラデュレ 銀座店",
        "category": "restaurant_western", "subcategory": "patisserie",
        "url": "https://www.laduree.jp/",
        "address": "東京都中央区銀座4-6-16", "prefecture": "東京都", "city": "中央区",
        "overview": "1862年パリ創業。マカロンの代名詞となったフランスの老舗パティスリー。パリ・マドレーヌ広場のサロンの優雅さを銀座で再現。フランス菓子文化200年の系譜。",
        "features": ["パティスリー", "1862年パリ創業", "銀座", "マカロン", "フランス菓子文化"],
        "founded_year": 1862,
    },
    {
        "name": "アンジェリーナ 東京",
        "category": "restaurant_cafe", "subcategory": "tearoom",
        "url": "",
        "address": "東京都千代田区丸の内1-4-1", "prefecture": "東京都", "city": "千代田区",
        "overview": "1903年パリ・リヴォリ通り創業。モンブランの元祖。ココ・シャネルやマルセル・プルーストが通ったサロン・ド・テの精神を東京で。",
        "features": ["サロン・ド・テ", "1903年パリ創業", "モンブラン元祖", "シャネル", "プルースト"],
        "founded_year": 1903,
    },
    {
        "name": "ピエール・エルメ・パリ 青山",
        "category": "restaurant_western", "subcategory": "patisserie",
        "url": "https://www.pierreherme.co.jp/",
        "address": "東京都渋谷区神宮前5-51-8", "prefecture": "東京都", "city": "渋谷区",
        "overview": "「パティスリー界のピカソ」ピエール・エルメの旗艦店。イスパハン（ローズ・ライチ・フランボワーズ）に象徴される、味覚の革命。フランス菓子の前衛。",
        "features": ["パティスリー", "青山", "ピエール・エルメ", "イスパハン", "フランス菓子の前衛"],
    },
    {
        "name": "ジャン＝ポール・エヴァン 表参道",
        "category": "restaurant_western", "subcategory": "chocolatier",
        "url": "https://www.jph-japon.co.jp/",
        "address": "東京都渋谷区神宮前5-5-25", "prefecture": "東京都", "city": "渋谷区",
        "overview": "MOF（フランス国家最優秀職人章）を持つショコラティエの東京本店。カカオの産地と製法への哲学的こだわり。チョコレートを芸術に昇華。",
        "features": ["ショコラティエ", "表参道", "MOF", "カカオ芸術", "フランス"],
    },
    {
        "name": "メゾン・ランドゥメンヌ 麻布台",
        "category": "restaurant_western", "subcategory": "bakery",
        "url": "https://www.maisonlandemaine.com/",
        "address": "東京都港区麻布台1-2-4", "prefecture": "東京都", "city": "港区",
        "overview": "パリのバゲットコンクール優勝の実績を持つブーランジェリー。フランスのパン職人の伝統と技術を東京で体現。小麦と発酵の文化。",
        "features": ["ブーランジェリー", "麻布台", "パリのバゲット優勝", "フランスパン文化"],
    },
    {
        "name": "エシレ・メゾン デュ ブール 丸の内",
        "category": "restaurant_western", "subcategory": "bakery",
        "url": "https://www.echire-imf.com/",
        "address": "東京都千代田区丸の内2-6-1", "prefecture": "東京都", "city": "千代田区",
        "overview": "フランス・エシレ村のAOP認定バターの専門店。1894年から続くフランス酪農文化の結晶。バターを主役に据えた世界唯一の専門店。",
        "features": ["バター専門店", "丸の内", "1894年エシレ村", "AOP認定", "フランス酪農文化"],
        "founded_year": 1894,
    },
    {
        "name": "ドミニク・アンセル・ベーカリー 表参道",
        "category": "restaurant_western", "subcategory": "bakery",
        "url": "https://dominiqueanseljapan.com/",
        "address": "東京都渋谷区神宮前5-7-14", "prefecture": "東京都", "city": "渋谷区",
        "overview": "クロナッツを発明したパリ出身のシェフの東京店。伝統的フランスパティスリーの技術を革新的に再解釈。食のイノベーションの場所性。",
        "features": ["ベーカリー", "表参道", "クロナッツ発明者", "パリの革新", "食のイノベーション"],
    },
    {
        "name": "ブノワ 東京",
        "category": "restaurant_western", "subcategory": "bistro",
        "url": "",
        "address": "東京都渋谷区神宮前6-10-2", "prefecture": "東京都", "city": "渋谷区",
        "overview": "アラン・デュカス監修のパリ老舗ビストロの東京版。1912年パリ創業の伝統を受け継ぐ正統派ビストロ料理。パリの食文化の移植と適応。",
        "features": ["ビストロ", "表参道", "アラン・デュカス", "1912年パリ創業", "正統派"],
        "founded_year": 1912,
    },

    # === Austrian / German / Viennese ===
    {
        "name": "デメル 東京",
        "category": "restaurant_western", "subcategory": "patisserie",
        "url": "https://www.demel.co.jp/",
        "address": "東京都渋谷区神宮前4-11-6", "prefecture": "東京都", "city": "渋谷区",
        "overview": "1786年ウィーン創業の宮廷御用達菓子店。ザッハトルテの正統な系譜。ハプスブルク帝国の宮廷文化が菓子に結晶した240年の歴史。",
        "features": ["ウィーン菓子", "1786年創業", "宮廷御用達", "ザッハトルテ", "ハプスブルク"],
        "founded_year": 1786,
    },
    {
        "name": "カフェ・ウィーン 日本橋",
        "category": "restaurant_cafe", "subcategory": "cafe",
        "url": "",
        "address": "東京都中央区日本橋室町2-4-3", "prefecture": "東京都", "city": "中央区",
        "overview": "ウィーンのカフェ文化をユネスコ無形文化遺産に認定された精神とともに東京で再現。メランジェとアプフェルシュトゥルーデルで味わうハプスブルクの記憶。",
        "features": ["ウィーンカフェ", "日本橋", "ユネスコ無形文化遺産", "メランジェ", "カフェ文化"],
    },

    # === British ===
    {
        "name": "フォートナム＆メイソン 日本橋三越",
        "category": "restaurant_cafe", "subcategory": "tearoom",
        "url": "https://www.fortnumandmason.co.jp/",
        "address": "東京都中央区日本橋室町1-4-1", "prefecture": "東京都", "city": "中央区",
        "overview": "1707年ロンドン創業の王室御用達ブランド。300年以上の紅茶文化の正統。日本橋三越で体験する英国のアフタヌーンティー文化。",
        "features": ["ティーサロン", "1707年ロンドン創業", "王室御用達", "アフタヌーンティー", "300年"],
        "founded_year": 1707,
    },
    {
        "name": "TWG Tea 自由が丘",
        "category": "restaurant_cafe", "subcategory": "tearoom",
        "url": "https://twgtea.com/",
        "address": "東京都目黒区自由が丘1-9-6", "prefecture": "東京都", "city": "目黒区",
        "overview": "シンガポール発の高級ティーサロン。800種以上の茶葉。茶園から直送される世界の紅茶文化の百科事典的存在。",
        "features": ["ティーサロン", "自由が丘", "800種の茶葉", "シンガポール", "世界の紅茶文化"],
    },

    # === Italian Heritage ===
    {
        "name": "エノテカ・ピンキオーリ 東京",
        "category": "restaurant_western", "subcategory": "italian",
        "url": "",
        "address": "東京都港区赤坂1-12-33", "prefecture": "東京都", "city": "港区",
        "overview": "1979年フィレンツェ創業のミシュラン三ツ星イタリアン。トスカーナの食文化の真髄。8万本以上のワインコレクションと共に味わうイタリアの至福。",
        "features": ["イタリアン", "赤坂", "フィレンツェ三ツ星", "トスカーナ", "8万本ワイン"],
        "founded_year": 1979,
    },
    {
        "name": "イータリー 東京",
        "category": "restaurant_western", "subcategory": "italian",
        "url": "https://www.eataly.co.jp/",
        "address": "東京都中央区日本橋室町3-2-1", "prefecture": "東京都", "city": "中央区",
        "overview": "2007年トリノ創業のイタリア食文化複合施設。「Eat（食べる）+ Italy（イタリア）」。食材販売・レストラン・教育が一体となったイタリア食文化の殿堂。",
        "features": ["イタリア食文化複合施設", "日本橋", "トリノ発", "食と教育", "食文化の殿堂"],
        "founded_year": 2007,
    },

    # === American Third Wave / Culture ===
    {
        "name": "ブルーボトルコーヒー 清澄白河",
        "category": "restaurant_cafe", "subcategory": "coffee",
        "url": "https://bluebottlecoffee.jp/",
        "address": "東京都江東区平野1-4-8", "prefecture": "東京都", "city": "江東区",
        "overview": "2002年オークランド創業。サードウェーブコーヒーの象徴。日本第1号店は清澄白河の倉庫をリノベーション。コーヒーのクラフト精神と下町の場所性が融合。",
        "features": ["コーヒー", "清澄白河", "サードウェーブ", "倉庫リノベ", "日本1号店"],
        "founded_year": 2002,
    },
    {
        "name": "ディーン＆デルーカ 六本木",
        "category": "restaurant_cafe", "subcategory": "deli",
        "url": "https://www.deandeluca.co.jp/",
        "address": "東京都港区赤坂9-7-4", "prefecture": "東京都", "city": "港区",
        "overview": "1977年NYソーホー創業の食のセレクトショップ。「Beautiful food for beautiful people」の哲学。食を美学として捉えるNYの精神を東京で。",
        "features": ["食のセレクトショップ", "六本木", "NYソーホー1977年", "食の美学"],
        "founded_year": 1977,
    },

    # === Asian Heritage ===
    {
        "name": "鼎泰豊 新宿本店",
        "category": "restaurant_western", "subcategory": "chinese",
        "url": "https://www.dintaifung.co.jp/",
        "address": "東京都渋谷区代々木2-2-1", "prefecture": "東京都", "city": "渋谷区",
        "overview": "1958年台北創業。NYタイムズ「世界の10大レストラン」選出。小籠包の芸術的完成度 — 18のひだ、5gの皮、16gの餡。台湾食文化の世界的象徴。",
        "features": ["小籠包", "新宿", "台北1958年", "NYタイムズ選出", "18のひだ"],
        "founded_year": 1958,
    },
    {
        "name": "添好運 日比谷",
        "category": "restaurant_western", "subcategory": "chinese",
        "url": "https://www.timhowan.jp/",
        "address": "東京都千代田区有楽町1-2-2", "prefecture": "東京都", "city": "千代田区",
        "overview": "2009年香港創業。世界一安いミシュラン星付きレストラン。点心職人の技が生み出す庶民の味。香港の茶餐廳文化の精華。",
        "features": ["点心", "日比谷", "世界一安いミシュラン", "香港2009年", "庶民の味"],
        "founded_year": 2009,
    },

    # === Japanese Tea Culture ===
    {
        "name": "一保堂茶舗 東京丸の内店",
        "category": "restaurant_cafe", "subcategory": "tea",
        "url": "https://www.ippodo-tea.co.jp/",
        "address": "東京都千代田区丸の内3-1-1", "prefecture": "東京都", "city": "千代田区",
        "overview": "1717年京都創業の日本茶専門店。300年以上の茶文化の正統。喫茶室「嘉木」で自分で抹茶を点てる体験。日本茶文化の継承と教育。",
        "features": ["日本茶専門店", "丸の内", "1717年京都創業", "300年", "抹茶体験"],
        "founded_year": 1717,
    },
    {
        "name": "中村藤吉本店 東京店",
        "category": "restaurant_cafe", "subcategory": "tea",
        "url": "https://www.tokichi.jp/",
        "address": "東京都中央区銀座6-10-1", "prefecture": "東京都", "city": "中央区",
        "overview": "1854年宇治創業の茶商。170年の歴史を持つ宇治茶文化を東京で体験。生茶ゼリイに代表される、伝統茶の現代的表現。",
        "features": ["宇治茶", "銀座", "1854年宇治創業", "170年", "生茶ゼリイ"],
        "founded_year": 1854,
    },
    {
        "name": "伊藤園 ティーガーデン 銀座",
        "category": "restaurant_cafe", "subcategory": "tea",
        "url": "",
        "address": "東京都中央区銀座5-8-17", "prefecture": "東京都", "city": "中央区",
        "overview": "日本最大の茶業メーカーの体験型ティーサロン。急須で淹れる日本茶の文化を現代に接続。茶道の精神を日常に落とし込む場所。",
        "features": ["日本茶サロン", "銀座", "伊藤園", "急須文化", "茶の現代化"],
    },

    # === Hidden Gems: Yokocho / Backstreet ===
    {
        "name": "ゴールデン街 凪",
        "category": "restaurant_western", "subcategory": "bar",
        "url": "",
        "address": "東京都新宿区歌舞伎町1-1-7", "prefecture": "東京都", "city": "新宿区",
        "overview": "新宿ゴールデン街の名物バー。2坪の極小空間に凝縮された場所性。戦後の闇市から発展した横丁文化の生きた証人。常連が作り上げた共同体。",
        "features": ["バー", "ゴールデン街", "2坪", "闇市からの歴史", "横丁文化"],
    },
    {
        "name": "思い出横丁 岐阜屋",
        "category": "restaurant_japanese", "subcategory": "chuka",
        "url": "",
        "address": "東京都新宿区西新宿1-2-1", "prefecture": "東京都", "city": "新宿区",
        "overview": "新宿西口「思い出横丁」の中華料理店。1946年の闇市から続く横丁の食文化。もつ煮込みとビールの庶民の幸福。戦後復興の記憶が生きる場所。",
        "features": ["中華", "思い出横丁", "1946年", "闇市文化", "庶民の味", "戦後復興"],
        "founded_year": 1946,
    },
    {
        "name": "有楽町ガード下 ニュートーキョー",
        "category": "restaurant_western", "subcategory": "beer_hall",
        "url": "",
        "address": "東京都千代田区有楽町2-2-1", "prefecture": "東京都", "city": "千代田区",
        "overview": "有楽町ガード下のビアホール。鉄道高架下という都市インフラの隙間に生まれた飲食文化。サラリーマン社会と都市の場所性が交差する点。",
        "features": ["ビアホール", "有楽町", "ガード下", "鉄道文化", "サラリーマン"],
    },
    {
        "name": "吉祥寺 ハモニカ横丁 みんみん",
        "category": "restaurant_japanese", "subcategory": "gyoza",
        "url": "",
        "address": "東京都武蔵野市吉祥寺本町1-1-1", "prefecture": "東京都", "city": "武蔵野市",
        "overview": "吉祥寺ハモニカ横丁の餃子店。戦後の闇市から発展した横丁の象徴。狭い路地に並ぶ小さな店の一つ一つが場所の記憶を刻む。",
        "features": ["餃子", "ハモニカ横丁", "吉祥寺", "闇市の歴史", "横丁文化"],
    },
    {
        "name": "月島 もんじゃ 近どう",
        "category": "restaurant_japanese", "subcategory": "monja",
        "url": "",
        "address": "東京都中央区月島3-12-10", "prefecture": "東京都", "city": "中央区",
        "overview": "1950年創業。月島もんじゃストリートの元祖的存在。駄菓子屋のおやつから発展した東京下町の食文化。もんじゃ焼きという場所に紐づく食の原風景。",
        "features": ["もんじゃ焼き", "1950年創業", "月島", "元祖", "下町食文化"],
        "founded_year": 1950,
    },

    # === Architecture-notable restaurants ===
    {
        "name": "TRUNK(HOTEL) KUSHI",
        "category": "restaurant_western", "subcategory": "grill",
        "url": "https://trunk-hotel.com/",
        "address": "東京都渋谷区神宮前5-31", "prefecture": "東京都", "city": "渋谷区",
        "overview": "渋谷・神宮前のソーシャライジングホテル内レストラン。「ソーシャライジング」という新しい場所性の提案。建築とコミュニティの実験。",
        "features": ["グリル", "神宮前", "ソーシャライジング", "建築実験", "コミュニティ"],
    },
    {
        "name": "NOHGA HOTEL UENO ブラッスリー",
        "category": "restaurant_western", "subcategory": "brasserie",
        "url": "https://nohgahotel.com/ueno/",
        "address": "東京都台東区東上野2-21-10", "prefecture": "東京都", "city": "台東区",
        "overview": "上野のライフスタイルホテル内レストラン。地域のクラフト文化と食を接続。上野の美術館文化圏と日常食の架橋。",
        "features": ["ブラッスリー", "上野", "クラフト文化", "地域接続", "美術館文化圏"],
    },
    {
        "name": "CLASKA RESTAURANT KIOKUH",
        "category": "restaurant_western", "subcategory": "french",
        "url": "",
        "address": "東京都目黒区中央町1-3-18", "prefecture": "東京都", "city": "目黒区",
        "overview": "目黒のデザインホテルCLASKA内。古いホテルをリノベーションし、日本のデザイン文化を発信。食とデザインが不可分の場所性。",
        "features": ["フレンチ", "目黒", "デザインホテル", "リノベーション", "食とデザイン"],
    },

    # === Literary / Cultural figure associated ===
    {
        "name": "太宰治ゆかりの喫茶 ルパン",
        "category": "restaurant_cafe", "subcategory": "bar",
        "url": "",
        "address": "東京都中央区銀座6-6-9", "prefecture": "東京都", "city": "中央区",
        "overview": "1928年創業。太宰治が通った銀座の文壇バー。織田作之助、坂口安吾ら無頼派が集った。太宰の有名な写真が撮影された場所。文学の聖地。",
        "features": ["バー", "1928年創業", "銀座", "太宰治", "文壇バー", "無頼派"],
        "founded_year": 1928,
    },
    {
        "name": "連雀町 藪蕎麦",
        "category": "restaurant_japanese", "subcategory": "soba",
        "url": "",
        "address": "東京都千代田区神田須田町2-7-6", "prefecture": "東京都", "city": "千代田区",
        "overview": "1880年創業。藪蕎麦の源流の一つ。神田の蕎麦文化の地層を形成する老舗。「やぶ」の暖簾が示す江戸蕎麦の正統。",
        "features": ["蕎麦", "1880年創業", "神田", "藪蕎麦源流", "江戸蕎麦"],
        "founded_year": 1880,
    },

    # === Specialty / Unique ===
    {
        "name": "ラ・ヴィーニャ 広尾",
        "category": "restaurant_western", "subcategory": "spanish",
        "url": "",
        "address": "東京都港区南麻布5-2-40", "prefecture": "東京都", "city": "港区",
        "overview": "バスクチーズケーキの火付け役。スペイン・サンセバスチャンのバル文化を東京に。バスクの食文化の多様性と革新性を体現。",
        "features": ["スペイン料理", "広尾", "バスクチーズケーキ", "サンセバスチャン", "バル文化"],
    },
    {
        "name": "バスク名菓 ガトー・バスク 白金",
        "category": "restaurant_western", "subcategory": "patisserie",
        "url": "",
        "address": "東京都港区白金台5-13-14", "prefecture": "東京都", "city": "港区",
        "overview": "フランス・バスク地方の伝統菓子ガトー・バスクの専門店。一つの菓子に一つの地方の文化が凝縮。食を通じた地方文化の伝承。",
        "features": ["バスク菓子", "白金", "ガトー・バスク専門", "地方文化の伝承"],
    },
    {
        "name": "ヴァン ナチュール 富ヶ谷",
        "category": "restaurant_western", "subcategory": "wine_bar",
        "url": "",
        "address": "東京都渋谷区富ヶ谷1-6-2", "prefecture": "東京都", "city": "渋谷区",
        "overview": "自然派ワインの専門バー。フランス・ロワール、ジュラの小規模生産者のワインを中心に。ワインを文化として楽しむ新しい場所性。",
        "features": ["ワインバー", "富ヶ谷", "自然派ワイン", "ロワール", "小規模生産者"],
    },

    # === More Kanto / Regional additions ===
    {
        "name": "谷中 カヤバ珈琲 姉妹店 SCAI THE BATHHOUSE",
        "category": "restaurant_cafe", "subcategory": "gallery_cafe",
        "url": "",
        "address": "東京都台東区谷中6-1-23", "prefecture": "東京都", "city": "台東区",
        "overview": "谷中の銭湯をギャラリーに転用した空間に併設するカフェ。現代アートと下町の日常が交差。場所の記憶の層が最も鮮明に見える建築。",
        "features": ["ギャラリーカフェ", "谷中", "銭湯転用", "現代アート", "場所の記憶"],
    },
    {
        "name": "国立 ロージナ茶房",
        "category": "restaurant_cafe", "subcategory": "kissaten",
        "url": "",
        "address": "東京都国立市中1-9-42", "prefecture": "東京都", "city": "国立市",
        "overview": "1954年創業。大学通りの名物喫茶。一橋大学の学生が70年通い続ける知の場所。ヨーロッパの街角カフェのような空間と学問の香り。",
        "features": ["喫茶店", "1954年創業", "国立", "大学通り", "知の場所", "70年"],
        "founded_year": 1954,
    },
    {
        "name": "荻窪 邪宗門 本店",
        "category": "restaurant_cafe", "subcategory": "kissaten",
        "url": "",
        "address": "東京都杉並区上荻1-6-11", "prefecture": "東京都", "city": "杉並区",
        "overview": "1960年代創業。中央線沿線の純喫茶文化を代表する存在。暗く重厚な内装と自家焙煎珈琲。中央線カルチャーの場所性。",
        "features": ["喫茶店", "荻窪", "中央線文化", "自家焙煎", "重厚な内装"],
    },
    {
        "name": "フロインドリーブ 本店",
        "category": "restaurant_western", "subcategory": "bakery",
        "url": "https://www.freundlieb.jp/",
        "address": "兵庫県神戸市中央区生田町4-6-15", "prefecture": "兵庫県", "city": "神戸市",
        "overview": "1924年ドイツ人パン職人ハインリヒ・フロインドリーブが神戸で創業。旧神戸ユニオン教会（登録有形文化財）を店舗に転用。西洋建築とパン文化の邂逅。",
        "features": ["ベーカリー", "1924年創業", "神戸", "ドイツ人創業", "教会転用", "登録有形文化財"],
        "founded_year": 1924,
        "cultural_designation": "registered_tangible",
    },
    {
        "name": "進々堂 京大北門前",
        "category": "restaurant_cafe", "subcategory": "bakery_cafe",
        "url": "",
        "address": "京都府京都市左京区北白川追分町88", "prefecture": "京都府", "city": "京都市",
        "overview": "1930年創業。京都大学北門前のベーカリーカフェ。黒田辰秋（人間国宝）作のテーブルと椅子で過ごす。学問と食とデザインが一体となった場所。",
        "features": ["ベーカリーカフェ", "1930年創業", "京大北門前", "黒田辰秋", "人間国宝の家具"],
        "founded_year": 1930,
    },

    # === More specialty restaurants ===
    {
        "name": "ダルマット 恵比寿",
        "category": "restaurant_western", "subcategory": "italian",
        "url": "",
        "address": "東京都渋谷区恵比寿南1-5-10", "prefecture": "東京都", "city": "渋谷区",
        "overview": "恵比寿のイタリアン。日本のイタリア料理の進化を体現。パスタとワインに特化した職人的アプローチ。",
        "features": ["イタリアン", "恵比寿", "パスタ", "ワイン", "職人的"],
    },
    {
        "name": "カフェ ド シャンゼリゼ",
        "category": "restaurant_cafe", "subcategory": "cafe",
        "url": "",
        "address": "東京都台東区上野4-9-6", "prefecture": "東京都", "city": "台東区",
        "overview": "上野アメ横近くの純喫茶。パリのシャンゼリゼ通りの名を冠した昭和の喫茶空間。異国への憧れが結晶した下町の場所性。",
        "features": ["喫茶店", "上野", "アメ横", "昭和レトロ", "パリへの憧れ"],
    },
    {
        "name": "銀座 三笠会館",
        "category": "restaurant_western", "subcategory": "yoshoku",
        "url": "https://www.mikasa-kaikan.co.jp/",
        "address": "東京都中央区銀座5-5-17", "prefecture": "東京都", "city": "中央区",
        "overview": "1925年創業。銀座の老舗洋食レストラン＆バー。かにクリームコロッケ発祥の地。100年にわたり銀座の社交文化を支えてきた場所。",
        "features": ["洋食", "1925年創業", "銀座", "かにクリームコロッケ発祥", "社交文化", "100年"],
        "founded_year": 1925,
    },
    {
        "name": "横浜 スカンディヤ",
        "category": "restaurant_western", "subcategory": "scandinavian",
        "url": "",
        "address": "神奈川県横浜市中区海岸通1-1", "prefecture": "神奈川県", "city": "横浜市",
        "overview": "1963年創業。横浜の北欧料理レストラン。スモーガスボードの伝統を日本で60年守り続ける。港町横浜の国際性を体現する場所。",
        "features": ["北欧料理", "1963年創業", "横浜", "スモーガスボード", "国際性"],
        "founded_year": 1963,
    },
    {
        "name": "ミクニ ナゴヤ",
        "category": "restaurant_western", "subcategory": "french",
        "url": "",
        "address": "愛知県名古屋市中区栄3-6-1", "prefecture": "愛知県", "city": "名古屋市",
        "overview": "三國清三シェフの名古屋店。フランス料理を日本各地の食材で再構築する哲学。中部圏の食文化とフレンチの対話。",
        "features": ["フランス料理", "名古屋", "三國清三", "地域食材", "フレンチの地域化"],
    },

    # === More hidden cafes ===
    {
        "name": "珈琲 春",
        "category": "restaurant_cafe", "subcategory": "kissaten",
        "url": "",
        "address": "東京都台東区入谷1-12-5", "prefecture": "東京都", "city": "台東区",
        "overview": "入谷の路地裏に佇む小さな純喫茶。手書きのメニュー、年季の入ったカウンター。名もなき日常の中に場所性が宿る。",
        "features": ["喫茶店", "入谷", "路地裏", "手書きメニュー", "日常の場所性"],
    },
    {
        "name": "喫茶 宝石箱",
        "category": "restaurant_cafe", "subcategory": "kissaten",
        "url": "",
        "address": "東京都千代田区神田錦町1-14", "prefecture": "東京都", "city": "千代田区",
        "overview": "神田の隠れ家的喫茶。昭和の記憶が詰まった小さな空間。フルーツサンドが名物。都市の喧騒から隔てられた宝石箱のような場所。",
        "features": ["喫茶店", "神田", "昭和", "フルーツサンド", "隠れ家"],
    },

    # === More international ===
    {
        "name": "マンダリン オリエンタル 東京 タパス モラキュラーバー",
        "category": "restaurant_western", "subcategory": "molecular",
        "url": "https://www.mandarinoriental.co.jp/",
        "address": "東京都中央区日本橋室町2-1-1", "prefecture": "東京都", "city": "中央区",
        "overview": "マンダリン オリエンタル東京38階。8席限定のモレキュラーガストロノミー。科学と料理芸術の境界を探求する、食の実験室。",
        "features": ["モレキュラー", "日本橋", "8席限定", "分子ガストロノミー", "食の実験室"],
    },
    {
        "name": "パーク ハイアット 東京 梢",
        "category": "restaurant_japanese", "subcategory": "kaiseki",
        "url": "https://www.hyatt.com/park-hyatt-tokyo/",
        "address": "東京都新宿区西新宿3-7-1-2", "prefecture": "東京都", "city": "新宿区",
        "overview": "パークハイアット東京40階の日本料理。丹下健三設計の超高層ビルから東京を見下ろしながら味わう懐石。建築と和食の垂直的場所性。",
        "features": ["懐石料理", "西新宿", "パークハイアット40階", "丹下健三", "垂直的場所性"],
    },
    {
        "name": "ザ・リッツ・カールトン東京 ひのきざか",
        "category": "restaurant_japanese", "subcategory": "kaiseki",
        "url": "",
        "address": "東京都港区赤坂9-7-1", "prefecture": "東京都", "city": "港区",
        "overview": "リッツ・カールトン東京45階。六本木の夜景とともに味わう日本料理。グローバルラグジュアリーの文脈における日本の食文化の提示。",
        "features": ["日本料理", "六本木", "リッツ・カールトン45階", "夜景", "グローバルラグジュアリー"],
    },

    # === Additional diverse spots ===
    {
        "name": "サイゼリヤ 1号店",
        "category": "restaurant_western", "subcategory": "italian",
        "url": "",
        "address": "千葉県市川市八幡2-13-1", "prefecture": "千葉県", "city": "市川市",
        "overview": "1973年市川で創業。正垣泰彦が始めた日本のファミリーイタリアンの原点。大衆食文化の革命。本場イタリア料理を日本の日常食に変えた場所の記憶。",
        "features": ["イタリアン", "1973年創業", "市川", "1号店", "大衆食文化の革命"],
        "founded_year": 1973,
    },
    {
        "name": "すかいらーく 発祥の地",
        "category": "restaurant_western", "subcategory": "family",
        "url": "",
        "address": "東京都武蔵野市西久保1-9-8", "prefecture": "東京都", "city": "武蔵野市",
        "overview": "1970年創業。ファミリーレストランの原点。「家族で外食を楽しむ」文化を日本に定着させた。郊外の食文化を創造した場所性。",
        "features": ["ファミレス", "1970年創業", "武蔵野", "ファミリーレストラン発祥", "郊外食文化"],
        "founded_year": 1970,
    },
    {
        "name": "養老乃瀧 1号店跡",
        "category": "restaurant_japanese", "subcategory": "izakaya",
        "url": "",
        "address": "東京都新宿区西新宿", "prefecture": "東京都", "city": "新宿区",
        "overview": "1956年新宿で創業。居酒屋チェーンの先駆。「一人でも気軽に入れる居酒屋」を作った。日本の外食文化の民主化の記憶。",
        "features": ["居酒屋", "1956年創業", "新宿", "居酒屋チェーン先駆", "外食文化の民主化"],
        "founded_year": 1956,
    },
    {
        "name": "神戸 北野ホテル レストラン アッシュ",
        "category": "restaurant_western", "subcategory": "french",
        "url": "https://www.kobe-kitanohotel.co.jp/",
        "address": "兵庫県神戸市中央区山本通3-3-20", "prefecture": "兵庫県", "city": "神戸市",
        "overview": "ベルナール・ロワゾー直系の料理哲学を継承する山口浩シェフの世界。神戸北野の異人館街という場所性と、フランス料理の精神が重なる。",
        "features": ["フランス料理", "神戸北野", "ベルナール・ロワゾー", "異人館街", "料理哲学"],
    },
]


def main():
    conn = get_db()
    inserted = 0
    skipped = 0
    for data in DATA:
        data.setdefault("source_type", "manual")
        fid = insert_facility(conn, data)
        if fid:
            inserted += 1
        else:
            skipped += 1
    conn.commit()
    total = conn.execute("SELECT COUNT(*) FROM facilities").fetchone()[0]
    conn.close()
    print(f"International collection complete:")
    print(f"  Inserted: {inserted}")
    print(f"  Skipped (duplicate): {skipped}")
    print(f"  Total facilities in DB: {total}")


if __name__ == "__main__":
    main()
