# 0006 - WASM Modules

## Status

Accepted

## Context

The project intent calls for a MESA-inspired computation path and Pyodide so scientific Python can run in-browser. GitHub Pages cannot set custom COOP/COEP headers, so the app must avoid a hard dependency on shared-array-buffer-only behavior.

## Decision

Use Pyodide from the official CDN as the v1 WASM runtime, lazy-loaded only after the user starts a simulation. The model is a compact Python module embedded in the app and executed through Pyodide.

Plotly is also lazy-loaded, but it is not a WASM module.

## Consequences

- First load remains focused on the UI shell.
- Simulation startup includes a one-time Pyodide download.
- The simulator works on GitHub Pages without a custom server.
- The model is educational and MESA-inspired, not a full MESA port.

## Alternatives Considered

- Porting real MESA Fortran to WASM. Rejected for v1 because full MESA is large and operationally complex.
- Pure TypeScript simulation only. Rejected because Pyodide is core to the requested technical direction.
