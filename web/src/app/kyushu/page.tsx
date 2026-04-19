import RegionalPage from "@/components/RegionalPage";

export default function KyushuPage() {
  return (
    <RegionalPage
      regionName="九州・沖縄"
      regionNameEn="Kyushu & Okinawa"
      description="博多の屋台文化、長崎の南蛮料理、熊本の馬刺し、鹿児島の黒豚。出島から始まったヨーロッパとの文化交流。南国の食の豊穣。"
      prefectures={["福岡県", "佐賀県", "長崎県", "大分県", "熊本県", "宮崎県", "鹿児島県", "沖縄県"]}
      gradientFrom="#C2785A"
      gradientTo="#8B4A32"
    />
  );
}
