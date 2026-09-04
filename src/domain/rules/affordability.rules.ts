import type { EmploymentType } from "@/types/assessment";

export const SAFE_FOIR_CAPS: Record<EmploymentType, number> = {
  salaried: 40,
  "self-employed": 35,
  informal: 30,
};

export const LENDER_FOIR_CAPS: Record<EmploymentType, number> = {
  salaried: 55,
  "self-employed": 50,
  informal: 40,
};

export interface FoirCapAdjustments {
  employmentType: EmploymentType;
  emergencySavingsMonths?: number | null;
  upcomingLargeExpenses?: number | null;
  loanProductivityReturn?: number | null;
}

export function getEffectiveFoirCaps(input: FoirCapAdjustments): {
  safeMaxFoirPercent: number;
  lenderMaxFoirPercent: number;
} {
  let safeMaxFoirPercent = SAFE_FOIR_CAPS[input.employmentType];
  const lenderMaxFoirPercent = LENDER_FOIR_CAPS[input.employmentType];

  // Emergency savings adjusts safe cap slightly
  if (input.emergencySavingsMonths != null) {
    if (input.emergencySavingsMonths >= 6) {
      safeMaxFoirPercent += 2;
    } else if (input.emergencySavingsMonths < 2) {
      safeMaxFoirPercent -= 3;
    }
  }

  // Productive business loan can justify slightly higher safe ceiling
  if (
    input.loanProductivityReturn != null &&
    input.loanProductivityReturn > 0
  ) {
    safeMaxFoirPercent += 2;
  }

  safeMaxFoirPercent = Math.min(safeMaxFoirPercent, lenderMaxFoirPercent - 5);
  safeMaxFoirPercent = Math.max(safeMaxFoirPercent, 20);

  return { safeMaxFoirPercent, lenderMaxFoirPercent };
}
