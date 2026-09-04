export function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && value > 0;
}

export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && value >= 0;
}
