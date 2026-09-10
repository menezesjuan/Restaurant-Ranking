import { Place } from '@/types/place';

export const INITIAL_POSITION = 1000.0;
export const DEFAULT_STEP = 1000.0;
export const MIN_INTERVAL = 0.0001;

/**
 * Calcula a nova posição fracionária no ranking baseado nos vizinhos imediatamente anterior e posterior.
 *
 * Casos:
 * 1. Lista vazia (nenhum vizinho): 1000.0
 * 2. Inserido no topo da lista (antes do #1 atual): nextPosition / 2
 * 3. Inserido no final da lista (abaixo do último): prevPosition + 1000.0
 * 4. Inserido entre dois lugares: (prevPosition + nextPosition) / 2
 */
export function calculateNewPosition(
  prevPosition: number | null,
  nextPosition: number | null
): number {
  // Caso 1: Lista vazia
  if (prevPosition === null && nextPosition === null) {
    return INITIAL_POSITION;
  }

  // Caso 2: Topo da lista (antes do primeiro lugar)
  if (prevPosition === null && nextPosition !== null) {
    return nextPosition / 2.0;
  }

  // Caso 3: Final da lista (abaixo do último lugar)
  if (prevPosition !== null && nextPosition === null) {
    return prevPosition + DEFAULT_STEP;
  }

  // Caso 4: Entre dois lugares
  if (prevPosition !== null && nextPosition !== null) {
    return (prevPosition + nextPosition) / 2.0;
  }

  return INITIAL_POSITION;
}

/**
 * Verifica se a lista de lugares ranqueados precisa de rebalanceamento.
 * Ocorre se a distância fracionária entre quaisquer dois itens adjacentes for inferior a 0.0001.
 */
export function needsRebalancing(
  places: Array<{ rankingPosition: number | null }>
): boolean {
  const ranked = places
    .filter((p): p is { rankingPosition: number } => typeof p.rankingPosition === 'number')
    .sort((a, b) => a.rankingPosition - b.rankingPosition);

  for (let i = 0; i < ranked.length - 1; i++) {
    const diff = ranked[i + 1].rankingPosition - ranked[i].rankingPosition;
    if (diff <= MIN_INTERVAL) {
      return true;
    }
  }

  return false;
}

/**
 * Rebalanceia todas as posições fracionárias, redistribuindo os itens em passos uniformes de 1000.0.
 * Garante ordenação limpa e espaçosa sem conflito de arredondamento IEEE-754.
 */
export function rebalancePositions<T extends { id: string }>(
  places: T[]
): Array<{ id: string; rankingPosition: number }> {
  return places.map((place, index) => ({
    id: place.id,
    rankingPosition: (index + 1) * DEFAULT_STEP,
  }));
}

/**
 * Determina os vizinhos anterior e posterior para inserção com base no índice resultante da busca binária.
 *
 * @param sortedPlaces Lista de lugares ordenada ascendentemente por rankingPosition
 * @param insertIndex Índice (0-indexed) onde o novo lugar deve ser posicionado
 */
export function getNeighborsForInsertIndex(
  sortedPlaces: Place[],
  insertIndex: number
): { prevPosition: number | null; nextPosition: number | null } {
  if (sortedPlaces.length === 0) {
    return { prevPosition: null, nextPosition: null };
  }

  // Inserção antes do primeiro
  if (insertIndex <= 0) {
    return {
      prevPosition: null,
      nextPosition: sortedPlaces[0]?.rankingPosition ?? null,
    };
  }

  // Inserção após o último
  if (insertIndex >= sortedPlaces.length) {
    return {
      prevPosition: sortedPlaces[sortedPlaces.length - 1]?.rankingPosition ?? null,
      nextPosition: null,
    };
  }

  // Inserção entre insertIndex - 1 e insertIndex
  return {
    prevPosition: sortedPlaces[insertIndex - 1]?.rankingPosition ?? null,
    nextPosition: sortedPlaces[insertIndex]?.rankingPosition ?? null,
  };
}
