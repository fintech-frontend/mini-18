import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/** Ma'lumot yuklanayotgandagi blok */
export default function LoadingState({
  label = "Загрузка...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-[240px] flex-col items-center justify-center gap-3 text-[14px] text-[#858C95]",
        className,
      )}
    >
      <LoaderCircle className="size-7 animate-spin text-[#1976E8]" aria-hidden />
      {label}
    </div>
  );
}
