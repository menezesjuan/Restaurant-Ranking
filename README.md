# 🗺️ Tastemap - Interactive Restaurant Ranking & Food Map

> Um mapa interativo e sistema de classificação de restaurantes que substitui estrelas por duelos *head-to-head*, com posições fracionárias $O(1)$, busca binária iterativa, importação via Google Maps sem API, suporte bilíngue e sincronização bidirecional completa com OpenStreetMap/Leaflet. Inspirado no desafio [Restaurant Ranking App do Frontend Mentor](https://www.frontendmentor.io/challenges/restaurant-ranking-app).

---

## ✨ Principais Funcionalidades

- ⚔️ **Duelos Head-to-Head ($O(\log n)$):** Em vez de notas arbitrárias de 1 a 5 estrelas, os restaurantes visitados disputam duelos diretos ("Qual foi melhor? Place A ou Place B?"). A posição exata é calculada através de uma busca binária interativa em no máximo $\lceil \log_2(n) \rceil$ perguntas.
- 🧮 **Posições Fracionárias ($O(1)$) & Rebalanceamento:**
  - Lista vazia: `1000.0`
  - Antes do #1 atual: `nextPosition / 2`
  - Abaixo do último: `prevPosition + 1000.0`
  - Entre dois lugares: `(prevPosition + nextPosition) / 2`
  - Detecção automática de rebalanceamento caso o intervalo fique $< 0.0001$.
- 📍 **Importação via Google Maps sem API (com Segurança Rigorosa):**
  - Importe qualquer estabelecimento colando links do Google Maps (`maps.app.goo.gl/...`, `google.com/maps/place/...`, links com `/maps/search/...` ou com coordenadas).
  - Extração automática de nome, bairro, endereço completo, coordenadas geográficas e avaliações via OpenGraph e reverse geocoding.
  - **Camada de Segurança Ativa:** Proteção estrita contra **SSRF** (bloqueio de IPs de loopback, redes privadas e metadados de nuvem `169.254.169.254`), mitigação de **ReDoS** e sanitização contra **XSS**.
- 🌐 **Internacionalização (i18n):**
  - Alternância instantânea de idioma entre **Português (pt-BR)** e **Inglês (en)** através de seletor visual na barra superior.
  - Persistência automática no `localStorage` e suporte a interpolação dinâmica com 100% de paridade de chaves.
- 📊 **Taste Insights & Perfil Gastronômico:**
  - Análise profunda dos hábitos: proporção de restaurantes visitados vs. lista de desejos, total de visitas, culinárias preferidas com percentuais, ticket médio ponderado (£ a ££££) e destaque para o restaurante #1 do ranking.
- 📏 **Filtro de Proximidade & Raio Geoespacial (Fórmula de Haversine):**
  - Filtragem de restaurantes por raio geodésico de distância em quilômetros com ordenação por proximidade a partir da sua localização ou centro do mapa.
- 🧭 **"Where Should We Eat?" (Decisor Rápido):** Mini-torneio eliminatório estilo mata-mata de até 3 rodadas para resolver a indecisão com celebração de confete e foco no mapa.
- 🗺️ **Sincronização Bidirecional com Mapa (Leaflet & OSM):**
  - Clicar em um card na lista move a câmera do mapa suavemente (`flyTo`) e abre o popup.
  - Clicar em um pin no mapa faz scroll suave e destaca o card correspondente na lista.
- 💾 **Backup & Compartilhamento (Export / Import):**
  - Exporte e importe seu ranking em arquivo JSON estruturado com validação de esquema e tolerância a dados legados.
- 🏛️ **Arquitetura Híbrida (Guest Mode + PostgreSQL/Prisma):**
  - Sessão visitante pré-carregada com restaurantes emblemáticos de Londres (Dishoom, Padella, The Ledbury, Gymkhana, etc.).
  - Persistência nativa em PostgreSQL via Prisma ORM quando `DATABASE_URL` estiver configurada.

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack) com TypeScript
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Mapas:** [Leaflet](https://leafletjs.com/) com tiles CartoDB / OpenStreetMap (sem custos de API)
- **Geocoding & Reversing:** OpenStreetMap Nominatim API pública
- **Banco de Dados & ORM:** PostgreSQL com [Prisma ORM](https://www.prisma.io/)
- **Ícones & Efeitos:** [Lucide React](https://lucide.dev/), [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Como Executar Localmente

### 1. Clonar o Repositório e Instalar Dependências
```bash
npm install
```

### 2. Executar a Suíte de Testes Automatizados (TDD)
Execute todos os testes unitários, matemáticos e de segurança:
```bash
npm run test
```
*Cobreadas 6 suítes: ranking fracionário, export/import, cálculos geoespaciais (Haversine), insights gastronômicos, internacionalização (i18n) e parser/segurança do Google Maps.*

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador. O app iniciará no **Modo Visitante com restaurantes reais de Londres** pré-carregados!

### 4. Build de Produção
```bash
npm run build
```

---

## 🗄️ Configuração Opcional do PostgreSQL

Caso deseje persistir os dados em um banco de dados PostgreSQL:

1. Crie um arquivo `.env` na raiz do projeto com base em `.env.example`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/tastemap?schema=public"
```

2. Execute as migrações do Prisma:
```bash
npx prisma db push
```

---

## 📁 Estrutura do Projeto

```
├── app/
│   ├── actions/          # Server actions para sincronização com Prisma/PostgreSQL
│   ├── api/              # Endpoints (ex: /api/places/google-maps)
│   ├── globals.css       # Estilos globais, Leaflet dark popup e scrollbars
│   ├── layout.tsx        # Layout raiz e metadados SEO
│   └── page.tsx          # Split-screen desktop e responsividade mobile
├── components/
│   ├── map/              # LeafletMap, MapView SSR-safe
│   ├── modals/           # ComparisonModal, DeciderModal, AddPlaceModal, BackupModal
│   └── sidebar/          # Sidebar, FilterBar, PlaceCard, DistanceRadiusFilter
├── contexts/             # PlacesContext, MapSelectionContext, LanguageContext
├── data/                 # london-mock-places.json (dados mock de Londres)
├── hooks/                # useHeadToHeadComparison.ts (algoritmo busca binária)
├── lib/
│   ├── google-maps/      # Parser, seguidor de redirecionamentos e segurança SSRF
│   ├── i18n/             # Dicionários e motor de tradução bilíngue
│   ├── geo-distance.ts   # Fórmula de Haversine e filtros de proximidade
│   ├── taste-insights.ts # Cálculo analítico do perfil gastronômico
│   ├── ranking-calc.ts   # Matemática de posições fracionárias
│   └── geocoding.ts      # Integração com Nominatim (search e reverse)
├── prisma/               # schema.prisma com modelo de posições fracionárias
└── test/                 # Suíte completa de testes unitários automatizados
```
