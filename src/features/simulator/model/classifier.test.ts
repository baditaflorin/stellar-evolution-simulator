import { describe, expect, it } from "vitest";
import { classifyRemnant, estimateMainSequenceLifetimeGyr } from "./classifier";

describe("classifyRemnant", () => {
  it("classifies low and intermediate mass stars as white dwarfs", () => {
    expect(classifyRemnant(0.4)).toBe("White dwarf");
    expect(classifyRemnant(1)).toBe("White dwarf");
    expect(classifyRemnant(7.99)).toBe("White dwarf");
  });

  it("classifies massive stars below the black-hole threshold as neutron stars", () => {
    expect(classifyRemnant(8)).toBe("Neutron star");
    expect(classifyRemnant(19.99)).toBe("Neutron star");
  });

  it("classifies very massive stars as black holes", () => {
    expect(classifyRemnant(20)).toBe("Black hole");
    expect(classifyRemnant(60)).toBe("Black hole");
  });
});

describe("estimateMainSequenceLifetimeGyr", () => {
  it("returns roughly ten billion years for a solar-mass star", () => {
    expect(estimateMainSequenceLifetimeGyr(1)).toBeCloseTo(10);
  });

  it("compresses massive-star lifetimes", () => {
    expect(estimateMainSequenceLifetimeGyr(20)).toBeLessThan(0.01);
  });
});
