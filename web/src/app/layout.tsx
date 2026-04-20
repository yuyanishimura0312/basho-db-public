import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSerif = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const notoSans = Noto_Sans_JP({
  variable: "--font-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
        {/* Header — minimal, neutral */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/92 backdrop-blur-xl border-b border-[var(--color-border-light)]">
          <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center gap-0.5 group-hover:gap-1 transition-all duration-300">
                <div className="w-[7px] h-3 rounded-full bg-miratuku-terracotta rotate-[-20deg]" />
                <div className="w-[7px] h-3 rounded-full bg-miratuku-golden-orange rotate-[10deg]" />
                <div className="w-[7px] h-3 rounded-full bg-miratuku-amber-brown rotate-[30deg]" />
              </div>
              <span className="font-serif text-[1.15rem] tracking-[0.12em] text-[var(--color-accent)]">Basho</span>
              <span className="text-[0.65rem] text-[var(--color-text-muted)] tracking-[0.25em]">場所の記憶</span>
            </Link>
            <div className="flex items-center gap-8 text-[0.8rem] tracking-wider text-[var(--color-text-muted)]">
              <div className="group relative">
                <span className="hover:text-[var(--color-accent)] transition-colors cursor-pointer">エリア別</span>
                <div className="absolute top-full left-0 mt-2 bg-white border border-[var(--color-border)] shadow-xl py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link href="/facilities" className="block px-5 py-2.5 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-accent)] transition-colors">関東</Link>
                  <Link href="/kansai" className="block px-5 py-2.5 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-accent)] transition-colors">関西</Link>
                  <Link href="/chubu" className="block px-5 py-2.5 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-accent)] transition-colors">中部・北陸</Link>
                  <Link href="/hokkaido-tohoku" className="block px-5 py-2.5 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-accent)] transition-colors">北海道・東北</Link>
                  <Link href="/chugoku-shikoku" className="block px-5 py-2.5 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-accent)] transition-colors">中国・四国</Link>
                  <Link href="/kyushu" className="block px-5 py-2.5 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-accent)] transition-colors">九州・沖縄</Link>
                </div>
              </div>
              <Link href="/stays" className="hover:text-[var(--color-accent)] transition-colors">宿</Link>
              <Link href="/guide" className="hover:text-[var(--color-accent)] transition-colors">使い方</Link>
              <Link href="/about" className="hover:text-[var(--color-accent)] transition-colors">場所性とは</Link>
            </div>
          </nav>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer — deep teal */}
        <footer className="bg-[var(--color-accent)] text-white/80 mt-auto">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14">
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-2.5 rounded-full bg-miratuku-golden-orange rotate-[-20deg]" />
                    <div className="w-1.5 h-2.5 rounded-full bg-miratuku-pale-peach rotate-[10deg]" />
                    <div className="w-1.5 h-2.5 rounded-full bg-miratuku-rose-peach rotate-[30deg]" />
                  </div>
                  <span className="font-serif text-[1.2rem] text-white tracking-[0.15em]">Basho</span>
                </div>
                <p className="text-[0.8rem] leading-relaxed text-white/45">
                  歴史と文化に根ざした「場所性」で<br />日本の食と宿を再発見する
                </p>
              </div>
              <div>
                <p className="text-white/80 text-[0.82rem] font-medium mb-4">場所性の8軸</p>
                <ul className="text-[0.72rem] text-white/40 space-y-1.5 list-none">
                  <li>歴史的継続性 / 文化的営みの深度</li>
                  <li>地域的固有性 / 物質的文化財性</li>
                  <li>場所の内側性 / 文化的複雑性</li>
                  <li>ナラティブ性 / 本物性</li>
                </ul>
              </div>
              <div>
                <p className="text-white/80 text-[0.82rem] font-medium mb-4">運営</p>
                <p className="text-[0.72rem] leading-relaxed text-white/45">
                  NPO法人ミラツク（MIRA TUKU）<br />多様な人々が集い、未来をつくる
                </p>
                <p className="text-[0.72rem] text-white/25 mt-3">
                  西田幾多郎の場所論 / ブルデューの文化資本論 /<br />現象学的場所論を理論的基盤とする
                </p>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-white/8 flex items-center justify-between text-[0.65rem] text-white/20">
              <span>Basho — 場所の記憶 &copy; 2026 NPO法人ミラツク</span>
              <span className="tracking-[0.3em]">MIRA TUKU</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
