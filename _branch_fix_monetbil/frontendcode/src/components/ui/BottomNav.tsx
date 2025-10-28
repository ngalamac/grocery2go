import React from 'react';
import { Home, ShoppingBag, ShoppingCart, User, Package } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const items = [
  { key: 'home', label: 'Home', icon: Home, to: '/' },
  { key: 'restaurants', label: 'Eat', icon: ShoppingBag, to: '/restaurants' },
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
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ key, label, icon: Icon, to }) => {
          const active = to !== '#cart' && (to === '/' ? pathname === '/' : pathname.startsWith(to));
          return (
            <li key={key}>
              <button
                onClick={() => handleClick(to)}
                className={cn(
                  'w-full h-14 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
                  active ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'
                )}
                aria-label={label}
              >
                <Icon size={22} />
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
