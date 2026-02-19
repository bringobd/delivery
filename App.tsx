
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, Order, MenuCategory, Restaurant } from './types';
import Home from './pages/Home';
import Rests from './pages/Rests';
import RestPage from './pages/RestPage';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import AdminSettings from './pages/AdminSettings';
import ItemManager from './components/ItemManager';
import RestaurantManager from './components/RestaurantManager';
import ItemSelector from './components/ItemSelector';
import Navigation from './components/Navigation';
import { RESTAURANTS as INITIAL_RESTAURANTS, MENU as INITIAL_MENU } from './constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.querySelector('.overflow-y-auto');
    if (container) container.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC<{ 
  user: User | null, 
  setUser: any, 
  loginCode: string, 
  setLoginCode: any, 
  handleLogin: any,
  cart: any[],
  setCart: any,
  currentOrder: Order | null,
  setCurrentOrder: any,
  showToast: any,
  globalMenu: Record<string, MenuCategory[]>,
  setGlobalMenu: any,
  restaurants: Restaurant[],
  setRestaurants: any,
  heroSlideIndex: number,
  setHeroSlideIndex: any
}> = (props) => {
  const { 
    user, setUser, loginCode, setLoginCode, handleLogin, 
    cart, setCart, currentOrder, setCurrentOrder, showToast, 
    globalMenu, setGlobalMenu, restaurants, setRestaurants,
    heroSlideIndex, setHeroSlideIndex 
  } = props;
  
  // Helper to determine if we are on a "detail" page to hide bottom nav if needed (optional)
  const location = useLocation();
  const isDetailPage = location.pathname.includes('/manage-') || location.pathname.includes('/item/');

  if (!user) {
    return (
      <div className="h-screen bg-brand-bg flex flex-col font-nunito relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-gradient-to-b from-brand-orange/20 to-transparent blur-[100px] pointer-events-none"></div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
            <div className="mb-12 animate-float">
                <div className="w-24 h-24 bg-gradient-to-tr from-brand-red to-brand-orange rounded-[32px] flex items-center justify-center text-5xl shadow-[0_20px_60px_rgba(255,92,0,0.3)]">
                  🛵
                </div>
            </div>
            
            <h1 className="font-geologica text-4xl font-black text-white tracking-tighter mb-3 text-center">BRINGO</h1>
            <p className="text-t2 text-xs font-bold tracking-[0.2em] uppercase opacity-50 text-center mb-16">Delivery App</p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-8">
                <div className="relative group">
                    <input 
                        type="password" 
                        inputMode="numeric"
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-center text-5xl font-geologica font-black tracking-[0.5em] outline-none focus:border-brand-orange transition-all text-white placeholder-white/5"
                        placeholder="••••"
                        maxLength={4}
                        autoFocus
                    />
                    <div className="absolute left-0 right-0 -bottom-6 text-center text-[9px] font-bold text-t3 uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity">
                        Access Code
                    </div>
                </div>
            </form>
        </div>

        <div className="p-8 z-10 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent">
             <button 
                onClick={handleLogin}
                className="w-full py-6 btn-gradient rounded-[24px] text-white font-geologica font-black text-sm uppercase tracking-[3px] active-scale transition-all shadow-[0_10px_40px_rgba(255,92,0,0.3)]"
             >
                Увійти
             </button>

             <div className="mt-8 flex justify-center gap-4 opacity-30">
                <span className="text-[9px] font-bold uppercase tracking-widest">Client: 1</span>
                <span className="text-[9px] font-bold uppercase tracking-widest">Courier: 2</span>
                <span className="text-[9px] font-bold uppercase tracking-widest">Admin: 4</span>
             </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col max-w-[430px] mx-auto relative font-nunito text-t1 shadow-2xl">
      <ScrollToTop />
      <div className={`flex-1 ${!isDetailPage ? 'pb-28' : ''}`}>
        <Routes>
          <Route path="/" element={
            <Home 
              user={user} 
              setUser={setUser}
              showToast={showToast} 
              globalMenu={globalMenu} 
              setGlobalMenu={setGlobalMenu} 
              restaurants={restaurants}
              heroSlideIndex={heroSlideIndex}
              setHeroSlideIndex={setHeroSlideIndex}
            />
          } />
          <Route path="/rests" element={<Rests restaurants={restaurants} />} />
          <Route path="/rest" element={<RestPage cart={cart} setCart={setCart} showToast={showToast} globalMenu={globalMenu} />} />
          
          {/* Client Item Selection Page */}
          <Route path="/item/:restId/:itemId" element={<ItemSelector globalMenu={globalMenu} setCart={setCart} showToast={showToast} />} />
          
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} showToast={showToast} />} />
          <Route path="/orders" element={<Orders user={user} role={user.role} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} showToast={showToast} />} />
          <Route path="/stats" element={<Stats user={user} currentOrder={currentOrder} />} />
          <Route path="/admin-settings" element={<AdminSettings user={user} restaurants={restaurants} setRestaurants={setRestaurants} globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} showToast={showToast} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          
          {/* Admin/Manager Pages */}
          <Route path="/manage-item/:restId/:catIdx/:itemIdx" element={<ItemManager globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} showToast={showToast} />} />
          <Route path="/manage-rest/:id" element={<RestaurantManager restaurants={restaurants} setRestaurants={setRestaurants} setGlobalMenu={setGlobalMenu} showToast={showToast} />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {!isDetailPage && <Navigation cartCount={cart.reduce((s, i) => s + i.qty, 0)} role={user.role} />}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bringo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('bringo_restaurants');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS;
  });
  
  const [globalMenu, setGlobalMenu] = useState<Record<string, MenuCategory[]>>(() => {
    const saved = localStorage.getItem('bringo_global_menu');
    if (saved) return JSON.parse(saved);
    
    const initial: Record<string, MenuCategory[]> = {};
    restaurants.forEach(r => {
        initial[r.id] = JSON.parse(JSON.stringify(INITIAL_MENU));
    });
    return initial;
  });

  // State for hero carousel persistence
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  const [loginCode, setLoginCode] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem('bringo_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('bringo_active_order');
    return saved ? JSON.parse(saved) : null;
  });

  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    localStorage.setItem('bringo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bringo_global_menu', JSON.stringify(globalMenu));
  }, [globalMenu]);

  useEffect(() => {
    localStorage.setItem('bringo_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    if (user) {
        localStorage.setItem('bringo_user', JSON.stringify(user));
    }
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let newUser: User | null = null;
    
    if (loginCode === '1') {
        newUser = { id: 'client_1', name: 'Олександр', role: 'client' };
    } else if (loginCode === '2') {
        newUser = { id: 'courier_1', name: 'Сервіс Доставки', role: 'courier', isOnline: false };
    } else if (loginCode === '4') {
        newUser = { id: 'admin_1', name: 'Адміністратор', role: 'admin' };
    } else if (loginCode.startsWith('3') && loginCode.length === 3) {
        const idx = parseInt(loginCode) - 301;
        if (restaurants[idx]) {
            newUser = { 
                id: `rest_${restaurants[idx].id}`, 
                name: `Менеджер ${restaurants[idx].n}`, 
                role: 'restaurant',
                ownedRestaurantId: restaurants[idx].id
            };
        }
    }
    
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('bringo_user', JSON.stringify(newUser));
      showToast(`Ласкаво просимо, ${newUser.name}`);
    } else {
      showToast('❌ Невірний код');
    }
  };

  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem('bringo_active_order', JSON.stringify(currentOrder));
    } else {
      localStorage.removeItem('bringo_active_order');
    }
  }, [currentOrder]);

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 1200);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-brand-bg z-[999] flex flex-col items-center justify-center">
        <div className="relative">
            <div className="text-6xl animate-float mb-6">🛵</div>
            <div className="absolute -inset-4 bg-brand-orange/20 blur-3xl rounded-full"></div>
        </div>
        <div className="font-geologica text-4xl font-black text-white tracking-tighter">BRINGO</div>
        <div className="mt-4 w-12 h-[1px] bg-white/10 overflow-hidden">
            <div className="h-full bg-brand-orange w-full animate-[slide_1.5s_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <AppContent 
        user={user} setUser={setUser} 
        loginCode={loginCode} setLoginCode={setLoginCode} 
        handleLogin={handleLogin}
        cart={cart} setCart={setCart}
        currentOrder={currentOrder} setCurrentOrder={setCurrentOrder}
        showToast={showToast}
        globalMenu={globalMenu}
        setGlobalMenu={setGlobalMenu}
        restaurants={restaurants}
        setRestaurants={setRestaurants}
        heroSlideIndex={heroSlideIndex}
        setHeroSlideIndex={setHeroSlideIndex}
      />
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 glass border border-white/10 rounded-full px-6 py-3 text-xs font-bold z-[1000] shadow-2xl animate-reveal whitespace-nowrap">
          {toast}
        </div>
      )}
    </HashRouter>
  );
};

export default App;
