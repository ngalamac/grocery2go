import React, { useState } from 'react';
import { useCoupon } from '../context/CouponContext';

const promos = [
  { code: 'FLASH20', title: '20% Off Fresh Produce', desc: 'Valid today only', color: 'bg-green-50 border-green-200 text-green-800' },
  { code: 'FREESHIP', title: 'Free Delivery', desc: 'Orders over 10,000 CFA', color: 'bg-blue-50 border-blue-200 text-blue-800' }
];

const CouponPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<string | null>(null);
  const { apply: applyCoupon, clear } = useCoupon();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = promos.find(p => p.code.toLowerCase() === code.toLowerCase());
    if (found) {
      const ok = await applyCoupon(found.code);
      if (ok) setApplied(found.code);
    }
    setCode('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">
      <h1 className="text-3xl font-bold mb-6">Coupons & Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 md:p-6">
          <p className="mb-4 text-gray-600">Enter your coupon code below to get a discount on your next order.</p>
          <form className="flex gap-2" onSubmit={onSubmit}>
            <input className="flex-1 border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7cb342]" placeholder="Enter coupon code" value={code} onChange={e => setCode(e.target.value)} />
            <button className="bg-primary-500 text-white px-6 py-3 rounded font-semibold hover:bg-primary-600 transition" type="submit">Apply</button>
          </form>
          {applied && (
            <div className="mt-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded p-3 flex items-center justify-between">
              <span>Coupon {applied} applied!</span>
              <button onClick={() => { clear(); setApplied(null); }} className="text-green-700 underline">Remove</button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {promos.map(p => (
            <div key={p.code} className={`${p.color} border rounded p-4`}>
              <div className="text-xs font-mono">Code: {p.code}</div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm opacity-80">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponPage;
