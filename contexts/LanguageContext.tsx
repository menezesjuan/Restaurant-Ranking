'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TranslationKey, getTranslation } from '@/lib/i18n/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Inicializa o idioma persistido do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tastemap_language') as Language | null;
      if (saved === 'en' || saved === 'pt-BR') {
        setLanguageState(saved);
      }
    } catch {}
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('tastemap_language', newLang);
    } catch {}
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === 'en' ? 'pt-BR' : 'en';
      try {
        localStorage.setItem('tastemap_language', next);
      } catch {}
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      return getTranslation(language, key, params);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser utilizado dentro de um LanguageProvider');
  }
  return context;
};
