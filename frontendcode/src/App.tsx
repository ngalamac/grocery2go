
import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ShopPage from './components/ShopPage';
import Cart from './components/Cart';
import BookingPage from './components/BookingPage';
import CheckoutPage from './components/CheckoutPage';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import CouponPage from './components/CouponPage';
import TrackOrderPage from './components/TrackOrderPage';
import { CartProvider } from './context/CartContext';
import { AdditionalItem } from './types';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import { ToastProvider } from './context/ToastContext';
import ToastViewport from './components/ToastViewport';
import { WishlistProvider } from './context/WishlistContext';
import WishlistPage from './components/WishlistPage';
import OrdersPage from './components/OrdersPage';
import { QuickViewProvider } from './context/QuickViewContext';
import QuickViewModal from './components/QuickViewModal';
import ProfilePage from './components/ProfilePage';
import { ThemeProvider } from './context/ThemeContext';
import { CouponProvider } from './context/CouponContext';
import { ReviewsProvider } from './context/ReviewsContext';
import ProductDetailsPage from './components/ProductDetailsPage';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [budget, setBudget] = useState<number>(0);
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Navigation helpers
  const handleProceedToPayment = (
    newBudget: number,
    newAdditionalItems: AdditionalItem[],
    newSpecialInstructions: string
  ) => {
    setBudget(newBudget);
    setAdditionalItems(newAdditionalItems);
    setSpecialInstructions(newSpecialInstructions);
  };

  // Custom wrapper to use useNavigate inside App
  function AppWithNavigation() {
    const navigate = useNavigate();
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          onCartClick={() => setIsCartOpen(true)}
          onShopClick={() => navigate('/shop')}
          onMarketClick={() => navigate('/market')}
          onHomeClick={() => navigate('/')}
        />

        <main className="flex-1 pt-[220px] md:pt-[200px]">
          <Routes>
            <Route path="/" element={<HomePage onShopClick={() => navigate('/shop')} />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/market" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/booking" element={
              <BookingPage
                onBack={() => setIsCartOpen(true)}
                onProceedToPayment={handleProceedToPayment}
              />
            } />
            <Route path="/checkout" element={
              <CheckoutPage
                onBack={() => navigate('/booking')}
                onSuccess={() => navigate('/success')}
                budget={budget}
                additionalItems={additionalItems}
                specialInstructions={specialInstructions}
              />
            } />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/coupon" element={<CouponPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/success" element={
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
            } />
          </Routes>
        </main>

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={() => navigate('/booking')}
        />

        <AuthModal />
        <QuickViewModal />
        <Footer />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <CouponProvider>
        <ToastProvider>
          <AuthProvider>
            <ReviewsProvider>
              <WishlistProvider>
                <QuickViewProvider>
                  <CartProvider>
                    <BrowserRouter>
                      <AppWithNavigation />
                      <ToastViewport />
                    </BrowserRouter>
                  </CartProvider>
                </QuickViewProvider>
              </WishlistProvider>
            </ReviewsProvider>
          </AuthProvider>
        </ToastProvider>
      </CouponProvider>
    </ThemeProvider>
  );
}

export default App;
