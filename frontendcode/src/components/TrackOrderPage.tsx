import React, { useState } from 'react';

const steps = ['Order Placed', 'In Progress', 'Out for Delivery', 'Delivered'];

const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [step, setStep] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!orderId) {
      setStep(null);
      return;
    }
    // Simulate: if ends with 5 => delivered; 3 => out for delivery; default => in progress
    const last = orderId.slice(-1);
    if (last === '5') setStep(3);
    else if (last === '3') setStep(2);
    else if (orderId.length >= 4) setStep(1);
    else {
      setError('Order not found. Please check your ID.');
      setStep(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
      <form className="flex gap-2 mb-6" onSubmit={handleTrack}>
        <input
          className="flex-1 border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
          placeholder="Enter your order ID"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
        />
        <button className="bg-[#7cb342] text-white px-6 py-3 rounded font-semibold hover:bg-[#689f38] transition" type="submit">Track</button>
      </form>
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4">{error}</div>}
      {step !== null && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((s, i) => (
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
