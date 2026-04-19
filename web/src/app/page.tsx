import Link from "next/link";
import Image from "next/image";
import facilities from "@/data/facilities.json";
import stats from "@/data/stats.json";

const seedColors = [
  "#F0A671", "#F2C792", "#F1C189", "#CEA26F", "#F8CDAC", "#F0BE83",
  "#EFC4A4", "#F7BEA2", "#DC8766", "#B07256", "#966D5E", "#7A4033",
];

// Dining only
const dining = facilities.filter(
  (f) => !["hotel", "ryokan", "minshuku"].includes(f.category)
);

const diningStats = {
  total: dining.length,
  prefectures: new Set(dining.map((f) => f.prefecture).filter(Boolean)).size,
};

// Top scored dining
const topScored = [...dining]
  .filter((f) => f.total_score != null)
  .sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0))
  .slice(0, 6);

// Random 3 recommendations from Kanto (with photos preferred)
const kantoPrefs = ["東京都","神奈川県","千葉県","埼玉県","群馬県","栃木県","茨城県"];
const kantoWithPhotos = dining.filter(
  (f) => f.image_url && f.total_score && f.total_score >= 3.5 && kantoPrefs.includes(f.prefecture || "")
);
const shuffled = [...kantoWithPhotos].sort(() => Math.random() - 0.5);
const recommended = shuffled.slice(0, 3);

const categoryLabels: Record<string, string> = {
  restaurant_japanese: "和食",
  restaurant_western: "洋食",
  restaurant_cafe: "カフェ・喫茶",
};

// Dining-only category stats
const diningCategories: Record<string, number> = {};
for (const f of dining) {
  diningCategories[f.category] = (diningCategories[f.category] || 0) + 1;
}
const sortedCategories = Object.entries(diningCategories).sort(([, a], [, b]) => b - a);

// Kanto sub-areas
const kantoAreas = [
  { name: "銀座・日本橋", prefs: ["東京都"], cities: ["中央区"], count: 0 },
  { name: "六本木・麻布・赤坂", prefs: ["東京都"], cities: ["港区"], count: 0 },
  { name: "渋谷・表参道・青山", prefs: ["東京都"], cities: ["渋谷区"], count: 0 },
  { name: "新宿・神楽坂", prefs: ["東京都"], cities: ["新宿区"], count: 0 },
  { name: "浅草・上野・下町", prefs: ["東京都"], cities: ["台東区", "墨田区", "荒川区", "江東区"], count: 0 },
  { name: "神田・神保町・秋葉原", prefs: ["東京都"], cities: ["千代田区"], count: 0 },
  { name: "目黒・世田谷・城南", prefs: ["東京都"], cities: ["目黒区", "世田谷区", "大田区", "品川区"], count: 0 },
  { name: "池袋・文京・城北", prefs: ["東京都"], cities: ["豊島区", "文京区", "北区", "練馬区", "杉並区", "中野区", "板橋区"], count: 0 },
  { name: "西東京・多摩", prefs: ["東京都"], cities: ["武蔵野市", "調布市", "国立市", "八王子市", "立川市", "小金井市", "町田市", "三鷹市"], count: 0 },
  { name: "横浜・神奈川", prefs: ["神奈川県"], cities: [], count: 0 },
  { name: "千葉・埼玉・北関東", prefs: ["千葉県", "埼玉県", "群馬県", "栃木県", "茨城県"], cities: [], count: 0 },
];

// Count facilities per area
for (const f of dining) {
  for (const area of kantoAreas) {
    if (area.cities.length > 0) {
      if (area.prefs.includes(f.prefecture || "") && area.cities.includes(f.city || "")) {
        area.count++;
      }
    } else {
      if (area.prefs.includes(f.prefecture || "")) {
        area.count++;
      }
    }
  }
}

// Themes
const themes = [
  { name: "老舗 (100年以上)", icon: "1", desc: "創業100年を超える歴史を持つ名店", filter: "centenarian" },
  { name: "発祥の店", icon: "2", desc: "「元祖」「発祥」の称号を持つ店", filter: "origin" },
  { name: "文化財の建物", icon: "3", desc: "登録有形文化財・重要文化財の建物", filter: "heritage" },
  { name: "文豪・偉人ゆかりの店", icon: "4", desc: "文学者や著名人が愛した場所", filter: "literary" },
  { name: "フレンチ & イタリアン", icon: "5", desc: "ヨーロッパの食文化を伝える名店", filter: "european" },
  { name: "純喫茶 & カフェ", icon: "6", desc: "珈琲文化と場所性が交差する空間", filter: "kissaten" },
  { name: "パン & 洋菓子", icon: "7", desc: "ベーカリー・パティスリーの名店", filter: "bakery" },
  { name: "バー & 酒文化", icon: "8", desc: "カクテル、ワイン、日本酒の場所性", filter: "bar" },
];

