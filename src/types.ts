export type UserRole = 'client' | 'admin' | 'courier' | 'restaurant';

export interface User {
  uid: string; // This will be the Firebase UID
  name: string;
  phone: string;
  email?: string;
  role: UserRole; 
  restaurantId?: string;
  avatar?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  description: string;
  categories: string[];
  menu: MenuItem[];
  commission?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: string; // For display, but in Firestore it's an array
  itemsList?: CartItem[]; // The actual items
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  timestamp: number;
  userId: string;
  courierId?: string;
  hasDelay?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

