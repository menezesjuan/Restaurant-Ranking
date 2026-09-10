'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Place, PlaceFilterState, PlaceStatus } from '@/types/place';
import { PlacesStorageService } from '@/lib/storage/places-storage';
import { needsRebalancing, rebalancePositions } from '@/lib/ranking-calc';

interface PlacesContextValue {
  places: Place[];
  rankedPlaces: Place[];
  wantToTryPlaces: Place[];
  filteredRankedPlaces: Place[];
  filteredWantToTryPlaces: Place[];
  activeTab: 'RANKED' | 'WANT_TO_TRY';
  setActiveTab: (tab: 'RANKED' | 'WANT_TO_TRY') => void;
  filters: PlaceFilterState;
  setFilters: React.Dispatch<React.SetStateAction<PlaceFilterState>>;
  availableCuisines: string[];
  availableTags: string[];
  addPlace: (placeData: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => Place;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  resetToLondonMock: () => void;
  importPlaces: (imported: Place[]) => void;
  // Comparação Head-to-Head
  comparisonCandidate: Place | null;
  startComparison: (place: Place) => void;
  finishComparison: (result: { newPosition: number }) => void;
  cancelComparison: () => void;
}

const initialFilters: PlaceFilterState = {
  searchQuery: '',
  cuisine: '',
  priceRange: '',
  selectedTags: [],
};

const PlacesContext = createContext<PlacesContextValue | undefined>(undefined);

export const PlacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'RANKED' | 'WANT_TO_TRY'>('RANKED');
  const [filters, setFilters] = useState<PlaceFilterState>(initialFilters);
  const [comparisonCandidate, setComparisonCandidate] = useState<Place | null>(null);

  // Carrega dados iniciais do LocalStorage / Mock
  useEffect(() => {
    const loaded = PlacesStorageService.getLocalPlaces();
    setPlaces(loaded);
    setIsLoaded(true);
  }, []);

  // Lista dos já visitados (BEEN), ordenados por rankingPosition crescente
  const rankedPlaces = useMemo(() => {
    return places
      .filter((p) => p.status === 'BEEN' && typeof p.rankingPosition === 'number')
      .sort((a, b) => (a.rankingPosition ?? 0) - (b.rankingPosition ?? 0));
  }, [places]);

  // Lista dos que deseja visitar (WANT_TO_TRY)
  const wantToTryPlaces = useMemo(() => {
    return places.filter((p) => p.status === 'WANT_TO_TRY');
  }, [places]);

