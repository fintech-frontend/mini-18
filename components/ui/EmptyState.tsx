import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

/** Bo'sh savat / izbrannoe / taqqoslash uchun umumiy blok */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel = "Перейти в каталог",
  actionHref = "/catalog",
}: Props) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-[#D9DDE3] px-5 py-12 text-center md:min-h-[420px]">
      <span className="flex size-16 items-center justify-center rounded-full bg-[#F0F5FB] text-[#1976E8]">
        <Icon className="size-7" aria-hidden />
      </span>

      <h2 className="mt-5 text-[18px] font-semibold text-[#303640] md:text-[20px]">
        {title}
      </h2>
      <p className="mt-2 max-w-[360px] text-[14px] leading-[1.5] text-[#858C95]">
        {description}
      </p>

      <Link
        href={actionHref}
        className="mt-6 rounded-[7px] bg-[#1976E8] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#0F67D0]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
