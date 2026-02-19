
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  setUser: (u: User | null) => void;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [showHistory, setShowHistory] = useState(false);

  const handleCloseApp = () => {
    // Closes the Telegram Mini App natively
    if ((window as any).Telegram?.WebApp) {
        (window as any).Telegram.WebApp.close();
    }
  };

  const history = [
    { id: 1024, date: '12.02.2024', total: 450, place: 'СВОБОДА', status: 'done' },
    { id: 1023, date: '10.02.2024', total: 320, place: 'Food House', status: 'done' },
    { id: 1020, date: '05.02.2024', total: 890, place: 'MAESTRO', status: 'cancelled' },
  ];

  return (
    <div className="p-6 animate-reveal">
      <h1 className="font-geologica text-2xl font-black mb-6 pt-4">Профіль</h1>
      
      <div className="bg-s2 border border-white/5 rounded-[32px] p-6 flex items-center gap-6 mb-8 shadow-lg transform-gpu">
        <div className="w-20 h-20 bg-brand-orange/10 border-2 border-brand-orange rounded-full flex items-center justify-center text-4xl shrink-0">
          {user.role === 'courier' ? '🛵' : user.role === 'restaurant' ? '👨‍🍳' : '👤'}
        </div>
        <div>
          <div className="font-geologica text-xl font-black mb-1">{user.name} {user.surname}</div>
          <div className="text-[10px] text-t3 font-bold mb-1">{user.phone}</div>
          <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-lg text-[10px] font-black uppercase font-geologica tracking-widest inline-block border border-brand-orange/20 mt-1">
            {user.role}
          </div>
        </div>
      </div>

      <div className="bg-s2 border border-white/5 rounded-[32px] overflow-hidden shadow-lg mb-8 transform-gpu">
        <button 
            className="w-full p-5 border-b border-white/5 flex items-center gap-4 cursor-pointer active:bg-white/5 transition-colors text-left outline-none"
            onClick={() => setShowHistory(!showHistory)}
        >
          <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-lg">📋</div>
          <span className="flex-1 text-sm font-bold">Історія замовлень</span>
          <span className={`text-t3 transition-transform duration-300 ${showHistory ? 'rotate-90' : ''}`}>›</span>
        </button>

        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${showHistory ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden min-h-0">
                <div className="bg-black/20 p-4 space-y-3 border-b border-white/5">
                    {history.map(h => (
                        <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <div>
                                <div className="text-[11px] font-bold text-white mb-0.5">{h.place}</div>
                                <div className="text-[9px] text-t3 font-bold uppercase tracking-wider">{h.date} • #{h.id}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[11px] font-black text-brand-orange mb-0.5">{h.total} ₴</div>
                                <div className={`text-[8px] font-bold uppercase tracking-wider ${h.status === 'done' ? 'text-green-500' : 'text-brand-red'}`}>{h.status}</div>
                            </div>
                        </div>
                    ))}
                    <div className="text-center text-[9px] text-t3 pt-2 pb-2">Показано останні 3 замовлення</div>
                </div>
            </div>
        </div>

        <div className="p-5 border-b border-white/5 flex items-center gap-4 cursor-pointer active:bg-white/5 transition-colors">
          <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-lg">⚙️</div>
          <span className="flex-1 text-sm font-bold">Налаштування</span>
          <span className="text-t3">›</span>
        </div>
        <div 
          className="p-5 flex items-center gap-4 cursor-pointer active:bg-brand-red/10 group"
          onClick={handleCloseApp}
        >
          <div className="w-10 h-10 bg-brand-red/10 text-brand-red rounded-2xl flex items-center justify-center text-lg">🚪</div>
          <span className="flex-1 text-sm font-bold text-brand-red">Закрити додаток</span>
        </div>
      </div>
      
      <div className="mt-12 text-center pb-8">
         <div className="text-[10px] text-t3 font-bold uppercase tracking-[4px] opacity-30 mb-1">Bringo Delivery</div>
         <div className="text-[8px] text-t3 opacity-20">Version 3.0 (TG Auth)</div>
      </div>
    </div>
  );
};

export default Profile;
