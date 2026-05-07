# 0009 - Configuration And Secrets Management

## Status

Accepted

## Context

Mode A has no server runtime and no secrets. Build metadata and public URLs still need configuration.

## Decision

Use Vite environment variables for public, non-secret build-time values:

- `VITE_APP_VERSION`
- `VITE_COMMIT_SHA`

The frontend must never contain API keys, tokens, passwords, private keys, or encrypted secrets. `.env.example` documents placeholders only.

## Consequences

- Build metadata can appear in the UI.
- Secrets scanning still runs in local hooks.
- Runtime configuration is limited to public values.

## Alternatives Considered

- Runtime config file fetched from Pages. Rejected because v1 has only two public metadata fields.
- Server-side secrets. Rejected by Mode A.
