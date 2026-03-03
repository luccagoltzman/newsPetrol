# News Petrol

Frontend em React + TypeScript para exibir notícias de petróleo, gás e energias renováveis, consumindo a API de Notícias de Petróleo e Gás.

## Estrutura do projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button/          # Button.tsx + Button.module.css
│   ├── Card/            # Card de notícia
│   ├── EmptyState/      # Estado vazio
│   ├── ErrorMessage/    # Mensagem de erro + retry
│   ├── Filter/          # Filtro por fonte
│   ├── Header/          # Cabeçalho da aplicação
│   ├── Layout/          # Layout principal
│   └── Spinner/         # Loading
├── config/
│   └── constants.ts     # Constantes e opções de fonte
├── pages/
│   └── NewsPage/        # Página de listagem de notícias
├── services/
│   └── news.service.ts  # Chamadas à API
├── styles/
│   └── global.css       # Estilos globais e variáveis CSS
├── types/
│   └── news.types.ts    # Tipos TypeScript
├── App.tsx
└── main.tsx
```

Cada componente segue a separação clara entre **lógica/JSX** (`.tsx`) e **estilos** (`.module.css`).

## Configuração da API

A URL base da API é configurável via variável de ambiente:

- Crie um arquivo `.env` na raiz do projeto.
- Defina `VITE_API_BASE_URL` com a URL base da API (ex.: `https://api.exemplo.com`).

Exemplo `.env`:

```
VITE_API_BASE_URL=https://sua-api.com
```

O endpoint utilizado é `GET /noticias` com parâmetro opcional `source` para filtrar por fonte (ex.: `telegraph`, `thetimes`).

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera o build de produção
- `npm run preview` — visualiza o build localmente

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).
