"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";

interface Facility {
  id: string;
  name: string;
  image_url: string | null;
  total_score: number | null;
  prefecture: string | null;
  city: string | null;
  founded_year: number | null;
  overview: string | null;
}

interface TodaysPickProps {
  candidates: Facility[];
  accentBg: string;
}

export default function TodaysPick({ candidates, accentBg }: TodaysPickProps) {
  // Start with first 3 as visible, rest as backup pool
  const [visible, setVisible] = useState<Facility[]>(candidates.slice(0, 3));
  const [pool] = useState<Facility[]>(candidates.slice(3));
  const [poolIdx, setPoolIdx] = useState(0);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const handleImageError = useCallback(
    (failedId: string) => {
      setHidden((prev) => {
        if (prev.has(failedId)) return prev;
        const next = new Set(prev);
        next.add(failedId);
        return next;
      });

      // Replace the failed item with next from pool
      setVisible((prev) => {
        const idx = prev.findIndex((f) => f.id === failedId);
        if (idx === -1) return prev;

        // Find next valid replacement from pool
        let replacement: Facility | null = null;
        let nextPoolIdx = poolIdx;
        while (nextPoolIdx < pool.length) {
          const candidate = pool[nextPoolIdx];
          nextPoolIdx++;
          if (!hidden.has(candidate.id)) {
            replacement = candidate;
            break;
          }
        }
        setPoolIdx(nextPoolIdx);

        if (!replacement) {
          // No more candidates — remove the slot
          return prev.filter((f) => f.id !== failedId);
        }

        const updated = [...prev];
        updated[idx] = replacement;
        return updated;
      });
    },
    [pool, poolIdx, hidden],
  );

  if (visible.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-[0.78rem] tracking-[0.3em] uppercase text-[var(--color-accent)] mb-2 font-medium">
            Today&apos;s Pick
          </p>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.15]">
            今日のおすすめ
          </h2>
        </div>
        <Link
          href="/facilities"
          className="text-sm text-[var(--color-accent)] hover:underline underline-offset-4"
        >
          すべて見る
        </Link>
      </div>
      <div
        className={`grid grid-cols-1 ${visible.length >= 3 ? "md:grid-cols-[1.2fr_0.8fr_1fr]" : visible.length === 2 ? "md:grid-cols-2" : ""} gap-3`}
      >
        {visible.map((f, idx) => (
          <PickCard
            key={f.id}
            facility={f}
            featured={idx === 0 && visible.length >= 3}
            accentBg={accentBg}
            onImageError={handleImageError}
          />
        ))}
      </div>
    </section>
  );
}

function PickCard({
  facility: f,
  featured,
  accentBg,
  onImageError,
}: {
  facility: Facility;
  featured: boolean;
  accentBg: string;
  onImageError: (id: string) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const handleError = () => {
    setImgFailed(true);
    onImageError(f.id);
  };

  // Don't render if image failed (parent will replace)
  if (imgFailed) return null;

  return (
    <Link href={`/facilities/${f.id}`} className="group block overflow-hidden">
      <div
        className={`${featured ? "aspect-[3/4]" : "aspect-[4/3]"} relative overflow-hidden bg-[var(--color-bg-alt)]`}
      >
        {f.image_url ? (
          <Image
            src={f.image_url}
            alt={f.name}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
            sizes="33vw"
            unoptimized
            onError={handleError}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: accentBg }}
          >
            <span className="font-serif text-6xl text-white/8">
              {f.name.charAt(0)}
            </span>
          </div>
        )}
        {f.total_score != null && (
          <span className="absolute top-3 right-3 text-xs px-3 py-1 bg-white/93 text-[var(--color-accent)] font-medium">
            {f.total_score.toFixed(1)}
          </span>
        )}
      </div>
      <div className="pt-4 pb-2">
        <h3 className="font-serif text-[1.15rem] font-medium group-hover:text-[var(--color-accent)] transition-colors mb-1 leading-snug">
          {f.name}
        </h3>
        <p className="text-[0.78rem] text-[var(--color-text-muted)] mb-2">
          {f.prefecture} {f.city}
          {f.founded_year ? ` / ${f.founded_year}年創業` : ""}
        </p>
        <p className="text-[0.9rem] text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
          {f.overview}
        </p>
      </div>
    </Link>
  );
}
