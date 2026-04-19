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
  const sorted = [...facilities].sort((a, b) => {
    if (a.founded_year && b.founded_year) return a.founded_year - b.founded_year;
    if (a.founded_year) return -1;
    if (b.founded_year) return 1;
    return 0;
  });

  const categories = Array.from(new Set(facilities.map((f) => f.category)));
  const prefectures = Array.from(new Set(facilities.map((f) => f.prefecture).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] text-stone-400 mb-2 uppercase">All Facilities</p>
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">施設一覧</h1>
        <p className="text-stone-500">{facilities.length}件の施設</p>
      </div>

      {/* Filter Tags */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-stone-400 py-1">カテゴリ:</span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-xs px-3 py-1 border border-stone-300 text-stone-600 rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors cursor-pointer"
            >
              {categoryLabels[cat] || cat}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-stone-400 py-1">地域:</span>
          {prefectures.sort().map((pref) => (
            <span
              key={pref}
              className="text-xs px-3 py-1 border border-stone-300 text-stone-600 rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors cursor-pointer"
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
            <div className="aspect-[4/3] bg-miratuku-pale-peach/20 mb-4 overflow-hidden relative rounded-lg">
              {f.image_url && (
                <Image
                  src={f.image_url}
                  alt={f.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span className="text-xs px-2 py-1 bg-[var(--color-accent)]/80 text-white rounded">
                  {categoryLabels[f.category] || f.category}
                </span>
              </div>
              {/* Score badge */}
              {f.total_score != null && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs px-2 py-0.5 bg-white/90 text-[var(--color-accent)] rounded font-medium">
                    {(f.total_score as unknown as number).toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-serif text-lg text-stone-900 group-hover:text-stone-600 transition-colors">
                {f.name}
              </h3>
              {f.founded_year && (
                <span className="text-xs text-stone-400 whitespace-nowrap mt-1">
                  {f.founded_year}年
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mb-2">
              {f.prefecture} {f.city}
            </p>
            <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">{f.overview}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(f.features as string[]).slice(0, 4).map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
