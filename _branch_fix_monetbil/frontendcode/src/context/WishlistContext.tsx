import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '../types';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';

type WishlistContextType = {
  wishlist: Product[];
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistApi.get();
      setWishlist(data.map((p: any) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        priceRange: p.priceRange,
        image: p.image,
        rating: p.rating,
        category: p.category,
        type: p.type,
        description: p.description,
        stock: p.stock
      })));
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (id: string) => wishlist.some(p => p.id === id);

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        await wishlistApi.remove(product.id);
        setWishlist(prev => prev.filter(p => p.id !== product.id));
      } else {
        await wishlistApi.add(product.id);
        setWishlist(prev => [...prev, product]);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const value = useMemo(() => ({ wishlist, isInWishlist, toggleWishlist, loading }), [wishlist, loading, user]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
