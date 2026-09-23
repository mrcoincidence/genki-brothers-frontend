// app/components/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'JP';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('EN');

  useEffect(() => {
    // Cookie または LocalStorage から保持された言語設定を読み込む
    const savedCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('gb_lang='))
      ?.split('=')[1] as Language | undefined;

    if (savedCookie === 'JP' || savedCookie === 'EN') {
      setLangState(savedCookie);
    } else {
      const savedLocal = localStorage.getItem('gb_lang') as Language | undefined;
      if (savedLocal === 'JP' || savedLocal === 'EN') {
        setLangState(savedLocal);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    // 1年間有効なクッキー & ローカルストレージに保存
    document.cookie = `gb_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem('gb_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}