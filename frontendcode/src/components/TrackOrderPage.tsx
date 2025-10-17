import React, { useState } from 'react';
import { getOrderById } from '../utils/orders';

// Steps are inlined in render; no static array needed

const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [step, setStep] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!orderId) {
      setStep(null);
      return;
    }
    const order = await getOrderById(orderId);
    if (!order) {
      setError('Order not found. Please check your ID.');
      setStep(null);
      return;
    }
    const map: Record<string, number> = { 'pending': 0, 'confirmed': 1, 'shopping': 2, 'out-for-delivery': 3, 'delivered': 4 };
    setStep(map[order.status] ?? 0);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-10">
      <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
      <form className="flex flex-col sm:flex-row gap-2 mb-6" onSubmit={handleTrack}>
        <input
          className="flex-1 border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
          placeholder="Enter your order ID"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
        />
        <button className="bg-primary-500 text-white px-6 py-3 rounded font-semibold hover:bg-primary-600 transition" type="submit">Track</button>
      </form>
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4">{error}</div>}
      {step !== null && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <ol className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {['Order Placed','Confirmed','Shopping','Out for Delivery','Delivered'].map((s, i) => (
              <li key={s} className={`text-center rounded border p-3 ${i <= step ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                <div className="text-sm">Step {i + 1}</div>
                <div className="font-semibold">{s}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
