# 0002 - Architecture Overview And Module Boundaries

## Status

Accepted

## Context

The project needs a small, understandable architecture that keeps simulation logic testable while making the browser experience rich and responsive.

## Decision

Use a client-only architecture:

- `src/app/` owns app shell, providers, and error boundaries.
- `src/features/simulator/` owns domain components, state, and the Pyodide bridge.
- `src/features/simulator/model/` owns pure TypeScript validation, remnant classification, summaries, and testable helper logic.
- `src/shared/` owns reusable UI, configuration, metadata, and utilities.
- `public/` owns static PWA assets.
- `docs/` is the committed GitHub Pages build output.

## Consequences

- Domain logic remains unit-testable without the DOM or Pyodide.
- The UI can lazy-load heavy simulation dependencies behind explicit user action.
- There is no backend module boundary in v1.

## Alternatives Considered

- A monolithic `App.tsx`. Rejected because simulator logic and UI state would become hard to test.
- A backend-plus-frontend split. Rejected by ADR 0001.
