import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Toast = { id: string; title?: string; message: string; type?: 'success' | 'error' | 'info' };

type ToastContextType = {
  toasts: Toast[];
  show: (message: string, opts?: { title?: string; type?: Toast['type'] }) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, opts?: { title?: string; type?: Toast['type'] }) => {
    const id = Math.random().toString(36).slice(2, 10);
    const toast: Toast = { id, message, title: opts?.title, type: opts?.type || 'info' };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

