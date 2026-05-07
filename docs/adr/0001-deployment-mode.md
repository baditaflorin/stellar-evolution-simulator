# 0001 - Deployment Mode

## Status

Accepted

## Context

The simulator must be easy to publish, share, and run without server operations. The v1 requirements are interactive computation, visualization, local user preferences, and no shared writes, authentication, or secrets. GitHub Pages is the preferred deployment target.

## Decision

Use Mode A: Pure GitHub Pages.

The application is a static Vite site published from `main` branch `/docs`. The stellar evolution model runs in the browser through Pyodide, and charts render through lazily loaded Plotly. No runtime backend, database, or server secrets are required.

## Consequences

- The public surface is static HTML, CSS, JavaScript, and WASM-loaded browser assets.
- The app can be hosted at https://baditaflorin.github.io/stellar-evolution-simulator/.
- Runtime backend, Docker, nginx, Prometheus, and API deployment are out of scope for v1.
- Large scientific dependencies must be lazy-loaded to protect first-load performance.

## Alternatives Considered

- Mode B: GitHub Pages + pre-built data. Rejected for v1 because the parametric model is compact enough to compute client-side.
- Mode C: Pages frontend + Docker backend. Rejected because there are no runtime secrets, mutations, or shared persistence needs.
