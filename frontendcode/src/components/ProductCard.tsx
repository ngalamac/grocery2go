import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
        />
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-[#7cb342] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-[#689f38]"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#7cb342] mb-2 hover:text-[#689f38] cursor-pointer">
          {product.name}
        </h3>
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
        <div className="text-xl font-bold text-gray-800">
          ${product.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
