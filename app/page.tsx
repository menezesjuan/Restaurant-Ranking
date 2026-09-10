'use client';

import React, { useState } from 'react';
import { PlacesProvider, usePlaces } from '@/contexts/PlacesContext';
import { MapSelectionProvider, useMapSelection } from '@/contexts/MapSelectionContext';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { MapView } from '@/components/map/MapView';
import { ComparisonModal } from '@/components/modals/ComparisonModal';
import { DeciderModal } from '@/components/modals/DeciderModal';
import { AddPlaceModal } from '@/components/modals/AddPlaceModal';
import { List, Map as MapIcon, Compass, Plus, X, MapPin, Swords } from 'lucide-react';

function TastemapApp() {
  const {
    places,
    rankedPlaces,
    filteredRankedPlaces,
    filteredWantToTryPlaces,
    activeTab,
    comparisonCandidate,
    finishComparison,
    cancelComparison,
    addPlace,
    startComparison,
  } = usePlaces();

  const { selectedPlaceId, selectPlaceFromList, clearSelection } = useMapSelection();

  const [mobileView, setMobileView] = useState<'LIST' | 'MAP'>('LIST');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeciderOpen, setIsDeciderOpen] = useState(false);

  // Restaurante selecionado para o bottom sheet mobile
  const selectedPlace = React.useMemo(() => {
    if (!selectedPlaceId) return null;
    return places.find((p) => p.id === selectedPlaceId) || null;
  }, [selectedPlaceId, places]);

  const handleSaveNewPlace = (placeData: any) => {
    const created = addPlace(placeData);
    if (created.status === 'BEEN') {
      // Abre imediatamente o duelo para ranqueá-lo
      startComparison(created);
    }
  };

  return (
    <div className="relative w-screen h-screen flex flex-col md:flex-row overflow-hidden bg-slate-950">
      {/* Coluna Esquerda: 40% Desktop, Fullscreen no Mobile quando LIST */}
      <div
        className={`w-full md:w-[420px] lg:w-[480px] xl:w-[520px] h-full flex flex-col shrink-0 transition-all ${
          mobileView === 'LIST' ? 'flex' : 'hidden md:flex'
        }`}
      >
        <Sidebar
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenDeciderModal={() => setIsDeciderOpen(true)}
        />
      </div>

      {/* Coluna Direita: 60% Desktop, Fullscreen no Mobile quando MAP */}
      <div
        className={`flex-1 h-full relative overflow-hidden bg-slate-900 ${
          mobileView === 'MAP' ? 'flex' : 'hidden md:flex'
        }`}
      >
        <MapView
          places={activeTab === 'RANKED' ? filteredRankedPlaces : filteredWantToTryPlaces}
          rankedPlaces={rankedPlaces}
          onPlaceSelect={(place) => {
            selectPlaceFromList(place);
          }}
        />

        {/* Bottom Sheet Mobile quando um restaurante for clicado no mapa */}
        {selectedPlace && mobileView === 'MAP' && (
          <div className="md:hidden absolute bottom-16 left-3 right-3 z-30 p-4 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedPlace.status === 'BEEN' ? 'Ranqueado' : 'Quero Conhecer'}
                </span>
                <h4 className="font-bold text-base text-white mt-1">{selectedPlace.name}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span className="truncate">{selectedPlace.address}</span>
                </p>
              </div>
              <button
                onClick={clearSelection}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedPlace.status === 'WANT_TO_TRY' && (
              <button
                onClick={() => {
                  startComparison(selectedPlace);
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Experimentei! Disputar Duelo de Ranking</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Barra de Navegação Mobile Inferior (Tabs: Lista vs Mapa) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md flex items-center justify-around z-40 px-4">
        <button
          onClick={() => setMobileView('LIST')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-4 rounded-xl transition-all ${
            mobileView === 'LIST' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <List className="w-5 h-5" />
          <span>Lista</span>
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-10 h-10 -mt-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-slate-900"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={() => setMobileView('MAP')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-4 rounded-xl transition-all ${
            mobileView === 'MAP' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapIcon className="w-5 h-5" />
          <span>Mapa</span>
        </button>
      </div>

      {/* Modal de Duelo Head-to-Head */}
      {comparisonCandidate && (
        <ComparisonModal
          candidate={comparisonCandidate}
          rankedPlaces={rankedPlaces}
          onComplete={finishComparison}
          onCancel={cancelComparison}
        />
      )}

      {/* Modal Decisor Rápido "Where Should We Eat?" */}
      <DeciderModal
        isOpen={isDeciderOpen}
        onClose={() => setIsDeciderOpen(false)}
        places={places}
        onSelectPlaceOnMap={(place) => {
          selectPlaceFromList(place);
          setMobileView('MAP');
        }}
      />

      {/* Modal de Adicionar Restaurante */}
      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSavePlace={handleSaveNewPlace}
      />
    </div>
  );
}

export default function Home() {
  return (
    <PlacesProvider>
      <MapSelectionProvider>
        <TastemapApp />
      </MapSelectionProvider>
    </PlacesProvider>
  );
}
