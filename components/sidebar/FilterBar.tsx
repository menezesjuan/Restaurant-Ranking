'use client';

import React from 'react';
import { usePlaces } from '@/contexts/PlacesContext';
import { Search, X, SlidersHorizontal, Trophy, Bookmark } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    rankedPlaces,
    wantToTryPlaces,
    availableCuisines,
    availableTags,
  } = usePlaces();

  const handleClearSearch = () => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  const handleToggleTag = (tag: string) => {
    setFilters((prev) => {
      const exists = prev.selectedTags.includes(tag);
      return {
        ...prev,
        selectedTags: exists
          ? prev.selectedTags.filter((t) => t !== tag)
          : [...prev.selectedTags, tag],
      };
    });
  };

  return (
    <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60 sticky top-0 z-20 backdrop-blur-md">
      {/* Abas de alternância com contadores */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
        <button
          onClick={() => setActiveTab('RANKED')}
          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'RANKED'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Ranqueados</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'RANKED' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {rankedPlaces.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('WANT_TO_TRY')}
          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'WANT_TO_TRY'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Quero Conhecer</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'WANT_TO_TRY'
                ? 'bg-slate-950/40 text-cyan-200'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {wantToTryPlaces.length}
          </span>
        </button>
      </div>

      {/* Input de busca */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nome, culinária, endereço..."
          value={filters.searchQuery}
          onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
          className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        {filters.searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filtros em linha: Culinária e Preço */}
      <div className="flex gap-2">
        <select
          value={filters.cuisine}
          onChange={(e) => setFilters((prev) => ({ ...prev, cuisine: e.target.value }))}
          className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="">Todas as Culinárias</option>
          {availableCuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.priceRange}
          onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value }))}
          className="w-28 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="">Qualquer $</option>
          <option value="$">$ (Econômico)</option>
          <option value="$$">$$ (Médio)</option>
          <option value="$$$">$$$ (Sofisticado)</option>
          <option value="$$$$">$$$$ (Luxo)</option>
        </select>
      </div>

      {/* Tags horizontais clicáveis */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {availableTags.slice(0, 8).map((tag) => {
            const isSelected = filters.selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleToggleTag(tag)}
                className={`whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
