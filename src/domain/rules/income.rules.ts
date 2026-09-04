import type { EmploymentType } from "@/types/assessment";

export interface IncomeNormalizationInput {
  employmentType: EmploymentType;
  netMonthlyIncome: number | null;
  itrIncome: number | null;
  cashIncomeEstimate: number | null;
  incomeMin: number | null;
  incomeMax: number | null;
  hasCoBorrower: boolean | null;
  coBorrowerIncome: number | null;
}

/**
 * Self-employed: use ITR (verifiable) over cash estimate when they diverge.
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
      const itr = input.itrIncome ?? 0;
      const cash = input.cashIncomeEstimate ?? 0;
      income = itr > 0 ? itr : cash;
      if (itr > 0 && cash > itr) {
        income = itr;
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
