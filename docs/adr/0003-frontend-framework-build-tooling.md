# 0003 - Frontend Framework And Build Tooling

## Status

Accepted

## Context

The app needs strict TypeScript, a polished interactive UI, lazy-loaded scientific dependencies, and a GitHub Pages-friendly static build.

## Decision

Use React, TypeScript strict mode, Vite, Tailwind CSS, Vitest, Playwright, ESLint, and Prettier.

Build output goes directly to `docs/`, with Vite `base` set to `/stellar-evolution-simulator/`.

## Consequences

- Vite gives fast local development and hashed production assets.
- React keeps the interactive controls and chart state straightforward.
- Tailwind supports a custom, restrained interface without bringing a component framework.
- `docs/` must remain committed because GitHub Pages serves from it.

## Alternatives Considered

- Vanilla TypeScript. Rejected because the UI state and view composition benefit from React.
- Next.js. Rejected because static GitHub Pages deployment is simpler with Vite.
