import {
  isAllowedGoogleMapsUrl,
  sanitizeText,
} from '../lib/google-maps/security';
import {
  extractCoordinatesFromUrl,
  extractPlaceNameFromUrl,
  parseGoogleMapsHtmlMetadata,
} from '../lib/google-maps/parser';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('🧪 Iniciando testes de Segurança & Parser do Google Maps sem API (TDD)...');

// -------------------------------------------------------------
// 1. TESTES DE SEGURANÇA & SSRF (Server-Side Request Forgery)
// -------------------------------------------------------------
console.log('--- 1. Validação de Segurança & SSRF ---');

// Tentativas de ataque SSRF devem ser terminantemente bloqueadas
const ssrfAttempts = [
  'http://localhost:3000/api/places',
  'http://127.0.0.1:8080/admin',
  'http://169.254.169.254/latest/meta-data',
  'http://10.0.0.1/internal',
  'http://192.168.1.1/router',
  'https://evil-hacker.com/maps/place/Dishoom',
  'ftp://google.com/maps',
  'javascript:alert(1)',
  'http://google.com.attacker.com',
  'http://maps.google.com', // Não-HTTPS deve ser rejeitado
];

for (const maliciousUrl of ssrfAttempts) {
  const result = isAllowedGoogleMapsUrl(maliciousUrl);
  assert(
    result.valid === false,
    `Falha de segurança! URL maliciosa permitida indevidamente: "${maliciousUrl}" (motivo: ${result.reason})`
  );
}
console.log('✔ Teste 1.1: Todas as tentativas de SSRF, IPs privados e domínios invasores foram bloqueadas');

// URLs legítimas do Google Maps devem ser aprovadas
const validGoogleUrls = [
  'https://maps.app.goo.gl/w8QoBw2aR8h1',
  'https://goo.gl/maps/x8BqAy91',
  'https://www.google.com/maps/place/Padella/@51.5058,-0.0903,17z',
  'https://maps.google.com/maps?q=Dishoom+London',
  'https://google.com/maps/search/Tayyabs+London',
];

for (const validUrl of validGoogleUrls) {
  const result = isAllowedGoogleMapsUrl(validUrl);
  assert(
    result.valid === true,
    `URL legítima do Google Maps rejeitada indevidamente: "${validUrl}" (${result.reason})`
  );
}
console.log('✔ Teste 1.2: Links legítimos do Google Maps (mobile e desktop) validados com sucesso');

// Limite de tamanho de entrada para mitigar ReDoS
const excessiveUrl = 'https://maps.app.goo.gl/' + 'a'.repeat(3000);
const sizeCheck = isAllowedGoogleMapsUrl(excessiveUrl);
assert(sizeCheck.valid === false, 'URL excessivamente longa (>2048 chars) deve ser rejeitada');
console.log('✔ Teste 1.3: Mitigação de ReDoS por limite de tamanho de payload funcionando');


// -------------------------------------------------------------
// 2. SANITIZAÇÃO DE TEXTO & PREVENÇÃO DE XSS
// -------------------------------------------------------------
console.log('\n--- 2. Sanitização de Texto & Prevenção XSS ---');

assert(
  sanitizeText('<script>alert("hack")</script>Padella') === 'Padella',
  'Tags <script> devem ser eliminadas'
);
assert(
  sanitizeText('Brat &amp; Co. &#39;Special&#39; &quot;Grill&quot;') === "Brat & Co. 'Special' \"Grill\"",
  'Entidades HTML devem ser decodificadas de forma limpa'
);
assert(
  sanitizeText('  <img src="x" onerror="alert(1)"> Tayyabs London   ') === 'Tayyabs London',
  'Injeção de tags com eventos JS deve ser removida e trimmed'
);
console.log('✔ Teste 2: Sanitização estrita contra XSS validada com sucesso');


// -------------------------------------------------------------
// 3. EXTRAÇÃO DE COORDENADAS GEOESPACIAIS
// -------------------------------------------------------------
console.log('\n--- 3. Extração Geoespacial de Coordenadas ---');

// Padrão Desktop com @lat,lng,zoom
const urlDesktop = 'https://www.google.com/maps/place/Padella/@51.5058214,-0.0903125,17z/data=!4m6!3m5';
const coordsDesktop = extractCoordinatesFromUrl(urlDesktop);
assert(coordsDesktop !== null, 'Coordenadas não devem ser nulas para URL desktop');
assert(Math.abs(coordsDesktop!.latitude - 51.5058214) < 0.0001, 'Latitude incorreta para Padella');
assert(Math.abs(coordsDesktop!.longitude - -0.0903125) < 0.0001, 'Longitude incorreta para Padella');
console.log('✔ Teste 3.1: Extração precisa de coordenadas no formato @lat,lng');

