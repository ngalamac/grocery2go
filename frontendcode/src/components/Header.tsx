import React, { useState } from 'react';
import { ShoppingCart, User, Heart, Search, Menu, X, Phone, Mail, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* Promo Banner */}
      <div className="bg-yellow-400 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-4">
            <span className="font-semibold">50% OFF</span>
            <span className="hidden sm:inline">Long Weekend Sale Up to 50% OFF</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Enter Promotion Code"
              className="px-3 py-1 rounded text-sm border border-gray-300 w-40"
              defaultValue="Sale2017"
            />
            <button className="bg-black text-white px-6 py-1 rounded font-semibold hover:bg-gray-800 transition">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Contact Bar */}
      <div className="bg-black text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="tel:0000-123456789" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <Phone size={14} />
              <span>0000 - 123 456789</span>
            </a>
            <a href="mailto:info@example.com" className="hidden md:flex items-center gap-2 hover:text-yellow-400 transition">
              <Mail size={14} />
              <span>info@example.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-yellow-400 transition">Store Location</button>
            <button className="hover:text-yellow-400 transition">Track Your Order</button>
            <button className="hover:text-yellow-400 transition">CM</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[#7cb342] py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
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
            <button className="bg-yellow-400 px-6 py-2 rounded-r-md hover:bg-yellow-500 transition">
              <Search size={20} />
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-white text-xs">
              <div className="font-semibold">FREE SHIPPING</div>
              <div>Money Back Guarantee</div>
            </div>
            <div className="hidden md:block text-white text-xs">
              <div className="font-semibold">BIG SAVING MONEY</div>
              <div>On Order Over $9</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/wishlist')} className="text-white hover:text-yellow-400 transition" title="Wishlist">
                <Heart size={24} />
              </button>
              <button onClick={onCartClick} className="text-white hover:text-yellow-400 transition relative">
                <ShoppingCart size={24} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <LanguageSwitcher variant="header" />
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <button onClick={() => navigate('/admin')} className="hidden sm:block text-white text-sm hover:text-yellow-300">Admin</button>
                  )}
                  <button onClick={() => navigate('/dashboard/profile')} className="hidden sm:block text-white text-sm hover:text-yellow-300">{user.name || user.email}</button>
                  <button onClick={logout} className="text-white hover:text-yellow-400 transition" title="Logout">
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <button onClick={openAuthModal} className="text-white hover:text-yellow-400 transition">
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
        </div>
      </div>

      {/* Navigation */}
      {/* Mobile search */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2">
            <input type="text" placeholder="Search products" className="flex-1 px-3 py-2 border rounded" />
            <button className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 transition"><Search size={18} /></button>
          </div>
        </div>
      )}
      <nav className={`bg-white border-t ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-0 lg:gap-8 py-2">
            <li>
              <button
                onClick={onHomeClick}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 text-[#7cb342] hover:text-[#689f38] font-medium transition"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={onShopClick}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-[#7cb342] transition"
              >
                Shop
              </button>
            </li>
            <li>
              <button
                onClick={onMarketClick}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-[#7cb342] transition"
              >
                Market Products
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/about')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-[#7cb342] transition"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/contact')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-[#7cb342] transition"
              >
                Contact
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/coupon')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-[#7cb342] transition"
              >
                Coupon
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/track-order')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-[#7cb342] transition"
              >
                Track Order
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/orders')}
                className="block w-full text-left lg:w-auto py-3 lg:py-2 hover:text-[#7cb342] transition"
              >
                Orders
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
