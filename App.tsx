
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
import { db, ref, set, get, onValue } from './firebase';
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
  cart: any[],
  setCart: any,
  allOrders: Order[],
  showToast: any,
  globalMenu: Record<string, MenuCategory[]>,
  setGlobalMenu: any,
  restaurants: Restaurant[],
  setRestaurants: any,
  heroSlideIndex: number,
  setHeroSlideIndex: any
}> = (props) => {
  const { 
    user, setUser,
    cart, setCart, allOrders, showToast, 
    globalMenu, setGlobalMenu, restaurants, setRestaurants,
    heroSlideIndex, setHeroSlideIndex 
  } = props;
  
  const location = useLocation();
  const isDetailPage = location.pathname.includes('/manage-') || location.pathname.includes('/item/');

  // If we reach here, user is guaranteed to be loaded (handled in App component)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col max-w-[430px] mx-auto relative font-nunito text-t1 shadow-2xl">
      <ScrollToTop />
      <div className={`flex-1 ${!isDetailPage ? 'pb-28' : ''}`}>
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} showToast={showToast} globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} restaurants={restaurants} heroSlideIndex={heroSlideIndex} setHeroSlideIndex={setHeroSlideIndex} />} />
          <Route path="/rests" element={<Rests restaurants={restaurants} />} />
          <Route path="/rest" element={<RestPage cart={cart} setCart={setCart} showToast={showToast} globalMenu={globalMenu} />} />
          <Route path="/item/:restId/:itemId" element={<ItemSelector globalMenu={globalMenu} setCart={setCart} showToast={showToast} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} showToast={showToast} />} />
          <Route path="/orders" element={<Orders user={user} role={user.role} allOrders={allOrders} showToast={showToast} />} />
          <Route path="/stats" element={<Stats user={user} currentOrder={null} />} />
          <Route path="/admin-settings" element={<AdminSettings user={user} setUser={setUser} restaurants={restaurants} setRestaurants={setRestaurants} globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} showToast={showToast} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
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
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<'loading' | 'unregistered' | 'not_telegram' | 'authenticated'>('loading');

  // REALTIME FIREBASE STATES
  const [restaurants, setRestaurantsLocal] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [globalMenu, setGlobalMenuLocal] = useState<Record<string, MenuCategory[]>>({});
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem('bringo_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // TELEGRAM WEB APP & FIREBASE SYNC
  useEffect(() => {
    const initAuth = async () => {
      const twa = (window as any).Telegram?.WebApp;
      let tgId = null;

      // Check if opened inside Telegram
      if (twa && twa.initDataUnsafe?.user) {
         twa.ready();
         twa.expand();
         tgId = twa.initDataUnsafe.user.id.toString();
      } else {
         // Fallback for local testing on PC browser (e.g. ?tgId=admin_1)
         const urlParams = new URLSearchParams(window.location.search);
         tgId = urlParams.get('tgId');
      }

      if (!tgId) {
         setAuthStatus('not_telegram');
         return;
      }

      // Check user in Firebase
      const snap = await get(ref(db, `users/${tgId}`));
      if (snap.exists()) {
          const fetchedUser = snap.val();
          setUser(fetchedUser);
          setAuthStatus('authenticated');
      } else {
          setAuthStatus('unregistered');
      }
    };

    initAuth();

    // Sync Global Data from Firebase
    onValue(ref(db, 'restaurants'), snap => {
        if (snap.exists()) setRestaurantsLocal(snap.val());
        else set(ref(db, 'restaurants'), INITIAL_RESTAURANTS);
    });

    onValue(ref(db, 'globalMenu'), snap => {
        if (snap.exists()) setGlobalMenuLocal(snap.val());
        else {
            const initialMenu: Record<string, MenuCategory[]> = {};
            INITIAL_RESTAURANTS.forEach(r => { initialMenu[r.id] = JSON.parse(JSON.stringify(INITIAL_MENU)); });
            set(ref(db, 'globalMenu'), initialMenu);
        }
    });

    onValue(ref(db, 'orders'), snap => {
        if (snap.exists()) {
            const ordersObj = snap.val();
            setAllOrders(Object.values(ordersObj));
        } else {
            setAllOrders([]);
        }
    });
  }, []);

  useEffect(() => { localStorage.setItem('bringo_cart', JSON.stringify(cart)); }, [cart]);

  // WRAPPERS TO PUSH CHANGES TO FIREBASE
  const setRestaurantsFirebase = (newRests: any) => {
      const updated = typeof newRests === 'function' ? newRests(restaurants) : newRests;
      set(ref(db, 'restaurants'), updated);
  };

  const setGlobalMenuFirebase = (newMenu: any) => {
      const updated = typeof newMenu === 'function' ? newMenu(globalMenu) : newMenu;
      set(ref(db, 'globalMenu'), updated);
  };

  // ---------------- RENDER AUTH STATES ----------------
  if (authStatus === 'loading') {
    return (
      <div className="fixed inset-0 bg-brand-bg z-[999] flex flex-col items-center justify-center">
        <div className="relative">
            <div className="text-6xl animate-float mb-6">🛵</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl"></div>
        </div>
        <div className="font-geologica text-4xl font-black text-white tracking-tighter">BRINGO</div>
        <div className="mt-4 w-12 h-[1px] bg-white/10 overflow-hidden transform-gpu">
            <div className="h-full bg-brand-orange w-full animate-[slide_1.5s_infinite]"></div>
        </div>
      </div>
    );
  }

  if (authStatus === 'not_telegram') {
    return (
      <div className="h-screen bg-brand-bg flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6">📱</div>
        <h1 className="font-geologica text-2xl font-black text-white mb-4">Відкрийте через Telegram</h1>
        <p className="text-sm text-t2">Цей додаток працює лише всередині Telegram. Будь ласка, перейдіть до нашого бота.</p>
      </div>
    );
  }

  if (authStatus === 'unregistered') {
    return (
      <div className="h-screen bg-brand-bg flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-[radial-gradient(ellipse_at_center,_rgba(255,92,0,0.15)_0%,_rgba(5,5,8,0)_60%)] pointer-events-none"></div>
        <div className="text-6xl mb-6 animate-float z-10">🔒</div>
        <h1 className="font-geologica text-3xl font-black text-white mb-4 z-10 tracking-tight">Потрібна реєстрація</h1>
        <p className="text-sm text-t2 mb-8 z-10 leading-relaxed">Ви не зареєстровані в системі.<br/>Закрийте це вікно та пройдіть реєстрацію в чаті з ботом.</p>
        <button 
          onClick={() => (window as any).Telegram?.WebApp?.close()}
          className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-geologica font-black text-sm uppercase active-scale shadow-xl shadow-brand-orange/20 z-10"
        >
          Закрити додаток
        </button>
      </div>
    );
  }

  // ---------------- AUTHENTICATED STATE ----------------
  return (
    <HashRouter>
      <AppContent 
        user={user} setUser={setUser} 
        cart={cart} setCart={setCart}
        allOrders={allOrders}
        showToast={showToast}
        globalMenu={globalMenu}
        setGlobalMenu={setGlobalMenuFirebase}
        restaurants={restaurants}
        setRestaurants={setRestaurantsFirebase}
        heroSlideIndex={heroSlideIndex}
        setHeroSlideIndex={setHeroSlideIndex}
      />
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 glass border border-white/10 rounded-full px-6 py-3 text-xs font-bold z-[1000] shadow-xl animate-reveal whitespace-nowrap">
          {toast}
        </div>
      )}
    </HashRouter>
  );
};

export default App;
