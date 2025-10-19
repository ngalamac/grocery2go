import React from 'react';
import { X } from 'lucide-react';
import { useQuickView } from '../context/QuickViewContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const QuickViewModal: React.FC = () => {
  const { product, close } = useQuickView();
  const { addToCart } = useCart();
  const { show } = useToast();
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-xl overflow-hidden">
        <button onClick={close} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><X size={20} /></button>
        <div className="grid md:grid-cols-2">
          <img src={product.image} alt={product.name} className="w-full h-64 md:h-full object-cover" />
          <div className="p-6 space-y-3">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            {product.description && <p className="text-sm text-gray-600">{product.description}</p>}
            <div className="text-2xl font-bold text-primary-600">{product.price} CFA</div>
            <button
              onClick={() => { addToCart(product); show('Added to cart', { type: 'success' }); close(); }}
              className="w-full bg-primary-500 text-white py-3 rounded font-semibold hover:bg-primary-600 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

