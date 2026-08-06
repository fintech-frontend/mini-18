import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
        Ошибка 404
      </p>
      <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
        Товар не найден
      </h1>
      <p className="mb-8 max-w-md text-sm text-gray-500 sm:text-base">
        Возможно, товар был удалён или ссылка указана неверно. Проверьте
        адрес или вернитесь к каталогу товаров.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          На главную
        </Link>
        <Link
          href="/catalog"
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300"
        >
          Перейти в каталог
        </Link>
      </div>
    </Container>
  );
}