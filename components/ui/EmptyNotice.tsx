import { PackageSearch } from "lucide-react";

export const EmptyState = ({
  title = "В этой категории пока нет товаров",
  description = "Попробуйте выбрать другую категорию или загляните позже",
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-14 text-center sm:py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 sm:h-20 sm:w-20">
        <PackageSearch size={32} className="text-blue-400 sm:size-9" />
      </div>
      <p className="mb-1.5 text-base font-semibold text-gray-700 sm:text-lg">
        {title}
      </p>
      <p className="max-w-xs text-sm text-gray-400">{description}</p>
    </div>
  );
};