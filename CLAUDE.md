# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Poker bankroll Monte Carlo simulator — frontend. SvelteKit 2, Svelte 5 (Runes mode), TypeScript, Tailwind CSS 4. Package manager: **Bun**.

Backend lives at `../bankroll-back` (Rust, Axum). Serves `POST /simulate` on port 3000 — accepts a JSON body matching `SimulateRequest`, returns `SimulateResponse`. Types in `src/lib/types.ts` mirror the backend contract.

## Commands

```bash
bun run dev          # dev server
bun run build        # production build
bun run preview      # preview production build
bun run check        # svelte-kit sync + svelte-check
bun run lint         # prettier --check + eslint
bun run format       # prettier --write
```

## Architecture

Single-page app. Left sidebar has a form (bankroll, simulation, limits, cashout params), right side shows results.

- **Routes**: `/` — simulator page. `/theme` — PUT endpoint that persists theme choice in a cookie.
- **State**: Single `$state()` object in `+page.svelte`, drilled into child components via `$bindable` props. No global stores.
- **UI components**: shadcn-svelte (nova style, zinc base) in `src/lib/components/ui/`. Install new ones with `bunx shadcn-svelte@latest add <name>`. Component reference: `docs/shadcn-svelte.md`.
- **Domain components**: `src/lib/components/params/` — form sections. `src/lib/components/Results.svelte` — results display.
- **Types**: `src/lib/types.ts` — `Limit`, `SimulateRequest`, `SimulateResponse`, `CashoutRule`, `ProbabilityQuery`. `src/lib/limits.ts` — 10 preset poker limits (NL2–NL5000).
- **i18n**: Paraglide. Base locale **ru**, also **en**. Source messages in `messages/{locale}.json`, generated runtime in `src/lib/paraglide/`. Import from `$lib/paraglide/messages.js`.
- **Theming**: Light / dark / system. CSS custom properties (OKLch) in `src/routes/layout.css`. Persisted via cookie, applied server-side in `hooks.server.ts`.
- **Styling**: Tailwind CSS 4, `@tailwindcss/forms`, `@tailwindcss/typography`. Use `cn()` from `src/lib/utils.ts` to merge classes.

## Conventions

- Svelte 5 Runes only (`$state`, `$derived`, `$effect`, `$bindable`) — no legacy `let` reactivity.
- Prettier: 2-space indent, single quotes, trailing commas, 100 char width.
- Import order (enforced by prettier plugin): `svelte` → `@sveltejs/` → `$lib/` → `$app/` → third-party → relative.
- Icons: `@lucide/svelte`.
