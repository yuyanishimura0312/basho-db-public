import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import facilities from "@/data/facilities.json";

const seedColors = [
  "#F0A671", "#F2C792", "#F1C189", "#CEA26F", "#F8CDAC", "#F0BE83",
  "#EFC4A4", "#F7BEA2", "#DC8766", "#B07256", "#966D5E", "#7A4033",
];

const categoryLabels: Record<string, string> = {
  restaurant_japanese: "和食",
  restaurant_western: "洋食",
  restaurant_cafe: "カフェ・喫茶",
  hotel: "ホテル",
  ryokan: "旅館",
  minshuku: "民宿",
};

const axisLabels = [
  { key: "historical_continuity", name: "歴史的継続性", color: "#F0A671" },
  { key: "cultural_practice_depth", name: "文化的営みの深度", color: "#F2C792" },
  { key: "regional_rootedness", name: "地域的固有性", color: "#CEA26F" },
  { key: "material_heritage", name: "物質的文化財性", color: "#DC8766" },
  { key: "insideness", name: "場所の内側性", color: "#B07256" },
  { key: "cultural_complexity", name: "文化的複雑性", color: "#966D5E" },
  { key: "narrative_quality", name: "ナラティブ性", color: "#F0BE83" },
  { key: "authenticity", name: "本物性", color: "#7A4033" },
];

type Facility = (typeof facilities)[number];

export function generateStaticParams() {
  return facilities.map((f) => ({ id: f.id }));
}

