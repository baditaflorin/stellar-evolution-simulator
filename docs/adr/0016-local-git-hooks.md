# 0016 - Local Git Hooks

## Status

Accepted

## Context

The project does not use GitHub Actions. Local hooks must enforce quality gates before commits and pushes.

## Decision

Use plain `.githooks/` wired through `git config core.hooksPath .githooks`.

Hooks:

- `pre-commit`: format/lint/typecheck checks and staged secret scan via `gitleaks` when available.
- `commit-msg`: Conventional Commits validation.
- `pre-push`: `make test`, `make build`, and `make smoke`.
- `post-merge` and `post-checkout`: run dependency-install reminders and no-op generated-code refresh.

## Consequences

- Contributors can run hooks without a third-party hook manager.
- `make install-hooks` is required after clone.
- Machines without `gitleaks` get a clear install error before committing.

## Alternatives Considered

- Lefthook. Rejected because plain hooks are enough for this small repo.
