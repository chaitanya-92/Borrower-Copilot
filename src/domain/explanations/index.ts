import type {
  AssessmentAnswers,
  EmploymentType,
  VerdictResult,
} from "@/types/assessment";
import type { LoanCapacityResult } from "@/domain/calculations/loanCapacity";
import type { RateBandResult } from "@/domain/rules/rate.rules";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatRateBand } from "@/lib/formatters/percentage";
import { getProductLabel } from "@/features/lending/catalog";
import { BORROWER_SAFETY_BUFFER_PERCENT } from "@/config/constants";

export function buildSafeEmiExplanation(input: {
  capacity: LoanCapacityResult;
  existingEmis: number;
  householdExpenses: number;
  netMonthlyIncome: number;
  employmentType: EmploymentType;
}): { label: string; value: string; summary: string } {
  const { capacity, existingEmis, householdExpenses, netMonthlyIncome, employmentType } = input;

  let summary: string;
  if (capacity.limitingFactor === "cash-flow") {
    summary = `After household expenses (₹${householdExpenses.toLocaleString("en-IN")}), existing EMIs (₹${existingEmis.toLocaleString("en-IN")}), and a ${BORROWER_SAFETY_BUFFER_PERCENT}% safety buffer, your cash flow supports up to ₹${capacity.safeMaxEmi.toLocaleString("en-IN")}/month — lower than the FOIR-based ceiling.`;
  } else if (capacity.limitingFactor === "foir") {
    summary = `Your ${employmentType} safe FOIR cap (${capacity.safeMaxFoirPercent}%) minus existing EMIs (₹${existingEmis.toLocaleString("en-IN")}) limits new EMI to ₹${capacity.safeMaxEmi.toLocaleString("en-IN")}/month.`;
  } else {
    summary = `Both FOIR (${capacity.safeMaxFoirPercent}%) and cash-flow checks converge at ₹${capacity.safeMaxEmi.toLocaleString("en-IN")}/month after expenses and existing EMIs.`;
  }

  return {
    label: "Safe EMI",
    value: formatCurrency(capacity.safeMaxEmi),
    summary,
  };
}

export function buildSafeAmountExplanation(input: {
  capacity: LoanCapacityResult;
  annualRatePercent: number;
  tenureMonths: number;
}): { label: string; value: string; summary: string } {
  const midRate = input.annualRatePercent;
  return {
    label: "Safe amount",
    value: formatCurrency(input.capacity.safeMaxAmount),
    summary: `Maximum principal at ₹${input.capacity.safeMaxEmi.toLocaleString("en-IN")}/month EMI, ${midRate.toFixed(1)}% p.a., ${input.tenureMonths}-month tenure.`,
  };
}

export function buildFairRateExplanation(rateBand: RateBandResult): {
  label: string;
  value: string;
  summary: string;
} {
  return {
    label: "Fair rate",
    value: formatRateBand(rateBand.minPercent, rateBand.maxPercent),
    summary: rateBand.reason,
  };
}

export function buildAllInCostExplanation(aprMin: number, aprMax: number): {
  label: string;
  value: string;
  summary: string;
} {
  return {
    label: "Estimated all-in annualised cost",
    value: formatRateBand(aprMin, aprMax),
    summary:
      "Includes nominal interest plus indicative processing fees — not an official lender/RBI disclosure.",
  };
}

export function buildVerdictExplanation(verdict: VerdictResult, requestedEmi: number, safeMaxEmi: number): string {
  if (verdict.verdict === "borrow") {
    return `Your requested EMI (₹${requestedEmi.toLocaleString("en-IN")}) is within the borrower-safe ceiling (₹${safeMaxEmi.toLocaleString("en-IN")}).`;
  }
  if (verdict.verdict === "borrow-less") {
    return `Your requested EMI is above the borrower-safe ceiling because existing monthly obligations already consume part of your safe FOIR and cash-flow room.`;
  }
  return verdict.reason;
}

export function buildNegotiationScript(input: {
  rateBand: RateBandResult;
  safeEmi: number;
  safeAmount: number;
  employmentType: EmploymentType;
}): string {
  return `Based on my ${input.employmentType} profile, I'm looking for a rate around ${formatRateBand(input.rateBand.minPercent, input.rateBand.maxPercent)} and an EMI below ${formatCurrency(input.safeEmi)} on a loan around ${formatCurrency(input.safeAmount)}.`;
}

export function buildProductRoutingDetail(input: {
  originalProduct: AssessmentAnswers["loanProductType"];
  routedProduct: AssessmentAnswers["loanProductType"];
  amountWanted: number;
  collateralValue: number;
  unsecuredBand: RateBandResult;
  securedBand: RateBandResult;
}): {
  originalProduct: NonNullable<AssessmentAnswers["loanProductType"]>;
  routedProduct: NonNullable<AssessmentAnswers["loanProductType"]>;
  wasRouted: boolean;
  reason: string;
  unsecuredRateBand: { minPercent: number; maxPercent: number; reason: string };
  securedRateBand: { minPercent: number; maxPercent: number; reason: string };
} {
  const wasRouted = input.originalProduct !== input.routedProduct;
  const reason = wasRouted
    ? `You indicated sufficient unencumbered collateral (₹${input.collateralValue.toLocaleString("en-IN")}) for a secured loan route on a ₹${input.amountWanted.toLocaleString("en-IN")} request.`
    : "Your profile stays on the selected product — collateral routing did not apply.";

  return {
    originalProduct: input.originalProduct ?? "unsecured-pl",
    routedProduct: input.routedProduct ?? "unsecured-pl",
    wasRouted,
    reason,
    unsecuredRateBand: input.unsecuredBand,
    securedRateBand: input.securedBand,
  };
}

export function buildStressTestDetail(input: {
  netMonthlyIncome: number;
  stressTestedIncome: number;
  currentSafeEmi: number;
  requestedEmi: number;
}): {
  currentIncome: number;
  stressTestedIncome: number;
  currentSafeEmi: number;
  requestedEmi: number;
  stillManageable: boolean;
  summary: string;
} {
  const stillManageable = input.requestedEmi <= input.currentSafeEmi;
  const summary = stillManageable
    ? `At ${Math.round((1 - input.stressTestedIncome / input.netMonthlyIncome) * 100)}% lower income, your safe EMI ceiling drops to ₹${input.currentSafeEmi.toLocaleString("en-IN")} — your requested EMI still fits.`
    : `At stressed income (₹${input.stressTestedIncome.toLocaleString("en-IN")}/month), your safe EMI ceiling drops to ₹${input.currentSafeEmi.toLocaleString("en-IN")} — your requested EMI would be a stretch.`;

  return {
    currentIncome: input.netMonthlyIncome,
    stressTestedIncome: input.stressTestedIncome,
    currentSafeEmi: input.currentSafeEmi,
    requestedEmi: input.requestedEmi,
    stillManageable,
    summary,
  };
}

export function getLoanTypeLabel(product: AssessmentAnswers["loanProductType"]): string {
  if (!product) return "Personal Loan";
  return getProductLabel(product);
}
