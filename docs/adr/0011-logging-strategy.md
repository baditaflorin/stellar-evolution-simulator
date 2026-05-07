# 0011 - Logging Strategy

## Status

Accepted

## Context

Mode A has no server logs. Browser logging should be helpful during development and quiet in production.

## Decision

Use minimal browser console output in production. Errors caught by the global error boundary are shown in the UI. Developer-only diagnostics are guarded by `import.meta.env.DEV`.

## Consequences

- Production users are not exposed to noisy console output.
- Debuggability remains available during local development.
- There is no structured server logging in v1.

## Alternatives Considered

- Client telemetry logging. Rejected because v1 defaults to no analytics.
