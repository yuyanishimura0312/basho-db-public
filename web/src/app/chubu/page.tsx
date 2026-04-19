import RegionalPage from "@/components/RegionalPage";

export default function ChubuPage() {
  return (
    <RegionalPage
      regionName="中部・北陸"
      regionNameEn="Chubu & Hokuriku"
      description="加賀百万石の料亭文化、信州そばの清冽、名古屋めしの独創性。金沢の懐石から飛騨牛、越前がに、ひつまぶしまで。日本海と山々が育んだ食の多様性。"
      prefectures={["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"]}
      gradientFrom="#8B7355"
      gradientTo="#5C4A32"
    />
  );
}
