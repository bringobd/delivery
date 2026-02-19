
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem, Restaurant, MenuCategory } from '../types';

// OPTIMIZATION: Added loading="lazy" decoding="async"
const ImageWithFallback: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  return error ? (
    <div className={`${className} bg-s2 flex items-center justify-center border border-white/5`}>
      <div className="flex flex-col items-center opacity-20">
        <span className="text-4xl mb-1">🖼️</span>
        <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setError(true)} />
  );
};

interface RestPageProps {
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (m: string) => void;
  globalMenu: Record<string, MenuCategory[]>;
}

const RestPage: React.FC<RestPageProps> = ({ cart, setCart, showToast, globalMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const restaurant: Restaurant = location.state?.restaurant;
  const currentMenu = globalMenu[restaurant?.id] || [];
  const [curCat, setCurCat] = useState(currentMenu[0]?.cat || '');

  const currentCategory = currentMenu.find(m => m.cat === curCat);

  if (!restaurant) return null;

  return (
    <>
      <div className="animate-reveal">
        <div className="relative h-72 bg-s1">
          <ImageWithFallback src={restaurant.img} className="w-full h-full object-cover opacity-60" alt={restaurant.n} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent"></div>
          <div className="absolute top-8 left-6">
            <button onClick={() => navigate(-1)} className="w-12 h-12 glass rounded-full flex items-center justify-center text-white active-scale shadow-lg">←</button>
          </div>
        </div>

        <div className="px-6 -mt-20 relative z-10">
          <h1 className="font-geologica text-4xl font-black mb-3 text-white tracking-tight">{restaurant.n}</h1>
          <div className="flex gap-4 items-center text-[10px] font-black tracking-[3px] text-t2 mb-10 opacity-80 uppercase">
            <span className="text-brand-orange">★ {restaurant.rating}</span>
            <span className="opacity-20">|</span>
            <span>⏱ {restaurant.time} ХВ</span>
            <span className="opacity-20">|</span>
            <span>🛵 {restaurant.delivery} ₴</span>
          </div>

          <div className="sticky top-4 z-40 mb-10 overflow-x-auto no-scrollbar flex gap-2">
              {currentMenu.map(m => (
              <button key={m.cat} onClick={() => setCurCat(m.cat)}
                  className={`flex-shrink-0 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-200 ${curCat === m.cat ? 'bg-brand-orange text-white' : 'glass text-t2'}`}>
                  {m.cat}
              </button>
              ))}
          </div>

          <div className="grid grid-cols-1 gap-6 mb-24">
              {currentCategory?.items.map((item, idx) => (
                  <div key={item.id} className="glass p-4 rounded-[28px] flex gap-5 active-scale border-white/5 transform-gpu"
                      onClick={() => navigate(`/item/${restaurant.id}/${item.id}`)}>
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5 bg-s2">
                          <ImageWithFallback src={item.img} className="w-full h-full object-cover" alt={item.n} />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                              <div className="font-geologica text-base font-black text-white mb-1.5">{item.n}</div>
                              <div className="text-[10px] text-t2 line-clamp-2 font-medium leading-relaxed">{item.d}</div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                              <span className="font-geologica text-sm font-black text-brand-orange">{item.basePrice} ₴</span>
                              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white text-lg">+</div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RestPage;
