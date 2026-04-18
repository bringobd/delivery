import React from 'react';
import { Home, ShoppingBag, ClipboardList, ShoppingCart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export const BottomNav: React.FC = () => { 
  const { user } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/order', icon: ShoppingBag, label: 'Order' },
    { path: '/orders', icon: ClipboardList, label: 'History' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart' },
  ];

  // Adjust nav items based on role
  if (user.role === 'courier') {
    navItems[0] = { path: '/courier', icon: Home, label: 'Delivery' };
  } else if (user.role === 'restaurant') {
    navItems[0] = { path: '/owner', icon: Home, label: 'Store' };
  }

  return (
    <nav className="lg:hidden fixed bottom-4 left-6 right-6 z-50 glass px-4 py-2 rounded-[32px] shadow-2xl shadow-black/20">
      <div className="flex justify-around items-center relative h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className="flex-1 relative flex flex-col items-center justify-center h-full"
            >
              <motion.div
                animate={{
                  y: isActive ? -4 : 0,
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "flex flex-col items-center transition-colors duration-300 z-10",
                  isActive ? "text-brand-light" : "text-slate-400 dark:text-slate-500"
                )}
              >
                <div className="p-1.5 rounded-xl transition-colors duration-300 relative">
                  <Icon className={cn("w-5 h-5 transition-all", isActive && "fill-brand-light/10")} />
                  {item.path === '/cart' && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 brand-gradient text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white dark:border-[#141414]">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.15em] mt-0.5">
                  {item.label}
                </span>
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-0 w-8 h-1 bg-brand-light rounded-full shadow-[0_0_12px_rgba(12,237,233,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
