import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Eye, Zap, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useQuickView } from '../context/QuickViewContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import Badge from './ui/Badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { show } = useToast();
  const { open } = useQuickView();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    show('Added to cart', { type: 'success' });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    show(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      type: inWishlist ? 'info' : 'success'
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    open(product);
  };

  const handleNavigateToProduct = () => {
    navigate(`/product/${product.id}`);
  };

  // Use rating-based pseudo discount to avoid missing field
  const discountPercentage = (product.rating ?? 0) >= 4.8 ? 10 : 0;
  const hasDiscount = discountPercentage > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleNavigateToProduct}
    >
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {(product.rating ?? 0) >= 4.8 && (
          <Badge variant="accent" size="sm" className="shadow-sm">
            <Zap size={12} className="mr-1" />
            Top Rated
          </Badge>
        )}
        {hasDiscount && (
          <Badge variant="warning" size="sm" className="shadow-sm">
            {discountPercentage}% OFF
          </Badge>
        )}
        {product.type === 'market' && (
          <Badge variant="success" size="sm" className="shadow-sm">
            Fresh Market
          </Badge>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggleWishlist}
        className={cn(
          'absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-sm transition-all shadow-sm',
          inWishlist
            ? 'bg-accent-500 text-white'
            : 'bg-white/90 hover:bg-white text-neutral-600 hover:text-accent-500'
        )}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
      </motion.button>

      <div className="relative overflow-hidden aspect-[4/3] bg-neutral-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            'w-full h-full object-cover transition-all duration-500 group-hover:scale-110',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleQuickView}
                className="flex-1 bg-white/95 hover:bg-white text-neutral-900 py-2 px-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Eye size={14} />
                Quick View
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-md transition-all shadow-sm"
                title="Add to cart"
              >
                <ShoppingCart size={16} />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating)
                    ? 'fill-secondary-500 text-secondary-500'
                    : 'text-neutral-300'
                }
              />
            ))}
          </div>
          <span className="text-sm text-neutral-600">({product.rating})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-neutral-500 line-through">
                {product.price} CFA
              </span>
            )}
            <div className="text-xl font-bold text-primary-600">
              {hasDiscount
                ? `${Math.round(product.price * (1 - discountPercentage / 100))} CFA`
                : (product.priceRange || `${product.price} CFA`)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-neutral-500 inline-flex items-center gap-1">
              <Timer size={14} />
              <span>25-40 min</span>
            </div>
            {product.stock !== undefined && (
              <div className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                product.stock > 10
                  ? 'bg-green-100 text-green-700'
                  : product.stock > 0
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              )}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
