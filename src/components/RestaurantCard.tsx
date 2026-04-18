import React from 'react';
import { Star, Clock, Bike } from 'lucide-react';
import { Restaurant } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group bg-white dark:bg-[#1a1a1a] rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-[#272727] aspect-[4/3] sm:aspect-[16/9]"
    >
      <Link to={`/restaurant/${restaurant.id}`} className="relative block w-full h-full">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        
        {/* Gradient Overlay: Black to transparent from bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-lg border border-white/10 z-10">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-black text-white">{restaurant.rating}</span>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex flex-col justify-end space-y-2 sm:space-y-4 z-10">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight line-clamp-1">
              {restaurant.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-white/80 font-bold line-clamp-2 leading-tight sm:leading-relaxed">
              {restaurant.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6 text-[9px] sm:text-[11px] font-black text-white/70 uppercase tracking-widest">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-brand-light" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Bike className="w-3 h-3 sm:w-4 sm:h-4 text-brand-light" />
              <span>{restaurant.deliveryFee > 0 ? `${restaurant.deliveryFee}₴` : 'Free'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
            {restaurant.categories.slice(0, 3).map(cat => (
              <span key={cat} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl border border-white/5">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {restaurant.deliveryFee === 0 && (
          <div className="absolute top-3 left-3 brand-gradient text-white px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg z-10">
            Free Delivery
          </div>
        )}
      </Link>
    </motion.div>
  );
};

