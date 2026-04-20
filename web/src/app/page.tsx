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

const currentYear = new Date().getFullYear();
const eras = [
  { name: "〜江戸", range: "1603年以前", min: 0, max: 1603, color: "#5a5a5a" },
  { name: "江戸", range: "1603-1867", min: 1603, max: 1868, color: "#1a5c6e" },
  { name: "明治", range: "1868-1912", min: 1868, max: 1912, color: "#2a7a90" },
  { name: "大正", range: "1912-1926", min: 1912, max: 1926, color: "#1d764a" },
  { name: "昭和前期", range: "1926-1945", min: 1926, max: 1945, color: "#4db07e" },
  { name: "昭和後期", range: "1945-1989", min: 1945, max: 1989, color: "#DC8766" },
  { name: "平成以降", range: "1989-", min: 1989, max: currentYear + 1, color: "#B07256" },
];

for (const era of eras) {
  (era as Record<string, unknown>).count = dining.filter(
    (f) => f.founded_year && f.founded_year >= era.min && f.founded_year < era.max
  ).length;
}

export default function Home() {
  return (
    <div>
      {/* HERO — full screen, deep teal gradient (NOT warm) */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-end"
        style={{ background: "linear-gradient(170deg, #1a5c6e 0%, #144a59 40%, #0d3a47 70%, #0a2e38 100%)" }}>
        <div className="absolute inset-0 overflow-hidden">
          {seedColors.slice(0, 6).map((color, i) => (
            <div
              key={i}
              className="absolute rounded-full seed-float"
              style={{
                backgroundColor: color,
                width: `${50 + i * 14}px`,
                height: `${70 + i * 18}px`,
                top: `${10 + (i * 37) % 80}%`,
                left: `${5 + (i * 43) % 90}%`,
                opacity: 0.06,
                ["--seed-rotate" as string]: `${i * 30 - 60}deg`,
                ["--seed-duration" as string]: `${6 + i}s`,
                ["--seed-delay" as string]: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 md:pb-32 w-full">
          <p className="text-[0.7rem] tracking-[0.5em] text-white/30 mb-8 uppercase">
            BASHO &mdash; PLACENESS
          </p>
          <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[1.15] tracking-wide text-white font-bold mb-8">
            場所の記憶を<br />辿り、まだ見ぬ<br />食に出会う
          </h1>
          <p className="text-white/50 text-lg max-w-[500px] leading-[1.9] mb-12 font-light">
            トレンドでも口コミでもない。歴史と文化が堆積した「場所性」という新しい軸で、あなたにふさわしい一皿を見つける。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/facilities" className="inline-block bg-white text-[var(--color-accent)] px-10 py-4 text-sm tracking-[0.2em] hover:bg-white/90 transition-colors">
              食を探す
            </Link>
            <Link href="/stays" className="inline-block border-[1.5px] border-white/30 text-white px-10 py-4 text-sm tracking-[0.2em] hover:border-white/60 hover:bg-white/5 transition-all">
              宿を探す
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/20 text-[0.6rem] tracking-[0.3em] uppercase">
          <span>Scroll</span>
          <div className="w-px h-10 bg-white/15" style={{ animation: "scrollPulse 2s infinite" }} />
        </div>
      </section>

      {/* MARQUEE — green ticker */}
      <div className="bg-[var(--color-green)] text-white overflow-hidden whitespace-nowrap py-4">
        <div className="inline-flex" style={{ animation: "marqueeScroll 25s linear infinite" }}>
          {[
            "創業100年を超える老舗 87店舗",
            "登録有形文化財の建物で味わう至福",
            "江戸から令和まで、食の場所性を辿る",
            "トレンドではなく、歴史と文化で選ぶ",
          ].flatMap((text, i) => [
            <span key={`t${i}`} className="font-serif text-[1.1rem] tracking-wider px-10">{text}</span>,
            <span key={`d${i}`} className="inline-block w-1.5 h-1.5 rounded-full bg-white/25 mx-2 align-middle" />,
          ]).concat([
            "創業100年を超える老舗 87店舗",
            "登録有形文化財の建物で味わう至福",
            "江戸から令和まで、食の場所性を辿る",
            "トレンドではなく、歴史と文化で選ぶ",
          ].flatMap((text, i) => [
            <span key={`t2${i}`} className="font-serif text-[1.1rem] tracking-wider px-10">{text}</span>,
            <span key={`d2${i}`} className="inline-block w-1.5 h-1.5 rounded-full bg-white/25 mx-2 align-middle" />,
          ]))}
        </div>
      </div>

      {/* STATS — bold numbers */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: diningStats.total, unit: "件", label: "飲食店" },
            { val: diningStats.prefectures, unit: "", label: "都道府県" },
            { val: "8", unit: "軸", label: "評価フレームワーク" },
            { val: stats.oldest_year || "—", unit: "年", label: "最古の創業" },
          ].map((s, i) => (
            <div key={i}>
              <p className="font-serif text-4xl md:text-5xl font-bold text-[var(--color-accent)] leading-none">
                {s.val}
                {s.unit && <span className="text-sm text-[var(--color-text-muted)] ml-1 font-normal">{s.unit}</span>}
              </p>
              <p className="text-[0.7rem] text-[var(--color-text-light)] mt-2 tracking-[0.2em]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TODAY'S PICK — asymmetric grid */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-accent)] mb-2 font-medium">Today&apos;s Pick</p>
            <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold">今日のおすすめ</h2>
          </div>
          <Link href="/facilities" className="text-sm text-[var(--color-accent)] hover:underline underline-offset-4">すべて見る</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_1fr] gap-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {recommended.map((f: any, idx: number) => (
            <Link key={f.id} href={`/facilities/${f.id}`}
              className="group block border border-[var(--color-border)] overflow-hidden bg-white hover:border-[var(--color-accent)]/40 transition-colors">
              <div className={`${idx === 0 ? "aspect-[3/4]" : "aspect-[4/3]"} relative overflow-hidden`}>
                {f.image_url ? (
                  <Image src={f.image_url} alt={f.name} fill className="object-cover group-hover:scale-[1.04] transition-transform duration-700" sizes="33vw" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${seedColors[idx % 12]}30, ${seedColors[(idx+5) % 12]}30)` }}>
                    <span className="font-serif text-5xl" style={{ color: `${seedColors[(idx+2) % 12]}40` }}>{f.name.charAt(0)}</span>
                  </div>
                )}
                {f.total_score != null && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs px-3 py-1 bg-white/93 text-[var(--color-accent)] font-medium">{(f.total_score as number).toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-serif text-base group-hover:text-[var(--color-accent)] transition-colors mb-1">{f.name}</h3>
                <p className="text-[0.7rem] text-[var(--color-text-muted)] mb-2">{f.prefecture} {f.city}{f.founded_year ? ` / ${f.founded_year}年創業` : ""}</p>
                <p className="text-[0.82rem] text-[var(--color-text-muted)] leading-relaxed line-clamp-2">{f.overview}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* QUIZ — Visit Finland inspired */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
        <div className="bg-[var(--color-bg-alt)] border border-[var(--color-border)] grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 md:gap-12 p-8 md:p-12">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-accent)] leading-snug mb-3">あなたにぴったりの<br />場所は？</h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">気分やシーンに合わせて、場所性の観点からおすすめの店舗をご提案します。</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: "🏛", text: "歴史ある空間で\n特別なひとときを" },
              { emoji: "📖", text: "文豪が愛した\n静かな隠れ家を" },
              { emoji: "🏮", text: "下町情緒あふれる\n庶民の味を" },
              { emoji: "✨", text: "モダンな空間で\n新しい食体験を" },
            ].map((opt, i) => (
              <Link key={i} href="/facilities"
                className="border border-[var(--color-border)] bg-white p-5 text-sm leading-relaxed hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-all group">
                <span className="text-2xl block mb-2 group-hover:scale-110 inline-block transition-transform">{opt.emoji}</span>
                <span className="whitespace-pre-line">{opt.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AREA — green-pale bg */}
      <section className="bg-[var(--color-bg-alt)] border-t border-b border-[var(--color-border-light)] py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <p className="text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-accent)] mb-2 font-medium">Area</p>
            <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold">関東エリア別</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {kantoAreas.filter(a => a.count > 0).map((area, i) => (
              <Link key={i} href={`/facilities?area=${encodeURIComponent(area.name)}`}
                className="group border border-[var(--color-border)] bg-white p-5 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all">
                <p className="font-serif text-sm group-hover:text-[var(--color-accent)] transition-colors">{area.name}</p>
                <p className="text-[0.7rem] text-[var(--color-text-light)] mt-1">{area.count}件</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { name: "関西", href: "/kansai" },
              { name: "中部・北陸", href: "/chubu" },
              { name: "北海道・東北", href: "/hokkaido-tohoku" },
              { name: "中国・四国", href: "/chugoku-shikoku" },
              { name: "九州・沖縄", href: "/kyushu" },
            ].map((r) => (
              <Link key={r.name} href={r.href}
                className="text-sm px-6 py-2.5 border-[1.5px] border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-all">
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* THEMES */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="mb-10">
          <p className="text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-green)] mb-2 font-medium">Theme</p>
          <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold">テーマで探す</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {themes.map((theme, i) => (
            <Link key={i} href={`/facilities?theme=${theme.filter}`}
              className="group border border-[var(--color-border)] bg-white p-6 hover:border-[var(--color-accent)]/40 transition-colors">
              <span className="text-[2.5rem] block mb-4 group-hover:scale-[1.2] group-hover:rotate-[-5deg] transition-transform inline-block">
                {theme.emoji}
              </span>
              <h3 className="font-serif text-sm group-hover:text-[var(--color-accent)] transition-colors mb-1">{theme.name}</h3>
              <p className="text-[0.72rem] text-[var(--color-text-muted)] leading-relaxed">{theme.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ERA TIMELINE */}
      <section className="bg-white border-t border-b border-[var(--color-border-light)] py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <p className="text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-accent)] mb-2 font-medium">Era</p>
            <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold">時代で探す</h2>
          </div>
          <div className="relative flex pt-8">
            <div className="hidden md:block absolute top-[calc(2rem+16px)] left-0 right-0 h-0.5 bg-[var(--color-border)]" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 w-full">
              {eras.map((era, i) => (
                <Link key={i} href={`/facilities?era=${era.min}-${era.max}`}
                  className="group relative z-10 bg-white border border-[var(--color-border)] px-3 py-5 text-center hover:border-[var(--color-accent)]/40 transition-colors">
                  <div className="w-3.5 h-3.5 rounded-full mx-auto mb-3 transition-transform group-hover:scale-[2]"
                    style={{ backgroundColor: era.color, boxShadow: `0 0 0 4px var(--color-bg)` }} />
                  <p className="font-serif text-sm group-hover:text-[var(--color-accent)] transition-colors">{era.name}</p>
                  <p className="text-[0.7rem] text-[var(--color-text-light)] mt-1">{(era as Record<string, unknown>).count as number}件</p>
                  <p className="text-[0.6rem] text-[var(--color-text-light)]/50 mt-0.5">{era.range}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Search */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="mb-6">
          <p className="text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-accent)] mb-2 font-medium">AI Search</p>
          <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold">場所性で探す</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-3">シーンや気分を入力すると、AIが場所性の観点からおすすめを提案します</p>
        </div>
        <div className="bg-white border border-[var(--color-border)] p-8">
          <div className="flex gap-3">
            <input type="text"
              placeholder="例: 「明治の洋館で特別な記念日ディナー」「文豪が愛した静かな純喫茶」"
              className="flex-1 px-5 py-4 border border-[var(--color-border)] text-sm placeholder:text-[var(--color-text-light)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              disabled />
            <button className="px-8 py-4 bg-[var(--color-accent)] text-white text-sm opacity-40 cursor-not-allowed" disabled>
              検索
            </button>
          </div>
          <p className="text-xs text-[var(--color-text-light)]/40 mt-4">Coming Soon — AI検索機能は現在開発中です</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
        <div className="mb-10">
          <p className="text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-green)] mb-2 font-medium">Feature</p>
          <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold">特集</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a href="/report-bashosei.html" className="group block border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-accent)]/30 transition-colors">
            <div className="aspect-[2/1] relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a5c6e, #0d3a47)" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <p className="text-[0.6rem] tracking-[0.4em] text-white/35 mb-3">REPORT</p>
                  <p className="font-serif text-xl md:text-2xl font-bold leading-relaxed">場所性（Basho-sei）<br />とは何か</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white">
              <p className="text-[0.82rem] text-[var(--color-text-muted)] leading-relaxed">
                西田幾多郎の場所論、ブルデューの文化資本、現象学的場所論を統合した「場所性」の理論的基盤と8軸評価フレームワーク。
              </p>
            </div>
          </a>
          <Link href="/about" className="group block border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-accent)]/30 transition-colors">
            <div className="aspect-[2/1] relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1d764a, #144a30)" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <p className="text-[0.6rem] tracking-[0.4em] text-white/35 mb-3">ABOUT</p>
                  <p className="font-serif text-xl md:text-2xl font-bold leading-relaxed">場所性の<br />8軸フレームワーク</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white">
              <p className="text-[0.82rem] text-[var(--color-text-muted)] leading-relaxed">
                歴史的継続性、文化的営みの深度、地域的固有性、本物性 — 飲食店・宿泊施設の場所性を評価する8つの軸。
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 8 AXES — deep teal */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #1a5c6e 0%, #0d3a47 50%, #0a2e38 100%)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <p className="text-[0.65rem] tracking-[0.35em] uppercase text-white/30 mb-2 font-medium">Framework</p>
            <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-white">場所性の8軸</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "歴史的継続性", "文化的営みの深度", "地域的固有性", "物質的文化財性",
              "場所の内側性", "文化的複雑性", "ナラティブ性", "本物性",
            ].map((axis, i) => (
              <div key={i} className="bg-white/6 border border-white/10 p-6 hover:bg-white/12 transition-colors">
                <p className="font-serif text-[2.5rem] font-bold text-white/10 leading-none mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-sm text-white/85 font-medium">{axis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="mb-10">
          <p className="text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-accent)] mb-2 font-medium">Categories</p>
          <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold">カテゴリ別に探す</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {sortedCategories.map(([cat, count], idx) => {
            const gradients = [
              "linear-gradient(135deg, #1a5c6e, #0d3a47)",
              "linear-gradient(135deg, #1d764a, #144a30)",
              "linear-gradient(135deg, #B07256, #7A4033)",
            ];
            return (
              <Link key={cat} href={`/facilities?category=${cat}`}
                className="group relative aspect-[3/2] overflow-hidden flex items-end">
                <div className="absolute inset-0 group-hover:scale-[1.06] transition-transform duration-700"
                  style={{ background: gradients[idx % 3] }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)" }} />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[8rem] font-bold text-white/[0.03] group-hover:text-white/[0.07] transition-colors">
                  {(categoryLabels[cat] || cat).charAt(0)}
                </span>
                <div className="relative p-5 w-full">
                  <p className="font-serif text-xl text-white font-bold">{categoryLabels[cat] || cat}</p>
                  <p className="text-white/50 text-sm">{count}件</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="text-center py-20 bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-bg-alt)]">
        <h2 className="font-serif text-2xl font-bold mb-4">場所の記憶から、あなたの一皿を見つける</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">670以上の飲食店・宿泊施設を、歴史と文化の視点で探索できます</p>
        <Link href="/facilities" className="inline-block bg-[var(--color-accent)] text-white px-12 py-4 text-sm tracking-[0.2em] hover:bg-[var(--color-accent-dark)] transition-colors">
          すべての飲食店を見る
        </Link>
      </section>

      {/* MIRA TUKU Credit */}
      <section className="bg-white border-t border-[var(--color-border-light)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14 text-center">
          <p className="text-[0.65rem] tracking-[0.4em] text-[var(--color-text-light)] mb-3">CREATED BY</p>
          <p className="tracking-[0.3em] text-[var(--color-accent)] font-medium text-lg">MIRA TUKU</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-3">NPO法人ミラツク — 多様な人々が集い、未来をつくる</p>
        </div>
      </section>
    </div>
  );
}
