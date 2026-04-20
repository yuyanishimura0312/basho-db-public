import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <p className="text-[0.7rem] tracking-[0.3em] text-[var(--color-accent)] mb-2 uppercase font-medium">Guide</p>
      <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.15] text-[var(--color-text)] mb-8">
        Bashoの使い方
      </h1>

      <div className="space-y-10 text-[var(--color-text-muted)] leading-relaxed">
        {/* Overview */}
        <section>
          <p className="text-lg">
            Basho（場所の記憶）は、トレンドや口コミではなく、歴史と文化に根ざした
            「場所性」という新しい軸で日本の飲食店・宿泊施設を発見するサイトです。
          </p>
        </section>

        {/* How to use */}
        <section>
          <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.15] text-[var(--color-text)] mb-4">探し方</h2>

          <div className="space-y-6">
            <div className="bg-white border border-[var(--color-border)] p-6">
              <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-accent)] mb-2">エリアで探す</h3>
              <p className="text-[0.9rem] mb-3">
                関東・関西・中部・北陸・北海道・東北・中国・四国・九州・沖縄の
                8つの地域ブロックから施設を探せます。関東はさらに銀座・六本木・渋谷など
                11のサブエリアに分かれています。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/facilities" className="text-xs px-3 py-1 bg-[var(--color-bg-alt)] text-[var(--color-accent)]">関東</Link>
                <Link href="/kansai" className="text-xs px-3 py-1 bg-[var(--color-bg-alt)] text-[var(--color-accent)]">関西</Link>
                <Link href="/chubu" className="text-xs px-3 py-1 bg-[var(--color-bg-alt)] text-[var(--color-accent)]">中部・北陸</Link>
                <Link href="/hokkaido-tohoku" className="text-xs px-3 py-1 bg-[var(--color-bg-alt)] text-[var(--color-accent)]">北海道・東北</Link>
                <Link href="/chugoku-shikoku" className="text-xs px-3 py-1 bg-[var(--color-bg-alt)] text-[var(--color-accent)]">中国・四国</Link>
                <Link href="/kyushu" className="text-xs px-3 py-1 bg-[var(--color-bg-alt)] text-[var(--color-accent)]">九州・沖縄</Link>
              </div>
            </div>

            <div className="bg-white border border-[var(--color-border)] p-6">
              <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-accent)] mb-2">テーマで探す</h3>
              <p className="text-[0.9rem]">
                「100年以上の老舗」「発祥の店」「文化財の建物」「文豪ゆかりの店」
                「フレンチ＆イタリアン」「純喫茶」「パン＆洋菓子」「バー＆酒文化」
                の8つのテーマで施設を探せます。
              </p>
            </div>

            <div className="bg-white border border-[var(--color-border)] p-6">
              <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-accent)] mb-2">時代で探す</h3>
              <p className="text-[0.9rem]">
                江戸時代以前から平成以降まで、施設の創業年に基づいて時代別に探せます。
                705年創業の慶雲館から、現代のイノベーティブレストランまで。
              </p>
            </div>
          </div>
        </section>

        {/* Score */}
        <section>
          <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.15] text-[var(--color-text)] mb-4">場所性スコアの読み方</h2>
          <p className="text-[0.9rem] mb-4">
            各施設は西田幾多郎の場所論、ブルデューの文化資本論、現象学的場所論を統合した
            8軸のフレームワークで1〜5点のスコアが付けられています。
            スコアが高いほど「場所性が豊か」— その場所でしか味わえない体験が深いことを意味します。
          </p>
          <Link href="/about" className="text-[0.9rem] text-[var(--color-accent)] hover:underline">
            場所性の8軸について詳しく見る →
          </Link>
        </section>

        {/* Links */}
        <section>
          <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.15] text-[var(--color-text)] mb-4">関連ページ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/about" className="block bg-white border border-[var(--color-border)] p-5 hover:border-[var(--color-accent)] transition-colors">
              <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-text)] mb-1">場所性とは</h3>
              <p className="text-[0.78rem] text-[var(--color-text-muted)]">理論的基盤と8軸フレームワークの解説</p>
            </Link>
            <Link href="/dashboard" className="block bg-white border border-[var(--color-border)] p-5 hover:border-[var(--color-accent)] transition-colors">
              <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-text)] mb-1">ダッシュボード</h3>
              <p className="text-[0.78rem] text-[var(--color-text-muted)]">データベースの統計情報を可視化</p>
            </Link>
            <Link href="/stays" className="block bg-white border border-[var(--color-border)] p-5 hover:border-[var(--color-accent)] transition-colors">
              <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-text)] mb-1">宿を探す</h3>
              <p className="text-[0.78rem] text-[var(--color-text-muted)]">旅館・ホテル・民宿</p>
            </Link>
            <a href="/report-bashosei.html" className="block bg-white border border-[var(--color-border)] p-5 hover:border-[var(--color-accent)] transition-colors">
              <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-text)] mb-1">場所性レポート</h3>
              <p className="text-[0.78rem] text-[var(--color-text-muted)]">10,000字の詳細な学術レポート</p>
            </a>
          </div>
        </section>

        {/* About MIRA TUKU */}
        <section className="border-t border-[var(--color-border)] pt-8">
          <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.15] text-[var(--color-text)] mb-4">運営</h2>
          <p className="text-[0.9rem]">
            Bashoは NPO法人ミラツク（MIRA TUKU）が運営しています。
            「多様な人々が集い、未来をつくる」をミッションに、
            場所性という新しい軸で日本の食と宿を再発見するプロジェクトです。
          </p>
        </section>
      </div>
    </div>
  );
}
