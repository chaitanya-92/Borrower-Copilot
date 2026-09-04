export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatRateBand(min: number, max: number): string {
  return `${min.toFixed(1)}% – ${max.toFixed(1)}%`;
}
