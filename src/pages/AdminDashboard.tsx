import React, { useState, useEffect } from 'react';
import { LIVE_ORDERS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Users, ShoppingBag, Bike, AlertTriangle, DollarSign, Search, Plus, Edit2, Trash2, X, Image as ImageIcon, Type, Layout, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { useData } from '../hooks/useData';
import { Restaurant } from '../types'; 
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: (props: { attributes: any; listeners: any }) => React.ReactNode;
  className?: string;
  key?: any;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children, className }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(className, isDragging && "shadow-2xl")}
    >
      {children({ attributes, listeners })}
    </div>
  );
};

const STATS_KEY = 'bringo_admin_stats';
const LOGS_KEY = 'bringo_admin_logs';

export const AdminDashboard: React.FC = () => {
  const { restaurants, setRestaurants, banners, setBanners } = useData();
  const [activeTab, setActiveTab] = useState('stats');
  const [dbStats, setDbStats] = useState<any>(null);
  const [dbLogs, setDbLogs] = useState<any[]>([]);
  
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<any>(null);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    categories: '',
    commission: '80',
    rating: 4.5,
    deliveryTime: '20-30 min',
    deliveryFee: 50,
    description: ''
  });

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    icon: '🎉',
    gradient: 'from-[#0CEDE9] to-[#1A7EDB]'
  });

  useEffect(() => {
    const loadStatsAndLogs = () => {
      // Stats
      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) {
        setDbStats(JSON.parse(savedStats));
      } else {
        const initialStats = {
          totalRevenue: 2471,
          totalOrders: 48,
          activeCouriers: 12,
          newClients: 156,
          lastUpdated: Date.now()
        };
        localStorage.setItem(STATS_KEY, JSON.stringify(initialStats));
        setDbStats(initialStats);
      }

      // Logs
      const savedLogs = localStorage.getItem(LOGS_KEY);
      if (savedLogs) {
        setDbLogs(JSON.parse(savedLogs));
      } else {
        const initialLogs = [
          { message: 'System initialized', timestamp: Date.now(), type: 'info' },
          { message: 'LocalStorage migration complete', timestamp: Date.now() - 1000, type: 'success' }
        ];
        localStorage.setItem(LOGS_KEY, JSON.stringify(initialLogs));
        setDbLogs(initialLogs);
      }
    };

    loadStatsAndLogs();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STATS_KEY && e.newValue) setDbStats(JSON.parse(e.newValue));
      if (e.key === LOGS_KEY && e.newValue) setDbLogs(JSON.parse(e.newValue));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const stats = [
    { label: 'Daily Revenue', value: `${dbStats?.totalRevenue || 0}₴`, change: '+12%', icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Orders', value: String(dbStats?.totalOrders || 0), change: '+5', icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Active Couriers', value: String(dbStats?.activeCouriers || 0), change: 'Online', icon: Bike, color: 'text-brand-light' },
    { label: 'New Clients', value: String(dbStats?.newClients || 0), change: '+24', icon: Users, color: 'text-purple-500' },
  ];

  const handleAddOrEditRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRes) {
      const updated = restaurants.map(r => r.id === editingRes.id ? { ...editingRes, ...newRestaurant, categories: typeof newRestaurant.categories === 'string' ? newRestaurant.categories.split(',').map(c => c.trim()) : newRestaurant.categories } : r);
      await setRestaurants(updated as Restaurant[]);
      toast.success(`Restaurant ${newRestaurant.name} updated!`);
    } else {
      const id = `res-${Date.now()}`;
      const updated = [...restaurants, { 
        ...newRestaurant, 
        id, 
        categories: newRestaurant.categories.split(',').map(c => c.trim()),
        commission: Number(newRestaurant.commission),
        menu: [] 
      } as any];
      await setRestaurants(updated as Restaurant[]);
      toast.success(`${newRestaurant.name} successfully added!`);
    }
    setIsResModalOpen(false);
    setEditingRes(null);
    setNewRestaurant({ name: '', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', categories: '', commission: '80', rating: 4.5, deliveryTime: '20-30 min', deliveryFee: 50, description: '' });
  };

  const handleDeleteRestaurant = async (id: string) => {
    const updated = restaurants.filter(r => r.id !== id);
    await setRestaurants(updated);
    toast.error('Restaurant deleted');
  };

  const handleAddOrEditBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      const updated = banners.map(b => b.id === editingBanner.id ? { ...editingBanner, ...newBanner } : b);
      await setBanners(updated);
      toast.success('Banner updated!');
    } else {
      const id = `${Date.now()}`;
      const updated = [...banners, { ...newBanner, id }];
      await setBanners(updated);
      toast.success('New banner added!');
    }
    setIsBannerModalOpen(false);
    setEditingBanner(null);
    setNewBanner({ title: '', subtitle: '', icon: '🎉', gradient: 'from-[#0CEDE9] to-[#1A7EDB]' });
  };

  const handleDeleteBanner = async (id: string) => {
    const updated = banners.filter(b => b.id !== id);
    await setBanners(updated);
    toast.error('Banner deleted');
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndRestaurants = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = restaurants.findIndex((r) => r.id === active.id);
      const newIndex = restaurants.findIndex((r) => r.id === over.id);
      setRestaurants(arrayMove(restaurants, oldIndex, newIndex));
    }
  };

  const handleDragEndBanners = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = banners.findIndex((b) => b.id === active.id);
      const newIndex = banners.findIndex((b) => b.id === over.id);
      setBanners(arrayMove(banners, oldIndex, newIndex));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Admin Panel</h1>
          <p className="text-slate-500 font-bold text-xs sm:text-sm">Platform management and analytics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex bg-white dark:bg-[#1e1e1e] p-1 rounded-2xl border border-slate-100 dark:border-[#272727] overflow-x-auto no-scrollbar">
            {[
              { id: 'stats', label: 'Statistics' },
              { id: 'restaurants', label: 'Restaurants' },
              { id: 'banners', label: 'Banners' },
              { id: 'orders', label: 'Orders' },
              { id: 'logs', label: 'Logs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === tab.id ? "brand-gradient text-white shadow-lg shadow-brand-light/20" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Modal */}
      <AnimatePresence>
        {isResModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#1e1e1e] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  {editingRes ? 'Edit Restaurant' : 'New Restaurant'}
                </h2>
                <button onClick={() => setIsResModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-[#272727] rounded-full transition-colors">
                  <X className="w-5 h-5 sm:w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddOrEditRestaurant} className="space-y-4 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Restaurant Name</label>
                  <input 
                    required
                    type="text" 
                    value={newRestaurant.name}
                    onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})}
                    placeholder="e.g. Burger King"
                    className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-[#272727] border-none rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Categories (comma separated)</label>
                  <input 
                    required
                    type="text" 
                    value={newRestaurant.categories}
                    onChange={e => setNewRestaurant({...newRestaurant, categories: e.target.value})}
                    placeholder="e.g. Burgers, Fast Food"
                    className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-[#272727] border-none rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Commission (%)</label>
                    <input 
                      required
                      type="number" 
                      value={newRestaurant.commission}
                      onChange={e => setNewRestaurant({...newRestaurant, commission: e.target.value})}
                      className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-[#272727] border-none rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Delivery Time</label>
                    <input 
                      required
                      type="text" 
                      value={newRestaurant.deliveryTime}
                      onChange={e => setNewRestaurant({...newRestaurant, deliveryTime: e.target.value})}
                      className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-[#272727] border-none rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Image URL</label>
                  <input 
                    required
                    type="text" 
                    value={newRestaurant.image}
                    onChange={e => setNewRestaurant({...newRestaurant, image: e.target.value})}
                    className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-[#272727] border-none rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 sm:py-5 brand-gradient text-white rounded-[20px] sm:rounded-[24px] font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-brand-light/20 hover:scale-[1.02] transition-all active:scale-95"
                >
                  {editingRes ? 'Save Changes' : 'Create Restaurant'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Banner Modal */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#1e1e1e] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  {editingBanner ? 'Edit Banner' : 'New Banner'}
                </h2>
                <button onClick={() => setIsBannerModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-[#272727] rounded-full transition-colors">
                  <X className="w-5 h-5 sm:w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddOrEditBanner} className="space-y-4 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Title</label>
                  <input 
                    required
                    type="text" 
                    value={newBanner.title}
                    onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                    placeholder="e.g. 20% DISCOUNT"
                    className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-[#272727] border-none rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Subtitle</label>
                  <input 
                    required
                    type="text" 
                    value={newBanner.subtitle}
                    onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})}
                    placeholder="e.g. on your first order"
                    className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-[#272727] border-none rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Emoji Icon</label>
                    <input 
                      required
                      type="text" 
                      value={newBanner.icon}
                      onChange={e => setNewBanner({...newBanner, icon: e.target.value})}
                      className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-[#272727] border-none rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Gradient (Tailwind)</label>
                    <input 
                      required
                      type="text" 
                      value={newBanner.gradient}
                      onChange={e => setNewBanner({...newBanner, gradient: e.target.value})}
                      className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-[#272727] border-none rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 sm:py-5 brand-gradient text-white rounded-[20px] sm:rounded-[24px] font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-brand-light/20 hover:scale-[1.02] transition-all active:scale-95"
                >
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[32px] border border-slate-100 dark:border-[#272727] shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-2xl bg-slate-50 dark:bg-[#272727]", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black bg-green-50 text-green-600 px-2 py-1 rounded-lg uppercase tracking-widest">
                    {stat.change}
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] rounded-[32px] border border-slate-100 dark:border-[#272727] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-50 dark:border-[#272727] flex items-center justify-between">
                <h3 className="font-black uppercase tracking-widest text-sm text-slate-900 dark:text-white">Active Orders</h3>
                <button className="text-brand-light font-black text-xs uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-[#272727]">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Restaurant</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-[#272727]">
                    {LIVE_ORDERS.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-[#272727] transition-colors text-slate-900 dark:text-white">
                        <td className="px-6 py-4 font-black text-sm">{order.id}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-400">{order.restaurantName}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            order.status === 'ready' ? "bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400" : "bg-brand-light/10 text-brand-light"
                          )}>
                            {order.status === 'ready' ? 'Ready' : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-brand-light">{order.total}₴</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-[32px] border border-slate-100 dark:border-[#272727] p-6 shadow-sm space-y-6">
              <h3 className="font-black uppercase tracking-widest text-sm text-slate-900 dark:text-white">Security Logs</h3>
              <div className="space-y-4">
                {dbLogs.length > 0 ? dbLogs.map((log, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      log.type === 'warn' ? "bg-red-500" : log.type === 'success' ? "bg-green-500" : "bg-blue-500"
                    )} />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{log.message}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-slate-400 text-xs font-bold">No logs available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'restaurants' && (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndRestaurants}
        >
          <SortableContext 
            items={restaurants.map(r => r.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((res) => (
                <SortableItem 
                  key={res.id} 
                  id={res.id}
                  className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[32px] border border-slate-100 dark:border-[#272727] flex items-center space-x-4 relative group"
                >
                  {({ attributes, listeners }) => (
                    <>
                      <div 
                        {...attributes} 
                        {...listeners}
                        className="p-2 bg-slate-50 dark:bg-[#272727] rounded-xl text-slate-300 group-hover:text-slate-400 transition-colors cursor-grab active:cursor-grabbing touch-none"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <img src={res.image} className="w-16 h-16 rounded-2xl object-cover pointer-events-none" alt={res.name} />
                      <div className="flex-1 min-w-0 pr-16 sm:pr-0 pointer-events-none">
                        <h4 className="font-black uppercase tracking-tight truncate text-slate-900 dark:text-white">{res.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                          {Array.isArray(res.categories) ? res.categories.join(', ') : res.categories}
                        </p>
                        <p className="text-[10px] font-black text-brand-light uppercase tracking-widest mt-1">Comm: {res.commission}%</p>
                      </div>
                      <div className="flex space-x-2 absolute top-4 right-4 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingRes(res);
                            setNewRestaurant({
                              name: res.name,
                              image: res.image,
                              categories: Array.isArray(res.categories) ? res.categories.join(', ') : res.categories,
                              commission: String(res.commission),
                              rating: res.rating || 4.5,
                              deliveryTime: res.deliveryTime || '20-30 min',
                              deliveryFee: res.deliveryFee || 50,
                              description: res.description || ''
                            });
                            setIsResModalOpen(true);
                          }}
                          className="p-2 bg-slate-50 dark:bg-[#272727] rounded-xl text-slate-400 hover:text-brand-light transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRestaurant(res.id);
                          }}
                          className="p-2 bg-slate-50 dark:bg-[#272727] rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </SortableItem>
              ))}
              <button 
                onClick={() => {
                  setEditingRes(null);
                  setNewRestaurant({ name: '', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', categories: '', commission: '80', rating: 4.5, deliveryTime: '20-30 min', deliveryFee: 50, description: '' });
                  setIsResModalOpen(true);
                }}
                className="bg-slate-50 dark:bg-[#1e1e1e] border-2 border-dashed border-slate-200 dark:border-[#272727] p-6 rounded-[32px] flex flex-col items-center justify-center space-y-2 text-slate-400 hover:border-brand-light hover:text-brand-light transition-all min-h-[100px]"
              >
                <Plus className="w-8 h-8" />
                <span className="text-xs font-black uppercase tracking-widest">Add Restaurant</span>
              </button>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Active Banners</h2>
            <button 
              onClick={() => {
                setEditingBanner(null);
                setNewBanner({ title: '', subtitle: '', icon: '🎉', gradient: 'from-[#0CEDE9] to-[#1A7EDB]' });
                setIsBannerModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 brand-gradient text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-light/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </button>
          </div>

          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndBanners}
          >
            <SortableContext 
              items={banners.map(b => b.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner) => (
                  <SortableItem 
                    key={banner.id} 
                    id={banner.id}
                    className="relative group"
                  >
                    {({ attributes, listeners }) => (
                      <>
                        <div className={cn(
                          "h-40 rounded-[32px] bg-gradient-to-br flex items-center px-8 overflow-hidden shadow-lg",
                          banner.gradient
                        )}>
                          <div 
                            {...attributes} 
                            {...listeners}
                            className="mr-4 text-white/30 cursor-grab active:cursor-grabbing touch-none p-2 hover:text-white/60 transition-colors"
                          >
                            <GripVertical className="w-6 h-6" />
                          </div>
                          <div className="flex-1 space-y-1 pointer-events-none">
                            <h3 className="text-2xl font-black text-white">{banner.title}</h3>
                            <p className="text-white/80 font-bold text-xs">{banner.subtitle}</p>
                          </div>
                          <div className="text-6xl opacity-20 select-none pointer-events-none">
                            {banner.icon}
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 flex space-x-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingBanner(banner);
                              setNewBanner({
                                title: banner.title,
                                subtitle: banner.subtitle,
                                icon: banner.icon,
                                gradient: banner.gradient
                              });
                              setIsBannerModalOpen(true);
                            }}
                            className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBanner(banner.id);
                            }}
                            className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};
