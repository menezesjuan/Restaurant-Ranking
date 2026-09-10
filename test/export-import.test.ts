import { exportPlacesToJson, validateAndSanitizeImport } from '../lib/export-import';
import { Place } from '../types/place';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('🧪 Iniciando testes de Exportação e Importação de Rankings...');

const samplePlaces: Place[] = [
  {
    id: 'test_1',
    name: 'Brat',
    address: '4 Redchurch St, London',
    neighborhood: 'Shoreditch',
    latitude: 51.5241,
    longitude: -0.0768,
    cuisine: 'Basque',
    priceRange: '£££',
    status: 'BEEN',
    rankingPosition: 1000.0,
    tags: ['Wood Fired'],
    timesVisited: 3,
  },
  {
    id: 'test_2',
    name: 'Kiln',
    address: '58 Brewer St, London',
    neighborhood: 'Soho',
    latitude: 51.5118,
    longitude: -0.1362,
    cuisine: 'Thai',
    priceRange: '££',
    status: 'WANT_TO_TRY',
    rankingPosition: null,
    tags: ['Spicy'],
    timesVisited: 0,
  },
];

// Teste 1: Exportação para JSON
const jsonOutput = exportPlacesToJson(samplePlaces, 'London');
assert(typeof jsonOutput === 'string', 'A exportação deve retornar uma string JSON');
assert(jsonOutput.includes('"version": "1.0.0"'), 'O JSON exportado deve incluir a versão');
assert(jsonOutput.includes('"name": "Brat"'), 'O JSON exportado deve conter o restaurante Brat');
console.log('✔ Teste 1: Exportação estruturada para JSON');

// Teste 2: Importação de payload válido
const importResult = validateAndSanitizeImport(jsonOutput);
assert(importResult.valid === true, 'A validação deve ser bem-sucedida para JSON exportado');
assert(importResult.sanitizedPlaces?.length === 2, 'Deve conter exatamente 2 restaurantes');
assert(importResult.sanitizedPlaces?.[0].name === 'Brat', 'O primeiro deve ser Brat');
console.log('✔ Teste 2: Importação e sanitização de payload exportado');

// Teste 3: Importação de array simples direto
const rawArrayJson = JSON.stringify([
  {
    name: 'Padella',
    address: 'Borough Market',
    latitude: 51.5058,
    longitude: -0.0903,
    cuisine: 'Italian',
    priceRange: '££',
    status: 'BEEN',
  },
]);
const arrayResult = validateAndSanitizeImport(rawArrayJson);
assert(arrayResult.valid === true, 'Deve suportar importação de array direto');
assert(arrayResult.sanitizedPlaces?.[0].rankingPosition === 1000.0, 'Deve atribuir rankingPosition automático se ausente');
console.log('✔ Teste 3: Importação com compatibilidade para array plano');

// Teste 4: Rejeição de JSON com sintaxe quebrada
const brokenJson = '{"places": [broken';
const brokenResult = validateAndSanitizeImport(brokenJson);
assert(brokenResult.valid === false, 'Deve rejeitar JSON com erro de sintaxe');
assert(Boolean(brokenResult.error?.includes('JSON corrompido')), 'Deve conter mensagem de erro descritiva');
console.log('✔ Teste 4: Rejeição e tratamento de JSON mal formatado');

// Teste 5: Rejeição de coordenadas inválidas
const invalidCoordsJson = JSON.stringify([
  {
    name: 'Ghost Restaurant',
    address: 'Nowhere',
    latitude: 'invalid_lat',
    longitude: -0.12,
  },
]);
const invalidCoordsResult = validateAndSanitizeImport(invalidCoordsJson);
assert(invalidCoordsResult.valid === false, 'Deve rejeitar restaurantes com coordenadas inválidas');
console.log('✔ Teste 5: Rejeição de restaurante com latitude/longitude não numéricas');

console.log('🎉 Todos os testes de Exportação e Importação passaram com 100% de sucesso!');
