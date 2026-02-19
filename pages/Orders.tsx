
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order, OrderStatus, Role } from '../types';
import { STATUS_CONFIG } from '../constants';
import { db, ref, set } from '../firebase';

interface OrdersProps {
  user: User;
  role: Role;
  allOrders: Order[];
  showToast: (m: string) => void;
}

const Orders: React.FC<OrdersProps> = ({ user, role, allOrders, showToast }) => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleItems = (id: number) => {
      setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateStatus = async (order: Order, status: OrderStatus) => {
    await set(ref(db, `orders/${order.id}/status`), status);
    if (status === 'done') {
      showToast('🎉 Доставку завершено!');
    } else {
      showToast(`✅ ${STATUS_CONFIG[status].label}`);
    }
  };

  const acceptOrder = async (order: Order) => {
    await set(ref(db, `orders/${order.id}/courierName`), user.name);
    await set(ref(db, `orders/${order.id}/courierAccepted`), true);
    await set(ref(db, `orders/${order.id}/status`), 'accepted');
    showToast('🛵 Замовлення прийнято!');
  };

  const cancelOrder = async (order: Order) => {
    await set(ref(db, `orders/${order.id}/status`), 'cancelled');
    showToast('❌ Замовлення скасовано');
  };

  // Filter Orders based on Role
  const displayedOrders = allOrders.filter(o => {
      if (role === 'admin') return true;
      if (role === 'restaurant') return o.restaurantId === user.ownedRestaurantId;
      if (role === 'courier') {
          // Courier sees ready orders to pick up, OR orders they already accepted
          return o.status === 'ready' || o.status === 'picked' || o.courierName === user.name;
      }
      // Client sees their own orders
      return o.chatId === user.id || o.clientPhone === user.phone;
  }).sort((a, b) => b.placed - a.placed);

  const activeClientOrder = role === 'client' ? displayedOrders.find(o => o.status !== 'done' && o.status !== 'cancelled') : null;

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

  return (
    <div className="px-6 py-6 animate-reveal pb-32">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="font-geologica text-2xl font-black text-white tracking-tight">
            {role === 'admin' ? 'Адмін Панель' : role === 'restaurant' ? 'Кухня' : 'Замовлення'}
          </h1>
          <div className="text-[10px] font-black text-brand-orange uppercase tracking-[3px] opacity-80">
            {role === 'admin' ? 'Керування замовленнями' : role === 'restaurant' ? 'Управління' : 'Список замовлень'}
          </div>
        </div>
        <div className="w-12 h-12 glass border border-white/10 rounded-full flex items-center justify-center text-xl active-scale cursor-pointer shadow-lg" onClick={() => navigate('/profile')}>
          👤
        </div>
      </header>

      {/* Progress tracking for client's active order */}
      {role === 'client' && activeClientOrder && (
        <div className="mb-10 px-2 animate-reveal">
            <h3 className="font-geologica text-sm font-black text-white mb-4 uppercase tracking-widest text-center">Активне Замовлення #{activeClientOrder.id.toString().slice(-4)}</h3>
            <div className="flex justify-between items-center relative z-10">
                {progressSteps.map((step, i) => {
                    const activeStep = getProgress(activeClientOrder.status);
                    const isPassed = i <= activeStep;
                    return (
                        <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-300 ${isPassed ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${isPassed ? 'bg-brand-orange border-brand-orange text-white' : 'glass border-white/10'}`}>
                            {step.icon}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="h-1 bg-white/10 rounded-full -mt-7 mx-4 relative z-0">
                <div 
                className="h-full bg-brand-orange rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(getProgress(activeClientOrder.status) / (progressSteps.length - 1)) * 100}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-8">
                {progressSteps.map((step, i) => (
                <div key={i} className={`text-[8px] font-black uppercase tracking-wider text-center w-14 transition-all duration-300 ${i === getProgress(activeClientOrder.status) ? 'text-brand-orange scale-110' : 'text-t3'}`}>
                    {step.label}
                </div>
                ))}
            </div>
        </div>
      )}

      {displayedOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 mt-20 transform-gpu">
          <div className="text-7xl mb-8 grayscale">📦</div>
          <h3 className="font-geologica text-xl font-black mb-3 text-white">Немає замовлень</h3>
          <p className="text-sm text-t2 leading-relaxed">Всі замовлення<br/>з'являться тут.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayedOrders.map((order, orderIdx) => {
             const isExpanded = !!expandedItems[order.id];
             
             return (
              <div key={order.id} className={`animate-reveal stagger-${(orderIdx%3)+1}`}>
                  <div className="p-5 glass rounded-t-[32px] flex items-center gap-4 border border-white/5 shadow-lg transform-gpu" style={{borderColor: `${STATUS_CONFIG[order.status].color}40`}}>
                    <div className="text-4xl">{STATUS_CONFIG[order.status].icon}</div>
                    <div className="flex-1">
                        <div className="font-geologica text-base font-black tracking-tight" style={{color: STATUS_CONFIG[order.status].color}}>{STATUS_CONFIG[order.status].label}</div>
                        <div className="text-[9px] text-t2 font-black uppercase tracking-[3px] mt-1 opacity-50">Час: {order.time} • #{order.id.toString().slice(-4)}</div>
                    </div>
                  </div>

                  <div className="glass rounded-b-[32px] p-6 mb-2 shadow-lg border-x border-b border-white/5 overflow-hidden transform-gpu">
                    <button 
                      onClick={() => toggleItems(order.id)}
                      className="w-full flex items-center justify-between text-[9px] font-black text-brand-orange uppercase tracking-[4px] font-geologica opacity-60 mb-2 active-scale px-2 py-1 outline-none"
                    >
                      <span>Склад замовлення ({order.items.length})</span>
                      <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    
                    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden min-h-0">
                        <div className="space-y-4 pb-2 pt-4">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-start text-xs font-bold pb-3 border-b border-white/5 last:border-0 last:pb-0">
                              <div className="flex-1">
                                <div className="text-white text-sm">{item.name} <span className="text-brand-orange ml-2">×{item.qty}</span></div>
                                {item.opts.length > 0 && <div className="text-[9px] text-t2 mt-1 font-medium">{item.opts.join(', ')}</div>}
                              </div>
                              <div className="font-geologica font-black text-white ml-4 whitespace-nowrap">{item.price} ₴</div>
                            </div>
                          ))}
                          
                          {(role === 'admin' || role === 'restaurant') && (
                              <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-t2 font-bold uppercase tracking-widest">
                                 Клієнт: <span className="text-white">{order.client}</span><br/>
                                 Тел: <span className="text-white">{order.clientPhone}</span>
                              </div>
                          )}
                          {(role === 'admin' || role === 'courier') && (
                              <div className="mt-2 text-[10px] text-t2 font-bold uppercase tracking-widest">
                                 Адреса: <span className="text-white">{order.address}</span>
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex justify-between items-center transition-all duration-300 ${isExpanded ? 'border-t border-white/5 mt-4 pt-6' : 'pt-2'}`}>
                      <span className="font-geologica text-[10px] font-black uppercase tracking-[3px] text-t2">Разом</span>
                      <span className="font-geologica text-2xl font-black text-brand-orange">{order.total} ₴</span>
                    </div>

                    {/* ACTION BUTTONS BASED ON ROLE & STATUS */}
                    <div className="mt-6 space-y-3">
                        {role === 'restaurant' && order.status === 'new' && (
                        <button onClick={() => updateStatus(order, 'cooking')} className="w-full py-4 bg-brand-orange rounded-xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale shadow-lg">✅ ПРИЙНЯТИ ТА ГОТУВАТИ</button>
                        )}
                        {role === 'restaurant' && order.status === 'cooking' && (
                        <button onClick={() => updateStatus(order, 'ready')} className="w-full py-4 bg-green-500 rounded-xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale shadow-lg">🍽 ГОТОВО ДО ВИДАЧІ</button>
                        )}
                        {role === 'courier' && order.status === 'ready' && (
                        <button onClick={() => acceptOrder(order)} className="w-full py-4 bg-blue-500 rounded-xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale shadow-lg">🛵 ЗАБРАТИ ЗАМОВЛЕННЯ</button>
                        )}
                        {role === 'courier' && order.status === 'accepted' && order.courierName === user.name && (
                        <button onClick={() => updateStatus(order, 'picked')} className="w-full py-4 bg-brand-orange rounded-xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale">📦 ЗАМОВЛЕННЯ В ДОРОЗІ</button>
                        )}
                        {role === 'courier' && order.status === 'picked' && order.courierName === user.name && (
                        <button onClick={() => updateStatus(order, 'done')} className="w-full py-4 bg-green-500 rounded-xl text-white font-geologica font-black text-xs tracking-[2px] uppercase active-scale">🎉 ДОСТАВЛЕНО</button>
                        )}
                        {(role === 'client' || role === 'admin') && order.status === 'new' && (
                        <button onClick={() => cancelOrder(order)} className="w-full py-4 glass border-brand-red/30 rounded-xl text-brand-red font-geologica font-black text-xs tracking-[2px] uppercase active-scale">❌ СКАСУВАТИ ЗАМОВЛЕННЯ</button>
                        )}
                    </div>
                  </div>
              </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
