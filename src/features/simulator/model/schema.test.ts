import { describe, expect, it } from "vitest";
import { massInputSchema, simulationResultSchema } from "./schema";

describe("massInputSchema", () => {
  it("accepts v1 supported mass range", () => {
    expect(massInputSchema.safeParse({ massSolar: 0.1 }).success).toBe(true);
    expect(massInputSchema.safeParse({ massSolar: 80 }).success).toBe(true);
  });

  it("rejects unsupported mass values", () => {
    expect(massInputSchema.safeParse({ massSolar: 0.09 }).success).toBe(false);
    expect(massInputSchema.safeParse({ massSolar: 81 }).success).toBe(false);
  });
});

describe("simulationResultSchema", () => {
  it("validates the public track contract", () => {
    const point = {
      ageGyr: 0,
      phase: "Main sequence",
      radiusSolar: 1,
      luminositySolar: 1,
      effectiveTemperatureK: 5772,
      coreMassSolar: 0.1,
      massRemainingSolar: 1,
    };

    const parsed = simulationResultSchema.safeParse({
      schemaVersion: "stellar-track/v1",
      inputMassSolar: 1,
      summary: {
        remnant: "White dwarf",
        lifetimeGyr: 10,
        peakRadiusSolar: 110,
        peakLuminositySolar: 2200,
        finalCoreMassSolar: 0.56,
        finalSurfaceTemperatureK: 12000,
        caveat: "Educational model.",
      },
      track: Array.from({ length: 50 }, () => point),
    });

    expect(parsed.success).toBe(true);
  });
});
