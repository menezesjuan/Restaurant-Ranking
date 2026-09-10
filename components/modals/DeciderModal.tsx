'use client';

import React, { useState, useMemo } from 'react';
import { Place } from '@/types/place';
import { Compass, Sparkles, Trophy, X, MapPin, RefreshCw, UtensilsCrossed } from 'lucide-react';
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

    // Embaralha e seleciona potência de 2 (2, 4 ou 8 restaurantes)
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
      // Próxima partida da mesma rodada
      setWinnersOfCurrentRound(nextWinners);
      setCurrentMatchIndex(nextMatchIdx);
    } else {
      // Fim da rodada
      if (nextWinners.length === 1) {
        // Encontrou o campeão final!
        setFinalWinner(nextWinners[0]);
        setStage('WINNER');
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
          });
        } catch {}
      } else {
        // Próxima rodada do torneio
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Where Should We Eat?
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Decisor Rápido
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Resolva o dilema da indecisão com um mini-torneio gastronômico
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo dinâmico por estágio */}
        <div className="p-6">
          {stage === 'FILTER' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Escopo de Busca
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'ALL', label: 'Todos os Locais' },
                      { key: 'WANT_TO_TRY', label: 'Quero Conhecer' },
                      { key: 'BEEN', label: 'Já Experimentei' },
                    ].map((scope) => (
                      <button
                        key={scope.key}
                        onClick={() => setSelectedScope(scope.key as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedScope === scope.key
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {scope.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Preferência de Culinária
                  </label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Qualquer Culinária ({cuisines.length} disponíveis)</option>
                    {cuisines.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                <span className="text-sm text-slate-300">
                  Restaurantes elegíveis encontrados:
                </span>
                <span className="text-sm font-bold text-amber-400">
                  {filteredCandidates.length} opções
                </span>
              </div>

              <button
                disabled={filteredCandidates.length < 2}
                onClick={startTournament}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {filteredCandidates.length < 2
                    ? 'Selecione filtros com pelo menos 2 restaurantes'
                    : 'Iniciar Torneio Decisor!'}
                </span>
              </button>
            </div>
          )}

          {stage === 'TOURNAMENT' && tournamentPool.length >= 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Qual você prefere agora?
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Restam {tournamentPool.length / 2 - currentMatchIndex / 2} duelos nesta rodada
                </p>
              </div>

              {(() => {
                const p1 = tournamentPool[currentMatchIndex];
                const p2 = tournamentPool[currentMatchIndex + 1];
                if (!p1 || !p2) return null;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    <button
                      onClick={() => handleVoteMatch(p1)}
                      className="group p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 border-2 border-slate-700 hover:border-indigo-400 transition-all text-left flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {p1.cuisine}
                          </span>
                          <span className="text-xs font-bold text-slate-400">{p1.priceRange}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-300">
                          {p1.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {p1.address}
                        </p>
                        {p1.notes && (
                          <p className="text-xs text-slate-300 italic mt-3 line-clamp-2">
                            &quot;{p1.notes}&quot;
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                        <span>Escolher este</span>
                        <span>→</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleVoteMatch(p2)}
                      className="group p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 border-2 border-slate-700 hover:border-purple-400 transition-all text-left flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {p2.cuisine}
                          </span>
                          <span className="text-xs font-bold text-slate-400">{p2.priceRange}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white group-hover:text-purple-300">
                          {p2.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {p2.address}
                        </p>
                        {p2.notes && (
                          <p className="text-xs text-slate-300 italic mt-3 line-clamp-2">
                            &quot;{p2.notes}&quot;
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-purple-400 font-semibold">
                        <span>Escolher este</span>
                        <span>→</span>
                      </div>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {stage === 'WINNER' && finalWinner && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Decisão Tomada! O Campeão de Hoje é:
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-1">{finalWinner.name}</h3>
                <p className="text-sm text-slate-300 mt-2 flex items-center justify-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" /> {finalWinner.address}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                    {finalWinner.cuisine}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    {finalWinner.priceRange}
                  </span>
                </div>
              </div>

              {finalWinner.notes && (
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 italic max-w-md mx-auto">
                  &quot;{finalWinner.notes}&quot;
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectPlaceOnMap(finalWinner);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" /> Ver no Mapa
                </button>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Novo Sorteio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
