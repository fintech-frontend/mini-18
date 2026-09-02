"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ListOrdered,
} from "lucide-react";

// Buyurtmalar ma'lumotlari
const ORDERS = [
  {
    id: "#2365341-11",
    date: "16 Августа 2023",
    status: "ОБРАБОТКА",
    statusType: "orange",
    total: "36 829 ₽",
  },
  {
    id: "#2356576-13",
    date: "1 Августа 2023",
    status: "ВЫПОЛНЕН",
    statusType: "green",
    total: "11 299 ₽",
  },
  {
    id: "#577598-26",
    date: "17 Июля 2023",
    status: "ОТМЕНЕН",
    statusType: "red",
    total: "1 311 ₽",
  },
  {
    id: "#436879-12",
    date: "11 Января 2023",
    status: "ОБРАБОТКА",
    statusType: "orange",
    total: "12 889 ₽",
  },
  {
    id: "#2365341-11",
    date: "10 Декабря 2022",
    status: "ОБРАБОТКА",
    statusType: "orange",
    total: "2 829 ₽",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("orders");

  // Tablar ro'yxati (count olib tashlandi)
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

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen py-6 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-[#005bff]">
            Стройоптторг
          </Link>
          <span>/</span>
          <span className="text-gray-600">Личный кабинет</span>
        </div>

        {/* Sarlavha */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6">
          Личный кабинет
        </h1>

        {/* ASOSIY GRID (Sidebar + Content) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* --- CHAP SIDEBAR (331px) --- */}
          <div className="w-full lg:w-[331px] flex-shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm h-fit">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
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

                  {/* Sanoq belgisi mavjud bo'lsa ko'rsatiladi */}
              
                </button>
              );
            })}
          </div>
          

          {/* --- O'NG TARAFI (KARTALAR VA KONTENT) --- */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Tepadagi Salomlashuv va 6 ta Karta-Tab */}
            <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-base md:text-lg font-semibold text-slate-800 mb-4">
                Здравствуйте, Евгений!
              </h2>

              {/* 6 ta Ustunli Kartalar Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 border border-gray-100 rounded-xl overflow-hidden">
                {topCards.map((card) => {
                  const Icon = card.icon;
                  const isActive = activeTab === card.id;

                  return (
                    <button
                      key={card.id}
                      onClick={() => setActiveTab(card.id)}
                      className={`flex flex-col items-center justify-center p-4 border-r border-b xl:border-b-0 border-gray-100 last:border-r-0 transition-all relative ${
                        isActive
                          ? "bg-[#005bff] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {/* Sanoq belgisi mavjud bo'lsa ko'rsatiladi */}
              

                      <Icon
                        size={24}
                        className={`mb-2 ${
                          isActive ? "text-white" : "text-gray-600"
                        }`}
                        strokeWidth={1.5}
                      />
                      <span className="text-[10px] font-bold text-center tracking-wider uppercase">
                        {card.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TABLARA MOS KONTENT */}
            {activeTab === "orders" && (
              <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-base font-semibold text-slate-800 mb-4">
                  Текущие заказы
                </h3>


                {/* Buyurtmalar Jadvali */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="pb-3">Номер</th>
                        <th className="pb-3">Дата</th>
                        <th className="pb-3">Статус</th>
                        <th className="pb-3 text-right">Итого</th>
                        <th className="pb-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                      {ORDERS.map((order, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 font-semibold text-gray-800">
                            {order.id}
                          </td>
                          <td className="py-4 text-gray-500">{order.date}</td>
                          <td className="py-4">
                            {/* Status Badgelari */}
                            {order.statusType === "orange" && (
                              <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 rounded">
                                • {order.status}
                              </span>
                            )}
                            {order.statusType === "green" && (
                              <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded">
                                • {order.status}
                              </span>
                            )}
                            {order.statusType === "red" && (
                              <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-200 rounded">
                                • {order.status}
                              </span>
                            )}
                          </td>
                          <td className="py-4 font-bold text-slate-900 text-right">
                            {order.total}
                          </td>
                          <td className="py-4 text-right">
                            <button className="p-1.5 bg-gray-100 text-gray-400 hover:text-[#005bff] hover:bg-blue-50 rounded-lg transition-colors">
                              <ChevronRight size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Boshqa tablar uchun shablon */}
            {activeTab !== "orders" && (
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center py-16">
                <p className="text-gray-500 text-sm">
                  Раздел{" "}
                  <span className="font-semibold text-slate-800">
                    "{sidebarItems.find((i) => i.id === activeTab)?.label}"
                  </span>{" "}
                  в разработке.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

