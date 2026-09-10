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
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1C4434', '#C88A35', '#EFEFEA', '#141814'],
      });
    } catch {}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAFAF8] border border-[#EAEAE5] rounded-3xl shadow-2xl overflow-hidden text-[#191917] flex flex-col max-h-[90vh]">
        {/* Header do Duelo */}
        <div className="px-6 py-4 border-b border-[#EAEAE5] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1C4434] text-white flex items-center justify-center shadow-sm">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight text-[#141814] flex items-center gap-2">
                Head-to-Head Duel
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#EFF5F1] text-[#1C4434] border border-[#D2E2D6]">
                  Finding Exact Rank
                </span>
              </h2>
              <p className="text-xs text-[#71716A]">
                Which table gave you the better culinary experience?
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[#71716A] hover:text-[#141814] hover:bg-[#EAEAE5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progresso O(log n) */}
        <div className="px-6 py-2.5 bg-[#F4F4F0] border-b border-[#EAEAE5] flex items-center justify-between text-xs text-[#71716A]">
          <div className="flex items-center gap-2 font-medium">
            <span>Round {currentRound}</span>
            <span>•</span>
            <span>Binary Search: ~{estimatedTotalSteps} questions max</span>
          </div>
          <div className="w-36 bg-[#E0E0D8] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#1C4434] h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(12, progressPercentage)}%` }}
            />
          </div>
        </div>

        {/* Área de Duelo */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-center">
          {completedResult ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#EFF5F1] border-2 border-[#1C4434] flex items-center justify-center text-[#1C4434] mb-2 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#141814]">Ranking Position Found!</h3>
              <p className="text-[#555A54] max-w-md text-sm">
                <span className="font-bold text-[#1C4434]">{candidate.name}</span> has been positioned at{' '}
                <span className="font-bold">#{completedResult.insertIndex + 1}</span> on your table list with{' '}
                {completedResult.totalComparisonsDone} comparisons.
              </p>
              {completedResult.needsRebalance && (
                <span className="text-xs bg-[#EFF5F1] text-[#1C4434] px-3 py-1 rounded-full border border-[#D2E2D6] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Fractional index rebalanced automatically
                </span>
              )}
            </div>
          ) : currentOpponent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Card Esquerdo: Candidato */}
              <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border-2 border-[#1C4434]/40 hover:border-[#1C4434] transition-all duration-200 shadow-md">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#1C4434] text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> NEW ENTRY
                    </span>
                    <span className="text-xs font-bold text-[#555A54] bg-[#F4F4F0] px-2 py-0.5 rounded border border-[#EAEAE5]">
                      {candidate.priceRange}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#141814]">
                      {candidate.name}
                    </h3>
                    <p className="text-xs text-[#71716A] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1C4434]" />
                      <span className="truncate">{candidate.address}</span>
                    </p>
                  </div>

                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#ECECE6] text-[#434842] text-xs font-semibold uppercase">
                    {candidate.cuisine}
                  </div>

                  {candidate.notes && (
                    <p className="text-xs text-[#555A54] italic bg-[#FAF9F5] p-3 rounded-xl border border-[#EAEAE5]">
                      &quot;{candidate.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    onClick={voteCandidate}
                    className="w-full py-3.5 px-4 rounded-full font-bold text-sm bg-[#1C4434] hover:bg-[#153629] text-white shadow-md shadow-[#1C4434]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>This was better</span>
                    <span className="text-[11px] opacity-75 font-mono ml-1 px-1.5 py-0.5 rounded bg-black/20">
                      [ ← or 1 ]
                    </span>
                  </button>
                </div>
              </div>

              {/* Divisor VS */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border-2 border-[#EAEAE5] items-center justify-center font-black text-xs text-[#71716A] shadow-md z-10">
                VS
              </div>

              {/* Card Direito: Oponente */}
              <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-[#EAEAE5] hover:border-[#B0B0A8] transition-all duration-200 shadow-md">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EAEAE5] text-[#434842] flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-[#C88A35]" /> CURRENT BENCHMARK
                    </span>
                    <span className="text-xs font-bold text-[#555A54] bg-[#F4F4F0] px-2 py-0.5 rounded border border-[#EAEAE5]">
                      {currentOpponent.priceRange}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#141814]">
                      {currentOpponent.name}
                    </h3>
                    <p className="text-xs text-[#71716A] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1C4434]" />
                      <span className="truncate">{currentOpponent.address}</span>
                    </p>
                  </div>

                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#ECECE6] text-[#434842] text-xs font-semibold uppercase">
                    {currentOpponent.cuisine}
                  </div>

                  {currentOpponent.notes && (
                    <p className="text-xs text-[#555A54] italic bg-[#FAF9F5] p-3 rounded-xl border border-[#EAEAE5]">
                      &quot;{currentOpponent.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    onClick={voteOpponent}
                    className="w-full py-3.5 px-4 rounded-full font-bold text-sm bg-[#EFEFEA] hover:bg-[#E2E2DC] text-[#141814] shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#D5D5CD]"
                  >
                    <Trophy className="w-4 h-4 text-[#C88A35]" />
                    <span>This was better</span>
                    <span className="text-[11px] opacity-75 font-mono ml-1 px-1.5 py-0.5 rounded bg-black/10">
                      [ → or 2 ]
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F4F4F0] border-t border-[#EAEAE5] text-center text-xs text-[#71716A] flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Left Arrow or 1: Vote Left
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            Right Arrow or 2: Vote Right <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
