"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useGetProfileQuery } from "@/lib/api/userApi";
import { useLogout } from "@/lib/hooks/useLogout";
import { getDisplayName } from "@/components/cabinet/profileFields";
import CabinetSidebar from "@/components/cabinet/CabinetSidebar";
import CabinetOverview from "@/components/cabinet/CabinetOverview";
import AccountSection from "@/components/cabinet/AccountSection";
import EditProfileSection from "@/components/cabinet/EditProfileSection";
import PasswordSection from "@/components/cabinet/PasswordSection";
import AddressSection from "@/components/cabinet/AddressSection";
import OrdersSection from "@/components/cabinet/OrdersSection";
import FavoritesSection from "@/components/cabinet/FavoritesSection";

/* =========================
   ASOSIY SAHIFA
========================= */

export default function ProfilePage() {
  const router = useRouter();
  const { logoutUser, isLoading: isLoggingOut } = useLogout();

  const [activeTab, setActiveTab] = useState<string>("account");
  // Redux'dagi token: server tokenni rad etib sessiya tozalansa ham darhol bilinadi
  const { token, hydrated } = useSelector((state: RootState) => state.auth);
  const authChecked = hydrated && !!token;

  // Token yo'q (yoki muddati tugab o'chirilgan) bo'lsa -> /login
  useEffect(() => {
    if (hydrated && !token) router.replace("/login?expired=1");
  }, [hydrated, token, router]);

  const {
    data: profile,
    error: profileError,
    isLoading: profileLoading,
  } = useGetProfileQuery(undefined, { skip: !authChecked });

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
          <CabinetSidebar activeTab={activeTab} onSelect={handleSelect} isLoggingOut={isLoggingOut} />

          {/* --- O'NG TARAF --- */}
          <div className="flex-1 flex flex-col gap-6">
            <CabinetOverview
              activeTab={activeTab}
              onSelect={handleSelect}
              isLoggingOut={isLoggingOut}
              profileLoading={profileLoading}
              displayName={displayName}
              profileError={profileError}
            />

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
