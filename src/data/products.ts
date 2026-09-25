import { Product } from '../types';

import heroChickenImg from '../assets/images/hero_chicken_super_burger_1790356651977.jpg';
import beefBurgerImg from '../assets/images/burger_classic_beef_1790356664649.jpg';
import truffleBurgerImg from '../assets/images/burger_double_truffle_1790356675869.jpg';
import comboMealImg from '../assets/images/combo_super_meal_1790356687416.jpg';
import nuggetsImg from '../assets/images/appetizer_crispy_nuggets_1790356699107.jpg';
import lemonadeImg from '../assets/images/drinks_fresh_lemonade_1790356712596.jpg';
import saucesImg from '../assets/images/sauces_selection_1790356722544.jpg';

export const COMMON_ADDONS = [
  { id: 'extra-cheese', name: 'Сыр Чеддер', price: 69 },
  { id: 'crispy-bacon', name: 'Хрустящий бекон', price: 89 },
  { id: 'jalapeno', name: 'Острый халапеньо', price: 49 },
  { id: 'truffle-sauce', name: 'Трюфельный соус', price: 59 },
  { id: 'caramelized-onion', name: 'Карамелизованный лук', price: 49 },
];

export const PRODUCTS: Product[] = [
  // БУРГЕРЫ
  {
    id: 'chicken-super-burger',
    name: 'Чикен-супер-бургер',
    category: 'burgers',
    price: 440,
    description: 'Фирменный бургер с хрустящей фермерской куриной котлетой в панировке, выдержанным сыром Чеддер, маринованными огурчиками, свежим салатом Айсберг и соусом ранч на сливочной бриоши.',
    image: heroChickenImg,
    calories: 680,
    weight: '320 г',
    isPopular: true,
    isPromo: true,
    defaultIngredients: [
      'Куриная котлета в хрустящей панировке',
      'Сыр Чеддер',
      'Маринованные огурчики',
      'Салат Айсберг',
      'Фирменный соус Ранч',
      'Булочка бриошь',
    ],
    optionalAddons: COMMON_ADDONS,
    recommendedProductIds: ['rustic-french-fries', 'citrus-lemonade', 'garlic-aioli'],
  },
  {
    id: 'black-angus-classic',
    name: 'Блэк Ангус Классик',
    category: 'burgers',
    price: 520,
    description: 'Сочная котлета из мраморной говядины Блэк Ангус степени прожарки medium-well, расплавленный чеддер, спелые томаты, сладкий красный лук и сливочный авторский соус.',
    image: beefBurgerImg,
    calories: 740,
    weight: '340 г',
    isPopular: true,
    defaultIngredients: [
      'Мраморная котлета Блэк Ангус',
      'Сыр Чеддер',
      'Томаты',
      'Красный лук',
      'Листья салата',
      'Фирменный сливочный соус',
      'Кунжутная бриошь',
    ],
    optionalAddons: COMMON_ADDONS,
    recommendedProductIds: ['rustic-french-fries', 'smoky-bbq', 'berry-iced-tea'],
  },
  {
    id: 'double-truffle-smash',
    name: 'Дабл Трюфель Смэш',
    category: 'burgers',
    price: 610,
    description: 'Две тонкие карамелизированные говяжьи котлеты со смэш-корочкой, двойной сыр, луковый конфитюр и ароматный соус с белым трюфелем на темной бриоши.',
    image: truffleBurgerImg,
    calories: 890,
    weight: '370 г',
    isPopular: true,
    defaultIngredients: [
      'Две смэш-котлеты из говядины',
      'Двойной сыр Чеддер',
      'Карамелизованный лук',
      'Трюфельный соус',
      'Артизанская булочка',
    ],
    optionalAddons: COMMON_ADDONS,
    recommendedProductIds: ['rustic-french-fries', 'truffle-mayo-sauce', 'citrus-lemonade'],
  },

  // КОМБО
  {
    id: 'super-combo-chicken',
    name: 'Комбо: Чикен & Фри & Напиток',
    category: 'combo',
    price: 690,
    description: 'Флагманский Чикен-супер-бургер, большая порция золотистого картофеля фри с морской солью и крафтовый прохладный лимонад на выбор.',
    image: comboMealImg,
    calories: 1040,
    weight: '620 г',
    isPopular: true,
    defaultIngredients: [
      'Чикен-супер-бургер',
      'Картофель фри XXL',
      'Освежающий напиток 0.4л',
      'Чесночный соус',
    ],
    optionalAddons: [
      { id: 'upgrade-sauce', name: 'Замена соуса на Трюфельный', price: 40 },
      { id: 'extra-strips', name: 'Добавить 2 стрипса', price: 120 },
    ],
    recommendedProductIds: ['crispy-chicken-strips', 'truffle-mayo-sauce'],
  },
  {
    id: 'double-beef-duo-combo',
    name: 'Сет Бургер Двойной & Напиток',
    category: 'combo',
    price: 780,
    description: 'Премиальный бургер Блэк Ангус, хрустящие куриные стрипсы с соусом на выбор и напиток.',
    image: comboMealImg,
    calories: 1180,
    weight: '690 г',
    defaultIngredients: [
      'Блэк Ангус Бургер',
      'Стрипсы 3 шт',
      'Соус Барбекю',
      'Освежающий напиток 0.4л',
    ],
    optionalAddons: COMMON_ADDONS,
    recommendedProductIds: ['rustic-french-fries', 'smoky-bbq', 'berry-iced-tea'],
  },

  // ЗАКУСКИ
  {
    id: 'crispy-chicken-strips',
    name: 'Хрустящие куриные стрипсы',
    category: 'snacks',
    price: 330,
    description: 'Нежное филе цыпленка в хрустящей золотистой панировке со специями. Подаются с фирменным соусом.',
    image: nuggetsImg,
    calories: 420,
    weight: '210 г',
    isPopular: true,
    defaultIngredients: [
      'Филе цыпленка в панировке (5 шт)',
      'Специи паприка и чеснок',
      'Фирменный чесночный соус',
    ],
    optionalAddons: [
      { id: 'extra-sauce', name: 'Дополнительный соус барбекю', price: 59 },
    ],
    recommendedProductIds: ['garlic-aioli', 'smoky-bbq', 'citrus-lemonade'],
  },
  {
    id: 'rustic-french-fries',
    name: 'Картофель фри с морской солью',
    category: 'snacks',
    price: 210,
    description: 'Хрустящий снаружи и нежный внутри отборный картофель со щепоткой морской соли и сушеного розмарина.',
    image: nuggetsImg,
    calories: 340,
    weight: '160 г',
    defaultIngredients: ['Отборный картофель', 'Морская соль', 'Розмарин'],
    optionalAddons: [
      { id: 'cheese-dip', name: 'Сырный дип-соус', price: 69 },
      { id: 'truffle-oil', name: 'Трюфельное масло и пармезан', price: 89 },
    ],
    recommendedProductIds: ['truffle-mayo-sauce', 'garlic-aioli', 'citrus-lemonade'],
  },

  // НАПИТКИ
  {
    id: 'citrus-lemonade',
    name: 'Крафтовый цитрусовый лимонад',
    category: 'drinks',
    price: 240,
    description: 'Натуральный охлаждающий лимонад из свежевыжатого сока сицилийских лимонов, лайма и веточки мяты со льдом.',
    image: lemonadeImg,
    calories: 120,
    weight: '400 мл',
    isPopular: true,
    defaultIngredients: ['Сок лимона', 'Сок лайма', 'Мята', 'Тростниковый сироп', 'Лед'],
    optionalAddons: [
      { id: 'extra-ice', name: 'Меньше льда', price: 0 },
      { id: 'ginger-boost', name: 'Имбирный экстракт', price: 40 },
    ],
    recommendedProductIds: ['chicken-super-burger', 'rustic-french-fries'],
  },
  {
    id: 'berry-iced-tea',
    name: 'Холодный лесной ягодный чай',
    category: 'drinks',
    price: 240,
    description: 'Освежающий настой отборного черного чая с экстрактом дикой малины, черники и мяты.',
    image: lemonadeImg,
    calories: 95,
    weight: '400 мл',
    defaultIngredients: ['Чай черный', 'Ягодный сбор', 'Мята', 'Очищенная вода'],
    optionalAddons: [],
    recommendedProductIds: ['black-angus-classic', 'rustic-french-fries'],
  },

  // СОУСЫ
  {
    id: 'truffle-mayo-sauce',
    name: 'Трюфельный соус шефа',
    category: 'sauces',
    price: 89,
    description: 'Насыщенный деликатесный сливочный соус с добавлением стружки натурального трюфеля.',
    image: saucesImg,
    calories: 140,
    weight: '40 г',
    defaultIngredients: ['Сливочная основа', 'Трюфельная паста', 'Черный перец'],
    optionalAddons: [],
    recommendedProductIds: ['rustic-french-fries', 'crispy-chicken-strips'],
  },
  {
    id: 'garlic-aioli',
    name: 'Фирменный чесночный айоли',
    category: 'sauces',
    price: 79,
    description: 'Классический средиземноморский соус с запеченным чесноком и тонкими нотками прованских трав.',
    image: saucesImg,
    calories: 130,
    weight: '40 г',
    defaultIngredients: ['Печеный чеснок', 'Оливковое масло', 'Прованские травы'],
    optionalAddons: [],
    recommendedProductIds: ['crispy-chicken-strips', 'rustic-french-fries'],
  },
  {
    id: 'smoky-bbq',
    name: 'Копченый барбекю соус',
    category: 'sauces',
    price: 79,
    description: 'Густой пикантный соус с ароматом копчения на ольховой щепе и карамельной сладостью.',
    image: saucesImg,
    calories: 90,
    weight: '40 г',
    defaultIngredients: ['Томатная паста', 'Паприка копченая', 'Карамель'],
    optionalAddons: [],
    recommendedProductIds: ['crispy-chicken-strips', 'rustic-french-fries'],
  },
];

