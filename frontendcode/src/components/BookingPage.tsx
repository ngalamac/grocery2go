import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { AdditionalItem } from '../types';

interface BookingPageProps {
  onBack: () => void;
  onProceedToPayment: (
    budget: number,
    additionalItems: AdditionalItem[],
    specialInstructions: string
  ) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ onBack, onProceedToPayment }) => {
  const { cart, getCartTotal } = useCart();
  const [budget, setBudget] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

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

  const handleAddItem = () => {
    if (newItemName.trim() && newItemPrice) {
      const price = parseFloat(newItemPrice);
      if (!isNaN(price) && price > 0) {
        setAdditionalItems([
          ...additionalItems,
          { name: newItemName.trim(), estimatedPrice: price }
        ]);
        setNewItemName('');
        setNewItemPrice('');
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    setAdditionalItems(additionalItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetValue = parseFloat(budget);

    if (!budgetValue || budgetValue < estimatedTotal + serviceFee) {
      alert(`Your budget must be at least ${estimatedTotal + serviceFee} CFA to cover the estimated total plus service fee.`);
      return;
    }

    onProceedToPayment(budgetValue, additionalItems, specialInstructions);
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Complete Your Shopping Request</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-blue-800">Service Information</h3>
              <p className="text-sm text-blue-700 mb-2">
                We shop for you based on your selections and budget. Prices shown are estimates and may vary slightly based on market availability.
              </p>
              <p className="text-sm text-blue-700">
                Shopping and delivery fee: Minimum 500 CFA, increases based on order size and value.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Your Budget (CFA) *</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                min={estimatedTotal + serviceFee}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                placeholder={`Minimum: ${estimatedTotal + serviceFee} CFA`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Your budget should cover estimated items ({estimatedTotal} CFA) plus service fee ({serviceFee} CFA)
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Additional Items Not in Catalog</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                    placeholder="Item name"
                  />
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                    placeholder="Price CFA"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-[#7cb342] text-white px-4 py-2 rounded-md hover:bg-[#689f38] transition flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                {additionalItems.length > 0 && (
                  <div className="space-y-2">
                    {additionalItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 ml-2">- {item.estimatedPrice} CFA</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Special Shopping Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                placeholder="E.g., 'Please choose ripe tomatoes', 'Get the freshest fish available', 'Avoid damaged packaging', etc."
              />
              <p className="text-xs text-gray-500 mt-1">
                Let us know your preferences for product selection and any specific requirements
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-yellow-800">Important Notice</h3>
              <p className="text-sm text-yellow-700">
                Payment must be completed before we begin shopping. You will proceed to payment details on the next page.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#7cb342] text-white py-3 rounded-lg font-semibold hover:bg-[#689f38] transition"
            >
              Proceed to Payment Details
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Shopping Summary</h3>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              <h4 className="font-semibold text-sm text-gray-700">Selected Items:</h4>
              {cart.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
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
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Estimated Total:</span>
                <span className="text-[#7cb342]">{(estimatedTotal + serviceFee).toFixed(0)} CFA</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Final cost may vary slightly based on actual market prices. Any unused budget will be refunded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
