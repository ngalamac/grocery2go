import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '../types';

type WishlistContextType = {
  wishlist: Product[];
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('g2g_wishlist');
      if (raw) setWishlist(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('g2g_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const isInWishlist = (id: string) => wishlist.some(p => p.id === id);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => (prev.some(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]));
  };

  const value = useMemo(() => ({ wishlist, isInWishlist, toggleWishlist }), [wishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

