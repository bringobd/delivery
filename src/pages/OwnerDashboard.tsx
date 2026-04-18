import React, { useState, useEffect } from 'react';
import { RESTAURANTS as MOCK_RESTAURANTS } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { ShoppingBag, DollarSign, TrendingUp, Clock, CheckCircle2, AlertCircle, Plus, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Restaurant, Order } from '../types';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.restaurantId) return;

    // Load restaurant from mock data for test version
    const mockRes = MOCK_RESTAURANTS.find(r => r.id === user.restaurantId);
    if (mockRes) setRestaurant(mockRes);

    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem('bringo_test_orders') || '[]');
      const restaurantOrders = savedOrders.filter((o: Order) => o.restaurantId === user.restaurantId);
      setMyOrders(restaurantOrders.sort((a: Order, b: Order) => b.timestamp - a.timestamp));
      setIsLoading(false);
    };

    loadOrders();
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, [user?.restaurantId]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const savedOrders = JSON.parse(localStorage.getItem('bringo_test_orders') || '[]');
    const updatedOrders = savedOrders.map((o: Order) => 
      o.id === orderId ? { ...o, status } : o
    );
    localStorage.setItem('bringo_test_orders', JSON.stringify(updatedOrders));
    setMyOrders(updatedOrders.filter((o: Order) => o.restaurantId === user?.restaurantId));
    toast.success(`Order status changed to ${status} (Test)`);
  };

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-light"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Orders Today', value: myOrders.length.toString(), icon: ShoppingBag },
    { label: 'Revenue Today', value: `${myOrders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total, 0)}₴`, icon: DollarSign },
    { label: 'Your Profit', value: `${Math.round(myOrders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total, 0) * 0.8)}₴`, icon: TrendingUp },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center space-x-6">
          <img src={restaurant.image} className="w-24 h-24 rounded-[32px] object-cover shadow-xl" alt={restaurant.name} />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{restaurant.name}</h1>
            <p className="text-brand-light font-black text-xs uppercase tracking-widest">Restaurant Panel</p>
          </div>
        </div>
        <div className="flex bg-white dark:bg-[#1e1e1e] p-1 rounded-2xl border border-slate-100 dark:border-[#272727]">
          {[
            { id: 'orders', label: 'Orders' },
            { id: 'history', label: 'History' },
            { id: 'menu', label: 'Menu' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id ? "brand-gradient text-white shadow-lg shadow-brand-light/20" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[32px] border border-slate-100 dark:border-[#272727] shadow-sm"
          >
            <div className="p-3 w-fit rounded-2xl bg-slate-50 dark:bg-[#272727] text-slate-400 mb-4">
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Orders</h2>
          {myOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[32px] border border-slate-100 dark:border-[#272727] shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black uppercase tracking-tight text-slate-900 dark:text-white">{order.id}</h4>
                      <p className="text-xs font-bold text-slate-400">{order.items}</p>
                    </div>
                    <span className="px-3 py-1 bg-brand-light/10 text-brand-light rounded-full text-[10px] font-black uppercase tracking-widest">
                      {order.status === 'ready' ? 'Ready' : order.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-[#272727]">
                    <span className="font-black text-brand-light">{order.total}₴</span>
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'accepted')}
                          className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-100 transition-all"
                        >
                          Accept
                        </button>
                      )}
                      {order.status === 'accepted' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all"
                        >
                          Prepare
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-100 transition-all"
                        >
                          Ready
                        </button>
                      )}
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-[#1e1e1e] rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200 dark:border-[#272727]">
              <p className="text-slate-400 font-bold">No new orders at the moment.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">Menu Management</h2>
            <button className="px-6 py-2.5 brand-gradient text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-light/20 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Dish</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {restaurant.menu.map((item) => (
              <div key={item.id} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-[24px] border border-slate-100 dark:border-[#272727] flex items-center space-x-4">
                <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-black uppercase tracking-tight truncate text-sm text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.price}₴</p>
                </div>
                <button className="p-2 bg-slate-50 dark:bg-[#272727] rounded-xl text-slate-400 hover:text-brand-light transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
