import React from 'react';
import { Search, ShoppingCart, User, MapPin, X, Bike, ChevronRight, LogOut } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom'; 
import { cn } from '../lib/utils';

export const Navbar: React.FC<{ onOpenCart: () => void; onOpenMenu: () => void }> = ({ onOpenCart, onOpenMenu }) => {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/order', label: 'Order' },
    { path: '/restaurants', label: 'Restaurants' },
    { path: '/orders', label: 'My Orders' },
  ];

  if (user.role === 'admin') {
    navLinks.push({ path: '/admin', label: 'Admin Panel' });
  } else if (user.role === 'courier') {
    navLinks.push({ path: '/courier', label: 'Courier Panel' });
  } else if (user.role === 'restaurant') {
    navLinks.push({ path: '/owner', label: 'Restaurant Panel' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full glass shadow-sm border-b border-slate-100 dark:border-[#272727]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white overflow-hidden">
              <img 
                src="resources/logo2.png" 
                alt="B" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter hidden sm:block">
              BRINGO
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "text-sm font-bold transition-colors",
                  location.pathname === link.path ? "text-brand-light" : "text-slate-500 hover:text-brand-light"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-[#1e1e1e] border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-light/20 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              to="/cart"
              className="relative flex items-center space-x-2 px-3 sm:px-4 py-2 bg-brand-light/10 text-brand-light hover:bg-brand-light/20 rounded-2xl transition-all border border-brand-light/20 shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-black text-[10px] uppercase tracking-widest">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 brand-gradient text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#141414] shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-[#272727]">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{user.name}</p>
                <p className="text-[10px] font-bold text-brand-light uppercase tracking-widest mt-1">{user.role}</p>
              </div>
              <Link 
                to="/profile"
                className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-[#141414] hover:scale-105 transition-all"
              >
                {user?.avatar || '👤'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

