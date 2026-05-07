import { z } from "zod";

export const massInputSchema = z.object({
  massSolar: z.number().min(0.1).max(80),
});

export const phaseSchema = z.enum([
  "Protostar",
  "Main sequence",
  "Subgiant",
  "Red giant",
  "Red supergiant",
  "Planetary nebula",
  "Core collapse",
  "White dwarf",
  "Neutron star",
  "Black hole",
]);

export const remnantSchema = z.enum(["White dwarf", "Neutron star", "Black hole"]);

export const trackPointSchema = z.object({
  ageGyr: z.number().nonnegative(),
  phase: phaseSchema,
  radiusSolar: z.number().positive(),
  luminositySolar: z.number().positive(),
  effectiveTemperatureK: z.number().positive(),
  coreMassSolar: z.number().nonnegative(),
  massRemainingSolar: z.number().positive(),
});

export const simulationSummarySchema = z.object({
  remnant: remnantSchema,
  lifetimeGyr: z.number().positive(),
  peakRadiusSolar: z.number().positive(),
  peakLuminositySolar: z.number().positive(),
  finalCoreMassSolar: z.number().positive(),
  finalSurfaceTemperatureK: z.number().positive(),
  caveat: z.string().min(1),
});

export const simulationResultSchema = z.object({
  schemaVersion: z.literal("stellar-track/v1"),
  inputMassSolar: z.number().positive(),
  summary: simulationSummarySchema,
  track: z.array(trackPointSchema).min(50),
});

export type MassInput = z.infer<typeof massInputSchema>;
export type EvolutionPhase = z.infer<typeof phaseSchema>;
export type RemnantType = z.infer<typeof remnantSchema>;
export type TrackPoint = z.infer<typeof trackPointSchema>;
export type SimulationResult = z.infer<typeof simulationResultSchema>;
