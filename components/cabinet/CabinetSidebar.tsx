import { sidebarItems } from "./cabinetMenu";

/* Chap yon panel */
export default function CabinetSidebar({
  activeTab,
  onSelect,
  isLoggingOut,
}: {
  activeTab: string;
  onSelect: (id: string) => void;
  isLoggingOut: boolean;
}) {

  return (
    <div className="w-full lg:w-[331px] flex-shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm h-fit">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
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
  );
}
