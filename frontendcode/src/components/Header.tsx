import React, { useState } from 'react';
import { ShoppingCart, User, Heart, Search, LogOut, MapPin, ChevronDown } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      {/* Top Row: Location and quick actions */}
      <div className="py-2">
        <Container className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIsLocationOpen(true)}
            className="flex items-center gap-2 text-neutral-900"
            aria-label="Change location"
          >
            <MapPin size={18} className="text-primary-600" />
            <div className="leading-tight text-left">
              <div className="text-[10px] uppercase text-neutral-500">Deliver to</div>
              <div className="text-sm font-semibold">
                {location.city}{location.area ? `, ${location.area}` : ''}
              </div>
            </div>
            <ChevronDown size={16} className="text-neutral-500" />
          </button>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/wishlist')} className="hidden sm:inline-flex text-neutral-700 hover:text-primary-600 transition" title="Wishlist">
              <Heart size={22} />
            </button>
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {user.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} className="text-neutral-700 hover:text-primary-600">👤</button>
                )}
                <button onClick={() => navigate('/dashboard/profile')} className="text-sm text-neutral-700 hover:text-primary-600">
                  {user.name || user.email}
                </button>
                <button onClick={logout} className="text-neutral-700 hover:text-primary-600" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button onClick={openAuthModal} className="text-neutral-700 hover:text-primary-600">
                <User size={22} />
              </button>
            )}
            <button onClick={onCartClick} className="relative text-neutral-700 hover:text-primary-600" aria-label="Cart">
              <ShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* Search Bar */}
      <div className="pb-3">
        <Container>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search for restaurants, groceries or dishes"
              className="w-full pl-11 pr-4 py-3 rounded-full bg-neutral-100 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onFocus={() => navigate('/shop')}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate('/shop'); }}
            />
          </div>
        </Container>
      </div>

      {/* Location modal */}
      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </header>
  );
};

export default Header;
