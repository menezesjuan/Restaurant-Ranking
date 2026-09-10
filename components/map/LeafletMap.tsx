'use client';

import React, { useEffect, useRef } from 'react';
import { Place } from '@/types/place';
import { useMapSelection } from '@/contexts/MapSelectionContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  places: Place[];
  rankedPlaces: Place[];
  onPlaceSelect?: (place: Place) => void;
  onPromoteToRanked?: (place: Place) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  places,
  rankedPlaces,
  onPlaceSelect,
  onPromoteToRanked,
}) => {
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

  // Inicializa o mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centro inicial em Londres
    const map = L.map(mapContainerRef.current, {
      center: [51.5135, -0.128],
      zoom: 13,
      zoomControl: false,
    });

    // Adiciona controle de zoom no canto superior direito
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Tiles limpos do CartoDB Dark Matter / Positron ou OSM Standard
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

  // Atualiza marcadores quando a lista de lugares muda
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Limpa marcadores antigos
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    places.forEach((place) => {
      const isBeen = place.status === 'BEEN';
      const rankNumber = rankingPositionMap.get(place.id);
      const isSelected = selectedPlaceId === place.id;

      // Cria HTML customizado para o marcador
      const markerHtml = isBeen
        ? `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white">
            ${rankNumber ? `#${rankNumber}` : '★'}
          </div>
          <div class="absolute -bottom-1 w-2 h-2 bg-amber-600 rotate-45"></div>
        </div>
      `
        : `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white">
            🔖
          </div>
          <div class="absolute -bottom-1 w-2 h-2 bg-cyan-600 rotate-45"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-pin-marker',
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([place.latitude, place.longitude], { icon: customIcon });

      // Cria conteúdo do Popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 text-slate-900 min-w-[200px]';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isBeen
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-cyan-100 text-cyan-900 border border-cyan-300'
          }">
            ${isBeen ? (rankNumber ? `Ranking #${rankNumber}` : 'Já Visitado') : 'Quero Conhecer'}
          </span>
          <span class="text-xs font-bold text-slate-600">${place.priceRange}</span>
        </div>
        <h4 class="font-bold text-base text-slate-900 leading-snug">${place.name}</h4>
        <p class="text-xs text-slate-600 mt-0.5">${place.cuisine}</p>
        <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">${place.address}</p>
        ${
          place.notes
            ? `<p class="text-[11px] italic text-slate-700 bg-slate-100 p-1.5 rounded mt-2">"${place.notes}"</p>`
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

    // Se houver lugares, ajusta os limites do mapa suavemente para abranger todos
    if (places.length > 0 && !flyToTarget) {
      const bounds = L.latLngBounds(places.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [places, rankingPositionMap, selectedPlaceId, selectPlaceFromMap, onPlaceSelect]);

  // Efeito para flyTo suave quando acionado pela lista
  useEffect(() => {
    if (!flyToTarget || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom ?? 16, {
      duration: 1.2,
    });

    // Se houver marcador selecionado, abre o popup
    if (selectedPlaceId && markersRef.current.has(selectedPlaceId)) {
      const marker = markersRef.current.get(selectedPlaceId);
      setTimeout(() => {
        marker?.openPopup();
      }, 600);
    }
  }, [flyToTarget, selectedPlaceId]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />
      
      {/* Legenda de Pins flutuante */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-xl flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white"></span>
          <span className="text-slate-200 font-medium">Já Visitado (BEEN)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white"></span>
          <span className="text-slate-200 font-medium">Quero Conhecer (WANT)</span>
        </div>
      </div>
    </div>
  );
};
