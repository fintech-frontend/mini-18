"use client";

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
import { useGetProductsQuery } from "@/lib/api/apiSlice";
import { mapApiProductToProduct } from "@/lib/adapters/products";

export default function Home() {
  const { data, isLoading, isError } = useGetProductsQuery();

  const products =
    !isLoading && !isError && data
      ? data.results.map(mapApiProductToProduct)
      : mockProducts;

  const hitsProducts = products.filter((p) => p.section === "hits");
  const bestProducts = products.filter((p) => p.section === "best");

  return (
    <div className="mt-10">
      <HeroBanner />
      <FeaturesBar />
      <CategoryGrid />
      <PromoBanners />
      <HitsSection products={hitsProducts.length > 0 ? hitsProducts : products.slice(0, 5)} />
      <BrandsCarousel />
      <BestOffers products={bestProducts.length > 0 ? bestProducts : products.slice(5, 10)} />
      <AboutStore />
      <LatestNews />
    </div>
  );
}