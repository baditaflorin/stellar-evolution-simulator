import { massInputSchema, simulationResultSchema, type MassInput } from "./schema";
import { PYODIDE_VERSION, STELLAR_MODEL_SOURCE } from "./pythonModel";

type StatusCallback = (status: string) => void;

let pyodidePromise: Promise<PyodideRuntime> | undefined;
let modelLoaded = false;

function loadScript(url: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${url}"]`);

    if (existing) {
      if (window.loadPyodide) {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Pyodide script failed to load.")),
          { once: true },
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Pyodide script failed to load.")),
      { once: true },
    );
    document.head.appendChild(script);
  });
}

async function getPyodide(onStatus: StatusCallback) {
  const indexURL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
  const scriptURL = `${indexURL}pyodide.js`;

  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      onStatus("Loading Pyodide runtime");
      await loadScript(scriptURL);

      if (!window.loadPyodide) {
        throw new Error("Pyodide loader is unavailable after script load.");
      }

      onStatus("Initializing Python runtime");
      return window.loadPyodide({ indexURL });
    })();
  }

  const pyodide = await pyodidePromise;

  if (!modelLoaded) {
    onStatus("Loading stellar model");
    await pyodide.runPythonAsync(STELLAR_MODEL_SOURCE);
    modelLoaded = true;
  }

  onStatus("Pyodide ready");
  return pyodide;
}

export async function simulateStellarEvolution(
  input: MassInput,
  onStatus: StatusCallback,
) {
  const parsedInput = massInputSchema.parse(input);
  const pyodide = await getPyodide(onStatus);

  onStatus("Integrating stellar track");
  pyodide.globals.set("simulation_input", JSON.stringify(parsedInput));
  const resultJson = await pyodide.runPythonAsync<string>(
    "simulate_stellar_track(simulation_input)",
  );

  onStatus("Track complete");
  return simulationResultSchema.parse(JSON.parse(resultJson));
}
