import {
  calculateNewPosition,
  needsRebalancing,
  rebalancePositions,
  getNeighborsForInsertIndex,
} from '../lib/ranking-calc';
import { Place } from '../types/place';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAILED ASSERTION: ${message}`);
  }
}

console.log('🧪 Iniciando testes matemáticos de ranking fracionário...');

// 1. Lista vazia
const posEmpty = calculateNewPosition(null, null);
assert(posEmpty === 1000.0, `Lista vazia deve ser 1000.0, obteve ${posEmpty}`);
console.log('✔ Caso 1: Lista vazia -> 1000.0');

// 2. Topo da lista (antes do #1 atual que está em 1000.0)
const posTop = calculateNewPosition(null, 1000.0);
assert(posTop === 500.0, `Topo da lista deve ser 500.0, obteve ${posTop}`);
console.log('✔ Caso 2: Inserção no Topo -> 500.0');

// 3. Final da lista (depois do último que está em 3000.0)
const posBottom = calculateNewPosition(3000.0, null);
assert(posBottom === 4000.0, `Final da lista deve ser 4000.0, obteve ${posBottom}`);
console.log('✔ Caso 3: Inserção no Fim -> 4000.0');

// 4. Entre dois lugares (entre 1000.0 e 2000.0)
const posBetween = calculateNewPosition(1000.0, 2000.0);
assert(posBetween === 1500.0, `Entre 1000 e 2000 deve ser 1500.0, obteve ${posBetween}`);
console.log('✔ Caso 4: Inserção Entre dois lugares -> 1500.0');

// 5. Verificação de rebalanceamento quando delta < 0.0001
const safeList = [
  { id: '1', rankingPosition: 1000.0 },
  { id: '2', rankingPosition: 1000.05 },
];
assert(!needsRebalancing(safeList), 'Diferença de 0.05 não deve requerer rebalanceamento');

const tightList = [
  { id: '1', rankingPosition: 1000.0 },
  { id: '2', rankingPosition: 1000.00005 },
];
assert(needsRebalancing(tightList), 'Diferença menor que 0.0001 deve requerer rebalanceamento');
console.log('✔ Caso 5: Detecção de rebalanceamento (delta < 0.0001)');

// 6. Rebalanceamento uniforme
const rebalanced = rebalancePositions(tightList);
assert(rebalanced[0].rankingPosition === 1000.0, 'Primeiro item rebalanceado deve ser 1000.0');
assert(rebalanced[1].rankingPosition === 2000.0, 'Segundo item rebalanceado deve ser 2000.0');
console.log('✔ Caso 6: Execução de rebalanceamento uniforme (1000.0, 2000.0)');

// 7. Teste de vizinhança de inserção (getNeighborsForInsertIndex)
const mockPlaces: Place[] = [
  { id: 'a', name: 'A', address: '', latitude: 0, longitude: 0, cuisine: '', priceRange: '$', status: 'BEEN', rankingPosition: 1000, tags: [] },
  { id: 'b', name: 'B', address: '', latitude: 0, longitude: 0, cuisine: '', priceRange: '$', status: 'BEEN', rankingPosition: 2000, tags: [] },
  { id: 'c', name: 'C', address: '', latitude: 0, longitude: 0, cuisine: '', priceRange: '$', status: 'BEEN', rankingPosition: 3000, tags: [] },
];

const nTop = getNeighborsForInsertIndex(mockPlaces, 0);
assert(nTop.prevPosition === null && nTop.nextPosition === 1000, 'Vizinho topo incorreto');

const nMid = getNeighborsForInsertIndex(mockPlaces, 1);
assert(nMid.prevPosition === 1000 && nMid.nextPosition === 2000, 'Vizinho meio incorreto');

const nEnd = getNeighborsForInsertIndex(mockPlaces, 3);
assert(nEnd.prevPosition === 3000 && nEnd.nextPosition === null, 'Vizinho fim incorreto');

console.log('✔ Caso 7: Determinação correta de vizinhos para inserção');
console.log('🎉 Todos os testes de ranking fracionário passaram com 100% de sucesso!');
