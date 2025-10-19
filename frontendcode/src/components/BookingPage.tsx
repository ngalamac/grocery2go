import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { AdditionalItem } from '../types';
import { Container } from './ui';
import Button from './ui/Button';
import { CreditCard } from 'lucide-react';
import { ordersApi, paymentsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
  const [budget, setBudget] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Yaoundé');

  const handleMonetbilPayment = async () => {
    if (isProcessingPayment) return;
    if (!phoneNumber) {
      alert('Please enter your phone number to proceed with the payment.');
      return;
    }
    if (!address.trim()) {
      alert('Please enter your delivery address.');
      return;
    }
    if (!user) {
      alert('You must be logged in to place an order.');
      return;
    }

    const totalAmount = estimatedTotal + totalFee;
    const budgetValue = parseFloat(budget);
    const orderBudget = Number.isFinite(budgetValue) && !isNaN(budgetValue) ? budgetValue : totalAmount;

    const orderData = {
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      additionalItems,
      specialInstructions,
      subtotal,
      shoppingFee: serviceFee,
      deliveryFee: DELIVERY_FEE,
      total: totalAmount,
      budget: orderBudget,
      customerInfo: {
        name: user.name,
        email: user.email,
        phone: phoneNumber,
        address,
        city,
      },
      payment: {
        provider: 'monetbil',
        status: 'pending',
      },
    };

    try {
      setIsProcessingPayment(true);
      const newOrder = await ordersApi.create(orderData);
      const paymentResponse = await paymentsApi.startMonetbil({
        orderId: newOrder._id,
        phone: phoneNumber,
      });
      if (paymentResponse && paymentResponse.status === 'REQUEST_ACCEPTED' && paymentResponse.payment_url) {
        window.location.href = paymentResponse.payment_url;
      } else {
        // Try to surface an existing payment URL by checking payment status
        try {
          const checkResp = await paymentsApi.checkMonetbil(newOrder._id);
          if (checkResp?.payment_url) {
            window.location.href = checkResp.payment_url as string;
            return;
          }
        } catch {}
        const errorMessage = paymentResponse?.message || 'Failed to get payment URL. Please try again.';
        alert(`Payment failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Payment Initialization failed", error);
      alert("Failed to start payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const MIN_SERVICE_FEE = 500;
  const DELIVERY_FEE = 1000;
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
  const totalFee = serviceFee + DELIVERY_FEE;

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

    if (!budgetValue || budgetValue < subtotal) {
      alert(`Your budget must be at least ${subtotal.toFixed(0)} CFA to cover the catalog items you selected. Please increase your budget or remove some items/quantities.`);
      return;
    }

    onProceedToPayment(budgetValue, additionalItems, specialInstructions);
  };

  return (
    <Container className="py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back to Cart
      </button>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Complete Your Shopping Request</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-blue-800">Service Information</h3>
              <p className="text-sm text-blue-700 mb-2">
                We shop for you based on your selections and budget. Prices shown are estimates and may vary slightly based on market availability.
              </p>
              <p className="text-sm text-blue-700">
                Shopping fee: Minimum 500 CFA, increases based on order size and value.<br />
                Delivery fee: Fixed {DELIVERY_FEE} CFA per order.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Your Budget (CFA) *</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                min={subtotal}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                placeholder={`Minimum: ${subtotal.toFixed(0)} CFA`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Your budget must be at least the total for catalog items you selected: <span className="font-semibold">{subtotal.toFixed(0)} CFA</span>.<br />
                Shopping and delivery fees will be added to your payment summary.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Additional Items Not in Catalog</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                    placeholder="Item name"
                  />
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                    placeholder="Price CFA"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full sm:w-auto bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition flex items-center justify-center gap-1"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                {additionalItems.length > 0 && (
                  <div className="space-y-2">
                    {additionalItems.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 p-3 rounded-md">
                        <div className="min-w-0">
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

            <div>
              <h3 className="font-semibold mb-3">Delivery Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                    placeholder="Street address, building, floor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                    placeholder="Yaoundé"
                  />
                  <p className="text-xs text-gray-500 mt-1">Delivery currently available in Yaoundé.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number for Mobile Payment</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                placeholder="e.g., 67XXXXXXX"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="submit"
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
              >
                Click Proceed to Payment Details
              </button>
              <Button
                id="monetbil-pay-button"
                type="button"
                className="w-full"
                size="md"
                onClick={handleMonetbilPayment}
                loading={isProcessingPayment}
                disabled={isProcessingPayment}
              >
                <CreditCard size={18} className="mr-2" />
                pay with Mobile Money
              </Button>
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 lg:sticky top-24">
            <h3 className="text-xl font-bold mb-4">Shopping Summary</h3>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              <h4 className="font-semibold text-sm text-gray-700">Selected Items:</h4>
              {cart.length === 0 && (
                <p className="text-xs text-gray-500">No catalog items selected.</p>
              )}
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center border-b last:border-b-0 py-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm break-words">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                <span className="text-primary-600 font-bold text-sm">{(item.price * item.quantity).toFixed(0)} CFA</span>
                  </div>
                </div>
              ))}
              {additionalItems.length > 0 && (
                <>
                  <h4 className="font-semibold text-sm text-gray-700 mt-4">Additional Items:</h4>
                  {additionalItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm border-b last:border-b-0 py-2">
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
                <span className="text-gray-600">Shopping Fee:</span>
                <span className="font-semibold">{serviceFee} CFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-semibold">{DELIVERY_FEE} CFA</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Estimated Total:</span>
                <span className="text-primary-600">{(estimatedTotal + totalFee).toFixed(0)} CFA</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Final cost may vary slightly based on actual market prices. Any unused budget will be refunded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BookingPage;
