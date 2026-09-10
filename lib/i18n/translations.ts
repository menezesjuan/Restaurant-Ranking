export type Language = 'en' | 'pt-BR';

export interface TranslationsRecord {
  // Common / TopNavbar
  'common.addPlace': string;
  'common.searchPlaceholder': string;
  'common.insights': string;
  'common.darkMode': string;
  'common.lightMode': string;
  'common.backup': string;
  'common.restoreDemo': string;
  'common.done': string;
  'common.cancel': string;
  'common.save': string;
  'common.delete': string;
  'common.close': string;

  // Sidebar
  'sidebar.location': string;
  'sidebar.placesCount': string;
  'sidebar.title': string;
  'sidebar.subtitle': string;
  'sidebar.tabRanked': string;
  'sidebar.tabWantToTry': string;
  'sidebar.allLondon': string;
  'sidebar.filterDistance': string;
  'sidebar.decider': string;
  'sidebar.deciderTitle': string;
  'sidebar.allCuisines': string;
  'sidebar.noPlaces': string;
  'sidebar.noPlacesDesc': string;

  // PlaceCard
  'placeCard.beenVisits': string;
  'placeCard.topPick': string;
  'placeCard.duel': string;
  'placeCard.duelTooltip': string;
  'placeCard.rerankTooltip': string;
  'placeCard.detailsTooltip': string;
  'placeCard.deleteTooltip': string;

  // Modals / Insights
  'modals.insightsTitle': string;
  'modals.insightsSubtitle': string;
  'modals.totalPlaces': string;
  'modals.completionRate': string;
  'modals.totalVisits': string;
  'modals.avgPriceTier': string;
  'modals.topRankedTable': string;
  'modals.mostVisitedStaple': string;
  'modals.cuisinePreferences': string;
  'modals.priceDistribution': string;
  'modals.topNeighborhoods': string;
  'modals.tried': string;
  'modals.wishlist': string;
  'modals.mealsLogged': string;
  'modals.levelOf': string;
  'modals.noRanked': string;
  'modals.noVisits': string;
  'modals.favoriteNotes': string;

  // Decider Modal
  'decider.modalTitle': string;
  'decider.quickDecider': string;
  'decider.subtitle': string;
  'decider.scope': string;
  'decider.allPlaces': string;
  'decider.wantToTry': string;
  'decider.beenRanked': string;
  'decider.cuisinePreference': string;
  'decider.anyCuisine': string;
  'decider.eligible': string;
  'decider.optionsCount': string;
  'decider.startTournament': string;
  'decider.selectMin': string;
  'decider.cravingQuestion': string;
  'decider.knockoutRound': string;
  'decider.choose': string;
  'decider.winnerCrowned': string;
  'decider.eatToday': string;
  'decider.showOnMap': string;
  'decider.decideAgain': string;

  // Comparison / Duel Modal
  'duel.title': string;
  'duel.findingRank': string;
  'duel.subtitle': string;
  'duel.roundProgress': string;
  'duel.candidate': string;
  'duel.currentOpponent': string;
  'duel.betterThanThis': string;
  'duel.keyboardCandidate': string;
  'duel.keyboardOpponent': string;
  'duel.rankSecured': string;
  'duel.rankedAt': string;

  // Add Place Modal
  'addModal.title': string;
  'addModal.subtitle': string;
  'addModal.searchOsm': string;
  'addModal.searching': string;
  'addModal.nameLabel': string;
  'addModal.namePlaceholder': string;
  'addModal.addressLabel': string;
  'addModal.addressPlaceholder': string;
  'addModal.neighborhoodLabel': string;
  'addModal.neighborhoodPlaceholder': string;
  'addModal.cuisineLabel': string;
  'addModal.cuisinePlaceholder': string;
  'addModal.priceLabel': string;
  'addModal.statusQuestion': string;
  'addModal.beenOption': string;
  'addModal.wantOption': string;
  'addModal.visitsLabel': string;
  'addModal.notesLabel': string;
  'addModal.notesPlaceholder': string;
  'addModal.tagsLabel': string;
  'addModal.customTagPlaceholder': string;
  'addModal.addTag': string;
  'addModal.hideCoords': string;
  'addModal.manualCoords': string;
  'addModal.saveButton': string;
  'addModal.saveBeen': string;
  'addModal.saveWant': string;
  'addModal.cancelButton': string;
  'addModal.googleMapsTitle': string;
  'addModal.googleMapsPlaceholder': string;
  'addModal.googleMapsButton': string;
  'addModal.googleMapsLoading': string;
  'addModal.googleMapsSuccess': string;
  'addModal.googleMapsError': string;

