import Link from "next/link";
import facilities from "@/data/facilities.json";
import stats from "@/data/stats.json";

// Miratuku CI seed colors for decorative elements
const seedColors = [
  "#F0A671", "#F2C792", "#F1C189", "#CEA26F", "#F8CDAC", "#F0BE83",
  "#EFC4A4", "#F7BEA2", "#DC8766", "#B07256", "#966D5E", "#7A4033",
];

// Top scored facilities
const topScored = [...facilities]
  .filter((f) => f.total_score != null)
  .sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0))
  .slice(0, 6);

// Historic featured
const featured = facilities
  .filter((f) => f.founded_year && f.founded_year < 1900 && f.overview)
  .slice(0, 6);

const displayFacilities = topScored.length >= 3 ? topScored : featured;

const categoryLabels: Record<string, string> = {
  restaurant_japanese: "和食",
  restaurant_western: "洋食",
  restaurant_cafe: "カフェ・喫茶",
  hotel: "ホテル",
  ryokan: "旅館",
  minshuku: "民宿",
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Miratuku gradient background */}
        <div className="absolute inset-0 miratuku-gradient opacity-95" />
        {/* Decorative seed shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {seedColors.map((color, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                backgroundColor: color,
                width: `${40 + i * 15}px`,
                height: `${60 + i * 20}px`,
                top: `${10 + (i * 37) % 80}%`,
                left: `${5 + (i * 43) % 90}%`,
                transform: `rotate(${i * 30 - 60}deg)`,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
          <p className="text-sm tracking-[0.4em] text-white/60 mb-4">
            BASHO — PLACENESS
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-wide text-white mb-6">
            場所の記憶を辿り、
            <br />
            まだ見ぬ食と宿に出会う
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            トレンドでも口コミでもない。歴史と文化が堆積した「場所性」という
            新しい軸で、あなたにふさわしい飲食店・宿泊施設を見つける。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/facilities"
              className="inline-block bg-white text-[var(--color-accent)] px-8 py-3.5 text-sm font-medium tracking-wider hover:bg-white/90 transition-colors rounded"
            >
              施設を探す
            </Link>
            <Link
              href="/about"
              className="inline-block border border-white/40 text-white px-8 py-3.5 text-sm tracking-wider hover:border-white/70 hover:bg-white/10 transition-colors rounded"
            >
              場所性とは
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: stats.total, label: "施設" },
              { val: Object.keys(stats.by_prefecture).length, label: "都道府県" },
              { val: "8", label: "評価軸" },
              { val: stats.oldest_year || "—", label: "最古の創業年" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-serif text-[var(--color-accent)]">{s.val}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Top Scored */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase">
            {topScored.length >= 3 ? "Highest Rated" : "Featured"}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text)]">
            {topScored.length >= 3 ? "場所性スコアが高い施設" : "場所性が際立つ施設"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFacilities.map((f, idx) => (
            <Link key={f.id} href={`/facilities/${f.id}`} className="group block">
              {/* Image area with Miratuku seed color accent */}
              <div className="aspect-[4/3] bg-miratuku-pale-peach/30 mb-4 overflow-hidden relative rounded-lg">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${seedColors[idx % 12]} 0%, ${seedColors[(idx + 4) % 12]} 100%)`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    {f.total_score != null && (
                      <span className="text-xs px-2 py-0.5 bg-white/90 text-[var(--color-accent)] rounded font-medium">
                        {(f.total_score as unknown as number).toFixed(1)}
                      </span>
                    )}
                    <p className="text-white/80 text-xs tracking-wider">
                      {f.founded_year ? `${f.founded_year}年` : ""}
                      {f.prefecture ? ` / ${f.prefecture}` : ""}
                    </p>
                  </div>
                </div>
                {/* Visual placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-serif text-6xl opacity-20"
                    style={{ color: seedColors[(idx + 2) % 12] }}
                  >
                    {f.name.charAt(0)}
                  </span>
                </div>
              </div>
              <h3 className="font-serif text-xl text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-2">
                {f.name}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                {f.overview}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(f.features as string[]).slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-miratuku-pale-peach/30 text-[var(--color-text-muted)] rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/facilities"
            className="inline-block border border-[var(--color-accent)]/30 text-[var(--color-accent)] px-8 py-3 text-sm tracking-wider hover:bg-[var(--color-accent)] hover:text-white transition-colors rounded"
          >
            すべての施設を見る
          </Link>
        </div>
      </section>

      {/* 8 Axes */}
      <section className="miratuku-gradient text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] text-white/50 mb-2 uppercase">Framework</p>
            <h2 className="font-serif text-3xl md:text-4xl">場所性の8軸</h2>
            <p className="text-white/60 mt-3 max-w-xl">
              西田幾多郎の場所論、ブルデューの文化資本論、現象学的場所論を統合した
              独自の評価フレームワーク
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: "歴史的継続性", d: "営みの継続年数と歴史の層の厚さ" },
              { n: "文化的営みの深度", d: "伝統技法の継承と職人的身体知" },
              { n: "地域的固有性", d: "土地・地域との結びつきの深さ" },
              { n: "物質的文化財性", d: "建築・空間・調度品の文化的価値" },
              { n: "場所の内側性", d: "訪問者が包まれる感覚の深さ" },
              { n: "文化的複雑性", d: "文化的要素の多層性と混交性" },
              { n: "ナラティブ性", d: "場所が持つ物語の豊かさと喚起力" },
              { n: "本物性", d: "商業演出でない内在的な真正性" },
            ].map((axis, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg p-5 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: seedColors[i], color: i > 8 ? "#fff" : "#7A4033" }}
                  >
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-serif text-base text-white mb-1.5">{axis.n}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{axis.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase">Categories</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text)]">カテゴリ別に探す</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(stats.by_category).map(([cat, count], idx) => (
            <Link
              key={cat}
              href={`/facilities?category=${cat}`}
              className="group relative aspect-[3/2] overflow-hidden flex items-end rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${seedColors[idx * 2]} 0%, ${seedColors[(idx * 2 + 3) % 12]} 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-[var(--color-accent)]/40 group-hover:bg-[var(--color-accent)]/50 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-7xl text-white/10">
                  {(categoryLabels[cat] || cat).charAt(0)}
                </span>
              </div>
              <div className="relative p-4 w-full">
                <p className="font-serif text-xl text-white">{categoryLabels[cat] || cat}</p>
                <p className="text-white/60 text-sm">{count}件</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Miratuku Credit */}
      <section className="bg-white border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-xs tracking-[0.4em] text-[var(--color-text-muted)]/60 mb-2">
            CREATED BY
          </p>
          <p className="tracking-[0.3em] text-[var(--color-accent)] font-medium text-lg">
            MIRA TUKU
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            NPO法人ミラツク — 多様な人々が集い、未来をつくる
          </p>
        </div>
      </section>
    </div>
  );
}
