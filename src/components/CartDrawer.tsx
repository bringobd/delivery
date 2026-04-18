import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#141414] shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-[#272727]">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-6 h-6 text-brand-light" />
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Your Cart</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-[#1e1e1e] rounded-full transition-all text-slate-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-[#1e1e1e] rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Your cart is empty</h3>
                    <p className="text-slate-500 text-sm font-bold">Add some delicious food to start!</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 brand-gradient text-white rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-light/20"
                  >
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex space-x-4 relative group">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-1 pr-8">
                      <div className="flex justify-between">
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</h4>
                        <span className="font-black text-brand-light">{item.price * item.quantity}₴</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold line-clamp-1 uppercase tracking-widest">{item.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-[#1e1e1e] rounded-xl px-3 py-1.5">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:text-brand-light transition-colors text-slate-400"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-black w-4 text-center text-slate-900 dark:text-white">{item.quantity}</span>
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
                      className="absolute bottom-0 right-0 text-slate-400 hover:text-red-500 transition-colors p-2 opacity-100 md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <button 
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared');
                }}
                className="fixed bottom-32 right-6 p-4 bg-red-500 text-white rounded-full shadow-2xl shadow-red-500/20 active:scale-95 transition-all z-[80] sm:hidden"
                title="Clear cart"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            )}

            {items.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-[#1e1e1e] border-t border-slate-100 dark:border-[#272727] space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-500 font-bold text-sm uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>{totalPrice}₴</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-bold text-sm uppercase tracking-widest">
                    <span>Delivery Fee</span>
                    <span>49₴</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-[#272727] uppercase tracking-tight">
                    <span>Total</span>
                    <span className="brand-text-gradient">{totalPrice + 49}₴</span>
                  </div>
                </div>
                <button 
                  className="w-full py-4 brand-gradient text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg shadow-brand-light/20 active:scale-[0.98] transition-all"
                  onClick={() => {
                    toast.success('Order placed successfully!');
                    clearCart();
                    onClose();
                  }}
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

