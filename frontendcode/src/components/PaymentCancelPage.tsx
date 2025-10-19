import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-lg shadow-lg p-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">Your payment did not complete. You can try again.</p>
        <button onClick={() => navigate('/checkout')} className="bg-primary-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-600 transition">
          Return to Checkout
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
