# Retrieve Anime (Vite + React + TypeScript)

An opinionated two-page sample app (Search + Detail) that lets users search for anime using the Jikan API. Built with React, TypeScript, Vite and Redux Toolkit. Includes unit tests (Vitest) and a Dockerfile for production builds.

Contents

- Features
- Architecture
- Technology stack
- Local development
- Tests
- Docker
- Project layout & notes
- Contact

---

!['Screenshot'](/public/Screenshot.png)

## Features

- Search anime (server-side pagination)
- Instant search with 250ms debounce and cancellation of in-flight requests
- Detail page with synopsis, Japanese title, episodes, rating and metadata
- Global state via Redux Toolkit (slices + thunks)
- Routing with react-router
- Small UI built on Chakra + simple custom color-mode hook
- Unit tests with Vitest + Testing Library
- Dockerfile to build a production image served by nginx

## Architecture

Layered and modular:

- `infrastructure/` — API client (Jikan axios wrapper)
- `domain/store/` — Redux slices and async thunks (search, detail)
- `pages/` & `components/` — React presentation and container components
- `hooks/` — reusable hooks (debounce, color-mode helper)

Design notes

- Tests are colocated with code by default (recommended). See `vitest.config.ts` for patterns.
- Tests that render JSX must use `*.test.tsx` or `*.spec.tsx`. Plain utility tests may be `*.test.ts`.

## Technology

- Framework: React + TypeScript
- Bundler: Vite
- State: Redux Toolkit
- HTTP: axios (Jikan API)
- UI: Chakra UI (light integration; a local color-mode hook is used to avoid version-specific Chakra APIs)
- Testing: Vitest + @testing-library/react + happy-dom
- Docker: multi-stage build (node builder + nginx runtime)

## Requirements

- Node.js (recommended >= 20.19.0 or >= 22.12.0)
- npm 9+ (or yarn/pnpm)

## Local development

1. Install deps:

```powershell
npm install
```

2. Run dev server (Vite, default port 4000):

```powershell
npm run dev
```

Notes:

- If port 4000 is in use Vite will pick the next available port. If you need port 4000 specifically, free it first.
- Vite may show a Node engine advisory if your local Node is older/newer than recommended; upgrading Node is recommended.

## Build (production)

```powershell
npm run build
```

The `dist/` folder will contain the static site to serve.

## Tests

Run the test suite:

```powershell
npm test
```

Notes on tests:

- Vitest is configured in `vitest.config.ts` to use `happy-dom` for DOM testing.
- Conventions: tests can be named `*.test.ts(x)` or `*.spec.ts(x)`. Colocated tests are preferred.

## Docker

Build image (from repo root):

```powershell
docker build -t retrieve-anime-vite:latest .
```

Run container (exposes app on port 8080):

```powershell
docker run --rm -p 8080:80 retrieve-anime-vite:latest
```

Notes:

- Dockerfile is a multi-stage build: Node builder uses `node:20.19.0`, runtime uses `nginx:stable-alpine` and serves `dist/` with an SPA fallback.

## Project layout (important files)

- `src/infrastructure/jikanClient.ts` — axios wrappers for the Jikan API
- `src/domain/store/searchSlice.ts` — search async thunk + reducers
- `src/domain/store/detailSlice.ts` — detail async thunk + reducers
- `src/pages/SearchPage.tsx` — search UI with debounced input and pagination
- `src/pages/DetailPage.tsx` — anime detail page
- `src/hooks/useDebouncedValue.ts` — 250ms debounce hook
- `src/hooks/useAppColorMode.tsx` — lightweight color-mode hook (localStorage + data-attribute)
- `src/Providers.tsx` — Redux + Chakra + Router wrapper used by `main.tsx`
- `vite.config.ts` — Vite configuration
- `vitest.config.ts` — test config (happy-dom, setup file)
- `Dockerfile` & `docker/nginx.conf` — container build + SPA serve config

## Conventions & tips

- Put tests next to the modules they exercise (`Component.test.tsx` or `module.spec.ts`).
- Use the Redux slices under `src/domain/store` as the canonical store layer. Re-exports may exist for compatibility.
- Keep API response handling defensive — the Jikan API can sometimes change shapes.

## Troubleshooting

- If Vite warns about Node version, upgrade Node (nvm or installer) to >=20.19.0.
- If port 4000 is in use, kill the process or change Vite's port in `vite.config.ts`.
- If tests fail due to ESM/CommonJS issues, the project uses `happy-dom` to avoid `jsdom`/`parse5` ESM require errors on newer Node.

## Contact

Author: Rahmad Alamsyah Nazaruddin — nzr.rahmad@gmail.com
