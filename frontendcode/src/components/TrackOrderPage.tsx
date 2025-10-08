import React, { useState } from 'react';

const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order tracking
    if (orderId === '12345') {
      setStatus('Your order is out for delivery!');
    } else if (orderId) {
      setStatus('Order not found. Please check your ID.');
    } else {
      setStatus(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
      <form className="flex gap-2 mb-6" onSubmit={handleTrack}>
        <input
          className="flex-1 border rounded px-4 py-2"
          placeholder="Enter your order ID"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
        />
        <button className="bg-[#7cb342] text-white px-6 py-2 rounded" type="submit">Track</button>
      </form>
      {status && <div className="bg-blue-50 border border-blue-200 rounded p-4 text-blue-700">{status}</div>}
    </div>
  );
};

export default TrackOrderPage;
