import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, quickDemoLogin, isAuthenticated, currentUser } = useAuth();

  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setMode('signup');
    } else {
      setMode('login');
    }
  }, [searchParams]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
    setErrors({});
  };

  const validate = () => {
    const err = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) err.email = 'Valid email is required.';
    if (!password || password.length < 6) err.password = 'Password must be at least 6 characters.';

    if (mode === 'signup') {
      if (!name.trim()) err.name = 'Full name is required.';
      if (!phone.trim()) err.phone = 'Phone number is required.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          if (res.user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/trips');
          }
        }
      } else {
        const res = await signup({ name, email, password, phone });
        if (res.success) {
          navigate('/trips');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (type) => {
    setIsSubmitting(true);
    try {
      const res = await quickDemoLogin(type);
      if (res?.success) {
        if (type === 'admin' || res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/trips');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@travelora.com');
    setPassword('admin123');
    setMode('login');
  };

  const fillUserCredentials = () => {
    setEmail('ansh.sharma@travelora.demo');
    setPassword('password123');
    setMode('login');
  };

  return (
    <div className="py-12 sm:py-16 max-w-md mx-auto px-4 sm:px-6">
      
      {/* Brand Icon Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-600/30">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-sans">
          {mode === 'login' ? 'Welcome Back to Travelora' : 'Create Your Travel Account'}
        </h1>
        <p className="text-xs text-slate-500">
          {mode === 'login'
            ? 'Sign in to access your planned itineraries, bookings, or administrator tools.'
            : 'Join thousands of globetrotters planning their next adventure.'}
        </p>
      </div>

      {/* Backend & Database Status Badge */}
      <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 shadow-xs">
        <Database className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block flex items-center gap-1.5">
            Full-Stack Backend Active
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </span>
          <span className="text-[11px] text-emerald-700">
            Powered by Node.js Express REST API, SQLite database (travelora.db), bcrypt password hashing, and role-based JWT authentication.
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
        
        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Ansh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillUserCredentials}
                  className="text-[10px] text-emerald-600 hover:underline font-semibold"
                >
                  Fill User
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="text-[10px] text-purple-600 hover:underline font-semibold"
                >
                  Fill Admin
                </button>
              </div>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. ansh.sharma@travelora.demo or admin@travelora.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>
              {isSubmitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to Account'
                : 'Create Account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              One-Click Instant Testing
            </span>
            <span className="text-[10px] text-slate-400">Database Ready</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin(0)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-xs font-bold text-navy-900 transition-colors flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px]">User</span>
              </div>
              <span className="text-[9px] text-slate-400">Ansh</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin(1)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-xs font-bold text-navy-900 transition-colors flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-[11px]">Traveler</span>
              </div>
              <span className="text-[9px] text-slate-400">Elena</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 hover:border-purple-300 border border-purple-200 text-xs font-bold text-purple-900 transition-colors flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-[11px]">Admin</span>
              </div>
              <span className="text-[9px] text-purple-600 font-semibold">Full Access</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
