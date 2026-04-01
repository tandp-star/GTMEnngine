@AGENTS.md

# CLAUDE.md

## Project Overview

GTM Engine is an AI-powered outreach pipeline tool for GTM teams. It provides a 5-step pipeline: Company List → Research Agent → PIO Finder → Personalization → Outreach Agent. Currently uses simulated/demo data with 16 hardcoded Indian-market companies (BFSI, staffing, pharma sectors).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS custom properties for dark/light theming
- **Deployment:** Vercel

## Build Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run start` — Serve production build
- `npm run lint` — Run ESLint

## Architecture

Single-page app (`src/app/page.tsx` is a client component). No routing needed.

### Key Directories

- `src/types/` — TypeScript interfaces (Company, AgentState, Stats, etc.)
- `src/data/companies.ts` — Hardcoded company data (16 companies)
- `src/lib/agents/` — Agent log generators (research, pio, personalization, outreach) — future API integration points
- `src/lib/utils.ts` — `cn()` class merger, `sleep()` helper
- `src/hooks/useTheme.ts` — Dark/light theme via `useSyncExternalStore`
- `src/hooks/useAgentPipeline.ts` — Core pipeline simulation hook (runs 4 agents sequentially)
- `src/components/` — All UI components

### Patterns

- State managed with `useState` + custom hooks (no external state library)
- Theme toggle uses `useSyncExternalStore` with CSS class on `<body>` (`dark`/`light`)
- Agent pipeline simulation uses `async/await` + `sleep()` with progress tracking
- CSS uses custom properties (`--surface`, `--accent`, `--border`, etc.) defined per theme in `globals.css`
