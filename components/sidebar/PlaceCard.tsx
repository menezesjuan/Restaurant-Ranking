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

  // Renderiza indicador de preço formatado como £ £ £ com opacidade
  const renderPriceIndicator = (price: string) => {
    const symbol = price.includes('$') ? '$' : '£';
    const tierCount = price.length || 2;
    const maxTiers = 4;

    return (
      <div className="flex items-center gap-0.5 text-xs font-semibold select-none">
        {Array.from({ length: maxTiers }).map((_, i) => (
          <span
            key={i}
            className={i < tierCount ? 'text-[#3E423D]' : 'text-[#D0D4CF]'}
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
          ? 'bg-[#FBF6EB] border-[#EFE5D0] shadow-sm'
          : isSelected
          ? 'bg-white border-[#1C4434] ring-2 ring-[#1C4434]/20 shadow-md'
          : 'bg-white hover:bg-[#F8F8F5] border-[#EAEAE5]'
      }`}
    >
      {/* Lado Esquerdo: Número do Ranking + Avatar + Informações */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Número do Ranking */}
        {rankNumber ? (
          <span className="font-serif text-lg font-bold text-[#1C4434] w-5 text-center shrink-0">
            {rankNumber}
          </span>
        ) : (
          <Bookmark className="w-4 h-4 text-[#C88A35] shrink-0 ml-1" />
        )}

        {/* Avatar / Logo estilizado do Restaurante */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm overflow-hidden"
          style={{ backgroundColor: place.avatarBg || '#24342F' }}
        >
          {place.avatarText || place.name.substring(0, 2).toUpperCase()}
        </div>

        {/* Informações: Nome, Culinária e Bairro/Visitas */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-[#181816] truncate group-hover:text-[#1C4434] transition-colors">
              {place.name}
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#ECECE6] text-[#555A54] shrink-0">
              {place.cuisine}
            </span>
          </div>

          <p className="text-xs text-[#71716A] truncate mt-0.5">
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
          <span className="text-[10px] font-black tracking-wider text-[#C88A35] uppercase">
            TOP PICK
          </span>
        )}

        {/* Ações contextuais em hover */}
        <div
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity pt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {place.status === 'WANT_TO_TRY' && onPromoteToBeen && (
            <button
              onClick={() => onPromoteToBeen(place)}
              className="px-2 py-0.5 rounded bg-[#1C4434] text-white text-[10px] font-medium"
              title="Disputar duelo de ranking"
            >
              Duelo
            </button>
          )}

          {place.status === 'BEEN' && onRerank && (
            <button
              onClick={() => onRerank(place)}
              className="p-1 rounded text-[#71716A] hover:text-[#1C4434]"
              title="Re-ranquear restaurante"
            >
              <Swords className="w-3 h-3" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(place.id)}
              className="p-1 rounded text-[#71716A] hover:text-rose-600"
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
