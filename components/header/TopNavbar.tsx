'use client';

import React from 'react';
import { Search, Moon, RotateCcw, Plus, X } from 'lucide-react';
import { usePlaces } from '@/contexts/PlacesContext';

interface TopNavbarProps {
  onOpenAddModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenAddModal }) => {
  const { filters, setFilters, resetToLondonMock } = usePlaces();

  return (
    <header className="w-full h-16 bg-white border-b border-[#EAEAE5] px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Logo com serifa idêntico à imagem */}
      <div className="flex items-center">
        <span className="font-serif text-2xl font-bold tracking-tight text-[#141814]">
          Tastemap<span className="text-[#1C4434]">.</span>
        </span>
      </div>

      {/* Ações da direita */}
      <div className="flex items-center gap-3">
        {/* Campo de Busca em Pílula */}
        <div className="relative w-56 sm:w-72">
          <input
            type="text"
            placeholder="Search your places"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-[#EFF3F0] border-none rounded-full pl-9 pr-8 py-2 text-xs sm:text-sm text-[#191917] placeholder-[#76847D] focus:outline-none focus:ring-2 focus:ring-[#1C4434]/30 transition-all"
          />
          <Search className="w-4 h-4 text-[#76847D] absolute left-3 top-2.5" />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-2.5 text-[#76847D] hover:text-[#191917]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botão Tema / Lua */}
        <button
          className="w-9 h-9 rounded-full bg-[#F4F4F0] hover:bg-[#EAEAE5] flex items-center justify-center text-[#555A54] transition-colors"
          title="Modo Escuro / Claro"
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* Botão Resetar Lugares */}
        <button
          onClick={resetToLondonMock}
          className="w-9 h-9 rounded-full bg-[#F4F4F0] hover:bg-[#EAEAE5] flex items-center justify-center text-[#555A54] transition-colors"
          title="Restaurar dados de Londres"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Botão + Add a place */}
        <button
          onClick={onOpenAddModal}
          className="h-9 px-4 rounded-full bg-[#1C4434] hover:bg-[#153629] active:scale-95 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add a place</span>
        </button>
      </div>
    </header>
  );
};
