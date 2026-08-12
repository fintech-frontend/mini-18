"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import Container from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCompare } from "@/context/CompareContext";

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <Container className="py-8 sm:py-12">
        <h1 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">
          Сравнение товаров
        </h1>
        <EmptyState
          title="Список сравнения пуст"
          description="Добавьте товары для сравнения с помощью значка на карточке товара"
        />
      </Container>
    );
  }

  const rows = [
    { label: "Цена", getValue: (p: (typeof compareItems)[number]) => `${p.price.toLocaleString("ru-RU")} ₽` },
    { label: "Старая цена", getValue: (p: (typeof compareItems)[number]) => p.oldPrice ? `${p.oldPrice.toLocaleString("ru-RU")} ₽` : "—" },
    { label: "Скидка", getValue: (p: (typeof compareItems)[number]) => p.discountPercentage ? `-${p.discountPercentage}%` : "—" },
    { label: "Артикул", getValue: (p: (typeof compareItems)[number]) => p.article },
    { label: "Категория", getValue: (p: (typeof compareItems)[number]) => p.category ?? "—" },
    { label: "Хит продаж", getValue: (p: (typeof compareItems)[number]) => (p.isHit ? "Да" : "Нет") },
  ];

  return (
    <Container className="py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Сравнение товаров
        </h1>
        <button
          onClick={clearCompare}
          className="text-sm font-medium text-gray-500 hover:text-red-500"
        >
          Очистить всё
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr>
              <th className="w-40 sm:w-48" />
              {compareItems.map((product) => (
                <th key={product.id} className="p-3 text-left align-top">
                  <div className="relative">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      aria-label="Убрать из сравнения"
                      className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-contain p-3"
                          sizes="200px"
                        />
                      </div>
                      <p className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-blue-600">
                        {product.title}
                      </p>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-gray-100">
                <td className="p-3 text-sm font-medium text-gray-500">
                  {row.label}
                </td>
                {compareItems.map((product) => (
                  <td key={product.id} className="p-3 text-sm text-gray-800">
                    {row.getValue(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}