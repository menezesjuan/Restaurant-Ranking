/**
 * Resolvedor de Redirecionamentos e Extração Completa de Restaurantes (Google Maps sem API)
 */

import { isAllowedGoogleMapsUrl, sanitizeText } from './security';
import {
  extractCoordinatesFromUrl,
  extractPlaceNameFromUrl,
  parseGoogleMapsHtmlMetadata,
} from './parser';
import { searchAddressNominatim } from '../geocoding';

export interface GoogleMapsExtractedPlace {
  name: string;
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  cuisine?: string;
  priceRange?: '£' | '££' | '£££' | '££££';
  notes?: string;
  source: 'google-maps' | 'nominatim-fallback';
  canonicalUrl?: string;
}

const REQUEST_TIMEOUT_MS = 5000;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

/**
 * Resolve e extrai dados a partir de uma URL válida do Google Maps.
 */
export async function resolveGoogleMapsUrl(urlStr: string): Promise<GoogleMapsExtractedPlace | null> {
  const securityCheck = isAllowedGoogleMapsUrl(urlStr);
  if (!securityCheck.valid) {
    throw new Error(securityCheck.reason || 'URL não permitida por diretrizes de segurança.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // 1. Segue redirecionamentos (ex.: maps.app.goo.gl -> google.com/maps/place/...)
    const response = await fetch(urlStr, {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9,pt-BR;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);

    // 2. Valida a URL final pós-redirecionamento para evitar desvio malicioso (Open Redirect SSRF)
    const finalUrl = response.url;
    const finalSecurityCheck = isAllowedGoogleMapsUrl(finalUrl);
    if (!finalSecurityCheck.valid) {
      throw new Error('Redirecionamento para domínio não autorizado.');
    }

    // 3. Extrai coordenadas da URL final
    let coords = extractCoordinatesFromUrl(finalUrl);

    // 4. Extrai o nome do restaurante da URL
    let placeName = extractPlaceNameFromUrl(finalUrl);

    // 5. Lê até 500 KB do HTML para extrair metadados OpenGraph
    const htmlText = await response.text();
    const limitedHtml = htmlText.slice(0, 500_000);
    const metadata = parseGoogleMapsHtmlMetadata(limitedHtml);

    const name = metadata.name || placeName || 'London Restaurant';
    let address = metadata.address || '';
    let neighborhood = metadata.neighborhood || '';

    // Se coordenadas ainda não foram encontradas na URL canônica, tenta extrair do HTML
    if (!coords) {
      const htmlCoordMatch = limitedHtml.match(/content="https:\/\/maps\.google\.com\/maps\/api\/staticmap\?[^"]*center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/) ||
        limitedHtml.match(/\/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (htmlCoordMatch) {
        coords = {
          latitude: parseFloat(htmlCoordMatch[1]),
          longitude: parseFloat(htmlCoordMatch[2]),
        };
      }
    }

    // Se ainda não temos coordenadas, busca pelo nome no Nominatim para garantir o pin no mapa
    if (!coords) {
      const fallbackSearch = await searchAddressNominatim(`${name} London`);
      if (fallbackSearch.length > 0) {
        coords = {
          latitude: parseFloat(fallbackSearch[0].lat),
          longitude: parseFloat(fallbackSearch[0].lon),
        };
        if (!address) {
          address = fallbackSearch[0].display_name;
        }
      } else {
        // Fallback para o centro de Londres
        coords = { latitude: 51.5074, longitude: -0.1278 };
      }
    }

    if (!address) {
      address = `${name}, London`;
    }

    if (!neighborhood && address) {
      neighborhood = address.split(',')[0].trim();
    }

    return {
      name: sanitizeText(name),
      address: sanitizeText(address),
      neighborhood: sanitizeText(neighborhood),
      latitude: coords.latitude,
      longitude: coords.longitude,
      notes: metadata.description ? sanitizeText(metadata.description) : undefined,
      source: 'google-maps',
      canonicalUrl: finalUrl,
    };
  } catch (error: any) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Tempo de requisição excedido ao consultar o Google Maps.');
    }
    throw error;
  }
}

/**
 * Processa qualquer entrada de busca do usuário (link do Google Maps ou consulta textual direta).
 */
export async function searchOrResolvePlace(queryOrUrl: string): Promise<GoogleMapsExtractedPlace[]> {
  const trimmed = queryOrUrl.trim();
  if (!trimmed) return [];

  // Se for uma URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('maps.app.goo.gl')) {
    const fixedUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const result = await resolveGoogleMapsUrl(fixedUrl);
    return result ? [result] : [];
  }

  // Se for texto livre de busca (ex: "Tayyabs Whitechapel")
  // Consulta OpenStreetMap Nominatim com fallback inteligente
  const osmResults = await searchAddressNominatim(trimmed);
  return osmResults.map((item) => {
    const parts = item.display_name.split(',');
    const name = parts[0]?.trim() || trimmed;
    const neighborhood = parts[1]?.trim() || 'London';

    return {
      name: sanitizeText(name),
      address: sanitizeText(item.display_name),
      neighborhood: sanitizeText(neighborhood),
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      source: 'nominatim-fallback',
    };
  });
}
