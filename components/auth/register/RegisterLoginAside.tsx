import Link from "next/link";
import { ChevronRight, UserRoundPlus } from "lucide-react";

/* O'ng blok: «Уже есть аккаунт?» va login'ga o'tish */
export default function RegisterLoginAside() {
  return (
    <div className="border-t border-[#e5e8eb] lg:border-l lg:border-t-0">
      <div className="flex h-full flex-col justify-start p-6 sm:p-8 md:p-10 lg:p-10">
        <div className="mb-5">
          <UserRoundPlus size={42} strokeWidth={1.5} className="text-[#ff2b1a]" />
        </div>

        <h2 className="text-2xl font-bold text-[#303640] sm:text-3xl">Уже есть аккаунт?</h2>

        <p className="mt-6 max-w-125 text-sm leading-6 text-[#777d84]">
          Перейдите в{" "}
          <Link href="/login" className="font-semibold text-[#303640] transition hover:text-[#1976d2]">
            авторизацию
          </Link>{" "}
          если у вас уже есть зарегистрированный аккаунт.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex w-fit items-center gap-3 rounded-md bg-[#071522] px-5 py-4 text-xs font-bold uppercase text-white transition hover:bg-[#1976d2]"
        >
          АВТОРИЗОВАТЬСЯ
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