// Padrão com dados Protobuf !3d<lat>!4d<lng>
const urlProtobuf = 'https://www.google.com/maps/place/Dishoom/data=!4m2!3m1!1s0x0:0x0!3d51.5126!4d-0.1268';
const coordsProtobuf = extractCoordinatesFromUrl(urlProtobuf);
assert(coordsProtobuf !== null, 'Coordenadas protobuf não devem ser nulas');
assert(Math.abs(coordsProtobuf!.latitude - 51.5126) < 0.0001, 'Latitude incorreta para Dishoom protobuf');
assert(Math.abs(coordsProtobuf!.longitude - -0.1268) < 0.0001, 'Longitude incorreta para Dishoom protobuf');
console.log('✔ Teste 3.2: Extração precisa de coordenadas no formato !3d/!4d');

// Padrão com query param ?q=lat,lng
const urlQueryParam = 'https://maps.google.com/?q=51.5204,-0.1009';
const coordsQuery = extractCoordinatesFromUrl(urlQueryParam);
assert(coordsQuery !== null, 'Coordenadas de query param não devem ser nulas');
assert(Math.abs(coordsQuery!.latitude - 51.5204) < 0.0001, 'Latitude incorreta para St. JOHN');
assert(Math.abs(coordsQuery!.longitude - -0.1009) < 0.0001, 'Longitude incorreta para St. JOHN');
console.log('✔ Teste 3.3: Extração de coordenadas via query param q=lat,lng');

// URL sem coordenadas deve retornar null seguramente
const urlNoCoords = 'https://www.google.com/maps/search/restaurantes';
assert(extractCoordinatesFromUrl(urlNoCoords) === null, 'URL sem coordenadas deve retornar null');
console.log('✔ Teste 3.4: Tratamento seguro de URLs sem coordenadas');


// -------------------------------------------------------------
// 4. EXTRAÇÃO DO NOME DO RESTAURANTE
// -------------------------------------------------------------
console.log('\n--- 4. Extração do Nome do Estabelecimento ---');

// Nome simples
assert(
  extractPlaceNameFromUrl('https://www.google.com/maps/place/Padella/@51.5058,-0.0903,17z') === 'Padella',
  'Nome simples Padella incorreto'
);

// Nome com espaços codificados com +
assert(
  extractPlaceNameFromUrl('https://www.google.com/maps/place/St.+JOHN+Restaurant/@51.5204,-0.1009,17z') === 'St. JOHN Restaurant',
  'Nome com + deve ser convertido para espaços'
);

// Nome com caracteres especiais URL-encoded (%27 para apóstrofo)
assert(
  extractPlaceNameFromUrl('https://www.google.com/maps/place/L%27Escargot/@51.5135,-0.1319,17z') === "L'Escargot",
  'Nome com apóstrofo URL-encoded deve ser decodificado'
);

// URL com query parameters após o nome
assert(
  extractPlaceNameFromUrl('https://www.google.com/maps/place/Brat?entry=ttu') === 'Brat',
  'Query string deve ser descartada do nome do lugar'
);

// URL de busca com filtros (/maps/search/...)
assert(
  extractPlaceNameFromUrl('https://www.google.com/maps/search/Tayyabs+London/@51.5186,-0.0628,15z') === 'Tayyabs London',
  'Nome deve ser extraído de URLs do tipo /maps/search/'
);

// URL com query param ?q=Nome+Do+Lugar
assert(
  extractPlaceNameFromUrl('https://maps.google.com/?q=Dishoom+Covent+Garden') === 'Dishoom Covent Garden',
  'Nome deve ser extraído de query param ?q='
);

// URL genérica do Google Maps sem estabelecimento
assert(
  extractPlaceNameFromUrl('https://www.google.com/maps') === null,
  'URL genérica do Google Maps deve retornar null'
);

console.log('✔ Teste 4: Nomes simples, compostos, buscas com filtros e URLs genéricas validadas com perfeição');


// -------------------------------------------------------------
// 5. PARSER DE METADADOS HTML (OpenGraph / Schema)
// -------------------------------------------------------------
console.log('\n--- 5. Extração de Metadados HTML do Google Maps ---');

const mockGoogleHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="Padella · 6 Southwark St, London SE1 1TQ, United Kingdom">
  <meta property="og:description" content="Fresh handmade pasta and Italian wine in Borough Market. Casual dining.">
  <meta property="og:image" content="https://lh5.googleusercontent.com/p/photo.jpg">
</head>
<body>
  <h1>Padella</h1>
</body>
</html>
`;

const parsedMeta = parseGoogleMapsHtmlMetadata(mockGoogleHtml);
assert(parsedMeta.name === 'Padella', `Nome extraído esperado "Padella", obtido "${parsedMeta.name}"`);
assert(
  parsedMeta.address === '6 Southwark St, London SE1 1TQ, United Kingdom',
  `Endereço extraído incorreto: "${parsedMeta.address}"`
);
assert(parsedMeta.neighborhood === '6 Southwark St', `Bairro incorreto: "${parsedMeta.neighborhood}"`);
console.log('✔ Teste 5: Metadados OpenGraph do HTML do Google Maps decompostos com sucesso');

console.log('\n🎉 TODOS OS TESTES PRÉVIOS (TDD & SEGURANÇA) DEFINIDOS COM SUCESSO!');
