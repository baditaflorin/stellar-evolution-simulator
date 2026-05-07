# 0013 - Testing Strategy

## Status

Accepted

## Context

The core risks are incorrect remnant classification, broken build output, Pyodide startup regressions, and GitHub Pages base path mistakes.

## Decision

Use:

- Vitest for TypeScript unit tests.
- Playwright for a headless happy-path smoke test.
- `scripts/smoke.sh` to build, serve `docs/`, and run Playwright.
- `make test`, `make build`, `make smoke`, and `make lint` as the local quality gates.

## Consequences

- Core model helper logic can be tested quickly.
- Smoke tests validate the app as GitHub Pages will serve it.
- Full Pyodide runtime smoke may be slower than normal unit tests, so it runs only in smoke.

## Alternatives Considered

- Browser-only manual QA. Rejected because smoke coverage is required.
- GitHub Actions. Rejected by project constraints.
