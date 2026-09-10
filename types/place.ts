export type PlaceStatus = 'BEEN' | 'WANT_TO_TRY';

export interface Place {
  id: string;
  userId?: string;
  name: string;
  address: string;
  neighborhood?: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  priceRange: '£' | '££' | '£££' | '££££' | '$' | '$$' | '$$$' | '$$$$' | string;
  status: PlaceStatus;
  rankingPosition: number | null;
  notes?: string | null;
  tags: string[];
  timesVisited?: number;
  avatarText?: string;
  avatarBg?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PlaceFilterState {
  searchQuery: string;
  cuisine: string;
  priceRange: string;
  selectedTags: string[];
}
