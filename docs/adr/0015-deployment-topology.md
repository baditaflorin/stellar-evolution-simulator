# 0015 - Deployment Topology

## Status

Accepted

## Context

ADR 0001 selects Pure GitHub Pages.

## Decision

Use GitHub Pages only:

- Source repository: https://github.com/baditaflorin/stellar-evolution-simulator
- Published site: https://baditaflorin.github.io/stellar-evolution-simulator/
- Pages source: `main` branch `/docs`

No Docker, nginx, server, runtime database, or background worker service is deployed.

## Consequences

- Deployment is a git push containing updated `docs/`.
- Rollback is a git revert.
- Runtime server hardening requirements do not apply in v1.

## Alternatives Considered

- Docker backend behind nginx. Rejected because no runtime backend exists.
