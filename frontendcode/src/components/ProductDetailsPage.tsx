import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { show } = useToast();
  const { user } = useAuth();
  const { getReviews, addReview } = useReviews();

  if (!product) return <div className="max-w-4xl mx-auto px-4 py-10">Product not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-sm p-4 md:p-6">
        <img src={product.image} alt={product.name} className="w-full h-64 md:h-80 object-cover rounded" />
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-3xl font-bold text-primary-600">{product.price} CFA</div>
          {product.description && <p className="text-gray-600">{product.description}</p>}
          <div className="text-sm text-gray-500">Category: {product.category}</div>
          <button
            onClick={() => { addToCart(product); show('Added to cart', { type: 'success' }); }}
            className="w-full bg-primary-500 text-white py-3 rounded font-semibold hover:bg-primary-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
      {/* Reviews */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-3">Customer Reviews</h2>
          <div className="space-y-4">
            {getReviews(product.id).length === 0 && (
              <div className="text-sm text-gray-500">No reviews yet.</div>
            )}
            {getReviews(product.id).map(r => (
              <div key={r.id} className="border-b pb-3">
                <div className="text-sm font-semibold">{r.author}</div>
                <div className="text-xs text-gray-500 mb-1">{new Date(r.createdAt).toLocaleDateString()}</div>
                <div className="text-yellow-500 text-sm">{'★'.repeat(Math.round(r.rating))}{'☆'.repeat(5 - Math.round(r.rating))}</div>
                <p className="text-sm text-gray-700 mt-1">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-3">Write a review</h2>
          {user ? (
            <ReviewForm onSubmit={(rating, text) => { addReview(product.id, user.name || user.email, rating, text); show('Review submitted for approval', { type: 'success' }); }} />
          ) : (
            <div className="text-sm text-gray-600">Please login to write a review.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewForm: React.FC<{ onSubmit: (rating: number, text: string) => void }> = ({ onSubmit }) => {
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState('');
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit(rating, text); setText(''); }}>
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border rounded px-3 py-2">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Review</label>
        <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border rounded px-3 py-2" rows={4} placeholder="Share your experience" required />
      </div>
      <button className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition">Submit</button>
    </form>
  );
};

export default ProductDetailsPage;

