import type { EmploymentType } from "@/types/assessment";
import { maxPrincipalForEmi } from "./emi";
import { getEffectiveFoirCaps } from "../rules/affordability.rules";

export interface LoanCapacityInput {
  employmentType: EmploymentType;
  netMonthlyIncome: number;
  existingMonthlyEmis: number;
  annualRatePercent: number;
  tenureMonths: number;
  emergencySavingsMonths?: number | null;
  upcomingLargeExpenses?: number | null;
  loanProductivityReturn?: number | null;
}

export interface LoanCapacityResult {
  lenderMaxFoirPercent: number;
  safeMaxFoirPercent: number;
  lenderMaxEmi: number;
  safeMaxEmi: number;
  lenderMaxAmount: number;
  safeMaxAmount: number;
}

export function computeLoanCapacity(input: LoanCapacityInput): LoanCapacityResult {
  const caps = getEffectiveFoirCaps({
    employmentType: input.employmentType,
    emergencySavingsMonths: input.emergencySavingsMonths,
    upcomingLargeExpenses: input.upcomingLargeExpenses,
    loanProductivityReturn: input.loanProductivityReturn,
  });

  const lenderMaxEmi = Math.max(
    0,
    (input.netMonthlyIncome * caps.lenderMaxFoirPercent) / 100 - input.existingMonthlyEmis
  );

  let safeMaxEmi = Math.max(
    0,
    (input.netMonthlyIncome * caps.safeMaxFoirPercent) / 100 - input.existingMonthlyEmis
  );

  // Upcoming large expenses reduce safe EMI room
  if (input.upcomingLargeExpenses && input.upcomingLargeExpenses > 0) {
    const monthlyExpenseBuffer = input.upcomingLargeExpenses / 12;
    safeMaxEmi = Math.max(0, safeMaxEmi - monthlyExpenseBuffer);
  }

  const lenderMaxAmount = maxPrincipalForEmi(
    lenderMaxEmi,
    input.annualRatePercent,
    input.tenureMonths
  );

  const safeMaxAmount = maxPrincipalForEmi(
    safeMaxEmi,
    input.annualRatePercent,
    input.tenureMonths
  );

  return {
    lenderMaxFoirPercent: caps.lenderMaxFoirPercent,
    safeMaxFoirPercent: caps.safeMaxFoirPercent,
    lenderMaxEmi: Math.round(lenderMaxEmi),
    safeMaxEmi: Math.round(safeMaxEmi),
    lenderMaxAmount: Math.round(lenderMaxAmount),
    safeMaxAmount: Math.round(safeMaxAmount),
  };
}

export function computeFoir(
  existingEmis: number,
  newEmi: number,
  netMonthlyIncome: number
): number {
  if (netMonthlyIncome <= 0) return 100;
  return ((existingEmis + newEmi) / netMonthlyIncome) * 100;
}
