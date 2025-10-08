import React, { createContext, useContext, useMemo, useState } from 'react';

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
  approved: boolean;
};

type ReviewsContextType = {
  getReviews: (productId: string) => Review[];
  addReview: (productId: string, author: string, rating: number, text: string) => void;
  toggleApprove: (reviewId: string) => void;
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const raw = localStorage.getItem('g2g_reviews');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const persist = (next: Review[]) => {
    setReviews(next);
    try { localStorage.setItem('g2g_reviews', JSON.stringify(next)); } catch {}
  };

  const getReviews = (productId: string) => reviews.filter(r => r.productId === productId && r.approved);

  const addReview = (productId: string, author: string, rating: number, text: string) => {
    const id = Math.random().toString(36).slice(2, 10);
    const review: Review = { id, productId, author, rating, text, createdAt: new Date().toISOString(), approved: false };
    persist([review, ...reviews]);
  };

  const toggleApprove = (reviewId: string) => {
    const next = reviews.map(r => (r.id === reviewId ? { ...r, approved: !r.approved } : r));
    persist(next);
  };

  const value = useMemo(() => ({ getReviews, addReview, toggleApprove }), [reviews]);
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
};

export function useReviews(): ReviewsContextType {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
}

