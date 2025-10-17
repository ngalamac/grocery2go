import React from 'react';
import { Home, ShoppingBag, ShoppingCart, User, Package } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const items = [
  { key: 'home', label: 'Home', icon: Home, to: '/' },
  { key: 'shop', label: 'Shop', icon: ShoppingBag, to: '/shop' },
  { key: 'cart', label: 'Cart', icon: ShoppingCart, to: '#cart' },
  { key: 'orders', label: 'Orders', icon: Package, to: '/orders' },
  { key: 'profile', label: 'Profile', icon: User, to: '/profile' },
];

const BottomNav: React.FC<{ onCart?: () => void }>= ({ onCart }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (to: string) => {
    if (to === '#cart') {
      onCart?.();
      return;
    }
    navigate(to);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ key, label, icon: Icon, to }) => {
          const active = to !== '#cart' && (to === '/' ? pathname === '/' : pathname.startsWith(to));
          return (
            <li key={key}>
              <button
                onClick={() => handleClick(to)}
                className={cn(
                  'w-full h-16 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors',
                  active ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700'
                )}
                aria-label={label}
              >
                <div className={cn(
                  'p-2 rounded-lg transition-colors',
                  active ? 'bg-primary-50' : 'hover:bg-gray-50'
                )}>
                  <Icon size={20} />
                </div>
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
