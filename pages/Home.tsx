
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MenuCategory, Restaurant } from '../types';

const ImageWithFallback: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  return error ? (
    <div className={`${className} bg-s2 flex items-center justify-center border border-white/5`}>
      <span className="text-[8px] font-black opacity-30">No Image</span>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} onError={() => setError(true)} />
  );
};

interface HomeProps {
  user: User;
  setUser: (u: User) => void;
  showToast: (m: string) => void;
  globalMenu: Record<string, MenuCategory[]>;
  setGlobalMenu: React.Dispatch<React.SetStateAction<Record<string, MenuCategory[]>>>;
  restaurants: Restaurant[];
  heroSlideIndex: number;
  setHeroSlideIndex: (n: number) => void;
}

const Home: React.FC<HomeProps> = ({ user, setUser, showToast, globalMenu, setGlobalMenu, restaurants, heroSlideIndex, setHeroSlideIndex }) => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Restore scroll position on mount
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: heroSlideIndex * carouselRef.current.clientWidth,
        behavior: 'instant'
      });
    }
  }, []); // Only on mount

  useEffect(() => {
    if (user.role === 'admin' && window.location.hash === '#/') navigate('/orders');
  }, [user, navigate]);

  // Different slides for Courier vs Client
  const clientSlides = [
    { title: "Швидка доставка\nулюблених страв", sub: "Exclusive Offer", mirrored: false, icon: "FAST" },
    { title: "Фіксована доставка\nвід 50 до 80 грн!", sub: "Price Policy", mirrored: true, icon: "SAVE" },
    { title: "Бонуси за кожне\nваше замовлення", sub: "Loyalty Program", mirrored: false, icon: "GIFT" },
    { title: "Найкращі заклади\nтвого міста у нас!", sub: "New Flavors", mirrored: true, icon: "LOVE" }
  ];

  const courierSlides = [
    { title: "Приймай замовлення\nв один клік", sub: "Courier App", mirrored: false, icon: "GO" },
    { title: "Твій заробіток\nзалежить від тебе", sub: "Motivation", mirrored: true, icon: "CASH" },
    { title: "Будь обережним\nна дорозі!", sub: "Safety First", mirrored: false, icon: "SAFE" },
    { title: "Працюй, коли\nтобі зручно!", sub: "Flexible Schedule", mirrored: true, icon: "TIME" }
  ];

  const slides = user.role === 'courier' ? courierSlides : clientSlides;

  const nextSlide = useCallback(() => {
    if (!carouselRef.current) return;
    const nextIdx = (heroSlideIndex + 1) % slides.length;
    carouselRef.current.scrollTo({ left: nextIdx * carouselRef.current.clientWidth, behavior: 'smooth' });
    setHeroSlideIndex(nextIdx);
  }, [heroSlideIndex, slides.length, setHeroSlideIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide, isAutoPlaying]);

  const toggleShift = () => {
    const newUser = { ...user, isOnline: !user.isOnline };
    setUser(newUser);
    showToast(newUser.isOnline ? '🟢 Зміна розпочата' : '🔴 Зміна завершена');
  };

  // RESTAURANT VIEW
  if (user.role === 'restaurant') {
    const restMenu = globalMenu[user.ownedRestaurantId || ''] || [];
    const restaurantData = restaurants.find(r => r.id === user.ownedRestaurantId);
    return (
      <div className="px-6 py-6 animate-reveal">
        <header className="flex items-center justify-between mb-8 pt-4">
          <div>
            <h1 className="font-geologica text-2xl font-black text-white">{restaurantData?.n}</h1>
            <div className="text-[10px] font-black text-brand-orange uppercase tracking-[2px]">Керування Меню</div>
          </div>
          <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-xl active-scale" onClick={() => navigate('/profile')}>👤</div>
        </header>
        
        <div className="space-y-12 pb-32 px-1">
          {restMenu.map((cat, catIdx) => (
            <div key={catIdx}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-geologica text-lg font-black uppercase text-white/40 tracking-widest">{cat.cat}</h3>
                <button onClick={() => navigate(`/manage-item/${user.ownedRestaurantId}/${catIdx}/new`)} className="text-[10px] font-black text-brand-orange uppercase tracking-widest">+ Додати</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {cat.items.map((item, itemIdx) => (
                  <div key={item.id} className="glass p-4 rounded-[28px] flex gap-4 items-center border-white/5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0"><ImageWithFallback src={item.img} className="w-full h-full object-cover" alt={item.n} /></div>
                    <div className="flex-1 min-w-0 font-bold text-sm text-white truncate">{item.n}</div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/manage-item/${user.ownedRestaurantId}/${catIdx}/${itemIdx}`)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-sm active-scale">✏️</button>
                      <button onClick={() => { if(window.confirm('Видалити?')) {
                        const m = JSON.parse(JSON.stringify(restMenu));
                        m[catIdx].items.splice(itemIdx, 1);
                        setGlobalMenu(prev => ({ ...prev, [user.ownedRestaurantId!]: m }));
                      }}} className="w-10 h-10 glass rounded-full flex items-center justify-center text-sm text-brand-red active-scale">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // COURIER VIEW
  if (user.role === 'courier') {
      return (
        <div className="px-6 py-6 animate-reveal">
            <header className="flex items-center justify-between mb-8 pt-4">
                <div>
                <div className="font-geologica text-2xl font-black text-white tracking-tighter">КУР'ЄР</div>
                <div className="flex items-center gap-1 text-[10px] text-t2 font-bold uppercase mt-0.5">
                    <span className={user.isOnline ? "text-green-500" : "text-brand-red"}>●</span> {user.isOnline ? 'На зміні' : 'Не працюю'}
                </div>
                </div>
                <div className="w-12 h-12 glass border border-white/10 rounded-full flex items-center justify-center text-xl active-scale shadow-lg" onClick={() => navigate('/profile')}>👤</div>
            </header>

            {/* Persistent Carousel for Courier - Same Color as Client */}
            <div className="relative mb-10 overflow-hidden rounded-[32px] shadow-2xl h-44 mx-1">
                <div 
                  ref={carouselRef} 
                  onScroll={() => { if(carouselRef.current) setHeroSlideIndex(Math.round(carouselRef.current.scrollLeft / carouselRef.current.clientWidth)); }} 
                  className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar hero-carousel h-full"
                >
                {slides.map((slide, i) => (
                    <div key={i} className="min-w-full snap-start relative h-full">
                    <div className={`absolute inset-0 bg-gradient-to-r from-brand-red to-brand-orange ${slide.mirrored ? 'scale-x-[-1]' : ''}`}></div>
                    <div className="relative p-6 flex flex-col justify-center h-full">
                        <div className="absolute -right-6 -top-6 text-[100px] opacity-10 rotate-[-12deg] font-black italic uppercase text-white/5">{slide.icon}</div>
                        <div className="text-[9px] font-black tracking-[3px] opacity-70 uppercase mb-1 text-white">{slide.sub}</div>
                        <h2 className="font-geologica text-xl font-black leading-[1.1] mb-4 text-white whitespace-pre-line">{slide.title}</h2>
                    </div>
                    </div>
                ))}
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${heroSlideIndex === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}></div>
                ))}
                </div>
            </div>

            {/* Shift Toggle */}
            <button 
                onClick={toggleShift}
                className={`w-full py-6 rounded-[24px] font-geologica font-black text-sm uppercase tracking-[3px] shadow-2xl active-scale transition-all duration-300 mb-8 border border-white/5 ${user.isOnline ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white' : 'glass text-t2'}`}
            >
                {user.isOnline ? 'Завершити зміну' : 'Розпочати зміну'}
            </button>
            
            {!user.isOnline && (
                <div className="text-center p-8 opacity-40">
                    <div className="text-4xl mb-4 grayscale">😴</div>
                    <p className="text-xs font-bold uppercase tracking-widest text-t2">Ви не на зміні.<br/>Увімкніть статус, щоб отримувати замовлення.</p>
                </div>
            )}
            
            {user.isOnline && (
                 <div className="glass p-6 rounded-[28px] text-center border-brand-orange/20 relative overflow-hidden">
                     <div className="absolute inset-0 bg-brand-orange/5 animate-pulse"></div>
                     <div className="relative z-10">
                        <div className="text-4xl mb-2">📡</div>
                        <h3 className="font-geologica font-black text-white mb-1">Пошук замовлень...</h3>
                        <p className="text-[10px] text-brand-orange font-bold uppercase tracking-widest">Очікуйте сповіщення</p>
                     </div>
                 </div>
            )}
        </div>
      );
  }

  // CLIENT VIEW
  return (
    <div className="px-6 py-6 animate-reveal">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div>
          <div className="font-geologica text-2xl font-black text-white tracking-tighter">BRINGO</div>
          <div className="flex items-center gap-1 text-[10px] text-t2 font-bold uppercase mt-0.5">
             <span className="text-brand-orange">●</span> Білгород-Дністровський
          </div>
        </div>
        <div className="w-12 h-12 glass border border-white/10 rounded-full flex items-center justify-center text-xl active-scale shadow-lg" onClick={() => navigate('/profile')}>👤</div>
      </header>

      <div className="relative mb-10 overflow-hidden rounded-[32px] shadow-2xl h-44 mx-1">
        <div 
            ref={carouselRef} 
            onScroll={() => { if(carouselRef.current) setHeroSlideIndex(Math.round(carouselRef.current.scrollLeft / carouselRef.current.clientWidth)); }} 
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar hero-carousel h-full"
        >
          {slides.map((slide, i) => (
            <div key={i} className="min-w-full snap-start relative h-full">
              <div className={`absolute inset-0 bg-gradient-to-r from-brand-red to-brand-orange ${slide.mirrored ? 'scale-x-[-1]' : ''}`}></div>
              <div className="relative p-6 flex flex-col justify-center h-full">
                  <div className="absolute -right-6 -top-6 text-[100px] opacity-10 rotate-[-12deg] font-black italic uppercase text-white/5">{slide.icon}</div>
                  <div className="text-[9px] font-black tracking-[3px] opacity-70 uppercase mb-1 text-white">{slide.sub}</div>
                  <h2 className="font-geologica text-xl font-black leading-[1.1] mb-4 text-white whitespace-pre-line">{slide.title}</h2>
                  <button onClick={() => navigate('/rests')} className="self-start bg-white text-black rounded-full px-6 py-2.5 font-geologica text-[10px] font-black uppercase shadow-xl active-scale">Замовити</button>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${heroSlideIndex === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="font-geologica text-lg font-extrabold tracking-tight">Рекомендовано</h3>
        <button onClick={() => navigate('/rests')} className="text-[11px] font-black text-brand-orange uppercase opacity-80">Всі</button>
      </div>

      <div className="mask-horizontal mb-12">
        <div className="flex gap-5 overflow-x-auto overflow-y-hidden no-scrollbar -mx-5 px-10 select-none pb-4">
          {restaurants.slice(0, 4).map((r, i) => (
            <div key={r.id} className="flex-shrink-0 w-64 cursor-pointer" onClick={() => navigate('/rest', { state: { restaurant: r } })}>
              <div className="relative h-40 rounded-3xl overflow-hidden mb-3 shadow-2xl active-scale">
                  <ImageWithFallback src={r.img} alt={r.n} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 flex gap-2"><div className="glass px-3 py-1.5 rounded-xl text-[10px] font-black text-white">⏱ {r.time} ХВ</div></div>
              </div>
              <div className="px-1">
                  <div className="font-geologica text-sm font-extrabold mb-1 text-white">{r.n}</div>
                  <div className="flex items-center gap-2 text-[10px] text-t2 font-medium uppercase tracking-wider">
                      <span className="text-brand-orange font-bold">★ {r.rating}</span>
                      <span className="opacity-30">•</span><span>{r.categories[0]}</span>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
