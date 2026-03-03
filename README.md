# Instagram Posts

Frontend em React + TypeScript para buscar e exibir posts (fotos e vídeos) do Instagram por usuário, usando a API [Instagram120](https://rapidapi.com) da RapidAPI.

## Estrutura do projeto

```
src/
├── components/
│   ├── Button/
│   ├── Card/
│   ├── EmptyState/
│   ├── ErrorMessage/
│   ├── Filter/
│   ├── Header/
│   ├── Layout/
│   ├── PostCard/        # Card de post (mídia + legenda)
│   ├── Spinner/
│   └── UsernameInput/   # Campo usuário + botão Buscar
├── config/
│   └── constants.ts
├── pages/
│   └── NewsPage/        # Página principal (busca por usuário)
├── services/
│   └── instagram.service.ts   # POST /api/instagram/posts
├── styles/
│   └── global.css
├── types/
│   └── instagram.types.ts
├── App.tsx
└── main.tsx
```

## Configuração da API (RapidAPI)

A aplicação usa a API **Instagram120** na RapidAPI.

1. Crie um arquivo `.env` na raiz do projeto.
2. Adicione sua chave da RapidAPI:

```
VITE_RAPIDAPI_KEY=sua_chave_aqui
```

Opcional: para outro host, defina `VITE_RAPIDAPI_HOST`. O padrão é `instagram120.p.rapidapi.com`.

A API é chamada com **POST** em `/api/instagram/posts`, corpo JSON: `{"username":"...", "maxId":""}`.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — visualizar o build

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173). Digite um usuário do Instagram e clique em **Buscar** para listar os posts.
