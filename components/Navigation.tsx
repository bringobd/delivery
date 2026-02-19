
import { NavLink, useLocation } from 'react-router-dom';
import { Role } from '../types';
import { useMemo } from 'react';

interface NavigationProps {
  cartCount: number;
  role: Role;
}

interface NavItem {
  path: string;
  icon: string;
  label: string;
  count?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ cartCount, role }) => {
  const location = useLocation();
  const isCourier = role === 'courier';
  const isRest = role === 'restaurant';
  const isAdmin = role === 'admin';

  const navItems = useMemo<NavItem[]>(() => {
    if (isAdmin) {
      return [
        { path: '/orders', icon: '📋', label: 'Панель' },
        { path: '/stats', icon: '📊', label: 'Статистика' },
        { path: '/admin-settings', icon: '⚙️', label: 'Налаштування' },
      ];
    }
    
    const items: NavItem[] = [{ path: '/', icon: '🏠', label: 'Головна' }];

    if (!isCourier && !isRest) {
      items.push({ path: '/rests', icon: '🍴', label: 'Заклади' });
      items.push({ path: '/cart', icon: '🛒', label: 'Кошик', count: true });
    }

    if (isCourier) {
        items.push({ path: '/stats', icon: '📊', label: 'Статистика' });
    }

    items.push({ 
      path: '/orders', 
      icon: isRest ? '👨‍🍳' : isCourier ? '🛵' : '📦', 
      label: isRest ? 'Кухня' : isCourier ? 'Закази' : 'Мої' 
    });
    
    return items;
  }, [isAdmin, isCourier, isRest]);

  const activeIndex = useMemo(() => {
    let idx = navItems.findIndex(item => item.path === location.pathname);
    if (idx === -1) {
      idx = navItems.findIndex(item => item.path !== '/' && location.pathname.startsWith(item.path));
    }
    return idx;
  }, [location.pathname, navItems]);

  const containerWidth = isAdmin ? 'w-[94%] max-w-[430px]' : 'w-[92%] max-w-[400px]';
  const tabWidthPercent = 100 / navItems.length;
  const indicatorWidthPercent = isAdmin ? 12 : 8; 
  const indicatorOpacity = activeIndex === -1 ? 0 : 1;
  const indicatorLeft = activeIndex === -1 ? 0 : (activeIndex * tabWidthPercent) + (tabWidthPercent / 2) - (indicatorWidthPercent / 2);

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${containerWidth} h-[76px] glass rounded-[32px] z-50 flex items-center justify-around shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-none bottom-nav`}>
      <div 
        className="absolute top-0 h-[3.5px] bg-brand-orange rounded-full shadow-[0_0_12px_#FF5C00] nav-indicator-line"
        style={{ 
          width: `${indicatorWidthPercent}%`,
          left: `${indicatorLeft}%`,
          opacity: indicatorOpacity
        }}
      />

      {navItems.map((item) => (
        <NavLink 
          key={item.path}
          to={item.path} 
          className={({isActive}) => `flex flex-col items-center justify-center flex-1 relative transition-all duration-300 ease-out h-full z-10 ${isActive ? 'text-white -translate-y-1' : 'text-t3 opacity-40 hover:opacity-100'}`}
        >
          <div className="relative">
            <div className="text-2xl mt-1">{item.icon}</div>
            {item.count && cartCount > 0 && (
              <div className="absolute -top-1 -right-2 bg-brand-orange text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-brand-bg scale-110">
                {cartCount}
              </div>
            )}
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest mt-1">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Navigation;
