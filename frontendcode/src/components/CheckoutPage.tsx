import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';

interface CheckoutPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onSuccess }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Yaoundé',
    extraInfo: ''
  });

  const SHOPPING_FEE = 2.5;
  const DELIVERY_FEE = 5.0;
  const subtotal = getCartTotal();
  const total = subtotal + SHOPPING_FEE + DELIVERY_FEE;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', { ...formData, cart, total });
    clearCart();
    onSuccess();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#7cb342] hover:text-[#689f38] mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back to Cart
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                placeholder="+237 6XX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342] bg-gray-100"
                placeholder="Yaoundé"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Delivery is only available in Yaoundé</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Additional Information or Extra Products
              </label>
              <textarea
                name="extraInfo"
                value={formData.extraInfo}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                placeholder="Any additional products or special instructions for your order..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Let us know if you need any products not listed or have special delivery instructions
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-yellow-800">Payment Information</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Payment will be processed via Campay MoMo API (Mobile Money)
              </p>
              <p className="text-xs text-yellow-600">
                You will receive payment instructions after placing your order
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#7cb342] text-white py-3 rounded-lg font-semibold hover:bg-[#689f38] transition"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-[#7cb342] font-bold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shopping Fee:</span>
                <span className="font-semibold">${SHOPPING_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee (Yaoundé):</span>
                <span className="font-semibold">${DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-[#7cb342]">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                <span className="font-semibold">Prepaid orders only.</span> All orders must be paid before delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
