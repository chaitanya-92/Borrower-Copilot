import type { EmploymentType } from "@/types/assessment";

export interface IncomeNormalizationInput {
  employmentType: EmploymentType;
  netMonthlyIncome: number | null;
  itrAnnualIncome: number | null;
  cashIncomeEstimate: number | null;
  incomeMin: number | null;
  incomeMax: number | null;
  hasCoBorrower: boolean | null;
  coBorrowerIncome: number | null;
}

/**
 * Self-employed: use ITR (verifiable) over cash estimate when they diverge.
 * ITR is stored as annual income and normalized to monthly here.
 * Informal: use midpoint of income range.
 * Co-applicant income only added if explicitly committed co-borrower.
 */
export function normalizeIncome(input: IncomeNormalizationInput): number {
  let income = 0;

  switch (input.employmentType) {
    case "salaried":
      income = input.netMonthlyIncome ?? 0;
      break;
    case "self-employed": {
      const monthlyItr =
        input.itrAnnualIncome != null && input.itrAnnualIncome > 0
          ? input.itrAnnualIncome / 12
          : 0;
      const cash = input.cashIncomeEstimate ?? 0;
      income = monthlyItr > 0 ? monthlyItr : cash;
      if (monthlyItr > 0 && cash > monthlyItr) {
        income = monthlyItr;
      }
      break;
    }
    case "informal": {
      const min = input.incomeMin ?? 0;
      const max = input.incomeMax ?? min;
      income = (min + max) / 2;
      break;
    }
  }

  if (input.hasCoBorrower && input.coBorrowerIncome) {
    income += input.coBorrowerIncome;
  }

  return income;
}

export function getMonthlyItrIncome(itrAnnualIncome: number | null): number {
  if (itrAnnualIncome == null || itrAnnualIncome <= 0) return 0;
  return itrAnnualIncome / 12;
}
