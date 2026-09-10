'use client';

import React from 'react';
import { usePlaces } from '@/contexts/PlacesContext';
import { FilterBar } from './FilterBar';
import { PlaceCard } from './PlaceCard';
import { Place } from '@/types/place';
import {
  UtensilsCrossed,
  Plus,
  Compass,
  RotateCcw,
  Sparkles,
  MapPin,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  onOpenAddModal: () => void;
  onOpenDeciderModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenAddModal,
  onOpenDeciderModal,
}) => {
  const {
    activeTab,
    filteredRankedPlaces,
    filteredWantToTryPlaces,
    startComparison,
    deletePlace,
    resetToLondonMock,
  } = usePlaces();

  const currentList = activeTab === 'RANKED' ? filteredRankedPlaces : filteredWantToTryPlaces;

  const handlePromoteToBeen = (place: Place) => {
    // Ao promover de WANT_TO_TRY para BEEN, dispara o duelo head-to-head!
    startComparison(place);
  };

  const handleRerank = (place: Place) => {
    startComparison(place);
  };

  return (
    <aside className="w-full h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-100 overflow-hidden select-none">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
              Tastemap
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Londres
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Ranking Head-to-Head & Mapa</p>
          </div>
        </div>

        {/* Ações principais */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenDeciderModal}
            className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all"
            title="Decisor Rápido: Onde vamos comer hoje?"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={resetToLondonMock}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            title="Restaurar dados de demonstração de Londres"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="py-1.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Abas */}
      <FilterBar />

      {/* Listagem de Restaurantes com Rolagem Independente */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {currentList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm text-slate-300">Nenhum restaurante encontrado</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Tente ajustar seus termos de busca ou filtros selecionados acima.
            </p>
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

      {/* Barra inferior informativa */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>{currentList.length} locais listados</span>
        <span className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3 h-3 text-amber-400" /> Posição fracionária $O(1)$
        </span>
      </div>
    </aside>
  );
};
