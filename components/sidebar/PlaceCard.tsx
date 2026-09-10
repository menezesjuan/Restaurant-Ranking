'use client';

import React from 'react';
import { Place } from '@/types/place';
import { useMapSelection } from '@/contexts/MapSelectionContext';
import {
  MapPin,
  Trophy,
  Bookmark,
  Swords,
  Trash2,
  Tag,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

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
  const isBeen = place.status === 'BEEN';

  // Badge do ranking com estilo especial para top 3
  const renderRankBadge = () => {
    if (!rankNumber) return null;

    if (rankNumber === 1) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20">
          <Trophy className="w-3.5 h-3.5" /> #1 Top Escolha
        </span>
      );
    }
    if (rankNumber === 2) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-xs bg-gradient-to-r from-slate-300 to-slate-400 text-slate-950 shadow-sm">
          #2 Prata
        </span>
      );
    }
    if (rankNumber === 3) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-xs bg-gradient-to-r from-amber-700 to-orange-700 text-white shadow-sm">
          #3 Bronze
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-lg font-bold text-xs bg-slate-800 text-slate-300 border border-slate-700">
        #{rankNumber}
      </span>
    );
  };

  return (
    <div
      id={`place-card-${place.id}`}
      onClick={() => selectPlaceFromList(place)}
      onMouseEnter={() => setHoveredPlaceId(place.id)}
      onMouseLeave={() => setHoveredPlaceId(null)}
      className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
        isSelected
          ? 'bg-slate-800/95 border-amber-500 ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/10 scale-[1.01]'
          : 'bg-slate-800/60 hover:bg-slate-800/90 border-slate-700/80 hover:border-slate-600 shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isBeen ? (
            renderRankBadge()
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
              <Bookmark className="w-3 h-3" /> Quero Conhecer
            </span>
          )}
          <span className="text-xs font-bold text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/60">
            {place.priceRange}
          </span>
        </div>

        {/* Culinária */}
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300">
          {place.cuisine}
        </span>
      </div>

      {/* Nome e Endereço */}
      <div>
        <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
          {place.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{place.address}</span>
        </p>
      </div>

      {/* Notas */}
      {place.notes && (
        <p className="text-xs text-slate-300 italic mt-2.5 bg-slate-900/50 p-2 rounded-xl border border-slate-800/80 line-clamp-2">
          &quot;{place.notes}&quot;
        </p>
      )}

      {/* Tags */}
      {place.tags && place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {place.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800"
            >
              {tag}
            </span>
          ))}
          {place.tags.length > 4 && (
            <span className="text-[10px] text-slate-500 px-1">+{place.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Ações contextuais */}
      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
          Clique para ver no mapa
        </span>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {!isBeen && onPromoteToBeen && (
            <button
              onClick={() => onPromoteToBeen(place)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm transition-colors"
              title="Marcar como visitado e disputar duelo de ranking"
            >
              <Swords className="w-3 h-3" />
              <span>Experimentei</span>
            </button>
          )}

          {isBeen && onRerank && (
            <button
              onClick={() => onRerank(place)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-700 transition-colors"
              title="Refazer comparações head-to-head para este restaurante"
            >
              <Swords className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(place.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
              title="Remover restaurante"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
