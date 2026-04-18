import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, Order } from '../types';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, restaurantId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  checkout: (restaurantName: string) => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isCheckingOut: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bringo_cart_items');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem('bringo_cart_items', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: MenuItem, restaurantId: string) => {
    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      
      // Check if adding from a different restaurant
      if (prev.length > 0 && prev[0].restaurantId !== restaurantId) {
        toast.error('You can only order from one restaurant at a time. Clear your cart first.');
        return prev;
      }

      toast.success(`Added ${item.name} to cart`);
      return [...prev, { ...item, quantity: 1, restaurantId }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const clearCart = () => setItems([]);

  const checkout = async (restaurantName: string) => {
    if (!user) {
      toast.error('Please log in to place an order');
      return;
    }

    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const order: Order = {
        id: orderId,
        restaurantId: items[0].restaurantId,
        restaurantName,
        items: items.map(i => `${i.name} x${i.quantity}`).join(', '),
        itemsList: items,
        total: totalPrice,
        status: 'pending',
        timestamp: Date.now(),
        userId: user.uid
      };

      // Save to local storage for test version
      const savedOrders = JSON.parse(localStorage.getItem('bringo_test_orders') || '[]');
      savedOrders.push(order);
      localStorage.setItem('bringo_test_orders', JSON.stringify(savedOrders));

      toast.success('Order successfully created (Test Mode)!');
      clearCart();
    } catch (error) {
      toast.error('Error creating order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, checkout, totalItems, totalPrice, isCheckingOut }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
