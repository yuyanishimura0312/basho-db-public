"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";

const seedColors = [
  "#F0A671", "#F2C792", "#F1C189", "#CEA26F", "#F8CDAC", "#F0BE83",
  "#EFC4A4", "#F7BEA2", "#DC8766", "#B07256", "#966D5E", "#7A4033",
];

interface Facility {
  id: string;
  name: string;
  image_url: string | null;
  total_score: number | null;
  prefecture: string | null;
  city: string | null;
  overview: string | null;
}

interface RegionalPickProps {
  candidates: Facility[];
  regionName: string;
  regionNameEn: string;
}

export default function RegionalPick({
  candidates,
  regionName,
  regionNameEn,
}: RegionalPickProps) {
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

      setVisible((prev) => {
        const idx = prev.findIndex((f) => f.id === failedId);
        if (idx === -1) return prev;

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <p className="text-[0.7rem] tracking-[0.3em] text-[var(--color-accent)] mb-2 uppercase font-medium">
          {regionNameEn} Pick
        </p>
        <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.15] text-[var(--color-text)]">
          {regionName}のおすすめ
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visible.map((f, idx) => (
          <RegionalPickCard
            key={f.id}
            facility={f}
            idx={idx}
            onImageError={handleImageError}
          />
        ))}
      </div>
    </section>
  );
}

function RegionalPickCard({
  facility: f,
  idx,
  onImageError,
}: {
  facility: Facility;
  idx: number;
  onImageError: (id: string) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const handleError = () => {
    setImgFailed(true);
    onImageError(f.id);
  };

  if (imgFailed) return null;

  return (
    <Link
      href={`/facilities/${f.id}`}
      className="group block bg-white border border-[var(--color-border)] overflow-hidden transition-colors"
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        {f.image_url ? (
          <Image
            src={f.image_url}
            alt={f.name}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
            sizes="33vw"
            unoptimized
            onError={handleError}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${seedColors[idx % 12]}40, ${seedColors[(idx + 5) % 12]}40)`,
            }}
          >
            <span
              className="font-serif text-4xl"
              style={{ color: `${seedColors[(idx + 2) % 12]}50` }}
            >
              {f.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-1">
          {f.name}
        </h3>
        <p className="text-[0.78rem] text-[var(--color-text-muted)] mb-2">
          {f.prefecture} {f.city}
        </p>
        <p className="text-[0.9rem] text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
          {f.overview}
        </p>
      </div>
    </Link>
  );
}
