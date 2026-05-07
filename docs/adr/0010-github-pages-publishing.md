# 0010 - GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The live GitHub Pages URL is a first-class deliverable from the initial scaffold. No GitHub Actions are allowed, so the repository must commit Pages-ready output.

## Decision

Publish from `main` branch `/docs`.

Vite builds into `docs/`, `docs/.nojekyll` is committed, and `docs/404.html` mirrors `docs/index.html` for SPA fallback. The repository `.gitignore` ignores `dist/` but not `docs/`.

The app base path is `/stellar-evolution-simulator/`.

## Consequences

- `make build` must produce a valid committed `docs/` directory.
- GitHub Pages serves https://baditaflorin.github.io/stellar-evolution-simulator/.
- Rollback is a normal git revert of the publishing commit.
- Cache busting comes from Vite hashed assets.

## Alternatives Considered

- `gh-pages` branch. Rejected because committing `docs/` on `main` is simpler for local-only workflows.
- GitHub Actions Pages build. Rejected because the project explicitly avoids GitHub Actions.
