import React, { useState } from 'react';
import { CATEGORIES, RESTAURANTS } from '../constants';
import { RestaurantCard } from '../components/RestaurantCard';
import { motion } from 'motion/react';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
 
export const Restaurants: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRestaurants = RESTAURANTS.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || res.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <section className="pt-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-brand-light transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for food, restaurants, dishes..." 
            className="w-full pl-12 pr-16 py-4 bg-white dark:bg-[#1e1e1e] border-none rounded-[24px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-brand-light/10 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button className="p-3 bg-brand-light/10 text-brand-light rounded-[18px] shadow-sm hover:brand-gradient hover:text-white transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Categories</h2>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="text-brand-light font-black text-sm hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
              className="flex-shrink-0 group flex flex-col items-center space-y-3"
            >
              <div className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] flex items-center justify-center text-3xl shadow-sm group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-slate-100 dark:border-[#272727]",
                selectedCategory === cat.name ? "brand-gradient text-white" : "bg-white dark:bg-[#1e1e1e] group-hover:brand-gradient group-hover:text-white"
              )}>
                {cat.icon}
              </div>
              <span className={cn(
                "text-xs font-black uppercase tracking-widest transition-colors",
                selectedCategory === cat.name ? "text-brand-light" : "text-slate-500 group-hover:text-brand-light"
              )}>
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Restaurants List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {selectedCategory ? `${selectedCategory}` : 'All Establishments'}
            </h2>
            <p className="text-slate-500 text-xs font-bold mt-1">
              {filteredRestaurants.length} restaurants found
            </p>
          </div>
        </div>
        
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {filteredRestaurants.map((res, idx) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <RestaurantCard restaurant={res} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-[40px] p-12 text-center border border-slate-100 dark:border-[#272727] shadow-sm">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Nothing found</h3>
            <p className="text-slate-500 font-bold text-sm mt-2">Try changing your search query or category filter</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              className="mt-6 px-8 py-3 brand-gradient text-white rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-light/20"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
