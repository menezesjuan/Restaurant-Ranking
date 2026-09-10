'use client';

import React, { useState, useEffect } from 'react';
import { Place, PlaceStatus } from '@/types/place';
import { searchAddressNominatim, GeocodingResult } from '@/lib/geocoding';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  X,
  MapPin,
  Search,
  Sparkles,
  Loader2,
  Plus,
  SlidersHorizontal,
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
  'Wood Fired',
];

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onSavePlace,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [cuisine, setCuisine] = useState('');
  const [priceRange, setPriceRange] = useState<'£' | '££' | '£££' | '££££'>('££');
  const [status, setStatus] = useState<PlaceStatus>('BEEN');
  const [timesVisited, setTimesVisited] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  // Geocoding state
  const [searchQuery, setSearchQuery] = useState('');
  const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>([]);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [showManualCoords, setShowManualCoords] = useState(false);

  // Debounced search para Nominatim
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

    const parts = result.display_name.split(',');
    if (!name && parts[0]) {
      setName(parts[0].trim());
    }
    if (parts[1]) {
      setNeighborhood(parts[1].trim());
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

    const lat = latitude ?? 51.5074;
    const lng = longitude ?? -0.1278;

    // Gera avatar inicial com base no nome
    const words = name.trim().split(' ');
    const avatar = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : name.substring(0, 3).toUpperCase();
    const bgColors = ['#C67D43', '#1C4434', '#4A2840', '#1A1A1A', '#273746', '#B03A2E'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    onSavePlace({
      name: name.trim(),
      address: address.trim() || 'London, United Kingdom',
      neighborhood: neighborhood.trim() || (address.split(',')[1]?.trim() || 'London'),
      latitude: lat,
      longitude: lng,
      cuisine: cuisine.trim() || 'General',
      priceRange,
      status,
      rankingPosition: null,
      notes: notes.trim() || null,
      tags: selectedTags,
      timesVisited: status === 'BEEN' ? timesVisited : 0,
      avatarText: avatar,
      avatarBg: randomBg,
    });

    // Limpa estado e fecha
    setName('');
    setAddress('');
    setNeighborhood('');
    setLatitude(null);
    setLongitude(null);
    setCuisine('');
    setNotes('');
    setSelectedTags([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-[#EAEAE5] rounded-2xl shadow-2xl overflow-hidden text-[#191917] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAEAE5] flex items-center justify-between bg-[#FAFAF8]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C4434] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#141814]">
                {t('addModal.title')}
              </h2>
              <p className="text-xs text-[#71716A]">
                {t('addModal.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71716A] hover:text-[#141814] hover:bg-[#EAEAE5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status: BEEN vs WANT_TO_TRY */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555A54] mb-2">
              {t('details.status')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('BEEN')}
                className={`py-2.5 px-4 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  status === 'BEEN'
                    ? 'bg-[#1C4434] text-white border-[#1C4434] shadow-sm'
                    : 'bg-[#F4F4F0] text-[#555A54] border-[#EAEAE5] hover:bg-[#EAEAE5]'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>{t('details.beenRanked')}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('WANT_TO_TRY')}
                className={`py-2.5 px-4 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  status === 'WANT_TO_TRY'
                    ? 'bg-[#C88A35] text-white border-[#C88A35] shadow-sm'
                    : 'bg-[#F4F4F0] text-[#555A54] border-[#EAEAE5] hover:bg-[#EAEAE5]'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{t('details.wantToTry')}</span>
              </button>
            </div>
          </div>

          {/* Nome e Bairro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555A54] mb-1.5">
                {t('addModal.nameLabel')} *
              </label>
              <input
                type="text"
                required
                placeholder={t('addModal.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FBFBF9] border border-[#E0E0D8] rounded-xl px-3.5 py-2 text-sm text-[#141814] focus:outline-none focus:ring-2 focus:ring-[#1C4434]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#555A54] mb-1.5">
                {t('addModal.neighborhoodLabel')}
              </label>
              <input
                type="text"
                placeholder={t('addModal.neighborhoodPlaceholder')}
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-[#FBFBF9] border border-[#E0E0D8] rounded-xl px-3.5 py-2 text-sm text-[#141814] focus:outline-none focus:ring-2 focus:ring-[#1C4434]/30"
              />
            </div>
          </div>

          {/* Busca de Endereço via Nominatim */}
          <div className="relative">
            <label className="block text-xs font-bold text-[#555A54] mb-1.5 flex items-center justify-between">
              <span>{t('addModal.searchOsm')}</span>
              {isSearchingGeocode && (
                <span className="text-[11px] text-[#1C4434] flex items-center gap-1 font-normal">
                  <Loader2 className="w-3 h-3 animate-spin" /> {t('addModal.searching')}
                </span>
              )}
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder={t('addModal.addressPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FBFBF9] border border-[#E0E0D8] rounded-xl pl-9 pr-4 py-2 text-sm text-[#141814] focus:outline-none focus:ring-2 focus:ring-[#1C4434]/30"
              />
              <Search className="w-4 h-4 text-[#8A8A80] absolute left-3 top-2.5" />
            </div>

            {/* Resultados dropdown do Nominatim */}
            {geocodingResults.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#E0E0D8] rounded-xl shadow-xl max-h-48 overflow-y-auto">
                {geocodingResults.map((result) => (
                  <button
                    key={result.place_id}
                    type="button"
                    onClick={() => handleSelectGeocodingResult(result)}
                    className="w-full p-2.5 text-left text-xs text-[#2E332E] hover:bg-[#EFF5F1] border-b border-[#F0F0EA] last:border-0 flex items-start gap-2 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-[#1C4434] shrink-0 mt-0.5" />
                    <span className="truncate">{result.display_name}</span>
                  </button>
                ))}
              </div>
            )}

            {address && (
              <div className="mt-2 p-2 rounded-xl bg-[#F6F8F6] border border-[#E0EADF] text-xs text-[#2A4D39] flex items-center justify-between">
                <span className="truncate flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {address}
                </span>
              </div>
            )}

            {/* Toggle manual de coordenadas */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowManualCoords(!showManualCoords)}
                className="text-xs text-[#71716A] hover:text-[#1C4434] flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{showManualCoords ? t('addModal.hideCoords') : t('addModal.manualCoords')}</span>
              </button>

              {showManualCoords && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-[11px] text-[#71716A]">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="51.5126"
                      value={latitude ?? ''}
                      onChange={(e) => setLatitude(parseFloat(e.target.value) || null)}
                      className="w-full bg-[#FBFBF9] border border-[#E0E0D8] rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#71716A]">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="-0.1268"
                      value={longitude ?? ''}
                      onChange={(e) => setLongitude(parseFloat(e.target.value) || null)}
                      className="w-full bg-[#FBFBF9] border border-[#E0E0D8] rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Culinária e Faixa de Preço */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555A54] mb-1.5">
                {t('addModal.cuisineLabel')}
              </label>
              <input
                type="text"
                placeholder={t('addModal.cuisinePlaceholder')}
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full bg-[#FBFBF9] border border-[#E0E0D8] rounded-xl px-3.5 py-2 text-sm text-[#141814] focus:outline-none focus:ring-2 focus:ring-[#1C4434]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#555A54] mb-1.5">
                {t('addModal.priceLabel')}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['£', '££', '£££', '££££'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPriceRange(tier)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      priceRange === tier
                        ? 'bg-[#1C4434] text-white border-[#1C4434]'
                        : 'bg-[#F4F4F0] text-[#555A54] border-[#EAEAE5] hover:bg-[#EAEAE5]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Número de visitas se BEEN */}
          {status === 'BEEN' && (
            <div>
              <label className="block text-xs font-bold text-[#555A54] mb-1.5">
                {t('addModal.visitsLabel')}
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={timesVisited}
                onChange={(e) => setTimesVisited(parseInt(e.target.value) || 1)}
                className="w-28 bg-[#FBFBF9] border border-[#E0E0D8] rounded-xl px-3.5 py-1.5 text-sm"
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-[#555A54] mb-1.5">
              {t('addModal.tagsLabel')}
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
                        ? 'bg-[#1C4434] text-white border-[#1C4434]'
                        : 'bg-[#F4F4F0] text-[#555A54] border-[#EAEAE5] hover:bg-[#EAEAE5]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('addModal.customTagPlaceholder')}
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="flex-1 bg-[#FBFBF9] border border-[#E0E0D8] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1C4434]"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 bg-[#EAEAE5] hover:bg-[#DCDCD5] text-xs rounded-lg font-medium text-[#2E332E]"
              >
                {t('addModal.addTag')}
              </button>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-bold text-[#555A54] mb-1.5">
              {t('addModal.notesLabel')}
            </label>
            <textarea
              rows={2}
              placeholder={t('addModal.notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#FBFBF9] border border-[#E0E0D8] rounded-xl px-3.5 py-2 text-sm text-[#141814] focus:outline-none focus:ring-2 focus:ring-[#1C4434]/30"
            />
          </div>

          {/* Botão de Envio */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-full font-bold text-sm bg-[#1C4434] hover:bg-[#153629] text-white shadow-md shadow-[#1C4434]/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {status === 'BEEN'
                  ? t('addModal.saveBeen')
                  : t('addModal.saveWant')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
