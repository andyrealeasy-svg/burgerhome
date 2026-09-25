export type ProductCategory = 'all' | 'combo' | 'burgers' | 'drinks' | 'snacks' | 'sauces';

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'combo' | 'burgers' | 'drinks' | 'snacks' | 'sauces';
  price: number;
  description: string;
  image: string;
  calories?: number;
  weight?: string;
  defaultIngredients: string[];
  optionalAddons: ProductAddon[];
  recommendedProductIds?: string[];
  isPopular?: boolean;
  isPromo?: boolean;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  removedIngredients: string[];
  addedAddons: ProductAddon[];
  unitPrice: number;
  totalPrice: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl: string;
}

export interface DeliveryAddress {
  id: string;
  title: string;
  address: string;
  isDefault?: boolean;
  type: 'bank' | 'home' | 'work' | 'custom';
}

export type OrderStatus = 'Принят' | 'Готовится' | 'В пути' | 'Доставлен';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  deliveryFee: number;
  totalAmount: number;
  deliveryType: 'delivery' | 'pickup';
  address: string;
  startCooking: 'now' | 'scheduled';
  scheduledTime?: string;
  email: string;
  paymentMethod: 'cash' | 'card';
  status: OrderStatus;
}
