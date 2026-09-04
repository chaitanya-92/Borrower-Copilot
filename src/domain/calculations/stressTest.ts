import type { EmploymentType } from "@/types/assessment";
import { calculateEmi } from "./emi";
import { computeLoanCapacity } from "./loanCapacity";
import { STRESS_INCOME_DROP_PERCENT, STRESS_RATE_RISE_POINTS } from "@/config/constants";

export interface StressTestInput {
  employmentType: EmploymentType;
  netMonthlyIncome: number;
  existingMonthlyEmis: number;
  requestedAmount: number;
  annualRatePercent: number;
  tenureMonths: number;
}

export interface StressTestResult {
  incomeDropDeltaEmi: number;
  rateRiseDeltaEmi: number;
  incomeDropSafeEmiCeiling: number;
  rateRiseEmi: number;
}

export function runStressTest(input: StressTestInput): StressTestResult {
  const baseEmi = calculateEmi(
    input.requestedAmount,
    input.annualRatePercent,
    input.tenureMonths
  );

  const reducedIncome = input.netMonthlyIncome * (1 - STRESS_INCOME_DROP_PERCENT / 100);
  const incomeDropCapacity = computeLoanCapacity({
    employmentType: input.employmentType,
    netMonthlyIncome: reducedIncome,
    existingMonthlyEmis: input.existingMonthlyEmis,
    annualRatePercent: input.annualRatePercent,
    tenureMonths: input.tenureMonths,
  });

  const incomeDropSafeEmiCeiling = incomeDropCapacity.safeMaxEmi;
  const incomeDropDeltaEmi = Math.round(baseEmi - incomeDropSafeEmiCeiling);

  const raisedRate = input.annualRatePercent + STRESS_RATE_RISE_POINTS;
  const rateRiseEmi = calculateEmi(
    input.requestedAmount,
    raisedRate,
    input.tenureMonths
  );
  const rateRiseDeltaEmi = Math.round(rateRiseEmi - baseEmi);

  return {
    incomeDropDeltaEmi,
    rateRiseDeltaEmi,
    incomeDropSafeEmiCeiling,
    rateRiseEmi: Math.round(rateRiseEmi),
  };
}
