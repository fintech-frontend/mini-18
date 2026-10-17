"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart2, Plus } from "lucide-react";

import CompareProductCard from "@/components/compare/CompareProductCard";
import {
  buildCompareGroups,
  isRowDifferent,
} from "@/components/compare/compareRows";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import { MAX_COMPARE_ITEMS, useCompare } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";

const ALL_TYPES = "all";

/** /compare sahifasining mazmuni: filtrlar va taqqoslash jadvali */
export default function CompareView() {
  const { products, count, isLoading, clearCompare } = useCompare();
  const [typeFilter, setTypeFilter] = useState(ALL_TYPES);
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  const types = useMemo(
    () => Array.from(new Set(products.map((p) => p.type).filter(Boolean))),
    [products],
  );

  // Tanlangan tur ro'yxatdan o'chirilgan bo'lsa, "Все" ga qaytamiz
  const activeType = types.includes(typeFilter) ? typeFilter : ALL_TYPES;

  const visibleProducts = useMemo(
    () =>
      activeType === ALL_TYPES
        ? products
        : products.filter((p) => p.type === activeType),
    [products, activeType],
  );

  const groups = useMemo(() => {
    const all = buildCompareGroups(visibleProducts);
    if (!onlyDifferences || visibleProducts.length < 2) return all;

    return all
      .map((group) => ({
        ...group,
        rows: group.rows.filter((row) => isRowDifferent(row, visibleProducts)),
      }))
      .filter((group) => group.rows.length > 0);
  }, [visibleProducts, onlyDifferences]);

  if (count > 0 && products.length === 0 && isLoading) return <LoadingState />;

  if (count === 0) {
    return (
      <EmptyState
        icon={BarChart2}
        title="Список сравнения пуст"
        description={`Добавьте до ${MAX_COMPARE_ITEMS} товаров с помощью значка сравнения на карточке товара.`}
      />
    );
  }

  const emptySlots = MAX_COMPARE_ITEMS - count;
  const columnCount = visibleProducts.length + (activeType === ALL_TYPES ? emptySlots : 0);

  return (
    <>
      {/* CONTROLS */}
      <div className="flex flex-col gap-4 border-b border-[#ECEEF1] pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {types.length > 1 && (
            <select
              value={activeType}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Тип товара"
              className="h-10 rounded-[7px] border border-[#DCE0E5] bg-white px-3 text-[14px] text-[#303640] outline-none focus:border-[#1976E8]"
            >
              <option value={ALL_TYPES}>Все типы ({count})</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type} ({products.filter((p) => p.type === type).length})
                </option>
              ))}
            </select>
          )}

          <fieldset className="flex items-center gap-5 text-[14px] text-[#303640]">
            <legend className="sr-only">Режим сравнения</legend>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="compare-mode"
                checked={!onlyDifferences}
                onChange={() => setOnlyDifferences(false)}
                className="size-4 accent-[#1976E8]"
              />
              Все характеристики
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="compare-mode"
                checked={onlyDifferences}
                onChange={() => setOnlyDifferences(true)}
                className="size-4 accent-[#1976E8]"
              />
              Только различия
            </label>
          </fieldset>
        </div>

        <button
          type="button"
          onClick={clearCompare}
          className="self-start text-[14px] font-medium text-[#858C95] transition-colors hover:text-[#D93829] md:self-auto"
        >
          Очистить сравнение
        </button>
      </div>

      {/* TABLE: kichik ekranlarda gorizontal scroll, birinchi ustun yopishib turadi */}
      <div className="mt-6 overflow-x-auto pb-2">
        <table className="w-full min-w-max border-separate border-spacing-0 text-[14px]">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-20 w-[130px] bg-white md:w-[200px]"
              >
                <span className="sr-only">Характеристика</span>
              </th>

              {visibleProducts.map((product) => (
                <th
                  key={product.id}
                  scope="col"
                  className="w-[200px] min-w-[200px] px-3 pb-5 align-top font-normal md:w-[240px] md:min-w-[240px] md:px-4"
                >
                  <CompareProductCard product={product} />
                </th>
              ))}

              {activeType === ALL_TYPES &&
                Array.from({ length: emptySlots }, (_, index) => (
                  <th
                    key={`slot-${index}`}
                    scope="col"
                    className="hidden w-[240px] min-w-[240px] px-4 pb-5 align-top font-normal xl:table-cell"
                  >
                    <Link
                      href="/catalog"
                      className="flex h-[150px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D9DDE3] text-[13px] text-[#858C95] transition-colors hover:border-[#1976E8] hover:text-[#1976E8]"
                    >
                      <Plus className="size-5" />
                      Добавить товар
                    </Link>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {groups.map((group) => (
              <Fragment key={group.title}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={columnCount + 1}
                    className="bg-white pt-6 pb-3 text-left"
                  >
                    <span className="sticky left-0 inline-block text-[17px] font-bold text-[#303640]">
                      {group.title}
                    </span>
                  </th>
                </tr>

                {group.rows.map((row, index) => {
                  const zebra = index % 2 === 0 ? "bg-[#F8F9FA]" : "bg-white";
                  const differs =
                    visibleProducts.length > 1 &&
                    isRowDifferent(row, visibleProducts);

                  return (
                    <tr key={row.key}>
                      <th
                        scope="row"
                        className={cn(
                          "sticky left-0 z-10 px-3 py-3 text-left align-top font-normal text-[#737A84] md:px-4",
                          zebra,
                        )}
                      >
                        <span className="flex items-start gap-2">
                          {differs && (
                            <span
                              className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#D93829]"
                              title="Значения различаются"
                              aria-label="Значения различаются"
                            />
                          )}
                          {row.label}
                        </span>
                      </th>

                      {visibleProducts.map((product) => (
                        <td
                          key={product.id}
                          className={cn(
                            "px-3 py-3 align-top text-[#303640] md:px-4",
                            zebra,
                          )}
                        >
                          {row.getValue(product)}
                        </td>
                      ))}

                      {activeType === ALL_TYPES &&
                        Array.from({ length: emptySlots }, (_, slot) => (
                          <td
                            key={`slot-${slot}`}
                            className={cn("hidden xl:table-cell", zebra)}
                          />
                        ))}
                    </tr>
                  );
                })}
              </Fragment>
            ))}

            {groups.length === 0 && (
              <tr>
                <td
                  colSpan={columnCount + 1}
                  className="py-10 text-center text-[#858C95]"
                >
                  Различий в характеристиках нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
