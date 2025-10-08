import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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

const USERS_KEY = 'g2g_auth_users';
const USER_KEY = 'g2g_auth_user';
const ADMIN_EMAIL = 'ndibrenda@gmail.com';
const ADMIN_PASSWORD = 'ca@5G2024';
const ADMIN_ID = 'admin_root';

function loadUsers(): Record<string, { email: string; password: string; name?: string; id: string; role?: 'user' | 'admin' }> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { email: string; password: string; name?: string; id: string; role?: 'user' | 'admin' }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveUserSession(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

function loadUserSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const existing = loadUserSession();
    if (existing) setUser(existing);
  }, []);

  useEffect(() => {
    saveUserSession(user);
  }, [user]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const login = useCallback(async ({ email, password }: Credentials) => {
    const keyEmail = email.toLowerCase();
    // Hardcoded admin credentials override
    if (keyEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: AuthUser = { id: ADMIN_ID, email: ADMIN_EMAIL, name: 'Admin', role: 'admin' };
      // Ensure stored for persistence
      const users = loadUsers();
      users[ADMIN_EMAIL] = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: 'Admin', id: ADMIN_ID, role: 'admin' };
      saveUsers(users);
      setUser(adminUser);
      setIsAuthModalOpen(false);
      return;
    }
    const users = loadUsers();
    const found = users[keyEmail];
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password');
    }
    const newUser: AuthUser = { id: found.id, email: found.email, name: found.name, role: (found as any).role || 'user' };
    setUser(newUser);
    setIsAuthModalOpen(false);
  }, []);

  const signup = useCallback(async ({ email, password, name }: Credentials) => {
    const users = loadUsers();
    const key = email.toLowerCase();
    if (key === ADMIN_EMAIL) {
      throw new Error('This email is reserved for the site administrator. Please log in instead.');
    }
    if (users[key]) {
      throw new Error('An account with this email already exists');
    }
    const id = `user_${Math.random().toString(36).slice(2, 10)}`;
    users[key] = { email, password, name, id, role: 'user' };
    saveUsers(users);
    const newUser: AuthUser = { id, email, name, role: 'user' };
    setUser(newUser);
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
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

