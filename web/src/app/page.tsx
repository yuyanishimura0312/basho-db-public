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

// Themes with playful icons
const themes = [
  { name: "老舗 (100年以上)", emoji: "🏯", desc: "創業100年を超える歴史を持つ名店", filter: "centenarian" },
  { name: "発祥の店", emoji: "⭐", desc: "「元祖」「発祥」の称号を持つ店", filter: "origin" },
  { name: "文化財の建物", emoji: "🏛", desc: "登録有形文化財・重要文化財の建物", filter: "heritage" },
  { name: "文豪ゆかりの店", emoji: "📖", desc: "文学者や著名人が愛した場所", filter: "literary" },
  { name: "フレンチ & イタリアン", emoji: "🍷", desc: "ヨーロッパの食文化を伝える名店", filter: "european" },
  { name: "純喫茶 & カフェ", emoji: "☕", desc: "珈琲文化と場所性が交差する空間", filter: "kissaten" },
  { name: "パン & 洋菓子", emoji: "🥐", desc: "ベーカリー・パティスリーの名店", filter: "bakery" },
  { name: "バー & 酒文化", emoji: "🥃", desc: "カクテル、ワイン、日本酒の場所性", filter: "bar" },
];

// Eras
const currentYear = new Date().getFullYear();
const eras = [
  { name: "〜江戸", range: "1603年以前", min: 0, max: 1603, color: "#966D5E" },
  { name: "江戸", range: "1603-1867", min: 1603, max: 1868, color: "#B07256" },
  { name: "明治", range: "1868-1912", min: 1868, max: 1912, color: "#DC8766" },
  { name: "大正", range: "1912-1926", min: 1912, max: 1926, color: "#F0A671" },
  { name: "昭和前期", range: "1926-1945", min: 1926, max: 1945, color: "#CEA26F" },
  { name: "昭和後期", range: "1945-1989", min: 1945, max: 1989, color: "#7a9e8e" },
  { name: "平成以降", range: "1989-", min: 1989, max: currentYear + 1, color: "#a8c5b6" },
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
      {/* Hero — lighter, warmer, with floating seeds */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F7BEA2] via-[#F0A671] to-[#DC8766]">
        <div className="absolute inset-0 overflow-hidden">
          {seedColors.map((color, i) => (
            <div
              key={i}
              className="absolute rounded-full seed-float"
              style={{
                backgroundColor: color,
                width: `${30 + i * 12}px`,
                height: `${45 + i * 16}px`,
                top: `${8 + (i * 37) % 80}%`,
                left: `${5 + (i * 43) % 90}%`,
                opacity: 0.15,
                ["--seed-rotate" as string]: `${i * 30 - 60}deg`,
                ["--seed-duration" as string]: `${3 + i * 0.5}s`,
                ["--seed-delay" as string]: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <p className="text-sm tracking-[0.4em] text-white/50 mb-5">
            BASHO — PLACENESS
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-wide text-white mb-6">
            場所の記憶を辿り、
            <br />
            まだ見ぬ食に出会う
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
            トレンドでも口コミでもない。歴史と文化が堆積した「場所性」という
            新しい軸で、あなたにふさわしいレストラン・カフェ・バーを見つける。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/facilities" className="inline-block bg-white text-[var(--color-accent)] px-8 py-4 text-sm font-medium tracking-wider hover:bg-white/90 hover:shadow-lg transition-all rounded-xl">
              食を探す
            </Link>
            <Link href="/stays" className="inline-block border-2 border-white/50 text-white px-8 py-4 text-sm tracking-wider hover:border-white hover:bg-white/10 transition-all rounded-xl">
              宿を探す
            </Link>
          </div>
        </div>
        {/* Wave divider */}
        <div className="hero-wave">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill="var(--color-bg)" />
          </svg>
        </div>
      </section>

      {/* Stats — floating card style */}
      <section className="relative -mt-4 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)]/50 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { val: diningStats.total, label: "飲食店", suffix: "件" },
                { val: diningStats.prefectures, label: "都道府県", suffix: "" },
                { val: "8", label: "評価軸", suffix: "軸" },
                { val: stats.oldest_year || "—", label: "最古の創業年", suffix: "年" },
              ].map((s, i) => (
                <div key={i} className="group">
                  <p className="text-3xl md:text-4xl font-serif text-[var(--color-accent)] group-hover:text-miratuku-terracotta transition-colors">
                    {s.val}
                    {s.suffix && <span className="text-sm text-[var(--color-text-muted)] ml-0.5">{s.suffix}</span>}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2 tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Random Recommendations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-[var(--color-sage)] mb-2 uppercase font-medium">Today&apos;s Pick</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">今日のおすすめ</h2>
          </div>
          <Link href="/facilities" className="text-sm text-[var(--color-accent)] hover:underline underline-offset-4">
            すべて見る
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {recommended.map((f: any, idx: number) => (
            <Link key={f.id} href={`/facilities/${f.id}`} className="group block bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden card-hover">
              <div className="aspect-[4/3] relative overflow-hidden">
                {f.image_url && (
                  <Image src={f.image_url} alt={f.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" unoptimized />
                )}
                {!f.image_url && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${seedColors[idx % 12]}40, ${seedColors[(idx+5) % 12]}40)` }}>
                    <span className="font-serif text-5xl" style={{ color: `${seedColors[(idx+2) % 12]}60` }}>{f.name.charAt(0)}</span>
                  </div>
                )}
                {f.total_score != null && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs px-3 py-1 bg-white/95 text-[var(--color-accent)] rounded-full font-medium shadow-sm">{(f.total_score as number).toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-2">{f.name}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                  <span className="inline-block w-1 h-1 rounded-full bg-miratuku-terracotta" />
                  {f.prefecture} {f.city}{f.founded_year ? ` / ${f.founded_year}年創業` : ""}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3">{f.overview}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Kanto Sub-areas — with sage accent */}
      <section className="section-sage py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] text-[var(--color-sage)] mb-2 uppercase font-medium">Area</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">関東エリア別</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {kantoAreas.filter(a => a.count > 0).map((area, i) => (
              <Link key={i} href={`/facilities?area=${encodeURIComponent(area.name)}`}
                className="group bg-white border border-[var(--color-border)] rounded-xl p-5 card-hover">
                <p className="font-serif text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">{area.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">{area.count}件</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { name: "関西", href: "/kansai" },
              { name: "中部・北陸", href: "/chubu" },
              { name: "北海道・東北", href: "/hokkaido-tohoku" },
              { name: "中国・四国", href: "/chugoku-shikoku" },
              { name: "九州・沖縄", href: "/kyushu" },
            ].map((r) => (
              <Link key={r.name} href={r.href}
                className="text-sm px-5 py-2.5 bg-white border border-[var(--color-sage)]/30 text-[var(--color-sage)] rounded-full hover:bg-[var(--color-sage)] hover:text-white hover:border-[var(--color-sage)] transition-all">
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Themes — emoji cards with warm bg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase font-medium">Theme</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">テーマで探す</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {themes.map((theme, i) => (
            <Link key={i} href={`/facilities?theme=${theme.filter}`}
              className="group bg-white border border-[var(--color-border)] rounded-2xl p-6 card-hover">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                {theme.emoji}
              </div>
              <h3 className="font-serif text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-2">{theme.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{theme.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Eras — timeline style */}
      <section className="section-warm py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase font-medium">Era</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">時代で探す</h2>
          </div>
          {/* Timeline bar */}
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--color-border)] -translate-y-1/2 rounded-full" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
              {eras.map((era, i) => (
                <Link key={i} href={`/facilities?era=${era.min}-${era.max}`}
                  className="group relative bg-white border border-[var(--color-border)] rounded-xl px-4 py-5 text-center card-hover">
                  <div className="w-4 h-4 rounded-full mx-auto mb-3 transition-transform group-hover:scale-150"
                    style={{ backgroundColor: era.color }} />
                  <p className="font-serif text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">{era.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{(era as Record<string, unknown>).count as number}件</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]/60 mt-0.5">{era.range}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Search & Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* AI Search */}
        <div className="mb-16">
          <div className="mb-6">
            <p className="text-xs tracking-[0.3em] text-[var(--color-sage)] mb-2 uppercase font-medium">AI Search</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">場所性で探す</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-3">シーンや気分を入力すると、AIが場所性の観点からおすすめを提案します</p>
          </div>
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="例: 「明治の洋館で特別な記念日ディナー」「文豪が愛した静かな純喫茶」"
                className="flex-1 px-5 py-4 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/40 focus:outline-none focus:border-[var(--color-sage)] focus:ring-2 focus:ring-[var(--color-sage)]/20 transition-all"
                disabled
              />
              <button
                className="px-8 py-4 bg-[var(--color-sage)] text-white text-sm rounded-xl opacity-50 cursor-not-allowed"
                disabled
              >
                検索
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]/50 mt-4">Coming Soon — AI検索機能は現在開発中です</p>
          </div>
        </div>

        {/* Feature Reports */}
        <div>
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase font-medium">Feature</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">特集</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a href="/report-bashosei.html" className="group block bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden card-hover">
              <div className="aspect-[2/1] relative overflow-hidden">
                <div className="absolute inset-0 miratuku-gradient" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <p className="text-xs tracking-widest text-white/50 mb-3">REPORT</p>
                    <p className="font-serif text-xl md:text-2xl">場所性（Basho-sei）<br />とは何か</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  西田幾多郎の場所論、ブルデューの文化資本、現象学的場所論を統合した
                  「場所性」の理論的基盤と8軸評価フレームワークについての詳細レポート。
                </p>
              </div>
            </a>
            <Link href="/about" className="group block bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden card-hover">
              <div className="aspect-[2/1] relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #7a9e8e 0%, #5a7e6e 100%)" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <p className="text-xs tracking-widest text-white/50 mb-3">ABOUT</p>
                    <p className="font-serif text-xl md:text-2xl">場所性の<br />8軸フレームワーク</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  歴史的継続性、文化的営みの深度、地域的固有性、本物性 —
                  飲食店・宿泊施設の場所性を評価する8つの軸の解説。
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/facilities" className="inline-block bg-[var(--color-accent)] text-white px-10 py-4 text-sm tracking-wider hover:bg-[var(--color-accent-light)] transition-colors rounded-xl">
            すべての飲食店を見る
          </Link>
        </div>
      </section>

      {/* 8 Axes (compact) — sage accent */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: "linear-gradient(135deg, #7a9e8e 0%, #5a7e6e 50%, #4a6e5e 100%)" }}>
        <div className="absolute inset-0 overflow-hidden">
          {[0,1,2,3,4].map((i) => (
            <div key={i} className="absolute rounded-full opacity-10 seed-float" style={{
              backgroundColor: "#fff",
              width: `${60 + i * 20}px`,
              height: `${80 + i * 25}px`,
              top: `${10 + i * 18}%`,
              left: `${10 + i * 20}%`,
              ["--seed-rotate" as string]: `${i * 45}deg`,
              ["--seed-duration" as string]: `${5 + i}s`,
              ["--seed-delay" as string]: `${i * 0.5}s`,
            }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] text-white/40 mb-2 uppercase font-medium">Framework</p>
            <h2 className="font-serif text-2xl md:text-3xl text-white">場所性の8軸</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "歴史的継続性", "文化的営みの深度", "地域的固有性", "物質的文化財性",
              "場所の内側性", "文化的複雑性", "ナラティブ性", "本物性",
            ].map((axis, i) => (
              <div key={i} className="bg-white/12 backdrop-blur-sm border border-white/15 rounded-xl p-5 hover:bg-white/20 transition-colors">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mb-3 bg-white/20 text-white">
                  {i + 1}
                </div>
                <p className="text-sm text-white/90 font-medium">{axis}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/about" className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
              場所性について詳しく見る
            </Link>
          </div>
        </div>
      </section>

      {/* Categories — wider cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase font-medium">Categories</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)]">カテゴリ別に探す</h2>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {sortedCategories.map(([cat, count], idx) => (
            <Link key={cat} href={`/facilities?category=${cat}`}
              className="group relative aspect-[3/2] overflow-hidden flex items-end rounded-2xl card-hover"
              style={{ background: `linear-gradient(135deg, ${seedColors[idx * 2]} 0%, ${seedColors[(idx * 2 + 3) % 12]} 100%)` }}>
              <div className="absolute inset-0 bg-[var(--color-accent)]/30 group-hover:bg-[var(--color-accent)]/45 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-7xl text-white/8 group-hover:text-white/15 transition-colors duration-500">{(categoryLabels[cat] || cat).charAt(0)}</span>
              </div>
              <div className="relative p-5 w-full">
                <p className="font-serif text-lg text-white">{categoryLabels[cat] || cat}</p>
                <p className="text-white/60 text-sm">{count}件</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MIRA TUKU Credit */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-xs tracking-[0.4em] text-[var(--color-text-muted)]/50 mb-3">CREATED BY</p>
          <p className="tracking-[0.3em] text-[var(--color-accent)] font-medium text-lg">MIRA TUKU</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-3">NPO法人ミラツク — 多様な人々が集い、未来をつくる</p>
        </div>
      </section>
    </div>
  );
}
