
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem, MenuCategory } from '../types';

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

interface ItemSelectorProps {
  globalMenu: Record<string, MenuCategory[]>;
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ globalMenu, setCart, showToast }) => {
  const navigate = useNavigate();
  const { restId, itemId } = useParams();
  const [qty, setQty] = useState(1);
  const [options, setOptions] = useState<Record<number, any>>({});
  const [item, setItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    // Find item in menu
    if (restId && globalMenu[restId]) {
      for (const cat of globalMenu[restId]) {
        const found = cat.items.find(i => i.id === itemId);
        if (found) {
          setItem(found);
          // Init options
          const initial: Record<number, any> = {};
          found.groups.forEach((g, i) => {
            initial[i] = g.type === 'radio' ? 0 : new Set();
          });
          setOptions(initial);
          break;
        }
      }
    }
  }, [restId, itemId, globalMenu]);

  const calculateTotal = () => {
    if (!item) return 0;
    let total = item.basePrice;
    item.groups.forEach((g, i) => {
      if (g.type === 'radio') {
        const opt = g.options[options[i]];
        if (opt) total = g.isFull ? opt.p : total + opt.p;
      } else {
        (options[i] as Set<number>)?.forEach(oi => { total += g.options[oi].p; });
      }
    });
    return total * qty;
  };

  const handleConfirm = () => {
    if (!item) return;
    const opts: string[] = [];
    item.groups.forEach((g, i) => {
      if (g.type === 'radio') opts.push(g.options[options[i]].n);
      else (options[i] as Set<number>).forEach(oi => opts.push(g.options[oi].n));
    });
    
    setCart(prev => [...prev, {
      item: item,
      opts,
      unitPrice: calculateTotal() / qty,
      qty,
      restaurantId: restId
    }]);
    showToast(`Додано до кошика`);
    navigate(-1);
  };

  if (!item) return <div className="p-10 text-center text-white">Loading...</div>;

  return (
    <div className="bg-brand-bg min-h-screen animate-reveal relative pb-32">
      <div className="absolute top-6 left-6 z-20">
        <button onClick={() => navigate(-1)} className="w-12 h-12 glass rounded-full flex items-center justify-center text-white active-scale shadow-2xl">✕</button>
      </div>
      
      <div className="h-[50vh] w-full relative overflow-hidden">
        <ImageWithFallback src={item.img} className="w-full h-full object-cover" alt={item.n} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent"></div>
      </div>

      <div className="px-8 -mt-10 relative z-10">
        <h2 className="font-geologica text-4xl font-black mb-3 text-white tracking-tight leading-tight">{item.n}</h2>
        <p className="text-sm text-t2 font-medium leading-relaxed mb-10 opacity-70">{item.d}</p>

        {item.groups.map((g, gi) => (
          <div key={gi} className="mb-10 animate-reveal">
            <div className="font-geologica text-[10px] font-black text-white/40 uppercase tracking-[4px] mb-5">{g.label}</div>
            <div className="space-y-3">
              {g.options.map((opt, oi) => {
                const isSelected = g.type === 'radio' ? options[gi] === oi : (options[gi] as Set<number>)?.has(oi);
                return (
                  <div key={oi} className={`flex items-center gap-4 p-5 rounded-[24px] transition-all active-scale ${isSelected ? 'glass border-brand-orange/40 shadow-[0_10px_30px_rgba(255,92,0,0.1)]' : 'bg-white/[0.03] border border-white/5'}`}
                        onClick={() => {
                          if (g.type === 'radio') setOptions(prev => ({ ...prev, [gi]: oi }));
                          else {
                            const next = new Set(options[gi] as Set<number>);
                            if (next.has(oi)) next.delete(oi); else next.add(oi);
                            setOptions(prev => ({ ...prev, [gi]: next }));
                          }
                        }}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-brand-orange' : 'border-white/10'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange shadow-[0_0_10px_#FF5C00]"></div>}
                    </div>
                    <span className={`flex-1 text-[13px] font-bold ${isSelected ? 'text-white' : 'text-t2'}`}>{opt.n}</span>
                    <span className="font-geologica text-[12px] font-black text-brand-orange">{opt.p > 0 ? `+${opt.p}` : '0'} ₴</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-10 glass border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] z-30 flex items-center gap-4 bg-brand-bg/90 backdrop-blur-md max-w-[430px] mx-auto">
        <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-2 py-1.5 border border-white/5 shrink-0">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-3xl font-black text-white/30 active:text-white transition-colors">−</button>
          <span className="font-geologica text-xl font-black min-w-[32px] text-center text-white">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-3xl font-black text-white/30 active:text-white transition-colors">+</button>
        </div>
        <button onClick={handleConfirm} className="flex-1 h-[68px] bg-brand-orange rounded-[24px] text-white font-geologica font-black text-xs uppercase tracking-[3px] flex items-center justify-between px-8 active-scale transition-all shadow-2xl shadow-brand-orange/40">
          <span>ДОДАТИ</span>
          <span className="text-sm">{calculateTotal()} ₴</span>
        </button>
      </div>
    </div>
  );
};

export default ItemSelector;
