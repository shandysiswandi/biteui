# Repository Guidelines

## Project Structure

- `src/main.tsx`: app entrypoint (mounts React + global CSS).
- `src/app/`: app shell (router, providers, error boundary).
- `src/feature/`: feature modules organized by domain (e.g. `src/feature/auth/...`).
- `src/ui/`: shared UI layer.
  - `src/ui/components/base/`: design-system primitives (shadcn/radix-style components).
  - `src/ui/components/`: composed components (e.g. `login-form.tsx`).
  - `src/ui/layouts/`: route layouts.
- `src/lib/`: shared utilities/hooks (e.g. `src/lib/utils/tailwind.ts` exports `cn()`).
- `public/`: static assets served by Vite.
- Build output goes to `dist/` (ignored by git).

## Build, Test, and Development Commands

Use `pnpm` (lockfile: `pnpm-lock.yaml`).

- `pnpm install`: install dependencies.
- `pnpm dev`: run the Vite dev server.
- `pnpm build`: typecheck (`tsc -b`) and build for production.
- `pnpm preview`: serve the production build locally.
- `pnpm lint`: run ESLint over the repo.
- `pnpm format` / `pnpm format:check`: format or verify formatting with Prettier.

## Coding Style & Naming Conventions

- Indentation: 2 spaces; line width: ~80 (see `.prettierrc.json`).
- Formatting: Prettier (no semicolons, double quotes, sorted imports, Tailwind class sorting).
- Linting: ESLint flat config (`eslint.config.js`) with TypeScript + React Hooks rules.
- Imports: use the `@/` alias for `src/` (configured in `tsconfig*.json` and `vite.config.ts`).
- Naming patterns used in the repo:
  - UI components: `kebab-case.tsx` (e.g. `mode-toggle.tsx`).
  - Feature screens: `.../view/index.tsx`; hooks live in sibling `hook/` folders.

## Testing Guidelines

No automated test framework is configured yet. For changes, verify locally via `pnpm dev`, and consider adding a test setup (e.g., Vitest + React Testing Library) if you introduce non-trivial logic.

## Commit & Pull Request Guidelines

This repository currently has no git commit history. When creating commits, prefer Conventional Commits (e.g. `feat(ui): add dropdown`, `fix(auth): handle empty token`).

PRs should include:

- a short “what/why” description and steps to verify,
- screenshots or a short recording for UI changes,
- linked issues/tickets when applicable.

## Configuration Tips

- Copy `.env.example` to `.env` and keep secrets out of git (`.env*` is ignored).
- Vite exposes only `VITE_`-prefixed variables (e.g. `VITE_BASE_API_URL`).
