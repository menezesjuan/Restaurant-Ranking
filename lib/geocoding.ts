export interface GeocodingResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

/**
 * Realiza busca de endereço utilizando a API pública Nominatim do OpenStreetMap.
 * Inclui tratamento de erros e fallback.
 */
export async function searchAddressNominatim(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=5&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en,pt',
        'User-Agent': 'Tastemap-Restaurant-Ranking-App/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Erro ao consultar Nominatim:', error);
    return [];
  }
}

/**
 * Realiza geocodificação reversa para obter endereço a partir de coordenadas.
 */
export async function reverseGeocodeNominatim(
  lat: number,
  lon: number
): Promise<{ displayName: string; neighborhood?: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en,pt',
        'User-Agent': 'Tastemap-Restaurant-Ranking-App/1.0',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.display_name) {
      const addr = data.address || {};
      const neighborhood =
        addr.suburb ||
        addr.neighbourhood ||
        addr.quarter ||
        addr.city_district ||
        addr.city ||
        addr.town;

      return {
        displayName: data.display_name,
        neighborhood,
      };
    }
    return null;
  } catch {
    return null;
  }
}
