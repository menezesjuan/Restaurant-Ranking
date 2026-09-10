'use client';

import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, RotateCcw, Plus, X } from 'lucide-react';
import { usePlaces } from '@/contexts/PlacesContext';

interface TopNavbarProps {
  onOpenAddModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenAddModal }) => {
  const { filters, setFilters, resetToLondonMock } = usePlaces();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(hasDark);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);

    if (nextTheme) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      try {
        localStorage.setItem('tastemap_theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      try {
        localStorage.setItem('tastemap_theme', 'light');
      } catch {}
    }
  };

  return (
    <header className="w-full h-16 bg-white dark:bg-[#121614] border-b border-[#EAEAE5] dark:border-[#222924] px-6 flex items-center justify-between z-30 shrink-0 select-none transition-colors">
      {/* Logo com serifa */}
      <div className="flex items-center">
        <span className="font-serif text-2xl font-bold tracking-tight text-[#141814] dark:text-[#F0F2EE]">
          Tastemap<span className="text-[#1C4434] dark:text-[#45B887]">.</span>
        </span>
      </div>

      {/* Ações da direita */}
      <div className="flex items-center gap-3">
        {/* Campo de Busca */}
        <div className="relative w-56 sm:w-72">
          <input
            type="text"
            placeholder="Search your places"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-[#EFF3F0] dark:bg-[#1C231F] border-none rounded-full pl-9 pr-8 py-2 text-xs sm:text-sm text-[#191917] dark:text-[#E8EBE6] placeholder-[#76847D] focus:outline-none focus:ring-2 focus:ring-[#1C4434]/30 dark:focus:ring-[#45B887]/30 transition-all"
          />
          <Search className="w-4 h-4 text-[#76847D] absolute left-3 top-2.5" />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-2.5 text-[#76847D] hover:text-[#191917] dark:hover:text-[#F0F2EE]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botão Tema Dark / Light Toggle */}
        <button
          type="button"
          onClick={handleToggleTheme}
          className="w-9 h-9 rounded-full bg-[#F4F4F0] dark:bg-[#1E2521] hover:bg-[#EAEAE5] dark:hover:bg-[#28322C] flex items-center justify-center text-[#555A54] dark:text-[#B5BDB3] transition-colors cursor-pointer"
          title={mounted && isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
        >
          {mounted && isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Botão Resetar Lugares */}
        <button
          onClick={resetToLondonMock}
          className="w-9 h-9 rounded-full bg-[#F4F4F0] dark:bg-[#1E2521] hover:bg-[#EAEAE5] dark:hover:bg-[#28322C] flex items-center justify-center text-[#555A54] dark:text-[#B5BDB3] transition-colors"
          title="Restaurar dados de Londres"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Botão + Add a place */}
        <button
          onClick={onOpenAddModal}
          className="h-9 px-4 rounded-full bg-[#1C4434] dark:bg-[#245742] hover:bg-[#153629] dark:hover:bg-[#2c6950] active:scale-95 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add a place</span>
        </button>
      </div>
    </header>
  );
};
