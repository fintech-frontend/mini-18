"use client";

import { cn } from "@/lib/utils";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  /** "sm" — filtrlar uchun (22px), "md" — formalar uchun (26px, maketdagidek) */
  size?: "sm" | "md";
  invalid?: boolean;
  className?: string;
  labelClassName?: string;
  id?: string;
  "aria-describedby"?: string;
};

/** Maketdagi kvadrat checkbox. Asl <input> ekran o'quvchilari va klaviatura uchun saqlanadi. */
export default function Checkbox({
  checked,
  onChange,
  children,
  size = "sm",
  invalid = false,
  className,
  labelClassName,
  id,
  "aria-describedby": describedBy,
}: Props) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-start gap-3 select-none",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[5px] border bg-white transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#1976E8]/40",
          size === "sm" ? "size-[22px]" : "size-[26px]",
          checked
            ? "border-[#1976E8] bg-[#1976E8] text-white"
            : invalid
              ? "border-[#E5484D]"
              : "border-[#D9DDE3] group-hover:border-[#1976E8]",
        )}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <span
        className={cn(
          size === "sm"
            ? "pt-px text-[14px] text-[#353B45]"
            : "pt-[2px] text-[13px] leading-snug text-[#8A9098]",
          labelClassName,
        )}
      >
        {children}
      </span>
    </label>
  );
}
