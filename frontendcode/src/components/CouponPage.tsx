import React from 'react';

const CouponPage: React.FC = () => (
  <div className="max-w-2xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold mb-6">Coupons & Offers</h1>
    <p className="mb-4">Enter your coupon code below to get a discount on your next order!</p>
    <form className="flex gap-2 mb-6">
      <input className="flex-1 border rounded px-4 py-2" placeholder="Enter coupon code" />
      <button className="bg-[#7cb342] text-white px-6 py-2 rounded" type="submit">Apply</button>
    </form>
    <div className="bg-green-50 border border-green-200 rounded p-4">
      <h2 className="font-semibold mb-2">Current Promotions</h2>
      <ul className="list-disc pl-6 text-green-700">
        <li>FLASH20: 20% off all fresh produce (today only!)</li>
        <li>FREESHIP: Free delivery on orders over 10,000 CFA</li>
      </ul>
    </div>
  </div>
);

export default CouponPage;
