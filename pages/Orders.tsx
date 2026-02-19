
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order, OrderStatus, Role } from '../types';
import { STATUS_CONFIG } from '../constants';

interface OrdersProps {
  user: User;
  role: Role;
  currentOrder: Order | null;
  setCurrentOrder: (o: Order | null) => void;
  showToast: (m: string) => void;
}

const Orders: React.FC<OrdersProps> = ({ user, role, currentOrder, setCurrentOrder, showToast }) => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState(false);

  const updateStatus = async (status: OrderStatus) => {
    if (!currentOrder) return;
    if (status === 'done') {
      setCurrentOrder(null);
      showToast('🎉 Доставку завершено!');
    } else {
      setCurrentOrder({ ...currentOrder, status });
      showToast(`✅ ${STATUS_CONFIG[status].label}`);
    }
  };

  const acceptOrder = async () => {
    if (!currentOrder) return;
    setCurrentOrder({
      ...currentOrder,
      courierName: user.name,
      courierAccepted: true,
      status: 'accepted'
    });
    showToast('🛵 Замовлення прийнято!');
  };

  const cancelOrder = async () => {
    if (!currentOrder) return;
    setCurrentOrder(null);
    showToast('❌ Замовлення скасовано');
  };

  // 3. Restaurant Filtering: Show order only if it belongs to this restaurant
  const shouldShowOrder = currentOrder && (
    role !== 'restaurant' || currentOrder.restaurantId === user.ownedRestaurantId
  );

  // 2. Progress Bar Logic
  const getProgress = (status: OrderStatus) => {
    const sequence = ['new', 'accepted', 'cooking', 'ready', 'picked', 'done'];
    const idx = sequence.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const progressSteps = [
    { id: 'new', label: 'Оформлено', icon: '📝' },
    { id: 'cooking', label: 'Готується', icon: '🍳' },
    { id: 'ready', label: 'Очікує', icon: '🛍' },
    { id: 'picked', label: 'В дорозі', icon: '🛵' },
    { id: 'done', label: 'Доставлено', icon: '🎉' }
  ];

  const currentProgressIdx = currentOrder ? getProgress(currentOrder.status) : 0;
  // Map internal status to visual steps
  const activeStep = (() => {
    if (!currentOrder) return 0;
    const s = currentOrder.status;
    if (s === 'new' || s === 'accepted') return 0;
    if (s === 'cooking') return 1;
    if (s === 'ready') return 2;
    if (s === 'picked') return 3;
    if (s === 'done') return 4;
    return 0;
  })();

  return (
    <div className="px-6 py-6 animate-reveal pb-32">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="font-geologica text-2xl font-black text-white tracking-tight">
            {role === 'admin' ? 'Адмін Панель' : role === 'restaurant' ? 'Кухня' : 'Замовлення'}
          </h1>
          <div className="text-[10px] font-black text-brand-orange uppercase tracking-[3px] opacity-80">
            {role === 'admin' ? 'Керування замовленнями' : role === 'restaurant' ? 'Керування замовленнями' : 'Статус замовлення'}
          </div>
        </div>
        <div className="w-12 h-12 glass border border-white/10 rounded-full flex items-center justify-center text-xl active-scale cursor-pointer shadow-lg" onClick={() => navigate('/profile')}>
          👤
        </div>
      </header>

      {!shouldShowOrder ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 mt-20">
          <div className="text-7xl mb-8 grayscale">📦</div>
          <h3 className="font-geologica text-xl font-black mb-3 text-white">Немає замовлень</h3>
          <p className="text-sm text-t2 leading-relaxed">Всі замовлення<br/>з'являться тут.</p>
        </div>
      ) : (
        <div className="animate-reveal px-1">
          
          {/* Progress Bar for Clients */}
          {role === 'client' && (
             <div className="mb-10 px-2">
               <div className="flex justify-between items-center relative z-10">
                 {progressSteps.map((step, i) => (
                   <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-500 ${i <= activeStep ? 'opacity-100' : 'opacity-30'}`}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500 ${i <= activeStep ? 'bg-brand-orange border-brand-orange text-white shadow-[0_0_15px_#FF5C00]' : 'glass border-white/10'}`}>
                       {step.icon}
                     </div>
                   </div>
                 ))}
               </div>
               <div className="h-1 bg-white/10 rounded-full -mt-7 mx-4 relative z-0">
                  <div 
                    className="h-full bg-brand-orange rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(activeStep / (progressSteps.length - 1)) * 100}%` }}
                  ></div>
               </div>
               <div className="flex justify-between mt-8">
                 {progressSteps.map((step, i) => (
                   <div key={i} className={`text-[8px] font-black uppercase tracking-wider text-center w-14 transition-all duration-500 ${i === activeStep ? 'text-brand-orange scale-110' : 'text-t3'}`}>
                     {step.label}
                   </div>
                 ))}
               </div>
             </div>
          )}

          {role !== 'admin' && role !== 'client' && (
            <div className="p-7 glass rounded-[32px] mb-8 flex items-center gap-6 border-2 shadow-2xl transition-all" style={{borderColor: `${STATUS_CONFIG[currentOrder.status].color}40`}}>
              <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{STATUS_CONFIG[currentOrder.status].icon}</div>
              <div>
                <div className="font-geologica text-lg font-black tracking-tight" style={{color: STATUS_CONFIG[currentOrder.status].color}}>{STATUS_CONFIG[currentOrder.status].label}</div>
                <div className="text-[9px] text-t2 font-black uppercase tracking-[3px] mt-1 opacity-50">Оновлено щойно</div>
              </div>
            </div>
          )}

          <div className="glass rounded-[32px] p-6 mb-10 shadow-xl border-white/5 overflow-hidden">
            <button 
              onClick={() => setExpandedItems(!expandedItems)}
              className="w-full flex items-center justify-between text-[9px] font-black text-brand-orange uppercase tracking-[4px] font-geologica opacity-60 mb-2 active-scale px-2 py-1"
            >
              <span>Склад замовлення ({currentOrder.items.length})</span>
              <span className={`transition-transform duration-300 ${expandedItems ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {/* 4. Accordion Animation */}
            <div className={`grid transition-[grid-template-rows,opacity,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expandedItems ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0 pt-0'}`}>
              <div className="overflow-hidden min-h-0">
                <div className="space-y-5 pb-2">
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start text-xs font-bold pb-4 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <div className="text-white text-sm">{item.name} <span className="text-brand-orange ml-2">×{item.qty}</span></div>
                        {item.opts.length > 0 && <div className="text-[9px] text-t2 mt-1.5 font-medium">{item.opts.join(', ')}</div>}
                      </div>
                      <div className="font-geologica font-black text-white ml-4 whitespace-nowrap">{item.price} ₴</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`flex justify-between items-center transition-all duration-500 ${expandedItems ? 'border-t border-white/5 mt-4 pt-6' : 'pt-2'}`}>
              <span className="font-geologica text-[10px] font-black uppercase tracking-[3px] text-t2">Разом</span>
              <span className="font-geologica text-2xl font-black text-brand-orange">{currentOrder.total} ₴</span>
            </div>
          </div>

          <div className="space-y-4">
            {role === 'restaurant' && currentOrder.status === 'new' && (
              <button onClick={() => updateStatus('cooking')} className="w-full py-5 bg-brand-orange rounded-2xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale shadow-xl shadow-brand-orange/20">✅ ПРИЙНЯТИ ТА ГОТУВАТИ</button>
            )}
            {role === 'restaurant' && currentOrder.status === 'cooking' && (
              <button onClick={() => updateStatus('ready')} className="w-full py-5 bg-green-500 rounded-2xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale shadow-xl shadow-green-500/20">🍽 ГОТОВО ДО ВИДАЧІ</button>
            )}
            {role === 'courier' && currentOrder.status === 'ready' && (
              <button onClick={acceptOrder} className="w-full py-5 bg-blue-500 rounded-2xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale shadow-xl shadow-blue-500/20">🛵 ЗАБРАТИ ЗАМОВЛЕННЯ</button>
            )}
            {role === 'courier' && currentOrder.status === 'accepted' && (
              <button onClick={() => updateStatus('picked')} className="w-full py-5 bg-brand-orange rounded-2xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale">📦 ЗАМОВЛЕННЯ В ДОРОЗІ</button>
            )}
            {role === 'courier' && currentOrder.status === 'picked' && (
              <button onClick={() => updateStatus('done')} className="w-full py-5 bg-green-500 rounded-2xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale">🎉 ДОСТАВЛЕНО</button>
            )}
            {(role === 'client' || role === 'admin') && currentOrder.status === 'new' && (
              <button onClick={cancelOrder} className="w-full py-5 glass border-brand-red/30 rounded-2xl text-brand-red font-geologica font-black text-xs tracking-[2px] uppercase active-scale">❌ СКАСУВАТИ ЗАМОВЛЕННЯ</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
