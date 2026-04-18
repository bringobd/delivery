import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RESTAURANTS as MOCK_RESTAURANTS } from '../constants';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Star, Clock, Bike, ArrowLeft, Plus, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Restaurant, MenuItem } from '../types';

export const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Use mock data for test version
    const mockRes = MOCK_RESTAURANTS.find(r => r.id === id);
    if (mockRes) {
      setRestaurant(mockRes);
      setMenuItems(mockRes.menu);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading && !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-light border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight">Restaurant not found</h2>
        <button onClick={() => navigate('/')} className="text-brand-light font-black uppercase tracking-widest text-sm hover:underline">Return to home</button>
      </div>
    );
  }

  const isEditable = user?.role === 'admin' || (user?.role === 'restaurant' && user?.restaurantId === id);

  return (
    <div className="pb-24">
      {/* Header Image */}
      <div className="relative h-64 md:h-[450px] w-full overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/40 transition-all shadow-xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          {isEditable && (
            <button className="px-6 py-2.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-black text-xs uppercase tracking-widest hover:bg-white/40 transition-all flex items-center space-x-2">
              <Edit2 className="w-4 h-4" />
              <span>Edit Page</span>
            </button>
          )}
        </div>

        <div className="absolute bottom-12 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-wrap gap-2">
              {restaurant.categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-brand-light/20 backdrop-blur-md border border-brand-light/30 text-brand-light text-[10px] font-black uppercase tracking-widest rounded-full">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">{restaurant.name}</h1>
            <div className="flex items-center space-x-6 text-white/80 font-bold text-sm">
              <div className="flex items-center space-x-1.5">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-black">{restaurant.rating}</span>
                <span className="opacity-60">(500+ reviews)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-5 h-5 text-brand-light" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Bike className="w-5 h-5 text-brand-light" />
                <span>{restaurant.deliveryFee}₴ Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-[#141414] rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-[#272727] space-y-12">
          {/* About */}
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-widest">About Us</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-3xl">
              {restaurant.description}
            </p>
          </div>

          <hr className="border-slate-50 dark:border-[#272727]" />

          {/* Menu */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <h2 className="text-2xl font-black uppercase tracking-tight">Popular Dishes</h2>
              <div className="flex overflow-x-auto no-scrollbar gap-2 -mx-8 px-8 sm:mx-0 sm:px-0">
                {['All', 'Pizza', 'Appetizers', 'Drinks'].map(cat => (
                  <button key={cat} className={cn(
                    "flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    cat === 'All' ? "brand-gradient text-white" : "bg-slate-50 dark:bg-[#1e1e1e] text-slate-400"
                  )}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex bg-slate-50 dark:bg-[#1e1e1e] rounded-[32px] p-5 gap-6 group cursor-pointer border border-transparent hover:border-brand-light/20 transition-all shadow-sm"
                >
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">{item.name}</h3>
                      <p className="text-slate-500 text-xs font-bold line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xl font-black brand-text-gradient">{item.price}₴</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, restaurant.id);
                        }}
                        className="w-10 h-10 brand-gradient text-white rounded-2xl shadow-lg shadow-brand-light/20 flex items-center justify-center transition-all active:scale-90"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] overflow-hidden shrink-0 shadow-md">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