  // Place Detail Modal
  'details.status': string;
  'details.beenRanked': string;
  'details.wantToTry': string;
  'details.visits': string;
  'details.times': string;
  'details.logVisit': string;
  'details.logVisitTooltip': string;
  'details.notesTitle': string;
  'details.noNotes': string;
  'details.edit': string;
  'details.saveNotes': string;
  'details.tagsTitle': string;
  'details.runDuel': string;
  'details.deletePlace': string;
  'details.deleteTooltip': string;
  'details.rankBadge': string;

  // Backup Modal
  'backup.title': string;
  'backup.subtitle': string;
  'backup.exportSection': string;
  'backup.exportDesc': string;
  'backup.downloadButton': string;
  'backup.importSection': string;
  'backup.importDesc': string;
  'backup.selectFile': string;
  'backup.exportedSuccess': string;
  'backup.importedSuccess': string;
  'backup.validationError': string;

  // Mobile / Page
  'page.listTab': string;
  'page.mapTab': string;
  'page.beenMobile': string;
  'page.wantMobile': string;
  'page.triedDuel': string;
  'page.viewDetails': string;

  // Map
  'map.legendBeen': string;
  'map.legendWant': string;
  'map.rankedBadge': string;
  'map.beenBadge': string;
  'map.wantBadge': string;
  'map.loading': string;

  // Language Switcher
  'language.en': string;
  'language.pt-BR': string;
  'language.switchTo': string;
}

export type TranslationKey = keyof TranslationsRecord;

