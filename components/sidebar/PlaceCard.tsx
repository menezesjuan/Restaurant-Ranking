'use client';

import React from 'react';
import { Place } from '@/types/place';
import { useMapSelection } from '@/contexts/MapSelectionContext';
import { Swords, Trash2, Bookmark } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  rankNumber?: number;
  onPromoteToBeen?: (place: Place) => void;
  onRerank?: (place: Place) => void;
  onDelete?: (id: string) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  rankNumber,
  onPromoteToBeen,
  onRerank,
  onDelete,
}) => {
  const { selectedPlaceId, selectPlaceFromList, setHoveredPlaceId } = useMapSelection();
  const isSelected = selectedPlaceId === place.id;
  const isTopPick = rankNumber === 1;

  const renderPriceIndicator = (price: string) => {
    const symbol = price.includes('$') ? '$' : '£';
    const tierCount = price.length || 2;
    const maxTiers = 4;

    return (
      <div className="flex items-center gap-0.5 text-xs font-semibold select-none">
        {Array.from({ length: maxTiers }).map((_, i) => (
          <span
            key={i}
            className={
              i < tierCount
                ? 'text-[#3E423D] dark:text-[#D5DBD2]'
                : 'text-[#D0D4CF] dark:text-[#3B473F]'
            }
          >
            {symbol}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      id={`place-card-${place.id}`}
      onClick={() => selectPlaceFromList(place)}
      onMouseEnter={() => setHoveredPlaceId(place.id)}
      onMouseLeave={() => setHoveredPlaceId(null)}
      className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isTopPick
          ? 'bg-[#FBF6EB] dark:bg-[#201D16] border-[#EFE5D0] dark:border-[#3D3320] shadow-sm'
          : isSelected
          ? 'bg-white dark:bg-[#161C19] border-[#1C4434] dark:border-[#45B887] ring-2 ring-[#1C4434]/20 dark:ring-[#45B887]/30 shadow-md'
          : 'bg-white dark:bg-[#161C19] hover:bg-[#F8F8F5] dark:hover:bg-[#1B231F] border-[#EAEAE5] dark:border-[#252E28]'
      }`}
    >
      {/* Lado Esquerdo: Número do Ranking + Avatar + Informações */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Número do Ranking */}
        {rankNumber ? (
          <span className="font-serif text-lg font-bold text-[#1C4434] dark:text-[#45B887] w-5 text-center shrink-0">
            {rankNumber}
          </span>
        ) : (
          <Bookmark className="w-4 h-4 text-[#C88A35] shrink-0 ml-1" />
        )}

        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm overflow-hidden"
          style={{ backgroundColor: place.avatarBg || '#24342F' }}
        >
          {place.avatarText || place.name.substring(0, 2).toUpperCase()}
        </div>

        {/* Informações: Nome, Culinária e Bairro */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-[#181816] dark:text-[#F0F2EE] truncate group-hover:text-[#1C4434] dark:group-hover:text-[#45B887] transition-colors">
              {place.name}
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#ECECE6] dark:bg-[#232D27] text-[#555A54] dark:text-[#AAB2A8] shrink-0">
              {place.cuisine}
            </span>
          </div>

          <p className="text-xs text-[#71716A] dark:text-[#8E968E] truncate mt-0.5">
            {place.neighborhood || place.address.split(',')[0]}
            {typeof place.timesVisited === 'number' && place.timesVisited > 0 && (
              <span> • been {place.timesVisited}x</span>
            )}
          </p>
        </div>
      </div>

      {/* Lado Direito: Preço e Tag TOP PICK */}
      <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
        {renderPriceIndicator(place.priceRange)}

        {isTopPick && (
          <span className="text-[10px] font-black tracking-wider text-[#C88A35] dark:text-[#E2A64D] uppercase">
            TOP PICK
          </span>
        )}

        {/* Ações em hover */}
        <div
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity pt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {place.status === 'WANT_TO_TRY' && onPromoteToBeen && (
            <button
              onClick={() => onPromoteToBeen(place)}
              className="px-2 py-0.5 rounded bg-[#1C4434] dark:bg-[#256149] text-white text-[10px] font-medium"
              title="Disputar duelo de ranking"
            >
              Duelo
            </button>
          )}

          {place.status === 'BEEN' && onRerank && (
            <button
              onClick={() => onRerank(place)}
              className="p-1 rounded text-[#71716A] hover:text-[#1C4434] dark:hover:text-[#45B887]"
              title="Re-ranquear restaurante"
            >
              <Swords className="w-3 h-3" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(place.id)}
              className="p-1 rounded text-[#71716A] hover:text-rose-500"
              title="Remover"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
