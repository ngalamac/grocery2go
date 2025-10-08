import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Product } from '../types';

type QuickViewContextType = {
  product: Product | null;
  open: (product: Product) => void;
  close: () => void;
};

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export const QuickViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const open = useCallback((p: Product) => setProduct(p), []);
  const close = useCallback(() => setProduct(null), []);
  const value = useMemo(() => ({ product, open, close }), [product, open, close]);
  return <QuickViewContext.Provider value={value}>{children}</QuickViewContext.Provider>;
};

export function useQuickView(): QuickViewContextType {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error('useQuickView must be used within QuickViewProvider');
  return ctx;
}

