import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem, KEYS, initializeStorage } from '../utils/storage';
import { authAPI, setAuthToken, getAuthToken } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const [currentUser, setCurrentUser] = useState(() => {
    initializeStorage();
    return getStoredItem(KEYS.AUTH_USER, null);
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    return getStoredItem('travelora_registered_users', [
      {
        id: "usr_admin_01",
        name: "Travelora Admin",
        email: "admin@travelora.com",
        password: "admin123",
        phone: "+91 98000 11111",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        joinedDate: "January 2026",
        role: "admin"
      },
      {
        id: "usr_demo_01",
        name: "Ansh Sharma",
        email: "ansh.sharma@travelora.demo",
        password: "password123",
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        joinedDate: "January 2026",
        role: "user"
      },
      {
        id: "usr_demo_02",
        name: "Elena Rostova",
        email: "elena@travelora.demo",
        password: "password123",
        phone: "+1 415 555 2671",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        joinedDate: "February 2026",
        role: "user"
      }
    ]);
  });

  // Check token on initial load and validate with backend
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authAPI.getMe()
        .then((res) => {
          if (res.success && res.user) {
            setCurrentUser(res.user);
            setStoredItem(KEYS.AUTH_USER, res.user);
          }
        })
        .catch(() => {
          // Keep local state if backend is offline
        });
    }
  }, []);

  useEffect(() => {
    setStoredItem('travelora_registered_users', registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      setStoredItem(KEYS.AUTH_USER, currentUser);
    } else {
      localStorage.removeItem(KEYS.AUTH_USER);
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Try Backend API first
    try {
      const res = await authAPI.login(trimmedEmail, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        addToast(`Welcome back, ${res.user.name}! (${res.user.role === 'admin' ? 'Administrator' : 'Explorer'})`, 'success');
        return { success: true, user: res.user };
      }
    } catch (apiErr) {
      console.warn('[AuthContext] Backend login unavailable or failed, checking local credentials:', apiErr.message);
    }

    // 2. Fallback to local accounts
    const user = registeredUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (user) {
      const userSession = { ...user };
      delete userSession.password;
      setCurrentUser(userSession);
      addToast(`Welcome back, ${user.name}!`, 'success');
      return { success: true, user: userSession };
    } else {
      addToast('Invalid credentials. Check email & password.', 'error');
      return { success: false, error: 'Invalid email or password.' };
    }
  };

  const signup = async ({ name, email, password, phone }) => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Try Backend API first
    try {
      const res = await authAPI.register({ name, email: trimmedEmail, password, phone });
      if (res.success && res.user) {
        setCurrentUser(res.user);
        addToast(`Account created successfully! Welcome, ${res.user.name}.`, 'success');
        return { success: true, user: res.user };
      }
    } catch (apiErr) {
      console.warn('[AuthContext] Backend register unavailable, falling back to local storage:', apiErr.message);
    }

    // 2. Fallback to local accounts
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      addToast('An account with this email already exists.', 'error');
      return { success: false, error: 'Email already registered.' };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password: password,
      phone: phone || '+91 99999 88888',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      role: 'user'
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    const userSession = { ...newUser };
    delete userSession.password;
    setCurrentUser(userSession);
    addToast(`Account created! Welcome to Travelora, ${newUser.name}.`, 'success');
    return { success: true, user: userSession };
  };

  const quickDemoLogin = async (identifier = 0) => {
    let email = 'ansh.sharma@travelora.demo';
    let password = 'password123';

    if (identifier === 'admin' || identifier === 2) {
      email = 'admin@travelora.com';
      password = 'admin123';
    } else if (identifier === 1 || identifier === 'elena') {
      email = 'elena@travelora.demo';
      password = 'password123';
    }

    return await login(email, password);
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    addToast('You have been signed out.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        signup,
        logout,
        quickDemoLogin,
        registeredUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
