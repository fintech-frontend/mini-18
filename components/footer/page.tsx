'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Send, X, Gift, Menu } from 'lucide-react';
import { styles } from '@/styles/index.styles';

// ==========================================
// 1. MA'LUMOTLAR (DATA)
// ==========================================

const menuItems = [
  { label: 'ВСЕ АКЦИИ', href: '/promotions', isSpecial: true },
  { label: 'О КОМПАНИИ', href: '/about' },
  { label: 'ОПЛАТА', href: '/payment' },
  { label: 'ДОСТАВКА', href: '/delivery' },
  { label: 'ВОЗВРАТ', href: '/returns' },
  { label: 'ОТЗЫВЫ', href: '/reviews' },
  { label: 'ВОПРОС-ОТВЕТ', href: '/faq' },
  { label: 'НОВОСТИ', href: '/news' },
  { label: 'КОНТАКТЫ', href: '/contacts' },
];

const footerInformation = [
  { label: 'О компании', href: '/about' },
  { label: 'Вопрос-ответ', href: '/faq' },
  { label: 'Оплата', href: '/payment' },
  { label: 'Новости', href: '/news' },
  { label: 'Доставка', href: '/delivery' },
  { label: 'Контакты', href: '/contacts' },
  { label: 'Возврат', href: '/returns' },
  { label: 'Вход \\ Регистрация', href: '/login' },
  { label: 'Отзывы', href: '/reviews' },
  { label: 'Все акции', href: '/promotions' },
];

const footerCatalogColumn1 = [
  'Общестроительные материалы',
  'Все для сауны и бани',
  'Инструмент',
  'Отделочные материалы',
  'Товары для дома, сада и огорода',
  'Водо-газоснабжение, отопление, вентиляция',
];

const footerCatalogColumn2 = [
  'Электротовары',
  'Сантехника',
  'Столярные изделия',
  'Спецодежда и средства индивидуальной пожарной защиты',
  'Метизные, такелажные и скобяные изделия',
];

// ==========================================
// 2. YON MENYU KOMPONENTI (DRAWER)
// ==========================================

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      {/* Dark Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Side Menu Content */}
      <div className="relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-300">
        <div>
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#222222]">Меню</h2>
            <button 
              onClick={onClose} 
              aria-label="Закрыть меню"
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 text-xs font-bold text-[#222222] hover:bg-gray-50 hover:text-[#d93829] transition-colors uppercase tracking-wide"
              >
                {item.isSpecial && <Gift className="w-5 h-5 text-[#222222]" />}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Menu Footer Contacts */}
        <div className="p-5 border-t border-gray-100 flex flex-col items-center text-center bg-white gap-2">
          <a
            href="tel:88004440065"
            className="text-xl font-black text-[#111827] hover:text-[#2563eb] transition-colors tracking-tight"
          >
            8 800 444 00 65
          </a>

          <button
            type="button"
            className="w-full bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#1e40af] text-xs font-bold py-2.5 px-4 rounded-md uppercase tracking-wider transition-colors mt-1"
          >
            ЗАКАЗАТЬ ЗВОНОК
          </button>

          <span className="text-[11px] font-medium text-gray-500 mt-1">
            Ежедневно, с 8:00 до 18:00
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. ASOSIY FOOTER KOMPONENTI
// ==========================================

