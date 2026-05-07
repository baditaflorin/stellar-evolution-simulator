# 0004 - Static Data Contract

## Status

Accepted

## Context

Mode A does not require generated datasets. The only durable data contract is the shape of the simulation output produced in-browser.

## Decision

Define the v1 simulation output contract in TypeScript and mirror it in the Pyodide Python model:

- `schemaVersion`: string, currently `stellar-track/v1`.
- `inputMassSolar`: number.
- `summary`: remnant type, lifetime, peak radius, peak luminosity, final core mass, final surface temperature, and educational caveat.
- `track`: ordered samples with age, phase, radius, luminosity, effective temperature, core mass, and mass remaining.

No `/data/` artifact path exists in v1.

## Consequences

- The app does not depend on network data fetches after the static assets load.
- Breaking changes to simulator output require a schema version bump.
- The UI can validate simulation output before rendering.

## Alternatives Considered

- Precomputed JSON grids. Rejected for v1 because the simplified model is small and interactive.
- Parquet or SQLite artifacts. Rejected because there is no Mode B pipeline.
