import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from './ProductCard';
import { Container } from './ui';

const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();
  return (
    <Container className="py-6">
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-10 text-center text-gray-500">No items in wishlist yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {wishlist.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default WishlistPage;

