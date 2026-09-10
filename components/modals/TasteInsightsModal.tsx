'use client';

import React from 'react';
import { Place } from '@/types/place';
import { calculateTasteInsights } from '@/lib/taste-insights';
import {
  X,
  Trophy,
  Flame,
  Utensils,
  MapPin,
  TrendingUp,
  CreditCard,
  Sparkles,
} from 'lucide-react';

interface TasteInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  onSelectPlace?: (place: Place) => void;
}

export const TasteInsightsModal: React.FC<TasteInsightsModalProps> = ({
  isOpen,
  onClose,
  places,
  onSelectPlace,
}) => {
  if (!isOpen) return null;

  const insights = calculateTasteInsights(places);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#141A17] border border-[#EAEAE5] dark:border-[#222924] rounded-3xl shadow-2xl overflow-hidden text-[#191917] dark:text-[#F0F2EE] flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <div className="px-6 py-5 border-b border-[#EAEAE5] dark:border-[#222924] flex items-center justify-between bg-[#FBFBFA] dark:bg-[#18201C] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1C4434]/10 dark:bg-[#45B887]/20 flex items-center justify-center text-[#1C4434] dark:text-[#45B887]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#141814] dark:text-[#F0F2EE]">
                Taste Profile & Insights
              </h2>
              <p className="text-xs text-[#71716A] dark:text-[#8E968E]">
                Personal dining statistics and culinary breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#888880] hover:text-[#141814] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Grid de Métricas Principais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Card 1: Total de Lugares */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8F5] dark:bg-[#1A221E] border border-[#EAEAE5] dark:border-[#26312B]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E968E] block">
                Total Places
              </span>
              <span className="font-serif text-2xl font-bold text-[#141814] dark:text-[#F0F2EE] mt-0.5 block">
                {insights.totalPlaces}
              </span>
              <span className="text-[10px] text-[#8A8A80] dark:text-[#7A847A]">
                {insights.beenCount} tried • {insights.wantToTryCount} wishlist
              </span>
            </div>

            {/* Card 2: % Visitados */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8F5] dark:bg-[#1A221E] border border-[#EAEAE5] dark:border-[#26312B]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E968E] block">
                Completion Rate
              </span>
              <span className="font-serif text-2xl font-bold text-[#1C4434] dark:text-[#45B887] mt-0.5 block">
                {insights.beenPercentage}%
              </span>
              <div className="w-full bg-[#E5E5DE] dark:bg-[#2A372F] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#1C4434] dark:bg-[#45B887] h-full rounded-full transition-all duration-500"
                  style={{ width: `${insights.beenPercentage}%` }}
                />
              </div>
            </div>

            {/* Card 3: Total de Visitas */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8F5] dark:bg-[#1A221E] border border-[#EAEAE5] dark:border-[#26312B]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E968E] block">
                Total Visits
              </span>
              <span className="font-serif text-2xl font-bold text-[#141814] dark:text-[#F0F2EE] mt-0.5 block">
                {insights.totalVisits}
              </span>
              <span className="text-[10px] text-[#8A8A80] dark:text-[#7A847A]">
                Meals logged
              </span>
            </div>

            {/* Card 4: Faixa Média */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8F5] dark:bg-[#1A221E] border border-[#EAEAE5] dark:border-[#26312B]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E968E] block">
                Avg Price Tier
              </span>
              <span className="font-serif text-2xl font-bold text-[#C88A35] dark:text-[#E2A64D] mt-0.5 block">
                {insights.averagePriceTier}
              </span>
              <span className="text-[10px] text-[#8A8A80] dark:text-[#7A847A]">
                Level {insights.averagePriceLevel} of 4.0
              </span>
            </div>
          </div>

          {/* Destaques: Top Pick & Most Visited */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Top Pick (#1 do Ranking) */}
            <div className="p-4 rounded-2xl bg-[#FBF7EE] dark:bg-[#1F1C16] border border-[#F0E6D2] dark:border-[#383120] relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#C88A35] dark:text-[#E2A64D] text-xs font-bold uppercase tracking-wider mb-2">
                <Trophy className="w-3.5 h-3.5" />
                <span>#1 Ranked Table</span>
              </div>
              {insights.topPick ? (
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => {
                    if (onSelectPlace && insights.topPick) {
                      onSelectPlace(insights.topPick);
                      onClose();
                    }
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm"
                    style={{ backgroundColor: insights.topPick.avatarBg || '#C67D43' }}
                  >
                    {insights.topPick.avatarText || insights.topPick.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#191917] dark:text-[#F0F2EE] group-hover:text-[#C88A35] transition-colors truncate">
                      {insights.topPick.name}
                    </h4>
                    <p className="text-xs text-[#71716A] dark:text-[#8E968E] truncate">
                      {insights.topPick.cuisine} • {insights.topPick.neighborhood || insights.topPick.address.split(',')[0]}
                    </p>
                    {insights.topPick.notes && (
                      <p className="text-[11px] text-[#8A8A80] dark:text-[#9DA49B] italic truncate mt-0.5">
                        &ldquo;{insights.topPick.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#8A8A80]">No ranked places yet. Run a duel to crown your #1!</p>
              )}
            </div>

            {/* Most Visited */}
            <div className="p-4 rounded-2xl bg-[#F3F7F5] dark:bg-[#16211C] border border-[#DCE8E0] dark:border-[#24372E] relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#1C4434] dark:text-[#45B887] text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Most Visited Staple</span>
              </div>
              {insights.mostVisited ? (
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => {
                    if (onSelectPlace && insights.mostVisited) {
                      onSelectPlace(insights.mostVisited);
                      onClose();
                    }
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm"
                    style={{ backgroundColor: insights.mostVisited.avatarBg || '#1C4434' }}
                  >
                    {insights.mostVisited.avatarText || insights.mostVisited.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#191917] dark:text-[#F0F2EE] group-hover:text-[#1C4434] dark:group-hover:text-[#45B887] transition-colors truncate">
                      {insights.mostVisited.name}
                    </h4>
                    <p className="text-xs text-[#71716A] dark:text-[#8E968E] truncate">
                      Visited {insights.mostVisited.timesVisited} times • {insights.mostVisited.cuisine}
                    </p>
                    <p className="text-[11px] text-[#1C4434] dark:text-[#45B887] font-medium mt-0.5">
                      Your go-to favorite
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#8A8A80]">No visit records logged yet.</p>
              )}
            </div>
          </div>

          {/* Distribuição de Culinárias */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71716A] dark:text-[#8E968E]">
              <Utensils className="w-3.5 h-3.5" />
              <span>Cuisine Preferences</span>
            </div>
            <div className="space-y-2">
              {insights.topCuisines.slice(0, 5).map((item) => (
                <div key={item.cuisine} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#191917] dark:text-[#F0F2EE]">{item.cuisine}</span>
                    <span className="text-[#71716A] dark:text-[#8E968E]">
                      {item.count} places ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EFEFEA] dark:bg-[#202924] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1C4434] dark:bg-[#45B887] h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuição de Preço e Bairros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#EAEAE5] dark:border-[#222924]">
            {/* Faixas de Preço */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71716A] dark:text-[#8E968E]">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Price Distribution</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {(['£', '££', '£££', '££££'] as const).map((tier) => {
                  const count = insights.priceDistribution[tier];
                  const isAverage = insights.averagePriceTier === tier;
                  return (
                    <div
                      key={tier}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isAverage
                          ? 'bg-[#1C4434]/10 dark:bg-[#45B887]/15 border-[#1C4434] dark:border-[#45B887]'
                          : 'bg-[#F8F8F5] dark:bg-[#1A221E] border-[#EAEAE5] dark:border-[#26312B]'
                      }`}
                    >
                      <span className="font-bold text-xs block text-[#141814] dark:text-[#F0F2EE]">
                        {tier}
                      </span>
                      <span className="font-serif text-lg font-bold text-[#1C4434] dark:text-[#45B887] block mt-0.5">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bairros mais frequentes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71716A] dark:text-[#8E968E]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Top Neighborhoods</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {insights.topNeighborhoods.slice(0, 6).map((nh) => (
                  <span
                    key={nh.neighborhood}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFEFEA] dark:bg-[#1E2521] border border-[#E0E0D8] dark:border-[#28332A] text-xs font-medium text-[#2E332E] dark:text-[#CAD1C8]"
                  >
                    <span>{nh.neighborhood}</span>
                    <span className="text-[10px] font-bold text-[#71716A] dark:text-[#8E968E]">
                      {nh.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t border-[#EAEAE5] dark:border-[#222924] bg-[#FBFBFA] dark:bg-[#18201C] flex items-center justify-between shrink-0">
          <p className="text-xs text-[#8A8A80] dark:text-[#7A847A]">
            Metrics automatically updated as you rank and log visits.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1C4434] dark:bg-[#256149] hover:bg-[#153629] dark:hover:bg-[#2e7457] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
