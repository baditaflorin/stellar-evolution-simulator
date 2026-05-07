import { useEffect, useMemo, useRef, useState } from "react";
import { phaseTone } from "../model/classifier";
import { formatAgeGyr, formatScalar } from "../model/format";
import type { SimulationResult, TrackPoint } from "../model/schema";

type StarLifeCanvasProps = {
  massSolar: number;
  result: SimulationResult | null;
  isPlaying: boolean;
  playbackKey: number;
};

type VisualPoint = Pick<
  TrackPoint,
  "ageGyr" | "phase" | "radiusSolar" | "luminositySolar" | "effectiveTemperatureK"
>;

export function StarLifeCanvas({
  massSolar,
  result,
  isPlaying,
  playbackKey,
}: StarLifeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePoint, setActivePoint] = useState<VisualPoint>(() =>
    fallbackPoint(massSolar),
  );

  const track = useMemo(() => {
    return result?.track ?? [fallbackPoint(massSolar)];
  }, [massSolar, result]);

  useEffect(() => {
    let frame = 0;
    let start = 0;
    let frozenProgress = 0;
    const durationMs = 11_000;

    const tick = (now: number) => {
      if (!start) {
        start = now;
      }

      if (isPlaying) {
        frozenProgress = Math.min((now - start) / durationMs, 1);
      } else {
        start = now - frozenProgress * durationMs;
      }

      const index = Math.min(
        track.length - 1,
        Math.floor(frozenProgress * (track.length - 1)),
      );
      setActivePoint(track[index]);

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, playbackKey, track]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      drawStar(canvas, activePoint, ratio);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [activePoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    drawStar(canvas, activePoint, window.devicePixelRatio || 1);
  }, [activePoint]);

  return (
    <div className="relative min-h-[360px] overflow-hidden bg-[#090a0c]">
      <canvas ref={canvasRef} className="h-[360px] w-full" data-testid="star-canvas" />
      <div className="absolute bottom-0 left-0 right-0 grid gap-3 border-t border-line bg-coal/88 p-4 backdrop-blur sm:grid-cols-4">
        <Readout label="Age" value={formatAgeGyr(activePoint.ageGyr)} />
        <Readout label="Phase" value={activePoint.phase} />
        <Readout label="Radius" value={formatScalar(activePoint.radiusSolar, "Rsun")} />
        <Readout
          label="Luminosity"
          value={formatScalar(activePoint.luminositySolar, "Lsun")}
        />
      </div>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="block text-xs uppercase text-white/45">{label}</span>
      <span className="block truncate text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function fallbackPoint(massSolar: number): VisualPoint {
  const luminosity = Math.max(0.0006, massSolar ** 3.5);
  const radius = Math.max(0.12, massSolar ** 0.8);
  return {
    ageGyr: 0,
    phase: "Main sequence",
    radiusSolar: radius,
    luminositySolar: luminosity,
    effectiveTemperatureK: 5772 * (luminosity / (radius * radius)) ** 0.25,
  };
}

function drawStar(canvas: HTMLCanvasElement, point: VisualPoint, ratio: number) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const width = canvas.width;
  const height = canvas.height;
  const cssWidth = width / ratio;
  const cssHeight = height / ratio;

  context.save();
  context.scale(ratio, ratio);
  context.clearRect(0, 0, cssWidth, cssHeight);

  const background = context.createLinearGradient(0, 0, cssWidth, cssHeight);
  background.addColorStop(0, "#090a0c");
  background.addColorStop(0.55, "#111013");
  background.addColorStop(1, "#0a0f12");
  context.fillStyle = background;
  context.fillRect(0, 0, cssWidth, cssHeight);

  drawStarField(context, cssWidth, cssHeight);

  const centerX = cssWidth * 0.5;
  const centerY = cssHeight * 0.43;
  const radius = Math.min(
    cssWidth * 0.34,
    18 + Math.log10(point.radiusSolar + 1.2) * 95,
  );
  const color = temperatureToColor(point.effectiveTemperatureK);
  const haloColor = phaseTone(point.phase);

  const halo = context.createRadialGradient(
    centerX,
    centerY,
    radius * 0.1,
    centerX,
    centerY,
    radius * 2.2,
  );
  halo.addColorStop(0, withAlpha(color, 0.95));
  halo.addColorStop(0.34, withAlpha(haloColor, 0.34));
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = halo;
  context.beginPath();
  context.arc(centerX, centerY, radius * 2.2, 0, Math.PI * 2);
  context.fill();

  const body = context.createRadialGradient(
    centerX - radius * 0.22,
    centerY - radius * 0.22,
    radius * 0.08,
    centerX,
    centerY,
    radius,
  );
  body.addColorStop(0, "#ffffff");
  body.addColorStop(0.2, color);
  body.addColorStop(1, withAlpha(haloColor, 0.95));
  context.fillStyle = body;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = withAlpha(haloColor, 0.62);
  context.lineWidth = 1.5;
  context.beginPath();
  context.ellipse(
    centerX,
    centerY,
    radius * 1.55,
    radius * 0.48,
    -0.34,
    0,
    Math.PI * 2,
  );
  context.stroke();
  context.restore();
}

function drawStarField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  for (let index = 0; index < 90; index += 1) {
    const x = ((index * 71) % 997) / 997;
    const y = ((index * 131) % 787) / 787;
    const opacity = 0.18 + (((index * 37) % 100) / 100) * 0.48;
    context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    context.fillRect(x * width, y * height, 1.1, 1.1);
  }
}

function temperatureToColor(kelvin: number) {
  if (kelvin > 22000) {
    return "#bcd7ff";
  }
  if (kelvin > 11000) {
    return "#d7e7ff";
  }
  if (kelvin > 7500) {
    return "#f8fbff";
  }
  if (kelvin > 5400) {
    return "#fff4c2";
  }
  if (kelvin > 3800) {
    return "#ffc27a";
  }
  return "#f97363";
}

function withAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
