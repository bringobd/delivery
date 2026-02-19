
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order } from '../types';
import { db, ref, set } from '../firebase';

interface CartProps {
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  user: User;
  showToast: (m: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, setCart, user, showToast }) => {
  const navigate = useNavigate();
  const [addr, setAddr] = useState('вул. Приморська 12, кв. 3');
  const [ordering, setOrdering] = useState(false);

  const subtotal = cart.reduce((s, c) => s + c.unitPrice * c.qty, 0);
  const total = subtotal + 50;

  const handleCheckout = async () => {
    setOrdering(true);
    
    const newOrderId = Date.now();
    const order: Order = {
      id: newOrderId,
      status: 'new',
      items: cart.map(c => ({ name: c.item.n, opts: c.opts, price: c.unitPrice * c.qty, qty: c.qty })),
      total: total,
      address: addr,
      client: [user.name, user.surname].filter(Boolean).join(' ') || 'Гість',
      clientPhone: user.phone || '',
      chatId: user.id, // Link to Telegram chat
      time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
      placed: newOrderId,
      courierName: null,
      courierAccepted: false,
      restaurantProfit: Math.round(subtotal * 0.8),
      platformProfit: Math.round(subtotal * 0.2) + 50,
      restaurantId: cart[0]?.restaurantId || ''
    };

    // Save strictly to Firebase
    await set(ref(db, `orders/${newOrderId}`), order);

    setCart([]);
    showToast('🎉 Замовлення оформлено!');
    navigate('/orders');
    setOrdering(false);
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-reveal">
        <div className="text-7xl opacity-20 mb-6">🛒</div>
        <h3 className="font-geologica text-xl font-black mb-2">Кошик порожній</h3>
        <p className="text-sm text-t2 leading-relaxed mb-8">Додайте щось смачне з меню, щоб оформити доставку</p>
        <button onClick={() => navigate('/rests')} className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-geologica font-black text-sm active-scale transition-transform">
          ДО МЕНЮ
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 animate-reveal">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="font-geologica text-2xl font-black text-white">Кошик</h1>
          <div className="text-[10px] text-t2 font-bold uppercase tracking-widest mt-0.5">{cart.length} позицій</div>
        </div>
        <div className="flex items-center gap-3">
            {cart.length > 0 && (
                <button onClick={() => setCart([])} className="h-12 px-4 glass border border-white/10 rounded-full flex items-center justify-center text-[10px] text-brand-red font-black uppercase tracking-widest active-scale">
                    Очистити
                </button>
            )}
            <div className="w-12 h-12 glass border border-white/10 rounded-full flex items-center justify-center text-xl active-scale cursor-pointer shadow-lg" onClick={() => navigate('/profile')}>
                👤
            </div>
        </div>
      </header>

      <div className="space-y-4 mb-10 px-1">
        {cart.map((c, i) => (
          <div key={i} className="flex items-center gap-4 p-4 glass rounded-2xl animate-reveal" style={{animationDelay: `${i * 0.1}s`}}>
            <div className="w-14 h-14 bg-cover bg-center rounded-xl shrink-0 shadow-lg" style={{backgroundImage: `url('${c.item.img}')`}}></div>
            <div className="flex-1 min-w-0">
              <div className="font-geologica text-[12px] font-black mb-0.5 text-white">{c.item.n} ×{c.qty}</div>
              <div className="text-[10px] text-t2 line-clamp-1 mb-1 font-medium">{c.opts.join(', ')}</div>
              <div className="font-geologica text-brand-orange text-xs font-black">{c.unitPrice * c.qty} UAH</div>
            </div>
            <button onClick={() => setCart(prev => prev.filter((_, idx) => idx !== i))} className="w-8 h-8 glass text-brand-red rounded-lg flex items-center justify-center active-scale">✕</button>
          </div>
        ))}
      </div>

      <div className="glass rounded-[32px] p-6 shadow-2xl mb-24 mx-1">
        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-t2">Сума</span>
            <span>{subtotal} UAH</span>
          </div>
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-t2">Доставка</span>
            <span>50 UAH</span>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="font-geologica text-sm font-black uppercase tracking-[2px]">Разом</span>
            <span className="font-geologica text-2xl font-black text-brand-orange">{total} UAH</span>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-[10px] font-black text-t2 uppercase tracking-[2px] mb-3 font-geologica opacity-60">📍 Delivery Address</label>
          <input 
            type="text" 
            value={addr} 
            onChange={e => setAddr(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-brand-orange/40 transition-all text-white shadow-inner"
            placeholder="Address..."
          />
        </div>

        <button 
          onClick={handleCheckout}
          disabled={ordering}
          className="w-full bg-brand-orange py-5 rounded-2xl text-white font-geologica font-black text-sm tracking-widest uppercase active-scale transition-all disabled:opacity-50 shadow-xl shadow-brand-orange/20"
        >
          {ordering ? 'Processing...' : 'Place Order →'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
