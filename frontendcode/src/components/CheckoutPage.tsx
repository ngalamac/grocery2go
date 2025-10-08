import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';
import { AdditionalItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCoupon } from '../context/CouponContext';
import { createOrder } from '../utils/orders';

interface CheckoutPageProps {
  onBack: () => void;
  onSuccess: () => void;
  budget: number;
  additionalItems: AdditionalItem[];
  specialInstructions: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBack,
  onSuccess,
  budget,
  additionalItems,
  specialInstructions
}) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const { show } = useToast();
  const { applied } = useCoupon();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Yaoundé'
  });

  const MIN_SERVICE_FEE = 500;
  const subtotal = getCartTotal();
  const additionalItemsTotal = additionalItems.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const estimatedTotal = subtotal + additionalItemsTotal;

  const calculateServiceFee = () => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = estimatedTotal;

    let serviceFee = MIN_SERVICE_FEE;

    if (totalValue > 10000) {
      serviceFee += Math.floor((totalValue - 10000) / 5000) * 100;
    }

    if (itemCount > 10) {
      serviceFee += (itemCount - 10) * 50;
    }

    return Math.max(serviceFee, MIN_SERVICE_FEE);
  };

  const serviceFee = calculateServiceFee();
  const preDiscountTotal = estimatedTotal + serviceFee;
  const discount = applied ? (applied.type === 'percent' ? (preDiscountTotal * applied.value) / 100 : applied.value) : 0;
  const total = Math.max(0, preDiscountTotal - discount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      createOrder({
        userId: user.id,
        userEmail: user.email,
        items: cart,
        additionalItems,
        subtotal,
        shoppingFee: serviceFee,
        deliveryFee: 0,
        total,
        budget,
        specialInstructions,
        customerInfo: formData
      });
    } catch {}
    clearCart();
    show('Order placed successfully!', { type: 'success', title: 'Success' });
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

            {specialInstructions && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Shopping Instructions</h3>
                <p className="text-sm text-gray-700">{specialInstructions}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-blue-800">Budget Information</h3>
              <p className="text-sm text-blue-700">
                Your budget: <span className="font-bold">{budget} CFA</span>
              </p>
              <p className="text-sm text-blue-700">
                Estimated total: <span className="font-bold">{total.toFixed(0)} CFA</span>
              </p>
              {applied && (
                <p className="text-xs text-blue-700">Coupon {applied.code} applied (-{applied.type === 'percent' ? `${applied.value}%` : `${applied.value} CFA`})</p>
              )}
              <p className="text-xs text-blue-600 mt-2">
                Any unused budget will be refunded after shopping is completed
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
              <h4 className="font-semibold text-sm text-gray-700">Catalog Items:</h4>
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
                      {(item.price * item.quantity).toFixed(0)} CFA
                    </p>
                  </div>
                </div>
              ))}

              {additionalItems.length > 0 && (
                <>
                  <h4 className="font-semibold text-sm text-gray-700 mt-4">Additional Items:</h4>
                  {additionalItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.estimatedPrice} CFA</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Catalog Items:</span>
                <span className="font-semibold">{subtotal.toFixed(0)} CFA</span>
              </div>
              {additionalItemsTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Additional Items:</span>
                  <span className="font-semibold">{additionalItemsTotal.toFixed(0)} CFA</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shopping & Delivery Fee:</span>
                <span className="font-semibold">{serviceFee} CFA</span>
              </div>
              {applied && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Discount ({applied.code}):</span>
                  <span className="font-semibold">- {discount.toFixed(0)} CFA</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-[#7cb342]">{total.toFixed(0)} CFA</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Budget: {budget} CFA | Remaining: {(budget - total).toFixed(0)} CFA
              </p>
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
