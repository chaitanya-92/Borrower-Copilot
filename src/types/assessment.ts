export type EmploymentType = "salaried" | "self-employed" | "informal";

export type LoanPurpose =
  | "personal"
  | "home-renovation"
  | "business"
  | "education"
  | "medical"
  | "debt-consolidation"
  | "other";

export type LoanProductType = "unsecured-pl" | "secured-lap" | "gold-loan" | "business-loan";

export type IncomeStability = "fixed" | "variable" | "mixed";

export type CreditScoreInput = number | "unknown";

export type VerdictType = "borrow" | "borrow-less" | "dont-borrow";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface AssessmentAnswers {
  // Must questions
  loanPurpose: LoanPurpose | null;
  amountWanted: number | null;
  loanProductType: LoanProductType | null;
  employmentType: EmploymentType | null;
  netMonthlyIncome: number | null;
  existingMonthlyEmis: number | null;
  monthlyHouseholdExpenses: number | null;
  age: number | null;
  creditScore: CreditScoreInput | null;

  // Salaried branch
  employerTenureMonths: number | null;
  incomeStability: IncomeStability | null;

  // Self-employed branch
  yearsInBusiness: number | null;
  itrIncome: number | null;
  cashIncomeEstimate: number | null;
  ownsCollateral: boolean | null;
  collateralValue: number | null;

  // Informal/gig branch
  incomeMin: number | null;
  incomeMax: number | null;
  platformSourceCount: number | null;
  hasHighCostDebt: boolean | null;
  bouncedPaymentsLast6Months: boolean | null;

  // Optional
  emergencySavingsMonths: number | null;
  pastBouncedPayments: boolean | null;
  cardUtilizationPercent: number | null;
  upcomingLargeExpenses: number | null;
  loanProductivityReturn: number | null;
  lenderOfferRate: number | null;
  lenderOfferAmount: number | null;
  lenderOfferTenureMonths: number | null;
  hasCoBorrower: boolean | null;
  coBorrowerIncome: number | null;
  incomeNegativeShock: boolean | null;
  dependents: number | null;
  skippedFields: string[];
}

export const EMPTY_ASSESSMENT: AssessmentAnswers = {
  loanPurpose: null,
  amountWanted: null,
  loanProductType: null,
  employmentType: null,
  netMonthlyIncome: null,
  existingMonthlyEmis: null,
  monthlyHouseholdExpenses: null,
  age: null,
  creditScore: null,
  employerTenureMonths: null,
  incomeStability: null,
  yearsInBusiness: null,
  itrIncome: null,
  cashIncomeEstimate: null,
  ownsCollateral: null,
  collateralValue: null,
  incomeMin: null,
  incomeMax: null,
  platformSourceCount: null,
  hasHighCostDebt: null,
  bouncedPaymentsLast6Months: null,
  emergencySavingsMonths: null,
  pastBouncedPayments: null,
  cardUtilizationPercent: null,
  upcomingLargeExpenses: null,
  loanProductivityReturn: null,
  lenderOfferRate: null,
  lenderOfferAmount: null,
  lenderOfferTenureMonths: null,
  hasCoBorrower: null,
  coBorrowerIncome: null,
  incomeNegativeShock: null,
  dependents: null,
  skippedFields: [],
};

export interface RateBand {
  minPercent: number;
  maxPercent: number;
  reason: string;
}

export interface LoanCapacityOutput {
  lenderMaxAmount: number;
  safeMaxAmount: number;
  lenderMaxEmi: number;
  safeMaxEmi: number;
  recommendation: string;
}

export interface FairRateOutput {
  nominalRateBand: RateBand;
  aprBand: { minPercent: number; maxPercent: number };
  routedProduct: LoanProductType;
  whyThisBand: string;
}

export interface TenureComparisonRow {
  tenureMonths: number;
  emi: number;
  totalInterest: number;
  maxLoanForSafeEmi: number;
}

export interface StressTestOutput {
  incomeDropDeltaEmi: number;
  rateRiseDeltaEmi: number;
  incomeDropSafeEmiCeiling: number;
  rateRiseEmi: number;
}

export interface EmiOutput {
  recommendedEmiCeiling: number;
  requestedEmi: number;
  tenureComparisons: TenureComparisonRow[];
  stressTest: StressTestOutput;
}

export interface VerdictOutput {
  verdict: VerdictType;
  reason: string;
  recommendedAmount: number | null;
}

export interface NegotiationCardOutput {
  fairRateBand: RateBand;
  safeEmiCeiling: number;
  safeLoanAmount: number;
  lenderOfferComparison: {
    fairTotalInterest: number;
    offerTotalInterest: number;
    savings: number;
    hasOffer: boolean;
  } | null;
}

export interface EngineOutput {
  verdict: VerdictOutput;
  loanCapacity: LoanCapacityOutput;
  fairRate: FairRateOutput;
  emi: EmiOutput;
  confidence: ConfidenceLevel;
  negotiationCard: NegotiationCardOutput;
}
