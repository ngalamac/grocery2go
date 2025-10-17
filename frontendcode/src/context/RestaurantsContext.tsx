import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Restaurant } from '../types';
import { restaurantsApi } from '../services/api';

interface RestaurantsContextType {
  restaurants: Restaurant[];
  loading: boolean;
  reload: () => void;
}

const RestaurantsContext = createContext<RestaurantsContextType | undefined>(undefined);

export const RestaurantsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await restaurantsApi.getAll();
      const mapped: Restaurant[] = (data || []).map((r: any) => ({
        id: r._id,
        slug: r.slug,
        name: r.name,
        logo: r.logo,
        coverImage: r.coverImage,
        cuisine: r.cuisine || [],
        rating: r.rating ?? 0,
        deliveryTimeMin: r.deliveryTimeMin,
        deliveryTimeMax: r.deliveryTimeMax,
        deliveryFee: r.deliveryFee,
        minOrder: r.minOrder,
        address: r.address,
        city: r.city,
        isOpen: !!r.isOpen,
        isFeatured: !!r.isFeatured,
        tags: r.tags || [],
        menu: (r.menu || []).map((m: any) => ({
          id: m._id,
          name: m.name,
          description: m.description,
          price: m.price,
          image: m.image,
          category: m.category,
          isAvailable: m.isAvailable,
        })),
      }));
      setRestaurants(mapped);
    } catch (err) {
      console.error('Failed to load restaurants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const value = useMemo(() => ({ restaurants, loading, reload: load }), [restaurants, loading]);
  return <RestaurantsContext.Provider value={value}>{children}</RestaurantsContext.Provider>;
};

export function useRestaurants(): RestaurantsContextType {
  const ctx = useContext(RestaurantsContext);
  if (!ctx) throw new Error('useRestaurants must be used within RestaurantsProvider');
  return ctx;
}
