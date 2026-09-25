import React, { useState } from 'react';
import { ArrowRight, Sparkles, Tag, Check, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const HomePage: React.FC = () => {
  const { setCurrentPage, openProductModal, applyPromoCode, appliedPromo } = useApp();
  const [promoCopiedMessage, setPromoCopiedMessage] = useState<string | null>(null);

  const heroBurger = PRODUCTS.find((p) => p.id === 'chicken-super-burger') || PRODUCTS[0];
  const popularBurgers = PRODUCTS.filter((p) => p.isPopular).slice(0, 4);

  const handleApplyStart20 = () => {
    const res = applyPromoCode('START20');
    setPromoCopiedMessage(res.message);
    setTimeout(() => setPromoCopiedMessage(null), 3000);
  };

  const handleApply2For1 = () => {
    const res = applyPromoCode('2FOR1');
    setPromoCopiedMessage(res.message);
    setTimeout(() => {
      setPromoCopiedMessage(null);
      setCurrentPage('menu');
    }, 1500);
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-up">
      {/* 1. HERO BLOCK: чикен-супер-бургер */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-xl">
        {/* Subtle ambient backdrop glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          {/* Text & Action column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>Хит сезона · Шеф-рецепт</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight text-balance uppercase">
              Чикен-супер-бургер
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Хрустящая фермерская куриная котлета в авторской панировке, двойной выдержанный сыр Чеддер, сочные маринованные огурчики и домашний соус Ранч на нежной бриоши.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-emerald-400">
                  {heroBurger.price} ₽
                </span>
                <span className="text-xs text-neutral-400 font-medium">/ 320 г</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => openProductModal(heroBurger)}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-extrabold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
                >
                  <span>Заказать сейчас</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => setCurrentPage('menu')}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors"
                >
                  Все меню
                </button>
              </div>
            </div>
          </div>

          {/* Hero Image column */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onClick={() => openProductModal(heroBurger)}
              className="relative w-full max-w-md aspect-4/3 sm:aspect-16/9 lg:aspect-4/3 rounded-2xl overflow-hidden cursor-pointer group shadow-2xl border border-white/10"
            >
              <ImageWithFallback
                src={heroBurger.image}
                alt="Чикен-супер-бургер"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                fallbackText="Чикен-супер-бургер"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-xs text-white text-xs font-bold tracking-tight">
                Быстрый заказ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMOTIONS BLOCK: 2 бургера вместо 1 & Скидка START20 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-500" />
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white uppercase">
              Акции и спецпредложения
            </h2>
          </div>
          <span className="text-xs text-neutral-400 dark:text-neutral-400 font-medium">Обновлено сегодня</span>
        </div>

        {promoCopiedMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 animate-fade-up">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{promoCopiedMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Promo Card 1: 2 бургера вместо 1 */}
          <div className="relative overflow-hidden bg-white dark:bg-[#1A1D23] rounded-2xl border border-neutral-200/90 dark:border-white/10 p-5 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                  Акция 1+1
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-400 font-medium">До конца недели</span>
              </div>
              <h3 className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
                2 бургера вместо 1
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Добавьте любые 2 бургера в корзину — бургер с меньшей стоимостью станет абсолютно бесплатным!
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                Код акции: <span className="font-mono text-neutral-900 dark:text-white font-extrabold">2FOR1</span>
              </span>
              <button
                type="button"
                onClick={handleApply2For1}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  appliedPromo === '2FOR1'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    : 'bg-neutral-900 dark:bg-emerald-500 hover:bg-neutral-800 dark:hover:bg-emerald-600 text-white dark:text-neutral-950'
                }`}
              >
                {appliedPromo === '2FOR1' ? 'Акция активна ✓' : 'Применить акцию'}
              </button>
            </div>
          </div>

          {/* Promo Card 2: START20 discount */}
          <div className="relative overflow-hidden bg-white dark:bg-[#1A1D23] rounded-2xl border border-neutral-200/90 dark:border-white/10 p-5 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                  Скидка -20%
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-400 font-medium">Для всех заказов</span>
              </div>
              <h3 className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Скидка по промокоду START20
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Дарим скидку 20% на весь заказ. Введите промокод в корзине или активируйте в один клик.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Промокод:</span>
                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-xs font-bold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700">
                  START20
                </span>
              </div>
              <button
                type="button"
                onClick={handleApplyStart20}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  appliedPromo === 'START20'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {appliedPromo === 'START20' ? 'Применен ✓' : 'Активировать'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED MENU PICKS (for instant 1-2 min order) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white uppercase">
              Популярное в меню
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Любимые позиции наших гостей с быстрой сборкой
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('menu')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>Всё меню</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularBurgers.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* 4. SPEED & QUALITY PILLARS */}
      <section className="p-6 rounded-3xl bg-neutral-100/70 dark:bg-[#181B20] border border-neutral-200/60 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        <div>
          <span className="text-xs font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            01. Скорость
          </span>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-1">Доставка за 25–35 минут</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
            Готовим сразу после подтверждения. Термосумки сохраняют хруст и тепло.
          </p>
        </div>
        <div>
          <span className="text-xs font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            02. Ингредиенты
          </span>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-1">100% фермерское мясо</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
            Блэк Ангус и отборное куриное филе, свежевыпеченные бриоши каждое утро.
          </p>
        </div>
        <div>
          <span className="text-xs font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            03. Честные цены
          </span>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-1">Выгода с первого заказа</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
            Постоянные спецпредложения, акции 1+1 и бесплатная доставка от 1000 ₽.
          </p>
        </div>
      </section>
    </div>
  );
};
