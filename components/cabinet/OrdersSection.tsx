"use client";

import { ChevronRight } from "lucide-react";

import { useGetOrdersQuery } from "@/lib/api/userApi";
import type { AnyRecord } from "@/lib/api/userApi";
import { formatApiError } from "@/lib/apiError";

const pick = (obj: AnyRecord, keys: string[]): string => {
  for (const key of keys) {
    const v = obj[key];
    if (v !== undefined && v !== null && String(v) !== "") return String(v);
  }
  return "";
};

function formatDate(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTotal(value: string): string {
  if (!value) return "";
  const n = Number(value);
  return Number.isNaN(n) ? value : `${n.toLocaleString("ru-RU")} ₽`;
}

function statusClass(status: string): string {
  const s = status.toLowerCase();
  if (/cancel|отмен|reject/.test(s))
    return "text-red-600 bg-red-50 border-red-200";
  if (/complete|done|deliver|paid|выполн|доставл|оплач/.test(s))
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  return "text-orange-600 bg-orange-50 border-orange-200";
}

export default function OrdersSection() {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Мои заказы</h3>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          Не удалось загрузить заказы: {formatApiError(error)}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Загрузка...</p>
      ) : orders.length === 0 && !error ? (
        <p className="py-8 text-center text-sm text-gray-500">
          У вас пока нет заказов.
        </p>
      ) : (
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
              {orders.map((order, idx) => {
                const number = pick(order, ["number", "order_number", "id"]);
                const date = pick(order, ["created_at", "date", "created"]);
                const status = pick(order, ["status_display", "status"]);
                const total = pick(order, [
                  "total_price",
                  "total",
                  "total_amount",
                  "amount",
                ]);

                return (
                  <tr key={String(order.id ?? idx)} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-semibold text-gray-800">
                      {number ? `#${number}` : "—"}
                    </td>
                    <td className="py-4 text-gray-500">{formatDate(date)}</td>
                    <td className="py-4">
                      {status && (
                        <span
                          className={`inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase border rounded ${statusClass(status)}`}
                        >
                          • {status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 font-bold text-slate-900 text-right">
                      {formatTotal(total)}
                    </td>
                    <td className="py-4 text-right">
                      <button className="p-1.5 bg-gray-100 text-gray-400 hover:text-[#005bff] hover:bg-blue-50 rounded-lg transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}