import type { EmploymentType } from "@/types/assessment";
import { BORROWER_SAFETY_BUFFER_PERCENT } from "@/config/constants";
import { maxPrincipalForEmi } from "./emi";
import { getEffectiveFoirCaps } from "../rules/affordability.rules";

export interface LoanCapacityInput {
  employmentType: EmploymentType;
  netMonthlyIncome: number;
  existingMonthlyEmis: number;
  monthlyHouseholdExpenses?: number | null;
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
  foirBasedSafeEmi: number;
  cashFlowBasedSafeEmi: number;
  limitingFactor: "foir" | "cash-flow" | "both";
}

export function computeCashFlowSafeEmi(
  netMonthlyIncome: number,
  existingMonthlyEmis: number,
  monthlyHouseholdExpenses: number
): number {
  const safetyBuffer = (netMonthlyIncome * BORROWER_SAFETY_BUFFER_PERCENT) / 100;
  return Math.max(
    0,
    netMonthlyIncome - monthlyHouseholdExpenses - existingMonthlyEmis - safetyBuffer
  );
}

export function computeLoanCapacity(input: LoanCapacityInput): LoanCapacityResult {
  const caps = getEffectiveFoirCaps({
    employmentType: input.employmentType,
    emergencySavingsMonths: input.emergencySavingsMonths,
    upcomingLargeExpenses: input.upcomingLargeExpenses,
    loanProductivityReturn: input.loanProductivityReturn,
  });

  const householdExpenses = input.monthlyHouseholdExpenses ?? 0;

  const lenderMaxEmi = Math.max(
    0,
    (input.netMonthlyIncome * caps.lenderMaxFoirPercent) / 100 - input.existingMonthlyEmis
  );

  let foirBasedSafeEmi = Math.max(
    0,
    (input.netMonthlyIncome * caps.safeMaxFoirPercent) / 100 - input.existingMonthlyEmis
  );

  if (input.upcomingLargeExpenses && input.upcomingLargeExpenses > 0) {
    const monthlyExpenseBuffer = input.upcomingLargeExpenses / 12;
    foirBasedSafeEmi = Math.max(0, foirBasedSafeEmi - monthlyExpenseBuffer);
  }

  const cashFlowBasedSafeEmi = computeCashFlowSafeEmi(
    input.netMonthlyIncome,
    input.existingMonthlyEmis,
    householdExpenses
  );

  let safeMaxEmi = Math.min(foirBasedSafeEmi, cashFlowBasedSafeEmi);
  let limitingFactor: LoanCapacityResult["limitingFactor"] = "both";
  if (safeMaxEmi === foirBasedSafeEmi && safeMaxEmi < cashFlowBasedSafeEmi) {
    limitingFactor = "foir";
  } else if (safeMaxEmi === cashFlowBasedSafeEmi && safeMaxEmi < foirBasedSafeEmi) {
    limitingFactor = "cash-flow";
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
    foirBasedSafeEmi: Math.round(foirBasedSafeEmi),
    cashFlowBasedSafeEmi: Math.round(cashFlowBasedSafeEmi),
    limitingFactor,
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
