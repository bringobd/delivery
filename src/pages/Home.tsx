import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { RestaurantCard } from '../components/RestaurantCard';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Bike, Clock, Star, Search, Filter, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useData } from '../hooks/useData';

export const Home: React.FC = () => {
  const { restaurants, banners } = useData();
  const [currentPromo, setCurrentPromo] = useState(0); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const bannerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      if (bannerRef.current) {
        const nextIndex = (currentPromo + 1) % banners.length;
        const scrollAmount = bannerRef.current.offsetWidth * nextIndex;
        bannerRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        setCurrentPromo(nextIndex);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, currentPromo]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== currentPromo) {
      setCurrentPromo(newIndex);
    }
  };

  const filteredRestaurants = restaurants.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || res.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 pb-24">
      {/* Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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

      {/* Promo Slider */}
      {banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="relative h-48 md:h-64 rounded-[32px] overflow-hidden shadow-xl pill-shadow group">
            <div 
              ref={bannerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full"
            >
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={cn(
                    "flex-shrink-0 w-full h-full snap-center flex items-center px-8 md:px-16 bg-gradient-to-br",
                    banner.gradient
                  )}
                >
                  <div className="flex-1 space-y-2 md:space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                      {banner.title}
                    </h2>
                    <p className="text-white/90 font-bold text-sm md:text-lg">
                      {banner.subtitle}
                    </p>
                    <Link to="/order" className="inline-block">
                      <button className="px-6 py-2.5 bg-white text-brand-dark rounded-full font-black text-sm hover:scale-105 transition-all active:scale-95">
                        Order Now
                      </button>
                    </Link>
                  </div>
                  <div className="text-7xl md:text-9xl opacity-20 select-none hidden sm:block">
                    {banner.icon}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {banners.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    if (bannerRef.current) {
                      const scrollAmount = bannerRef.current.offsetWidth * idx;
                      bannerRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                      setCurrentPromo(idx);
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all ${idx === currentPromo ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {selectedCategory ? `${selectedCategory}` : 'Popular Now'}
            </h2>
            <p className="text-slate-500 text-xs font-bold mt-1">
              {filteredRestaurants.length} restaurants found
            </p>
          </div>
        </div>
        
        {filteredRestaurants.length > 0 ? (
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-2 gap-6 md:gap-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {filteredRestaurants.map((res, idx) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-[85vw] sm:w-auto"
              >
                <RestaurantCard restaurant={res} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-[40px] p-12 text-center border border-slate-100 dark:border-[#272727] shadow-sm">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tight">Nothing found</h3>
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

