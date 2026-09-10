'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Place } from '@/types/place';

// Importação dinâmica segura para desativar SSR do Leaflet
const DynamicLeafletMap = dynamic(
  () => import('./LeafletMap').then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Carregando mapa interativo...</p>
      </div>
    ),
  }
);

interface MapViewProps {
  places: Place[];
  rankedPlaces: Place[];
  onPlaceSelect?: (place: Place) => void;
}

export const MapView: React.FC<MapViewProps> = (props) => {
  return <DynamicLeafletMap {...props} />;
};
