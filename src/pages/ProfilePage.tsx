import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  LogOut,
  Edit2,
  PackageCheck,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const {
    user,
    registerUser,
    updateUser,
    logoutUser,
    orders,
    repeatOrder,
    savedAddresses,
    addSavedAddress,
    removeSavedAddress,
    currentAddress,
    setCurrentAddress,
    setCurrentPage,
  } = useApp();

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Add Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrValue, setNewAddrValue] = useState('');

  // Preset Avatars
  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setRegError('Пожалуйста, заполните имя и номер телефона');
      return;
    }
    setRegError(null);
    registerUser(regName.trim(), regPhone.trim(), regEmail.trim());
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
    });
    setIsEditingProfile(false);
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 2500);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrValue.trim()) return;
    addSavedAddress(newAddrTitle.trim() || 'Мой адрес', newAddrValue.trim());
    setIsAddingAddress(false);
    setNewAddrTitle('');
    setNewAddrValue('');
  };

  // UNREGISTERED STATE: Registration prompt
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-6 space-y-6 animate-fade-up">
        <div className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-6 sm:p-8 shadow-xs text-center space-y-5 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <User className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Личный кабинет
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
              Войдите или зарегистрируйтесь, чтобы сохранять адреса и отслеживать историю заказов
            </p>
          </div>

          {regError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2 text-left">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{regError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                Ваше имя *
              </label>
              <input
                type="text"
                required
                placeholder="Алексей"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                Номер телефона *
              </label>
              <input
                type="tel"
                required
                placeholder="+7 (999) 000-00-00"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                Email для чеков (необязательно)
              </label>
              <input
                type="email"
                placeholder="alex@mail.ru"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 font-extrabold text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    );
  }

  // REGISTERED STATE: Settings + Addresses + Order History
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-up">
      {/* 1. НАСТРОЙКИ ПРОФИЛЯ С АВАТАРКОЙ */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs transition-colors">
        {profileSuccessMsg && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Профиль успешно обновлен!</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-neutral-100 dark:border-neutral-700 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-800 flex items-center justify-center">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </span>
            </div>

            {/* Profile Info */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                  {user.name}
                </h2>
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md uppercase">
                  Гость BURGER HOME
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  {user.phone}
                </span>
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setEditName(user.name);
                setEditPhone(user.phone);
                setEditEmail(user.email || '');
                setIsEditingProfile(!isEditingProfile);
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Редактировать</span>
            </button>
            <button
              onClick={logoutUser}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>

        {/* Edit Form Modal/Drawer */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-5 border-t border-neutral-100 dark:border-white/5 space-y-4 animate-fade-up"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Редактирование данных
              </span>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                Отмена
              </button>
            </div>

            {/* Choose avatar preset */}
            <div>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400 mb-2">Выберите аватарку:</span>
              <div className="flex gap-2">
                {AVATAR_PRESETS.map((avUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => updateUser({ avatarUrl: avUrl })}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-transform cursor-pointer ${
                      user.avatarUrl === avUrl
                        ? 'border-emerald-500 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={avUrl} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-white/10 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:bg-white dark:focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-white/10 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:bg-white dark:focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-white/10 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:bg-white dark:focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 text-xs font-bold transition-colors cursor-pointer"
            >
              Сохранить изменения
            </button>
          </form>
        )}
      </section>

      {/* 2. СПИСОК ИЗБРАННЫХ АДРЕСОВ */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white uppercase">
              Избранные адреса
            </h3>
          </div>
          <button
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить адрес</span>
          </button>
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <form
            onSubmit={handleSaveNewAddress}
            className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200 dark:border-white/10 space-y-3 animate-fade-up"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Новый адрес:</span>
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                Отмена
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Название (Дом, Офис)"
                value={newAddrTitle}
                onChange={(e) => setNewAddrTitle(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
              />
              <input
                type="text"
                required
                placeholder="Улица, дом, квартира"
                value={newAddrValue}
                onChange={(e) => setNewAddrValue(e.target.value)}
                className="sm:col-span-2 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Сохранить адрес
            </button>
          </form>
        )}

        {/* Addresses List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {savedAddresses.map((addr) => {
            const isActive = currentAddress === addr.address;
            return (
              <div
                key={addr.id}
                className={`p-3.5 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 text-neutral-950 dark:text-white'
                    : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">{addr.title}</span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded">
                        Текущий
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{addr.address}</p>

                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => setCurrentAddress(addr.address)}
                      className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 cursor-pointer"
                    >
                      Выбрать для заказа
                    </button>
                  )}
                </div>

                {savedAddresses.length > 1 && (
                  <button
                    onClick={() => removeSavedAddress(addr.id)}
                    aria-label="Удалить адрес"
                    className="p-1 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ИСТОРИЯ ЗАКАЗОВ */}
      <section className="bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white uppercase">
              История заказов ({orders.length})
            </h3>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-neutral-200/60 dark:border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-black text-neutral-950 dark:text-white">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                      {ord.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {ord.status}
                    </span>
                    <span className="text-sm font-extrabold text-neutral-950 dark:text-white tabular-nums">
                      {ord.totalAmount} ₽
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {ord.items.map((i) => `${i.product.name} × ${i.quantity}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                    Адрес: {ord.address} · {ord.paymentMethod === 'card' ? 'Оплата картой' : 'Оплата наличными'}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => repeatOrder(ord)}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 shadow-2xs hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Повторить заказ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200/60 dark:border-white/10 space-y-2">
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">У вас пока нет оформленных заказов</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-xs mx-auto">
              Закажите ваш первый Чикен-супер-бургер с быстрой доставкой!
            </p>
            <button
              onClick={() => setCurrentPage('menu')}
              className="mt-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-emerald-500 text-white dark:text-neutral-950 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              Смотреть меню
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
