import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Building2,
  Edit3,
  Check,
  Bike,
  Store,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { INITIAL_BANK_ADDRESSES, RESTAURANT_LOCATIONS } from '../data/products';
import { useApp } from '../context/AppContext';

interface InteractiveDeliveryMapProps {
  onConfirmSelection?: () => void;
  fullPageMode?: boolean;
}

export const InteractiveDeliveryMap: React.FC<InteractiveDeliveryMapProps> = ({
  onConfirmSelection,
  fullPageMode = false,
}) => {
  const {
    orderType,
    setOrderType,
    currentAddress,
    setCurrentAddress,
    currentRestaurant,
    setCurrentRestaurant,
    addSavedAddress,
  } = useApp();

  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [activePin, setActivePin] = useState<string>('bank-1');

  // Interactive Pan & Drag State for touch / mouse movement
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPanX: number; initialPanY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Banks coordinates on SVG canvas (coordinate space 800 x 400)
  const bankPins = [
    { id: 'bank-1', x: 540, y: 160, name: 'Сбербанк (Центральный)', address: INITIAL_BANK_ADDRESSES[0].address },
    { id: 'bank-2', x: 640, y: 90, name: 'Т-Банк (Премиум)', address: INITIAL_BANK_ADDRESSES[1].address },
    { id: 'bank-3', x: 420, y: 260, name: 'ВТБ (Бизнес-центр)', address: INITIAL_BANK_ADDRESSES[2].address },
    { id: 'bank-4', x: 690, y: 230, name: 'Альфа-Банк', address: INITIAL_BANK_ADDRESSES[3].address },
  ];

  // Restaurant coordinates
  const restaurantPin = { x: 260, y: 190, name: 'BURGER HOME' };

  // Set active pin on mount if address matches
  useEffect(() => {
    const found = bankPins.find((p) => p.address === currentAddress);
    if (found) {
      setActivePin(found.id);
    }
  }, [currentAddress]);

  const handleSelectBank = (pin: typeof bankPins[0]) => {
    setActivePin(pin.id);
    setCurrentAddress(pin.address);
    setIsEditingCustom(false);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      addSavedAddress('Мой адрес', customInput.trim());
      setCurrentAddress(customInput.trim());
      setIsEditingCustom(false);
      setCustomInput('');
    }
  };

  // TOUCH & MOUSE PANNING HANDLERS (Передвижение пальцем или мышью)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      dragStartRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
      };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.startX;
    const dy = touch.clientY - dragStartRef.current.startY;
    setPan({
      x: dragStartRef.current.initialPanX + dx,
      y: dragStartRef.current.initialPanY + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left click
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    };
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setPan({
      x: dragStartRef.current.initialPanX + dx,
      y: dragStartRef.current.initialPanY + dy,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const resetMapPosition = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const currentBank = bankPins.find((p) => p.id === activePin) || bankPins[0];

  return (
    <div className={`bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 overflow-hidden shadow-xs flex flex-col transition-colors ${fullPageMode ? 'min-h-[75vh]' : ''}`}>
      {/* 1. Header & Delivery Mode Switcher */}
      <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-900/40">
        <div className="w-full sm:flex-1 grid grid-cols-2 bg-neutral-200/80 dark:bg-neutral-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              orderType === 'delivery'
                ? 'bg-white dark:bg-[#1F242C] text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Доставка курьером</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('pickup')}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              orderType === 'pickup'
                ? 'bg-white dark:bg-[#1F242C] text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Самовывоз</span>
          </button>
        </div>

        {/* ETA Badge */}
        <div className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold shrink-0">
          <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>
            {orderType === 'delivery' ? 'Доставка: ~25–35 минут' : 'Готовность к выдаче: ~15 минут'}
          </span>
        </div>
      </div>

      {/* 2. Interactive Vector Map Canvas (Draggable with fingers/mouse) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`relative w-full ${fullPageMode ? 'h-72 sm:h-96' : 'h-60 sm:h-72'} bg-[#eef4f0] dark:bg-[#13161B] overflow-hidden select-none cursor-grab transition-colors ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        {/* Transformable Canvas Group */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="w-full h-full"
        >
          <svg
            viewBox="0 0 800 400"
            className="w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0ece4" className="dark:stroke-[#1d222b]" strokeWidth="1" />
              </pattern>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <rect width="800" height="400" fill="url(#cityGrid)" />

            {/* City Parks / Green areas */}
            <path
              d="M 50 40 Q 180 20 220 120 T 140 230 T 40 180 Z"
              fill="#dcfce7"
              className="dark:fill-[#0d2a1f]"
              opacity="0.85"
            />
            <path
              d="M 640 40 Q 760 70 730 190 T 600 240 Z"
              fill="#dcfce7"
              className="dark:fill-[#0d2a1f]"
              opacity="0.75"
            />
            <path
              d="M 330 260 Q 400 280 430 360 T 310 390 Z"
              fill="#dcfce7"
              className="dark:fill-[#0d2a1f]"
              opacity="0.6"
            />

            {/* River / Waterway */}
            <path
              d="M 0 340 C 220 320, 340 240, 520 260 C 670 280, 730 360, 800 370"
              fill="none"
              stroke="#cfe5f5"
              className="dark:stroke-[#172b3c]"
              strokeWidth="42"
              strokeLinecap="round"
            />

            {/* City Street Roads */}
            <path d="M 0 100 L 800 120" stroke="#ffffff" className="dark:stroke-[#222832]" strokeWidth="14" />
            <path d="M 0 200 L 800 190" stroke="#ffffff" className="dark:stroke-[#222832]" strokeWidth="18" />
            <path d="M 0 290 L 800 310" stroke="#ffffff" className="dark:stroke-[#222832]" strokeWidth="12" />
            <path d="M 280 0 L 260 400" stroke="#ffffff" className="dark:stroke-[#222832]" strokeWidth="16" />
            <path d="M 520 0 L 560 400" stroke="#ffffff" className="dark:stroke-[#222832]" strokeWidth="18" />
            <path d="M 120 0 L 140 400" stroke="#ffffff" className="dark:stroke-[#222832]" strokeWidth="12" />
            <path d="M 700 0 L 680 400" stroke="#ffffff" className="dark:stroke-[#222832]" strokeWidth="12" />

            {/* Road center dashes */}
            <path d="M 0 200 L 800 190" stroke="#e2e8f0" className="dark:stroke-[#343e4f]" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M 280 0 L 260 400" stroke="#e2e8f0" className="dark:stroke-[#343e4f]" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M 520 0 L 560 400" stroke="#e2e8f0" className="dark:stroke-[#343e4f]" strokeWidth="2" strokeDasharray="6 6" />

            {/* Delivery Radius Circle */}
            <circle
              cx={restaurantPin.x}
              cy={restaurantPin.y}
              r="170"
              fill="#10b981"
              fillOpacity="0.06"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Delivery Route Path */}
            {orderType === 'delivery' && (
              <path
                d={`M ${restaurantPin.x} ${restaurantPin.y} C ${(restaurantPin.x + currentBank.x) / 2} ${
                  restaurantPin.y - 45
                }, ${(restaurantPin.x + currentBank.x) / 2} ${currentBank.y + 45}, ${currentBank.x} ${
                  currentBank.y
                }`}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="5"
                strokeDasharray="8 6"
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}

            {/* Restaurant Marker (BURGER HOME) */}
            <g transform={`translate(${restaurantPin.x}, ${restaurantPin.y})`}>
              <circle r="24" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
              <circle r="14" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
              <circle r="5" fill="#10b981" />
              <rect
                x="-55"
                y="-44"
                width="110"
                height="24"
                rx="6"
                fill="#0f172a"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.18))"
              />
              <text
                x="0"
                y="-28"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                BURGER HOME
              </text>
            </g>

            {/* Bank Markers */}
            {bankPins.map((pin) => {
              const isSelected = pin.id === activePin;
              return (
                <g key={pin.id} transform={`translate(${pin.x}, ${pin.y})`}>
                  {isSelected && (
                    <circle r="20" fill="#10b981" fillOpacity="0.35" className="animate-pulse" />
                  )}
                  <circle
                    r={isSelected ? '12' : '9'}
                    fill={isSelected ? '#10b981' : '#ffffff'}
                    stroke={isSelected ? '#ffffff' : '#64748b'}
                    strokeWidth="2.5"
                  />
                  {isSelected && <circle r="4" fill="#ffffff" />}

                  <rect
                    x="-42"
                    y="-34"
                    width="84"
                    height="20"
                    rx="4"
                    fill={isSelected ? '#10b981' : '#ffffff'}
                    stroke={isSelected ? 'none' : '#cbd5e1'}
                    strokeWidth="1"
                    filter="drop-shadow(0 1px 3px rgba(0,0,0,0.1))"
                  />
                  <text
                    x="0"
                    y="-20"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#1e293b'}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {pin.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Map UI Overlay: Movement Hint & Controls */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-200/80 dark:border-white/10 shadow-xs flex items-center gap-1.5 text-xs text-neutral-800 dark:text-neutral-200 pointer-events-none">
          <Navigation className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-[11px] sm:text-xs">
            Передвигайте карту пальцем или мышью
          </span>
        </div>

        {/* Map Zoom & Reset Floating Buttons */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
            aria-label="Приблизить"
            className="w-8 h-8 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border border-neutral-200 dark:border-white/10 shadow-xs flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 active:scale-95 transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.2))}
            aria-label="Отдалить"
            className="w-8 h-8 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border border-neutral-200 dark:border-white/10 shadow-xs flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 active:scale-95 transition-all cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetMapPosition}
            aria-label="Сбросить карту"
            className="w-8 h-8 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border border-neutral-200 dark:border-white/10 shadow-xs flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Address Selection Controls */}
      <div className="p-4 sm:p-6 space-y-4">
        {orderType === 'delivery' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Выберите адрес доставки (по умолчанию ближайший банк):
              </label>
              {!isEditingCustom && (
                <button
                  type="button"
                  onClick={() => setIsEditingCustom(true)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ввести свой адрес</span>
                </button>
              )}
            </div>

            {/* Quick Bank Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              {bankPins.map((pin) => {
                const isSelected = currentAddress === pin.address;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => handleSelectBank(pin)}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-neutral-950 dark:text-white shadow-xs'
                        : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <Building2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isSelected ? 'text-emerald-500' : 'text-neutral-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">{pin.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{pin.address}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Address Input Form */}
            {isEditingCustom ? (
              <form
                onSubmit={handleSaveCustom}
                className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200 dark:border-white/10 space-y-2.5 animate-fade-up"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Укажите персональный адрес доставки:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingCustom(false)}
                    className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    Отмена
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Например: ул. Пушкина, д. 10, кв. 42"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                  >
                    Применить
                  </button>
                </div>
              </form>
            ) : (
              /* Display Current Address Banner */
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                      Текущий выбранный адрес:
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {currentAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Pickup Restaurant Selection */
          <div>
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
              Выберите ресторан для самовывоза:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {RESTAURANT_LOCATIONS.map((rest) => {
                const isSelected = currentRestaurant.includes(rest.name);
                return (
                  <button
                    key={rest.id}
                    type="button"
                    onClick={() => {
                      setCurrentRestaurant(`${rest.name}, ${rest.address}`);
                      setCurrentAddress(rest.address);
                    }}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-neutral-950 dark:text-white shadow-xs'
                        : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <Building2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isSelected ? 'text-emerald-500' : 'text-neutral-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">{rest.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{rest.address}</p>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                        <span>{rest.hours}</span>
                        <span>·</span>
                        <span>{rest.distance}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Action Button if embedded or confirmation requested */}
        {onConfirmSelection && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onConfirmSelection}
              className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 font-extrabold text-sm transition-all cursor-pointer"
            >
              Подтвердить выбор адреса
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
