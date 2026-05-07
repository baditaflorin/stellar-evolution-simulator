# 0008 - Go Backend Layout

## Status

Accepted

## Context

The prompt defines Go backend layout requirements for Mode B and Mode C. ADR 0001 selects Mode A.

## Decision

Do not create a Go backend in v1.

## Consequences

- No `cmd/`, `internal/`, `pkg/`, `api/`, `configs/`, or Go module is needed.
- Go linting and backend smoke targets are omitted.
- Backend layout can be introduced later only if the deployment mode changes.

## Alternatives Considered

- Empty Go project skeleton. Rejected because it would imply a backend that v1 does not need.
