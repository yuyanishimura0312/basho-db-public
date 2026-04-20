import Link from "next/link";
import Image from "next/image";
import facilities from "@/data/facilities.json";

const seedColors = [
  "#F0A671", "#F2C792", "#F1C189", "#CEA26F", "#F8CDAC", "#F0BE83",
  "#EFC4A4", "#F7BEA2", "#DC8766", "#B07256", "#966D5E", "#7A4033",
];

const subcategoryLabels: Record<string, string> = {
  classic_hotel: "クラシックホテル",
  onsen_ryokan: "温泉旅館",
  traditional_ryokan: "老舗旅館",
  resort_ryokan: "リゾート旅館",
  luxury: "ラグジュアリーホテル",
  resort: "リゾートホテル",
  kominka: "古民家宿",
};

// Filter stays only
const stays = facilities
  .filter((f) => ["hotel", "ryokan", "minshuku"].includes(f.category))
  .sort((a, b) => {
    if (a.total_score != null && b.total_score != null)
      return (b.total_score ?? 0) - (a.total_score ?? 0);
    if (a.total_score != null) return -1;
    if (b.total_score != null) return 1;
    return (a.founded_year ?? 9999) - (b.founded_year ?? 9999);
  });

const ryokans = stays.filter((f) => f.category === "ryokan");
const hotels = stays.filter((f) => f.category === "hotel");
const others = stays.filter((f) => f.category === "minshuku");

export default function StaysPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden text-white py-16 md:py-20" style={{ background: "linear-gradient(170deg, #1a5c6e 0%, #144a59 40%, #0d3a47 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[0.7rem] tracking-[0.3em] text-white/50 mb-3 uppercase font-medium">Stays</p>
          <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.15] mb-4">
            場所性で選ぶ、日本の宿
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            歴史と文化が堆積した旅館・ホテル。その場所でしか味わえない
            「包まれる」体験を、場所性スコアで見つける。
          </p>
          <div className="flex gap-6 mt-8 text-center">
            <div>
              <p className="text-5xl font-black font-serif">{stays.length}</p>
              <p className="text-[0.78rem] text-white/40 mt-1">宿泊施設</p>
            </div>
            <div>
              <p className="text-5xl font-black font-serif">{ryokans.length}</p>
              <p className="text-[0.78rem] text-white/40 mt-1">旅館</p>
            </div>
            <div>
              <p className="text-5xl font-black font-serif">{hotels.length}</p>
              <p className="text-[0.78rem] text-white/40 mt-1">ホテル</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ryokan Section */}
      {ryokans.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <p className="text-[0.7rem] tracking-[0.3em] text-[var(--color-accent)] mb-2 uppercase font-medium">Ryokan</p>
            <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.15] text-[var(--color-text)]">旅館</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ryokans.map((f, idx) => (
              <FacilityCard key={f.id} facility={f} idx={idx} />
            ))}
          </div>
        </section>
      )}

      {/* Hotel Section */}
      {hotels.length > 0 && (
        <section className="bg-white border-t border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-10">
              <p className="text-[0.7rem] tracking-[0.3em] text-[var(--color-accent)] mb-2 uppercase font-medium">Hotels</p>
              <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.15] text-[var(--color-text)]">ホテル</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((f, idx) => (
                <FacilityCard key={f.id} facility={f} idx={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Minshuku */}
      {others.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <p className="text-[0.7rem] tracking-[0.3em] text-[var(--color-accent)] mb-2 uppercase font-medium">Others</p>
            <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.15] text-[var(--color-text)]">民宿・その他</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {others.map((f, idx) => (
              <FacilityCard key={f.id} facility={f} idx={idx} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FacilityCard({ facility: f, idx }: { facility: any; idx: number }) {
  return (
    <Link href={`/facilities/${f.id}`} className="group block">
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
        {!f.image_url && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${seedColors[idx % 12]}30, ${seedColors[(idx + 5) % 12]}30)` }}>
            <span className="font-serif text-5xl" style={{ color: `${seedColors[(idx + 2) % 12]}40` }}>
              {f.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            {f.total_score != null && (
              <span className="text-[0.78rem] px-2 py-0.5 bg-white/90 text-[var(--color-accent)] font-medium">
                {(f.total_score as number).toFixed(1)}
              </span>
            )}
            <span className="text-[0.78rem] px-2 py-0.5 bg-[var(--color-accent)]/60 text-white">
              {subcategoryLabels[f.subcategory] || f.subcategory}
            </span>
          </div>
        </div>
      </div>
      <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-1">
        {f.name}
      </h3>
      <p className="text-[0.78rem] text-[var(--color-text-muted)] mb-2">
        {f.prefecture} {f.city}
        {f.founded_year ? ` / ${f.founded_year}年創業` : ""}
      </p>
      <p className="text-[0.9rem] text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
        {f.overview}
      </p>
    </Link>
  );
}
