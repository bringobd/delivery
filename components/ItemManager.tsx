
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem, MenuCategory } from '../types';

interface ItemManagerProps {
  globalMenu: Record<string, MenuCategory[]>;
  setGlobalMenu: React.Dispatch<React.SetStateAction<Record<string, MenuCategory[]>>>;
  showToast: (msg: string) => void;
}

const ItemManager: React.FC<ItemManagerProps> = ({ globalMenu, setGlobalMenu, showToast }) => {
  const navigate = useNavigate();
  const { restId, catIdx, itemIdx } = useParams();
  
  const restaurantId = restId || '';
  const categoryIndex = parseInt(catIdx || '0');
  // If itemIdx is 'new', we are creating. If it's a number, we are editing.
  const isNew = itemIdx === 'new';
  const itemIndex = isNew ? -1 : parseInt(itemIdx || '0');

  const [item, setItem] = useState<MenuItem>({
    id: 'temp',
    n: '',
    d: '',
    img: '',
    basePrice: 0,
    groups: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId && globalMenu[restaurantId] && globalMenu[restaurantId][categoryIndex]) {
        if (!isNew) {
            const existing = globalMenu[restaurantId][categoryIndex].items[itemIndex];
            if (existing) {
                setItem(JSON.parse(JSON.stringify(existing)));
            } else {
                navigate(-1); // Item not found
            }
        } else {
            // Init new item
            setItem({
                id: 'item_' + Date.now(),
                n: 'Нова страва',
                d: '',
                img: '',
                basePrice: 100,
                groups: []
            });
        }
    }
    setLoading(false);
  }, [restaurantId, categoryIndex, itemIndex, isNew, globalMenu, navigate]);

  const onSave = () => {
      setGlobalMenu(prev => {
          const menu = JSON.parse(JSON.stringify(prev[restaurantId] || []));
          if (!menu[categoryIndex]) return prev;

          if (isNew) {
              menu[categoryIndex].items.push(item);
          } else {
              menu[categoryIndex].items[itemIndex] = item;
          }
          return { ...prev, [restaurantId]: menu };
      });
      showToast('Збережено успішно');
      navigate(-1);
  };

  const updateGroup = (label: string, type: 'radio'|'check', isFull: boolean, action: 'add' | 'remove' | 'update', index?: number, val?: any, price?: number) => {
      const newItem = { ...item };
      let gIndex = newItem.groups.findIndex(g => g.label === label);
      
      if (gIndex === -1) {
          newItem.groups.push({
              label,
              sub: type === 'radio' ? 'Виберіть розмір' : 'Додайте за бажанням',
              type,
              isFull,
              required: type === 'radio', 
              options: []
          });
          gIndex = newItem.groups.length - 1;
      }

      const group = newItem.groups[gIndex];

      if (action === 'add') {
          group.options.push({ n: val || (type === 'radio' ? 'Standard' : 'Extra'), p: price || 0 });
      } else if (action === 'remove' && typeof index === 'number') {
          group.options.splice(index, 1);
      } else if (action === 'update' && typeof index === 'number') {
          if (val !== undefined) group.options[index].n = val;
          if (price !== undefined) group.options[index].p = price;
      }
      
      setItem(newItem);
  };

  const getSizeGroup = () => item.groups.find(g => g.label === 'Розмір');
  const getExtraGroup = () => item.groups.find(g => g.label === 'Додатково');

  if (loading) return <div className="p-10 text-center text-white">Loading...</div>;

  return (
    <div className="bg-brand-bg min-h-screen animate-reveal">
      <div className="flex items-center justify-between px-6 py-6 sticky top-0 bg-brand-bg z-20 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="w-11 h-11 glass rounded-full flex items-center justify-center text-lg active-scale">←</button>
        <h2 className="font-geologica text-sm font-black text-white uppercase tracking-widest">{isNew ? 'Новий Товар' : 'Редагувати'}</h2>
        <div className="w-11"></div>
      </div>
      
      <div className="px-6 py-8 space-y-8">
        <div className="space-y-6">
          {/* Main Info */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-[2px] text-t3 mb-2 block opacity-60">Назва страви</label>
            <input type="text" value={item.n} onChange={e => setItem({...item, n: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-orange" placeholder="Наприклад: Піца Маргарита" />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-[2px] text-t3 mb-2 block opacity-60">URL Фото</label>
            <input type="text" value={item.img} onChange={e => setItem({...item, img: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none" placeholder="https://..." />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-[2px] text-t3 mb-2 block opacity-60">Опис</label>
            <textarea value={item.d} onChange={e => setItem({...item, d: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none min-h-[100px]" placeholder="Склад, особливості..." />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-[2px] text-t3 mb-2 block opacity-60">Базова ціна (₴)</label>
            <input type="number" value={item.basePrice} onChange={e => setItem({...item, basePrice: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none" />
          </div>

          <div className="w-full h-[1px] bg-white/5 my-4"></div>

          {/* Sizes Section */}
          <div>
             <div className="flex items-center justify-between mb-4">
               <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40">Розміри / Варіанти</label>
               <button onClick={() => updateGroup('Розмір', 'radio', true, 'add', undefined, 'Новий розмір')} className="text-[9px] font-black text-brand-orange uppercase active-scale">+ Додати</button>
             </div>
             
             <div className="space-y-3">
               {getSizeGroup()?.options.map((opt, i) => (
                 <div key={i} className="flex gap-3 animate-reveal">
                   <input 
                     placeholder="Назва (см, г, мл)" 
                     value={opt.n} 
                     onChange={e => updateGroup('Розмір', 'radio', true, 'update', i, e.target.value)}
                     className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-white/20"
                   />
                   <input 
                     type="number" 
                     placeholder="Ціна" 
                     value={opt.p} 
                     onChange={e => updateGroup('Розмір', 'radio', true, 'update', i, undefined, parseInt(e.target.value) || 0)}
                     className="w-20 bg-white/5 border border-white/5 rounded-xl px-2 py-3 text-xs font-bold text-white text-center outline-none focus:border-white/20"
                   />
                   <button onClick={() => updateGroup('Розмір', 'radio', true, 'remove', i)} className="w-10 flex items-center justify-center text-brand-red opacity-50 active:opacity-100">✕</button>
                 </div>
               ))}
               {(!getSizeGroup() || getSizeGroup()?.options.length === 0) && (
                 <div className="text-center py-4 border border-dashed border-white/10 rounded-xl text-[10px] text-t3">Немає варіантів розміру</div>
               )}
             </div>
          </div>

          <div className="w-full h-[1px] bg-white/5 my-4"></div>

          {/* Extras Section */}
          <div>
             <div className="flex items-center justify-between mb-4">
               <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40">Додаткові опції</label>
               <button onClick={() => updateGroup('Додатково', 'check', false, 'add', undefined, 'Добавка')} className="text-[9px] font-black text-brand-orange uppercase active-scale">+ Додати</button>
             </div>
             
             <div className="space-y-3">
               {getExtraGroup()?.options.map((opt, i) => (
                 <div key={i} className="flex gap-3 animate-reveal">
                   <input 
                     placeholder="Назва" 
                     value={opt.n} 
                     onChange={e => updateGroup('Додатково', 'check', false, 'update', i, e.target.value)}
                     className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-white/20"
                   />
                   <input 
                     type="number" 
                     placeholder="Ціна" 
                     value={opt.p} 
                     onChange={e => updateGroup('Додатково', 'check', false, 'update', i, undefined, parseInt(e.target.value) || 0)}
                     className="w-20 bg-white/5 border border-white/5 rounded-xl px-2 py-3 text-xs font-bold text-white text-center outline-none focus:border-white/20"
                   />
                   <button onClick={() => updateGroup('Додатково', 'check', false, 'remove', i)} className="w-10 flex items-center justify-center text-brand-red opacity-50 active:opacity-100">✕</button>
                 </div>
               ))}
               {(!getExtraGroup() || getExtraGroup()?.options.length === 0) && (
                 <div className="text-center py-4 border border-dashed border-white/10 rounded-xl text-[10px] text-t3">Немає додаткових опцій</div>
               )}
             </div>
          </div>

        </div>
        
        <div className="pt-8 pb-12">
            <button onClick={onSave} className="w-full h-[68px] btn-gradient rounded-[24px] text-white font-geologica font-black text-xs uppercase tracking-[3px] active-scale shadow-2xl shadow-brand-orange/40">
                Зберегти Товар
            </button>
        </div>
      </div>
    </div>
  );
};

export default ItemManager;
