# Basho DB - 場所性データベース

日本国内の飲食店・宿泊施設の「場所性（basho-sei）」を評価・蓄積するデータベースシステム。

## 概要

トレンドや見た目のデザインではなく、歴史・文化に根ざした「場所性」を持つ施設を体系的に収集・評価する。西田幾多郎の場所論、ブルデューの文化資本論、現象学的場所論を理論的基盤とし、8軸の評価フレームワークで施設の場所性を定量化する。

## 場所性の8軸評価

| 軸 | 名称 | 概要 |
|----|------|------|
| 1 | 歴史的継続性 | 営みの継続年数、歴史の層の厚さ |
| 2 | 文化的営みの深度 | 伝統技法の継承、職人的身体知 |
| 3 | 地域的固有性 | 土地・地域との結びつき |
| 4 | 物質的文化財性 | 建築・空間・調度品の文化的価値 |
| 5 | 場所の内側性 | 訪問者が包まれる感覚 |
| 6 | 文化的複雑性 | 文化的要素の多層性 |
| 7 | ナラティブ性 | 場所が持つ物語の豊かさ |
| 8 | 本物性 | 商業演出でない真正性 |

## 使い方

### 場所性エージェント（AI評価）

```bash
# 施設を評価
python3 basho_agent.py evaluate "施設名"
python3 basho_agent.py evaluate --text "施設の説明テキスト"

# バッチ評価（未評価の施設をまとめて評価）
python3 basho_agent.py batch --limit 10

# 施設検索
python3 basho_agent.py search "キーワード"
```

### データベース操作（db-agent.py経由）

```bash
python3 ~/tools/db-agent.py schema basho
python3 ~/tools/db-agent.py query basho "SELECT name, category, address FROM facilities LIMIT 10"
python3 ~/tools/db-agent.py query basho "SELECT name, total_score FROM facilities f JOIN basho_scores bs ON f.id = bs.facility_id ORDER BY total_score DESC"
```

## データベース構造

- **facilities**: 施設基本情報（102件）
- **basho_scores**: 場所性評価結果
- **sources**: 情報ソース追跡
- **seed_lists**: 収集候補リスト

## 現在のデータ

- 総施設数: 102件
- 東京都: 70件、神奈川県: 8件、長野県: 6件 他
- カテゴリ: 和食46件、カフェ17件、旅館15件、ホテル12件、洋食11件

## 技術スタック

- Python 3 + SQLite
- Claude API（場所性評価エージェント）
- APIキーはmacOSキーチェーンに保存

## ファイル構成

```
basho-db/
├── basho_agent.py          # 場所性評価エージェント
├── data/
│   ├── basho.db            # SQLiteデータベース
│   └── init_db.py          # DB初期化スクリプト
├── scripts/
│   ├── collect_seed.py     # シードデータ収集
│   └── collect_web.py      # 追加データ収集
└── docs/
    └── basho_definition.md # 場所性の定義と評価フレームワーク
```

## 今後の予定（Phase 2）

- 場所性スコアのバッチ評価実行
- 詳細な施設情報の追加収集
- Web UI（マッチングサイト）の構築
- リアルタイム情報更新パイプライン
