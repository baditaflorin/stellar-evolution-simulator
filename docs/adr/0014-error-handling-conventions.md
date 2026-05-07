# 0014 - Error Handling Conventions

## Status

Accepted

## Context

The simulator depends on lazy-loaded browser modules and user-controlled numeric input. Failures should be understandable without exposing stack traces as the main experience.

## Decision

Use these conventions:

- Validate user input with Zod before simulation starts.
- Validate Pyodide simulation output before rendering charts.
- Show recoverable errors as inline messages or global toast alerts.
- Catch unexpected React errors with an error boundary.
- Avoid `console.error` in production except for truly unexpected failures that are also surfaced in UI.

## Consequences

- Users get clear remediation paths.
- Invalid model output cannot silently drive charts.
- Tests can assert validation behavior.

## Alternatives Considered

- Throwing raw errors into the UI. Rejected because it is unfriendly and inconsistent.
