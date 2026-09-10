import { Place } from '@/types/place';
import initialLondonPlaces from '@/data/london-mock-places.json';

const STORAGE_KEY = 'tastemap_places_v2';

export class PlacesStorageService {
  /**
   * Obtém a lista de lugares atual do armazenamento local (ou inicial de Londres)
   */
  static getLocalPlaces(): Place[] {
    if (typeof window === 'undefined') {
      return initialLondonPlaces as Place[];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Erro ao ler do LocalStorage, usando dados mock:', err);
    }

    // Inicializa com mock de Londres se estiver vazio
    this.saveLocalPlaces(initialLondonPlaces as Place[]);
    return initialLondonPlaces as Place[];
  }

  /**
   * Salva a lista de lugares no armazenamento local
   */
  static saveLocalPlaces(places: Place[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch (err) {
      console.error('Erro ao salvar no LocalStorage:', err);
    }
  }

  /**
   * Adiciona um novo restaurante
   */
  static addPlace(placeData: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>): Place {
    const places = this.getLocalPlaces();
    const newPlace: Place = {
      ...placeData,
      id: `place_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newPlace, ...places];
    this.saveLocalPlaces(updated);
    return newPlace;
  }

  /**
   * Atualiza um restaurante existente
   */
  static updatePlace(id: string, updates: Partial<Place>): Place | null {
    const places = this.getLocalPlaces();
    const index = places.findIndex((p) => p.id === id);
    if (index === -1) return null;

    places[index] = {
      ...places[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveLocalPlaces(places);
    return places[index];
  }

  /**
   * Remove um restaurante
   */
  static deletePlace(id: string): boolean {
    const places = this.getLocalPlaces();
    const filtered = places.filter((p) => p.id !== id);
    if (filtered.length === places.length) return false;

    this.saveLocalPlaces(filtered);
    return true;
  }

  /**
   * Restaura os dados para a demonstração inicial de Londres
   */
  static resetToDemoData(): Place[] {
    const demo = initialLondonPlaces as Place[];
    this.saveLocalPlaces(demo);
    return demo;
  }
}
