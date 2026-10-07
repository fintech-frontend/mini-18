"use client";

import { useState } from "react";
import { Heart, Trash2 } from "lucide-react";

import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/lib/api/userApi";
import type { AnyRecord } from "@/lib/api/userApi";
import { formatApiError } from "@/lib/apiError";

// Mahsulot ma'lumoti { product: {...} } ichida ham, to'g'ridan-to'g'ri ham kelishi mumkin
function getProduct(item: AnyRecord): AnyRecord {
  const p = item.product;
  return p && typeof p === "object" ? (p as AnyRecord) : item;
}

const text = (obj: AnyRecord, keys: string[]): string => {
  for (const key of keys) {
    const v = obj[key];
    if (v !== undefined && v !== null && String(v) !== "") return String(v);
  }
  return "";
};

export default function FavoritesSection() {
  const { data: items = [], isLoading, error } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [message, setMessage] = useState<string | null>(null);

  const onRemove = async (id: number | string) => {
    setMessage(null);
    try {
      await removeFavorite(id).unwrap();
    } catch (err) {
      setMessage(formatApiError(err));
    }
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        Избранные товары
      </h3>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          Не удалось загрузить избранное: {formatApiError(error)}
        </p>
      )}

      {message && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {message}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Загрузка...</p>
      ) : items.length === 0 && !error ? (
        <p className="py-8 text-center text-sm text-gray-500">
          В избранном пока ничего нет.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, idx) => {
            const product = getProduct(item);
            const name = text(product, ["name", "title", "product_name"]);
            const price = text(product, ["price", "cost"]);
            const image = text(product, ["image", "photo", "thumbnail"]);

            return (
              <li
                key={String(item.id ?? idx)}
                className="flex flex-col rounded-lg border border-gray-100 p-4"
              >
                <div className="mb-3 flex h-36 items-center justify-center overflow-hidden rounded-md bg-gray-50">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Heart size={32} className="text-gray-300" />
                  )}
                </div>

                <p className="flex-1 text-sm font-medium text-slate-800">
                  {name || "Товар"}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {price && !Number.isNaN(Number(price))
                      ? `${Number(price).toLocaleString("ru-RU")} ₽`
                      : price}
                  </span>

                  <button
                    onClick={() => onRemove(item.id as number | string)}
                    className="rounded-lg bg-gray-100 p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Удалить из избранного"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}