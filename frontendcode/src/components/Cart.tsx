import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user, openAuthModal } = useAuth();
  const { show } = useToast();

  const subtotal = getCartTotal();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#7cb342] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBag size={64} className="mb-4" />
              <p className="text-lg">Your cart is empty</p>
              <p className="text-sm">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                    <p className="text-[#7cb342] font-bold mb-2">
                      {item.price} CFA
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      show('Item removed from cart', { type: 'info' });
                    }}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated Items Total:</span>
                <span className="font-semibold">{subtotal.toFixed(0)} CFA</span>
              </div>
              <p className="text-xs text-gray-500">
                Service fee will be calculated based on final order (minimum 500 CFA)
              </p>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal();
                  return;
                }
                onCheckout();
              }}
              className="w-full bg-[#7cb342] text-white py-3 rounded-lg font-semibold hover:bg-[#689f38] transition"
            >
              Proceed to Booking
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
