"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/* Ranglar: sidebar #186FD4, to'q tugma #06214a, aksent #186FD4 */

export function PageHeader({
  crumbs,
  title,
  subtitle,
  badge,
  actions,
}: {
  crumbs?: string[];
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {crumbs && (
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#6b7a90]">
            {crumbs.map((c, i) => (
              <span key={c} className={i === crumbs.length - 1 ? "text-[#186FD4]" : ""}>
                {i > 0 && <span className="mr-1.5 text-[#aab3c2]">›</span>}
                {c}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-bold leading-tight text-[#0f1d3a]">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="mt-1 text-[13px] text-[#6b7a90]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className = "",
  title,
  subtitle,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className={`rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(16,34,74,0.06)] ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-[17px] font-semibold text-[#0f1d3a]">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[12px] text-[#6b7a90]">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "soft" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Btn({ variant = "soft", size = "md", className = "", ...p }: BtnProps) {
  const v = {
    primary: "bg-[#186FD4] text-white hover:bg-[#135bb0]",
    dark: "bg-[#06214a] text-white hover:bg-[#0a2d63]",
    soft: "bg-[#eef2fb] text-[#16335f] hover:bg-[#e1e8f7]",
    ghost: "bg-white text-[#16335f] hover:bg-[#f1f4fa] border border-[#e2e8f2]",
    danger: "bg-[#fdecec] text-[#c0262d] hover:bg-[#fbdada]",
  }[variant];
  const s = size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-4 py-2.5 text-[13px]";
  return (
    <button
      type="button"
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${v} ${s} ${className}`}
    />
  );
}

const tones = {
  blue: "bg-[#e3effc] text-[#186FD4]",
  green: "bg-[#e2f6ea] text-[#12713c]",
  red: "bg-[#fdecec] text-[#c0262d]",
  amber: "bg-[#fff3d9] text-[#9a6200]",
  gray: "bg-[#eceff5] text-[#5b6a82]",
  navy: "bg-[#06214a] text-white",
} as const;
export type Tone = keyof typeof tones;

export function Badge({
  tone = "gray",
  children,
  className = "",
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export const inputCls =
  "w-full rounded-lg border border-[#e2e8f2] bg-[#f6f8fc] px-3 py-2.5 text-[13px] text-[#0f1d3a] outline-none transition placeholder:text-[#9aa6b8] focus:border-[#186FD4] focus:bg-white";

export function Field({
  label,
  children,
  className = "",
  hint,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] font-medium text-[#4a5a73]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-[#9aa6b8]">{hint}</span>}
    </label>
  );
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-[#06142e]/50 backdrop-blur-[3px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ${
          wide ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#eef1f6] px-6 py-4">
          <div className="min-w-0">
            <h3 className="text-[18px] font-bold text-[#0f1d3a]">{title}</h3>
            {subtitle && <div className="mt-0.5 text-[12px] text-[#6b7a90]">{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Yopish" className="rounded-lg p-1.5 text-[#6b7a90] hover:bg-[#f1f4fa]">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#eef1f6] bg-[#fafbfe] px-6 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Confirm({
  open,
  title,
  text,
  onYes,
  onClose,
  yes = "Ha, o'chirish",
}: {
  open: boolean;
  title: string;
  text: string;
  onYes: () => void;
  onClose: () => void;
  yes?: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Bekor qilish
          </Btn>
          <Btn
            variant="dark"
            className="!bg-[#c0262d] hover:!bg-[#a51f26]"
            onClick={() => {
              onYes();
              onClose();
            }}
          >
            {yes}
          </Btn>
        </>
      }
    >
      <p className="text-[14px] text-[#4a5a73]">{text}</p>
    </Modal>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string; count?: number; tone?: Tone }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition ${
              on ? "bg-[#06214a] text-white" : "text-[#4a5a73] hover:bg-[#eef2fb]"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  on
                    ? "bg-white/20 text-white"
                    : t.tone === "red"
                      ? "bg-[#fdecec] text-[#c0262d]"
                      : "bg-[#e3effc] text-[#186FD4]"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Pagination({
  page,
  pages,
  onChange,
  info,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
  info?: React.ReactNode;
}) {
  const set = [...new Set([1, pages, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= pages)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  set.forEach((p, i) => {
    if (i && p - set[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-[12px] text-[#4a5a73]">
      <div>{info}</div>
      <div className="flex items-center gap-1.5">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-lg bg-[#eef2fb] p-2 text-[#16335f] disabled:opacity-40"
          aria-label="Oldingi"
        >
          <ChevronLeft size={15} />
        </button>
        {out.map((p, i) =>
          p === "…" ? (
            <span key={`d${i}`} className="px-1">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`h-8 min-w-8 rounded-lg px-2 text-[12px] font-semibold ${
                p === page ? "bg-[#06214a] text-white" : "bg-[#eef2fb] text-[#16335f] hover:bg-[#e1e8f7]"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="rounded-lg bg-[#eef2fb] p-2 text-[#16335f] disabled:opacity-40"
          aria-label="Keyingi"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  foot,
  dark,
}: {
  label: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  foot?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 shadow-[0_1px_3px_rgba(16,34,74,0.06)] ${
        dark ? "bg-[#06214a] text-white" : "bg-white text-[#0f1d3a]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${dark ? "text-white/70" : "text-[#6b7a90]"}`}>
          {label}
        </span>
        {icon && (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              dark ? "bg-white/10" : "bg-[#eef2fb] text-[#186FD4]"
            }`}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
        <span className="text-[24px] font-bold leading-none">{value}</span>
        {unit && <span className={`text-[12px] ${dark ? "text-white/70" : "text-[#6b7a90]"}`}>{unit}</span>}
      </div>
      {foot && <div className={`mt-3 text-[12px] ${dark ? "text-white/80" : "text-[#6b7a90]"}`}>{foot}</div>}
    </div>
  );
}

export function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={`font-semibold ${up ? "text-[#12713c]" : "text-[#c0262d]"}`}>
      {up ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

export function Empty({ text = "Hech narsa topilmadi" }: { text?: string }) {
  return <div className="py-12 text-center text-[13px] text-[#9aa6b8]">{text}</div>;
}

export function Progress({ value, color = "#186FD4", h = 6 }: { value: number; color?: string; h?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-full bg-[#e4e9f3]" style={{ height: h }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}

export function usePageSlice<T>(rows: T[], page: number, size: number) {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const p = Math.min(page, pages);
  return { pages, page: p, slice: rows.slice((p - 1) * size, p * size) };
}
