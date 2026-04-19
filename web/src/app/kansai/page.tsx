import Link from "next/link";
import Image from "next/image";
import facilities from "@/data/facilities.json";

const seedColors = [
  "#F0A671", "#F2C792", "#F1C189", "#CEA26F", "#F8CDAC", "#F0BE83",
  "#EFC4A4", "#F7BEA2", "#DC8766", "#B07256", "#966D5E", "#7A4033",
];

const categoryLabels: Record<string, string> = {
  restaurant_japanese: "和食",
  restaurant_western: "洋食",
  restaurant_cafe: "カフェ・喫茶",
};

const kansaiPrefs = ["京都府", "大阪府", "兵庫県", "奈良県", "滋賀県", "和歌山県"];

// Filter to Kansai dining
const dining = facilities
  .filter(
    (f) =>
      !["hotel", "ryokan", "minshuku"].includes(f.category) &&
      kansaiPrefs.includes(f.prefecture || "")
  )
  .sort((a, b) => {
    if (a.total_score != null && b.total_score != null)
      return (b.total_score ?? 0) - (a.total_score ?? 0);
    if (a.total_score != null) return -1;
    if (b.total_score != null) return 1;
    return (a.founded_year ?? 9999) - (b.founded_year ?? 9999);
  });

// Group by prefecture
const byPref: Record<string, typeof dining> = {};
for (const f of dining) {
  const pref = f.prefecture || "その他";
  if (!byPref[pref]) byPref[pref] = [];
  byPref[pref].push(f);
}

export default function KansaiPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #966D5E 0%, #7A4033 40%, #B07256 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="text-xs tracking-[0.4em] text-white/50 mb-3 uppercase">
            Kansai Dining
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-white mb-4">
            関西の食
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            千年の都・京都の料亭文化、天下の台所・大阪の食い倒れ文化、
            異国情緒の神戸洋食文化。関西の場所性を味わう。
          </p>
          <div className="flex gap-6 mt-8 text-center">
            <div>
              <p className="text-3xl font-serif text-white">{dining.length}</p>
              <p className="text-xs text-white/40 mt-1">飲食店</p>
            </div>
            {Object.entries(byPref).map(([pref, list]) => (
              <div key={pref}>
                <p className="text-3xl font-serif text-white">{list.length}</p>
                <p className="text-xs text-white/40 mt-1">{pref}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      {dining.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="font-serif text-2xl text-[var(--color-text-muted)] mb-4">
            準備中
          </p>
          <p className="text-[var(--color-text-muted)]">
            関西の飲食店データは現在追加中です。近日公開予定。
          </p>
        </section>
      ) : (
        <>
          {Object.entries(byPref).map(([pref, list]) => (
            <section
              key={pref}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <div className="mb-8">
                <p className="text-xs tracking-[0.3em] text-miratuku-terracotta mb-2 uppercase">
                  {pref}
                </p>
                <h2 className="font-serif text-2xl text-[var(--color-text)]">
                  {pref}の食
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {list.map((f, i) => (
                  <Link
                    key={f.id}
                    href={`/facilities/${f.id}`}
                    className="group block"
                  >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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
                      {!f.image_url && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${seedColors[i % 12]}30, ${seedColors[(i + 5) % 12]}30)`,
                          }}
                        >
                          <span
                            className="font-serif text-5xl"
                            style={{ color: `${seedColors[(i + 2) % 12]}40` }}
                          >
                            {f.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 left-3">
                        <span className="text-xs px-2 py-1 bg-[var(--color-accent)]/80 text-white rounded">
                          {categoryLabels[f.category] || f.category}
                        </span>
                      </div>
                      {f.total_score != null && (
                        <div className="absolute top-3 right-3">
                          <span className="text-xs px-2 py-0.5 bg-white/90 text-[var(--color-accent)] rounded font-medium">
                            {(f.total_score as unknown as number).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif text-lg text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                        {f.name}
                      </h3>
                      {f.founded_year && (
                        <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap mt-1">
                          {f.founded_year}年
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">
                      {f.prefecture} {f.city}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                      {f.overview}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
