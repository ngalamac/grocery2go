import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ShopPage from './components/ShopPage';
import Cart from './components/Cart';
import BookingPage from './components/BookingPage';
import CheckoutPage from './components/CheckoutPage';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AdditionalItem } from './types';

type Page = 'home' | 'shop' | 'market' | 'booking' | 'checkout' | 'success';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [budget, setBudget] = useState<number>(0);
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('booking');
  };

  const handleProceedToPayment = (
    newBudget: number,
    newAdditionalItems: AdditionalItem[],
    newSpecialInstructions: string
  ) => {
    setBudget(newBudget);
    setAdditionalItems(newAdditionalItems);
    setSpecialInstructions(newSpecialInstructions);
    setCurrentPage('checkout');
  };

  const handleOrderSuccess = () => {
    setCurrentPage('success');
    setBudget(0);
    setAdditionalItems([]);
    setSpecialInstructions('');
    setTimeout(() => {
      setCurrentPage('home');
    }, 3000);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          onCartClick={() => setIsCartOpen(true)}
          onShopClick={() => setCurrentPage('shop')}
          onMarketClick={() => setCurrentPage('market')}
          onHomeClick={() => setCurrentPage('home')}
        />

        <main className="flex-1 pt-[220px] md:pt-[200px]">
          {currentPage === 'home' && (
            <HomePage onShopClick={() => setCurrentPage('shop')} />
          )}
          {currentPage === 'shop' && <ShopPage />}
          {currentPage === 'market' && <ShopPage />}
          {currentPage === 'booking' && (
            <BookingPage
              onBack={() => setIsCartOpen(true)}
              onProceedToPayment={handleProceedToPayment}
            />
          )}
          {currentPage === 'checkout' && (
            <CheckoutPage
              onBack={() => setCurrentPage('booking')}
              onSuccess={handleOrderSuccess}
              budget={budget}
              additionalItems={additionalItems}
              specialInstructions={specialInstructions}
            />
          )}
          {currentPage === 'success' && (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
              <div className="bg-white rounded-lg shadow-lg p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Order Placed Successfully!
                </h2>
                <p className="text-gray-600 mb-2">
                  Thank you for your order. We will contact you shortly with payment instructions.
                </p>
                <p className="text-sm text-gray-500">
                  You will be redirected to the homepage in a moment...
                </p>
              </div>
            </div>
          )}
        </main>

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />

        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
