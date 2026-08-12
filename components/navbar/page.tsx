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
import { styles } from '@/styles/index.styles';
import CartDiscountBanner from '../CartDiscountBanner';

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

const catalogCategories = [
  { title: 'Строительные материалы', href: '/catalog/building-materials' },
  { title: 'Отделочные материалы', href: '/catalog/finishing-materials' },
  { title: 'Электроинструмент', href: '/catalog/power-tools' },
  { title: 'Ручной инструмент', href: '/catalog/hand-tools' },
  { title: 'Сантехника', href: '/catalog/plumbing' },
  { title: 'Сантехника и крепеж', href: '/catalog/fasteners' },
  { title: 'Электротовары', href: '/catalog/electrical' },
  { title: 'Cад и огород', href: '/catalog/garden' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dinamik sanoqlar
  const [cartCount, setCartCount] = useState(0); 
  const [favoritesCount, setFavoritesCount] = useState(0);

  return (
    <header className="w-full bg-white border-b border-gray-100 font-sans sticky top-0 z-40 select-none">
      
      {/* ================= 1. TOP BAR ================= */}
      <div className={` border-b border-gray-100 bg-white w-full`}>
        <div className={`${styles?.container} h-10 flex items-center justify-between text-xs text-[#555555]`}>
          
          {/* Tablet Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1 text-gray-800 hover:text-[#2563EB] flex items-center gap-2 focus:outline-none cursor-pointer"
            aria-label="Открыть меню"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
            <span className="font-semibold text-xs text-gray-800">Меню</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8 font-normal">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="hover:text-[#2563EB] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacts & Callback Button */}
          <div className="flex items-center gap-3 md:gap-5 xl:gap-6 ml-auto lg:ml-0">
            <span className="text-gray-400 font-normal hidden md:inline text-[11px] lg:text-xs">
              Ежедневно, с 8:00 до 18:00
            </span>

            <a
              href="tel:88004440065"
              className="font-extrabold text-gray-900 text-xs md:text-sm hover:text-[#2563EB] transition-colors whitespace-nowrap"
            >
              8 800 444 00 65
            </a>

            <button
              type="button"
              onClick={() => setIsCallbackOpen(true)}
              className="bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] text-[11px] font-bold px-3 py-1.5 rounded uppercase tracking-tight transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              ЗАКАЗАТЬ ЗВОНОК
            </button>
          </div>

        </div>
      </div>

      {/* ================= 2. MAIN HEADER ================= */}
      <div className={`${styles?.container} py-3 flex flex-col lg:flex-row justify-between gap-3 lg:gap-8 lg:items-center relative`}>
        
        {/* Logo & Tablet/Mobile Icons */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="44" stroke="#D93829" strokeWidth="8" />
                <path d="M30 68V48L50 32L70 48V68H30Z" fill="#1B365D" />
                <path d="M22 48L50 25L78 48" stroke="#D93829" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="sm:flex hidden flex-col">
              <span className="text-[#D93829] font-black text-lg md:text-xl tracking-tight uppercase leading-none">
                СТРОЙОПТТОРГ
              </span>
              <span className="text-[8.5px] md:text-[9px] text-[#1B365D] font-bold uppercase tracking-wider mt-1 leading-none">
                Всё для строительства и ремонта
              </span>
            </div>
          </Link>

          {/* Tablet Icon Menu (768px - 1024px) */}
          <div className="hidden md:flex lg:hidden items-center gap-5 md:gap-6 text-gray-700 shrink-0">
            <Link href="/promotions" className="flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors group">
              <Gift className="w-5 h-5 stroke-[1.5] group-hover:scale-105 transition-transform" />
              <span className="text-[10px] text-gray-500 font-normal">Все акции</span>
            </Link>

            <Link href="/login" className="flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors group">
              <User className="w-5 h-5 stroke-[1.5] group-hover:scale-105 transition-transform" />
              <span className="text-[10px] text-gray-500 font-normal">Войти</span>
            </Link>

            <Link href="/compare" className="flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors group">
              <BarChart2 className="w-5 h-5 stroke-[1.5] group-hover:scale-105 transition-transform" />
              <span className="text-[10px] text-gray-500 font-normal">Сравнение</span>
            </Link>

            <Link href="/favorites" className="flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors group relative">
              <div className="relative">
                <Heart className="w-5 h-5 stroke-[1.5] group-hover:scale-105 transition-transform" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#D93829] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-500 font-normal">Избранное</span>
            </Link>

            <button 
              type="button" 
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center gap-0.5 hover:text-[#2563EB] transition-colors group cursor-pointer focus:outline-none relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 stroke-[1.5] group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#D93829] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-500 font-normal">Корзина</span>
            </button>
          </div>

          {/* Mobile Icon Menu (< 768px) */}
          <div className="flex md:hidden items-center gap-3 text-gray-700">
            <Link href="/login" className="p-1 hover:text-[#2563EB]">
              <User className="w-5 h-5 stroke-[1.8]" />
            </Link>
            <Link href="/compare" className="p-1 hover:text-[#2563EB]">
              <BarChart2 className="w-5 h-5 stroke-[1.8]" />
            </Link>
            <Link href="/favorites" className="p-1 hover:text-[#2563EB] relative">
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D93829] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="p-1 hover:text-[#2563EB] relative focus:outline-none"
            >
              <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D93829] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Catalog Button & Search Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 w-full lg:max-w-2xl relative">
          <button
            type="button"
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className="flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-4 md:px-6 h-10 md:h-11 rounded-lg transition-colors shrink-0 text-xs uppercase tracking-wider shadow-xs active:scale-95 cursor-pointer"
          >
            {isCatalogOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <div className="flex flex-col gap-1 w-4">
                <span className="h-0.5 w-full bg-white rounded-full"></span>
                <span className="h-0.5 w-full bg-white rounded-full"></span>
              </div>
            )}
            <span>КАТАЛОГ</span>
          </button>

          {isCatalogOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsCatalogOpen(false)} 
              />
              
              <div className="absolute top-12 md:top-14 left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-20">
                <div className="flex flex-col">
                  {catalogCategories.map((category, idx) => (
                    <Link
                      key={idx}
                      href={category.href}
                      onClick={() => setIsCatalogOpen(false)}
                      className="px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#EEF4FF] hover:text-[#2563EB] transition-colors"
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          <form className="flex-1 relative flex items-center h-10 md:h-11" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Найти среди 50000 товаров. Например: Дрель Bosch"
              className="w-full h-full border-2 border-[#2563EB] rounded-lg pl-3 md:pl-4 pr-11 md:pr-12 text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-white"
            />
            <button
              type="submit"
              aria-label="Поиск"
              className="absolute right-0 top-0 bottom-0 w-10 md:w-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-r-[5px] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5 stroke-[2]" />
            </button>
          </form>
        </div>

        {/* Desktop Right Icons (1024px+) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7 text-gray-700 shrink-0">
          <Link href="/promotions" className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group">
            <Gift className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
            <span className="text-[11px] text-gray-500 font-normal">Все акции</span>
          </Link>

          <Link href="/login" className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group">
            <User className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
            <span className="text-[11px] text-gray-500 font-normal">Войти</span>
          </Link>

          <Link href="/compare" className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group">
            <BarChart2 className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
            <span className="text-[11px] text-gray-500 font-normal">Сравнение</span>
          </Link>

          <Link href="/favorites" className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group relative">
            <div className="relative">
              <Heart className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#D93829] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-500 font-normal">Избранное</span>
          </Link>

          <button 
            type="button" 
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 hover:text-[#2563EB] transition-colors group cursor-pointer focus:outline-none relative"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#D93829] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-500 font-normal">Корзина</span>
          </button>
        </div>

      </div>

      {/* Cart Discount Modal */}
      <CartDiscountBanner 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Mobile/Tablet Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <aside className="relative w-full max-w-xs bg-white z-10 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Меню</h2>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto divide-y divide-gray-100">
              <Link
                href="/promotions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-xs font-semibold text-gray-900 hover:bg-gray-50 uppercase tracking-wide"
              >
                <Gift className="w-4 h-4 text-gray-700" />
                <span>ВСЕ АКЦИИ</span>
              </Link>

              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-5 py-3.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#2563EB] uppercase tracking-wide"
                >
                  {item.uppercaseLabel}
                </Link>
              ))}
            </nav>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
              <a
                href="tel:88004440065"
                className="text-base font-bold text-gray-900 hover:text-[#2563EB] transition-colors"
              >
                8 800 444 00 65
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCallbackOpen(true);
                }}
                className="w-full bg-[#2563EB] text-white text-xs font-bold py-2.5 rounded uppercase tracking-wider hover:bg-blue-700 transition-colors cursor-pointer"
              >
                ЗАКАЗАТЬ ЗВОНОК
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Callback Modal */}
      {isCallbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl relative">
            <button 
              onClick={() => setIsCallbackOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-gray-900 mb-1">Заказать звонок</h3>
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
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs mb-3 focus:outline-none focus:border-[#2563EB]"
              />
              <button 
                type="submit" 
                className="w-full bg-[#2563EB] text-white py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
