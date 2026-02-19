
export type Role = 'client' | 'courier' | 'restaurant' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  phone?: string;
  surname?: string;
  ownedRestaurantId?: string;
  isOnline?: boolean;
}

export interface Restaurant {
  id: string;
  n: string;
  img: string;
  rating: number;
  time: string;
  delivery: number;
  categories: string[];
}

export interface MenuItemOption {
  n: string;
  p: number;
}

export interface MenuItemOptionGroup {
  label: string;
  sub: string;
  type: 'radio' | 'check';
  required?: boolean;
  max?: number;
  isFull?: boolean;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  n: string;
  d: string;
  img: string;
  basePrice: number;
  groups: MenuItemOptionGroup[];
}

export interface MenuCategory {
  cat: string;
  items: MenuItem[];
}

export interface OrderItem {
  name: string;
  opts: string[];
  price: number;
  qty: number;
}

export type OrderStatus = 'new' | 'accepted' | 'cooking' | 'delayed' | 'ready' | 'picked' | 'done' | 'cancelled';

export interface Order {
  id: number;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  address: string;
  client: string;
  clientPhone: string;
  chatId?: string; // Telegram Chat ID
  time: string;
  placed: number;
  courierName: string | null;
  courierAccepted: boolean;
  restaurantProfit?: number;
  platformProfit?: number;
  restaurantId: string;
}
