import React, { useState } from 'react';
import { ShoppingCart, User, Heart, Search, Menu, X, LogOut, MapPin } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-primary-500 text-white shadow-md">
      <Container className="py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Brand / Home */}
          <button onClick={onHomeClick} className="flex items-center gap-2">
            <div className="bg-white text-primary-600 w-9 h-9 rounded-lg grid place-items-center font-bold">
              🛒
            </div>
            <span className="hidden sm:block font-semibold">Grocery2Go</span>
          </button>

          {/* Location selector */}
          <button
            onClick={() => setIsLocationOpen(true)}
            className="flex-1 hidden md:flex items-center gap-2 max-w-md bg-primary-600/40 hover:bg-primary-600/60 rounded-md px-3 py-2"
            aria-label="Change location"
          >
            <MapPin size={16} className="opacity-90" />
            <div className="text-left leading-tight truncate">
              <div className="text-[10px] uppercase opacity-90">Deliver to</div>
              <div className="text-sm font-semibold truncate">{location.city}{location.area ? `, ${location.area}` : ''}</div>
            </div>
            <ChevronDown size={16} className="text-neutral-500" />
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => navigate('/wishlist')} className="hidden sm:inline-flex p-2 rounded-full hover:bg-primary-600/40" title="Wishlist">
              <Heart size={22} />
            </button>
            <button onClick={onCartClick} className="relative inline-flex p-2 rounded-full hover:bg-primary-600/40" title="Cart">
              <ShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-[10px] w-5 h-5 rounded-full grid place-items-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} className="hidden sm:inline-flex px-2 py-1 rounded hover:bg-primary-600/40 text-sm">Admin</button>
                )}
                <button onClick={() => navigate('/dashboard/profile')} className="hidden sm:inline-flex px-2 py-1 rounded hover:bg-primary-600/40 text-sm">
                  {user.name || user.email}
                </button>
                <button onClick={logout} className="inline-flex p-2 rounded-full hover:bg-primary-600/40" title="Logout">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button onClick={openAuthModal} className="inline-flex p-2 rounded-full hover:bg-primary-600/40">
                <User size={22} />
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden inline-flex p-2 rounded-full hover:bg-primary-600/40">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search input - visible on all viewports under the top row */}
        <div className="mt-2">
          <div className="flex items-center gap-2 bg-white text-neutral-700 rounded-lg px-3 py-2 shadow-sm">
            <Search className="text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search for restaurants, groceries or items"
              className="flex-1 bg-transparent placeholder-neutral-400 focus:outline-none text-sm"
            />
          </div>
        </div>
      </Container>

      {/* Secondary nav (chips) */}
      <nav className={`${mobileMenuOpen ? 'block' : 'hidden md:block'} bg-white text-neutral-700`}>
        <Container className="py-2">
          <ul className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
            <li>
              <button onClick={onHomeClick} className="px-3 py-1.5 rounded-full text-sm bg-neutral-100 hover:bg-neutral-200">Home</button>
            </li>
            <li>
              <button onClick={onShopClick} className="px-3 py-1.5 rounded-full text-sm bg-neutral-100 hover:bg-neutral-200">Shop</button>
            </li>
            <li>
              <button onClick={onMarketClick} className="px-3 py-1.5 rounded-full text-sm bg-neutral-100 hover:bg-neutral-200">Market</button>
            </li>
            <li>
              <button onClick={() => navigate('/orders')} className="px-3 py-1.5 rounded-full text-sm bg-neutral-100 hover:bg-neutral-200">Orders</button>
            </li>
            <li>
              <button onClick={() => navigate('/track-order')} className="px-3 py-1.5 rounded-full text-sm bg-neutral-100 hover:bg-neutral-200">Track</button>
            </li>
            <li>
              <button onClick={() => navigate('/coupon')} className="px-3 py-1.5 rounded-full text-sm bg-neutral-100 hover:bg-neutral-200">Offers</button>
            </li>
          </ul>
        </Container>
      </div>

      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </header>
  );
};

export default Header;
