import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  UserProfile,
  DeliveryAddress,
  Order,
  ProductAddon,
} from '../types';
import { INITIAL_BANK_ADDRESSES, RESTAURANT_LOCATIONS, PRODUCTS } from '../data/products';

export type Page = 'home' | 'menu' | 'cart' | 'checkout' | 'profile' | 'address';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  // Delivery vs Pickup
  orderType: 'delivery' | 'pickup';
  setOrderType: (type: 'delivery' | 'pickup') => void;
  currentAddress: string;
  setCurrentAddress: (addr: string) => void;
  currentRestaurant: string;
  setCurrentRestaurant: (rest: string) => void;
  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    removedIngredients?: string[],
    addedAddons?: ProductAddon[],
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedPromo: string | null;
  promoDiscount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  deliveryFee: number;
  cartTotal: number;
  // Modal
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  // User Profile
  user: UserProfile | null;
  registerUser: (name: string, phone: string, email?: string) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  logoutUser: () => void;
  // Addresses
  savedAddresses: DeliveryAddress[];
  addSavedAddress: (title: string, address: string) => void;
  removeSavedAddress: (id: string) => void;
  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>) => Order;
  repeatOrder: (order: Order) => void;
  lastCreatedOrder: Order | null;
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  CART: 'burger_home_cart_v1',
  PROMO: 'burger_home_promo_v1',
  USER: 'burger_home_user_v1',
  ADDRESSES: 'burger_home_addresses_v1',
  CURRENT_ADDRESS: 'burger_home_current_address_v1',
  CURRENT_RESTAURANT: 'burger_home_current_restaurant_v1',
  ORDER_TYPE: 'burger_home_order_type_v1',
  ORDERS: 'burger_home_orders_v1',
  THEME: 'burger_home_theme_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Order Mode & Addresses
  const [orderType, setOrderTypeState] = useState<'delivery' | 'pickup'>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.ORDER_TYPE) as 'delivery' | 'pickup') || 'delivery';
  });

  const [currentAddress, setCurrentAddressState] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_ADDRESS);
    return saved || INITIAL_BANK_ADDRESSES[0].address;
  });

  const [currentRestaurant, setCurrentRestaurantState] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_RESTAURANT);
    return saved || RESTAURANT_LOCATIONS[0].name + ', ' + RESTAURANT_LOCATIONS[0].address;
  });

  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADDRESSES);
      return saved ? JSON.parse(saved) : INITIAL_BANK_ADDRESSES;
    } catch {
      return INITIAL_BANK_ADDRESSES;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.PROMO) || null;
  });

  // User
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROMO, appliedPromo);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.PROMO);
    }
  }, [appliedPromo]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADDRESSES, JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_ADDRESS, currentAddress);
  }, [currentAddress]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_RESTAURANT, currentRestaurant);
  }, [currentRestaurant]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDER_TYPE, orderType);
  }, [orderType]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const setOrderType = (type: 'delivery' | 'pickup') => {
    setOrderTypeState(type);
  };

  const setCurrentAddress = (addr: string) => {
    setCurrentAddressState(addr);
  };

  const setCurrentRestaurant = (rest: string) => {
    setCurrentRestaurantState(rest);
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const addToCart = (
    product: Product,
    removedIngredients: string[] = [],
    addedAddons: ProductAddon[] = [],
    quantity = 1
  ) => {
    const addonsTotal = addedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.price + addonsTotal;

    // Check if an identical configured item exists
    const removedKey = [...removedIngredients].sort().join(',');
    const addedKey = addedAddons.map((a) => a.id).sort().join(',');

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => {
        const itemRemovedKey = [...item.removedIngredients].sort().join(',');
        const itemAddedKey = item.addedAddons.map((a) => a.id).sort().join(',');
        return (
          item.product.id === product.id &&
          itemRemovedKey === removedKey &&
          itemAddedKey === addedKey
        );
      });

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          totalPrice: newQty * next[existingIndex].unitPrice,
        };
        return next;
      }

      const cartItemId = `${product.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return [
        ...prev,
        {
          cartItemId,
          product,
          quantity,
          removedIngredients,
          addedAddons,
          unitPrice,
          totalPrice: unitPrice * quantity,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Delivery fee is 0 for pickup, or 149 if subtotal < 1000, 0 if subtotal >= 1000
  const deliveryFee = orderType === 'pickup' ? 0 : cartSubtotal >= 1000 || cartSubtotal === 0 ? 0 : 149;

  // Promo logic
  const calculatePromoDiscount = (): number => {
    if (!appliedPromo || cartSubtotal === 0) return 0;
    const clean = appliedPromo.trim().toUpperCase();

    if (clean === 'START20') {
      // 20% discount on order items
      return Math.round(cartSubtotal * 0.2);
    }

    if (clean === '2FOR1' || clean === '2BURGERS') {
      // 2 burgers for the price of 1: find highest price burger among burgers and discount the 2nd one
      const burgerItems = cart.filter((item) => item.product.category === 'burgers');
      const totalBurgerCount = burgerItems.reduce((acc, it) => acc + it.quantity, 0);
      if (totalBurgerCount >= 2) {
        // Discount the price of one burger
        const cheapestBurger = [...burgerItems].sort(
          (a, b) => a.product.price - b.product.price
        )[0];
        return cheapestBurger.product.price;
      }
      return 0;
    }

    return 0;
  };

  const promoDiscount = calculatePromoDiscount();
  const cartTotal = Math.max(0, cartSubtotal - promoDiscount + deliveryFee);

  const applyPromoCode = (rawCode: string): { success: boolean; message: string } => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { success: false, message: 'Введите промокод' };
    }

    if (code === 'START20') {
      setAppliedPromo('START20');
      return { success: true, message: 'Промокод START20 применен: скидка 20%!' };
    }

    if (code === '2FOR1' || code === '2BURGERS') {
      const burgerCount = cart
        .filter((item) => item.product.category === 'burgers')
        .reduce((sum, item) => sum + item.quantity, 0);
      setAppliedPromo(code);
      if (burgerCount < 2) {
        return {
          success: true,
          message: 'Акция "2 бургера вместо 1" активирована! Добавьте в корзину от 2-х бургеров для расчета скидки.',
        };
      }
      return { success: true, message: 'Акция "2 бургера вместо 1" применена: 2-й бургер в подарок!' };
    }

    return { success: false, message: 'Неверный или недействительный промокод' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // User actions
  const registerUser = (name: string, phone: string, email?: string) => {
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };
    setUser(newUser);
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const logoutUser = () => {
    setUser(null);
  };

  // Addresses
  const addSavedAddress = (title: string, address: string) => {
    const newAddr: DeliveryAddress = {
      id: 'addr_' + Date.now(),
      title: title.trim() || 'Адрес',
      address: address.trim(),
      type: 'custom',
    };
    setSavedAddresses((prev) => [newAddr, ...prev]);
    setCurrentAddressState(newAddr.address);
  };

  const removeSavedAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  // Order creation
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber: `№BH-${randomNum}`,
      date: dateStr,
      status: 'Принят',
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const repeatOrder = (order: Order) => {
    order.items.forEach((item) => {
      // Find current product
      const product = PRODUCTS.find((p) => p.id === item.product.id) || item.product;
      addToCart(product, item.removedIngredients, item.addedAddons, item.quantity);
    });
    setCurrentPage('cart');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        orderType,
        setOrderType,
        currentAddress,
        setCurrentAddress,
        currentRestaurant,
        setCurrentRestaurant,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedPromo,
        promoDiscount,
        applyPromoCode,
        removePromoCode,
        deliveryFee,
        cartTotal,
        selectedProduct,
        openProductModal,
        closeProductModal,
        user,
        registerUser,
        updateUser,
        logoutUser,
        savedAddresses,
        addSavedAddress,
        removeSavedAddress,
        orders,
        createOrder,
        repeatOrder,
        lastCreatedOrder,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
