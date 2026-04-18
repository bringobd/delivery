import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types';

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Load from local storage for test version
    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem('bringo_test_orders') || '[]');
      const userOrders = savedOrders.filter((o: Order) => o.userId === user.uid);
      setOrders(userOrders.sort((a: Order, b: Order) => b.timestamp - a.timestamp));
      setLoading(false);
    };

    loadOrders();
    
    // Listen for storage changes (optional but good for test)
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, [user?.uid]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-brand-light" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'delivering': return 'In Transit';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'delivered': return "bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400";
      case 'cancelled': return "bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400";
      default: return "bg-brand-light/10 text-brand-light";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">My Orders</h1>
        <p className="text-slate-500 font-bold text-sm">Track and manage your delivery history</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-[#1e1e1e] rounded-[32px] animate-pulse" />
          ))
        ) : orders.length > 0 ? (
          orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-[#1e1e1e] rounded-[32px] p-6 border border-slate-100 dark:border-[#272727] shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-[#272727] rounded-2xl flex items-center justify-center text-slate-400 group-hover:brand-gradient group-hover:text-white transition-all">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black uppercase tracking-tight text-slate-900 dark:text-white">#{order.id.slice(-4)}</h3>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1",
                        getStatusClass(order.status)
                      )}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">{order.restaurantName} • {order.items}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50 dark:border-[#272727]">
                  <div className="text-right">
                    <p className="text-lg font-black brand-text-gradient">{order.total}₴</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(order.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-light transition-colors" />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-[#1e1e1e] rounded-[40px] border border-dashed border-slate-200 dark:border-[#272727]">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tight">You have no orders yet</h3>
            <p className="text-slate-500 font-bold text-sm mt-2">Time to make your first order!</p>
          </div>
        )}
      </div>
    </div>
  );
};
