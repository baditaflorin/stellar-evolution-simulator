const compact = new Intl.NumberFormat("en", {
  maximumFractionDigits: 2,
  notation: "compact",
});

const precise = new Intl.NumberFormat("en", {
  maximumFractionDigits: 2,
});

export function formatScalar(value: number, unit: string) {
  return `${compact.format(value)} ${unit}`;
}

export function formatMass(value: number) {
  return `${precise.format(value)} solar masses`;
}

export function formatAgeGyr(value: number) {
  if (value < 0.001) {
    return `${precise.format(value * 1_000_000)} years`;
  }

  if (value < 1) {
    return `${precise.format(value * 1_000)} Myr`;
  }

  return `${precise.format(value)} Gyr`;
}
