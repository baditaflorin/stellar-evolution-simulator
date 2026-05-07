import type { EvolutionPhase, RemnantType } from "./schema";

export function classifyRemnant(massSolar: number): RemnantType {
  if (massSolar >= 20) {
    return "Black hole";
  }

  if (massSolar >= 8) {
    return "Neutron star";
  }

  return "White dwarf";
}

export function estimateMainSequenceLifetimeGyr(massSolar: number) {
  return 10 * Math.pow(massSolar, -2.5);
}

export function phaseTone(phase: EvolutionPhase) {
  switch (phase) {
    case "Protostar":
      return "#f7b267";
    case "Main sequence":
      return "#6ee7f9";
    case "Subgiant":
      return "#b9a7ff";
    case "Red giant":
    case "Red supergiant":
      return "#f97363";
    case "Planetary nebula":
      return "#7dd3a8";
    case "Core collapse":
      return "#ffd166";
    case "White dwarf":
      return "#d8f3ff";
    case "Neutron star":
      return "#a7c7ff";
    case "Black hole":
      return "#8f8a99";
  }
}

export function remnantDescription(remnant: RemnantType) {
  switch (remnant) {
    case "White dwarf":
      return "A dense carbon-oxygen core remains after the outer layers drift away.";
    case "Neutron star":
      return "Core collapse leaves an ultra-dense neutron remnant.";
    case "Black hole":
      return "The remnant mass crosses the simplified collapse threshold.";
  }
}
