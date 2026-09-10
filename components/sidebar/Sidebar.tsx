'use client';

import React, { useMemo } from 'react';
import { usePlaces } from '@/contexts/PlacesContext';
import { PlaceCard } from './PlaceCard';
import { Place } from '@/types/place';
import { Compass, Plus } from 'lucide-react';

interface SidebarProps {
  onOpenAddModal: () => void;
  onOpenDeciderModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenAddModal,
  onOpenDeciderModal,
}) => {
  const {
    places,
    rankedPlaces,
    wantToTryPlaces,
    filteredRankedPlaces,
    filteredWantToTryPlaces,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    startComparison,
    deletePlace,
  } = usePlaces();

  // Culinárias disponíveis para os chips superiores
  const cuisineChips = useMemo(() => {
    const list = ['All', 'British', 'Spanish', 'Italian', 'European', 'Indian', 'Basque', 'Punjabi', 'Taiwanese'];
    return list;
  }, []);

  const currentList = activeTab === 'RANKED' ? filteredRankedPlaces : filteredWantToTryPlaces;

  const handlePromoteToBeen = (place: Place) => {
    startComparison(place);
  };

  const handleRerank = (place: Place) => {
    startComparison(place);
  };

  return (
    <aside className="w-full h-full flex flex-col bg-[#FAFAF8] border-r border-[#EAEAE5] text-[#191917] overflow-hidden select-none">
      {/* Header Superior da Sidebar fiel ao layout da imagem */}
      <div className="pt-6 px-6 pb-2 space-y-3 shrink-0">
        {/* Badge London + Contador */}
        <div className="flex items-center gap-2 text-xs text-[#71716A]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E4E4DC] font-medium text-[#2E332E]">
            <span className="w-2 h-2 rounded-full bg-[#1C4434]"></span>
            London
          </span>
          <span className="font-normal text-[#8A8A80]">
            {places.length} places • {rankedPlaces.length} ranked
          </span>
        </div>

        {/* Título com Serifa Editorial */}
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#141814]">
            Your top tables
          </h1>
          <p className="text-xs text-[#6B7068] mt-1 leading-relaxed max-w-sm">
            Ranked head-to-head, so your #3 really is better than your #4 — no five-star mush.
          </p>
        </div>

        {/* Abas: Ranked X vs Want to try Y */}
        <div className="flex items-center gap-6 pt-3 border-b border-[#E8E8DF]">
          <button
            onClick={() => setActiveTab('RANKED')}
            className={`pb-2.5 text-sm font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'RANKED'
                ? 'text-[#141814] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#1C4434]'
                : 'text-[#8A8A80] hover:text-[#141814]'
            }`}
          >
            <span>Ranked</span>
            <span className="text-xs font-normal text-[#8A8A80]">{rankedPlaces.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('WANT_TO_TRY')}
            className={`pb-2.5 text-sm font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'WANT_TO_TRY'
                ? 'text-[#141814] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#1C4434]'
                : 'text-[#8A8A80] hover:text-[#141814]'
            }`}
          >
            <span>Want to try</span>
            <span className="text-xs font-normal text-[#8A8A80]">{wantToTryPlaces.length}</span>
          </button>

          {/* Botão Decisor rápido embutido discretamente */}
          <button
            onClick={onOpenDeciderModal}
            className="ml-auto mb-2 text-xs text-[#1C4434] hover:underline flex items-center gap-1 font-semibold"
            title="Decisor rápido: onde comer hoje?"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Decisor Rápido</span>
          </button>
        </div>

        {/* Chips de Culinária em Carrossel Horizontal */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
          {cuisineChips.map((c) => {
            const isSelected = (c === 'All' && !filters.cuisine) || filters.cuisine === c;
            return (
              <button
                key={c}
                onClick={() => setFilters((prev) => ({ ...prev, cuisine: c === 'All' ? '' : c }))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1C4434] text-white shadow-sm'
                    : 'bg-[#EFEFEA] hover:bg-[#E5E5DE] text-[#434842]'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listagem de Cards de Restaurante com Rolagem Suave */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2.5">
        {currentList.length === 0 ? (
          <div className="py-16 text-center text-[#8A8A80] space-y-2">
            <p className="text-sm font-semibold text-[#454A44]">No places found</p>
            <p className="text-xs">Adjust your search or category filters above.</p>
          </div>
        ) : (
          currentList.map((place, index) => (
            <PlaceCard
              key={place.id}
              place={place}
              rankNumber={activeTab === 'RANKED' ? index + 1 : undefined}
              onPromoteToBeen={handlePromoteToBeen}
              onRerank={handleRerank}
              onDelete={deletePlace}
            />
          ))
        )}
      </div>
    </aside>
  );
};
