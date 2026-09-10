import { Place } from '@/types/place';

export interface ExportData {
  version: string;
  exportedAt: string;
  city: string;
  places: Place[];
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedPlaces?: Place[];
}

/**
 * Serializa a lista de restaurantes para formato JSON formatado para exportação e backup.
 */
export function exportPlacesToJson(places: Place[], city: string = 'London'): string {
  const exportPayload: ExportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    city,
    places,
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Valida e sanitiza os dados importados de um JSON ou arquivo de backup.
 * Garante que todos os campos obrigatórios e coordenadas numéricas estejam íntegros.
 */
export function validateAndSanitizeImport(jsonContent: string): ValidationResult {
  try {
    const parsed = JSON.parse(jsonContent);

    // Suporta tanto o payload encapsulado { places: [...] } quanto array direto [...]
    const rawPlaces = Array.isArray(parsed) ? parsed : parsed?.places;

    if (!Array.isArray(rawPlaces) || rawPlaces.length === 0) {
      return { valid: false, error: 'O arquivo não contém uma lista válida de restaurantes.' };
    }

    const sanitizedPlaces: Place[] = [];

    for (let i = 0; i < rawPlaces.length; i++) {
      const item = rawPlaces[i];

      if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
        return { valid: false, error: `Restaurante no índice ${i} possui nome inválido.` };
      }

      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        return { valid: false, error: `Coordenadas inválidas para o restaurante "${item.name}".` };
      }

      const status = item.status === 'WANT_TO_TRY' ? 'WANT_TO_TRY' : 'BEEN';
      const rankingPos =
        status === 'BEEN' && typeof item.rankingPosition === 'number'
          ? item.rankingPosition
          : status === 'BEEN'
          ? (i + 1) * 1000.0
          : null;

      sanitizedPlaces.push({
        id: item.id || `place_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        name: item.name.trim(),
        address: item.address || 'London, United Kingdom',
        neighborhood: item.neighborhood || '',
        latitude: lat,
        longitude: lng,
        cuisine: item.cuisine || 'General',
        priceRange: item.priceRange || '££',
        status,
        rankingPosition: rankingPos,
        notes: item.notes || null,
        tags: Array.isArray(item.tags) ? item.tags : [],
        timesVisited: typeof item.timesVisited === 'number' ? item.timesVisited : status === 'BEEN' ? 1 : 0,
        avatarText: item.avatarText || item.name.substring(0, 2).toUpperCase(),
        avatarBg: item.avatarBg || '#1C4434',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return { valid: true, sanitizedPlaces };
  } catch (err: any) {
    return { valid: false, error: `JSON corrompido ou mal formatado: ${err.message}` };
  }
}
