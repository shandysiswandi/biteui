# Repository Guidelines

## Project Structure & Module Organization

- `src/application` houses app-level wiring (routing, providers, bootstrapping).
- `src/feature` contains domain-driven feature modules (API, model, UI for each feature).
- `src/ui` holds shared UI components (e.g., `src/ui/components/base`).
- `src/lib` is for shared utilities, API clients, and helpers.
- `src/main.tsx` and `src/main.css` are the Vite entrypoints.
- `public/` stores static assets; `dist/` is the production build output.
- Tests live in `tests/` with Playwright specs in `tests/pages` and `tests/scenarios`.

## Build, Test, and Development Commands

- `make install` (or `pnpm install`) installs dependencies; supports `PM=bun|pnpm|npm|yarn`.
- `make run` / `pnpm run dev` starts the Vite dev server at `http://localhost:5173`.
- `make build` / `pnpm run build` builds the app (TypeScript project build + Vite).
- `make preview` / `pnpm run preview` serves the production build locally.
- `make lint` / `pnpm run lint` runs ESLint.
- `make format` / `pnpm run format` formats with Prettier.
- `make typecheck` / `pnpm run typecheck` runs `tsc -b`.
- `make test` / `pnpm run test` runs Playwright (uses `make run` as a web server).

## Coding Style & Naming Conventions

- TypeScript + React with Vite; imports can use the `@/` alias for `src`.
- Follow existing formatting: Prettier is the source of truth; avoid manual styling.
- Prefer 2-space indentation and double quotes (match existing files).
- Components use PascalCase; hooks use `useX` naming; keep files in `kebab-case` or existing patterns.

## Testing Guidelines

- Playwright is configured in `playwright.config.ts` with tests in `tests/**/*.spec.ts`.
- Name new specs with `.spec.ts` and keep scenarios in `tests/scenarios` or `tests/pages`.
- Run targeted tests via `pnpm test tests/scenarios/login-flow.spec.ts`.

## Commit & Pull Request Guidelines

- Git history currently shows only an initial commit; no established convention yet.
- Until a convention is defined, use clear, imperative commit messages (e.g., "Add sidebar filters").
- PRs should include a concise description, linked issues if applicable, and screenshots for UI changes.

## Configuration Tips

- Vite config lives in `vite.config.ts` (vendor chunking is customized).
- Playwright uses `http://localhost:5173` and will reuse an existing dev server.
