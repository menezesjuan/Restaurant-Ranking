'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Place, PlaceStatus } from '@/types/place';
import { searchAddressNominatim, GeocodingResult } from '@/lib/geocoding';
import {
  X,
  MapPin,
  Search,
  Sparkles,
  Loader2,
  Plus,
  SlidersHorizontal,
  Utensils,
  DollarSign,
  Bookmark,
  Trophy,
} from 'lucide-react';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlace: (place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const COMMON_TAGS = [
  'Dinner',
  'Lunch',
  'Casual',
  'Date Night',
  'Fine Dining',
  'Cocktails',
  'Cozy',
  'Street Food',
  'Vegetarian-Friendly',
  'Outdoor Seating',
];

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onSavePlace,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [cuisine, setCuisine] = useState('');
  const [priceRange, setPriceRange] = useState<'$' | '$$' | '$$$' | '$$$$'>('$$');
  const [status, setStatus] = useState<PlaceStatus>('BEEN');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  // Geocoding state
  const [searchQuery, setSearchQuery] = useState('');
  const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>([]);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [showManualCoords, setShowManualCoords] = useState(false);

  // Debounced search para o Nominatim
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setGeocodingResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingGeocode(true);
      const results = await searchAddressNominatim(searchQuery);
      setGeocodingResults(results);
      setIsSearchingGeocode(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectGeocodingResult = (result: GeocodingResult) => {
    setAddress(result.display_name);
    setLatitude(parseFloat(result.lat));
    setLongitude(parseFloat(result.lon));

    // Se o nome estiver vazio, sugere a primeira parte do display_name
    if (!name) {
      const suggestedName = result.display_name.split(',')[0].trim();
      setName(suggestedName);
    }

    setGeocodingResults([]);
    setSearchQuery('');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags((prev) => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    // Coordenadas padrão se não especificadas (Londres Central)
    const lat = latitude ?? 51.5074;
    const lng = longitude ?? -0.1278;

    onSavePlace({
      name: name.trim(),
      address: address.trim() || 'Londres, Reino Unido',
      latitude: lat,
      longitude: lng,
      cuisine: cuisine.trim() || 'Geral',
      priceRange,
      status,
      rankingPosition: null, // Será determinado pelo duelo se status === 'BEEN'
      notes: notes.trim() || null,
      tags: selectedTags,
    });

    // Limpa o formulário e fecha
    setName('');
    setAddress('');
    setLatitude(null);
    setLongitude(null);
    setCuisine('');
    setNotes('');
    setSelectedTags([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Adicionar Restaurante
              </h2>
              <p className="text-xs text-slate-400">
                Cadastre um novo local para ranquear ou guardar na lista de desejos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status: BEEN vs WANT_TO_TRY */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Status da Experiência
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('BEEN')}
                className={`py-3 px-4 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  status === 'BEEN'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/25'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Já Visitei (Ranqueado)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('WANT_TO_TRY')}
                className={`py-3 px-4 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  status === 'WANT_TO_TRY'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/25'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Quero Conhecer</span>
              </button>
            </div>
          </div>

          {/* Nome do Local */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Nome do Restaurante *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Dishoom, Padella, The Ledbury..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Geocoding / Busca de Endereço com Nominatim */}
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Buscar Endereço (OpenStreetMap Nominatim)</span>
              {isSearchingGeocode && (
                <span className="text-[11px] text-amber-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Buscando no mapa...
                </span>
              )}
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="Digite o endereço ou nome do local para autocompletar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            {/* Dropdown de Resultados do Nominatim */}
            {geocodingResults.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                {geocodingResults.map((result) => (
                  <button
                    key={result.place_id}
                    type="button"
                    onClick={() => handleSelectGeocodingResult(result)}
                    className="w-full p-2.5 text-left text-xs text-slate-200 hover:bg-slate-700/80 border-b border-slate-700 last:border-0 flex items-start gap-2 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="truncate">{result.display_name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Endereço selecionado */}
            {address && (
              <div className="mt-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex items-center justify-between gap-2">
                <span className="truncate flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {address}
                </span>
                {latitude && longitude && (
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </span>
                )}
              </div>
            )}

            {/* Toggle Coordenadas Manuais */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowManualCoords(!showManualCoords)}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{showManualCoords ? 'Ocultar Coordenadas' : 'Inserir Coordenadas Manualmente'}</span>
              </button>

              {showManualCoords && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-[11px] text-slate-400">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 51.5126"
                      value={latitude ?? ''}
                      onChange={(e) => setLatitude(parseFloat(e.target.value) || null)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: -0.1268"
                      value={longitude ?? ''}
                      onChange={(e) => setLongitude(parseFloat(e.target.value) || null)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Culinária e Faixa de Preço */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Culinária / Especialidade
              </label>
              <input
                type="text"
                placeholder="Ex: Italiana, Indiana, Burger..."
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Faixa de Preço
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['$', '$$', '$$$', '$$$$'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPriceRange(tier)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      priceRange === tier
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Tags & Ocasiões
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Inserir Tag Customizada */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar tag personalizada..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs rounded-lg font-medium text-slate-200"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Notas / Anotações Pessoais */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Notas & Pratos Recomendados
            </label>
            <textarea
              rows={2}
              placeholder="Ex: O prato de massa artesanal e a sobremesa são imperdíveis..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Botão de submissão */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {status === 'BEEN'
                  ? 'Salvar e Iniciar Duelo de Ranking'
                  : 'Salvar na Lista Quero Conhecer'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
