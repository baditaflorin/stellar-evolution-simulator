import { useMutation } from "@tanstack/react-query";
import {
  Activity,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ThermometerSun,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useStoredNumber, useStoredString } from "../../shared/storage/localStorage";
import {
  classifyRemnant,
  estimateMainSequenceLifetimeGyr,
  remnantDescription,
} from "./model/classifier";
import { formatAgeGyr, formatMass, formatScalar } from "./model/format";
import { massInputSchema, type SimulationResult } from "./model/schema";
import { simulateStellarEvolution } from "./model/pyodideBridge";
import { StarLifeCanvas } from "./components/StarLifeCanvas";
import { StellarChart, type ChartView } from "./components/StellarChart";

const presets = [
  { label: "Red dwarf", mass: 0.4 },
  { label: "Sun-like", mass: 1 },
  { label: "Blue giant", mass: 12 },
  { label: "Black hole path", mass: 28 },
] as const;

const metricIcons = {
  lifetime: Activity,
  radius: Gauge,
  luminosity: Sparkles,
  temperature: ThermometerSun,
} as const;

export function SimulatorPage() {
  const [mass, setMass] = useStoredNumber("stellar.massSolar", 1);
  const [chartView, setChartView] = useStoredString<ChartView>(
    "stellar.chartView",
    "hr",
  );
  const [status, setStatus] = useState("Ready");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackKey, setPlaybackKey] = useState(0);

  const inputState = useMemo(
    () => massInputSchema.safeParse({ massSolar: mass }),
    [mass],
  );
  const predictedRemnant = classifyRemnant(Number.isFinite(mass) ? mass : 1);
  const mainSequenceLifetime = estimateMainSequenceLifetimeGyr(
    Number.isFinite(mass) ? Math.max(mass, 0.1) : 1,
  );

  const simulation = useMutation({
    mutationFn: () => simulateStellarEvolution({ massSolar: mass }, setStatus),
    onSuccess: (nextResult) => {
      setResult(nextResult);
      setIsPlaying(true);
      setPlaybackKey((value) => value + 1);
    },
    onError: (error) => {
      setStatus(error instanceof Error ? error.message : "Simulation failed");
    },
  });

  const runSimulation = () => {
    if (inputState.success) {
      simulation.mutate();
    }
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[390px_minmax(0,1fr)]">
      <section className="instrument-panel p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-cyan">Stellar mass</p>
            <h1 className="mt-1 text-2xl font-semibold">
              {formatMass(Number.isFinite(mass) ? mass : 0)}
            </h1>
          </div>
          <span
            className="rounded-md border border-line bg-ink px-2 py-1 text-xs text-white/70"
            data-testid="predicted-remnant"
          >
            {predictedRemnant}
          </span>
        </div>

        <label className="mt-6 block text-sm font-medium" htmlFor="mass">
          Solar masses
        </label>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_92px] gap-3">
          <input
            id="mass"
            aria-label="Stellar mass in solar masses"
            className="accent-cyan"
            min="0.1"
            max="80"
            step="0.1"
            type="range"
            value={Number.isFinite(mass) ? mass : 1}
            onChange={(event) => setMass(Number(event.target.value))}
          />
          <input
            className="h-11 rounded-md border border-line bg-ink px-3 text-right text-sm text-white outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            min="0.1"
            max="80"
            step="0.1"
            type="number"
            value={Number.isFinite(mass) ? mass : ""}
            onChange={(event) => setMass(Number(event.target.value))}
          />
        </div>
        {!inputState.success ? (
          <p className="mt-2 text-sm text-ember">
            Enter a mass from 0.1 to 80 solar masses.
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2" aria-label="Mass presets">
          {presets.map((preset) => (
            <button
              className="h-10 rounded-md border border-line bg-ink px-3 text-sm text-white/82 transition hover:border-cyan/70 hover:text-cyan focus:outline-none focus:ring-2 focus:ring-cyan"
              key={preset.label}
              type="button"
              onClick={() => setMass(preset.mass)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-corona px-4 text-sm font-semibold text-coal transition hover:bg-plasma focus:outline-none focus:ring-2 focus:ring-corona disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={!inputState.success || simulation.isPending}
          onClick={runSimulation}
        >
          <Play size={18} aria-hidden="true" />
          {simulation.isPending ? "Running" : "Run simulation"}
        </button>

        <div
          className="mt-4 rounded-md border border-line bg-ink px-3 py-2 text-sm text-white/70"
          data-testid="simulation-status"
        >
          {status}
        </div>

        <div className="mt-5 grid gap-3">
          <Metric
            icon={metricIcons.lifetime}
            label="Main sequence estimate"
            value={formatAgeGyr(mainSequenceLifetime)}
          />
          {result ? (
            <>
              <Metric
                icon={metricIcons.radius}
                label="Peak radius"
                value={formatScalar(result.summary.peakRadiusSolar, "Rsun")}
              />
              <Metric
                icon={metricIcons.luminosity}
                label="Peak luminosity"
                value={formatScalar(result.summary.peakLuminositySolar, "Lsun")}
              />
              <Metric
                icon={metricIcons.temperature}
                label="Final surface"
                value={formatScalar(result.summary.finalSurfaceTemperatureK, "K")}
              />
            </>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6">
        <div className="instrument-panel overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-plasma">Lifecycle</p>
              <h2 className="mt-1 text-xl font-semibold">
                {result
                  ? `${result.summary.remnant} after ${formatAgeGyr(
                      result.summary.lifetimeGyr,
                    )}`
                  : `${predictedRemnant} track preview`}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-white/62">
                {result
                  ? remnantDescription(result.summary.remnant)
                  : remnantDescription(predictedRemnant)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="icon-button"
                type="button"
                aria-label={isPlaying ? "Pause lifecycle" : "Play lifecycle"}
                title={isPlaying ? "Pause lifecycle" : "Play lifecycle"}
                onClick={() => setIsPlaying((value) => !value)}
              >
                {isPlaying ? (
                  <Pause size={18} aria-hidden="true" />
                ) : (
                  <Play size={18} aria-hidden="true" />
                )}
              </button>
              <button
                className="icon-button"
                type="button"
                aria-label="Replay lifecycle"
                title="Replay lifecycle"
                onClick={() => {
                  setIsPlaying(true);
                  setPlaybackKey((value) => value + 1);
                }}
              >
                <RotateCcw size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <StarLifeCanvas
            massSolar={Number.isFinite(mass) ? mass : 1}
            playbackKey={playbackKey}
            result={result}
            isPlaying={isPlaying}
          />
        </div>

        <div className="instrument-panel overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-line p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-cyan">Track data</p>
              <h2 className="mt-1 text-xl font-semibold">
                Hertzsprung-Russell and time-series plots
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex" role="tablist">
              {(
                [
                  ["hr", "HR"],
                  ["radius", "Radius"],
                  ["luminosity", "Luminosity"],
                  ["temperature", "Temperature"],
                ] as const
              ).map(([value, label]) => (
                <button
                  aria-selected={chartView === value}
                  className="h-10 rounded-md border border-line bg-ink px-3 text-sm font-medium text-white/76 transition hover:border-cyan/70 hover:text-cyan focus:outline-none focus:ring-2 focus:ring-cyan aria-selected:border-cyan aria-selected:text-cyan"
                  key={value}
                  role="tab"
                  type="button"
                  onClick={() => setChartView(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <StellarChart result={result} view={chartView} />
        </div>
      </section>
    </main>
  );
}

type MetricProps = {
  icon: typeof Activity;
  label: string;
  value: string;
};

function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3 rounded-md border border-line bg-coal/70 p-3">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-panel text-cyan">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-white/50">{label}</span>
        <span className="block truncate text-sm font-semibold text-white">{value}</span>
      </span>
    </div>
  );
}
