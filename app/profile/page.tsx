"use client";

import React, { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Heart,
  ShieldCheck,
  LogOut,
  ListOrdered,
} from "lucide-react";

import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/lib/api/userApi";
import type { Profile } from "@/lib/api/userApi";
import { useLogout } from "@/lib/hooks/useLogout";
import { formatApiError } from "@/lib/apiError";
import AddressSection from "@/components/cabinet/AddressSection";
import OrdersSection from "@/components/cabinet/OrdersSection";
import FavoritesSection from "@/components/cabinet/FavoritesSection";

/* =========================
   PROFIL MAYDONLARI (serverdan kelganlari ko'rsatiladi)
========================= */

const FIELD_LABELS: Record<string, string> = {
  first_name: "Имя",
  last_name: "Фамилия",
  full_name: "ФИО",
  name: "Имя",
  email: "Email",
  phone: "Телефон",
  phone_number: "Телефон",
  region: "Регион",
  address: "Адрес",
};

const asText = (v: unknown) => (v === null || v === undefined ? "" : String(v));

function getDisplayName(profile?: Profile): string {
  if (!profile) return "";
  return (
    asText(profile.first_name) ||
    asText(profile.full_name) ||
    asText(profile.name) ||
    asText(profile.username) ||
    ""
  );
}

const inputClass =
  "h-11 w-full rounded-md border border-gray-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-gray-300 focus:border-[#005bff]";

/* =========================
   BO'LIM: MOY AKKAUNT
========================= */

