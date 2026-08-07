'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  Search, 
  Gift, 
  User, 
  BarChart2, 
  Heart, 
  ShoppingCart,
  X
} from 'lucide-react';
import Container from '@/components/container/container';

// Top navigatsiya va mobil menyu ma'lumotlari
const navItems = [
  { label: 'О компании', uppercaseLabel: 'О КОМПАНИИ', href: '/about' },
  { label: 'Оплата', uppercaseLabel: 'ОПЛАТА', href: '/payment' },
  { label: 'Доставка', uppercaseLabel: 'ДОСТАВКА', href: '/delivery' },
  { label: 'Возврат', uppercaseLabel: 'ВОЗВРАТ', href: '/returns' },
  { label: 'Отзывы', uppercaseLabel: 'ОТЗЫВЫ', href: '/reviews' },
  { label: 'Вопрос-ответ', uppercaseLabel: 'ВОПРОС-ОТВЕТ', href: '/faq' },
  { label: 'Новости', uppercaseLabel: 'НОВОСТИ', href: '/news' },
  { label: 'Контакты', uppercaseLabel: 'КОНТАКТЫ', href: '/contacts' },
];

export default function Header() {
  // Modallar holati (State)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 font-sans sticky top-0 z-30">
        
        {/* ================= 1. DESKTOP / PLANSHET TOP-BAR ================= */}
        <div className="border-b border-gray-100 text-[#434343]">
          <Container className="py-2 flex items-center justify-between gap-4">
            
            {/* Mobil va Planshet uchun Hamburg-menyu tugmasi (< 1024px) */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-gray-800 hover:text-[#2563EB] transition-colors rounded-lg focus:outline-none flex items-center gap-2"
                aria-label="Открыть меню"
              >
                <Menu className="w-6 h-6 stroke-[2]" />
                <span className="font-bold text-sm text-gray-900 hidden md:inline">
                  Меню
                </span>
              </button>
            </div>

            {/* Navigatsiya havolalari (Desktop ≥ 1024px) */}
            <nav className="hidden lg:block overflow-x-auto whitespace-nowrap scrollbar-none">
              <ul className="flex items-center gap-5 xl:gap-6 text-xs xl:text-sm font-semibold">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="hover:text-[#2563EB] text-[#6C6F71] transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Ish vaqti, Telefon va Qayta qo'ng'iroq tugmasi */}
            <div className="flex items-center gap-3 md:gap-5 shrink-0 whitespace-nowrap ml-auto lg:ml-0">
              <span className="text-gray-500 font-medium text-xs hidden md:inline">
                Ежедневно, с 8:00 до 18:00
              </span>

              <a
                href="tel:88004440065"
                className="font-extrabold text-black text-sm md:text-base hover:text-[#2563EB] transition-colors"
              >
                8 800 444 00 65
              </a>

              <button
                type="button"
                onClick={() => setIsCallbackOpen(true)}
                className="bg-[#f0f5ff] text-[#1b365d] hover:bg-[#e2edff] text-[10px] md:text-xs font-extrabold px-3.5 py-2 rounded-md uppercase tracking-wider transition-colors active:scale-95"
              >
                ЗАКАЗАТЬ ЗВОНОК
              </button>
            </div>

          </Container>
        </div>

        {/* ================= 2. ASOSIY NAVBAR (LOGO, QIDIRUV VA IKONKALAR) ================= */}
        <Container className="py-3 sm:py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-6">
          
          {/* LOGO VA PLANSHET IKONKALAR */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            
            {/* Logotip */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 shrink-0 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="44" stroke="#d93829" strokeWidth="8" />
                  <path d="M30 68V48L50 32L70 48V68H30Z" fill="#1b365d" />
                  <path d="M22 48L50 25L78 48" stroke="#d93829" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-[#d93829] font-black text-lg md:text-xl tracking-tight uppercase leading-none">
                  СТРОЙОПТТОРГ
                </span>
                <span className="text-[8.5px] md:text-[9.5px] text-[#1b365d] font-bold uppercase tracking-tight mt-1 leading-none">
                  Всё для строительства и ремонта
                </span>
              </div>
            </Link>

            {/* Planshet / Mobil Ikonkalar Paneli (< 1024px) */}
            <div className="flex items-center gap-4 text-gray-800 lg:hidden">
              <Link href="/promotions" className="hidden md:flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors">
                <Gift className="w-5 h-5 stroke-[1.8]" />
                <span className="text-[10px] text-gray-500 font-medium">Акции</span>
              </Link>

              <Link href="/login" className="flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors">
                <User className="w-5 h-5 stroke-[1.8]" />
                <span className="text-[10px] text-gray-500 font-medium hidden md:inline">Войти</span>
              </Link>

              <Link href="/compare" className="flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors">
                <BarChart2 className="w-5 h-5 stroke-[1.8]" />
                <span className="text-[10px] text-gray-500 font-medium hidden md:inline">Сравнение</span>
              </Link>

              <Link href="/favorites" className="flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors">
                <Heart className="w-5 h-5 stroke-[1.8]" />
                <span className="text-[10px] text-gray-500 font-medium hidden md:inline">Избранное</span>
              </Link>

              <Link href="/cart" className="flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors">
                <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
                <span className="text-[10px] text-gray-500 font-medium hidden md:inline">Корзина</span>
              </Link>
            </div>

          </div>

          {/* ================= 3. KATALOG TUGMASI VA QIDIRUV ================= */}
          <div className="flex items-center gap-2.5 w-full lg:flex-1 lg:max-w-3xl">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold px-4 sm:px-6 h-11 md:h-12 rounded-xl transition-all shrink-0 text-xs sm:text-sm uppercase tracking-wide shadow-sm active:scale-95"
            >
              <div className="flex flex-col gap-1 w-4">
                <span className="h-0.5 w-full bg-white rounded"></span>
                <span className="h-0.5 w-full bg-white rounded"></span>
              </div>
              <span>КАТАЛОГ</span>
            </button>

            <form className="flex-1 relative flex items-center h-11 md:h-12" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Найти среди 50000 товаров. Например: Дрель Bosch"
                className="w-full h-full border-2 border-[#2563EB] rounded-xl pl-3.5 pr-12 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-white"
              />
              <button
                type="submit"
                aria-label="Поиск"
                className="absolute right-0 top-0 bottom-0 w-11 md:w-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-r-[9px] flex items-center justify-center transition-colors"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>
          </div>

          {/* ================= 4. DESKTOP IKONKALAR PANELI (≥1024px) ================= */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-7 text-[#2C3E50] shrink-0">
            <Link href="/promotions" className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group">
              <Gift className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
              <span className="text-xs text-[#6B7076] font-medium">Все акции</span>
            </Link>

            <Link href="/login" className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group">
              <User className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
              <span className="text-xs text-[#6B7076] font-medium">Войти</span>
            </Link>

            <Link href="/compare" className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group">
              <BarChart2 className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
              <span className="text-xs text-[#6B7076] font-medium">Сравнение</span>
            </Link>

            <Link href="/favorites" className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group">
              <Heart className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
              <span className="text-xs text-[#6B7076] font-medium">Избранное</span>
            </Link>

            <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group">
              <ShoppingCart className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
              <span className="text-xs text-[#6B7076] font-medium">Корзина</span>
            </Link>
          </div>

        </Container>
      </header>

      {/* ================= 5. RASMDEGI MOBIL MENYU MODALI ================= */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop (Xiralashtiruvchi fon) */}
          <div 
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menyu Oynasi */}
          <aside 
            aria-label="Мобильное меню"
            className="fixed inset-y-0 left-0 w-full max-w-[420px] bg-white z-50 flex flex-col shadow-2xl overflow-y-auto min-w-[360px]"
          >
            {/* Header: Sarlavha va Yopish (X) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#1E293B]">Меню</h2>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
                aria-label="Закрыть меню"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Havolalar Ro'yxati */}
            <nav className="flex-1 divide-y divide-gray-100">
              <Link
                href="/promotions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-4 text-sm font-semibold text-[#1E293B] hover:bg-gray-50 transition-colors uppercase tracking-wide"
              >
                <Gift className="w-5 h-5 text-black stroke-[2]" />
                <span>ВСЕ АКЦИИ</span>
              </Link>

              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-4 text-sm font-semibold text-[#1E293B] hover:bg-gray-50 hover:text-[#2563EB] transition-colors uppercase tracking-wide"
                >
                  {item.uppercaseLabel}
                </Link>
              ))}
            </nav>

            {/* Footer: Tel va Buyurtma */}
            <div className="p-6 border-t border-gray-100 bg-white flex flex-col items-center gap-3 mt-auto">
              <div className="flex items-center justify-between w-full gap-2">
                <a
                  href="tel:88004440065"
                  className="text-base sm:text-lg font-black text-[#1E293B] hover:text-[#2563EB] transition-colors tracking-tight whitespace-nowrap"
                >
                  8 800 444 00 65
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCallbackOpen(true);
                  }}
                  className="bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] text-[10px] sm:text-[11px] font-bold px-3 py-2 rounded-lg uppercase tracking-wider transition-colors active:scale-95 shrink-0"
                >
                  ЗАКАЗАТЬ ЗВОНОК
                </button>
              </div>

              <span className="text-xs text-gray-400 font-medium">
                Ежедневно, с 8:00 до 18:00
              </span>
            </div>
          </aside>
        </>
      )}

      {/* ================= 6. ZAKAZAT ZVONOK MODAL OYNASI ================= */}
      {isCallbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsCallbackOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Заказать звонок</h3>
            <p className="text-xs text-gray-500 mb-4">Оставьте ваш номер, и мы перезвоним вам в течение 15 минут.</p>
            
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Заявка принята!'); 
              setIsCallbackOpen(false); 
            }}>
              <input 
                type="tel" 
                placeholder="+7 (___) ___-__-__" 
                required 
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-3 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
              <button 
                type="submit" 
                className="w-full bg-[#2563EB] text-white py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-blue-700 transition-colors active:scale-95"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}