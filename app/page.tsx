'use client';

import React, { useState } from 'react';
import { PlacesProvider, usePlaces } from '@/contexts/PlacesContext';
import { MapSelectionProvider, useMapSelection } from '@/contexts/MapSelectionContext';
import { TopNavbar } from '@/components/header/TopNavbar';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { MapView } from '@/components/map/MapView';
import { ComparisonModal } from '@/components/modals/ComparisonModal';
import { DeciderModal } from '@/components/modals/DeciderModal';
import { AddPlaceModal } from '@/components/modals/AddPlaceModal';
import { PlaceDetailModal } from '@/components/modals/PlaceDetailModal';
import { BackupModal } from '@/components/modals/BackupModal';
import { TasteInsightsModal } from '@/components/modals/TasteInsightsModal';
import { Place } from '@/types/place';
import { List, Map as MapIcon, X, MapPin, Swords, Eye } from 'lucide-react';

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
    updatePlace,
    deletePlace,
    startComparison,
    importPlaces,
  } = usePlaces();

  const { selectedPlaceId, selectPlaceFromList, clearSelection } = useMapSelection();

  const [mobileView, setMobileView] = useState<'LIST' | 'MAP'>('LIST');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeciderOpen, setIsDeciderOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [inspectingPlace, setInspectingPlace] = useState<Place | null>(null);

  // Restaurante selecionado para o bottom sheet mobile ou detalhes
  const selectedPlace = React.useMemo(() => {
    if (!selectedPlaceId) return null;
    return places.find((p) => p.id === selectedPlaceId) || null;
  }, [selectedPlaceId, places]);

  const selectedPlaceRank = React.useMemo(() => {
    if (!selectedPlace) return undefined;
    const idx = rankedPlaces.findIndex((p) => p.id === selectedPlace.id);
    return idx >= 0 ? idx + 1 : undefined;
  }, [selectedPlace, rankedPlaces]);

  const handleSaveNewPlace = (placeData: any) => {
    const created = addPlace(placeData);
    if (created.status === 'BEEN') {
      startComparison(created);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#FAFAF8] dark:bg-[#0D110F] text-[#191917] dark:text-[#F0F2EE]">
      {/* Barra de Navegação Superior Completa (TopNavbar) */}
      <TopNavbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        onOpenInsightsModal={() => setIsInsightsOpen(true)}
      />

      {/* Split-Screen Principal */}
      <div className="flex-1 w-full flex flex-col md:flex-row overflow-hidden relative">
        {/* Coluna Esquerda: Sidebar */}
        <div
          className={`w-full md:w-[440px] lg:w-[480px] xl:w-[500px] h-full flex flex-col shrink-0 transition-all ${
            mobileView === 'LIST' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <Sidebar
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenDeciderModal={() => setIsDeciderOpen(true)}
            onInspectPlace={(place) => setInspectingPlace(place)}
          />
        </div>

        {/* Coluna Direita: Mapa Interativo */}
        <div
          className={`flex-1 h-full relative overflow-hidden bg-[#F4F3F0] dark:bg-[#121614] ${
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

          {/* Bottom Sheet Mobile ao clicar em pin no mapa */}
          {selectedPlace && mobileView === 'MAP' && (
            <div className="md:hidden absolute bottom-16 left-3 right-3 z-30 p-4 rounded-2xl bg-white dark:bg-[#161C19] border border-[#EAEAE5] dark:border-[#252E28] shadow-xl animate-in slide-in-from-bottom duration-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF5F1] dark:bg-[#202924] text-[#1C4434] dark:text-[#45B887] border border-[#D2E2D6] dark:border-[#2C3B32]">
                    {selectedPlace.status === 'BEEN' ? 'Ranked' : 'Want to try'}
                  </span>
                  <h4 className="font-bold text-base text-[#141814] dark:text-white mt-1">
                    {selectedPlace.name}
                  </h4>
                  <p className="text-xs text-[#71716A] dark:text-[#8E968E] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#1C4434]" />
                    <span className="truncate">{selectedPlace.address}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setInspectingPlace(selectedPlace)}
                    className="p-1 rounded-lg text-[#888880] hover:text-[#1C4434]"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearSelection}
                    className="p-1 rounded-lg text-[#888880] hover:text-[#141814]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedPlace.status === 'WANT_TO_TRY' && (
                <button
                  onClick={() => {
                    startComparison(selectedPlace);
                  }}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-[#1C4434] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Experimentei! Disputar Duelo de Ranking</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Barra de Navegação Mobile Inferior */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white dark:bg-[#141A17] border-t border-[#EAEAE5] dark:border-[#222924] flex items-center justify-around z-40 px-4">
        <button
          onClick={() => setMobileView('LIST')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-4 rounded-xl transition-all ${
            mobileView === 'LIST' ? 'text-[#1C4434] dark:text-[#45B887]' : 'text-[#8A8A80]'
          }`}
        >
          <List className="w-5 h-5" />
          <span>Lista</span>
        </button>

        <button
          onClick={() => setMobileView('MAP')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-4 rounded-xl transition-all ${
            mobileView === 'MAP' ? 'text-[#1C4434] dark:text-[#45B887]' : 'text-[#8A8A80]'
          }`}
        >
          <MapIcon className="w-5 h-5" />
          <span>Mapa</span>
        </button>
      </div>

      {/* Modal de Detalhes do Restaurante */}
      {inspectingPlace && (
        <PlaceDetailModal
          place={inspectingPlace}
          rankNumber={selectedPlaceRank}
          onClose={() => setInspectingPlace(null)}
          onUpdate={updatePlace}
          onRerank={(p) => {
            setInspectingPlace(null);
            startComparison(p);
          }}
          onDelete={deletePlace}
        />
      )}

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

      {/* Modal de Backup & Exportação/Importação */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        places={places}
        onImportPlaces={importPlaces}
      />

      {/* Modal de Perfil Gastronômico & Estatísticas */}
      <TasteInsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        places={places}
        onSelectPlace={(place) => {
          selectPlaceFromList(place);
        }}
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
