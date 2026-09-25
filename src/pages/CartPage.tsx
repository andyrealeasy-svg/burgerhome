import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Check,
  Percent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotal,
    appliedPromo,
    promoDiscount,
    deliveryFee,
    applyPromoCode,
    removePromoCode,
    currentAddress,
    orderType,
    setCurrentPage,
    addToCart,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Recommendations: select top snacks, drinks, and sauces not already in cart
  const recommendations = PRODUCTS.filter(
    (p) =>
      (p.category === 'snacks' || p.category === 'drinks' || p.category === 'sauces') &&
      !cart.some((item) => item.product.id === p.id)
  ).slice(0, 3);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
    setTimeout(() => setPromoMessage(null), 3500);
  };

  const handleQuickPromoClick = (code: string) => {
    const res = applyPromoCode(code);
    setPromoMessage({ text: res.message, isError: !res.success });
    setTimeout(() => setPromoMessage(null), 3500);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-8 sm:p-14 text-center max-w-lg mx-auto my-6 space-y-5 animate-fade-up shadow-xs transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Ваша корзина пуста
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
            Самое время выбрать сочный бургер, хрустящие закуски или фирменный комбо
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('menu')}
          className="px-6 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 font-extrabold text-xs sm:text-sm transition-all active:scale-95 shadow-xs"
        >
          Перейти в меню
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-36 md:pb-28 animate-fade-up">
        {/* 1. TOP SMALL BLOCK WITH ADDRESS */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-2xl border border-neutral-200/80 dark:border-white/10 p-3.5 sm:p-4 shadow-xs flex items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2.5 min-w-0">
          <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              {orderType === 'delivery' ? 'Адрес доставки' : 'Самовывоз из ресторана'}
            </span>
            <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
              {currentAddress}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('address')}
          className="text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors shrink-0"
        >
          Выбрать на карте
        </button>
      </section>

      {/* 2. LIST OF SELECTED ITEMS */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-white/5">
          <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white uppercase">
            Товары в заказе ({cart.length})
          </h2>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Очистить корзину
          </button>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-white/5">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Product Info */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    fallbackText={item.product.name}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight leading-snug">
                    {item.product.name}
                  </h3>

                  {/* Modifiers info: removed ingredients & added addons */}
                  {(item.removedIngredients.length > 0 || item.addedAddons.length > 0) && (
                    <div className="mt-1 space-y-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                      {item.removedIngredients.length > 0 && (
                        <p className="text-red-500 font-medium">
                          Без: {item.removedIngredients.join(', ')}
                        </p>
                      )}
                      {item.addedAddons.length > 0 && (
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                          + {item.addedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400 sm:hidden tabular-nums">
                    {item.unitPrice} ₽ / шт.
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-19 sm:pl-0">
                {/* Stepper */}
                <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl p-0.5 border border-neutral-200/60 dark:border-white/10">
                  <button
                    onClick={() => updateCartQuantity(item.cartItemId, -1)}
                    aria-label="Уменьшить количество"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.cartItemId, 1)}
                    aria-label="Увеличить количество"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Total price for line */}
                <div className="text-right min-w-[70px]">
                  <span className="text-sm font-extrabold text-neutral-950 dark:text-white tabular-nums">
                    {item.totalPrice} ₽
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  aria-label="Удалить из корзины"
                  className="p-1.5 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. RECOMMENDATIONS TO ADD TO ORDER (Рекомендации для добавления к заказу) */}
      {recommendations.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900 dark:text-white uppercase">
              Добавить к заказу
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white dark:bg-[#1A1D23] rounded-2xl border border-neutral-200/80 dark:border-white/10 p-3 flex items-center justify-between gap-3 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                    <ImageWithFallback
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-full object-cover"
                      fallbackText={rec.name}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {rec.name}
                    </h4>
                    <span className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300 tabular-nums">
                      {rec.price} ₽
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(rec, [], [], 1)}
                  aria-label={`Добавить ${rec.name}`}
                  className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0 transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. PROMOTIONS & PROMO CODES BLOCK (Акции и промокоды) */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-500" />
          <h2 className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-white uppercase">
            Акции и промокоды
          </h2>
        </div>

        {/* Promo code form */}
        <form onSubmit={handleApplyPromo} className="space-y-2.5">
          <input
            type="text"
            placeholder="Введите промокод (например, START20)"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-xs sm:text-sm uppercase tracking-wider font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Применить
          </button>
        </form>

        {promoMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              promoMessage.isError
                ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {!promoMessage.isError && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
            <span>{promoMessage.text}</span>
          </div>
        )}

        {/* Applied Promo Banner if active */}
        {appliedPromo && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-500" />
              <span>
                Активный промокод: <span className="font-mono">{appliedPromo}</span>
                {promoDiscount > 0 && ` (Скидка: -${promoDiscount} ₽)`}
              </span>
            </div>
            <button
              onClick={removePromoCode}
              className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Отменить
            </button>
          </div>
        )}

        {/* Quick Promo Action Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Быстрый выбор:</span>
          <button
            type="button"
            onClick={() => handleQuickPromoClick('START20')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              appliedPromo === 'START20'
                ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200'
                : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            START20 (-20%)
          </button>
          <button
            type="button"
            onClick={() => handleQuickPromoClick('2FOR1')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              appliedPromo === '2FOR1'
                ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200'
                : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            2 бургера вместо 1 (1+1)
          </button>
        </div>
      </section>

      {/* 5. ORDER SUMMARY BREAKDOWN */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 space-y-2.5 text-xs sm:text-sm transition-colors">
        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Сумма заказа:</span>
          <span className="font-bold text-neutral-900 dark:text-white tabular-nums">{cartSubtotal} ₽</span>
        </div>

        {promoDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
            <span>Скидка по промокоду ({appliedPromo}):</span>
            <span className="tabular-nums">-{promoDiscount} ₽</span>
          </div>
        )}

        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Доставка ({orderType === 'delivery' ? 'Курьер' : 'Самовывоз'}):</span>
          <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
            {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}
          </span>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-white/5 flex justify-between items-baseline text-base font-extrabold text-neutral-950 dark:text-white">
          <span>Итого:</span>
          <span className="text-xl font-extrabold text-emerald-500 tabular-nums">
            {cartTotal} ₽
          </span>
        </div>
      </section>
    </div>

    {/* FLOATING ACTION BAR OVER THE INTERFACE (Летает поверх интерфейса) */}
    {typeof document !== 'undefined' &&
      createPortal(
        <div className="fixed bottom-[74px] md:bottom-6 left-0 md:left-64 lg:left-72 right-0 z-40 px-3 sm:px-6 pointer-events-none transition-all duration-200">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <button
              type="button"
              onClick={() => setCurrentPage('checkout')}
              className="w-full py-4 px-5 sm:px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 font-black text-sm sm:text-base flex items-center justify-between transition-all duration-200 active:scale-[0.98] shadow-2xl hover:shadow-emerald-500/20 border border-white/15 dark:border-emerald-400/30 group cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span>Оформить заказ</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] group-hover:translate-x-1.5 transition-transform" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-900/80">Итого:</span>
                <span className="text-base sm:text-lg font-black text-emerald-400 dark:text-neutral-950 tabular-nums">
                  {cartTotal} ₽
                </span>
              </div>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
