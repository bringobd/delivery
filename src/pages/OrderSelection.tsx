import React from 'react';
import { motion } from 'motion/react';
import { Utensils, ShoppingBag, Truck, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrderSelection: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 'restaurants',
      title: 'Restaurants',
      icon: Utensils, 
      color: 'bg-brand-light',
      available: true,
      path: '/restaurants'
    },
    {
      id: 'stores',
      title: 'Stores',
      icon: ShoppingBag,
      color: 'bg-blue-500',
      available: false,
      path: '#'
    },
    {
      id: 'post',
      title: 'Post',
      icon: Truck,
      color: 'bg-green-500',
      available: false,
      path: '#'
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      icon: Pill,
      color: 'bg-red-500',
      available: false,
      path: '#'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {options.map((option) => (
          <motion.div
            key={option.id}
            whileHover={option.available ? { scale: 1.05 } : {}}
            whileTap={option.available ? { scale: 0.95 } : {}}
            onClick={() => option.available && navigate(option.path)}
            className={`relative overflow-hidden rounded-[32px] p-8 cursor-pointer transition-all h-64 flex flex-col items-center justify-center text-center shadow-xl ${
              option.available 
                ? 'bg-white dark:bg-[#1e1e1e] hover:shadow-2xl border border-slate-100 dark:border-[#272727]' 
                : 'bg-slate-100 dark:bg-[#141414] opacity-60 grayscale cursor-not-allowed border border-transparent'
            }`}
          >
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-white ${option.color} shadow-lg`}>
              <option.icon className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{option.title}</h2>
            {!option.available && (
              <span className="mt-4 px-4 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                Coming Soon
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
