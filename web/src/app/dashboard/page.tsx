import Link from "next/link";
import facilities from "@/data/facilities.json";
import stats from "@/data/stats.json";

const categoryLabels: Record<string, string> = {
  restaurant_japanese: "和食",
  restaurant_western: "洋食",
  restaurant_cafe: "カフェ・喫茶",
  hotel: "ホテル",
  ryokan: "旅館",
  minshuku: "民宿",
};

// Compute era distribution
function getEraDistribution() {
  const eras: Record<string, number> = {};
  for (const f of facilities) {
    if (!f.founded_year) continue;
    const y = f.founded_year;
    let era: string;
    if (y < 1600) era = "〜1599";
    else if (y < 1700) era = "1600年代";
    else if (y < 1800) era = "1700年代";
    else if (y < 1870) era = "1800〜1869";
    else if (y < 1900) era = "明治 (1870〜1899)";
    else if (y < 1926) era = "大正 (1900〜1925)";
    else if (y < 1945) era = "昭和前期 (1926〜1944)";
    else if (y < 1989) era = "昭和後期 (1945〜1988)";
    else era = "平成以降 (1989〜)";
    eras[era] = (eras[era] || 0) + 1;
  }
  return eras;
}

// Top oldest facilities
function getOldest(n: number) {
  return [...facilities]
    .filter((f) => f.founded_year)
    .sort((a, b) => (a.founded_year ?? 9999) - (b.founded_year ?? 9999))
    .slice(0, n);
}

export default function DashboardPage() {
  const eraDistribution = getEraDistribution();
  const oldest = getOldest(10);
  const maxCatCount = Math.max(...Object.values(stats.by_category));
  const maxPrefCount = Math.max(...Object.values(stats.by_prefecture));
  const maxEraCount = Math.max(...Object.values(eraDistribution));

  // Subcategory stats
  const subcatEntries = Object.entries(stats.by_subcategory)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 15);
  const maxSubCount = Math.max(...subcatEntries.map(([, c]) => c as number));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] text-stone-400 mb-2 uppercase">Dashboard</p>
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
          データベース概況
        </h1>
        <p className="text-stone-500">Basho DB の全データを可視化</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "総施設数", value: stats.total, unit: "件" },
          { label: "都道府県", value: Object.keys(stats.by_prefecture).length, unit: "地域" },
          { label: "カテゴリ", value: Object.keys(stats.by_category).length, unit: "種別" },
          { label: "最古", value: stats.oldest_year, unit: "年創業" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-stone-200 rounded-lg p-6">
            <p className="text-xs text-stone-400 tracking-wider mb-1">{kpi.label}</p>
            <p className="font-serif text-3xl text-stone-900">{kpi.value}</p>
            <p className="text-xs text-stone-400 mt-1">{kpi.unit}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Category Distribution */}
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-serif text-xl text-stone-900 mb-6">カテゴリ分布</h2>
          <div className="space-y-3">
            {Object.entries(stats.by_category).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-stone-600 w-28 shrink-0">
                  {categoryLabels[cat] || cat}
                </span>
                <div className="flex-1 h-6 bg-stone-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-stone-700 rounded flex items-center justify-end pr-2"
                    style={{ width: `${((count as number) / maxCatCount) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{count as number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prefecture Distribution */}
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-serif text-xl text-stone-900 mb-6">地域分布</h2>
          <div className="space-y-2">
            {Object.entries(stats.by_prefecture).map(([pref, count]) => (
              <div key={pref} className="flex items-center gap-3">
                <span className="text-sm text-stone-600 w-20 shrink-0">{pref}</span>
                <div className="flex-1 h-5 bg-stone-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-stone-500 rounded flex items-center justify-end pr-2"
                    style={{ width: `${((count as number) / maxPrefCount) * 100}%` }}
                  >
                    <span className="text-xs text-white">{count as number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Era Timeline */}
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-serif text-xl text-stone-900 mb-6">時代別分布</h2>
          <div className="space-y-3">
            {Object.entries(eraDistribution).map(([era, count]) => (
              <div key={era} className="flex items-center gap-3">
                <span className="text-xs text-stone-600 w-40 shrink-0">{era}</span>
                <div className="flex-1 h-5 bg-stone-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-amber-700 rounded flex items-center justify-end pr-2"
                    style={{ width: `${(count / maxEraCount) * 100}%` }}
                  >
                    <span className="text-xs text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subcategory Distribution */}
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-serif text-xl text-stone-900 mb-6">サブカテゴリ (Top 15)</h2>
          <div className="space-y-2">
            {subcatEntries.map(([sub, count]) => (
              <div key={sub} className="flex items-center gap-3">
                <span className="text-xs text-stone-600 w-28 shrink-0">{sub}</span>
                <div className="flex-1 h-4 bg-stone-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-stone-400 rounded"
                    style={{ width: `${((count as number) / maxSubCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-stone-400 w-6 text-right">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Oldest Facilities */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 mb-12">
        <h2 className="font-serif text-xl text-stone-900 mb-6">最古の施設 Top 10</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left py-2 text-stone-400 font-normal">創業年</th>
                <th className="text-left py-2 text-stone-400 font-normal">施設名</th>
                <th className="text-left py-2 text-stone-400 font-normal">カテゴリ</th>
                <th className="text-left py-2 text-stone-400 font-normal">所在地</th>
                <th className="text-right py-2 text-stone-400 font-normal">歴史</th>
              </tr>
            </thead>
            <tbody>
              {oldest.map((f) => (
                <tr key={f.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="py-3 font-serif text-stone-900">{f.founded_year}</td>
                  <td className="py-3">
                    <Link
                      href={`/facilities/${f.id}`}
                      className="text-stone-900 hover:text-stone-600"
                    >
                      {f.name}
                    </Link>
                  </td>
                  <td className="py-3 text-stone-500">
                    {categoryLabels[f.category] || f.category}
                  </td>
                  <td className="py-3 text-stone-500">{f.prefecture}</td>
                  <td className="py-3 text-right text-stone-400">
                    {f.founded_year
                      ? `${new Date().getFullYear() - f.founded_year}年`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8 Axes Framework summary */}
      <div className="bg-stone-900 text-stone-100 rounded-lg p-8">
        <h2 className="font-serif text-xl mb-6">場所性の8軸評価フレームワーク</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "歴史的継続性", "文化的営みの深度", "地域的固有性", "物質的文化財性",
            "場所の内側性", "文化的複雑性", "ナラティブ性", "本物性",
          ].map((axis, i) => (
            <div key={i} className="border border-stone-700 rounded p-4">
              <p className="font-serif text-2xl text-stone-600 mb-1">{i + 1}</p>
              <p className="text-sm text-stone-300">{axis}</p>
            </div>
          ))}
        </div>
        <p className="text-stone-500 text-sm mt-6">
          評価済み施設: {stats.with_score}件 / {stats.total}件
          （Phase 2で場所性エージェントによるバッチ評価を実行予定）
        </p>
      </div>
    </div>
  );
}
