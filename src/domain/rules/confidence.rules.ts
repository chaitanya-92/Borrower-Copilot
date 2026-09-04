import type { AssessmentAnswers, ConfidenceLevel, EmploymentType } from "@/types/assessment";

const MUST_QUESTIONS: (keyof AssessmentAnswers)[] = [
  "loanPurpose",
  "amountWanted",
  "loanProductType",
  "employmentType",
  "netMonthlyIncome",
  "existingMonthlyEmis",
  "monthlyHouseholdExpenses",
  "age",
  "creditScore",
];

const BRANCH_OPTIONAL: Record<EmploymentType, string[]> = {
  salaried: [
    "employerTenureMonths",
    "incomeStability",
    "emergencySavingsMonths",
    "pastBouncedPayments",
    "cardUtilizationPercent",
    "upcomingLargeExpenses",
    "lenderOfferRate",
  ],
  "self-employed": [
    "yearsInBusiness",
    "itrIncome",
    "cashIncomeEstimate",
    "ownsCollateral",
    "collateralValue",
    "emergencySavingsMonths",
    "pastBouncedPayments",
    "cardUtilizationPercent",
    "upcomingLargeExpenses",
    "loanProductivityReturn",
    "lenderOfferRate",
  ],
  informal: [
    "incomeMin",
    "incomeMax",
    "platformSourceCount",
    "hasHighCostDebt",
    "bouncedPaymentsLast6Months",
    "emergencySavingsMonths",
    "pastBouncedPayments",
    "cardUtilizationPercent",
    "upcomingLargeExpenses",
    "lenderOfferRate",
  ],
};

function isAnswered(answers: AssessmentAnswers, field: string): boolean {
  if (answers.skippedFields.includes(field)) return false;
  const value = answers[field as keyof AssessmentAnswers];
  if (value === null || value === undefined) return false;
  return true;
}

export function computeConfidence(answers: AssessmentAnswers): ConfidenceLevel {
  for (const field of MUST_QUESTIONS) {
    if (!isAnswered(answers, field)) {
      return "low";
    }
  }

  const employmentType = answers.employmentType;
  if (!employmentType) return "low";

  const optionalFields = BRANCH_OPTIONAL[employmentType];
  const answeredCount = optionalFields.filter((f) => isAnswered(answers, f)).length;
  const ratio = answeredCount / optionalFields.length;

  if (ratio >= 0.8) return "high";
  if (ratio >= 0.4) return "medium";
  return "low";
}

export function getBranchOptionalFields(employmentType: EmploymentType): string[] {
  return BRANCH_OPTIONAL[employmentType];
}
