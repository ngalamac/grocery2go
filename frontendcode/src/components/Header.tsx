import React, { useState } from 'react';
import { ShoppingCart, User, Heart, Search, Menu, X, Phone, Mail, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { Container } from './ui';

interface HeaderProps {
  onCartClick: () => void;
  onShopClick: () => void;
  onMarketClick: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onShopClick, onMarketClick, onHomeClick }) => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, openAuthModal, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-md">
      {/* Promo Banner */}
      <div className="bg-secondary-500 py-2">
        <Container className="flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-900">
          <div className="flex items-center gap-4">
            <span className="font-semibold">50% OFF</span>
            <span className="hidden sm:inline">Long Weekend Sale Up to 50% OFF</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <input
              type="text"
              placeholder="Enter Promotion Code"
              className="px-3 py-1 rounded text-sm border border-neutral-300 w-40"
              defaultValue="Sale2017"
            />
            <button className="bg-neutral-900 text-white px-6 py-1 rounded font-semibold hover:bg-neutral-800 transition">
              Shop Now
            </button>
          </div>
        </Container>
      </div>

      {/* Contact Bar */}
      <div className="bg-neutral-900 text-white py-2 text-sm">
        <Container className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="tel:0000-123456789" className="flex items-center gap-2 hover:text-secondary-200 transition">
              <Phone size={14} />
              <span>6 79 83 81 82</span>
            </a>
            <a href="mailto:info@example.com" className="hidden md:flex items-center gap-2 hover:text-secondary-200 transition">
              <Mail size={14} />
              <span>info@grocery2go.shop</span>
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <button className="hover:text-secondary-200 transition">Store Location</button>
            <button className="hover:text-secondary-200 transition">Track Your Order</button>
          </div>
        </Container>
      </div>

      {/* Main Header */}
      <div className="bg-primary-500 py-3 md:py-4">
        <Container className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={onHomeClick} className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-lg">
              <div className="text-2xl">🛒</div>
            </div>
            <div className="text-white">
              <div className="font-bold text-xl leading-tight">Grocery2Go</div>
              <div className="text-xs">Grocery Mart</div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <select className="px-4 py-2 border border-r-0 border-gray-300 rounded-l-md bg-white text-sm">
              <option>All categories</option>
              <option>Fresh Fruit</option>
              <option>Fresh Meat</option>
              <option>Kitchen Accessories</option>
              <option>Dhals</option>
            </select>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 px-4 py-2 border border-gray-300 text-sm"
            />
            <button className="bg-secondary-500 text-neutral-900 px-6 py-2 rounded-r-md hover:bg-secondary-400 transition" aria-label="Search">
              <Search size={20} />
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:block text-white text-xs">
              <div className="font-semibold">1000 CFA SHIPPING</div>
              <div>Money Back Guarantee</div>
            </div>
            <div className="hidden md:block text-white text-xs">
              <div className="font-semibold">BIG SAVING MONEY</div>
              <div>On Order Over 2,0000 CFA</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/wishlist')} className="hidden lg:block text-white hover:text-secondary-200 transition" title="Wishlist">
                <Heart size={24} />
              </button>
              <button onClick={onCartClick} className="text-white hover:text-secondary-200 transition relative">
                <ShoppingCart size={24} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <div className="hidden lg:block">
                <LanguageSwitcher variant="header" />
              </div>
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <button onClick={() => navigate('/admin')} className="hidden sm:block text-white text-sm hover:text-secondary-200">👤</button>
                  )}
                  <button onClick={() => navigate('/dashboard/profile')} className="hidden sm:block text-white text-sm hover:text-secondary-200">{user.name || user.email}</button>
                  <button onClick={logout} className="text-white hover:text-secondary-200 transition" title="Logout">
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <button onClick={openAuthModal} className="text-white hover:text-secondary-200 transition">
                  <User size={24} />
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Navigation */}
      {/* Collapsible nav under header on mobile, always visible on desktop */}
      <nav className={`bg-white border-t ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
        <Container>
          <ul className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-0 lg:gap-8 py-2">
            <li>
              <button
                onClick={onHomeClick}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 text-primary-600 hover:text-primary-700 font-medium transition"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={onShopClick}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-primary-600 transition"
              >
                Shop
              </button>
            </li>
            <li>
              <button
                onClick={onMarketClick}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-primary-600 transition"
              >
                Market Products
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/about')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-primary-600 transition"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/contact')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-primary-600 transition"
              >
                Contact
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/coupon')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-primary-600 transition"
              >
                Coupon
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/track-order')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-primary-600 transition"
              >
                Track Order
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/orders')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-primary-600 transition"
              >
                Orders
              </button>
            </li>
          </ul>
        </Container>
      </nav>

      {/* Removed mobile drawer; links shown below header when open */}
    </header>
  );
};

export default Header;
