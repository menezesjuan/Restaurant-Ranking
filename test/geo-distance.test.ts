import {
  calculateHaversineDistanceKm,
  formatDistance,
  filterPlacesByRadius,
  sortPlacesByDistance,
} from '../lib/geo-distance';
import { Place } from '../types/place';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('🧪 Iniciando testes de Cálculos Geoespaciais (Haversine & Raio)...');

// Coordenadas reais de Londres
const COVENT_GARDEN = { lat: 51.5126, lon: -0.1268 }; // Dishoom
const SHOREDITCH = { lat: 51.5241, lon: -0.0768 };     // Brat
const BOROUGH_MARKET = { lat: 51.5058, lon: -0.0903 }; // Padella

// Teste 1: Distância de um ponto para si mesmo
const distZero = calculateHaversineDistanceKm(
  COVENT_GARDEN.lat,
  COVENT_GARDEN.lon,
  COVENT_GARDEN.lat,
  COVENT_GARDEN.lon
);
assert(Math.abs(distZero) < 0.001, 'Distância para as mesmas coordenadas deve ser zero');
console.log('✔ Teste 1: Distância idêntica é 0.0 km');

// Teste 2: Distância entre Covent Garden e Shoreditch (~3.7 a 3.9 km em linha reta)
const distCoventToShoreditch = calculateHaversineDistanceKm(
  COVENT_GARDEN.lat,
  COVENT_GARDEN.lon,
  SHOREDITCH.lat,
  SHOREDITCH.lon
);
assert(
  distCoventToShoreditch >= 3.6 && distCoventToShoreditch <= 4.0,
  `Distância calculada foi ${distCoventToShoreditch.toFixed(2)}km, esperada entre 3.6 e 4.0km`
);
console.log(`✔ Teste 2: Distância Covent Garden <-> Shoreditch: ${distCoventToShoreditch.toFixed(2)} km`);

// Teste 3: Formatação legível
assert(formatDistance(0.35) === '350m', '0.35km deve formatar como 350m');
assert(formatDistance(2.41) === '2.4 km', '2.41km deve formatar como 2.4 km');
console.log('✔ Teste 3: Formatação legível de distâncias (metros e km)');

// Teste 4: Filtragem por raio
const testPlaces: Place[] = [
  {
    id: '1',
    name: 'Dishoom Covent Garden',
    address: 'Covent Garden',
    latitude: COVENT_GARDEN.lat,
    longitude: COVENT_GARDEN.lon,
    cuisine: 'Indian',
    priceRange: '££',
    status: 'BEEN',
    rankingPosition: 1000,
    tags: [],
  },
  {
    id: '2',
    name: 'Padella Borough',
    address: 'Borough Market',
    latitude: BOROUGH_MARKET.lat,
    longitude: BOROUGH_MARKET.lon,
    cuisine: 'Italian',
    priceRange: '££',
    status: 'BEEN',
    rankingPosition: 2000,
    tags: [],
  },
  {
    id: '3',
    name: 'Brat Shoreditch',
    address: 'Shoreditch',
    latitude: SHOREDITCH.lat,
    longitude: SHOREDITCH.lon,
    cuisine: 'Basque',
    priceRange: '£££',
    status: 'BEEN',
    rankingPosition: 3000,
    tags: [],
  },
];

// De Covent Garden, Borough Market está a ~2.6km e Shoreditch a ~3.7km.
// Um raio de 3.0km deve incluir apenas Dishoom e Padella!
const within3Km = filterPlacesByRadius(testPlaces, COVENT_GARDEN.lat, COVENT_GARDEN.lon, 3.0);
assert(within3Km.length === 2, `Esperado 2 restaurantes em raio de 3km, obteve ${within3Km.length}`);
assert(within3Km.some((p) => p.name.includes('Dishoom')), 'Dishoom deve estar no raio');
assert(within3Km.some((p) => p.name.includes('Padella')), 'Padella deve estar no raio');
console.log('✔ Teste 4: Filtragem precisa por raio geográfico (Haversine)');

// Teste 5: Ordenação por proximidade
const sorted = sortPlacesByDistance(testPlaces, COVENT_GARDEN.lat, COVENT_GARDEN.lon);
assert(sorted[0].id === '1', 'O mais próximo de Covent Garden deve ser Dishoom');
assert(sorted[1].id === '2', 'O segundo mais próximo deve ser Padella');
assert(sorted[2].id === '3', 'O mais distante deve ser Brat');
console.log('✔ Teste 5: Ordenação correta por proximidade geográfica');

console.log('🎉 Todos os testes de cálculos geoespaciais passaram com 100% de sucesso!');
