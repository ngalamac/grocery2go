import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { show } = useToast();

  if (!product) return <div className="max-w-4xl mx-auto px-4 py-10">Product not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-6 bg-white rounded-lg shadow-sm p-6">
        <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded" />
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-3xl font-bold text-[#7cb342]">{product.price} CFA</div>
          {product.description && <p className="text-gray-600">{product.description}</p>}
          <div className="text-sm text-gray-500">Category: {product.category}</div>
          <button
            onClick={() => { addToCart(product); show('Added to cart', { type: 'success' }); }}
            className="w-full bg-[#7cb342] text-white py-3 rounded font-semibold hover:bg-[#689f38] transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

