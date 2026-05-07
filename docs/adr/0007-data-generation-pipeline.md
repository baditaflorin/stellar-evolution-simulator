# 0007 - Data Generation Pipeline

## Status

Accepted

## Context

Mode B data generation is not required by the accepted deployment mode.

## Decision

Do not build a data generation pipeline in v1.

If later versions add precomputed stellar grids, they will use a Mode B pipeline with deterministic artifacts under versioned `/data/vN/` paths or GitHub Releases.

## Consequences

- `make data` is intentionally absent in v1.
- No offline backend binary exists.
- The frontend contract remains the in-browser `stellar-track/v1` schema.

## Alternatives Considered

- Building a placeholder generator. Rejected because it would create unused maintenance surface.
