import type { AssessmentAnswers, EngineOutput } from "@/types/assessment";
import {
  calculateEmi,
  compareTenures,
  computeAprBand,
  computeLoanCapacity,
  runStressTest,
  totalInterestCost,
} from "../calculations";
import {
  computeConfidence,
  getRateBand,
  getVerdict,
  normalizeIncome,
  routeProduct,
} from "../rules";
import {
  DEFAULT_PROCESSING_FEE_PERCENT,
  DEFAULT_TENURE_MONTHS,
  TENURE_OPTIONS_MONTHS,
} from "@/config/constants";

export interface EngineInput {
  answers: AssessmentAnswers;
  tenureMonths?: number;
}

export function runEngine(input: EngineInput): EngineOutput {
  const { answers } = input;
  const tenureMonths = input.tenureMonths ?? DEFAULT_TENURE_MONTHS;

  const employmentType = answers.employmentType!;
  const amountWanted = answers.amountWanted!;
  const existingEmis = answers.existingMonthlyEmis ?? 0;

  const netMonthlyIncome = normalizeIncome({
    employmentType,
    netMonthlyIncome: answers.netMonthlyIncome,
    itrIncome: answers.itrIncome,
    cashIncomeEstimate: answers.cashIncomeEstimate,
    incomeMin: answers.incomeMin,
    incomeMax: answers.incomeMax,
    hasCoBorrower: answers.hasCoBorrower,
    coBorrowerIncome: answers.coBorrowerIncome,
  });

  const ownsCollateral = answers.ownsCollateral ?? false;
  const collateralValue = answers.collateralValue ?? 0;

  const routedProduct = routeProduct({
    amountWanted,
    ownsCollateral,
    collateralValue,
    currentProduct: answers.loanProductType ?? "unsecured-pl",
  });

  const isSecured = routedProduct === "secured-lap";
  const ltvPercent =
    isSecured && collateralValue > 0 ? (amountWanted / collateralValue) * 100 : undefined;

  const rateBand = getRateBand({
    employmentType,
    creditScore: answers.creditScore,
    isSecured,
    ltvPercent,
  });

  const midRate = (rateBand.minPercent + rateBand.maxPercent) / 2;

  const capacity = computeLoanCapacity({
    employmentType,
    netMonthlyIncome,
    existingMonthlyEmis: existingEmis,
    annualRatePercent: midRate,
    tenureMonths,
    emergencySavingsMonths: answers.emergencySavingsMonths,
    upcomingLargeExpenses: answers.upcomingLargeExpenses,
    loanProductivityReturn: answers.loanProductivityReturn,
  });

  const requestedEmi = calculateEmi(amountWanted, midRate, tenureMonths);

  const recentBounced =
    answers.pastBouncedPayments === true ||
    answers.bouncedPaymentsLast6Months === true;

  const verdictResult = getVerdict({
    requestedEmi,
    safeMaxEmi: capacity.safeMaxEmi,
    lenderMaxEmi: capacity.lenderMaxEmi,
    safeMaxAmount: capacity.safeMaxAmount,
    recentBouncedPayment: recentBounced,
    hasHighCostDebt: answers.hasHighCostDebt ?? false,
    incomeNegativeShock: answers.incomeNegativeShock ?? false,
  });

  const aprBand = computeAprBand(
    rateBand.minPercent,
    rateBand.maxPercent,
    amountWanted,
    tenureMonths,
    DEFAULT_PROCESSING_FEE_PERCENT
  );

  const stressTest = runStressTest({
    employmentType,
    netMonthlyIncome,
    existingMonthlyEmis: existingEmis,
    requestedAmount: amountWanted,
    annualRatePercent: midRate,
    tenureMonths,
  });

  const tenureComparisons = compareTenures(
    amountWanted,
    midRate,
    TENURE_OPTIONS_MONTHS,
    capacity.safeMaxEmi
  ).map((row) => ({
    tenureMonths: row.tenureMonths,
    emi: row.emi,
    totalInterest: row.totalInterest,
    maxLoanForSafeEmi: row.maxLoanForEmi,
  }));

  const confidence = computeConfidence(answers);

  const hasOffer =
    answers.lenderOfferRate != null &&
    answers.lenderOfferAmount != null &&
    answers.lenderOfferTenureMonths != null;

  let lenderOfferComparison = null;
  if (hasOffer) {
    const fairTotalInterest = totalInterestCost(
      answers.lenderOfferAmount!,
      midRate,
      answers.lenderOfferTenureMonths!
    );
    const offerTotalInterest = totalInterestCost(
      answers.lenderOfferAmount!,
      answers.lenderOfferRate!,
      answers.lenderOfferTenureMonths!
    );
    lenderOfferComparison = {
      fairTotalInterest,
      offerTotalInterest,
      savings: offerTotalInterest - fairTotalInterest,
      hasOffer: true,
    };
  }

  const useSafe =
    verdictResult.verdict === "borrow-less" || verdictResult.verdict === "dont-borrow";

  return {
    verdict: {
      verdict: verdictResult.verdict,
      reason: verdictResult.reason,
      recommendedAmount: verdictResult.recommendedAmount,
    },
    loanCapacity: {
      lenderMaxAmount: capacity.lenderMaxAmount,
      safeMaxAmount: capacity.safeMaxAmount,
      lenderMaxEmi: capacity.lenderMaxEmi,
      safeMaxEmi: capacity.safeMaxEmi,
      recommendation: useSafe
        ? "Use the safe-max amount — it leaves room for life’s surprises."
        : "Your ask fits the safe ceiling — you can proceed at this amount.",
    },
    fairRate: {
      nominalRateBand: rateBand,
      aprBand,
      routedProduct,
      whyThisBand: rateBand.reason,
    },
    emi: {
      recommendedEmiCeiling: capacity.safeMaxEmi,
      requestedEmi: Math.round(requestedEmi),
      tenureComparisons,
      stressTest,
    },
    confidence,
    negotiationCard: {
      fairRateBand: rateBand,
      safeEmiCeiling: capacity.safeMaxEmi,
      safeLoanAmount: capacity.safeMaxAmount,
      lenderOfferComparison,
    },
  };
}
