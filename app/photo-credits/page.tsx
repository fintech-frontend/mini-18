import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { styles } from "@/styles/index.styles";
import { PHOTO_CREDITS } from "@/lib/data/photoCredits";

export const metadata = {
  title: "Источники фотографий — Стройоптторг",
};

export default function PhotoCreditsPage() {
  return (
    <div className="bg-white">
      <div className={`${styles.container} py-6 sm:py-8`}>
        <div className="mb-4 flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Стройоптторг
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">Источники фотографий</span>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">Источники фотографий</h1>
        <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-500">
          Часть фотографий товаров в каталоге взята из{" "}
          <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Wikimedia Commons
          </a>{" "}
          и используется на условиях указанных ниже свободных лицензий. Фотографии носят иллюстративный характер и могут
          отличаться от внешнего вида товара.
        </p>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3 font-semibold">Товар</th>
                <th className="px-4 py-3 font-semibold">Фото</th>
                <th className="px-4 py-3 font-semibold">Автор</th>
                <th className="px-4 py-3 font-semibold">Лицензия</th>
              </tr>
            </thead>
            <tbody>
              {PHOTO_CREDITS.map((c) => (
                <tr key={c.article} className="border-t border-gray-100 align-top">
                  <td className="px-4 py-3 text-gray-900">{c.product}</td>
                  <td className="max-w-[260px] px-4 py-3">
                    <a href={c.source} target="_blank" rel="noopener noreferrer" className="break-words text-blue-600 hover:underline">
                      {c.file}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.author}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {c.licenseUrl ? (
                      <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {c.license}
                      </a>
                    ) : (
                      c.license
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
