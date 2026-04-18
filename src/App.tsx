/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from './hooks/useCart';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { MobileHeader } from './components/MobileHeader';
import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { MenuDrawer } from './components/MenuDrawer';
import { useCart } from './hooks/useCart';
import { Home } from './pages/Home';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { OrderSelection } from './pages/OrderSelection';
import { Restaurants } from './pages/Restaurants';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CourierDashboard } from './pages/CourierDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { Cart } from './pages/Cart';

function AppRoutes({ onOpenCart, onOpenMenu }: { onOpenCart: () => void; onOpenMenu: () => void }) {
  const { user, isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-24 lg:pb-0">
      <div className="hidden lg:block">
        <Navbar onOpenCart={onOpenCart} onOpenMenu={onOpenMenu} />
      </div>
      
      <MobileHeader />

      <main className="flex-1 pt-16 lg:pt-20 text-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<OrderSelection />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Role-based routes */}
          {user?.role === 'admin' && <Route path="/admin" element={<AdminDashboard />} />}
          {user?.role === 'courier' && <Route path="/courier" element={<CourierDashboard />} />}
          {user?.role === 'restaurant' && <Route path="/owner" element={<OwnerDashboard />} />}
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-slate-900 text-white py-12 md:py-20 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white overflow-hidden">
                  <img 
                    src="resources/logo2.png" 
                    alt="B" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-2xl font-display font-black tracking-tight">
                  BRIN<span className="text-brand">GO</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Delivering happiness to your door, one dish at a time. The best local restaurants at your fingertips.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-brand transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Become a Partner</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Become a Courier</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-brand transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Newsletter</h4>
              <p className="text-slate-400 mb-4">Subscribe to receive special offers and updates.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="bg-white/10 border-none rounded-xl px-4 py-2 flex-1 text-sm focus:ring-2 focus:ring-brand/50"
                />
                <button className="bg-brand hover:bg-brand-dark px-4 py-2 rounded-xl font-bold transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 md:mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
            <p>© 2026 BRINGO Inc. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes 
            onOpenCart={() => setIsCartOpen(true)} 
            onOpenMenu={() => setIsMenuOpen(true)} 
          />
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <Toaster 
            position="top-center" 
            richColors 
            toastOptions={{
              className: 'mt-16 lg:mt-20 rounded-[24px] font-black uppercase tracking-widest text-[10px] border border-white/10 shadow-2xl backdrop-blur-xl',
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#ffffff',
              },
              success: {
                style: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderColor: 'rgba(34, 197, 94, 0.4)',
                  color: '#22c55e',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
                }
              },
              error: {
                style: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
                }
              },
              info: {
                style: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderColor: 'rgba(59, 130, 246, 0.4)',
                  color: '#3b82f6',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
                }
              },
              warning: {
                style: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderColor: 'rgba(59, 130, 246, 0.4)',
                  color: '#3b82f6',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
                }
              }
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}


