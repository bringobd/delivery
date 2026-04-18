import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { LogIn, Phone, User as UserIcon } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, phone);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-4 overflow-auto text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#0CEDE9,transparent_50%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#141414] border border-[#272727] rounded-[32px] p-8 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-4 mb-8">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto overflow-hidden">
            <img 
              src="resources/logo2.png" 
              alt="B" 
              className="w-full h-full object-contain" 
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            {isRegistering ? 'Registration' : 'Login'}
          </h1>
          <p className="text-slate-400 font-bold text-sm">
            {isRegistering ? 'Create your BRINGO account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {isRegistering && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-12 pr-6 py-4 bg-[#272727] border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-white"
                />
              </div>
            )}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required
                type="text" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full pl-12 pr-6 py-4 bg-[#272727] border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-light/10 transition-all text-white"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 brand-gradient text-white rounded-2xl font-black text-lg shadow-lg shadow-brand-light/20 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-brand-light font-bold text-sm hover:underline"
          >
            {isRegistering ? 'I have an account? Log in.' : 'Don\'t have an account? Register.'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-600 leading-relaxed">
            By continuing, you agree to our <span className="text-brand-light cursor-pointer">Terms of Service</span> and <span className="text-brand-light cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
