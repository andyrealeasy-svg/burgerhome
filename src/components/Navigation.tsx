import React from 'react';
import { Home, UtensilsCrossed, ShoppingBag, User, MapPin, Bike, Store, Sun, Moon } from 'lucide-react';
import { useApp, Page } from '../context/AppContext';
import { BurgerLogoIcon } from './BurgerLogoIcon';

export const Navigation: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    cartCount,
    cartTotal,
    orderType,
    setOrderType,
    currentAddress,
    user,
    theme,
    toggleTheme,
  } = useApp();

  const navItems: { id: Page; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'menu', label: 'Меню', icon: UtensilsCrossed },
    { id: 'cart', label: 'Корзина', icon: ShoppingBag },
    { id: 'profile', label: 'Кабинет', icon: User },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (md and above) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen fixed left-0 top-0 bg-white dark:bg-[#181B20] border-r border-neutral-200/80 dark:border-white/10 z-40 select-none transition-colors duration-250">
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-white/5">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-left group block w-full focus:outline-none"
          >
            <div className="flex items-center gap-2.5">
              <BurgerLogoIcon className="w-8 h-8 shrink-0 group-hover:scale-105 transition-transform" />
              <h1 className="text-xl font-extrabold tracking-tighter text-neutral-950 dark:text-white uppercase group-hover:text-emerald-500 transition-colors duration-200">
                BURGER HOME
              </h1>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 tracking-tight mt-1 font-medium">
              Премиальные бургеры & доставка
            </p>
          </button>

          {/* Delivery Mode Switcher */}
          <div className="mt-5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl flex items-center">
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                orderType === 'delivery'
                  ? 'bg-white dark:bg-[#1F242C] text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5 text-emerald-500" />
              <span>Доставка</span>
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                orderType === 'pickup'
                  ? 'bg-white dark:bg-[#1F242C] text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-emerald-500" />
              <span>Самовывоз</span>
            </button>
          </div>

          {/* Current Address Snippet (Desktop Sidebar) */}
          <button
            onClick={() => setCurrentPage('address')}
            className="w-full mt-3 flex items-start gap-2 p-2.5 rounded-xl bg-neutral-50/80 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800 text-left transition-colors border border-neutral-200/50 dark:border-white/5 group"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {orderType === 'delivery' ? 'Адрес доставки' : 'Ресторан самовывоза'}
              </span>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                {currentAddress}
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mt-1">
              Изм.
            </span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-emerald-500 dark:text-neutral-950 shadow-sm font-bold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-emerald-400 dark:text-neutral-950'
                        : 'text-neutral-400 dark:text-neutral-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.id === 'cart' && cartCount > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-md tabular-nums ${
                      isActive
                        ? 'bg-emerald-500 text-white dark:bg-neutral-950 dark:text-emerald-400'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    }`}
                  >
                    {cartCount}
                  </span>
                )}

                {item.id === 'profile' && user && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Cart Quick Preview and Theme Toggle at very bottom */}
        <div className="p-4 border-t border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3">
          {cartCount > 0 ? (
            <button
              onClick={() => setCurrentPage('cart')}
              className="w-full p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white flex items-center justify-between transition-all duration-200 shadow-sm"
            >
              <div className="text-left">
                <span className="block text-[11px] font-medium text-emerald-100 uppercase tracking-wider">
                  В корзине {cartCount} поз.
                </span>
                <span className="text-sm font-extrabold tabular-nums tracking-tight">
                  {cartTotal} ₽
                </span>
              </div>
              <span className="text-xs font-bold bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg">
                Оформить
              </span>
            </button>
          ) : (
            <div className="px-2 py-0.5 text-center">
              <span className="text-xs text-neutral-400 dark:text-neutral-500 block font-medium">
                Ресторан с 10:00 до 23:00
              </span>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block mt-0.5">
                Горячие бургеры за 20–30 мин
              </span>
            </div>
          )}

          {/* Desktop Theme Switcher Button (in sidebar at the very bottom) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-white/5 cursor-pointer active:scale-98"
            aria-label="Переключить тему оформления"
          >
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-600 shrink-0" />
              )}
              <span>{theme === 'dark' ? 'Светлая тема' : 'Темная тема'}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-400 font-semibold">
              {theme === 'dark' ? 'Свет' : 'Тьма'}
            </span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR (visible on screens < md) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 dark:bg-[#181B20]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-white/10 z-30 px-3.5 sm:px-4 flex items-center justify-between gap-2 transition-colors duration-250">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 focus:outline-none shrink-0 flex-shrink-0 cursor-pointer"
          aria-label="Главная BURGER HOME"
        >
          <BurgerLogoIcon className="w-7 h-7 min-w-7 min-h-7 shrink-0 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-extrabold tracking-tighter text-neutral-950 dark:text-white uppercase whitespace-nowrap">
            BURGER HOME
          </span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Address pill on top (Mobile header) */}
          <button
            onClick={() => setCurrentPage('address')}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold max-w-[120px] xs:max-w-[150px] sm:max-w-[200px] truncate transition-colors border border-neutral-200/60 dark:border-white/5 active:scale-95 shrink"
            aria-label="Выбрать адрес"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{currentAddress}</span>
          </button>

          {/* Mobile Theme Toggle Button (instead of cart button) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-neutral-700 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors border border-neutral-200/60 dark:border-white/10 active:scale-95 cursor-pointer shrink-0 flex-shrink-0"
            aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-300 shrink-0" />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (screens < md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#181B20]/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-white/10 z-40 px-2 flex items-center justify-around safe-bottom select-none transition-colors duration-250">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors duration-200 ${
                isActive
                  ? 'text-neutral-950 dark:text-white font-bold'
                  : 'text-neutral-400 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-emerald-500' : 'text-neutral-400'
                  }`}
                />
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center tabular-nums">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
