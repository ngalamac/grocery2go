import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';

type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
};

type Credentials = {
  email: string;
  password: string;
  name?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (credentials: Credentials) => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'g2g_auth_user';
const TOKEN_KEY = 'token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      authApi.getProfile()
        .then(userData => {
          setUser({
            id: userData._id,
            email: userData.email,
            name: userData.name,
            role: userData.isAdmin ? 'admin' : 'user'
          });
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const login = useCallback(async ({ email, password }: Credentials) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser({
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      role: response.user.isAdmin ? 'admin' : 'user'
    });
    setIsAuthModalOpen(false);
  }, []);

  const signup = useCallback(async ({ email, password, name }: Credentials) => {
    if (!name) throw new Error('Name is required');
    const response = await authApi.register({ email, password, name });
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser({
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      role: response.user.isAdmin ? 'admin' : 'user'
    });
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    login,
    signup,
    logout
  }), [user, isAuthModalOpen, openAuthModal, closeAuthModal, login, signup, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

