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
  computeConfidenceDetail,
  getRateBand,
  getVerdict,
  normalizeIncome,
  routeProduct,
} from "../rules";
import {
  buildAllInCostExplanation,
  buildFairRateExplanation,
  buildNegotiationScript,
  buildProductRoutingDetail,
  buildSafeAmountExplanation,
  buildSafeEmiExplanation,
  buildStressTestDetail,
  buildVerdictExplanation,
  getLoanTypeLabel,
} from "../explanations";
import {
  DEFAULT_PROCESSING_FEE_PERCENT,
  DEFAULT_TENURE_MONTHS,
  STRESS_INCOME_DROP_PERCENT,
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
  const householdExpenses = answers.monthlyHouseholdExpenses ?? 0;

  const netMonthlyIncome = normalizeIncome({
    employmentType,
    netMonthlyIncome: answers.netMonthlyIncome,
    itrAnnualIncome: answers.itrAnnualIncome,
    cashIncomeEstimate: answers.cashIncomeEstimate,
    incomeMin: answers.incomeMin,
    incomeMax: answers.incomeMax,
    hasCoBorrower: answers.hasCoBorrower,
    coBorrowerIncome: answers.coBorrowerIncome,
  });

  const ownsCollateral = answers.ownsCollateral ?? false;
  const collateralValue = answers.collateralValue ?? 0;
  const originalProduct = answers.loanProductType ?? "unsecured-pl";

  const routedProduct = routeProduct({
    amountWanted,
    ownsCollateral,
    collateralValue,
    currentProduct: originalProduct,
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

  const unsecuredBand = getRateBand({
    employmentType,
    creditScore: answers.creditScore,
    isSecured: false,
  });

  const securedBand = getRateBand({
    employmentType,
    creditScore: answers.creditScore,
    isSecured: true,
    ltvPercent: ltvPercent ?? 30,
  });

  const midRate = (rateBand.minPercent + rateBand.maxPercent) / 2;

  const capacity = computeLoanCapacity({
    employmentType,
    netMonthlyIncome,
    existingMonthlyEmis: existingEmis,
    monthlyHouseholdExpenses: householdExpenses,
    annualRatePercent: midRate,
    tenureMonths,
    emergencySavingsMonths: answers.emergencySavingsMonths,
    upcomingLargeExpenses: answers.upcomingLargeExpenses,
    loanProductivityReturn: answers.loanProductivityReturn,
  });

  const requestedEmi = calculateEmi(amountWanted, midRate, tenureMonths);

  const recentBounced =
    answers.pastBouncedPayments === true || answers.bouncedPaymentsLast6Months === true;

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

  const stressTestedIncome = netMonthlyIncome * (1 - STRESS_INCOME_DROP_PERCENT / 100);
  const stressCapacity = computeLoanCapacity({
    employmentType,
    netMonthlyIncome: stressTestedIncome,
    existingMonthlyEmis: existingEmis,
    monthlyHouseholdExpenses: householdExpenses,
    annualRatePercent: midRate,
    tenureMonths,
  });

  const stressTest = runStressTest({
    employmentType,
    netMonthlyIncome,
    existingMonthlyEmis: existingEmis,
    monthlyHouseholdExpenses: householdExpenses,
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

  const confidenceDetail = computeConfidenceDetail(answers);

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

  const productRouting = buildProductRoutingDetail({
    originalProduct,
    routedProduct,
    amountWanted,
    collateralValue,
    unsecuredBand,
    securedBand,
  });

  const stressTestDetail = buildStressTestDetail({
    netMonthlyIncome,
    stressTestedIncome,
    currentSafeEmi: stressCapacity.safeMaxEmi,
    requestedEmi: Math.round(requestedEmi),
  });

  const whyRecommendation = buildVerdictExplanation(
    verdictResult,
    Math.round(requestedEmi),
    capacity.safeMaxEmi
  );

  const negotiationScript = buildNegotiationScript({
    rateBand,
    safeEmi: capacity.safeMaxEmi,
    safeAmount: capacity.safeMaxAmount,
    employmentType,
  });

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
        ? "Use the borrower-safe number — it leaves room for life's surprises."
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
    confidence: confidenceDetail.level,
    confidenceDetail,
    explanations: {
      safeEmi: buildSafeEmiExplanation({
        capacity,
        existingEmis,
        householdExpenses,
        netMonthlyIncome,
        employmentType,
      }),
      safeAmount: buildSafeAmountExplanation({
        capacity,
        annualRatePercent: midRate,
        tenureMonths,
      }),
      fairRate: buildFairRateExplanation(rateBand),
      allInCost: buildAllInCostExplanation(aprBand.minPercent, aprBand.maxPercent),
    },
    productRouting,
    stressTestDetail,
    negotiationCard: {
      loanType: getLoanTypeLabel(routedProduct),
      requestedAmount: amountWanted,
      fairRateBand: rateBand,
      safeEmiCeiling: capacity.safeMaxEmi,
      safeLoanAmount: capacity.safeMaxAmount,
      lenderMaxAmount: capacity.lenderMaxAmount,
      recommendedTenureMonths: tenureMonths,
      estimatedAllInAnnualisedCost: aprBand,
      confidence: confidenceDetail.level,
      whyRecommendation,
      whatToAskLender: negotiationScript,
      disclaimer:
        "Indicative estimate — not a loan approval or guarantee. Borrower Copilot provides guidance based on the information you provide; it is not a credit decision or substitute for a lender's final terms.",
      lenderOfferComparison,
    },
  };
}
