import React from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useQuickView } from '../context/QuickViewContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { show } = useToast();
  const { open } = useQuickView();

  const handleAddToCart = () => {
    addToCart(product);
    show('Added to cart', { type: 'success' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => open(product)} className="bg-white/90 hover:bg-white p-2 rounded-full text-gray-700" title="Quick view">
            <Eye size={18} />
          </button>
        </div>
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'}`}
          title="Add to wishlist"
        >
          <Heart size={18} />
        </button>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-[#7cb342] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-[#689f38]"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
      <div className="p-4">
        <a href={`/product/${product.id}`} className="font-semibold text-[#7cb342] mb-2 hover:text-[#689f38] cursor-pointer block">
          {product.name}
        </a>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">
            {product.priceRange || `${product.price} CFA`}
          </div>
          {product.type === 'market' && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Market</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
