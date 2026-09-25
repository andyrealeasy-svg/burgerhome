import React from 'react';
import { ArrowLeft, MapPin, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InteractiveDeliveryMap } from '../components/InteractiveDeliveryMap';

export const AddressSelectionPage: React.FC = () => {
  const { setCurrentPage, currentAddress, orderType } = useApp();

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header with back button */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('menu')}
            className="p-2 rounded-xl bg-white dark:bg-[#1A1D23] border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors shadow-2xs cursor-pointer"
            aria-label="Назад к меню"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white uppercase">
              Выбор адреса
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {orderType === 'delivery'
                ? 'Укажите адрес доставки курьером'
                : 'Выберите ближайший ресторан для самовывоза'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('menu')}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Готово</span>
        </button>
      </div>

      {/* Main interactive map block */}
      <InteractiveDeliveryMap
        fullPageMode={true}
        onConfirmSelection={() => setCurrentPage('menu')}
      />
    </div>
  );
};
