import React from 'react';
import { Home, Search, ShoppingCart, User, Package, Store } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const items = [
  { key: 'home', label: 'Home', icon: Home, to: '/' },
  { key: 'stores', label: 'Stores', icon: Store, to: '/stores' },
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
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-200 md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ key, label, icon: Icon, to }) => {
          const active = to !== '#cart' && (to === '/' ? pathname === '/' : pathname.startsWith(to));
          return (
            <li key={key}>
              <button
                onClick={() => handleClick(to)}
                className={cn(
                  'w-full h-14 flex flex-col items-center justify-center gap-0.5 text-xs',
                  active ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'
                )}
                aria-label={label}
              >
                <Icon size={20} />
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
