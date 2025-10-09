import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { reviewsApi } from '../services/api';

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
  addReview: (productId: string, author: string, rating: number, text: string) => Promise<void>;
  toggleApprove: (reviewId: string) => Promise<void>;
  loadProductReviews: (productId: string) => Promise<void>;
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviewsCache, setReviewsCache] = useState<Record<string, Review[]>>({});

  const getReviews = (productId: string) => {
    return reviewsCache[productId] || [];
  };

  const loadProductReviews = async (productId: string) => {
    try {
      const data = await reviewsApi.getProductReviews(productId);
      const reviews = data.map((r: any) => ({
        id: r._id,
        productId: r.productId,
        author: r.userName,
        rating: r.rating,
        text: r.comment,
        createdAt: r.createdAt,
        approved: r.approved
      }));
      setReviewsCache(prev => ({ ...prev, [productId]: reviews }));
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const addReview = async (productId: string, author: string, rating: number, text: string) => {
    try {
      await reviewsApi.create({
        productId,
        userName: author,
        rating,
        comment: text
      });
      await loadProductReviews(productId);
    } catch (error) {
      console.error('Failed to add review:', error);
      throw error;
    }
  };

  const toggleApprove = async (reviewId: string) => {
    try {
      await reviewsApi.approve(reviewId);
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const value = useMemo(() => ({ getReviews, addReview, toggleApprove, loadProductReviews }), [reviewsCache]);
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
};

export function useReviews(): ReviewsContextType {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
}
