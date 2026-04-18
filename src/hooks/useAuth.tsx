import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'bringo_auth_user';
const USERS_KEY = 'bringo_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (name: string, phone: string) => {
    setLoading(true);
    try {
      const trimmedPhone = phone.trim();
      const trimmedName = name.trim();
      
      const allUsersStr = localStorage.getItem(USERS_KEY) || '[]';
      const allUsers: User[] = JSON.parse(allUsersStr);
      
      let existingUser = allUsers.find(u => u.phone === trimmedPhone && u.name === trimmedName);
      
      if (!existingUser) {
        // User doesn't exist, register them
        let role: UserRole = 'client';
        let restaurantId: string | undefined = undefined;

        // Special roles for testing as requested:
        // Number 1 is an account with the courier role. 
        // Number 2 is a restaurant. 
        // Number 3 is an admin.
        if (trimmedPhone === '1') {
          role = 'courier';
        } else if (trimmedPhone === '2') {
          role = 'restaurant';
          restaurantId = 'res-1'; 
        } else if (trimmedPhone === '3') {
          role = 'admin';
        }

        existingUser = {
          uid: `user-${Date.now()}`,
          name: trimmedName,
          phone: trimmedPhone,
          role: role,
          restaurantId: restaurantId,
          avatar: '👤'
        };

        const updatedUsers = [...allUsers, existingUser];
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        toast.success(`Registration successful! Role: ${role}`);
      } else {
        toast.success(`Welcome back, ${existingUser.name}!`);
      }

      setUser(existingUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUser));
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login or registration error');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    toast.info('You have logged out');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = { ...user, ...data };
      
      // Update session
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Update global users list
      const allUsersStr = localStorage.getItem(USERS_KEY) || '[]';
      const allUsers: User[] = JSON.parse(allUsersStr);
      const updatedUsers = allUsers.map(u => u.uid === user.uid ? updatedUser : u);
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      
      toast.success('Profile updated');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Error updating profile');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
