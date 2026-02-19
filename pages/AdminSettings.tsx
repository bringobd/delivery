
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Restaurant, MenuCategory, MenuItem } from '../types';

const ImageWithFallback: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  return error ? (
    <div className={`${className} bg-s2 flex items-center justify-center border border-white/5 opacity-40 rounded-lg`}>
      <span className="text-[8px] font-black uppercase">No Image</span>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} onError={() => setError(true)} />
  );
};

interface AdminSettingsProps {
  user: User;
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  globalMenu: Record<string, MenuCategory[]>;
  setGlobalMenu: React.Dispatch<React.SetStateAction<Record<string, MenuCategory[]>>>;
  showToast: (m: string) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ 
  user, restaurants, setRestaurants, globalMenu, setGlobalMenu, showToast 
}) => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<'rests' | 'menus' | null>(null);
  const [selectedRestId, setSelectedRestId] = useState<string | null>(null);

  return (
    <div className="p-6 animate-reveal pb-32">
        <header className="flex items-center justify-between mb-10 pt-4">
          <div>
            <h1 className="font-geologica text-3xl font-black mb-1 text-white tracking-tight">Адмін Панель</h1>
            <p className="text-[10px] font-black text-brand-orange uppercase tracking-[3px] opacity-80">Повний доступ</p>
          </div>
          <div className="w-12 h-12 glass border border-white/10 rounded-full flex items-center justify-center text-xl active-scale cursor-pointer" onClick={() => navigate('/profile')}>👤</div>
        </header>

        <div className="space-y-4">
            {/* Restaurants Section */}
            <div className="glass rounded-[28px] overflow-hidden border-white/5">
                <button onClick={() => setExpandedSection(expandedSection === 'rests' ? null : 'rests')} className="w-full p-6 flex items-center justify-between active:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4"><div className="text-xl">🏪</div><span className="font-bold text-sm">Керування закладами</span></div>
                    <span className={`text-t3 transition-transform duration-300 ${expandedSection === 'rests' ? 'rotate-90' : ''}`}>›</span>
                </button>
                
                {/* Animation Wrapper */}
                <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expandedSection === 'rests' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden min-h-0">
                        <div className="px-4 pb-6 pt-2">
                            <button onClick={() => navigate('/manage-rest/new')} className="w-full py-4 mb-4 glass border-brand-orange/30 text-brand-orange text-[10px] font-black uppercase tracking-widest rounded-xl active-scale">+ Додати заклад</button>
                            <div className="space-y-2">
                            {restaurants.map(r => (
                                <div key={r.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"><ImageWithFallback src={r.img} alt={r.n} className="w-full h-full object-cover" /></div>
                                <div className="flex-1 min-w-0 font-bold text-[11px] text-white truncate">{r.n}</div>
                                <div className="flex gap-1.5">
                                    <button onClick={() => navigate(`/manage-rest/${r.id}`)} className="w-9 h-9 glass rounded-full flex items-center justify-center text-xs active-scale">✏️</button>
                                    <button onClick={() => { if(window.confirm('Видалити?')) { setRestaurants(prev => prev.filter(x => x.id !== r.id)); showToast('Видалено'); }}} className="w-9 h-9 glass rounded-full flex items-center justify-center text-xs text-brand-red active-scale">🗑️</button>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menus Section */}
            <div className="glass rounded-[28px] overflow-hidden border-white/5">
                <button onClick={() => setExpandedSection(expandedSection === 'menus' ? null : 'menus')} className="w-full p-6 flex items-center justify-between active:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4"><div className="text-xl">🍕</div><span className="font-bold text-sm">Редагування меню</span></div>
                    <span className={`text-t3 transition-transform duration-300 ${expandedSection === 'menus' ? 'rotate-90' : ''}`}>›</span>
                </button>
                
                {/* Animation Wrapper */}
                <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expandedSection === 'menus' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden min-h-0">
                        <div className="px-4 pb-6 pt-2">
                            <div className="grid grid-cols-1 gap-2 mb-6">
                            {restaurants.map(r => (
                                <button key={r.id} onClick={() => setSelectedRestId(selectedRestId === r.id ? null : r.id)} className={`w-full p-4 rounded-2xl text-left transition-all active-scale ${selectedRestId === r.id ? 'btn-gradient text-white border-transparent' : 'bg-white/5 text-t2 border border-white/5'}`}>
                                <div className="text-[11px] font-black uppercase tracking-widest">{r.n}</div>
                                </button>
                            ))}
                            </div>
                            
                            {/* Inner Animation for Menu Details */}
                            <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedRestId ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden min-h-0">
                                    <div className="space-y-8">
                                        <button onClick={() => { const n = window.prompt('Категорія:'); if(n) setGlobalMenu(p => ({ ...p, [selectedRestId!]: [...(p[selectedRestId!]||[]), {cat: n, items: []}] })); }} className="w-full py-4 glass border-dashed border-white/20 text-white/50 text-[9px] font-black uppercase tracking-widest rounded-xl">+ Нова категорія</button>
                                        {(globalMenu[selectedRestId || ''] || []).map((cat, catIdx) => (
                                        <div key={catIdx} className="bg-white/[0.02] p-4 rounded-3xl border border-white/5">
                                            <div className="flex items-center justify-between mb-5 px-1">
                                            <h4 className="text-[11px] font-black text-brand-orange uppercase">{cat.cat}</h4>
                                            <button onClick={() => navigate(`/manage-item/${selectedRestId}/${catIdx}/new`)} className="text-[10px] font-black text-white/60 uppercase">+ Додати</button>
                                            </div>
                                            <div className="space-y-2">
                                            {cat.items.map((item, itemIdx) => (
                                                <div key={item.id} className="glass p-3 rounded-2xl flex items-center gap-4 border-white/5">
                                                <div className="flex-1 font-bold text-[12px] text-white truncate">{item.n}</div>
                                                <button onClick={() => navigate(`/manage-item/${selectedRestId}/${catIdx}/${itemIdx}`)} className="w-9 h-9 glass rounded-full flex items-center justify-center text-xs active-scale">✏️</button>
                                                </div>
                                            ))}
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminSettings;
