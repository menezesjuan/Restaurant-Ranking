import { Place } from '@/types/place';

export interface CuisineStat {
  cuisine: string;
  count: number;
  percentage: number;
}

export interface NeighborhoodStat {
  neighborhood: string;
  count: number;
  percentage: number;
}

export type PriceTier = '£' | '££' | '£££' | '££££';

export interface PriceDistribution {
  '£': number;
  '££': number;
  '£££': number;
  '££££': number;
}

export interface TasteInsights {
  totalPlaces: number;
  beenCount: number;
  wantToTryCount: number;
  beenPercentage: number;
  totalVisits: number;
  topPick: Place | null;
  mostVisited: Place | null;
  topCuisines: CuisineStat[];
  priceDistribution: PriceDistribution;
  averagePriceLevel: number;
  averagePriceTier: PriceTier;
  topNeighborhoods: NeighborhoodStat[];
}

/**
 * Normaliza qualquer formato de preço (ex: '$$', '£££', etc.) para a convenção em libras ('£')
 */
export function normalizePriceTier(rawPrice?: string | null): PriceTier {
  if (!rawPrice) return '££';
  const clean = rawPrice.trim();
  const count = (clean.match(/[$£]/g) || []).length;
  if (count === 1) return '£';
  if (count === 2) return '££';
  if (count === 3) return '£££';
  if (count >= 4) return '££££';
  return '££';
}

/**
 * Retorna o nível numérico (1 a 4) de uma faixa de preço
 */
export function getPriceTierLevel(tier: string): number {
  const normalized = normalizePriceTier(tier);
  switch (normalized) {
    case '£':
      return 1;
    case '££':
      return 2;
    case '£££':
      return 3;
    case '££££':
      return 4;
    default:
      return 2;
  }
}

/**
 * Converte nível numérico para a faixa de preço textual
 */
export function getLevelPriceTier(level: number): PriceTier {
  if (level <= 1.5) return '£';
  if (level <= 2.5) return '££';
  if (level <= 3.5) return '£££';
  return '££££';
}

/**
 * Extrai o bairro de um restaurante ou utiliza o primeiro segmento do endereço como fallback
 */
export function extractNeighborhood(place: Place): string {
  if (place.neighborhood && place.neighborhood.trim()) {
    return place.neighborhood.trim();
  }
  if (place.address && place.address.trim()) {
    const firstPart = place.address.split(',')[0].trim();
    if (firstPart) return firstPart;
  }
  return 'Other';
}

/**
 * Calcula todas as métricas agregadas do Perfil Gastronômico do usuário
 */
export function calculateTasteInsights(places: Place[]): TasteInsights {
  const totalPlaces = places.length;

  if (totalPlaces === 0) {
    return {
      totalPlaces: 0,
      beenCount: 0,
      wantToTryCount: 0,
      beenPercentage: 0,
      totalVisits: 0,
      topPick: null,
      mostVisited: null,
      topCuisines: [],
      priceDistribution: { '£': 0, '££': 0, '£££': 0, '££££': 0 },
      averagePriceLevel: 0,
      averagePriceTier: '£',
      topNeighborhoods: [],
    };
  }

  const beenPlaces = places.filter((p) => p.status === 'BEEN');
  const wantToTryPlaces = places.filter((p) => p.status === 'WANT_TO_TRY');
  const beenCount = beenPlaces.length;
  const wantToTryCount = wantToTryPlaces.length;
  const beenPercentage = Math.round((beenCount / totalPlaces) * 100);

  // Total de visitas registradas
  const totalVisits = places.reduce((sum, p) => sum + (p.timesVisited || 0), 0);

  // Top Pick (#1 do ranking: status BEEN com menor rankingPosition numérico)
  let topPick: Place | null = null;
  const rankedOnly = beenPlaces
    .filter((p) => typeof p.rankingPosition === 'number')
    .sort((a, b) => (a.rankingPosition ?? 0) - (b.rankingPosition ?? 0));

  if (rankedOnly.length > 0) {
    topPick = rankedOnly[0];
  }

  // Mais visitado (status BEEN com maior timesVisited > 0)
  let mostVisited: Place | null = null;
  const visitedPlaces = beenPlaces
    .filter((p) => (p.timesVisited || 0) > 0)
    .sort((a, b) => (b.timesVisited || 0) - (a.timesVisited || 0));

  if (visitedPlaces.length > 0) {
    mostVisited = visitedPlaces[0];
  }

  // Distribuição de Culinárias
  const cuisineMap = new Map<string, number>();
  places.forEach((p) => {
    const c = p.cuisine?.trim() || 'Other';
    cuisineMap.set(c, (cuisineMap.get(c) || 0) + 1);
  });

  const topCuisines: CuisineStat[] = Array.from(cuisineMap.entries())
    .map(([cuisine, count]) => ({
      cuisine,
      count,
      percentage: Math.round((count / totalPlaces) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Distribuição de Faixa de Preço
  const priceDistribution: PriceDistribution = {
    '£': 0,
    '££': 0,
    '£££': 0,
    '££££': 0,
  };

  let sumPriceLevel = 0;
  places.forEach((p) => {
    const normalized = normalizePriceTier(p.priceRange);
    priceDistribution[normalized] += 1;
    sumPriceLevel += getPriceTierLevel(normalized);
  });

  const averagePriceLevel = Number((sumPriceLevel / totalPlaces).toFixed(2));
  const averagePriceTier = getLevelPriceTier(averagePriceLevel);

  // Distribuição de Bairros
  const neighborhoodMap = new Map<string, number>();
  places.forEach((p) => {
    const nh = extractNeighborhood(p);
    neighborhoodMap.set(nh, (neighborhoodMap.get(nh) || 0) + 1);
  });

  const topNeighborhoods: NeighborhoodStat[] = Array.from(neighborhoodMap.entries())
    .map(([neighborhood, count]) => ({
      neighborhood,
      count,
      percentage: Math.round((count / totalPlaces) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalPlaces,
    beenCount,
    wantToTryCount,
    beenPercentage,
    totalVisits,
    topPick,
    mostVisited,
    topCuisines,
    priceDistribution,
    averagePriceLevel,
    averagePriceTier,
    topNeighborhoods,
  };
}
