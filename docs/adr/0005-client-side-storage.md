# 0005 - Client-Side Storage

## Status

Accepted

## Context

Users benefit from having their last selected mass and display preferences restored, but v1 does not need accounts or cross-device sync.

## Decision

Use `localStorage` for small, non-sensitive preferences:

- last selected stellar mass
- selected chart tab
- reduced motion acknowledgement where relevant

Simulation output is recomputed on demand and is not persisted in v1.

## Consequences

- Storage remains simple and transparent.
- No IndexedDB or OPFS migration strategy is needed.
- Clearing browser data resets preferences.

## Alternatives Considered

- IndexedDB. Rejected because stored values are tiny.
- Server-side persistence. Rejected because cross-device sync is not a v1 goal.
