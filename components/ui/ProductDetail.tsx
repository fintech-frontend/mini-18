"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  BarChart2,
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  Grid,
  Truck,
  Percent,
} from "lucide-react";
import { Product } from "@/types/product";

const TABS = ["Характеристики", "О товаре", "Доставка и оплата"] as const;

export default function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Характеристики");

  const gallery = [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  // 1. O'rtadagi qisqa xususiyatlar ro'yxati
  const mainSpecs = [
    { label: "Тип товара", value: "Дрель-шуруповерт" },
    { label: "Бренд", value: "MAKITA" },
    { label: "Назначение инструмента", value: "профессиональный" },
    { label: "Мощность (Вт)", value: "18" },
    { label: "Емкость АКБ (А/ч)", value: "1,5" },
    { label: "Крутящий момент макс. (Н/м)", value: "30" },
    { label: "Напряжение аккумулятора (В)", value: "14,4" },
  ];

  // 2. Afzalliklar va servislar ro'yxati
  const storeFeatures = [
    { icon: CreditCard, text: "Оплата любым удобным способом" },
    { icon: Grid, text: "Большой выбор товаров в каталоге" },
    { icon: Truck, text: "Осуществляем быструю доставку" },
    { icon: Percent, text: "Делаем скидки на крупные покупки" },
  ];

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-2xl">
        {product.title}
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 1-USTUN: Gallery (4 ta ustun egallaydi) */}
        <div className="flex gap-3 lg:col-span-5">
          <div className="hidden flex-col gap-2 sm:flex">
            {gallery.map((src, i) => (
              <button
                key={i}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-400"
              >
                <Image src={src} alt="" fill className="object-contain p-2" />
              </button>
            ))}
          </div>
          <div className="relative aspect-square w-full flex-1 overflow-hidden rounded-xl bg-gray-50">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        </div>

        {/* 2-USTUN: Xususiyatlar va Afzalliklar (4 ta ustun egallaydi) */}
        <div className="flex flex-col gap-5 lg:col-span-4">
          {/* Nukatali xususiyatlar */}
          <div className="space-y-2.5 text-sm">
            {mainSpecs.map((spec, idx) => (
              <div key={idx} className="flex items-baseline justify-between gap-2">
                <span className="text-gray-500 whitespace-nowrap">{spec.label}</span>
                <span className="flex-1 border-b border-dotted border-gray-300 relative -top-1" />
                <span className="font-medium text-gray-800 whitespace-nowrap">{spec.value}</span>
              </div>
            ))}

            <button
              onClick={() => setActiveTab("Характеристики")}
              className="pt-1 text-sm font-medium text-blue-600 hover:underline"
            >
              Больше характеристик
            </button>
          </div>

          {/* Afzalliklar bloki */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3.5">
            {storeFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3 text-gray-600">
                  <div className="flex items-center justify-center rounded-lg bg-white p-1.5 shadow-xs border border-gray-100 text-gray-400">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-medium leading-tight text-gray-700">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-USTUN: Info & Narx paneli (3 ta ustun egallaydi) */}
        <div className="flex flex-col gap-3 h-fit rounded-xl border border-gray-200 p-4 sm:p-5 lg:col-span-3">
          <p className="text-xs text-gray-400">Артикул: {product.article}</p>
          <p className="text-sm font-medium text-green-600">В наличии</p>

          <div className="flex items-baseline gap-2">
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.oldPrice.toLocaleString("ru-RU")} ₽
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString("ru-RU")} ₽
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 my-1">
            <span className="text-sm text-gray-500">Количество:</span>
            <div className="flex items-center rounded-lg border border-gray-200">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-800"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-800"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <ShoppingCart size={16} />
            Добавить в корзину
          </button>
          <button className="rounded-lg border border-blue-600 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
            Купить в 1 клик
          </button>

          <div className="flex items-center justify-center gap-4 border-t border-gray-100 pt-3 text-sm text-gray-500">
            <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Heart size={16} /> В избранное
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <BarChart2 size={16} /> Сравнить
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 border-b border-gray-200">
        <div className="flex gap-4 overflow-x-auto sm:gap-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="py-6">
        {activeTab === "Характеристики" && (
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Характеристики товара «{product.title}»
            </h3>
            <div className="grid grid-cols-1 gap-x-12 gap-y-2 sm:grid-cols-2">
              {[
                ["Тип товара", "Электроинструмент"],
                ["Бренд", "MAKITA"],
                ["Артикул", product.article],
                ["Цена", `${product.price.toLocaleString("ru-RU")} ₽`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-dashed border-gray-200 py-2 text-sm"
                >
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "О товаре" && (
          <p className="text-sm leading-relaxed text-gray-600">
            Подробное описание товара пока не добавлено.
          </p>
        )}

        {activeTab === "Доставка и оплата" && (
          <p className="text-sm leading-relaxed text-gray-600">
            Информация о доставке и оплате пока не добавлена.
          </p>
        )}
      </div>
    </div>
  );
}