  // Culinárias e tags únicas extraídas dos dados atuais
  const availableCuisines = useMemo(() => {
    const set = new Set<string>();
    places.forEach((p) => {
      if (p.cuisine) set.add(p.cuisine);
    });
    return Array.from(set).sort();
  }, [places]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    places.forEach((p) => {
      p.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [places]);

  // Função auxiliar de filtragem
  const applyFilters = useCallback(
    (list: Place[]) => {
      return list.filter((place) => {
        // Busca por texto livre (nome, culinária, endereço, notas)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = place.name.toLowerCase().includes(q);
          const matchCuisine = place.cuisine.toLowerCase().includes(q);
          const matchAddress = place.address.toLowerCase().includes(q);
          const matchNotes = place.notes?.toLowerCase().includes(q) ?? false;
          if (!matchName && !matchCuisine && !matchAddress && !matchNotes) {
            return false;
          }
        }

        // Culinária
        if (filters.cuisine && place.cuisine !== filters.cuisine) {
          return false;
        }

        // Faixa de preço
        if (filters.priceRange && place.priceRange !== filters.priceRange) {
          return false;
        }

        // Tags (deve conter todas as tags selecionadas)
        if (filters.selectedTags.length > 0) {
          const hasAllTags = filters.selectedTags.every((t) => place.tags.includes(t));
          if (!hasAllTags) return false;
        }

        return true;
      });
    },
    [filters]
  );

  const filteredRankedPlaces = useMemo(() => applyFilters(rankedPlaces), [applyFilters, rankedPlaces]);
  const filteredWantToTryPlaces = useMemo(
    () => applyFilters(wantToTryPlaces),
    [applyFilters, wantToTryPlaces]
  );

  // Executa rebalanceamento se necessário
  const checkAndExecuteRebalance = useCallback((currentPlaces: Place[]) => {
    const beenPlaces = currentPlaces
      .filter((p) => p.status === 'BEEN' && typeof p.rankingPosition === 'number')
      .sort((a, b) => (a.rankingPosition ?? 0) - (b.rankingPosition ?? 0));

    if (needsRebalancing(beenPlaces)) {
      const rebalanced = rebalancePositions(beenPlaces);
      const rebalanceMap = new Map(rebalanced.map((r) => [r.id, r.rankingPosition]));
      const updated = currentPlaces.map((p) => {
        if (rebalanceMap.has(p.id)) {
          return { ...p, rankingPosition: rebalanceMap.get(p.id)! };
        }
        return p;
      });
      PlacesStorageService.saveLocalPlaces(updated);
      setPlaces(updated);
    }
  }, []);

  // Adicionar novo restaurante
  const addPlace = useCallback(
    (placeData: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => {
      const created = PlacesStorageService.addPlace(placeData);
      const updatedPlaces = [created, ...places];
      setPlaces(updatedPlaces);

      if (created.status === 'BEEN') {
        checkAndExecuteRebalance(updatedPlaces);
      }

      return created;
    },
    [places, checkAndExecuteRebalance]
  );

  // Atualizar restaurante existente
  const updatePlace = useCallback(
    (id: string, updates: Partial<Place>) => {
      const updated = PlacesStorageService.updatePlace(id, updates);
      if (updated) {
        const nextList = places.map((p) => (p.id === id ? updated : p));
        setPlaces(nextList);
        checkAndExecuteRebalance(nextList);
      }
    },
    [places, checkAndExecuteRebalance]
  );

  // Deletar restaurante
  const deletePlace = useCallback(
    (id: string) => {
      const success = PlacesStorageService.deletePlace(id);
      if (success) {
        setPlaces((prev) => prev.filter((p) => p.id !== id));
      }
    },
    []
  );

  // Resetar para demonstração inicial
  const resetToLondonMock = useCallback(() => {
    const demo = PlacesStorageService.resetToDemoData();
    setPlaces(demo);
    setFilters(initialFilters);
  }, []);

  // Iniciar comparação Head-to-Head
  const startComparison = useCallback((place: Place) => {
    setComparisonCandidate(place);
  }, []);

  // Finalizar duelo Head-to-Head e salvar a nova posição
  const finishComparison = useCallback(
    (result: { newPosition: number }) => {
      if (!comparisonCandidate) return;

      updatePlace(comparisonCandidate.id, {
        status: 'BEEN',
        rankingPosition: result.newPosition,
      });

      setComparisonCandidate(null);
    },
    [comparisonCandidate, updatePlace]
  );

  const cancelComparison = useCallback(() => {
    setComparisonCandidate(null);
  }, []);

  const importPlaces = useCallback((imported: Place[]) => {
    PlacesStorageService.saveLocalPlaces(imported);
    setPlaces(imported);
    checkAndExecuteRebalance(imported);
  }, [checkAndExecuteRebalance]);

  return (
    <PlacesContext.Provider
      value={{
        places,
        rankedPlaces,
        wantToTryPlaces,
        filteredRankedPlaces,
        filteredWantToTryPlaces,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        availableCuisines,
        availableTags,
        addPlace,
        updatePlace,
        deletePlace,
        resetToLondonMock,
        importPlaces,
        comparisonCandidate,
        startComparison,
        finishComparison,
        cancelComparison,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};

export const usePlaces = () => {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces deve ser usado dentro de um PlacesProvider');
  }
  return context;
};
