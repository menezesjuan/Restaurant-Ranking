'use client';

import React, { useMemo } from 'react';
import { usePlaces } from '@/contexts/PlacesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlaceCard } from './PlaceCard';
import { Place } from '@/types/place';
import { Compass } from 'lucide-react';

interface SidebarProps {
  onOpenAddModal: () => void;
  onOpenDeciderModal: () => void;
  onInspectPlace?: (place: Place) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenDeciderModal,
  onInspectPlace,
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
  const { t } = useLanguage();

  const cuisineChips = useMemo(() => {
    return ['All', 'British', 'Spanish', 'Italian', 'European', 'Indian', 'Basque', 'Punjabi', 'Taiwanese'];
  }, []);

  const currentList = activeTab === 'RANKED' ? filteredRankedPlaces : filteredWantToTryPlaces;

  const handlePromoteToBeen = (place: Place) => {
    startComparison(place);
  };

  const handleRerank = (place: Place) => {
    startComparison(place);
  };

  return (
    <aside className="w-full h-full flex flex-col bg-[#FAFAF8] dark:bg-[#121614] border-r border-[#EAEAE5] dark:border-[#222924] text-[#191917] dark:text-[#F0F2EE] overflow-hidden select-none transition-colors">
      {/* Header Superior da Sidebar */}
      <div className="pt-6 px-6 pb-2 space-y-3 shrink-0">
        {/* Badge London + Contador */}
        <div className="flex items-center gap-2 text-xs text-[#71716A] dark:text-[#8E968E]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#1A211D] border border-[#E4E4DC] dark:border-[#2A342E] font-medium text-[#2E332E] dark:text-[#CAD1C8]">
            <span className="w-2 h-2 rounded-full bg-[#1C4434] dark:bg-[#45B887]"></span>
            {t('sidebar.location')}
          </span>
          <span className="font-normal text-[#8A8A80] dark:text-[#7A847A]">
            {t('sidebar.placesCount', { places: places.length, ranked: rankedPlaces.length })}
          </span>
        </div>

        {/* Título com Serifa Editorial */}
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#141814] dark:text-[#F0F2EE]">
            {t('sidebar.title')}
          </h1>
          <p className="text-xs text-[#6B7068] dark:text-[#9DA49B] mt-1 leading-relaxed max-w-sm">
            {t('sidebar.subtitle')}
          </p>
        </div>

        {/* Abas: Ranked X vs Want to try Y */}
        <div className="flex items-center gap-6 pt-3 border-b border-[#E8E8DF] dark:border-[#222924]">
          <button
            onClick={() => setActiveTab('RANKED')}
            className={`pb-2.5 text-sm font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'RANKED'
                ? 'text-[#141814] dark:text-[#F0F2EE] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#1C4434] dark:after:bg-[#45B887]'
                : 'text-[#8A8A80] dark:text-[#7A847A] hover:text-[#141814] dark:hover:text-[#F0F2EE]'
            }`}
          >
            <span>{t('sidebar.tabRanked')}</span>
            <span className="text-xs font-normal text-[#8A8A80] dark:text-[#7A847A]">{rankedPlaces.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('WANT_TO_TRY')}
            className={`pb-2.5 text-sm font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'WANT_TO_TRY'
                ? 'text-[#141814] dark:text-[#F0F2EE] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#1C4434] dark:after:bg-[#45B887]'
                : 'text-[#8A8A80] dark:text-[#7A847A] hover:text-[#141814] dark:hover:text-[#F0F2EE]'
            }`}
          >
            <span>{t('sidebar.tabWantToTry')}</span>
            <span className="text-xs font-normal text-[#8A8A80] dark:text-[#7A847A]">{wantToTryPlaces.length}</span>
          </button>

          {/* Seletor de Raio de Distância */}
          <div className="ml-auto mb-2 flex items-center gap-2">
            <select
              value={filters.maxDistanceKm ?? ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxDistanceKm: e.target.value ? parseFloat(e.target.value) : null,
                }))
              }
              className="text-[11px] bg-transparent text-[#71716A] dark:text-[#8E968E] border border-[#E0E0D8] dark:border-[#2C3730] rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
              title={t('sidebar.filterDistance')}
            >
              <option value="">{t('sidebar.allLondon')}</option>
              <option value="2">≤ 2 km</option>
              <option value="4">≤ 4 km</option>
              <option value="8">≤ 8 km</option>
            </select>

            {/* Botão Decisor rápido */}
            <button
              onClick={onOpenDeciderModal}
              className="text-xs text-[#1C4434] dark:text-[#45B887] hover:underline flex items-center gap-1 font-semibold"
              title={t('sidebar.deciderTitle')}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t('sidebar.decider')}</span>
            </button>
          </div>
        </div>

        {/* Chips de Culinária */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
          {cuisineChips.map((c) => {
            const isSelected = (c === 'All' && !filters.cuisine) || filters.cuisine === c;
            return (
              <button
                key={c}
                onClick={() => setFilters((prev) => ({ ...prev, cuisine: c === 'All' ? '' : c }))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1C4434] dark:bg-[#256149] text-white shadow-sm'
                    : 'bg-[#EFEFEA] dark:bg-[#1E2521] hover:bg-[#E5E5DE] dark:hover:bg-[#28322C] text-[#434842] dark:text-[#CAD1C8]'
                }`}
              >
                {c === 'All' ? t('sidebar.allCuisines') : c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listagem de Cards de Restaurante */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2.5">
        {currentList.length === 0 ? (
          <div className="py-16 text-center text-[#8A8A80] dark:text-[#7A847A] space-y-2">
            <p className="text-sm font-semibold text-[#454A44] dark:text-[#CAD1C8]">{t('sidebar.noPlaces')}</p>
            <p className="text-xs">{t('sidebar.noPlacesDesc')}</p>
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
              onInspect={onInspectPlace}
            />
          ))
        )}
      </div>
    </aside>
  );
};
