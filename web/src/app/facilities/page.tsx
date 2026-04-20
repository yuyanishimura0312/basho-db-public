import Link from "next/link";
import Image from "next/image";
import facilities from "@/data/facilities.json";

const categoryLabels: Record<string, string> = {
  restaurant_japanese: "和食",
  restaurant_western: "洋食",
  restaurant_cafe: "カフェ・喫茶",
  hotel: "ホテル",
  ryokan: "旅館",
  minshuku: "民宿",
};

export default function FacilitiesPage() {
  const kantoPrefs = ["東京都","神奈川県","千葉県","埼玉県","群馬県","栃木県","茨城県"];

  // Filter to Kanto dining only
  const dining = facilities.filter(
    (f) => !["hotel", "ryokan", "minshuku"].includes(f.category)
      && kantoPrefs.includes(f.prefecture || "")
  );

  const sorted = [...dining].sort((a, b) => {
    if (a.total_score != null && b.total_score != null)
      return (b.total_score ?? 0) - (a.total_score ?? 0);
    if (a.total_score != null) return -1;
    if (b.total_score != null) return 1;
    if (a.founded_year && b.founded_year) return a.founded_year - b.founded_year;
    if (a.founded_year) return -1;
    if (b.founded_year) return 1;
    return 0;
  });

  const categories = Array.from(new Set(dining.map((f) => f.category)));
  const prefectures = Array.from(new Set(dining.map((f) => f.prefecture).filter(Boolean)));

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(170deg, #1a5c6e 0%, #144a59 40%, #0d3a47 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="text-[0.7rem] tracking-[0.3em] text-white/50 mb-3 uppercase font-medium">Kanto Dining</p>
          <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.15] text-white mb-4">関東の食</h1>
          <p className="text-white/60 text-[0.9rem]">{sorted.length}件の飲食店</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Filter Tags */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="text-[0.78rem] text-[var(--color-text-light)] py-1">カテゴリ:</span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-[0.78rem] px-3 py-1 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-colors cursor-pointer"
            >
              {categoryLabels[cat] || cat}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-[0.78rem] text-[var(--color-text-light)] py-1">地域:</span>
          {prefectures.sort().map((pref) => (
            <span
              key={pref}
              className="text-[0.78rem] px-3 py-1 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-colors cursor-pointer"
            >
              {pref}
            </span>
          ))}
        </div>
      </div>

      {/* Facility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {sorted.map((f) => (
          <Link key={f.id} href={`/facilities/${f.id}`} className="group block">
            {/* Image */}
            <div className="aspect-[4/3] bg-[var(--color-bg-alt)] mb-4 overflow-hidden relative">
              {f.image_url && (
                <Image
                  src={f.image_url}
                  alt={f.name}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span className="text-[0.78rem] px-2 py-1 bg-[var(--color-accent)]/80 text-white">
                  {categoryLabels[f.category] || f.category}
                </span>
              </div>
              {/* Score badge */}
              {f.total_score != null && (
                <div className="absolute top-3 right-3">
                  <span className="text-[0.78rem] px-2 py-0.5 bg-white/90 text-[var(--color-accent)] font-medium">
                    {(f.total_score as unknown as number).toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                {f.name}
              </h3>
              {f.founded_year && (
                <span className="text-[0.78rem] text-[var(--color-text-light)] whitespace-nowrap mt-1">
                  {f.founded_year}年
                </span>
              )}
            </div>
            <p className="text-[0.78rem] text-[var(--color-text-light)] mb-2">
              {f.prefecture} {f.city}
            </p>
            <p className="text-[0.9rem] text-[var(--color-text-muted)] leading-relaxed line-clamp-2">{f.overview}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(f.features as string[]).slice(0, 4).map((tag, i) => (
                <span key={i} className="text-[0.78rem] px-2 py-0.5 bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
}
