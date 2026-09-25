import React, { useState } from 'react';
import {
  Clock,
  Mail,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InteractiveDeliveryMap } from '../components/InteractiveDeliveryMap';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    appliedPromo,
    promoDiscount,
    deliveryFee,
    currentAddress,
    orderType,
    user,
    createOrder,
    setCurrentPage,
    lastCreatedOrder,
  } = useApp();

  // Cooking start mode: immediately ('now') or scheduled ('scheduled')
  const [cookingMode, setCookingMode] = useState<'now' | 'scheduled'>('now');
  const [scheduledTime, setScheduledTime] = useState<string>('14:30');

  // Email for receipt
  const [email, setEmail] = useState<string>(user?.email || '');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Payment method: 'card' or 'cash'
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cashChange, setCashChange] = useState<string>('Без сдачи');

  // Post-order success screen state
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const timeSlots = ['13:30', '14:00', '14:30', '15:00', '16:00', '17:30', '19:00', '20:30'];

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailError('Пожалуйста, укажите корректный email для отправки чека');
      return;
    }
    setEmailError(null);

    if (cart.length === 0) {
      alert('Корзина пуста. Добавьте товары из меню перед оформлением.');
      setCurrentPage('menu');
      return;
    }

    const newOrder = createOrder({
      items: cart,
      subtotal: cartSubtotal,
      discount: promoDiscount,
      promoCode: appliedPromo || undefined,
      deliveryFee,
      totalAmount: cartTotal,
      deliveryType: orderType,
      address: currentAddress,
      startCooking: cookingMode,
      scheduledTime: cookingMode === 'scheduled' ? scheduledTime : undefined,
      email: email.trim(),
      paymentMethod,
    });

    setConfirmedOrderId(newOrder.orderNumber);
    setOrderSubmitted(true);
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderSubmitted || (lastCreatedOrder && cart.length === 0 && orderSubmitted)) {
    return (
      <div className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-6 sm:p-12 text-center max-w-xl mx-auto my-6 space-y-6 shadow-sm animate-fade-up transition-colors">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
            Заказ успешно принят!
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            {confirmedOrderId || 'Заказ принят'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-md mx-auto">
            Шеф уже получил ваш заказ и приступает к приготовлению. Электронный чек отправлен на почту{' '}
            <span className="font-semibold text-neutral-900 dark:text-white">{email}</span>.
          </p>
        </div>

        {/* Order Details Receipt Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/10 text-left space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Способ получения:</span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {orderType === 'delivery' ? 'Доставка курьером' : 'Самовывоз из ресторана'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Адрес:</span>
            <span className="font-bold text-neutral-900 dark:text-white text-right truncate max-w-[240px]">
              {currentAddress}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Время готовки:</span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {cookingMode === 'now' ? 'Сразу (~25–35 мин)' : `Ко времени (${scheduledTime})`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Способ оплаты:</span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {paymentMethod === 'card' ? 'Банковской картой' : `Наличными (${cashChange})`}
            </span>
          </div>
          <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex justify-between font-extrabold text-sm text-neutral-950 dark:text-white">
            <span>Итого к оплате:</span>
            <span className="text-emerald-500 tabular-nums">{cartTotal} ₽</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setCurrentPage('profile')}
            className="flex-1 py-3 px-5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 text-xs sm:text-sm font-bold transition-all active:scale-95"
          >
            В личный кабинет к истории
          </button>
          <button
            onClick={() => {
              setOrderSubmitted(false);
              setCurrentPage('menu');
            }}
            className="flex-1 py-3 px-5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-bold transition-colors"
          >
            Вернуться в меню
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-8 animate-fade-up">
      {/* 1. БОЛЬШОЙ БЛОК С КАРТОЙ И АДРЕСОМ РЕСТОРАНА ИЛИ ДОСТАВКИ (С ОРИЕНТИРОВОЧНЫМ ВРЕМЕНЕМ) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white uppercase">
            1. Локация и доставка
          </h2>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
            Шаг 1 из 3
          </span>
        </div>

        <InteractiveDeliveryMap />
      </section>

      {/* 2. ВЫБОР НАЧАЛА ГОТОВКИ (СРАЗУ ИЛИ КО ВРЕМЕНИ С ВЫБОРОМ ВРЕМЕНИ) */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white uppercase">
            2. Время начала приготовления
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option: Сразу */}
          <button
            type="button"
            onClick={() => setCookingMode('now')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              cookingMode === 'now'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-neutral-950 dark:text-white shadow-xs'
                : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-extrabold text-neutral-900 dark:text-white">
                Начать готовить сразу
              </span>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  cookingMode === 'now' ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300 dark:border-neutral-600'
                }`}
              >
                {cookingMode === 'now' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Повара начнут готовить немедленно. Доставка через ~25–35 мин.
            </p>
          </button>

          {/* Option: Ко времени */}
          <button
            type="button"
            onClick={() => setCookingMode('scheduled')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              cookingMode === 'scheduled'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-neutral-950 dark:text-white shadow-xs'
                : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-extrabold text-neutral-900 dark:text-white">
                Ко времени
              </span>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  cookingMode === 'scheduled'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-neutral-300 dark:border-neutral-600'
                }`}
              >
                {cookingMode === 'scheduled' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Приготовим к указанному времени сегодня.
            </p>
          </button>
        </div>

        {/* Time Selector when 'Ко времени' is active */}
        {cookingMode === 'scheduled' && (
          <div className="pt-3 border-t border-neutral-100 dark:border-white/5 space-y-3 animate-fade-up">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Выберите желаемое время выдачи/доставки:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setScheduledTime(time)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                    scheduledTime === time
                      ? 'bg-neutral-900 text-white dark:bg-emerald-500 dark:text-neutral-950 shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {time}
                </button>
              ))}

              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-xs text-neutral-400 dark:text-neutral-500">Свое время:</span>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-mono bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. ПОЛЕ ДЛЯ ВВОДА EMAIL ДЛЯ ЧЕКА */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-3 transition-colors">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white uppercase">
            3. Email для электронного чека
          </h2>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Согласно 54-ФЗ электронный чек и уведомление о статусе готовки будут отправлены на этот адрес:
        </p>

        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="example@mail.ru"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-white/10 text-sm bg-neutral-50/40 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:bg-white dark:focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {emailError && (
            <p className="text-xs font-medium text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{emailError}</span>
            </p>
          )}
        </div>
      </section>

      {/* 4. ВЫБОР СПОСОБА ОПЛАТЫ (НАЛИЧНЫЕ, КАРТА) */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white uppercase">
            4. Способ оплаты
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              paymentMethod === 'card'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-neutral-950 dark:text-white shadow-xs'
                : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <div className="p-2 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 shadow-2xs shrink-0">
              <CreditCard className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-neutral-900 dark:text-white">
                  Банковской картой
                </span>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300 dark:border-neutral-600'
                  }`}
                >
                  {paymentMethod === 'card' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Онлайн или курьеру через терминал
              </p>
            </div>
          </button>

          {/* Cash */}
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              paymentMethod === 'cash'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-neutral-950 dark:text-white shadow-xs'
                : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <div className="p-2 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 shadow-2xs shrink-0">
              <Banknote className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-neutral-900 dark:text-white">
                  Наличными
                </span>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300 dark:border-neutral-600'
                  }`}
                >
                  {paymentMethod === 'cash' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Оплата курьеру или при самовывозе
              </p>
            </div>
          </button>
        </div>

        {/* Change requirement if cash */}
        {paymentMethod === 'cash' && (
          <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center gap-2 text-xs animate-fade-up">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Подготовить сдачу:</span>
            {['Без сдачи', 'с 1000 ₽', 'с 2000 ₽', 'с 5000 ₽'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCashChange(c)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                  cashChange === c
                    ? 'bg-neutral-900 text-white dark:bg-emerald-500 dark:text-neutral-950 border-neutral-900 dark:border-emerald-500'
                    : 'border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 5. ORDER SUMMARY & SUBMIT */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-white uppercase">
          Сводка по заказу ({cart.length} поз.)
        </h3>

        <div className="space-y-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex justify-between">
            <span>Стоимость блюд:</span>
            <span className="font-bold text-neutral-900 dark:text-white tabular-nums">{cartSubtotal} ₽</span>
          </div>

          {promoDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Скидка ({appliedPromo}):</span>
              <span className="tabular-nums">-{promoDiscount} ₽</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Доставка:</span>
            <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
              {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}
            </span>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex justify-between items-baseline text-base sm:text-lg font-black text-neutral-950 dark:text-white">
            <span>Итого к оплате:</span>
            <span className="text-2xl font-black text-emerald-500 tabular-nums">
              {cartTotal} ₽
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 active:scale-[0.99] text-white dark:text-neutral-950 font-black text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <span>Подтвердить заказ</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Безопасная оплата. Готовим из свежих продуктов по стандартам качества.</span>
        </div>
      </section>
    </form>
  );
};
