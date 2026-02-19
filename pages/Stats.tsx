
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order } from '../types';

interface StatsProps {
  user: User;
  currentOrder: Order | null;
}

const Stats: React.FC<StatsProps> = ({ user, currentOrder }) => {
  const navigate = useNavigate();
  const [commission, setCommission] = useState(20);
  const [timeRange, setTimeRange] = useState<'today' | 'month'>('today');

  const stats = useMemo(() => {
    const isToday = timeRange === 'today';
    
    // --- Courier Statistics ---
    if (user.role === 'courier') {
        const completedOrders = isToday ? (currentOrder?.status === 'done' ? 3 : 2) : 85;
        const earnings = completedOrders * 50; // 50 UAH per order
        const avgTime = isToday ? '28 хв' : '32 хв';
        
        return {
            title: isToday ? 'За сьогодні' : 'За цей місяць',
            metrics: [
                { label: 'Заробіток', value: `${earnings} ₴`, sub: 'Всього' },
                { label: 'Замовлення', value: completedOrders, sub: 'Доставлено' },
                { label: 'Сер. Час', value: avgTime, sub: 'На замовлення' },
            ]
        };
    }

    // --- Restaurant Statistics ---
    if (user.role === 'restaurant') {
        const orders = isToday ? 12 : 340;
        const avgPrepTime = isToday ? '18 хв' : '20 хв';
        const rating = 4.8;

        return {
            title: isToday ? 'Кухня сьогодні' : 'Кухня за місяць',
            metrics: [
                { label: 'Замовлень', value: orders, sub: 'Приготовано' },
                { label: 'Час видачі', value: avgPrepTime, sub: 'Середній' },
                { label: 'Рейтинг', value: rating, sub: 'Оцінка закладу' }
            ]
        }
    }

    // --- Admin Statistics ---
    const subtotal = currentOrder ? (currentOrder.total - 50) : 0;
    const turnover = isToday ? (currentOrder ? 1240 : 850) : 45200;
    const profit = isToday ? (currentOrder ? 298 : 180) : 9040;
    const ordersCount = isToday ? (currentOrder ? 4 : 3) : 128;
    const activeCouriers = 3;

    return {
      title: isToday ? 'Статистика за сьогодні' : 'Статистика за місяць',
      metrics: [
          { label: 'Прибуток', value: `${profit} ₴`, sub: 'Чистий дохід' },
          { label: 'Оборот', value: `${turnover} ₴`, sub: isToday ? 'За сьогодні' : 'За місяць' },
          { label: 'Замовлення', value: ordersCount, sub: 'Успішних' },
          { label: 'Кур\'єри', value: activeCouriers, sub: 'На лінії' }
      ]
    };
  }, [currentOrder, commission, user.role, timeRange]);

  return (
    <div className="p-6 animate-reveal pb-32">
        <header className="flex items-center justify-between mb-6 pt-4">
          <div>
            <h1 className="font-geologica text-3xl font-black mb-1 text-white tracking-tight">Статистика</h1>
            <p className="text-[10px] font-black text-brand-orange uppercase tracking-[3px] opacity-80">{user.role === 'courier' ? 'Мій прогрес' : user.role === 'restaurant' ? 'Ефективність кухні' : 'Аналітика сервісу'}</p>
          </div>
          <div className="w-12 h-12 glass border border-white/10 rounded-full flex items-center justify-center text-xl active-scale cursor-pointer" onClick={() => navigate('/profile')}>
            👤
          </div>
        </header>

        {/* Time Range Toggle */}
        <div className="bg-white/5 p-1 rounded-2xl flex mb-8">
            <button 
                onClick={() => setTimeRange('today')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === 'today' ? 'bg-brand-orange text-white shadow-lg' : 'text-t3'}`}
            >
                Сьогодні
            </button>
            <button 
                onClick={() => setTimeRange('month')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === 'month' ? 'bg-brand-orange text-white shadow-lg' : 'text-t3'}`}
            >
                Місяць
            </button>
        </div>

        {/* Grid with animation key to trigger re-render effect */}
        <div key={timeRange} className={`grid ${user.role === 'courier' || user.role === 'restaurant' ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'} mb-8 animate-reveal`}>
          {stats.metrics.map((m, i) => (
             <div key={i} className={`glass p-5 rounded-[28px] ${i === 0 ? 'bg-gradient-to-br from-brand-orange/10 to-transparent border-brand-orange/5' : ''}`}>
                <div className="text-[8px] font-black text-t3 uppercase tracking-widest mb-2">{m.label}</div>
                <div className="text-xl font-geologica font-black text-white">{m.value}</div>
                <div className="text-[8px] font-bold text-t2 mt-1 opacity-40">{m.sub}</div>
             </div>
          ))}
        </div>

        {user.role === 'admin' && (
            <div className="glass rounded-[28px] p-6 mb-8 border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-geologica text-[10px] font-black uppercase tracking-widest text-t2">Комісія сервісу</h3>
                <span className="text-brand-orange font-black text-lg">{commission}%</span>
            </div>
            <input 
                type="range" 
                min="5" 
                max="40" 
                value={commission} 
                onChange={(e) => setCommission(parseInt(e.target.value))}
                className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
            <div className="flex justify-between mt-3 text-[8px] font-bold text-t3 uppercase tracking-widest">
                <span>5%</span>
                <span>40%</span>
            </div>
            </div>
        )}
        
        {user.role === 'courier' && (
            <div className="glass p-6 rounded-[28px] text-center">
                <div className="text-[10px] font-black text-t2 uppercase tracking-widest mb-1">
                    Поточний статус
                </div>
                <div className="font-geologica text-2xl font-black text-white">
                    {user.isOnline ? '🟢 На зміні' : '🔴 Не працюю'}
                </div>
            </div>
        )}
    </div>
  );
};

export default Stats;