export const translations: Record<Language, TranslationsRecord> = {
  en: {
    // Common / TopNavbar
    'common.addPlace': 'Add a place',
    'common.searchPlaceholder': 'Search your places',
    'common.insights': 'Taste Profile & Insights',
    'common.darkMode': 'Switch to Dark Mode',
    'common.lightMode': 'Switch to Light Mode',
    'common.backup': 'Backup & Share Rankings',
    'common.restoreDemo': 'Restore London demo data',
    'common.done': 'Done',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.close': 'Close',

    // Sidebar
    'sidebar.location': 'London',
    'sidebar.placesCount': '{places} places • {ranked} ranked',
    'sidebar.title': 'Your top tables',
    'sidebar.subtitle':
      'Ranked head-to-head, so your #3 really is better than your #4 — no five-star mush.',
    'sidebar.tabRanked': 'Ranked',
    'sidebar.tabWantToTry': 'Want to try',
    'sidebar.allLondon': 'All London',
    'sidebar.filterDistance': 'Filter restaurants by distance radius',
    'sidebar.decider': 'Decider',
    'sidebar.deciderTitle': 'Quick decider: where should we eat today?',
    'sidebar.allCuisines': 'All',
    'sidebar.noPlaces': 'No places found',
    'sidebar.noPlacesDesc': 'Adjust your search or category filters above.',

    // PlaceCard
    'placeCard.beenVisits': 'been {count}x',
    'placeCard.topPick': 'TOP PICK',
    'placeCard.duel': 'Duel',
    'placeCard.duelTooltip': 'Run ranking duel',
    'placeCard.rerankTooltip': 'Rerank restaurant',
    'placeCard.detailsTooltip': 'Details and notes',
    'placeCard.deleteTooltip': 'Remove',

    // Modals / Insights
    'modals.insightsTitle': 'Taste Profile & Insights',
    'modals.insightsSubtitle': 'Personal dining statistics and culinary breakdown',
    'modals.totalPlaces': 'Total Places',
    'modals.completionRate': 'Completion Rate',
    'modals.totalVisits': 'Total Visits',
    'modals.avgPriceTier': 'Avg Price Tier',
    'modals.topRankedTable': '#1 Ranked Table',
    'modals.mostVisitedStaple': 'Most Visited Staple',
    'modals.cuisinePreferences': 'Cuisine Preferences',
    'modals.priceDistribution': 'Price Distribution',
    'modals.topNeighborhoods': 'Top Neighborhoods',
    'modals.tried': 'tried',
    'modals.wishlist': 'wishlist',
    'modals.mealsLogged': 'Meals logged',
    'modals.levelOf': 'Level {level} of 4.0',
    'modals.noRanked': 'No ranked places yet. Run a duel to crown your #1!',
    'modals.noVisits': 'No visit records logged yet.',
    'modals.favoriteNotes': 'Your go-to favorite',

    // Decider Modal
    'decider.modalTitle': 'Where Should We Eat?',
    'decider.quickDecider': 'Quick Decider',
    'decider.subtitle': 'Mini knockout tournament to resolve indecision in seconds',
    'decider.scope': 'Scope',
    'decider.allPlaces': 'All Places',
    'decider.wantToTry': 'Want to Try',
    'decider.beenRanked': 'Been (Ranked)',
    'decider.cuisinePreference': 'Cuisine Preference',
    'decider.anyCuisine': 'Any Cuisine ({count} available)',
    'decider.eligible': 'Eligible restaurants in bracket:',
    'decider.optionsCount': '{count} options',
    'decider.startTournament': 'Start Quick Tournament!',
    'decider.selectMin': 'Select filters with at least 2 tables',
    'decider.cravingQuestion': 'Which one are you craving right now?',
    'decider.knockoutRound': 'Knockout round {round}',
    'decider.choose': 'Choose {name}',
    'decider.winnerCrowned': 'Winner crowned!',
    'decider.eatToday': 'Where you should eat today:',
    'decider.showOnMap': 'Show on map & go eat!',
    'decider.decideAgain': 'Decide again',

    // Comparison / Duel Modal
    'duel.title': 'Which Did You Prefer?',
    'duel.findingRank': 'Finding Exact Rank',
    'duel.subtitle': 'Which table delivered a better dining experience?',
    'duel.roundProgress': 'Comparison round {round} of ~{total}',
    'duel.candidate': 'Candidate',
    'duel.currentOpponent': 'Current Opponent',
    'duel.betterThanThis': 'Better Than This',
    'duel.keyboardCandidate': 'Keyboard: Press 1 or Left Arrow',
    'duel.keyboardOpponent': 'Keyboard: Press 2 or Right Arrow',
    'duel.rankSecured': 'Rank Position Secured!',
    'duel.rankedAt': 'Ranked at #{rank} of {total}',

    // Add Place Modal
    'addModal.title': 'Add a New Restaurant',
    'addModal.subtitle': 'Log a London table with coordinates and ranking duel',
    'addModal.searchOsm': 'Search address on OpenStreetMap',
    'addModal.searching': 'Searching...',
    'addModal.nameLabel': 'Restaurant Name',
    'addModal.namePlaceholder': 'e.g. Dishoom',
    'addModal.addressLabel': 'Full Address',
    'addModal.addressPlaceholder': 'e.g. 12 Upper St Martins Ln',
    'addModal.neighborhoodLabel': 'Neighborhood / Borough',
    'addModal.neighborhoodPlaceholder': 'e.g. Covent Garden',
    'addModal.cuisineLabel': 'Cuisine / Style',
    'addModal.cuisinePlaceholder': 'e.g. Indian, Basque',
    'addModal.priceLabel': 'Price Range',
    'addModal.statusQuestion': 'Have you been here before?',
    'addModal.beenOption': "I've been here (Add to Ranking)",
    'addModal.wantOption': 'Want to try (Add to Wishlist)',
    'addModal.visitsLabel': 'Number of visits',
    'addModal.notesLabel': 'Personal notes & impressions',
    'addModal.notesPlaceholder': 'What did you order? Memorable dishes...',
    'addModal.tagsLabel': 'Tags & Occasions',
    'addModal.customTagPlaceholder': 'Add custom tag...',
    'addModal.addTag': 'Add',
    'addModal.hideCoords': 'Hide coordinates',
    'addModal.manualCoords': 'Enter coordinates manually',
    'addModal.saveButton': 'Add Table',
    'addModal.saveBeen': 'Save & Start Head-to-Head Duel',
    'addModal.saveWant': 'Save to Wishlist',
    'addModal.cancelButton': 'Cancel',
    'addModal.googleMapsTitle': 'Import via Google Maps',
    'addModal.googleMapsPlaceholder': 'Paste Google Maps link (maps.app.goo.gl/...) or place name',
    'addModal.googleMapsButton': 'Import',
    'addModal.googleMapsLoading': 'Fetching details...',
    'addModal.googleMapsSuccess': 'Data imported from Google Maps',
    'addModal.googleMapsError': 'Could not extract place details from link',

    // Place Detail Modal
    'details.status': 'Status',
    'details.beenRanked': 'Been & Ranked',
    'details.wantToTry': 'Want to Try',
    'details.visits': 'Visits',
    'details.times': 'times',
    'details.logVisit': '+ Log visit',
    'details.logVisitTooltip': 'Log another visit',
    'details.notesTitle': 'Notes & Highlights',
    'details.noNotes': 'No notes added yet.',
    'details.edit': 'Edit',
    'details.saveNotes': 'Save Notes',
    'details.tagsTitle': 'Tags & Vibe',
    'details.runDuel': 'Run Ranking Duel',
    'details.deletePlace': 'Delete',
    'details.deleteTooltip': 'Delete place',
    'details.rankBadge': 'Rank #{rank}',

    // Backup Modal
    'backup.title': 'Backup & Share',
    'backup.subtitle': 'Export or import your tables',
    'backup.exportSection': 'Export Ranking Backup',
    'backup.exportDesc': 'Download your curated restaurant collection as a JSON file to share or keep safe.',
    'backup.downloadButton': 'Download JSON Backup',
    'backup.importSection': 'Import Ranking Backup',
    'backup.importDesc': 'Upload a previously exported Tastemap JSON file to merge or restore your places.',
    'backup.selectFile': 'Select JSON File',
    'backup.exportedSuccess': 'Ranking exported successfully!',
    'backup.importedSuccess': '{count} restaurants imported successfully!',
    'backup.validationError': 'Failed to validate file.',

    // Mobile / Page
    'page.listTab': 'List',
    'page.mapTab': 'Map',
    'page.beenMobile': 'Ranked',
    'page.wantMobile': 'Want to try',
    'page.triedDuel': 'I tried it! Run Ranking Duel',
    'page.viewDetails': 'View details',

    // Map
    'map.legendBeen': 'Been • ranked',
    'map.legendWant': 'Want to try',
    'map.rankedBadge': '#{rank} Ranked',
    'map.beenBadge': 'Been',
    'map.wantBadge': 'Want to try',
    'map.loading': 'Loading interactive map...',

    // Language Switcher
    'language.en': 'English',
    'language.pt-BR': 'Português (Brasil)',
    'language.switchTo': 'Switch language',
  },
  'pt-BR': {
    // Common / TopNavbar
    'common.addPlace': 'Adicionar restaurante',
    'common.searchPlaceholder': 'Buscar seus restaurantes',
    'common.insights': 'Perfil Gastronômico & Insights',
    'common.darkMode': 'Mudar para Modo Escuro',
    'common.lightMode': 'Mudar para Modo Claro',
    'common.backup': 'Backup & Compartilhar Rankings',
    'common.restoreDemo': 'Restaurar dados de Londres',
    'common.done': 'Concluído',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.close': 'Fechar',

    // Sidebar
    'sidebar.location': 'Londres',
    'sidebar.placesCount': '{places} lugares • {ranked} classificados',
    'sidebar.title': 'Seus melhores restaurantes',
    'sidebar.subtitle':
      'Classificados em duelos diretos, garantindo que o seu #3 é realmente melhor que o #4 — sem notas genéricas.',
    'sidebar.tabRanked': 'Classificados',
    'sidebar.tabWantToTry': 'Quero Conhecer',
    'sidebar.allLondon': 'Toda Londres',
    'sidebar.filterDistance': 'Filtrar restaurantes por raio de distância',
    'sidebar.decider': 'Decisor',
    'sidebar.deciderTitle': 'Decisor rápido: onde comer hoje?',
    'sidebar.allCuisines': 'Todas',
    'sidebar.noPlaces': 'Nenhum restaurante encontrado',
    'sidebar.noPlacesDesc': 'Ajuste sua busca ou filtros acima.',

    // PlaceCard
    'placeCard.beenVisits': '{count} visitas',
    'placeCard.topPick': 'TOP PICK',
    'placeCard.duel': 'Duelo',
    'placeCard.duelTooltip': 'Disputar duelo de ranking',
    'placeCard.rerankTooltip': 'Reclassificar restaurante',
    'placeCard.detailsTooltip': 'Detalhes e notas',
    'placeCard.deleteTooltip': 'Remover',

    // Modals / Insights
    'modals.insightsTitle': 'Perfil Gastronômico & Insights',
    'modals.insightsSubtitle': 'Estatísticas pessoais e análise culinária',
    'modals.totalPlaces': 'Total de Lugares',
    'modals.completionRate': 'Taxa de Conclusão',
    'modals.totalVisits': 'Total de Refeições',
    'modals.avgPriceTier': 'Faixa Média de Preço',
    'modals.topRankedTable': '#1 Restaurante do Ranking',
    'modals.mostVisitedStaple': 'Restaurante Mais Visitado',
    'modals.cuisinePreferences': 'Preferências Culinárias',
    'modals.priceDistribution': 'Distribuição de Preços',
    'modals.topNeighborhoods': 'Principais Bairros',
    'modals.tried': 'visitados',
    'modals.wishlist': 'na lista',
    'modals.mealsLogged': 'Refeições registradas',
    'modals.levelOf': 'Nível {level} de 4.0',
    'modals.noRanked': 'Nenhum restaurante ranqueado ainda. Dispute um duelo para coroar seu #1!',
    'modals.noVisits': 'Nenhum registro de visita contabilizado ainda.',
    'modals.favoriteNotes': 'Seu clássico favorito',

    // Decider Modal
    'decider.modalTitle': 'Onde Vamos Comer?',
    'decider.quickDecider': 'Decisor Rápido',
    'decider.subtitle': 'Mini torneio eliminatório para resolver a indecisão em segundos',
    'decider.scope': 'Abrangência',
    'decider.allPlaces': 'Todos os Lugares',
    'decider.wantToTry': 'Quero Conhecer',
    'decider.beenRanked': 'Visitados (Ranqueados)',
    'decider.cuisinePreference': 'Preferência de Culinária',
    'decider.anyCuisine': 'Qualquer Culinária ({count} disponíveis)',
    'decider.eligible': 'Restaurantes participantes da disputa:',
    'decider.optionsCount': '{count} opções',
    'decider.startTournament': 'Iniciar Torneio Rápido!',
    'decider.selectMin': 'Selecione filtros com pelo menos 2 restaurantes',
    'decider.cravingQuestion': 'Qual você está com mais vontade de comer agora?',
    'decider.knockoutRound': 'Rodada eliminatória {round}',
    'decider.choose': 'Escolher {name}',
    'decider.winnerCrowned': 'Temos um campeão!',
    'decider.eatToday': 'Onde você deve comer hoje:',
    'decider.showOnMap': 'Ver no mapa e bom apetite!',
    'decider.decideAgain': 'Decidir novamente',

    // Comparison / Duel Modal
    'duel.title': 'Qual você prefere?',
    'duel.findingRank': 'Definindo Posição Exata',
    'duel.subtitle': 'Qual restaurante proporcionou uma melhor experiência gastronômica?',
    'duel.roundProgress': 'Rodada de comparação {round} de ~{total}',
    'duel.candidate': 'Candidato',
    'duel.currentOpponent': 'Oponente atual',
    'duel.betterThanThis': 'Melhor que este',
    'duel.keyboardCandidate': 'Teclado: Pressione 1 ou Seta para Esquerda',
    'duel.keyboardOpponent': 'Teclado: Pressione 2 ou Seta para Direita',
    'duel.rankSecured': 'Nova Posição Definida!',
    'duel.rankedAt': 'Classificado em #{rank} de {total}',

    // Add Place Modal
    'addModal.title': 'Adicionar Novo Restaurante',
    'addModal.subtitle': 'Cadastre um restaurante em Londres com coordenadas e duelo',
    'addModal.searchOsm': 'Buscar endereço no OpenStreetMap',
    'addModal.searching': 'Buscando...',
    'addModal.nameLabel': 'Nome do Restaurante',
    'addModal.namePlaceholder': 'ex.: Dishoom',
    'addModal.addressLabel': 'Endereço Completo',
    'addModal.addressPlaceholder': 'ex.: 12 Upper St Martins Ln',
    'addModal.neighborhoodLabel': 'Bairro / Região',
    'addModal.neighborhoodPlaceholder': 'ex.: Covent Garden',
    'addModal.cuisineLabel': 'Culinária / Estilo',
    'addModal.cuisinePlaceholder': 'ex.: Indiana, Italiana, Basca',
    'addModal.priceLabel': 'Faixa de Preço',
    'addModal.statusQuestion': 'Você já comeu aqui?',
    'addModal.beenOption': 'Já estive aqui (Disputar Ranking)',
    'addModal.wantOption': 'Quero conhecer (Lista de Desejos)',
    'addModal.visitsLabel': 'Número de visitas',
    'addModal.notesLabel': 'Notas e impressões pessoais',
    'addModal.notesPlaceholder': 'O que pediu? Pratos imperdíveis...',
    'addModal.tagsLabel': 'Tags & Ocasiões',
    'addModal.customTagPlaceholder': 'Adicionar tag personalizada...',
    'addModal.addTag': 'Adicionar',
    'addModal.hideCoords': 'Ocultar coordenadas',
    'addModal.manualCoords': 'Inserir coordenadas manualmente',
    'addModal.saveButton': 'Adicionar Restaurante',
    'addModal.saveBeen': 'Salvar & Iniciar Duelo de Ranking',
    'addModal.saveWant': 'Salvar na Lista de Desejos',
    'addModal.cancelButton': 'Cancelar',
    'addModal.googleMapsTitle': 'Importar via Google Maps',
    'addModal.googleMapsPlaceholder': 'Cole o link do Google Maps (maps.app.goo.gl/...) ou nome do local',
    'addModal.googleMapsButton': 'Importar',
    'addModal.googleMapsLoading': 'Buscando detalhes...',
    'addModal.googleMapsSuccess': 'Dados importados do Google Maps',
    'addModal.googleMapsError': 'Não foi possível extrair os dados pelo link',

    // Place Detail Modal
    'details.status': 'Status',
    'details.beenRanked': 'Visitado & Classificado',
    'details.wantToTry': 'Quero Conhecer',
    'details.visits': 'Visitas',
    'details.times': 'vezes',
    'details.logVisit': '+ Registrar visita',
    'details.logVisitTooltip': 'Registrar mais uma visita',
    'details.notesTitle': 'Notas & Destaques',
    'details.noNotes': 'Nenhuma nota registrada.',
    'details.edit': 'Editar',
    'details.saveNotes': 'Salvar Notas',
    'details.tagsTitle': 'Tags & Atmosfera',
    'details.runDuel': 'Disputar Duelo de Ranking',
    'details.deletePlace': 'Excluir Restaurante',
    'details.deleteTooltip': 'Excluir restaurante',
    'details.rankBadge': '#{rank} no Ranking',

    // Backup Modal
    'backup.title': 'Backup & Compartilhar',
    'backup.subtitle': 'Exporte ou importe seus restaurantes',
    'backup.exportSection': 'Exportar Backup do Ranking',
    'backup.exportDesc': 'Baixe sua lista de restaurantes em arquivo JSON para compartilhar ou manter em segurança.',
    'backup.downloadButton': 'Baixar Backup JSON',
    'backup.importSection': 'Importar Backup do Ranking',
    'backup.importDesc': 'Envie um arquivo JSON exportado do Tastemap para restaurar seus restaurantes.',
    'backup.selectFile': 'Selecionar Arquivo JSON',
    'backup.exportedSuccess': 'Ranking exportado com sucesso!',
    'backup.importedSuccess': '{count} restaurantes importados com sucesso!',
    'backup.validationError': 'Falha ao validar arquivo.',

    // Mobile / Page
    'page.listTab': 'Lista',
    'page.mapTab': 'Mapa',
    'page.beenMobile': 'Classificado',
    'page.wantMobile': 'Quero Conhecer',
    'page.triedDuel': 'Experimentei! Disputar Duelo de Ranking',
    'page.viewDetails': 'Ver detalhes',

    // Map
    'map.legendBeen': 'Visitado • ranqueado',
    'map.legendWant': 'Quero conhecer',
    'map.rankedBadge': '#{rank} Ranqueado',
    'map.beenBadge': 'Visitado',
    'map.wantBadge': 'Quero conhecer',
    'map.loading': 'Carregando mapa interativo...',

    // Language Switcher
    'language.en': 'Inglês',
    'language.pt-BR': 'Português (Brasil)',
    'language.switchTo': 'Alternar idioma',
  },
};

/**
 * Substitui placeholders como {name}, {count} pelos respectivos valores informados.
 */
export function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
}

/**
 * Obtém a tradução com fallback seguro para inglês caso o idioma ou chave não existam.
 */
export function getTranslation(
  lang: Language,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const langDict = translations[lang] || translations.en;
  const rawText = langDict[key] || translations.en[key] || key;
  return interpolate(rawText, params);
}
