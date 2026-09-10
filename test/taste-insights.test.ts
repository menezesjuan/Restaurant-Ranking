import {
  calculateTasteInsights,
  normalizePriceTier,
  getPriceTierLevel,
} from '../lib/taste-insights';
import { Place } from '../types/place';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('🧪 Iniciando testes de Perfil Gastronômico & Insights (TDD)...');

// Mock data para testes
const mockSamplePlaces: Place[] = [
  {
    id: 'p1',
    name: 'Brat',
    address: '4 Redchurch St, London E1 6JL',
    neighborhood: 'Shoreditch',
    latitude: 51.5241,
    longitude: -0.0768,
    cuisine: 'Basque',
    priceRange: '£££',
    status: 'BEEN',
    rankingPosition: 1000.0,
    timesVisited: 4,
    tags: ['Wood Fired', 'Michelin'],
  },
  {
    id: 'p2',
    name: 'Tayyabs',
    address: '83-89 Fieldgate St, London E1 1JU',
    neighborhood: 'Whitechapel',
    latitude: 51.5186,
    longitude: -0.0628,
    cuisine: 'Punjabi',
    priceRange: '££',
    status: 'BEEN',
    rankingPosition: 2000.0,
    timesVisited: 6,
    tags: ['Spicy'],
  },
  {
    id: 'p3',
    name: 'St. JOHN',
    address: '26 St John St, London EC1M 4AY',
    neighborhood: 'Farringdon',
    latitude: 51.5204,
    longitude: -0.1009,
    cuisine: 'British',
    priceRange: '£££',
    status: 'BEEN',
    rankingPosition: 3000.0,
    timesVisited: 2,
    tags: ['British Classic'],
  },
  {
    id: 'p4',
    name: 'Padella',
    address: '6 Southwark St, London SE1 1TQ',
    neighborhood: 'Borough Market',
    latitude: 51.5058,
    longitude: -0.0903,
    cuisine: 'Italian',
    priceRange: '££',
    status: 'BEEN',
    rankingPosition: 1500.0,
    timesVisited: 3,
    tags: ['Pasta'],
  },
  {
    id: 'p5',
    name: 'Dishoom',
    address: '12 Upper St Martins Ln, London WC2H 9FB',
    neighborhood: 'Covent Garden',
    latitude: 51.5126,
    longitude: -0.1268,
    cuisine: 'Indian',
    priceRange: '££',
    status: 'WANT_TO_TRY',
    rankingPosition: null,
    timesVisited: 0,
    tags: ['Breakfast'],
  },
];

// --- TESTES DE CASOS VÁLIDOS ---

// Teste 1: Contagens básicas e taxas de conclusão
const insights = calculateTasteInsights(mockSamplePlaces);
assert(insights.totalPlaces === 5, `Total places esperado 5, obtido ${insights.totalPlaces}`);
assert(insights.beenCount === 4, `Been count esperado 4, obtido ${insights.beenCount}`);
assert(insights.wantToTryCount === 1, `Want to try esperado 1, obtido ${insights.wantToTryCount}`);
assert(insights.beenPercentage === 80, `Been percentage esperada 80%, obtido ${insights.beenPercentage}%`);
assert(insights.totalVisits === 15, `Total de visitas esperado 15 (4+6+2+3), obtido ${insights.totalVisits}`);
console.log('✔ Teste 1: Métricas globais calculadas com precisão (80% visitados, 15 visitas)');

// Teste 2: Top Pick e Mais Visitado
assert(insights.topPick?.id === 'p1', `Top pick esperado 'p1' (Brat #1000.0), obtido ${insights.topPick?.id}`);
assert(insights.mostVisited?.id === 'p2', `Mais visitado esperado 'p2' (Tayyabs 6x), obtido ${insights.mostVisited?.id}`);
console.log('✔ Teste 2: Top pick (#1 do ranking) e restaurante mais visitado identificados');

// Teste 3: Distribuição de Culinárias
assert(insights.topCuisines.length === 5, 'Deve conter todas as culinárias registradas');
assert(insights.topCuisines.some(c => c.cuisine === 'Basque' && c.count === 1), 'Basque deve ter count 1');
console.log('✔ Teste 3: Ranking e porcentagem de culinárias calculados corretamente');

