import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TRANSLATIONS, TranslationDictionary } from '../data/translations';
import { ValveProduct, ValveCharacteristics, SupportedLanguage } from '../types/valve';
import { translateTechString, getLocalizedCharacteristics, getLocalizedProduct } from '../utils/engineeringTranslator';

interface LocalizationContextType {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  toggleLang: () => void;
  t: TranslationDictionary;
  translate: (textVi?: string, textEn?: string) => string;
  localizeProduct: (product: ValveProduct) => ValveProduct;
  localizeCharacteristics: (char?: ValveCharacteristics) => ValveCharacteristics | undefined;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode; initialLang?: SupportedLanguage }> = ({ 
  children,
  initialLang = 'vi'
}) => {
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('industra_lang_preference') as SupportedLanguage;
      if (saved && ['vi', 'en', 'th', 'zh', 'pt', 'ar'].includes(saved)) return saved;
    } catch {
      // ignore
    }
    return initialLang;
  });

  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem('industra_lang_preference', newLang);
      document.documentElement.lang = newLang;
      if (newLang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [lang]);

  const value: LocalizationContextType = {
    lang,
    setLang,
    toggleLang,
    t: TRANSLATIONS[lang],
    translate: (textVi, textEn) => translateTechString(textVi, textEn, lang),
    localizeProduct: (prod) => getLocalizedProduct(prod, lang),
    localizeCharacteristics: (char) => getLocalizedCharacteristics(char, lang),
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
