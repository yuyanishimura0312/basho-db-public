import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSerif = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSans = Noto_Sans_JP({
  variable: "--font-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Basho — 場所の記憶 | 歴史と文化で出会う、日本の食と宿",
  description:
    "トレンドや口コミではなく、歴史と文化に根ざした「場所性」で日本の飲食店・宿泊施設を発見する。NPO法人ミラツクが運営。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSerif.variable} ${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-sm border-b border-[var(--color-border)]">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              {/* Miratuku-inspired seed mark */}
              <div className="flex items-center gap-0.5">
                <div className="w-2 h-3 rounded-full bg-miratuku-terracotta rotate-[-20deg]" />
                <div className="w-2 h-3 rounded-full bg-miratuku-golden-orange rotate-[10deg]" />
                <div className="w-2 h-3 rounded-full bg-miratuku-amber-brown rotate-[30deg]" />
              </div>
              <div>
                <span className="font-serif text-xl tracking-wider text-[var(--color-accent)]">
                  Basho
                </span>
                <span className="text-xs text-[var(--color-text-muted)] ml-2 tracking-widest">
                  場所の記憶
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-8 text-sm tracking-wide">
              <Link
                href="/facilities"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                施設を探す
              </Link>
              <Link
                href="/dashboard"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                ダッシュボード
              </Link>
              <Link
                href="/about"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                場所性とは
              </Link>
            </div>
          </nav>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-[var(--color-accent)] text-white/80 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-2.5 rounded-full bg-miratuku-golden-orange rotate-[-20deg]" />
                    <div className="w-1.5 h-2.5 rounded-full bg-miratuku-pale-peach rotate-[10deg]" />
                    <div className="w-1.5 h-2.5 rounded-full bg-miratuku-rose-peach rotate-[30deg]" />
                  </div>
                  <span className="font-serif text-lg text-white tracking-widest">
                    Basho
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">
                  歴史と文化に根ざした「場所性」で
                  <br />
                  日本の食と宿を再発見する
                </p>
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-3">場所性の8軸</p>
                <ul className="text-xs text-white/50 space-y-1">
                  <li>歴史的継続性 / 文化的営みの深度</li>
                  <li>地域的固有性 / 物質的文化財性</li>
                  <li>場所の内側性 / 文化的複雑性</li>
                  <li>ナラティブ性 / 本物性</li>
                </ul>
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-3">運営</p>
                <p className="text-xs leading-relaxed text-white/60">
                  NPO法人ミラツク（MIRA TUKU）
                  <br />
                  多様な人々が集い、未来をつくる
                </p>
                <p className="text-xs text-white/40 mt-3">
                  西田幾多郎の場所論 / ブルデューの文化資本論 /
                  <br />
                  現象学的場所論を理論的基盤とする
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-white/30">
              <span>Basho — 場所の記憶 &copy; 2026 NPO法人ミラツク</span>
              <span className="tracking-widest text-white/20">MIRA TUKU</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