export default async function FacilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facility = facilities.find((f) => f.id === id);
  if (!facility) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const f = facility as any;
  const hasScore = f.total_score != null;
  const isEnriched = !!f.detailed_description;
  const idx = facilities.indexOf(facility);

  const related = facilities
    .filter((r) => r.category === f.category && r.id !== f.id && r.total_score != null)
    .sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0))
    .slice(0, 3);
  const relatedFallback = related.length >= 3 ? related : facilities
    .filter((r) => r.category === f.category && r.id !== f.id)
    .slice(0, 3);

  const signatureDishes = (f.signature_dishes as string[]) || [];
  const imageUrl = f.image_url as string | null;

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[45vh] md:min-h-[55vh] flex items-end"
        style={{
          background: `linear-gradient(135deg, ${seedColors[idx % 12]} 0%, ${seedColors[(idx + 5) % 12]} 50%, #7A4033 100%)`,
        }}
      >
        {/* Background image if available */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={f.name}
            fill
            className="object-cover opacity-40"
            sizes="100vw"
            unoptimized
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-[10rem] md:text-[14rem] text-white/5 select-none">
            {f.name.charAt(0)}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/90 via-[var(--color-accent)]/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs px-3 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm">
              {categoryLabels[f.category] || f.category}
            </span>
            {f.subcategory && (
              <span className="text-xs px-3 py-1 bg-white/10 text-white/80 rounded-full">
                {f.subcategory}
              </span>
            )}
            {f.cultural_designation && (
              <span className="text-xs px-3 py-1 bg-miratuku-golden-orange text-white rounded-full">
                文化財
              </span>
            )}
            {hasScore && (
              <span className="text-xs px-3 py-1.5 bg-white text-[var(--color-accent)] rounded-full font-bold">
                {(f.total_score as unknown as number).toFixed(1)}
              </span>
            )}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-3">
            {f.name}
          </h1>
          <p className="text-white/70 text-lg">
            {f.prefecture} {f.city}
            {f.founded_year ? ` / ${f.founded_year}年創業` : ""}
            {f.founded_year
              ? ` (${new Date().getFullYear() - f.founded_year}年の歴史)`
              : ""}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main - 2/3 */}
          <div className="lg:col-span-2 space-y-10">
            {/* Detailed Description or Overview */}
            <section>
              <h2 className="font-serif text-2xl text-[var(--color-text)] mb-4">概要</h2>
              {isEnriched ? (
                <p className="text-[var(--color-text-muted)] leading-relaxed text-lg">
                  {f.detailed_description as string}
                </p>
              ) : (
                <p className="text-[var(--color-text-muted)] leading-relaxed text-lg">
                  {f.overview}
                </p>
              )}
            </section>

            {/* Basho Narrative - Story */}
            {isEnriched && f.basho_narrative && (
              <section className="bg-[var(--color-accent)]/5 border-l-4 border-[var(--color-accent)] rounded-r-lg p-6">
                <h2 className="font-serif text-xl text-[var(--color-accent)] mb-3">場所の物語</h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed italic">
                  {f.basho_narrative as string}
                </p>
              </section>
            )}

            {/* Signature Dishes / Cuisine */}
            {signatureDishes.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl text-[var(--color-text)] mb-4">看板メニュー</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {signatureDishes.map((dish, i) => (
                    <div
                      key={i}
                      className="bg-white border border-[var(--color-border)] rounded-lg p-5 text-center"
                    >
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${seedColors[i % 12]}25`, color: seedColors[(i + 4) % 12] }}
                      >
                        {i + 1}
                      </div>
                      <p className="font-serif text-sm text-[var(--color-text)]">{dish}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* History */}
            {isEnriched && f.history_text && (
              <section>
                <h2 className="font-serif text-2xl text-[var(--color-text)] mb-4">歴史</h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  {f.history_text as string}
                </p>
              </section>
            )}

            {/* Cultural Context */}
            {isEnriched && f.cultural_context && (
              <section>
                <h2 className="font-serif text-2xl text-[var(--color-text)] mb-4">文化的文脈</h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  {f.cultural_context as string}
                </p>
              </section>
            )}

            {/* Atmosphere */}
            {isEnriched && f.atmosphere && (
              <section className="miratuku-gradient-light rounded-lg p-6">
                <h2 className="font-serif text-xl text-[var(--color-accent)] mb-3">空間の雰囲気</h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  {f.atmosphere as string}
                </p>
              </section>
            )}

            {/* Features */}
            <section>
              <h2 className="font-serif text-2xl text-[var(--color-text)] mb-4">特徴</h2>
              <div className="flex flex-wrap gap-2">
                {(f.features as string[]).map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full text-sm"
                    style={{
                      backgroundColor: `${seedColors[i % 12]}20`,
                      color: seedColors[(i + 6) % 12],
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Basho Score */}
            {hasScore && (
              <section>
                <h2 className="font-serif text-2xl text-[var(--color-text)] mb-6">場所性スコア</h2>
                <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-serif text-5xl text-[var(--color-accent)]">
                      {(f.total_score as unknown as number).toFixed(1)}
                    </span>
                    <span className="text-[var(--color-text-muted)] text-sm">/ 5.0</span>
                  </div>
                  <div className="space-y-3">
                    {axisLabels.map((axis) => {
                      const score = (f as Record<string, unknown>)[axis.key] as number | null;
                      const val = score ?? 0;
                      return (
                        <div key={axis.key} className="flex items-center gap-3">
                          <span className="text-sm text-[var(--color-text-muted)] w-36 shrink-0">
                            {axis.name}
                          </span>
                          <div className="flex-1 h-3 bg-miratuku-pale-peach/30 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${(val / 5) * 100}%`,
                                backgroundColor: axis.color,
                              }}
                            />
                          </div>
                          <span className="text-sm text-[var(--color-text-muted)] w-8 text-right font-medium">
                            {val > 0 ? val.toFixed(1) : "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Reservation CTA */}
            <div className="bg-[var(--color-accent)] text-white rounded-lg p-6">
              <h3 className="font-serif text-lg mb-3">予約・訪問</h3>
              {isEnriched && f.reservation_note && (
                <p className="text-white/70 text-sm mb-4">
                  {f.reservation_note as string}
                </p>
              )}
              {f.url && (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 bg-white text-[var(--color-accent)] text-sm font-medium rounded-lg hover:bg-white/90 transition-colors mb-2"
                >
                  公式サイトで予約
                </a>
              )}
              {f.url && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.address || f.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 border border-white/30 text-white text-sm rounded-lg hover:bg-white/10 transition-colors"
                >
                  Google Mapで開く
                </a>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 space-y-4">
              <h3 className="font-serif text-lg text-[var(--color-text)]">基本情報</h3>
              <dl className="space-y-3 text-sm">
                {f.address && (
                  <div>
                    <dt className="text-[var(--color-text-muted)]/60 text-xs">住所</dt>
                    <dd className="text-[var(--color-text)]">{f.address}</dd>
                  </div>
                )}
                {isEnriched && f.access && (
                  <div>
                    <dt className="text-[var(--color-text-muted)]/60 text-xs">アクセス</dt>
                    <dd className="text-[var(--color-text)]">{f.access as string}</dd>
                  </div>
                )}
                {isEnriched && f.hours && (
                  <div>
                    <dt className="text-[var(--color-text-muted)]/60 text-xs">営業時間</dt>
                    <dd className="text-[var(--color-text)]">{f.hours as string}</dd>
                  </div>
                )}
                {isEnriched && f.closed_days && (
                  <div>
                    <dt className="text-[var(--color-text-muted)]/60 text-xs">定休日</dt>
                    <dd className="text-[var(--color-text)]">{f.closed_days as string}</dd>
                  </div>
                )}
                {isEnriched && f.price_range && (
                  <div>
                    <dt className="text-[var(--color-text-muted)]/60 text-xs">価格帯</dt>
                    <dd className="text-[var(--color-text)] font-medium">{f.price_range as string}</dd>
                  </div>
                )}
                {f.founded_year && (
                  <div>
                    <dt className="text-[var(--color-text-muted)]/60 text-xs">創業</dt>
                    <dd className="text-[var(--color-text)]">
                      {f.founded_year}年
                      <span className="text-[var(--color-text-muted)] ml-1">
                        ({new Date().getFullYear() - f.founded_year}年)
                      </span>
                    </dd>
                  </div>
                )}
                {f.cultural_designation && (
                  <div>
                    <dt className="text-[var(--color-text-muted)]/60 text-xs">文化財指定</dt>
                    <dd className="text-miratuku-terracotta font-medium">{f.cultural_designation}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Category badge */}
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <h3 className="font-serif text-lg text-[var(--color-text)] mb-2">カテゴリ</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {categoryLabels[f.category] || f.category}
                {f.subcategory ? ` / ${f.subcategory}` : ""}
              </p>
            </div>
          </aside>
        </div>

        {/* Related */}
        {relatedFallback.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--color-border)]">
            <h2 className="font-serif text-2xl text-[var(--color-text)] mb-8">同じカテゴリの施設</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedFallback.map((r, ri) => (
                <Link key={r.id} href={`/facilities/${r.id}`} className="group block">
                  <div
                    className="aspect-[4/3] mb-3 overflow-hidden relative rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${seedColors[(ri * 3) % 12]}40, ${seedColors[(ri * 3 + 4) % 12]}40)`,
                    }}
                  >
                    {r.image_url && (
                      <Image
                        src={r.image_url as string}
                        alt={r.name}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        sizes="33vw"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-5xl" style={{ color: `${seedColors[(ri * 2 + 1) % 12]}30` }}>
                        {r.name.charAt(0)}
                      </span>
                    </div>
                    {r.total_score != null && (
                      <div className="absolute top-3 right-3">
                        <span className="text-xs px-2 py-0.5 bg-white/90 text-[var(--color-accent)] rounded font-medium">
                          {(r.total_score as unknown as number).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-lg text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                    {r.name}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {r.prefecture} {r.city}
                    {r.founded_year ? ` / ${r.founded_year}年` : ""}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
