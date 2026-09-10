'use client';

import React, { useEffect, useRef } from 'react';
import { Place } from '@/types/place';
import { useMapSelection } from '@/contexts/MapSelectionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  places: Place[];
  rankedPlaces: Place[];
  onPlaceSelect?: (place: Place) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  places,
  rankedPlaces,
  onPlaceSelect,
}) => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const { selectedPlaceId, flyToTarget, selectPlaceFromMap } = useMapSelection();

  // Mapeia posições de ranking (1-based index)
  const rankingPositionMap = React.useMemo(() => {
    const map = new Map<string, number>();
    rankedPlaces.forEach((p, idx) => {
      map.set(p.id, idx + 1);
    });
    return map;
  }, [rankedPlaces]);

  // Inicializa o mapa com estilo idêntico ao design do desafio
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centraliza em Shoreditch / City of London
    const map = L.map(mapContainerRef.current, {
      center: [51.518, -0.09],
      zoom: 13,
      zoomControl: false,
    });

    // Controles de zoom no canto inferior esquerdo conforme a imagem de referência
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Tiles claros e elegantes do CartoDB Voyager
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Atualiza marcadores quando a lista muda
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Limpa marcadores antigos
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    places.forEach((place) => {
      const isBeen = place.status === 'BEEN';
      const rankNumber = rankingPositionMap.get(place.id);
      const isTopPick = rankNumber === 1;
      const isSelected = selectedPlaceId === place.id;

      // Marcador Teardrop idêntico ao design de referência do Frontend Mentor
      let markerHtml = '';

      if (isBeen) {
        markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
            isSelected ? 'scale-125 z-50' : 'hover:scale-110'
          }">
            ${
              isTopPick
                ? '<div class="absolute -inset-1.5 rounded-full bg-[#C88A35]/30 animate-pulse"></div>'
                : ''
            }
            <div class="w-8 h-8 rounded-full rounded-br-none -rotate-45 flex items-center justify-center shadow-lg border-2 border-white ${
              isTopPick
                ? 'bg-[#1C4434] ring-2 ring-[#C88A35]'
                : 'bg-[#1C4434]'
            }">
              <span class="rotate-45 text-white font-bold text-xs tracking-tight">
                ${rankNumber ?? ''}
              </span>
            </div>
          </div>
        `;
      } else {
        markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
            isSelected ? 'scale-125 z-50' : 'hover:scale-110'
          }">
            <div class="w-7 h-7 rounded-full rounded-br-none -rotate-45 flex items-center justify-center shadow-lg border-2 border-white bg-[#C88A35]">
              <span class="rotate-45 text-white font-bold text-[10px]">
                ★
              </span>
            </div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-pin-marker',
        iconSize: [32, 38],
        iconAnchor: [16, 38],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([place.latitude, place.longitude], { icon: customIcon });

      const statusBadge = isBeen
        ? (rankNumber ? t('map.rankedBadge', { rank: rankNumber }) : t('map.beenBadge'))
        : t('map.wantBadge');

      // Conteúdo do popup claro
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 text-[#181816] min-w-[200px]';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isBeen
              ? 'bg-[#EFF5F1] text-[#1C4434] border border-[#D2E2D6]'
              : 'bg-[#FDF6EC] text-[#C88A35] border border-[#F3DFC1]'
          }">
            ${statusBadge}
          </span>
          <span class="text-xs font-bold text-[#4B514A]">${place.priceRange}</span>
        </div>
        <h4 class="font-bold text-sm text-[#141814] leading-snug">${place.name}</h4>
        <p class="text-xs text-[#71716A] mt-0.5">${place.cuisine} • ${place.neighborhood || place.address.split(',')[0]}</p>
        ${
          place.notes
            ? `<p class="text-xs italic text-[#555A54] bg-[#F7F7F4] p-2 rounded mt-2 border border-[#EAEAE5]">"${place.notes}"</p>`
            : ''
        }
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        selectPlaceFromMap(place.id);
        if (onPlaceSelect) onPlaceSelect(place);
      });

      marker.addTo(map);
      markersRef.current.set(place.id, marker);
    });

    if (places.length > 0 && !flyToTarget) {
      const bounds = L.latLngBounds(places.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [places, rankingPositionMap, selectedPlaceId, selectPlaceFromMap, onPlaceSelect, t]);

  // Efeito para flyTo suave
  useEffect(() => {
    if (!flyToTarget || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom ?? 15, {
      duration: 1.2,
    });

    if (selectedPlaceId && markersRef.current.has(selectedPlaceId)) {
      const marker = markersRef.current.get(selectedPlaceId);
      setTimeout(() => {
        marker?.openPopup();
      }, 500);
    }
  }, [flyToTarget, selectedPlaceId]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />

      {/* Legenda flutuante no canto superior direito idêntica à imagem */}
      <div className="absolute top-4 right-4 z-10 bg-white px-4 py-2.5 rounded-xl border border-[#E4E4DC] shadow-md flex flex-col gap-1.5 text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1C4434]"></span>
          <span className="text-[#191917] font-medium">{t('map.legendBeen')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C88A35]"></span>
          <span className="text-[#191917] font-medium">{t('map.legendWant')}</span>
        </div>
      </div>
    </div>
  );
};
