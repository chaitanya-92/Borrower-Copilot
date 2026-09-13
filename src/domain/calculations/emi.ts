
export function calculateEmi(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePercent <= 0) return principal / tenureMonths;

  const r = annualRatePercent / 12 / 100;
  const n = tenureMonths;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}


export function maxPrincipalForEmi(
  emiCeiling: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  if (emiCeiling <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePercent <= 0) return emiCeiling * tenureMonths;

  const r = annualRatePercent / 12 / 100;
  const n = tenureMonths;
  const factor = Math.pow(1 + r, n);
  return (emiCeiling * (factor - 1)) / (r * factor);
}

export interface TenureComparison {
  tenureMonths: number;
  emi: number;
  totalInterest: number;
  maxLoanForEmi: number;
}


export function compareTenures(
  principal: number,
  annualRatePercent: number,
  tenureOptions: readonly number[],
  emiCeiling?: number
): TenureComparison[] {
  return tenureOptions.map((tenureMonths) => {
    const emi = calculateEmi(principal, annualRatePercent, tenureMonths);
    const totalPaid = emi * tenureMonths;
    const totalInterest = totalPaid - principal;
    const maxLoanForEmi = emiCeiling
      ? maxPrincipalForEmi(emiCeiling, annualRatePercent, tenureMonths)
      : 0;

    return {
      tenureMonths,
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      maxLoanForEmi: Math.round(maxLoanForEmi),
    };
  });
}

export function totalInterestCost(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  const emi = calculateEmi(principal, annualRatePercent, tenureMonths);
  return Math.round(emi * tenureMonths - principal);
}
