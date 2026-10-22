"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { VISIBLE_FILTER_OPTIONS } from "@/data/catalogData";
import Checkbox from "@/components/ui/Checkbox";
import { cn, formatPrice } from "@/lib/utils";
import type {
  DimensionKey,
  FilterListKey,
  FilterOption,
  FilterOptions,
  FilterState,
  PriceRange,
} from "@/types/productsTypes";

/* =========================
   KICHIK QISMLAR
========================= */

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#ECEEF1] py-4 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-[16px] font-semibold text-[#303640]">
          {title}
        </span>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#6E7580] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}

/** "от" / "до" prefiksli raqam inputi */
function PrefixInput({
  prefix,
  value,
  placeholder,
  onChange,
  onCommit,
  ariaLabel,
}: {
  prefix: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onCommit?: () => void;
  ariaLabel: string;
}) {
  return (
    <label className="flex h-[46px] min-w-0 flex-1 items-center gap-1.5 rounded-[6px] border border-[#D9DDE3] bg-white px-3 text-[14px] transition-colors focus-within:border-[#1976E8]">
      <span className="shrink-0 text-[#A0A5AC]">{prefix}</span>
      <input
        value={value}
        placeholder={placeholder}
        inputMode="numeric"
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        onBlur={onCommit}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit?.();
        }}
        className="w-full min-w-0 bg-transparent text-[#303640] outline-none placeholder:text-[#A0A5AC]"
      />
    </label>
  );
}

const thumbClasses =
  "pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[1px] [&::-webkit-slider-thumb]:size-[18px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1976E8] [&::-webkit-slider-thumb]:bg-white [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[14px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1976E8] [&::-moz-range-thumb]:bg-white";

/** Narx inputlari: yozish paytida lokal, blur / Enter da qo'llanadi */
function PriceInputs({
  min,
  max,
  limit,
  onChange,
}: {
  min: number;
  max: number;
  limit: PriceRange;
  onChange: (min: number, max: number) => void;
}) {
  const [minText, setMinText] = useState(formatPrice(min));
  const [maxText, setMaxText] = useState(formatPrice(max));

  const commit = () => {
    const minDigits = minText.replace(/\D/g, "");
    const maxDigits = maxText.replace(/\D/g, "");
    const parsedMin = minDigits === "" ? limit.min : Number(minDigits);
    const parsedMax = maxDigits === "" ? limit.max : Number(maxDigits);

    const nextMax = Math.min(Math.max(parsedMax, limit.min), limit.max);
    const nextMin = Math.min(Math.max(parsedMin, limit.min), nextMax);

    if (nextMin === min && nextMax === max) {
      setMinText(formatPrice(min));
      setMaxText(formatPrice(max));
      return;
    }

    onChange(nextMin, nextMax);
  };

  return (
    <div className="flex items-center gap-2.5">
      <PrefixInput
        prefix="от"
        value={minText}
        ariaLabel="Цена от"
        onChange={setMinText}
        onCommit={commit}
      />
      <PrefixInput
        prefix="до"
        value={maxText}
        ariaLabel="Цена до"
        onChange={setMaxText}
        onCommit={commit}
      />
    </div>
  );
}

function PriceFilter({
  min,
  max,
  limit,
  onChange,
}: {
  min: number;
  max: number;
  limit: PriceRange;
  onChange: (min: number, max: number) => void;
}) {
  const range = Math.max(limit.max - limit.min, 1);
  const left = ((min - limit.min) / range) * 100;
  const right = 100 - ((max - limit.min) / range) * 100;

  return (
    <div>
      {/* key: tashqi qiymat o'zgarsa (slayder, "Очистить"), inputlar yangilanadi */}
      <PriceInputs
        key={`${min}-${max}`}
        min={min}
        max={max}
        limit={limit}
        onChange={onChange}
      />

      <div className="relative mx-[9px] mt-4 h-6">
        <div className="absolute inset-x-0 top-[11px] h-[3px] rounded-full bg-[#DCE1E7]" />
        <div
          className="absolute top-[11px] h-[3px] rounded-full bg-[#1976E8]"
          style={{ left: `${left}%`, right: `${right}%` }}
        />

        <input
          type="range"
          aria-label="Минимальная цена"
          min={limit.min}
          max={limit.max}
          step={limit.step}
          value={min}
          onChange={(e) =>
            onChange(
              Math.min(Number(e.target.value), max - limit.step),
              max,
            )
          }
          className={cn(thumbClasses, "-mx-[9px] w-[calc(100%+18px)]")}
        />
        <input
          type="range"
          aria-label="Максимальная цена"
          min={limit.min}
          max={limit.max}
          step={limit.step}
          value={max}
          onChange={(e) =>
            onChange(
              min,
              Math.max(Number(e.target.value), min + limit.step),
            )
          }
          className={cn(thumbClasses, "-mx-[9px] w-[calc(100%+18px)]")}
        />
      </div>
    </div>
  );
}

