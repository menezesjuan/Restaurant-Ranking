import {
  translations,
  interpolate,
  getTranslation,
  Language,
  TranslationKey,
} from '../lib/i18n/translations';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('🧪 Iniciando testes do Sistema de Internacionalização (i18n TDD)...');

// Teste 1: Interpolação de parâmetros em strings
const template = 'Encontrados {count} lugares no raio de {distance} km';
const interpolated = interpolate(template, { count: 8, distance: '2.5' });
assert(
  interpolated === 'Encontrados 8 lugares no raio de 2.5 km',
  `Interpolação falhou. Obtido: "${interpolated}"`
);
console.log('✔ Teste 1: Interpolação de variáveis ({count}, {distance}) funcionando perfeitamente');

// Teste 2: Interpolação com parâmetros ausentes mantém o placeholder ou não quebra
const partial = interpolate('Olá {name}, bem-vindo ao {app}', { name: 'João' });
assert(
  partial === 'Olá João, bem-vindo ao {app}',
  `Interpolação parcial falhou. Obtido: "${partial}"`
);
console.log('✔ Teste 2: Tratamento seguro de parâmetros parciais ou ausentes');

// Teste 3: Simetria e cobertura completa de chaves entre Inglês e Português
const enKeys = Object.keys(translations.en) as TranslationKey[];
const ptKeys = Object.keys(translations['pt-BR']) as TranslationKey[];

assert(enKeys.length > 0, 'Dicionário em inglês não pode estar vazio');
assert(ptKeys.length > 0, 'Dicionário em português não pode estar vazio');
assert(
  enKeys.length === ptKeys.length,
  `Número de chaves difere: EN possui ${enKeys.length} e PT-BR possui ${ptKeys.length}`
);

enKeys.forEach((key) => {
  const ptVal = translations['pt-BR'][key];
  assert(
    typeof ptVal === 'string' && ptVal.trim().length > 0,
    `Chave ausente ou vazia em pt-BR: "${key}"`
  );
  const enVal = translations.en[key];
  assert(
    typeof enVal === 'string' && enVal.trim().length > 0,
    `Chave ausente ou vazia em en: "${key}"`
  );
});
console.log(`✔ Teste 3: 100% de paridade e preenchimento entre dicionários (${enKeys.length} chaves verificadas)`);

// Teste 4: Função getTranslation com resolução de idioma e fallback
const titleEn = getTranslation('en', 'sidebar.title');
const titlePt = getTranslation('pt-BR', 'sidebar.title');
assert(titleEn === 'Your top tables', `Título em inglês esperado "Your top tables", obtido "${titleEn}"`);
assert(titlePt === 'Seus melhores restaurantes', `Título em português esperado "Seus melhores restaurantes", obtido "${titlePt}"`);

// Teste 5: Fallback seguro quando idioma não reconhecido
const fallbackVal = getTranslation('fr' as Language, 'common.addPlace');
assert(fallbackVal === 'Add a place', `Fallback para EN falhou, obtido "${fallbackVal}"`);
console.log('✔ Teste 4 e 5: Resolução correta por idioma e fallback para inglês');

// Teste 6: getTranslation com interpolação de variáveis
const counterPt = getTranslation('pt-BR', 'sidebar.placesCount', { places: 12, ranked: 8 });
assert(
  counterPt === '12 lugares • 8 classificados',
  `Interpolação de getTranslation falhou, obtido: "${counterPt}"`
);
const counterEn = getTranslation('en', 'sidebar.placesCount', { places: 12, ranked: 8 });
assert(
  counterEn === '12 places • 8 ranked',
  `Interpolação em inglês falhou, obtido: "${counterEn}"`
);
console.log('✔ Teste 6: Interpolação dinâmica de contadores em ambos os idiomas');

console.log('🎉 Todos os testes de Internacionalização passaram com 100% de sucesso!');
