import RegionalPage from "@/components/RegionalPage";

export default function ChugokuShikokuPage() {
  return (
    <RegionalPage
      regionName="中国・四国"
      regionNameEn="Chugoku & Shikoku"
      description="瀬戸内海の恵みと山陰の滋味。出雲そば、讃岐うどん、広島お好み焼き、鰹のたたき。倉敷の洋館文化から土佐の豪放な食まで。"
      prefectures={["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"]}
      gradientFrom="#7B8B6F"
      gradientTo="#4A5A3E"
    />
  );
}
