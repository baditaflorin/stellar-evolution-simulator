# Postmortem

## What Was Built

Stellar Evolution Simulator v0.1.0 is a pure GitHub Pages app at:

https://baditaflorin.github.io/stellar-evolution-simulator/

The app lets a user enter stellar mass, run a Pyodide-powered MESA-inspired model in the browser, watch a lifecycle animation, and inspect Plotly charts for the HR track, radius, luminosity, and temperature. The UI includes the GitHub repository link, PayPal support link, version, and release commit.

Repository:

https://github.com/baditaflorin/stellar-evolution-simulator

## Was Mode A Correct?

Yes. Mode A was the right choice for v1.

There are no secrets, writes, accounts, shared projects, server-side jobs, or authenticated APIs. The simulation model is compact enough to run in Pyodide, and the heavy dependencies can be lazy-loaded behind user action. We did not need Mode B precomputed artifacts or a Mode C Docker backend.

## What Worked

- GitHub Pages from `main` branch `/docs` worked from the first scaffold.
- Pyodide was practical for a lightweight educational model.
- Plotly gave scientific charts quickly without custom chart logic.
- The smoke test catches the important Pages base-path issue.
- Static release metadata avoided runtime API failures and production console noise.

## What Did Not Work

- A first attempt to fetch the latest commit from GitHub's public commits API returned HTTP 403 in the browser environment. That was removed to keep the page quiet and deterministic.
- Embedding `git rev-parse HEAD` directly during build would make every post-commit build dirty, so release metadata is stored in `release.json` instead.

## What Was Surprising

The local smoke test initially passed while the live test failed because `page.goto("/")` resolves to the domain root, not the GitHub Pages project path. The e2e test now uses `page.goto("./")` so it respects the configured base URL.

## Accepted Tech Debt

- The stellar model is MESA-inspired, not a real MESA port.
- Pyodide runs on the main thread in v1.
- Plotly is a large lazy-loaded chunk.
- The release commit is static metadata, not automatically self-referential to the final publishing commit.

## Next Improvements

1. Move Pyodide execution into a Web Worker so long simulations cannot block the UI.
2. Add optional Mode B precomputed benchmark tracks for validation against real stellar-evolution grids.
3. Add more educational overlays, including phase markers and uncertainty notes per mass range.

## Time Spent Vs Estimate

Initial estimate: 2 to 3 hours.

Actual implementation session: about 55 minutes for scaffold, ADRs, implementation, tests, Pages publishing, and verification.
