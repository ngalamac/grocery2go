import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred_language');
    return (saved === 'fr' ? 'fr' : 'en') as Language;
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = (lang: Language) => {
    setIsTranslating(true);
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);

    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;

    if (selectElement) {
      if (lang === 'fr') {
        selectElement.value = 'fr';
      } else {
        selectElement.value = 'en';
      }
      selectElement.dispatchEvent(new Event('change'));

      setTimeout(() => {
        setIsTranslating(false);
      }, 1000);
    } else {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    const checkAndApplyLanguage = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;

      if (selectElement && language === 'fr') {
        selectElement.value = 'fr';
        selectElement.dispatchEvent(new Event('change'));
      }
    };

    const timer = setTimeout(checkAndApplyLanguage, 1000);
    const interval = setInterval(() => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        clearInterval(interval);
        checkAndApplyLanguage();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};
