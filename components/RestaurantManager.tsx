
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Restaurant, MenuCategory } from '../types';

interface RestaurantManagerProps {
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  setGlobalMenu: React.Dispatch<React.SetStateAction<Record<string, MenuCategory[]>>>;
  showToast: (msg: string) => void;
}

const RestaurantManager: React.FC<RestaurantManagerProps> = ({ restaurants, setRestaurants, setGlobalMenu, showToast }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';

  const [rest, setRest] = useState<Restaurant>({
      id: '',
      n: '',
      img: '',
      rating: 5,
      time: '',
      delivery: 0,
      categories: []
  });

  useEffect(() => {
      if (isNew) {
          setRest({
              id: 'rest_' + Date.now(),
              n: 'Новий Заклад',
              img: '',
              rating: 5.0,
              time: '30-40',
              delivery: 50,
              categories: ['Фастфуд']
          });
      } else {
          const found = restaurants.find(r => r.id === id);
          if (found) setRest(JSON.parse(JSON.stringify(found)));
          else navigate(-1);
      }
  }, [id, isNew, restaurants, navigate]);

  const onSave = () => {
    if (isNew) {
        setRestaurants(prev => [...prev, rest]);
        setGlobalMenu(prev => ({ ...prev, [rest.id]: [] }));
        showToast('Заклад додано');
    } else {
        setRestaurants(prev => prev.map(r => r.id === rest.id ? rest : r));
        showToast('Дані оновлено');
    }
    navigate(-1);
  };

  return (
    <div className="bg-brand-bg min-h-screen animate-reveal">
      <div className="flex items-center justify-between px-6 py-6 sticky top-0 bg-brand-bg z-20 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="w-11 h-11 glass rounded-full flex items-center justify-center text-lg active-scale">←</button>
        <h2 className="font-geologica text-sm font-black text-white uppercase tracking-widest">Дані Закладу</h2>
        <div className="w-11"></div>
      </div>
      
      <div className="px-6 py-8 space-y-8">
        <div className="space-y-6">
          <div>
            <label className="text-[9px] font-black uppercase tracking-[2px] text-t3 mb-2 block opacity-60">Назва</label>
            <input type="text" value={rest.n} onChange={e => setRest({...rest, n: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-[2px] text-t3 mb-2 block opacity-60">URL Фото</label>
            <input type="text" value={rest.img} onChange={e => setRest({...rest, img: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[2px] text-t3 mb-2 block opacity-60">Рейтинг</label>
              <input type="number" step="0.1" value={rest.rating} onChange={e => setRest({...rest, rating: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none" />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-[2px] text-t3 mb-2 block opacity-60">Доставка (₴)</label>
              <input type="number" value={rest.delivery} onChange={e => setRest({...rest, delivery: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-[2px] text-t3 mb-2 block opacity-60">Час (хв)</label>
            <input type="text" value={rest.time} onChange={e => setRest({...rest, time: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none" />
          </div>
        </div>
        
        <div className="pt-8 pb-12">
            <button onClick={onSave} className="w-full h-[68px] btn-gradient rounded-[24px] text-white font-geologica font-black text-xs uppercase tracking-[3px] active-scale">
                Зберегти Зміни
            </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManager;