function AccountSection({ profile }: { profile?: Profile }) {
  const keys = Object.keys(FIELD_LABELS).filter(
    (k) => profile && asText(profile[k]) !== ""
  );

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Мой аккаунт</h3>

      {keys.length === 0 ? (
        <p className="text-sm text-gray-500">Данные профиля не найдены.</p>
      ) : (
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {keys.map((k) => (
            <div key={k} className="rounded-lg border border-gray-100 px-4 py-3">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {FIELD_LABELS[k]}
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">
                {asText(profile?.[k])}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* =========================
   BO'LIM: PROFILNI O'ZGARTIRISH
========================= */

function EditProfileSection({ profile }: { profile?: Profile }) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const editableKeys = Object.keys(FIELD_LABELS).filter(
    (k) => profile && k in profile
  );

  const values: Record<string, string> = {};
  editableKeys.forEach((k) => (values[k] = edits[k] ?? asText(profile?.[k])));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    try {
      await updateProfile(values).unwrap();
      setMessage({ type: "ok", text: "Профиль успешно обновлён" });
    } catch (err) {
      setMessage({ type: "err", text: formatApiError(err) });
    }
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Изменить профиль</h3>

      {editableKeys.length === 0 ? (
        <p className="text-sm text-gray-500">Нет данных профиля для редактирования.</p>
      ) : (
        <form onSubmit={onSubmit} className="max-w-xl space-y-4">
          {editableKeys.map((k) => (
            <div key={k}>
              <label htmlFor={k} className="mb-2 block text-xs font-medium text-slate-700">
                {FIELD_LABELS[k]}
              </label>
              <input
                id={k}
                value={values[k] ?? ""}
                onChange={(e) => setEdits((prev) => ({ ...prev, [k]: e.target.value }))}
                className={inputClass}
              />
            </div>
          ))}

          {message && (
            <p
              className={`rounded-md border px-4 py-3 text-xs ${
                message.type === "ok"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-md bg-[#005bff] px-6 text-xs font-bold uppercase text-white transition hover:bg-[#0049cc] disabled:opacity-60"
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      )}
    </div>
  );
}

/* =========================
   BO'LIM: PAROLNI ALMASHTIRISH
========================= */

function PasswordSection() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "err", text: "Пароль должен содержать минимум 6 символов" });
      return;
    }
    if (newPassword !== confirm) {
      setMessage({ type: "err", text: "Пароли не совпадают" });
      return;
    }

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: confirm,
        confirm_password: confirm,
        password_confirm: confirm,
      }).unwrap();

      setMessage({ type: "ok", text: "Пароль успешно изменён" });
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setMessage({ type: "err", text: formatApiError(err) });
    }
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Сменить пароль</h3>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="old" className="mb-2 block text-xs font-medium text-slate-700">
            Текущий пароль
          </label>
          <input
            id="old"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="new" className="mb-2 block text-xs font-medium text-slate-700">
            Новый пароль
          </label>
          <input
            id="new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="confirm" className="mb-2 block text-xs font-medium text-slate-700">
            Подтвердите новый пароль
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
        </div>

        {message && (
          <p
            className={`rounded-md border px-4 py-3 text-xs ${
              message.type === "ok"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="h-11 rounded-md bg-[#005bff] px-6 text-xs font-bold uppercase text-white transition hover:bg-[#0049cc] disabled:opacity-60"
        >
          {isLoading ? "Сохранение..." : "Изменить пароль"}
        </button>
      </form>
    </div>
  );
}

/* =========================
   ASOSIY SAHIFA
========================= */

export default function ProfilePage() {
  const router = useRouter();
  const { logoutUser, isLoading: isLoggingOut } = useLogout();

  const [activeTab, setActiveTab] = useState<string>("account");
  const authChecked = useSyncExternalStore(
    () => () => {},
    () => !!(localStorage.getItem("token") ?? sessionStorage.getItem("token")),
    () => false
  );

  // Token yo'q bo'lsa -> /login
  useEffect(() => {
    if (!authChecked) router.replace("/login");
  }, [authChecked, router]);

  const {
    data: profile,
    error: profileError,
    isLoading: profileLoading,
  } = useGetProfileQuery(undefined, { skip: !authChecked });

  const sidebarItems = [
    { id: "account", label: "Мой аккаунт", icon: User },
    { id: "edit", label: "Изменить профиль", icon: User },
    { id: "orders", label: "Мои заказы", icon: ListOrdered },
    { id: "address", label: "Адрес доставки", icon: MapPin },
    { id: "favorites", label: "Избранные товары", icon: Heart },
    { id: "password", label: "Сменить пароль", icon: ShieldCheck },
    { id: "logout", label: "Выйти из аккаунта", icon: LogOut, isLogout: true },
  ];

  const topCards = [
    { id: "orders", label: "МОИ ЗАКАЗЫ", icon: ListOrdered },
    { id: "edit", label: "ИЗМЕНИТЬ ПРОФИЛЬ", icon: User },
    { id: "address", label: "АДРЕС ДОСТАВКИ", icon: MapPin },
    { id: "favorites", label: "ИЗБРАННОЕ", icon: Heart },
    { id: "password", label: "СМЕНИТЬ ПАРОЛЬ", icon: ShieldCheck },
    { id: "logout", label: "ВЫЙТИ", icon: LogOut },
  ];

  // "logout" tabga emas, to'g'ridan-to'g'ri chiqishga ulanadi
  const handleSelect = (id: string) => {
    if (id === "logout") {
      logoutUser();
      return;
    }
    setActiveTab(id);
  };

  if (!authChecked) return null;

  const displayName = getDisplayName(profile);

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen py-6">
      <div className="w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-[#005bff]">
            Стройоптторг
          </Link>
          <span>/</span>
          <span className="text-gray-600">Личный кабинет</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6">
          Личный кабинет
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* --- CHAP SIDEBAR --- */}
          <div className="w-full lg:w-[331px] flex-shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm h-fit">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  disabled={item.isLogout && isLoggingOut}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-xs sm:text-sm font-medium transition-all border-b border-gray-50 last:border-none ${
                    isActive
                      ? "bg-[#0b1727] text-white"
                      : item.isLogout
                        ? "text-gray-500 hover:text-red-600 hover:bg-gray-50"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : "text-gray-500"}
                    />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* --- O'NG TARAF --- */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-base md:text-lg font-semibold text-slate-800 mb-4">
                {profileLoading
                  ? "Загрузка..."
                  : `Здравствуйте${displayName ? `, ${displayName}` : ""}!`}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 border border-gray-100 rounded-xl overflow-hidden">
                {topCards.map((card) => {
                  const Icon = card.icon;
                  const isActive = activeTab === card.id;

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleSelect(card.id)}
                      disabled={card.id === "logout" && isLoggingOut}
                      className={`flex flex-col items-center justify-center p-4 border-r border-b xl:border-b-0 border-gray-100 last:border-r-0 transition-all relative ${
                        isActive
                          ? "bg-[#005bff] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={`mb-2 ${isActive ? "text-white" : "text-gray-600"}`}
                        strokeWidth={1.5}
                      />
                      <span className="text-[10px] font-bold text-center tracking-wider uppercase">
                        {card.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Profil yuklashdagi xato */}
              {profileError && (
                <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                  Не удалось загрузить профиль
                  {"status" in profileError ? ` (HTTP ${profileError.status})` : ""}
                  : {formatApiError(profileError)}
                </p>
              )}
            </div>

            {/* --- KONTENT --- */}
            {activeTab === "account" && <AccountSection profile={profile} />}

            {activeTab === "edit" && <EditProfileSection profile={profile} />}

            {activeTab === "password" && <PasswordSection />}

            {activeTab === "orders" && <OrdersSection />}

            {activeTab === "address" && <AddressSection />}

            {activeTab === "favorites" && <FavoritesSection />}
          </div>
        </div>
      </div>
    </div>
  );
}