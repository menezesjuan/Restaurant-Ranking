'use client';

import React, { useState } from 'react';
import { Place } from '@/types/place';
import {
  X,
  MapPin,
  Swords,
  Trophy,
  Bookmark,
  Calendar,
  Tag,
  Edit3,
  Check,
  Trash2,
} from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  rankNumber?: number;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Place>) => void;
  onRerank: (place: Place) => void;
  onDelete: (id: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  rankNumber,
  onClose,
  onUpdate,
  onRerank,
  onDelete,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(place?.notes || '');

  if (!place) return null;

  const isBeen = place.status === 'BEEN';

  const handleSaveNotes = () => {
    onUpdate(place.id, { notes: notes.trim() });
    setIsEditingNotes(false);
  };

  const handleIncrementVisits = () => {
    const current = place.timesVisited || 1;
    onUpdate(place.id, { timesVisited: current + 1 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#141A17] border border-[#EAEAE5] dark:border-[#222924] rounded-3xl shadow-2xl overflow-hidden text-[#191917] dark:text-[#F0F2EE] flex flex-col max-h-[90vh]">
        {/* Header com cor de fundo do avatar */}
        <div
          className="p-6 text-white relative flex items-start justify-between"
          style={{ backgroundColor: place.avatarBg || '#1C4434' }}
        >
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider">
                {place.cuisine}
              </span>
              {isBeen && rankNumber && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Rank #{rankNumber}
                </span>
              )}
              <span className="text-xs font-bold text-white/90">{place.priceRange}</span>
            </div>

            <h2 className="font-serif text-2xl font-bold tracking-tight text-white mt-1">
              {place.name}
            </h2>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{place.address}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Estatísticas de Visitas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#F8F8F5] dark:bg-[#1B221E] border border-[#EAEAE5] dark:border-[#252E28]">
              <span className="text-[11px] text-[#71716A] dark:text-[#8E968E] font-medium block">
                Status
              </span>
              <span className="font-bold text-sm text-[#141814] dark:text-[#E8EBE6] flex items-center gap-1.5 mt-0.5">
                {isBeen ? (
                  <>
                    <Trophy className="w-3.5 h-3.5 text-[#1C4434] dark:text-[#45B887]" /> Been (Ranked)
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-[#C88A35]" /> Want to try
                  </>
                )}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F8F5] dark:bg-[#1B221E] border border-[#EAEAE5] dark:border-[#252E28] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#71716A] dark:text-[#8E968E] font-medium block">
                  Times Visited
                </span>
                <span className="font-bold text-sm text-[#141814] dark:text-[#E8EBE6] mt-0.5 block">
                  {place.timesVisited || (isBeen ? 1 : 0)}x
                </span>
              </div>
              {isBeen && (
                <button
                  onClick={handleIncrementVisits}
                  className="px-2 py-1 rounded-lg bg-[#EAEAE5] dark:bg-[#28322C] hover:bg-[#DCDCD5] text-xs font-bold"
                  title="Registrar mais uma visita"
                >
                  +1
                </button>
              )}
            </div>
          </div>

          {/* Notas do Restaurante com edição em linha */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#555A54] dark:text-[#8E968E]">
                Personal Notes & Standout Dishes
              </span>
              {!isEditingNotes ? (
                <button
                  onClick={() => {
                    setNotes(place.notes || '');
                    setIsEditingNotes(true);
                  }}
                  className="text-xs text-[#1C4434] dark:text-[#45B887] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="text-xs text-[#1C4434] dark:text-[#45B887] hover:underline flex items-center gap-1 font-bold"
                >
                  <Check className="w-3 h-3" /> Save
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FBFBF9] dark:bg-[#1B221E] border border-[#DCDCD5] dark:border-[#2C3730] text-xs text-[#141814] dark:text-[#E8EBE6] focus:outline-none focus:ring-2 focus:ring-[#1C4434]/30"
              />
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#F8F8F5] dark:bg-[#1B221E] border border-[#EAEAE5] dark:border-[#252E28] text-xs text-[#555A54] dark:text-[#B0B8AF] italic leading-relaxed">
                {place.notes ? `"${place.notes}"` : 'No notes added yet for this table.'}
              </div>
            )}
          </div>

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#555A54] dark:text-[#8E968E]">
                Tags & Vibes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#EFEFEA] dark:bg-[#232D27] text-[#434842] dark:text-[#CAD1C8] border border-[#E2E2D8] dark:border-[#2F3C34] flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5 opacity-60" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ações principais */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onRerank(place);
              }}
              className="flex-1 py-3 px-4 rounded-full font-bold text-xs sm:text-sm bg-[#1C4434] dark:bg-[#245742] hover:bg-[#153629] text-white shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Swords className="w-4 h-4" />
              <span>{isBeen ? 'Rerank Head-to-Head' : 'Rank This Table Now'}</span>
            </button>

            <button
              onClick={() => {
                onDelete(place.id);
                onClose();
              }}
              className="p-3 rounded-full bg-[#F4F4F0] dark:bg-[#222B25] hover:bg-rose-100 hover:text-rose-700 text-[#71716A] transition-colors"
              title="Delete Place"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
