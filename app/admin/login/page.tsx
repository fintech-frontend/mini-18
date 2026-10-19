"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { startAdminSession } from "@/lib/admin/auth";
import { useLoginMutation } from "@/lib/api/authApi";
import { setToken } from "@/lib/authSlice";
import { formatApiError } from "@/lib/apiError";

function findString(data: unknown, keys: string[], depth = 0): string | null {
  if (!data || typeof data !== "object" || depth > 3) return null;
  const obj = data as Record<string, unknown>;
  for (const k of keys) if (typeof obj[k] === "string" && obj[k]) return obj[k] as string;
  for (const v of Object.values(obj)) {
    const f = findString(v, keys, depth + 1);
    if (f) return f;
  }
  return null;
}

export default function AdminLogin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AdminShell token topmaganda shu yerga ?expired=1 bilan qaytaradi
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("expired")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Sessiya muddati tugadi. Iltimos, qaytadan kiring.");
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) return setError("Email va parolni kiriting");
    try {
      const res = await loginUser({ username: email.trim(), email: email.trim(), password }).unwrap();
      const token = findString(res, ["access", "access_token", "accessToken", "token", "key"]);
      const refresh = findString(res, ["refresh", "refresh_token", "refreshToken"]);
      if (!token) return setError("Server token qaytarmadi");
      dispatch(setToken({ token, refresh, remember: true }));
      startAdminSession(email.trim().toLowerCase());
      router.replace("/admin");
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  const features = [
    { icon: ShieldCheck, t: "1C: Enterprise 8.3 To'liq Integratsiyasi", d: "Buxgalteriya, hisob-fakturalar va tovar aylanmasi real vaqtda sinxronlanadi." },
    { icon: Building2, t: "O'zbekiston bo'ylab 12 ta Hub Ombor", d: "Toshkent, Samarqand, Farg'ona va boshqa yirik hududiy logistika tugunlari." },
    { icon: Lock, t: "B2B Korporativ Himoyalangan Standart", d: "Har bir sessiya audit jurnali va xavfsiz ikki bosqichli autentifikatsiya bilan ta'minlangan." },
  ];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0b3d7a] via-[#186FD4] to-[#1a7ae6] p-12 text-white lg:flex">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-[#ff3b3b]" /> СтройОптТорг B2B &amp; Retail ERP v2.4
          </span>
          <h1 className="mt-12 max-w-[600px] text-[44px] font-bold leading-[1.1]">
            Markazlashgan qurilish materiallari va optom savdo boshqaruv platformasi
          </h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-7 text-white/70">
            Yirik dilerlik tarmoqlari, ombor logistikasi, tovar qoldiqlari hisobi va B2B korporativ buyurtmalar monitoringi uchun yopiq operatsion markaz.
          </p>
        </div>
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.t} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.07] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <f.icon size={20} />
              </span>
              <div>
                <div className="text-[15px] font-semibold">{f.t}</div>
                <div className="text-[13px] text-white/65">{f.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex gap-12 border-t border-white/15 pt-8">
          {[
            ["45,000+", "Aktiv SKU"],
            ["99.98%", "Uptime ko'rsatkichi"],
            ["UZ-DC1", "Mahalliy server"],
          ].map(([a, b]) => (
            <div key={b}>
              <div className="text-[30px] font-bold">{a}</div>
              <div className="text-[11px] uppercase tracking-wider text-white/55">{b}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#f6f7fb] p-4 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-[600px] rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(16,34,74,0.08)] sm:p-10">
          <div className="flex items-center justify-between gap-3 border-b border-[#eef1f6] pb-6">
            <div className="flex flex-col gap-1">
              <Image src="/logo.png" alt="Стройоптторг" width={215} height={54} priority className="h-auto w-[190px]" />
              <span className="text-[10px] font-semibold tracking-[0.14em] text-[#6b7a90]">ADMIN BOSHQARUV</span>
            </div>
            <span className="rounded-full border border-[#f3d9a4] bg-[#fff8e8] px-3 py-1.5 text-[12px] font-medium text-[#9a6200]">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#f0a500]" />
              Ichki Korporativ Portal
            </span>
          </div>

          <h2 className="mt-7 text-[28px] font-bold text-[#0f1d3a]">Tizimga kirish</h2>
          <p className="mt-1 text-[14px] text-[#6b7a90]">Xodimlar va mas&apos;ul administratorlar uchun yopiq boshqaruv tizimi</p>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#16335f]">Korporativ email yoki telefon raqam</span>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8794aa]" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-lg border border-[#d5dcea] bg-[#fafbfe] py-3 pl-11 pr-3 text-[15px] outline-none focus:border-[#186FD4] focus:bg-white"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between text-[12px] font-semibold uppercase tracking-wide text-[#16335f]">
                Maxfiy parol
                <span className="text-[12px] font-medium normal-case tracking-normal text-[#06214a]">Parolni unutdingizmi?</span>
              </span>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8794aa]" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#d5dcea] bg-[#fafbfe] py-3 pl-11 pr-11 text-[15px] outline-none focus:border-[#186FD4] focus:bg-white"
                />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a90]" aria-label="Parolni ko'rsatish">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-[14px]">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#06214a]" />
                Meni eslab qol (30 kun)
              </label>
              <span className="flex items-center gap-1.5 text-[12px] text-[#12713c]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1bb55c]" /> Xavfsiz ulanish
              </span>
            </div>


            {error && <div className="rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] font-medium text-[#c0262d]">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#06214a] py-3.5 text-[16px] font-semibold text-white shadow-lg shadow-[#06214a]/20 transition hover:bg-[#0a2d63] disabled:opacity-60"
            >
              {isLoading ? "Tekshirilmoqda..." : "Tizimga kirish"} <ArrowRight size={18} />
            </button>
          </div>

          <p className="mt-6 border-t border-[#eef1f6] pt-5 text-center text-[12px] text-[#8794aa]">
            Tizimga kirishda muammo bormi? <span className="font-semibold text-[#06214a]">AT qo&apos;llab-quvvatlash xizmati (+998 71 200-00-00)</span>
          </p>
        </form>
      </div>
    </div>
  );
}
