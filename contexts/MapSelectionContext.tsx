'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Place } from '@/types/place';

interface MapSelectionContextValue {
  selectedPlaceId: string | null;
  hoveredPlaceId: string | null;
  flyToTarget: { lat: number; lng: number; zoom?: number } | null;
  selectPlaceFromList: (place: Place) => void;
  selectPlaceFromMap: (placeId: string) => void;
  setHoveredPlaceId: (id: string | null) => void;
  clearSelection: () => void;
}

const MapSelectionContext = createContext<MapSelectionContextValue | undefined>(undefined);

export const MapSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(
    null
  );

  /**
   * Acionado quando o usuário clica em um card na lista lateral.
   * Centraliza a câmera do mapa nas coordenadas do restaurante.
   */
  const selectPlaceFromList = useCallback((place: Place) => {
    setSelectedPlaceId(place.id);
    setFlyToTarget({ lat: place.latitude, lng: place.longitude, zoom: 16 });
  }, []);

  /**
   * Acionado quando o usuário clica em um pin no mapa.
   * Rola a lista suavemente até o elemento e destaca o card.
   */
  const selectPlaceFromMap = useCallback((placeId: string) => {
    setSelectedPlaceId(placeId);
    if (typeof window !== 'undefined') {
      const el = document.getElementById(`place-card-${placeId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPlaceId(null);
    setFlyToTarget(null);
  }, []);

  return (
    <MapSelectionContext.Provider
      value={{
        selectedPlaceId,
        hoveredPlaceId,
        flyToTarget,
        selectPlaceFromList,
        selectPlaceFromMap,
        setHoveredPlaceId,
        clearSelection,
      }}
    >
      {children}
    </MapSelectionContext.Provider>
  );
};

export const useMapSelection = () => {
  const context = useContext(MapSelectionContext);
  if (!context) {
    throw new Error('useMapSelection deve ser usado dentro de um MapSelectionProvider');
  }
  return context;
};
