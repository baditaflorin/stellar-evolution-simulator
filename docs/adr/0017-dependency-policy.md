# 0017 - Dependency Policy

## Status

Accepted

## Context

The app needs production-ready libraries without letting the initial payload grow unnecessarily.

## Decision

Use mature dependencies:

- React and Vite for UI/build.
- Tailwind CSS for styling.
- Zod for input and output validation.
- TanStack Query for async loading state and cache semantics.
- Pyodide from the official CDN for Python-in-browser execution.
- Plotly through `plotly.js-dist-min`, lazy-loaded.
- Vitest and Playwright for tests.

Avoid custom charting, custom validation frameworks, and unmaintained packages.

## Consequences

- Dependencies are recognizable and supportable.
- Heavy dependencies are lazy-loaded to protect initial page weight.
- `npm audit` is part of security verification.

## Alternatives Considered

- D3-only custom charts. Rejected because Plotly provides robust scientific plotting.
- Custom validation. Rejected because Zod is safer and faster to implement correctly.
