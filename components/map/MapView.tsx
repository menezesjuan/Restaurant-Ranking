'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Place } from '@/types/place';
import { useLanguage } from '@/contexts/LanguageContext';

const MapLoading: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAFAF8] dark:bg-[#121614] text-[#71716A] dark:text-[#8E968E] gap-3">
      <div className="w-8 h-8 border-2 border-[#1C4434] dark:border-[#45B887] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">{t('map.loading')}</p>
    </div>
  );
};

// Importação dinâmica segura para desativar SSR do Leaflet
const DynamicLeafletMap = dynamic(
  () => import('./LeafletMap').then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => <MapLoading />,
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
