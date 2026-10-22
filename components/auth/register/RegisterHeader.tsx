import Link from "next/link";

/* Breadcrumb, sarlavha va xabarlar (muvaffaqiyat / server xatosi) */
export default function RegisterHeader({ success, serverError }: { success: boolean; serverError?: string | null }) {
  return (
    <>
      {/* BREADCRUMB */}
      <div className="pt-6 text-xs text-[#8c9299] sm:pt-8 sm:text-sm">
        <Link href="/" className="text-[#303640] transition hover:text-[#1976d2]">
          Стройоптторг
        </Link>

        <span className="mx-3 text-[#c5c8cc]">/</span>

        <span>Регистрация</span>
      </div>

      {/* TITLE */}
      <h1 className="mt-7 text-4xl font-bold leading-tight text-[#303640] sm:mt-8 sm:text-5xl lg:text-[48px]">Регистрация</h1>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Регистрация успешно выполнена!
        </div>
      )}

      {/* SERVER ERROR MESSAGE */}
      {serverError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>
      )}
    </>
  );
}