export const INITIAL_BANK_ADDRESSES = [
  {
    id: 'bank-1',
    title: 'Сбербанк (Центральный офис)',
    address: 'ул. Ленина, д. 24 (Офис №9038)',
    type: 'bank' as const,
    isDefault: true,
  },
  {
    id: 'bank-2',
    title: 'Т-Банк (Премиум лаундж)',
    address: 'просп. Мира, д. 42',
    type: 'bank' as const,
  },
  {
    id: 'bank-3',
    title: 'ВТБ (Бизнес-центр)',
    address: 'ул. Гагарина, д. 8',
    type: 'bank' as const,
  },
  {
    id: 'bank-4',
    title: 'Альфа-Банк (Отделение)',
    address: 'ул. Тверская, д. 15',
    type: 'bank' as const,
  },
];

export const RESTAURANT_LOCATIONS = [
  {
    id: 'rest-1',
    name: 'BURGER HOME — Центр',
    address: 'ул. Театральная, д. 6',
    hours: '10:00 — 23:00',
    distance: '0.8 км (~15 мин)',
  },
  {
    id: 'rest-2',
    name: 'BURGER HOME — Патриаршие',
    address: 'Малый Козихинский пер., д. 12',
    hours: '10:00 — 00:00',
    distance: '1.9 км (~25 мин)',
  },
];
