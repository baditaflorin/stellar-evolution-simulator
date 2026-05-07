import { useEffect, useMemo, useRef, useState } from "react";
import { phaseTone } from "../model/classifier";
import type { SimulationResult, TrackPoint } from "../model/schema";

export type ChartView = "hr" | "radius" | "luminosity" | "temperature";

type StellarChartProps = {
  result: SimulationResult | null;
  view: ChartView;
};

export function StellarChart({ result, view }: StellarChartProps) {
  const plotRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("Waiting for simulation");

  const plotSpec = useMemo(() => {
    if (!result) {
      return null;
    }

    return buildPlotSpec(result.track, view);
  }, [result, view]);

  useEffect(() => {
    const element = plotRef.current;
    if (!element || !plotSpec) {
      return;
    }

    let isDisposed = false;

    const render = async () => {
      setStatus("Loading Plotly");
      const module = await import("plotly.js-dist-min");
      const Plotly = module.default;

      if (isDisposed) {
        return;
      }

      setStatus("Rendering chart");
      await Plotly.newPlot(element, plotSpec.data, plotSpec.layout, {
        displayModeBar: false,
        responsive: true,
      });
      setStatus("Chart ready");
    };

    render().catch(() => setStatus("Chart failed to render"));

    return () => {
      isDisposed = true;
      import("plotly.js-dist-min")
        .then((module) => module.default.purge(element))
        .catch(() => undefined);
    };
  }, [plotSpec]);

  return (
    <div className="relative min-h-[430px] bg-[#090a0c]">
      {!result ? (
        <div className="grid min-h-[430px] place-items-center px-6 text-center text-sm text-white/58">
          Run a simulation to render the stellar track.
        </div>
      ) : null}
      <div ref={plotRef} className="min-h-[430px] w-full" data-testid="stellar-chart" />
      <span className="sr-only" data-testid="chart-status">
        {status}
      </span>
    </div>
  );
}

function buildPlotSpec(track: TrackPoint[], view: ChartView) {
  if (view === "hr") {
    return {
      data: [
        {
          x: track.map((point) => point.effectiveTemperatureK),
          y: track.map((point) => point.luminositySolar),
          mode: "lines+markers",
          type: "scatter",
          marker: {
            color: track.map((point) => phaseTone(point.phase)),
            size: 5,
          },
          line: {
            color: "#6ee7f9",
            width: 2,
          },
          text: track.map((point) => point.phase),
          hovertemplate:
            "Temp %{x:.0f} K<br>Lum %{y:.2e} Lsun<br>%{text}<extra></extra>",
        },
      ],
      layout: baseLayout({
        title: "Hertzsprung-Russell track",
        xTitle: "Effective temperature (K)",
        yTitle: "Luminosity (Lsun)",
        xType: "log",
        yType: "log",
        reverseX: true,
      }),
    };
  }

  const series = {
    radius: {
      y: track.map((point) => point.radiusSolar),
      color: "#f97363",
      title: "Radius over lifetime",
      yTitle: "Radius (Rsun)",
    },
    luminosity: {
      y: track.map((point) => point.luminositySolar),
      color: "#ffd166",
      title: "Luminosity over lifetime",
      yTitle: "Luminosity (Lsun)",
    },
    temperature: {
      y: track.map((point) => point.effectiveTemperatureK),
      color: "#6ee7f9",
      title: "Surface temperature over lifetime",
      yTitle: "Effective temperature (K)",
    },
  }[view];

  return {
    data: [
      {
        x: track.map((point) => point.ageGyr),
        y: series.y,
        mode: "lines",
        type: "scatter",
        line: {
          color: series.color,
          width: 3,
        },
        text: track.map((point) => point.phase),
        hovertemplate: "Age %{x:.3f} Gyr<br>Value %{y:.2e}<br>%{text}<extra></extra>",
      },
    ],
    layout: baseLayout({
      title: series.title,
      xTitle: "Age (Gyr)",
      yTitle: series.yTitle,
      xType: "linear",
      yType: "log",
      reverseX: false,
    }),
  };
}

function baseLayout({
  title,
  xTitle,
  yTitle,
  xType,
  yType,
  reverseX,
}: {
  title: string;
  xTitle: string;
  yTitle: string;
  xType: "linear" | "log";
  yType: "linear" | "log";
  reverseX: boolean;
}) {
  return {
    title: {
      text: title,
      font: { color: "#f6f7f9", size: 16 },
    },
    paper_bgcolor: "#090a0c",
    plot_bgcolor: "#090a0c",
    margin: { t: 54, r: 24, b: 62, l: 76 },
    font: {
      color: "#d7dde7",
      family:
        "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    },
    xaxis: {
      title: xTitle,
      type: xType,
      autorange: reverseX ? "reversed" : true,
      gridcolor: "#202830",
      zerolinecolor: "#303840",
    },
    yaxis: {
      title: yTitle,
      type: yType,
      gridcolor: "#202830",
      zerolinecolor: "#303840",
    },
  };
}
