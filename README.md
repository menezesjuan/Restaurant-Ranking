# 🗺️ Tastemap - Interactive Restaurant Ranking & Food Map

> Um mapa interativo e sistema de classificação de restaurantes que substitui estrelas por duelos *head-to-head*, com posições fracionárias $O(1)$, busca binária iterativa e sincronização bidirecional completa com OpenStreetMap/Leaflet. Inspirado no desafio [Restaurant Ranking App do Frontend Mentor](https://www.frontendmentor.io/challenges/restaurant-ranking-app).

---

## ✨ Principais Funcionalidades

- ⚔️ **Duelos Head-to-Head ($O(\log n)$):** Em vez de notas arbitrárias de 1 a 5 estrelas, os restaurantes visitados disputam duelos diretos ("Qual foi melhor? Place A ou Place B?"). A posição exata é calculada através de uma busca binária interativa em no máximo $\lceil \log_2(n) \rceil$ perguntas.
- 🧮 **Posições Fracionárias ($O(1)$) & Rebalanceamento:**
  - Lista vazia: `1000.0`
  - Antes do #1 atual: `nextPosition / 2`
  - Abaixo do último: `prevPosition + 1000.0`
  - Entre dois lugares: `(prevPosition + nextPosition) / 2`
  - Detecção automática de rebalanceamento caso o intervalo fique $< 0.0001$.
- 🧭 **"Where Should We Eat?" (Decisor Rápido):** Mini-torneio eliminatório estilo mata-mata de até 3 rodadas para resolver a indecisão com celebração de confete e foco no mapa.
- 🗺️ **Sincronização Bidirecional com Mapa (Leaflet & OSM):**
  - Clicar em um card na lista move a câmera do mapa suavemente (`flyTo`) e abre o popup.
  - Clicar em um pin no mapa faz scroll suave e destaca o card correspondente na lista.
- 📍 **Geocoding Integrado (Nominatim OpenStreetMap):** Autocompletar de endereços com detecção de coordenadas geográficas e fallback para input manual de latitude/longitude.
- 💾 **Arquitetura Híbrida (Guest Mode + PostgreSQL/Prisma):**
  - Sessão visitante pré-carregada com restaurantes emblemáticos de Londres (Dishoom, Padella, The Ledbury, Gymkhana, etc.).
  - Persistência nativa em PostgreSQL via Prisma ORM quando `DATABASE_URL` estiver configurada.

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) (App Router) com TypeScript
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Mapas:** [Leaflet](https://leafletjs.com/) com tiles CartoDB / OpenStreetMap (sem necessidade de API key)
- **Banco de Dados & ORM:** PostgreSQL com [Prisma ORM](https://www.prisma.io/)
- **Ícones & Efeitos:** [Lucide React](https://lucide.dev/), [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Como Executar Localmente

### 1. Clonar o Repositório e Instalar Dependências
```bash
npm install
```

### 2. Rodar os Testes Matemáticos de Ranking
Valide os algoritmos de inserção fracionária e detecção de rebalanceamento:
```bash
npm run test:ranking
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador. O app iniciará no **Modo Visitante com restaurantes reais de Londres** pré-carregados!

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
│   ├── globals.css       # Estilos globais, Leaflet dark popup e scrollbars
│   ├── layout.tsx        # Layout raiz e metadados SEO
│   └── page.tsx          # Split-screen desktop e responsividade mobile
├── components/
│   ├── map/              # LeafletMap, MapView SSR-safe
│   ├── modals/           # ComparisonModal (duelos), DeciderModal, AddPlaceModal
│   └── sidebar/          # Sidebar, FilterBar, PlaceCard
├── contexts/             # PlacesContext, MapSelectionContext (bidirecionalidade)
├── data/                 # london-mock-places.json (dados mock de Londres)
├── hooks/                # useHeadToHeadComparison.ts (algoritmo busca binária)
├── lib/                  # ranking-calc.ts, geocoding.ts, prisma.ts, places-storage.ts
├── prisma/               # schema.prisma com modelo de posições fracionárias
└── test/                 # Testes unitários do motor de ranking
```
