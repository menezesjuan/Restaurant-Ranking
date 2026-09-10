'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Place } from '@/types/place';
import {
  calculateNewPosition,
  getNeighborsForInsertIndex,
  needsRebalancing,
} from '@/lib/ranking-calc';

export interface ComparisonResult {
  newPosition: number;
  insertIndex: number;
  needsRebalance: boolean;
  totalComparisonsDone: number;
}

export interface UseHeadToHeadComparisonProps {
  candidate: Place | null;
  rankedPlaces: Place[];
  onComplete: (result: ComparisonResult) => void;
  onCancel?: () => void;
}

export function useHeadToHeadComparison({
  candidate,
  rankedPlaces,
  onComplete,
  onCancel,
}: UseHeadToHeadComparisonProps) {
  // Garante que a lista está ordenada por rankingPosition ascendente
  const sortedRankedPlaces = useMemo(() => {
    return [...rankedPlaces]
      .filter((p): p is Place & { rankingPosition: number } => typeof p.rankingPosition === 'number')
      .sort((a, b) => a.rankingPosition - b.rankingPosition);
  }, [rankedPlaces]);

  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(() => Math.max(0, sortedRankedPlaces.length - 1));
  const [stepCount, setStepCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Calcula o total estimado de comparações: O(log2(n + 1))
  const estimatedTotalSteps = useMemo(() => {
    if (sortedRankedPlaces.length <= 1) return 1;
    return Math.max(1, Math.ceil(Math.log2(sortedRankedPlaces.length + 1)));
  }, [sortedRankedPlaces.length]);

  // Se a lista estiver vazia, finaliza imediatamente atribuindo posição inicial 1000.0
  useEffect(() => {
    if (!candidate) return;
    if (sortedRankedPlaces.length === 0 && !isFinished) {
      setIsFinished(true);
      const newPos = calculateNewPosition(null, null);
      onComplete({
        newPosition: newPos,
        insertIndex: 0,
        needsRebalance: false,
        totalComparisonsDone: 0,
      });
    }
  }, [candidate, sortedRankedPlaces.length, isFinished, onComplete]);

  // Índice atual do adversário na busca binária
  const currentMid = useMemo(() => {
    if (low > high) return -1;
    return Math.floor((low + high) / 2);
  }, [low, high]);

  const currentOpponent = useMemo(() => {
    if (currentMid < 0 || currentMid >= sortedRankedPlaces.length) {
      return null;
    }
    return sortedRankedPlaces[currentMid];
  }, [currentMid, sortedRankedPlaces]);

  // Finaliza a busca e calcula a nova posição fracionária
  const finalizeRanking = useCallback(
    (finalInsertIndex: number, completedSteps: number) => {
      setIsFinished(true);
      const { prevPosition, nextPosition } = getNeighborsForInsertIndex(
        sortedRankedPlaces,
        finalInsertIndex
      );

      const newPosition = calculateNewPosition(prevPosition, nextPosition);

      // Simula a inserção para checar se precisará de rebalanceamento
      const simulatedPositions = [
        ...sortedRankedPlaces.map((p) => ({ rankingPosition: p.rankingPosition })),
        { rankingPosition: newPosition },
      ];
      const shouldRebalance = needsRebalancing(simulatedPositions);

      onComplete({
        newPosition,
        insertIndex: finalInsertIndex,
        needsRebalance: shouldRebalance,
        totalComparisonsDone: completedSteps,
      });
    },
    [sortedRankedPlaces, onComplete]
  );

  /**
   * O usuário escolheu o Candidato (o novo restaurante é MELHOR que o adversário).
   * No ranking, o melhor fica acima (menor índice). Portanto: high = mid - 1.
   */
  const voteCandidate = useCallback(() => {
    if (isFinished || currentMid === -1) return;

    const newHigh = currentMid - 1;
    const nextSteps = stepCount + 1;
    setStepCount(nextSteps);

    if (low > newHigh) {
      // Busca convergiu! O candidato fica no índice `low`
      finalizeRanking(low, nextSteps);
    } else {
      setHigh(newHigh);
    }
  }, [isFinished, currentMid, stepCount, low, finalizeRanking]);

  /**
   * O usuário escolheu o Adversário (o adversário existente é MELHOR que o candidato).
   * No ranking, o candidato deve ficar abaixo (maior índice). Portanto: low = mid + 1.
   */
  const voteOpponent = useCallback(() => {
    if (isFinished || currentMid === -1) return;

    const newLow = currentMid + 1;
    const nextSteps = stepCount + 1;
    setStepCount(nextSteps);

    if (newLow > high) {
      // Busca convergiu! O candidato fica no índice `newLow`
      finalizeRanking(newLow, nextSteps);
    } else {
      setLow(newLow);
    }
  }, [isFinished, currentMid, stepCount, high, finalizeRanking]);

  const resetComparison = useCallback(() => {
    setLow(0);
    setHigh(Math.max(0, sortedRankedPlaces.length - 1));
    setStepCount(0);
    setIsFinished(false);
  }, [sortedRankedPlaces.length]);

  return {
    candidate,
    currentOpponent,
    currentRound: stepCount + 1,
    estimatedTotalSteps,
    progressPercentage: Math.min(100, Math.round((stepCount / estimatedTotalSteps) * 100)),
    isFinished,
    voteCandidate,
    voteOpponent,
    resetComparison,
    onCancel,
  };
}
