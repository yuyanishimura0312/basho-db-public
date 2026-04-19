import RegionalPage from "@/components/RegionalPage";

export default function HokkaidoTohokuPage() {
  return (
    <RegionalPage
      regionName="北海道・東北"
      regionNameEn="Hokkaido & Tohoku"
      description="北の大地の海鮮文化、みちのくの郷土料理。ジンギスカン、海鮮丼、わんこそば、牛タン、きりたんぽ。厳しい自然と向き合う食の知恵が生んだ場所性。"
      prefectures={["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"]}
      gradientFrom="#5A7B8C"
      gradientTo="#3D5A6E"
    />
  );
}
