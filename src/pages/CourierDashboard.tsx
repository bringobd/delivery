import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bike, MapPin, Package, Clock, CheckCircle2, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Order } from '../types';
import { useAuth } from '../hooks/useAuth';

export const CourierDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isOnShift, setIsOnShift] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem('bringo_test_orders') || '[]');
      setOrders(savedOrders);
      setIsLoading(false);
      
      // Check if user has an active order assigned
      const myActiveOrder = savedOrders.find((o: Order) => o.courierId === user?.uid && !['delivered', 'cancelled'].includes(o.status));
      if (myActiveOrder) {
        setActiveOrderId(myActiveOrder.id);
      }
    };

    loadOrders();
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, [user?.uid]);

  const activeOrder = orders.find(o => o.id === activeOrderId);
  const availableOrders = orders.filter(o => o.status === 'pending' && !o.courierId);

  const handleAcceptOrder = async (id: string) => {
    if (!user) return;
    const savedOrders = JSON.parse(localStorage.getItem('bringo_test_orders') || '[]');
    const updatedOrders = savedOrders.map((o: Order) => 
      o.id === id ? { ...o, courierId: user.uid, status: 'delivering' } : o
    );
    localStorage.setItem('bringo_test_orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    setActiveOrderId(id);
    toast.success(`Order ${id} accepted (Test)!`);
  };

  const handleCompleteOrder = async () => {
    if (!activeOrderId) return;
    const savedOrders = JSON.parse(localStorage.getItem('bringo_test_orders') || '[]');
    const updatedOrders = savedOrders.map((o: Order) => 
      o.id === activeOrderId ? { ...o, status: 'delivered' } : o
    );
    localStorage.setItem('bringo_test_orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    toast.success('Order successfully delivered (Test)!');
    setActiveOrderId(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Shift Toggle */}
      <div className="brand-gradient rounded-[32px] p-8 text-white shadow-xl pill-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">
              {isOnShift ? 'On Shift 🛵' : 'Off Duty'}
            </h1>
            <p className="text-white/80 font-bold text-sm">
              {isOnShift ? 'You are receiving available orders' : 'Start your shift to begin earning'}
            </p>
          </div>
          <button
            onClick={() => setIsOnShift(!isOnShift)}
            className={cn(
              "px-8 py-3 rounded-full font-black text-sm transition-all active:scale-95 shadow-lg",
              isOnShift ? "bg-red-500 text-white shadow-red-500/20" : "bg-white text-brand-dark shadow-white/20"
            )}
          >
            {isOnShift ? 'End Shift' : 'Start Shift'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Today', value: '450₴' },
          { label: 'Orders', value: '8' },
          { label: 'Avg. Time', value: '24min' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl border border-slate-100 dark:border-[#272727] text-center shadow-sm">
            <p className="text-xl font-black brand-text-gradient">{stat.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {isOnShift ? (
        <div className="space-y-6">
          {activeOrder ? (
            <div className="space-y-4">
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Delivery</h2>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#1e1e1e] rounded-[32px] border-2 border-brand-light p-8 shadow-xl space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{activeOrder.id}</h3>
                    <p className="text-brand-light font-black text-xs uppercase tracking-widest">{activeOrder.restaurantName}</p>
                  </div>
                  <div className="p-3 bg-brand-light/10 rounded-2xl text-brand-light">
                    <Navigation className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-4 py-4 border-y border-slate-50 dark:border-[#272727]">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pickup from</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{activeOrder.restaurantName} — Main Entrance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Items</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{activeOrder.items}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleCompleteOrder}
                    className="flex-1 py-4 brand-gradient text-white rounded-2xl font-black text-sm shadow-lg shadow-brand-light/20 hover:opacity-90 transition-all"
                  >
                    Confirm Delivery
                  </button>
                  <button className="p-4 bg-slate-50 dark:bg-[#272727] text-slate-600 rounded-2xl hover:bg-slate-100 transition-all">
                    <Clock className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Available Orders ({availableOrders.length})
              </h2>
              {availableOrders.length > 0 ? (
                <div className="space-y-4">
                  {availableOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[24px] border border-slate-100 dark:border-[#272727] flex items-center justify-between shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="space-y-1">
                        <h4 className="font-black uppercase tracking-tight text-slate-900 dark:text-white">{order.id} — {order.restaurantName}</h4>
                        <p className="text-xs font-bold text-slate-400 truncate max-w-[200px]">{order.items}</p>
                        <p className="text-xs font-black text-brand-light uppercase tracking-widest">{order.total}₴ Earned</p>
                      </div>
                      <button 
                        onClick={() => handleAcceptOrder(order.id)}
                        className="px-6 py-2.5 brand-gradient text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-light/20 hover:scale-105 transition-all"
                      >
                        Accept
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-[#1e1e1e] rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200 dark:border-[#272727]">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">No orders available right now. Waiting...</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-[#1e1e1e] rounded-[32px] p-16 text-center space-y-4">
          <div className="w-20 h-20 bg-white dark:bg-[#272727] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Bike className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">You are Offline</h3>
          <p className="text-slate-400 font-bold text-sm max-w-xs mx-auto">
            Start your shift to see available delivery requests in your area.
          </p>
        </div>
      )}
    </div>
  );
};
