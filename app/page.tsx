import { HeroBanner } from "@/components/sections/HeroBanner";
import { FeaturesBar } from "@/components/sections/FeaturesBar";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { PromoBanners } from "@/components/sections/PromoBanners";
import { HitsSection } from "@/components/sections/HitsSection";
import { mockProducts } from "@/data/products";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeaturesBar />
      <CategoryGrid />
      <PromoBanners />
      <HitsSection products={mockProducts} />
    </>
  );
}