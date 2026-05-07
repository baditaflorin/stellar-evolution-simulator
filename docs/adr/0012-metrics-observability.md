# 0012 - Metrics And Observability

## Status

Accepted

## Context

Mode A has no backend metrics endpoint. The app can still communicate errors clearly to users.

## Decision

Ship no analytics in v1.

Observability consists of local tests, smoke tests, clear UI error states, and GitHub Pages availability. `docs/privacy.md` documents that no analytics or PII collection are used.

## Consequences

- No user tracking scripts are loaded.
- There are no dashboards or server-side metrics.
- Usage insight must come from voluntary GitHub feedback.

## Alternatives Considered

- Plausible analytics. Rejected for v1 to keep privacy and payload simple.
- Self-hosted beacon. Rejected because it would require backend infrastructure.
