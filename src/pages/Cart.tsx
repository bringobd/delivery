import React from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-brand-light" />
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Your Cart</h1>
          </div>
        </div>
        {items.length > 0 && (
          <button 
            onClick={() => {
              clearCart();
              toast.success('Cart cleared');
            }}
            className="text-red-500 font-black text-xs uppercase tracking-widest hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
        {items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 dark:bg-[#1e1e1e] rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Your cart is empty</h3>
              <p className="text-slate-500 font-bold mt-2">Add some delicious food to get started!</p>
            </div>
            <Link 
              to="/"
              className="px-8 py-4 brand-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-light/20 inline-block"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id} 
                  className="bg-white dark:bg-[#1e1e1e] p-4 rounded-[32px] border border-slate-100 dark:border-[#272727] flex space-x-4 relative group shadow-sm"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 rounded-2xl object-cover shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-1 pr-8">
                    <div className="flex justify-between">
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</h4>
                      <span className="font-black text-brand-light">{item.price * item.quantity}₴</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold line-clamp-2 uppercase tracking-widest leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center space-x-4 bg-slate-50 dark:bg-[#272727] rounded-xl px-4 py-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-brand-light transition-colors text-slate-400"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-base font-black w-6 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-brand-light transition-colors text-slate-400"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 bg-white dark:bg-[#1e1e1e] p-8 rounded-[40px] border border-slate-100 dark:border-[#272727] shadow-xl space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-slate-500 font-bold text-sm uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{totalPrice}₴</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold text-sm uppercase tracking-widest">
                  <span>Delivery Fee</span>
                  <span>49₴</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-slate-900 dark:text-white pt-6 border-t border-slate-100 dark:border-[#272727] uppercase tracking-tight">
                  <span>Total</span>
                  <span className="brand-text-gradient">{totalPrice + 49}₴</span>
                </div>
              </div>
              <button 
                className="w-full py-5 brand-gradient text-white rounded-[24px] font-black text-xl uppercase tracking-widest shadow-lg shadow-brand-light/20 active:scale-[0.98] transition-all"
                onClick={() => {
                  toast.success('Order successfully placed!');
                  clearCart();
                  navigate('/orders');
                }}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
