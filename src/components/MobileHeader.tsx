import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const MobileHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 w-full glass shadow-sm border-b border-slate-100 dark:border-[#272727] px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
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
          <span className="text-xl font-black tracking-tighter">
            BRINGO
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Profile Action */}
          <Link 
            to="/profile"
            className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center text-xl shadow-lg border-2 border-white dark:border-[#141414] hover:scale-105 transition-all active:scale-95 overflow-hidden"
          >
            {user?.avatar || '👤'}
          </Link>
        </div>
      </div>
    </header>
  );
};
