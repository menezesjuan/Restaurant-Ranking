'use client';

import React, { useEffect, useState } from 'react';
import { Place } from '@/types/place';
import { useHeadToHeadComparison, ComparisonResult } from '@/hooks/useHeadToHeadComparison';
import { Trophy, Swords, MapPin, Tag, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComparisonModalProps {
  candidate: Place | null;
  rankedPlaces: Place[];
  onComplete: (result: { newPosition: number }) => void;
  onCancel: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  candidate,
  rankedPlaces,
  onComplete,
  onCancel,
}) => {
  const [completedResult, setCompletedResult] = useState<ComparisonResult | null>(null);

  const handleFinish = (result: ComparisonResult) => {
    setCompletedResult(result);
    // Dispara celebração festiva com confete
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6'],
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      onComplete({ newPosition: result.newPosition });
    }, 1800);
  };

  const {
    currentOpponent,
    currentRound,
    estimatedTotalSteps,
    progressPercentage,
    voteCandidate,
    voteOpponent,
  } = useHeadToHeadComparison({
    candidate,
    rankedPlaces,
    onComplete: handleFinish,
    onCancel,
  });

  // Atalhos de teclado: Seta Esquerda = Candidato, Seta Direita = Adversário
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === '1') {
        voteCandidate();
      } else if (e.key === 'ArrowRight' || e.key === '2') {
        voteOpponent();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voteCandidate, voteOpponent, onCancel]);

  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header do Duelo */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Duelo Head-to-Head
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Posicionando no Ranking
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Qual restaurante proporcionou a melhor experiência gastronômica?
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cancelar e fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progresso com Estimativa O(log n) */}
        <div className="px-6 py-2.5 bg-slate-800/40 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 font-medium">
            <span>Rodada {currentRound}</span>
            <span className="text-slate-600">•</span>
            <span>Estimativa máxima: {estimatedTotalSteps} comparações</span>
          </div>
          <div className="w-36 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(10, progressPercentage)}%` }}
            />
          </div>
        </div>

        {/* Área de Conteúdo / Cards de Duelo */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-center">
          {completedResult ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white">Posição Definida com Sucesso!</h3>
              <p className="text-slate-300 max-w-md text-sm">
                <span className="font-semibold text-amber-400">{candidate.name}</span> foi
                posicionado no índice #{completedResult.insertIndex + 1} do seu ranking com{' '}
                {completedResult.totalComparisonsDone} comparações.
              </p>
              {completedResult.needsRebalance && (
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Rebalanceamento fracionário automático aplicado
                </span>
              )}
            </div>
          ) : currentOpponent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Card Esquerdo: Candidato */}
              <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-800/40 border-2 border-amber-500/40 hover:border-amber-400 transition-all duration-200 shadow-lg hover:shadow-amber-500/10">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> NOVO NO RANKING
                    </span>
                    <span className="text-xs font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      {candidate.priceRange}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{candidate.address}</span>
                    </p>
                  </div>

                  <div className="inline-block px-2.5 py-1 rounded-md bg-slate-700/60 text-slate-300 text-xs font-medium">
                    {candidate.cuisine}
                  </div>

                  {candidate.notes && (
                    <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      &quot;{candidate.notes}&quot;
                    </p>
                  )}

                  {candidate.tags && candidate.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {candidate.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-500" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    onClick={voteCandidate}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group-hover:ring-2 ring-amber-300"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Este Foi Melhor</span>
                    <span className="text-[11px] opacity-75 font-mono ml-1 px-1.5 py-0.5 rounded bg-slate-900/20">
                      [ ← ou 1 ]
                    </span>
                  </button>
                </div>
              </div>

              {/* Divisor VS no Desktop */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950 border-2 border-slate-700 items-center justify-center font-black text-xs text-slate-300 shadow-xl z-10">
                VS
              </div>

              {/* Card Direito: Adversário Atual */}
              <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-800/40 border border-slate-700 hover:border-slate-500 transition-all duration-200 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" /> JÁ RANQUEADO
                    </span>
                    <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {currentOpponent.priceRange}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {currentOpponent.name}
                    </h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{currentOpponent.address}</span>
                    </p>
                  </div>

                  <div className="inline-block px-2.5 py-1 rounded-md bg-slate-700/60 text-slate-300 text-xs font-medium">
                    {currentOpponent.cuisine}
                  </div>

                  {currentOpponent.notes && (
                    <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      &quot;{currentOpponent.notes}&quot;
                    </p>
                  )}

                  {currentOpponent.tags && currentOpponent.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {currentOpponent.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-500" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    onClick={voteOpponent}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-700 hover:bg-slate-600 text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group-hover:ring-2 ring-slate-400"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Este Foi Melhor</span>
                    <span className="text-[11px] opacity-75 font-mono ml-1 px-1.5 py-0.5 rounded bg-slate-900/40">
                      [ → ou 2 ]
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Rodapé informativo */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" /> Seta Esquerda ou 1: Votar na esquerda
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            Seta Direita ou 2: Votar na direita <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </span>
        </div>
      </div>
    </div>
  );
};
