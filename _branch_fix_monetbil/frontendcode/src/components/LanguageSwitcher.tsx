import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, Language } from '../context/LanguageContext';
import { cn } from '../utils/cn';

interface LanguageSwitcherProps {
  variant?: 'default' | 'header' | 'compact';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'default',
  className
}) => {
  const { language, setLanguage, isTranslating } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (lang: Language) => {
    if (lang !== language) {
      setLanguage(lang);
    }
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          disabled={isTranslating}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
            'hover:bg-primary-50 text-neutral-700 hover:text-primary-600',
            isTranslating && 'opacity-50 cursor-wait'
          )}
          title={`Switch to ${language === 'en' ? 'French' : 'English'}`}
        >
          <Globe size={20} />
          <span className="text-2xl">{currentLanguage.flag}</span>
          <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
        </button>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isTranslating}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
            'text-white hover:bg-white/20',
            isTranslating && 'opacity-50 cursor-wait'
          )}
        >
          <Globe size={18} />
          <span className="text-xl">{currentLanguage.flag}</span>
          <span className="text-sm font-medium hidden sm:inline">
            {currentLanguage.code.toUpperCase()}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-large overflow-hidden z-20"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                      language === lang.code
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-neutral-50 text-neutral-700'
                    )}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="flex-1 font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <Check size={18} className="text-primary-600" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className={cn(
          'flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all',
          'border border-neutral-200',
          isTranslating && 'opacity-50 cursor-wait'
        )}
      >
        <Globe size={20} className="text-primary-600" />
        <span className="text-2xl">{currentLanguage.flag}</span>
        <span className="font-medium text-neutral-900">{currentLanguage.name}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-large overflow-hidden z-20 border border-neutral-200"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                    language === lang.code
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-neutral-50 text-neutral-700'
                  )}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="flex-1 font-medium">{lang.name}</span>
                  {language === lang.code && (
                    <Check size={18} className="text-primary-600" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isTranslating && (
        <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