// Teste 4: Distribuição de Faixa de Preço e Preço Médio
assert(insights.priceDistribution['££'] === 3, 'Deve haver 3 restaurantes ££');
assert(insights.priceDistribution['£££'] === 2, 'Deve haver 2 restaurantes £££');
assert(insights.priceDistribution['£'] === 0, 'Deve haver 0 restaurantes £');
assert(insights.priceDistribution['££££'] === 0, 'Deve haver 0 restaurantes ££££');
// Média: (3 * 2 + 2 * 3) / 5 = 12 / 5 = 2.4
assert(Math.abs(insights.averagePriceLevel - 2.4) < 0.01, `Preço médio esperado 2.4, obtido ${insights.averagePriceLevel}`);
assert(insights.averagePriceTier === '££', `Faixa média esperada ££, obtido ${insights.averagePriceTier}`);
console.log('✔ Teste 4: Distribuição de preço e nível médio ponderado corretos (2.4 -> ££)');

// --- TESTES DE CASOS EXTREMOS (EDGE CASES) ---

// Teste 5: Lista Vazia
const emptyInsights = calculateTasteInsights([]);
assert(emptyInsights.totalPlaces === 0, 'Total deve ser 0 para lista vazia');
assert(emptyInsights.beenCount === 0, 'Been deve ser 0');
assert(emptyInsights.wantToTryCount === 0, 'Want to try deve ser 0');
assert(emptyInsights.beenPercentage === 0, 'Porcentagem deve ser 0%');
assert(emptyInsights.totalVisits === 0, 'Visitas devem ser 0');
assert(emptyInsights.topPick === null, 'Top pick deve ser null');
assert(emptyInsights.mostVisited === null, 'Mais visitado deve ser null');
assert(emptyInsights.topCuisines.length === 0, 'Culinárias deve ser vazio');
assert(emptyInsights.averagePriceLevel === 0, 'Preço médio deve ser 0');
assert(emptyInsights.averagePriceTier === '£', 'Tier padrão deve ser £');
console.log('✔ Teste 5: Tratamento seguro de lista vazia sem exceções');

// Teste 6: Lista apenas com WANT_TO_TRY (nenhum visitado)
const onlyWantPlaces: Place[] = [
  {
    id: 'w1',
    name: 'Som Saa',
    address: '43A Commercial St, London',
    neighborhood: 'Spitalfields',
    latitude: 51.5178,
    longitude: -0.0754,
    cuisine: 'Thai',
    priceRange: '$$',
    status: 'WANT_TO_TRY',
    rankingPosition: null,
    tags: [],
  },
];
const onlyWantInsights = calculateTasteInsights(onlyWantPlaces);
assert(onlyWantInsights.totalPlaces === 1, 'Total 1');
assert(onlyWantInsights.beenCount === 0, 'Been 0');
assert(onlyWantInsights.wantToTryCount === 1, 'Want 1');
assert(onlyWantInsights.beenPercentage === 0, '0%');
assert(onlyWantInsights.topPick === null, 'Top pick deve ser null pois nenhum foi ranqueado');
assert(onlyWantInsights.mostVisited === null, 'Mais visitado deve ser null');
console.log('✔ Teste 6: Comportamento quando nenhum restaurante foi visitado');

// Teste 7: Normalização de moeda ($ vs £) e cálculo de tier
assert(normalizePriceTier('$') === '£', '$ deve normalizar para £');
assert(normalizePriceTier('$$$') === '£££', '$$$ deve normalizar para £££');
assert(normalizePriceTier('££££') === '££££', '££££ deve permanecer ££££');
assert(normalizePriceTier('desconhecido') === '££', 'Valor inválido deve retornar fallback ££');
assert(getPriceTierLevel('£') === 1, '£ é nível 1');
assert(getPriceTierLevel('££££') === 4, '££££ é nível 4');
console.log('✔ Teste 7: Normalização uniforme de símbolos de moeda e conversão numérica');

// Teste 8: Extração de Bairros quando neighborhood não estiver preenchido
const placeWithoutNeighborhood: Place[] = [
  {
    id: 'no_nh',
    name: 'Corner Cafe',
    address: 'Camden High Street, London NW1',
    latitude: 51.539,
    longitude: -0.142,
    cuisine: 'Cafe',
    priceRange: '£',
    status: 'BEEN',
    rankingPosition: 1000.0,
    timesVisited: 1,
    tags: [],
  },
];
const nhInsights = calculateTasteInsights(placeWithoutNeighborhood);
assert(nhInsights.topNeighborhoods.length === 1, 'Deve extrair 1 bairro');
assert(nhInsights.topNeighborhoods[0].neighborhood === 'Camden High Street', 'Deve usar primeira parte do endereço como fallback');
console.log('✔ Teste 8: Fallback de extração de bairro a partir do endereço');

console.log('🎉 Todos os testes de Perfil Gastronômico & Insights passaram com 100% de sucesso!');