function CheckboxList({
  options,
  selected,
  onToggle,
}: {
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = options.length > VISIBLE_FILTER_OPTIONS;

  // Tanlangan, lekin yashirin variant bo'lsa ham ko'rinsin
  const visible =
    expanded || !canExpand
      ? options
      : options.filter(
          (item, index) =>
            index < VISIBLE_FILTER_OPTIONS || selected.includes(item.value),
        );

  return (
    <div>
      <div className="space-y-2.5">
        {visible.map((item) => (
          <Checkbox
            key={item.value}
            checked={selected.includes(item.value)}
            onChange={() => onToggle(item.value)}
            className="py-[3px]"
          >
            {/* Tur / brend: slug emas, nomi ("MAKITA", "Перфоратор") */}
            {item.label ?? item.value}{" "}
            <span className="text-[#A0A5AC]">({item.count})</span>
          </Checkbox>
        ))}
      </div>

      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 text-[14px] font-medium text-[#1976E8] hover:underline"
        >
          {expanded ? "Скрыть" : "Показать все"}
        </button>
      )}
    </div>
  );
}

function DimensionRange({
  minKey,
  maxKey,
  value,
  onChange,
}: {
  minKey: DimensionKey;
  maxKey: DimensionKey;
  value: FilterState;
  onChange: (key: DimensionKey, value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <PrefixInput
        prefix="от"
        value={value[minKey]}
        ariaLabel="от"
        onChange={(v) => onChange(minKey, v)}
      />
      <PrefixInput
        prefix="до"
        value={value[maxKey]}
        ariaLabel="до"
        onChange={(v) => onChange(maxKey, v)}
      />
    </div>
  );
}

/* =========================
   ASOSIY KOMPONENT
========================= */

type SectionKey =
  | "price"
  | "type"
  | "brand"
  | "material"
  | "color"
  | "length"
  | "width"
  | "height";

type Props = {
  value: FilterState;
  /** Joriy kategoriya mahsulotlaridan yig'ilgan variantlar */
  options: FilterOptions;
  onChange: (next: FilterState) => void;
  className?: string;
};

/** Bo'sh ro'yxatli bo'limlar (masalan, rangi yo'q kategoriya) ko'rsatilmaydi */
const LIST_SECTIONS: { key: FilterListKey; section: SectionKey; title: string }[] = [
  { key: "types", section: "type", title: "Тип товара" },
  { key: "brands", section: "brand", title: "Бренд" },
  { key: "materials", section: "material", title: "Материал" },
  { key: "colors", section: "color", title: "Цвет" },
];

export default function CatalogFilters({
  value,
  options,
  onChange,
  className,
}: Props) {
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({
    price: true,
    type: true,
    brand: true,
    material: true,
    color: false,
    length: false,
    width: false,
    height: false,
  });

  const toggleSection = (key: SectionKey) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleListValue = (key: FilterListKey, item: string) => {
    const list = value[key];
    onChange({
      ...value,
      [key]: list.includes(item)
        ? list.filter((v) => v !== item)
        : [...list, item],
    });
  };

  const setDimension = (key: DimensionKey, v: string) =>
    onChange({ ...value, [key]: v });

  return (
    <div className={className}>
      <FilterSection
        title="Цена, ₽"
        open={sections.price}
        onToggle={() => toggleSection("price")}
      >
        <PriceFilter
          min={value.minPrice}
          max={value.maxPrice}
          limit={options.price}
          onChange={(minPrice, maxPrice) =>
            onChange({ ...value, minPrice, maxPrice })
          }
        />
      </FilterSection>

      {LIST_SECTIONS.map(({ key, section, title }) =>
        options[key].length === 0 ? null : (
          <FilterSection
            key={key}
            title={title}
            open={sections[section]}
            onToggle={() => toggleSection(section)}
          >
            <CheckboxList
              options={options[key]}
              selected={value[key]}
              onToggle={(item) => toggleListValue(key, item)}
            />
          </FilterSection>
        ),
      )}

      <FilterSection
        title="Длина, мм"
        open={sections.length}
        onToggle={() => toggleSection("length")}
      >
        <DimensionRange
          minKey="lengthMin"
          maxKey="lengthMax"
          value={value}
          onChange={setDimension}
        />
      </FilterSection>

      <FilterSection
        title="Ширина, мм"
        open={sections.width}
        onToggle={() => toggleSection("width")}
      >
        <DimensionRange
          minKey="widthMin"
          maxKey="widthMax"
          value={value}
          onChange={setDimension}
        />
      </FilterSection>

      <FilterSection
        title="Высота, мм"
        open={sections.height}
        onToggle={() => toggleSection("height")}
      >
        <DimensionRange
          minKey="heightMin"
          maxKey="heightMax"
          value={value}
          onChange={setDimension}
        />
      </FilterSection>
    </div>
  );
}
