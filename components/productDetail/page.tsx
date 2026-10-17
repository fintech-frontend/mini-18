"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ProductCard from "@/components/catalog/ProductCard";
import ProductPurchasePanel from "@/components/productDetail/ProductPurchasePanel";
import ProductReviews from "@/components/productDetail/ProductReviews";
import { routes } from "@/lib/routes";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/productsTypes";
import { styles } from "@/styles/index.styles";

type Props = {
  product: Product;
  /** Server'da yuklanadi (app/product/[id]/page.tsx) */
  similarProducts: Product[];
};

export default function ProductDetail({ product, similarProducts }: Props) {
  // Rasm bo'lmasligi mumkin (API image_url: null)
  const images = (product.gallery?.length ? product.gallery : [product.image]).filter(Boolean);
  const [activeImage, setActiveImage] = useState(images[0] ?? "");
  const [failedImages, setFailedImages] = useState<string[]>([]);

  return (
    <div className="w-full bg-white">
      <div className={styles.container}>
        {/* BREADCRUMB */}
        <nav
          aria-label="Хлебные крошки"
          className="pt-3 text-[13px] leading-relaxed text-[#828892] lg:pt-7"
        >
          <Link href="/" className="text-[#303640] hover:underline">
            Стройоптторг
          </Link>

          <span className="mx-2">/</span>

          <Link href={routes.catalog} className="text-[#303640] hover:underline">
            Каталог
          </Link>

          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={routes.category(product.category)}
                className="text-[#303640] hover:underline"
              >
                {product.categoryTitle}
              </Link>
            </>
          )}

          <span className="mx-2">/</span>

          <span aria-current="page">{product.title}</span>
        </nav>

        {/* PRODUCT: 360 -> ustma-ust, 768 -> 2 ustun, 1024+ -> chapda vertikal galereya */}
        <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:mt-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex min-w-0 flex-col-reverse gap-3 lg:flex-row lg:gap-6">
            {/* THUMBNAILS */}
            <div className="flex shrink-0 gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`flex size-[64px] shrink-0 items-center justify-center rounded-lg border bg-white md:size-[78px] ${
                    activeImage === image
                      ? "border-[#1976E8]"
                      : "border-[#E0E3E7]"
                  }`}
                >
                  {!failedImages.includes(image) && (
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      width={70}
                      height={70}
                      onError={() =>
                        setFailedImages((prev) => [...prev, image])
                      }
                      className="h-full w-full object-contain"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* MAIN IMAGE */}
            <div className="flex min-w-0 flex-1 items-center justify-center rounded-xl bg-white">
              <div className="relative h-[280px] w-full md:h-[380px] lg:h-[500px]">
                {product.hit && (
                  <span className="absolute right-0 top-0 z-10 rounded-[5px] border border-[#F3AD24] bg-white px-3 py-1.5 text-[11px] font-bold text-[#F3A600]">
                    ХИТ
                  </span>
                )}

                {!activeImage || failedImages.includes(activeImage) ? (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#F5F7F9] text-sm text-[#A0A5AC]">
                    Изображение недоступно
                  </div>
                ) : (
                  <Image
                    src={activeImage}
                    alt={product.title}
                    fill
                    preload
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 60vw, 900px"
                    onError={() =>
                      setFailedImages((prev) => [...prev, activeImage])
                    }
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* INFO */}
          <div>
            <div className="text-[11px] text-[#A0A5AC]">
              Артикул: {product.article}
            </div>

            <h1 className="mt-3 text-[22px] font-bold leading-[1.2] text-[#1F252C] md:text-[26px] lg:text-[28px]">
              {product.title}
            </h1>

            {/* RATING */}
            {product.rating && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[#F5A623]">★</span>

                <span className="text-sm font-semibold">{product.rating}</span>

                <span className="text-sm text-[#8A9098]">
                  ({product.reviewsCount ?? 0} отзывов)
                </span>
              </div>
            )}

            {/* PRICE */}
            <div className="mt-7">
              <div className="flex items-center gap-3">
                <span className="text-[26px] font-bold text-[#1267C6] lg:text-[30px]">
                  {formatPrice(product.price)} ₽
                </span>

                {product.discount && (
                  <span className="rounded-[5px] bg-[#1AA36F] px-2 py-1 text-xs font-bold text-white">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {product.oldPrice && (
                <div className="mt-1 text-sm text-[#A4A8AE] line-through">
                  {formatPrice(product.oldPrice)} ₽
                </div>
              )}
            </div>

            {/* STOCK */}
            <div className="mt-5">
              {product.stock && product.stock > 0 ? (
                <span className="text-sm font-medium text-[#1AA36F]">
                  В наличии: {product.stock} шт.
                </span>
              ) : (
                <span className="text-sm font-medium text-red-500">
                  Нет в наличии
                </span>
              )}
            </div>

            {/* BUY / FAVORITE / COMPARE */}
            <ProductPurchasePanel product={product} />
          </div>
        </div>

        {/* DESCRIPTION */}
        <section className="mt-10 border-t border-[#ECEEF1] pt-6 lg:mt-14 lg:pt-8">
          <h2 className="text-[22px] font-bold text-[#303640]">Описание</h2>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-[#5E6670]">
            {product.description || "Описание товара отсутствует."}
          </p>
        </section>

        {/* SPECS */}
        {product.specs && (
          <section className="mt-8 pb-12 lg:mt-10 lg:pb-16">
            <h2 className="text-[22px] font-bold text-[#303640]">
              Характеристики
            </h2>

            <div className="mt-5 max-w-[900px] overflow-hidden rounded-xl border border-[#E5E8EC]">
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-2 border-b border-[#E5E8EC] last:border-b-0"
                >
                  <div className="bg-[#F8F9FA] px-3 py-3 text-sm text-[#737A84] md:px-5 md:py-3.5">
                    {key}
                  </div>

                  <div className="px-3 py-3 text-sm font-medium text-[#303640] md:px-5 md:py-3.5">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SIMILAR */}
        <ProductReviews
          productId={product.id}
          rating={product.rating}
          reviewsCount={product.reviewsCount ?? 0}
        />

        {similarProducts.length > 0 && (
          <section
            aria-labelledby="similar-title"
            className="border-t border-[#ECEEF1] pt-8 pb-12 lg:pt-10 lg:pb-16"
          >
            <h2
              id="similar-title"
              className="text-[22px] font-bold text-[#303640]"
            >
              Похожие товары
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-x-[17px] gap-y-[25px] md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 2xl:gap-x-[30px]">
              {similarProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
