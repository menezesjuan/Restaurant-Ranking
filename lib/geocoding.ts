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
