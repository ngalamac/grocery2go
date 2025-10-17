import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Eye, Zap, Clock, Bike, BadgePercent } from 'lucide-react';
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

  const discountPercentage = product.featured ? 15 : 0;
  const hasDiscount = discountPercentage > 0;
  const etaMins = 25 + Math.floor(Math.random() * 20); // demo ETA
  const deliveryFee = product.type === 'market' ? 700 : 500; // demo fee

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleNavigateToProduct}
    >
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.featured && (
          <Badge variant="accent" size="sm" className="shadow-sm">
            <Zap size={12} className="mr-1" />
            Featured
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

        {/* Overlay ETA and fee badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur border text-neutral-800 flex items-center gap-1">
            <Clock size={14} /> {etaMins}-{etaMins + 10} min
          </div>
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur border text-neutral-800 flex items-center gap-1">
            <Bike size={14} /> {deliveryFee} CFA
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
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
    </motion.div>
  );
};

export default ProductCard;
