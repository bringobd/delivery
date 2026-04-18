import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { User, MapPin, CreditCard, Heart, Gift, Bell, HelpCircle, LogOut, ChevronRight, Star, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '');
  const [editedRole, setEditedRole] = useState(user?.role || 'client');

  if (!user) return null;

  const handleSave = async () => {
    await updateProfile({ name: editedName, phone: editedPhone, role: editedRole as any });
    setIsEditing(false);
  };

  const menuItems = [
    { icon: User, label: 'Personal Data', color: 'text-blue-500', onClick: () => setIsEditing(true) },
    { icon: MapPin, label: 'My Addresses', color: 'text-red-500' },
    { icon: CreditCard, label: 'Payment Methods', color: 'text-green-500' },
    { icon: Heart, label: 'Favorite Places', color: 'text-pink-500' },
    { icon: Gift, label: 'Promo Codes', color: 'text-orange-500' },
    { icon: Bell, label: 'Notifications', color: 'text-purple-500' },
    { icon: HelpCircle, label: 'Support', color: 'text-slate-500' },
  ];

  if (user.role === 'admin') {
    menuItems.unshift({ 
      icon: ClipboardList, 
      label: 'Admin Panel', 
      color: 'text-brand-light', 
      onClick: () => navigate('/admin') 
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1e1e1e] rounded-[40px] p-8 text-center border border-slate-100 dark:border-[#272727] shadow-sm space-y-6"
          >
            <div className="relative inline-block">
              <div className="w-24 h-24 brand-gradient rounded-full flex items-center justify-center text-4xl border-4 border-white dark:border-[#1e1e1e] shadow-xl mx-auto">
                {user.avatar}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-[#272727] rounded-full flex items-center justify-center shadow-md border border-slate-100 dark:border-[#333]">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <input 
                    type="text"
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#272727] rounded-xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-brand-light/20"
                    placeholder="Your Name"
                  />
                  <input 
                    type="tel"
                    value={editedPhone}
                    onChange={e => setEditedPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#272727] rounded-xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-brand-light/20"
                    placeholder="Phone Number"
                  />
                  <select 
                    value={editedRole}
                    onChange={e => setEditedRole(e.target.value as any)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#272727] rounded-xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-brand-light/20"
                  >
                    <option value="client">Client</option>
                    <option value="courier">Courier (1)</option>
                    <option value="restaurant">Restaurant (2)</option>
                    <option value="admin">Admin (3)</option>
                  </select>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSave}
                      className="flex-1 py-2 brand-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-widest"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 bg-slate-100 dark:bg-[#272727] text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{user.name}</h2>
                    <p className="text-slate-400 font-bold text-sm">{user.phone || 'Specify phone number'}</p>
                    <p className="text-[10px] font-black text-brand-light uppercase tracking-widest mt-1">{user.role}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-[10px] font-black text-brand-light uppercase tracking-widest hover:underline"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Orders', val: '24' },
                { label: 'Favorites', val: '3' },
                { label: 'Reviews', val: '5' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 dark:bg-[#272727] p-3 rounded-2xl">
                  <p className="text-lg font-black brand-text-gradient leading-none">{stat.val}</p>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={logout}
              className="w-full py-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-red-100 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </motion.div>
        </div>

        {/* Menu List */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-[40px] overflow-hidden border border-slate-100 dark:border-[#272727] shadow-sm">
            {menuItems.map((item, idx) => (
              <button 
                key={item.label}
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-[#272727] transition-all group",
                  idx !== menuItems.length - 1 && "border-b border-slate-50 dark:border-[#272727]"
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className={cn("w-10 h-10 bg-slate-50 dark:bg-[#272727] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs text-slate-600 dark:text-slate-300">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-light group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