export default function FooterWithMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert(`Подписка оформлена: ${email}`);
    setEmail('');
  };

  return (
    <>
      {/* Yon mobil menyu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Footer */}
      <footer className="w-full bg-[#f4f5f7] border-t border-gray-200 font-sans text-[#333333]">
        <div className={`${styles?.container} py-8 lg:py-10 flex flex-col gap-8`}>
          
          {/* ================= 1. LOGO, MENYU TUGMASI VA KONTAKTLAR ================= */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
            
            <div className="flex items-center justify-between md:justify-start gap-4 lg:gap-12 w-full md:w-auto">
              <Link href="/" className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 lg:w-11 lg:h-11 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="44" stroke="#d93829" strokeWidth="8" />
                    <path d="M30 68V48L50 32L70 48V68H30Z" fill="#1b365d" />
                    <path d="M22 48L50 25L78 48" stroke="#d93829" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="sm:flex hidden flex-col">
                  <span className="font-black text-lg lg:text-xl leading-none text-[#d93829] tracking-tight uppercase">
                    СТРОЙОПТТОРГ
                  </span>
                  <span className="text-[8.5px] lg:text-[9.5px] font-bold text-[#1b365d] tracking-tight mt-1 uppercase">
                    Всё для строительства и ремонта
                  </span>
                </div>
              </Link>

              {/* Mobil menyuni ochish tugmasi */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-50 active:scale-95 transition-all text-xs font-bold text-gray-800"
              >
                <Menu className="w-4 h-4 text-[#d93829]" />
                <span>МЕНЮ</span>
              </button>

              <div className="text-xs text-gray-600 hidden sm:block">
                <span className="text-gray-400 block text-[11px]">Email:</span>
                <a href="mailto:info@stroiopt-torg.ru" className="text-[#2563eb] hover:underline font-medium">
                  info@stroiopt-torg.ru
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 lg:gap-6 w-full md:w-auto">
              <div className="flex flex-col text-left md:text-right">
                <a
                  href="tel:88004440065"
                  className="text-lg lg:text-xl font-extrabold text-gray-900 leading-none hover:text-[#2563eb] transition-colors"
                >
                  8 800 444 00 65
                </a>
                <span className="text-[11px] lg:text-xs text-gray-500 mt-1">
                  Ежедневно, с 8:00 до 18:00
                </span>
              </div>

              <button
                type="button"
                className="border border-[#fca5a5] text-[#d93829] bg-white hover:bg-[#d93829] hover:text-white text-[11px] font-bold px-4 py-2.5 rounded transition-all uppercase tracking-wider shrink-0 active:scale-95"
              >
                ЗАКАЗАТЬ ЗВОНОК
              </button>
            </div>

          </div>

          {/* ================= 2. ИНФОРМАЦИЯ VA КАТАЛОГ ================= */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 pb-6 border-b border-gray-200">
            
            {/* ИНФОРМАЦИЯ */}
            <div className="md:col-span-5 flex flex-col">
              <button
                type="button"
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className="flex items-center justify-between w-full py-2 md:py-0 text-left font-bold text-base text-gray-900 md:cursor-default"
              >
                <span>Информация</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 md:hidden ${isInfoOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-gray-600 mt-3 ${isInfoOpen ? 'grid' : 'hidden md:grid'}`}>
                <div className="flex flex-col gap-2">
                  {footerInformation.filter((_, i) => i % 2 === 0).map((item, idx) => (
                    <Link key={idx} href={item.href} className="hover:text-[#2563eb] transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {footerInformation.filter((_, i) => i % 2 !== 0).map((item, idx) => (
                    <Link key={idx} href={item.href} className="hover:text-[#2563eb] transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* КАТАЛОГ */}
            <div className="md:col-span-7 flex flex-col">
              <button
                type="button"
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className="flex items-center justify-between w-full py-2 md:py-0 text-left font-bold text-base text-gray-900 md:cursor-default"
              >
                <span>Каталог</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 md:hidden ${isCatalogOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-gray-600 mt-3 ${isCatalogOpen ? 'grid' : 'hidden md:grid'}`}>
                <div className="flex flex-col gap-2">
                  {footerCatalogColumn1.map((item, idx) => (
                    <Link key={idx} href="/catalog" className="hover:text-[#2563eb] transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {footerCatalogColumn2.map((item, idx) => (
                    <Link key={idx} href="/catalog" className="hover:text-[#2563eb] transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ================= 3. TO'LOV TIZIMLARI VA OBUNA ================= */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-200">
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400">
              <span className="font-black italic text-lg tracking-tighter text-gray-400 select-none">VISA</span>
              <div className="flex items-center -space-x-1 opacity-60">
                <div className="w-4 h-4 rounded-full bg-gray-500" />
                <div className="w-4 h-4 rounded-full bg-gray-400" />
              </div>
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v-2.1c2.1-.3 3.6-2 3.6-4.1 0-2.3-1.8-4.2-4.1-4.3V4h-1v2C9.4 6.3 7.9 8 7.9 10.1c0 2.3 1.8 4.2 4.1 4.3v2.1c-2.1.3-3.6 2-3.6 4.1 0-2.3 1.8 4.2 4.1 4.3v1.9h1v-1.9c2.1-.3 3.6-2 3.6-4.1 0-2.3-1.8-4.2-4.1-4.3z"/>
              </svg>
              <span className="font-black text-xs tracking-wider uppercase text-gray-400 select-none">МИР</span>
              <span className="font-bold text-xs lowercase text-gray-400 tracking-wide select-none">халва</span>
              <span className="font-bold text-[11px] tracking-widest uppercase text-gray-400 select-none">TINKOFF</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <span className="text-xs font-semibold text-gray-700 text-center sm:text-left leading-tight whitespace-nowrap">
                Подпишитесь на рассылку <br className="hidden sm:inline" /> и будьте в курсе!
              </span>

              <form onSubmit={handleSubscribe} className="relative w-full sm:w-72">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2563eb] shadow-sm transition-all"
                />
                <button
                  type="submit"
                  aria-label="Подписаться"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 text-gray-500 hover:text-[#2563eb] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          {/* ================= 4. HUQUQIY AXBOROT VA DASTURCHILAR ================= */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] lg:text-[11px] text-gray-400 text-center md:text-left">
            <div>
              © 2003-2023 Интернет-магазин ООО «Стройоптторг» р/с 40702810360000102415
              <br />
              в Ставропольское отделение №5230 ПАО Сбербанк, БИК 040702615
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8">
              <Link href="/privacy-policy" className="underline hover:text-gray-600 transition-colors">
                Политика конфиденциальности
              </Link>

              <a
                href="https://readycode.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center font-black text-[10px] text-gray-500">
                  E
                </div>
                <div className="flex flex-col text-[7px] leading-tight font-semibold uppercase tracking-wider text-left">
                  <span className="text-gray-400">РАЗРАБОТКА САЙТА</span>
                  <span className="text-[9px] font-bold text-gray-600">
                    READYCODE.RU
                  </span>
                </div>
              </a>
            </div>
          </div>   

        </div>
      </footer>
    </>
  );
}