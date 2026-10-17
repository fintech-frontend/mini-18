"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";

import { useGetOrdersQuery } from "@/lib/api/userApi";
import type { AnyRecord } from "@/lib/api/userApi";
import { formatApiError } from "@/lib/apiError";
import { getOrderDetails } from "@/lib/orderHistory";
import type { OrderDetails } from "@/lib/orderHistory";

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

const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  new: "Новый",
  processing: "В обработке",
  confirmed: "Подтверждён",
  paid: "Оплачен",
  shipped: "Отправлен",
  delivered: "Доставлен",
  completed: "Выполнен",
  cancelled: "Отменён",
  canceled: "Отменён",
};

const statusLabel = (status: string) => STATUS_LABELS[status.toLowerCase()] ?? status;

function statusClass(status: string): string {
  const s = status.toLowerCase();
  if (/cancel|отмен|reject/.test(s))
    return "text-red-600 bg-red-50 border-red-200";
  if (/complete|done|deliver|paid|выполн|доставл|оплач/.test(s))
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  return "text-orange-600 bg-orange-50 border-orange-200";
}

const sectionTitle = "mb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400";

/* Buyurtma tarkibi — qator ostida ochiladi */
function OrderDetailsPanel({
  details,
  subtotal,
  total,
}: {
  details: OrderDetails | null;
  subtotal: string;
  total: string;
}) {
  if (!details) {
    return (
      <div className="space-y-2 text-xs text-gray-500">
        <p>
          Состав заказа недоступен: сервер не хранит список товаров, а этот заказ был
          оформлен на другом устройстве или до обновления сайта.
        </p>
        <p>
          Сумма: <b className="text-gray-800">{formatTotal(subtotal) || "—"}</b> · Итого:{" "}
          <b className="text-gray-800">{formatTotal(total) || "—"}</b>
        </p>
      </div>
    );
  }

  const { customer } = details;
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(" ");
  const itemsCount = details.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      {/* Mahsulotlar */}
      <div>
        <p className={`${sectionTitle} mb-3`}>Товары ({itemsCount} шт.)</p>
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
          {details.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-3 py-3">
              <Link
                href={`/products/${item.slug ?? item.id}`}
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-50"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.slug ?? item.id}`}
                  className="line-clamp-2 text-xs text-gray-800 hover:text-[#005bff] sm:text-sm"
                >
                  {item.title}
                </Link>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  Артикул: {item.article} · {rub(item.price)} × {item.quantity}
                </p>
              </div>
              <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-slate-900">
                {rub(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Yetkazish, to'lov, qabul qiluvchi, summa */}
      <div className="space-y-4 text-xs text-gray-600">
        <div>
          <p className={sectionTitle}>Доставка</p>
          <p className="text-gray-800">{details.delivery}</p>
          <p>{[details.region, details.city].filter(Boolean).join(", ")}</p>
          {details.deliveryAddress && (
            <p className="mt-1 flex items-start gap-1">
              <MapPin size={12} className="mt-0.5 shrink-0 text-gray-400" />
              {details.deliveryAddress}
            </p>
          )}
        </div>

        <div>
          <p className={sectionTitle}>Оплата</p>
          <p className="text-gray-800">{details.payment}</p>
        </div>

        <div>
          <p className={sectionTitle}>Получатель</p>
          {fullName && <p className="text-gray-800">{fullName}</p>}
          {customer.company && <p>{customer.company}</p>}
          {customer.phone && <p>{customer.phone}</p>}
          {customer.email && <p>{customer.email}</p>}
        </div>

        {details.comment && (
          <div>
            <p className={sectionTitle}>Комментарий</p>
            <p className="whitespace-pre-line">{details.comment}</p>
          </div>
        )}

        <dl className="space-y-1 border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <dt>Сумма</dt>
            <dd className="text-gray-800">{rub(details.subtotal)}</dd>
          </div>
          {details.discount > 0 && (
            <div className="flex justify-between">
              <dt>Скидка{details.promoCode ? ` (${details.promoCode})` : ""}</dt>
              <dd className="text-green-600">−{rub(details.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-slate-900">
            <dt>Итого</dt>
            <dd>{rub(details.total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function OrdersSection() {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();
  const [openKey, setOpenKey] = useState<string | null>(null);

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
                const subtotal = pick(order, ["subtotal"]);
                const total = pick(order, [
                  "total_price",
                  "total",
                  "total_amount",
                  "amount",
                ]);

                const rowKey = String(order.id ?? idx);
                const isOpen = openKey === rowKey;
                const toggle = () => setOpenKey(isOpen ? null : rowKey);

                return (
                  <Fragment key={rowKey}>
                    <tr
                      onClick={toggle}
                      className={`cursor-pointer transition-colors ${
                        isOpen ? "bg-gray-50" : "hover:bg-gray-50/50"
                      }`}
                    >
                      <td className="py-4 pl-2 font-semibold text-gray-800">
                        {number ? `#${number}` : "—"}
                      </td>
                      <td className="py-4 text-gray-500">{formatDate(date)}</td>
                      <td className="py-4">
                        {status && (
                          <span
                            className={`inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase border rounded ${statusClass(status)}`}
                          >
                            • {statusLabel(status)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 font-bold text-slate-900 text-right">
                        {formatTotal(total)}
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle();
                          }}
                          aria-expanded={isOpen}
                          aria-label={isOpen ? "Скрыть состав заказа" : "Показать состав заказа"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isOpen
                              ? "bg-blue-50 text-[#005bff]"
                              : "bg-gray-100 text-gray-400 hover:text-[#005bff] hover:bg-blue-50"
                          }`}
                        >
                          <ChevronRight
                            size={16}
                            className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
                          />
                        </button>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-4 pb-5 pt-1">
                          <OrderDetailsPanel
                            details={number ? getOrderDetails(number) : null}
                            subtotal={subtotal}
                            total={total}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
