const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return INR_FORMATTER.format(Math.round(amount));
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

export function parseCurrencyInput(value: string): number | null {
  const cleaned = value.replace(/[₹,\s]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}
