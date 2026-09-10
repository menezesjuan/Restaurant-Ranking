/**
 * Parser Geoespacial e Extrator de Metadados do Google Maps (Sem API)
 */

import { sanitizeText } from './security';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ParsedPlaceMetadata {
  name?: string;
  address?: string;
  neighborhood?: string;
  cuisine?: string;
  description?: string;
}

/**
 * Extrai latitude e longitude de qualquer variante conhecida de URLs do Google Maps.
 */
export function extractCoordinatesFromUrl(urlStr: string): Coordinates | null {
  if (!urlStr || typeof urlStr !== 'string') return null;

  // 1. Padrão canônico desktop: @<lat>,<lng>,<zoom>
  const atMatch = urlStr.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 2. Padrão protobuf embutido no data: !3d<lat>!4d<lng>
  const protoMatch = urlStr.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (protoMatch) {
    const lat = parseFloat(protoMatch[1]);
    const lng = parseFloat(protoMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 3. Padrão query param: ?q=<lat>,<lng> ou ?ll=<lat>,<lng>
  const queryMatch = urlStr.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1]);
    const lng = parseFloat(queryMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { latitude: lat, longitude: lng };
    }
  }

  return null;
}

/**
 * Extrai o nome do restaurante a partir do segmento /maps/place/<nome>/ da URL.
 */
export function extractPlaceNameFromUrl(urlStr: string): string | null {
  if (!urlStr || typeof urlStr !== 'string') return null;

  // Regex linear sem backtracking
  const match = urlStr.match(/\/maps\/place\/([^/@?]+)/);
  if (!match || !match[1]) return null;

  let rawName = match[1];

  // Substitui '+' por espaços antes de decodificar
  rawName = rawName.replace(/\+/g, ' ');

  try {
    rawName = decodeURIComponent(rawName);
  } catch {}

  const clean = sanitizeText(rawName);
  return clean || null;
}

/**
 * Faz o parsing de tags OpenGraph e Schema no HTML retornado pelo Google Maps
 */
export function parseGoogleMapsHtmlMetadata(html: string): ParsedPlaceMetadata {
  if (!html || typeof html !== 'string') return {};

  const result: ParsedPlaceMetadata = {};

  // Extrai og:title (<meta property="og:title" content="...">)
  const ogTitleMatch =
    html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i);

  if (ogTitleMatch && ogTitleMatch[1]) {
    const rawTitle = sanitizeText(ogTitleMatch[1]);

    // O Google Maps costuma formatar: "Nome do Lugar · Endereço Completo, Cidade"
    if (rawTitle.includes(' · ')) {
      const parts = rawTitle.split(' · ');
      result.name = parts[0].trim();
      result.address = parts[1].trim();

      // Bairro geralmente é o primeiro segmento antes de vírgula
      const addrParts = result.address.split(',');
      if (addrParts.length > 0 && addrParts[0].trim()) {
        result.neighborhood = addrParts[0].trim();
      }
    } else if (rawTitle.includes(' - Google Maps')) {
      result.name = rawTitle.replace(' - Google Maps', '').trim();
    } else {
      result.name = rawTitle;
    }
  }

  // Extrai og:description
  const ogDescMatch =
    html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i);

  if (ogDescMatch && ogDescMatch[1]) {
    result.description = sanitizeText(ogDescMatch[1]);
  }

  return result;
}
