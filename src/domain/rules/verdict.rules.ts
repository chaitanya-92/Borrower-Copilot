import type { VerdictType } from "@/types/assessment";

export interface VerdictInput {
  requestedEmi: number;
  safeMaxEmi: number;
  lenderMaxEmi: number;
  safeMaxAmount: number;
  recentBouncedPayment: boolean;
  hasHighCostDebt: boolean;
  incomeNegativeShock: boolean;
}

export interface VerdictResult {
  verdict: VerdictType;
  reason: string;
  recommendedAmount: number | null;
}

export function getVerdict(input: VerdictInput): VerdictResult {
  // Distress override — all three must be present
  if (
    input.recentBouncedPayment &&
    input.hasHighCostDebt &&
    input.incomeNegativeShock
  ) {
    return {
      verdict: "dont-borrow",
      reason:
        "Recent bounced payment, high-cost debt (>24% APR), and income shock together indicate an active debt spiral — do not borrow now.",
      recommendedAmount: null,
    };
  }

  if (input.requestedEmi <= input.safeMaxEmi) {
    return {
      verdict: "borrow",
      reason: "Your requested EMI fits comfortably within your safe ceiling — no need to shrink the ask.",
      recommendedAmount: null,
    };
  }

  if (input.requestedEmi <= input.lenderMaxEmi) {
    return {
      verdict: "borrow-less",
      reason: "Technically approvable by a lender, but above your safe ceiling — borrow less for comfort.",
      recommendedAmount: input.safeMaxAmount,
    };
  }

  return {
    verdict: "dont-borrow",
    reason: "Requested EMI exceeds what lenders would typically approve — not realistically approvable at this amount.",
    recommendedAmount: input.safeMaxAmount,
  };
}
