import { User, MapPin, Heart, ShieldCheck, LogOut, ListOrdered } from "lucide-react";

/* Kabinet menyulari: chap yon panel va yuqoridagi kartalar */

export const sidebarItems = [
  { id: "account", label: "Мой аккаунт", icon: User },
  { id: "edit", label: "Изменить профиль", icon: User },
  { id: "orders", label: "Мои заказы", icon: ListOrdered },
  { id: "address", label: "Адрес доставки", icon: MapPin },
  { id: "favorites", label: "Избранные товары", icon: Heart },
  { id: "password", label: "Сменить пароль", icon: ShieldCheck },
  { id: "logout", label: "Выйти из аккаунта", icon: LogOut, isLogout: true },
];

export const topCards = [
  { id: "orders", label: "МОИ ЗАКАЗЫ", icon: ListOrdered },
  { id: "edit", label: "ИЗМЕНИТЬ ПРОФИЛЬ", icon: User },
  { id: "address", label: "АДРЕС ДОСТАВКИ", icon: MapPin },
  { id: "favorites", label: "ИЗБРАННОЕ", icon: Heart },
  { id: "password", label: "СМЕНИТЬ ПАРОЛЬ", icon: ShieldCheck },
  { id: "logout", label: "ВЫЙТИ", icon: LogOut },
];
