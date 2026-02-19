
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../types';

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
    <img src={src} alt={alt} className={className} onError={() => setError(true)} />
  );
};

interface RestsProps {
  restaurants: Restaurant[];
}

const Rests: React.FC<RestsProps> = ({ restaurants }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Всі');
  const filters = ['Всі', 'Піца', 'Суші', 'Мангал', 'Фастфуд'];

  const filtered = restaurants.filter(r => filter === 'Всі' || r.categories.includes(filter));

  return (
    <div className="px-6 py-6 animate-reveal">
      <header className="flex items-center justify-between mb-10 pt-4">
        <div>
            <h1 className="font-geologica text-3xl font-black mb-1 text-white tracking-tight">Заклади</h1>
            <p className="text-[10px] text-t2 font-bold uppercase tracking-[3px] opacity-60">{filtered.length} Places discovered</p>
        </div>
        <div className="w-12 h-12 glass border border-white/10 rounded-full flex items-center justify-center text-xl active-scale cursor-pointer" onClick={() => navigate('/profile')}>
            👤
        </div>
      </header>

      <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar -mx-2 px-2">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filter === f ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/20' : 'glass text-t2 border-transparent'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-8 pb-10">
        {filtered.map((r, i) => (
          <div 
            key={r.id}
            className={`group animate-reveal stagger-${(i%3)+1}`}
            onClick={() => navigate('/rest', { state: { restaurant: r } })}
          >
            <div className="relative h-56 rounded-[32px] overflow-hidden mb-4 shadow-2xl active-scale transition-all duration-500 border border-white/5">
                <ImageWithFallback src={r.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={r.n} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                    <div className="font-geologica text-2xl font-black text-white mb-1 tracking-tight">{r.n}</div>
                    <div className="flex items-center gap-3 text-[10px] font-black tracking-[3px] text-white/60 uppercase">
                        <span className="text-brand-orange">★ {r.rating}</span>
                        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                        <span>{r.time} ХВ</span>
                    </div>
                </div>
            </div>
            <div className="px-2 flex items-center justify-between">
              <div className="flex gap-2">
                {r.categories.slice(0, 2).map(c => (
                  <span key={c} className="text-[9px] font-bold text-t3 uppercase tracking-widest px-3 py-1.5 glass rounded-lg">{c}</span>
                ))}
              </div>
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-[2px]">🛵 {r.delivery} ₴</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rests;