// Eras
const currentYear = new Date().getFullYear();
const eras = [
  { name: "〜江戸", range: "1603年以前", min: 0, max: 1603 },
  { name: "江戸", range: "1603-1867", min: 1603, max: 1868 },
  { name: "明治", range: "1868-1912", min: 1868, max: 1912 },
  { name: "大正", range: "1912-1926", min: 1912, max: 1926 },
  { name: "昭和前期", range: "1926-1945", min: 1926, max: 1945 },
  { name: "昭和後期", range: "1945-1989", min: 1945, max: 1989 },
  { name: "平成以降", range: "1989-", min: 1989, max: currentYear + 1 },
];

// Count per era
for (const era of eras) {
  (era as Record<string, unknown>).count = dining.filter(
    (f) => f.founded_year && f.founded_year >= era.min && f.founded_year < era.max
  ).length;
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 miratuku-gradient opacity-95" />
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <p className="text-sm tracking-[0.4em] text-white/60 mb-4">
            BASHO — PLACENESS
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-wide text-white mb-6">
            場所の記憶を辿り、
            <br />
            まだ見ぬ食に出会う
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            トレンドでも口コミでもない。歴史と文化が堆積した「場所性」という
            新しい軸で、あなたにふさわしいレストラン・カフェ・バーを見つける。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/facilities" className="inline-block bg-white text-[var(--color-accent)] px-8 py-3.5 text-sm font-medium tracking-wider hover:bg-white/90 transition-colors rounded">
              食を探す
            </Link>
            <Link href="/stays" className="inline-block border border-white/40 text-white px-8 py-3.5 text-sm tracking-wider hover:border-white/70 hover:bg-white/10 transition-colors rounded">
              宿を探す
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: diningStats.total, label: "飲食店" },
              { val: diningStats.prefectures, label: "都道府県" },
              { val: "8", label: "評価軸" },
              { val: stats.oldest_year || "—", label: "最古の創業年" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-serif text-[var(--color-accent)]">{s.val}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Random Recommendations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase">Today&apos;s Pick</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">今日のおすすめ</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {recommended.map((f: any, idx: number) => (
            <Link key={f.id} href={`/facilities/${f.id}`} className="group block bg-white border border-[var(--color-border)] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/9] relative overflow-hidden">
                {f.image_url && (
                  <Image src={f.image_url} alt={f.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" unoptimized />
                )}
                {!f.image_url && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${seedColors[idx % 12]}40, ${seedColors[(idx+5) % 12]}40)` }}>
                    <span className="font-serif text-4xl" style={{ color: `${seedColors[(idx+2) % 12]}50` }}>{f.name.charAt(0)}</span>
                  </div>
                )}
                {f.total_score != null && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs px-2 py-0.5 bg-white/90 text-[var(--color-accent)] rounded font-medium">{(f.total_score as number).toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-1">{f.name}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-2">{f.prefecture} {f.city}{f.founded_year ? ` / ${f.founded_year}年創業` : ""}</p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3">{f.overview}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Kanto Sub-areas */}
      <section className="bg-white border-t border-b border-[var(--color-border)] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase">Area</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">関東エリア別</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {kantoAreas.filter(a => a.count > 0).map((area, i) => (
              <Link key={i} href={`/facilities?area=${encodeURIComponent(area.name)}`}
                className="group border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-accent)] hover:bg-miratuku-pale-peach/10 transition-all">
                <p className="font-serif text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)]">{area.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{area.count}件</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { name: "関西", href: "/kansai" },
              { name: "中部・北陸", href: "/chubu" },
              { name: "北海道・東北", href: "/hokkaido-tohoku" },
              { name: "中国・四国", href: "/chugoku-shikoku" },
              { name: "九州・沖縄", href: "/kyushu" },
            ].map((r) => (
              <Link key={r.name} href={r.href}
                className="text-sm px-4 py-2 border border-[var(--color-accent)]/30 text-[var(--color-accent)] rounded-full hover:bg-[var(--color-accent)] hover:text-white transition-colors">
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase">Theme</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">テーマで探す</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((theme, i) => (
            <Link key={i} href={`/facilities?theme=${theme.filter}`}
              className="group border border-[var(--color-border)] rounded-lg p-5 hover:border-[var(--color-accent)] hover:bg-miratuku-pale-peach/10 transition-all">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm mb-3"
                style={{ backgroundColor: `${seedColors[i % 12]}25`, color: seedColors[(i+4) % 12] }}>
                {theme.icon}
              </div>
              <h3 className="font-serif text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] mb-1">{theme.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{theme.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Eras */}
      <section className="bg-white border-t border-b border-[var(--color-border)] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase">Era</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">時代で探す</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {eras.map((era, i) => (
              <Link key={i} href={`/facilities?era=${era.min}-${era.max}`}
                className="group flex items-center gap-3 border border-[var(--color-border)] rounded-lg px-5 py-3 hover:border-[var(--color-accent)] hover:bg-miratuku-pale-peach/10 transition-all">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seedColors[i * 2 % 12] }} />
                <div>
                  <p className="font-serif text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)]">{era.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{era.range} ({(era as Record<string, unknown>).count as number}件)</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Scored */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase">Highest Rated</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">場所性スコアが高い飲食店</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topScored.map((f, idx) => (
            <Link key={f.id} href={`/facilities/${f.id}`} className="group block">
              <div className="aspect-[4/3] bg-miratuku-pale-peach/30 mb-4 overflow-hidden relative rounded-lg">
                {f.image_url && (
                  <Image src={f.image_url} alt={f.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                )}
                {!f.image_url && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${seedColors[idx % 12]}30, ${seedColors[(idx+5) % 12]}30)` }}>
                    <span className="font-serif text-5xl" style={{ color: `${seedColors[(idx+2) % 12]}40` }}>{f.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    {f.total_score != null && (
                      <span className="text-xs px-2 py-0.5 bg-white/90 text-[var(--color-accent)] rounded font-medium">{(f.total_score as unknown as number).toFixed(1)}</span>
                    )}
                    <p className="text-white/80 text-xs tracking-wider">{f.founded_year ? `${f.founded_year}年` : ""}{f.prefecture ? ` / ${f.prefecture}` : ""}</p>
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-lg text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-1">{f.name}</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2">{f.overview}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/facilities" className="inline-block border border-[var(--color-accent)]/30 text-[var(--color-accent)] px-8 py-3 text-sm tracking-wider hover:bg-[var(--color-accent)] hover:text-white transition-colors rounded">
            すべての飲食店を見る
          </Link>
        </div>
      </section>

      {/* 8 Axes (compact) */}
      <section className="miratuku-gradient text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-white/50 mb-2 uppercase">Framework</p>
            <h2 className="font-serif text-2xl md:text-3xl">場所性の8軸</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "歴史的継続性", "文化的営みの深度", "地域的固有性", "物質的文化財性",
              "場所の内側性", "文化的複雑性", "ナラティブ性", "本物性",
            ].map((axis, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg p-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mb-2"
                  style={{ backgroundColor: seedColors[i], color: i > 8 ? "#fff" : "#7A4033" }}>
                  {i + 1}
                </div>
                <p className="text-sm text-white/90">{axis}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">
              場所性について詳しく見る →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase">Categories</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">カテゴリ別に探す</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {sortedCategories.map(([cat, count], idx) => (
            <Link key={cat} href={`/facilities?category=${cat}`}
              className="group relative aspect-[3/2] overflow-hidden flex items-end rounded-lg"
              style={{ background: `linear-gradient(135deg, ${seedColors[idx * 2]} 0%, ${seedColors[(idx * 2 + 3) % 12]} 100%)` }}>
              <div className="absolute inset-0 bg-[var(--color-accent)]/40 group-hover:bg-[var(--color-accent)]/50 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-6xl text-white/10">{(categoryLabels[cat] || cat).charAt(0)}</span>
              </div>
              <div className="relative p-4 w-full">
                <p className="font-serif text-lg text-white">{categoryLabels[cat] || cat}</p>
                <p className="text-white/60 text-sm">{count}件</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MIRA TUKU Credit */}
      <section className="bg-white border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-xs tracking-[0.4em] text-[var(--color-text-muted)]/60 mb-2">CREATED BY</p>
          <p className="tracking-[0.3em] text-[var(--color-accent)] font-medium text-lg">MIRA TUKU</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">NPO法人ミラツク — 多様な人々が集い、未来をつくる</p>
        </div>
      </section>
    </div>
  );
}
