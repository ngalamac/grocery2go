import React, { useState } from 'react';
import { ShoppingCart, User, Heart, Search, Menu, X, LogOut, MapPin, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container } from './ui';
import LocationModal from './LocationModal';
import { useLocationCtx } from '../context/LocationContext';

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
  const { location } = useLocationCtx();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand / Home - Talabat style */}
          <button onClick={onHomeClick} className="flex items-center gap-2">
            <div className="bg-primary-500 text-white w-10 h-10 rounded-lg grid place-items-center font-bold text-lg">
              T
            </div>
            <span className="hidden sm:block font-bold text-xl text-gray-900">Talabat</span>
          </button>

          {/* Location selector - Talabat style */}
          <button
            onClick={() => setIsLocationOpen(true)}
            className="flex-1 hidden md:flex items-center gap-2 max-w-md bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 border border-gray-200"
            aria-label="Change location"
          >
            <MapPin size={18} className="text-primary-500" />
            <div className="text-left leading-tight truncate">
              <div className="text-xs text-gray-500">Deliver to</div>
              <div className="text-sm font-semibold text-gray-900 truncate">{location.city}{location.area ? `, ${location.area}` : ''}</div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* Actions - Talabat style */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => navigate('/wishlist')} className="hidden sm:inline-flex p-2 rounded-lg hover:bg-gray-100" title="Wishlist">
              <Heart size={20} className="text-gray-600" />
            </button>
            <button onClick={onCartClick} className="relative inline-flex p-2 rounded-lg hover:bg-gray-100" title="Cart">
              <ShoppingCart size={20} className="text-gray-600" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full grid place-items-center font-semibold">
                  {getCartCount()}
                </span>
              )}
            </button>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} className="hidden sm:inline-flex px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700">Admin</button>
                )}
                <button onClick={() => navigate('/dashboard/profile')} className="hidden sm:inline-flex px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700">
                  {user.name || user.email}
                </button>
                <button onClick={logout} className="inline-flex p-2 rounded-lg hover:bg-gray-100" title="Logout">
                  <LogOut size={18} className="text-gray-600" />
                </button>
              </>
            ) : (
              <button onClick={openAuthModal} className="inline-flex p-2 rounded-lg hover:bg-gray-100">
                <User size={20} className="text-gray-600" />
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden inline-flex p-2 rounded-lg hover:bg-gray-100">
              {mobileMenuOpen ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Search input - Talabat style */}
        <div className="mt-3">
          <div className="flex items-center gap-3 bg-gray-50 text-gray-700 rounded-lg px-4 py-3 border border-gray-200">
            <Search className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for restaurants, groceries or items"
              className="flex-1 bg-transparent placeholder-gray-400 focus:outline-none text-sm"
            />
          </div>
        </div>
      </Container>

      {/* Secondary nav - Talabat style */}
      <nav className={`${mobileMenuOpen ? 'block' : 'hidden md:block'} bg-white border-t border-gray-100`}>
        <Container className="py-3">
          <ul className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <li>
              <button onClick={onHomeClick} className="px-4 py-2 rounded-full text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors">Home</button>
            </li>
            <li>
              <button onClick={onShopClick} className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Shop</button>
            </li>
            <li>
              <button onClick={onMarketClick} className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Market</button>
            </li>
            <li>
              <button onClick={() => navigate('/orders')} className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Orders</button>
            </li>
            <li>
              <button onClick={() => navigate('/track-order')} className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Track</button>
            </li>
            <li>
              <button onClick={() => navigate('/coupon')} className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Offers</button>
            </li>
          </ul>
        </Container>
      </nav>

      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </header>
  );
};

export default Header;
