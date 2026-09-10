'use client';

import React, { useState, useMemo } from 'react';
import { Place } from '@/types/place';
import { useLanguage } from '@/contexts/LanguageContext';
import { Compass, Sparkles, Trophy, X, MapPin, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeciderModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  onSelectPlaceOnMap: (place: Place) => void;
}

type Stage = 'FILTER' | 'TOURNAMENT' | 'WINNER';

export const DeciderModal: React.FC<DeciderModalProps> = ({
  isOpen,
  onClose,
  places,
  onSelectPlaceOnMap,
}) => {
  const { t } = useLanguage();
  const [stage, setStage] = useState<Stage>('FILTER');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<'ALL' | 'WANT_TO_TRY' | 'BEEN'>('ALL');
  const [tournamentPool, setTournamentPool] = useState<Place[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const [winnersOfCurrentRound, setWinnersOfCurrentRound] = useState<Place[]>([]);
  const [finalWinner, setFinalWinner] = useState<Place | null>(null);

  const cuisines = useMemo(() => {
    const set = new Set<string>();
    places.forEach((p) => p.cuisine && set.add(p.cuisine));
    return Array.from(set).sort();
  }, [places]);

  const filteredCandidates = useMemo(() => {
    return places.filter((p) => {
      if (selectedScope !== 'ALL' && p.status !== selectedScope) return false;
      if (selectedCuisine && p.cuisine !== selectedCuisine) return false;
      return true;
    });
  }, [places, selectedScope, selectedCuisine]);

  const startTournament = () => {
    if (filteredCandidates.length < 2) return;
    const shuffled = [...filteredCandidates].sort(() => Math.random() - 0.5);
    const count = shuffled.length >= 8 ? 8 : shuffled.length >= 4 ? 4 : 2;
    const pool = shuffled.slice(0, count);

    setTournamentPool(pool);
    setCurrentMatchIndex(0);
    setWinnersOfCurrentRound([]);
    setFinalWinner(null);
    setStage('TOURNAMENT');
  };

  const handleVoteMatch = (winner: Place) => {
    const nextWinners = [...winnersOfCurrentRound, winner];
    const nextMatchIdx = currentMatchIndex + 2;

    if (nextMatchIdx < tournamentPool.length) {
      setWinnersOfCurrentRound(nextWinners);
      setCurrentMatchIndex(nextMatchIdx);
    } else {
      if (nextWinners.length === 1) {
        setFinalWinner(nextWinners[0]);
        setStage('WINNER');
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#1C4434', '#C88A35', '#EAEAE5', '#141814'],
          });
        } catch {}
      } else {
        setTournamentPool(nextWinners);
        setCurrentMatchIndex(0);
        setWinnersOfCurrentRound([]);
      }
    }
  };

  const handleReset = () => {
    setStage('FILTER');
    setFinalWinner(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAFAF8] dark:bg-[#141A17] border border-[#EAEAE5] dark:border-[#222924] rounded-3xl shadow-2xl overflow-hidden text-[#191917] dark:text-[#F0F2EE] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAEAE5] dark:border-[#222924] flex items-center justify-between bg-white dark:bg-[#18201B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C4434] text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#141814] dark:text-white flex items-center gap-2">
                {t('decider.modalTitle')}
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#EFF5F1] dark:bg-[#1E2922] text-[#1C4434] dark:text-[#45B887] border border-[#D2E2D6] dark:border-[#2A3B31]">
                  {t('decider.quickDecider')}
                </span>
              </h2>
              <p className="text-xs text-[#71716A] dark:text-[#8E968E]">
                {t('decider.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71716A] hover:text-[#141814] dark:hover:text-white hover:bg-[#EAEAE5] dark:hover:bg-[#252E28] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {stage === 'FILTER' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555A54] dark:text-[#A8B2A6] mb-2">
                    {t('decider.scope')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'ALL', label: t('decider.allPlaces') },
                      { key: 'WANT_TO_TRY', label: t('decider.wantToTry') },
                      { key: 'BEEN', label: t('decider.beenRanked') },
                    ].map((scope) => (
                      <button
                        key={scope.key}
                        onClick={() => setSelectedScope(scope.key as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedScope === scope.key
                            ? 'bg-[#1C4434] dark:bg-[#256149] text-white border-[#1C4434] shadow-sm'
                            : 'bg-white dark:bg-[#1A211D] text-[#555A54] dark:text-[#CAD1C8] border-[#EAEAE5] dark:border-[#28332B] hover:bg-[#F4F4F0] dark:hover:bg-[#222B24]'
                        }`}
                      >
                        {scope.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555A54] dark:text-[#A8B2A6] mb-2">
                    {t('decider.cuisinePreference')}
                  </label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A211D] border border-[#E0E0D8] dark:border-[#28332B] rounded-xl px-3 py-2 text-sm text-[#141814] dark:text-[#E8EBE6] focus:outline-none focus:ring-2 focus:ring-[#1C4434]/30"
                  >
                    <option value="">{t('decider.anyCuisine', { count: cuisines.length })}</option>
                    {cuisines.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A211D] border border-[#EAEAE5] dark:border-[#28332B] flex items-center justify-between">
                <span className="text-xs text-[#555A54] dark:text-[#8E968E]">
                  {t('decider.eligible')}
                </span>
                <span className="text-xs font-bold text-[#1C4434] dark:text-[#45B887]">
                  {t('decider.optionsCount', { count: filteredCandidates.length })}
                </span>
              </div>

              <button
                disabled={filteredCandidates.length < 2}
                onClick={startTournament}
                className="w-full py-3 px-4 rounded-full font-bold text-sm bg-[#1C4434] dark:bg-[#256149] hover:bg-[#153629] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-[#1C4434]/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {filteredCandidates.length < 2
                    ? t('decider.selectMin')
                    : t('decider.startTournament')}
                </span>
              </button>
            </div>
          )}

          {stage === 'TOURNAMENT' && tournamentPool.length >= 2 && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="font-serif text-sm font-bold text-[#1C4434] dark:text-[#45B887]">
                  {t('decider.cravingQuestion')}
                </span>
                <p className="text-xs text-[#71716A] dark:text-[#8E968E] mt-0.5">
                  {t('decider.knockoutRound', { round: currentMatchIndex / 2 + 1 })}
                </p>
              </div>

              {(() => {
                const p1 = tournamentPool[currentMatchIndex];
                const p2 = tournamentPool[currentMatchIndex + 1];
                if (!p1 || !p2) return null;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleVoteMatch(p1)}
                      className="group p-5 rounded-2xl bg-white dark:bg-[#1A211D] hover:bg-[#FBFBF9] dark:hover:bg-[#222B24] border-2 border-[#EAEAE5] dark:border-[#2A362F] hover:border-[#1C4434] dark:hover:border-[#45B887] transition-all text-left flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#EFF5F1] dark:bg-[#222F26] text-[#1C4434] dark:text-[#45B887]">
                            {p1.cuisine}
                          </span>
                          <span className="text-xs font-bold text-[#555A54] dark:text-[#A8B2A6]">{p1.priceRange}</span>
                        </div>
                        <h4 className="font-serif text-xl font-bold text-[#141814] dark:text-white group-hover:text-[#1C4434] dark:group-hover:text-[#45B887]">
                          {p1.name}
                        </h4>
                        <p className="text-xs text-[#71716A] dark:text-[#8E968E] mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#1C4434] dark:text-[#45B887]" /> {p1.neighborhood || p1.address}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#F0F0EA] dark:border-[#252E28] flex items-center justify-between text-xs text-[#1C4434] dark:text-[#45B887] font-bold">
                        <span>{t('decider.choose', { name: p1.name })}</span>
                        <span>→</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleVoteMatch(p2)}
                      className="group p-5 rounded-2xl bg-white dark:bg-[#1A211D] hover:bg-[#FBFBF9] dark:hover:bg-[#222B24] border-2 border-[#EAEAE5] dark:border-[#2A362F] hover:border-[#1C4434] dark:hover:border-[#45B887] transition-all text-left flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#EFF5F1] dark:bg-[#222F26] text-[#1C4434] dark:text-[#45B887]">
                            {p2.cuisine}
                          </span>
                          <span className="text-xs font-bold text-[#555A54] dark:text-[#A8B2A6]">{p2.priceRange}</span>
                        </div>
                        <h4 className="font-serif text-xl font-bold text-[#141814] dark:text-white group-hover:text-[#1C4434] dark:group-hover:text-[#45B887]">
                          {p2.name}
                        </h4>
                        <p className="text-xs text-[#71716A] dark:text-[#8E968E] mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#1C4434] dark:text-[#45B887]" /> {p2.neighborhood || p2.address}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#F0F0EA] dark:border-[#252E28] flex items-center justify-between text-xs text-[#1C4434] dark:text-[#45B887] font-bold">
                        <span>{t('decider.choose', { name: p2.name })}</span>
                        <span>→</span>
                      </div>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {stage === 'WINNER' && finalWinner && (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EFF5F1] dark:bg-[#1E2922] border-2 border-[#1C4434] dark:border-[#45B887] flex items-center justify-center text-[#1C4434] dark:text-[#45B887] shadow-md">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C88A35]">
                  {t('decider.winnerCrowned')}
                </span>
                <h3 className="font-serif text-3xl font-extrabold text-[#141814] dark:text-white mt-1">
                  {finalWinner.name}
                </h3>
                <p className="text-xs text-[#71716A] dark:text-[#8E968E] mt-1.5 flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1C4434] dark:text-[#45B887]" /> {finalWinner.address}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAEAE5] dark:bg-[#252E28] text-[#434842] dark:text-[#CAD1C8] text-xs font-semibold uppercase">
                    {finalWinner.cuisine}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EFF5F1] dark:bg-[#202924] text-[#1C4434] dark:text-[#45B887] text-xs font-bold">
                    {finalWinner.priceRange}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectPlaceOnMap(finalWinner);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-xs bg-[#1C4434] dark:bg-[#256149] hover:bg-[#153629] text-white shadow-sm flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" /> {t('decider.showOnMap')}
                </button>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-[#555A54] dark:text-[#CAD1C8] hover:text-[#141814] dark:hover:text-white bg-[#EAEAE5] dark:bg-[#252E28] hover:bg-[#E0E0D8] dark:hover:bg-[#303B34] transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> {t('decider.decideAgain')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
