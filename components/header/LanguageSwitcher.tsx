'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { ChevronDown } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: Array<{ code: Language; label: string; flag: string }> = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
  ];

  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botão de alternância com a bandeirinha no canto superior direito */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-9 px-2.5 rounded-full bg-[#F4F4F0] dark:bg-[#1E2521] hover:bg-[#EAEAE5] dark:hover:bg-[#28322C] flex items-center gap-1.5 text-xs font-semibold text-[#3C423C] dark:text-[#D5DBD2] transition-colors cursor-pointer border border-transparent hover:border-[#D5D5CE] dark:hover:border-[#333E36] select-none"
        title={t('language.switchTo')}
        aria-label={t('language.switchTo')}
      >
        <span className="text-base leading-none" role="img" aria-label={current.label}>
          {current.flag}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">
          {current.code === 'pt-BR' ? 'PT' : 'EN'}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[#76847D] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menu dropdown com as opções */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white dark:bg-[#18201C] border border-[#EAEAE5] dark:border-[#26312B] shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#8A8A80] dark:text-[#7A847A] border-b border-[#EFEFEA] dark:border-[#222A25] mb-1">
            {t('language.switchTo')}
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#EFF5F1] dark:bg-[#1E2A23] text-[#1C4434] dark:text-[#45B887] font-bold'
                    : 'text-[#2C312C] dark:text-[#E0E6DD] hover:bg-[#F6F6F2] dark:hover:bg-[#202722]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1C4434] dark:bg-[#45B887]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
