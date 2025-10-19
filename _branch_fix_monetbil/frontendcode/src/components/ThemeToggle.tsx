import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="text-white hover:text-yellow-400 transition" title="Toggle theme">
      {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
};

export default ThemeToggle;

