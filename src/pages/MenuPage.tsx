import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Bike,
  Store,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, INITIAL_BANK_ADDRESSES, RESTAURANT_LOCATIONS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory } from '../types';

export const MenuPage: React.FC = () => {
  const {
    orderType,
    setOrderType,
    currentAddress,
    setCurrentAddress,
    currentRestaurant,
    setCurrentRestaurant,
    setCurrentPage,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'Все меню' },
    { id: 'combo', label: 'Комбо' },
    { id: 'burgers', label: 'Бургеры' },
    { id: 'snacks', label: 'Закуски' },
    { id: 'drinks', label: 'Напитки' },
    { id: 'sauces', label: 'Соусы' },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' ? true : product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-up">
      {/* 1. TOP SMALL BLOCK: Ресторан / Доставка и адрес */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-2xl border border-neutral-200/80 dark:border-white/10 p-3 sm:p-4 shadow-xs relative transition-colors space-y-3">
        {/* Toggle: Доставка / Самовывоз (Во всю ширину соответствующего блока) */}
        <div className="w-full grid grid-cols-2 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              orderType === 'delivery'
                ? 'bg-white dark:bg-[#1F242C] text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Доставка</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('pickup')}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              orderType === 'pickup'
                ? 'bg-white dark:bg-[#1F242C] text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Самовывоз</span>
          </button>
        </div>

        {/* Current Address & Change Trigger */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-neutral-100 dark:border-white/5">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="min-w-0 text-left">
              <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {orderType === 'delivery' ? 'Адрес доставки' : 'Ресторан для самовывоза'}
              </span>
              <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                {orderType === 'delivery' ? currentAddress : currentRestaurant}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
              <Clock className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>{orderType === 'delivery' ? '~25–35 мин' : '~15 мин'}</span>
            </span>

            <button
              onClick={() => setCurrentPage('address')}
              className="text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Выбрать на карте</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Address Dropdown / Selector */}
        {showAddressDropdown && (
          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5 space-y-2 animate-fade-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {orderType === 'delivery' ? 'Выберите адрес доставки:' : 'Выберите ресторан:'}
              </span>
              <button
                onClick={() => {
                  setShowAddressDropdown(false);
                  setCurrentPage('checkout');
                }}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
              >
                Открыть карту оформления
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {orderType === 'delivery'
                ? INITIAL_BANK_ADDRESSES.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setCurrentAddress(b.address);
                        setShowAddressDropdown(false);
                      }}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-colors ${
                        currentAddress === b.address
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-neutral-950 dark:text-white font-bold'
                          : 'border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 font-medium'
                      }`}
                    >
                      <div className="font-bold">{b.title}</div>
                      <div className="text-neutral-500 dark:text-neutral-400 truncate text-[11px]">{b.address}</div>
                    </button>
                  ))
                : RESTAURANT_LOCATIONS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRestaurant(`${r.name}, ${r.address}`);
                        setCurrentAddress(r.address);
                        setShowAddressDropdown(false);
                      }}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-colors ${
                        currentRestaurant.includes(r.name)
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-neutral-950 dark:text-white font-bold'
                          : 'border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 font-medium'
                      }`}
                    >
                      <div className="font-bold">{r.name}</div>
                      <div className="text-neutral-500 dark:text-neutral-400 truncate text-[11px]">{r.address}</div>
                    </button>
                  ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. CATEGORY FILTRATION & SEARCH */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs: комбо, бургеры, напитки, закуски и соусы */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-emerald-500 dark:text-neutral-950 shadow-xs'
                      : 'bg-white dark:bg-[#1A1D23] border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по меню..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1A1D23] text-neutral-900 dark:text-white text-xs sm:text-sm placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category count indicator */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium px-1">
          <span>Найдено позиций: {filteredProducts.length}</span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Нажмите на карточку для настройки ингредиентов
          </span>
        </div>
      </section>

      {/* 3. PRODUCT CARDS GRID */}
      <section>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 space-y-3">
            <p className="text-base font-bold text-neutral-900 dark:text-white">
              По вашему запросу ничего не найдено
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
              Попробуйте изменить категорию или сбросить поисковый запрос
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-emerald-500 text-white dark:text-neutral-950 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-emerald-600 transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
