import type { EmploymentType, LoanProductType, CreditScoreInput } from "@/types/assessment";
import { LARGE_LOAN_THRESHOLD } from "@/config/constants";

export const UNKNOWN_SCORE_BAND_WIDEN_POINTS = 2;

export interface RateBandRuleInput {
  employmentType: EmploymentType;
  creditScore: CreditScoreInput | null;
  isSecured: boolean;
  ltvPercent?: number;
}

export interface RateBandResult {
  minPercent: number;
  maxPercent: number;
  reason: string;
}

export function getRateBand(input: RateBandRuleInput): RateBandResult {
  if (input.isSecured && (input.ltvPercent ?? 100) <= 40) {
    return {
      minPercent: 9,
      maxPercent: 11,
      reason: "Secured LAP with LTV ≤ 40% — strong recovery cushion for lender.",
    };
  }

  if (input.employmentType === "salaried") {
    const base = { minPercent: 10.5, maxPercent: 12.5 };
    if (input.creditScore === "unknown" || input.creditScore === null) {
      return {
        minPercent: base.minPercent,
        maxPercent: base.maxPercent + UNKNOWN_SCORE_BAND_WIDEN_POINTS,
        reason: "Salaried unsecured PL — credit score unknown, band widened on top end.",
      };
    }
    if (typeof input.creditScore === "number" && input.creditScore > 750) {
      return {
        ...base,
        reason: "Prime-tier salaried borrower with strong credit score (>750).",
      };
    }
    return {
      minPercent: 12,
      maxPercent: 16,
      reason: "Salaried unsecured PL — moderate credit profile.",
    };
  }

  if (input.employmentType === "self-employed") {
    return {
      minPercent: 12,
      maxPercent: 16,
      reason: "Self-employed income — higher perceived risk than salaried segment.",
    };
  }

  return {
    minPercent: 14,
    maxPercent: 20,
    reason: "Informal/gig income — highest volatility, lenders price conservatively.",
  };
}

export interface ProductRoutingInput {
  amountWanted: number;
  ownsCollateral: boolean;
  collateralValue: number;
  currentProduct: LoanProductType;
}

export function routeProduct(input: ProductRoutingInput): LoanProductType {
  if (
    input.ownsCollateral &&
    input.collateralValue >= input.amountWanted * 2 &&
    input.amountWanted > LARGE_LOAN_THRESHOLD
  ) {
    return "secured-lap";
  }
  return input.currentProduct;
}
