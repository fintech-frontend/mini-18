import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import { formatApiError } from "@/lib/apiError";
import { topCards } from "./cabinetMenu";

/* Yuqori karta: salomlashish, tezkor kartalar va profil yuklash xatosi */
export default function CabinetOverview({
  activeTab,
  onSelect,
  isLoggingOut,
  profileLoading,
  displayName,
  profileError,
}: {
  activeTab: string;
  onSelect: (id: string) => void;
  isLoggingOut: boolean;
  profileLoading: boolean;
  displayName: string;
  profileError?: FetchBaseQueryError | SerializedError;
}) {

  return (
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
              onClick={() => onSelect(card.id)}
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
  );
}
