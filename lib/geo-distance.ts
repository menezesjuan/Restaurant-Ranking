import { Place } from '@/types/place';

const EARTH_RADIUS_KM = 6371.0;

/**
 * Converte graus para radianos.
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180.0;
}

/**
 * Calcula a distância em quilômetros entre duas coordenadas usando a fórmula de Haversine.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Formata a distância em metros ou quilômetros de maneira elegante e legível.
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1.0) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters}m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Filtra uma lista de restaurantes para retornar apenas os que estão dentro do raio especificado em km.
 */
export function filterPlacesByRadius(
  places: Place[],
  centerLat: number,
  centerLon: number,
  radiusKm: number
): Array<Place & { distanceKm: number }> {
  if (radiusKm <= 0) {
    return places.map((p) => ({
      ...p,
      distanceKm: calculateHaversineDistanceKm(centerLat, centerLon, p.latitude, p.longitude),
    }));
  }

  const result: Array<Place & { distanceKm: number }> = [];

  for (const place of places) {
    const dist = calculateHaversineDistanceKm(centerLat, centerLon, place.latitude, place.longitude);
    if (dist <= radiusKm) {
      result.push({
        ...place,
        distanceKm: dist,
      });
    }
  }

  return result;
}

/**
 * Ordena os restaurantes do mais próximo ao mais distante em relação ao ponto central.
 */
export function sortPlacesByDistance(
  places: Place[],
  centerLat: number,
  centerLon: number
): Array<Place & { distanceKm: number }> {
  const withDistance = places.map((place) => ({
    ...place,
    distanceKm: calculateHaversineDistanceKm(centerLat, centerLon, place.latitude, place.longitude),
  }));

  return withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
}
