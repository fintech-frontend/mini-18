import { HeroBanner } from "@/components/sections/HeroBanner";
import { FeaturesBar } from "@/components/sections/FeaturesBar";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { PromoBanners } from "@/components/sections/PromoBanners";
import { HitsSection } from "@/components/sections/HitsSection";
import { BrandsCarousel } from "@/components/sections/BrandsCarousel";
import { BestOffers } from "@/components/sections/BestOffers";
import { AboutStore } from "@/components/sections/AboutStore";
import { LatestNews } from "@/components/sections/LatestNews";
import { mockProducts } from "@/data/products";
import { styles } from "@/styles/index.styles";

export default function Home() {
  const hitsProducts = mockProducts.filter((p) => p.section === "hits");
  const bestProducts = mockProducts.filter((p) => p.section === "best");

  return (
    <>
      <div className={`${styles.container} mt-10`}>
        <HeroBanner />
        <FeaturesBar />
        <CategoryGrid />
        <PromoBanners />
        <HitsSection products={hitsProducts} />
        <BrandsCarousel />
        <BestOffers products={bestProducts} />
        <AboutStore />
        <LatestNews />
      </div>
    </>
  );
}