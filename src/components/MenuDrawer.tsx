import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xs bg-white dark:bg-[#141414] shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-[#272727]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white text-xl font-black">
                  {user.name[0]}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white leading-none">{user.name}</p>
                  <p className="text-[10px] font-bold text-brand-light uppercase tracking-widest mt-1">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-[#1e1e1e] rounded-full transition-all text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                    location.pathname === link.path 
                      ? "bg-brand-light/10 text-brand-light" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1e1e1e]"
                  )}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-[#272727] space-y-3">
              <Link 
                to="/profile"
                onClick={onClose}
                className="w-full p-4 bg-slate-50 dark:bg-[#1e1e1e] text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <button 
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
