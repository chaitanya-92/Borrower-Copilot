import type { AssessmentAnswers, EmploymentType } from "@/types/assessment";
import { LARGE_LOAN_THRESHOLD } from "@/config/constants";

export interface AssessmentStep {
  id: string;
  title: string;
  description: string;
}

export const ASSESSMENT_STEPS: AssessmentStep[] = [
  { id: "loan", title: "Your Loan", description: "Purpose, amount & product type" },
  { id: "about", title: "About You", description: "Age & employment type" },
  { id: "income", title: "Income", description: "How you earn" },
  { id: "obligations", title: "Obligations", description: "Existing EMIs & debt" },
  { id: "household", title: "Household", description: "Expenses & safety net" },
  { id: "collateral", title: "Collateral", description: "Assets you can pledge" },
  { id: "optional", title: "Optional", description: "Improves accuracy" },
];

export function shouldShowCollateralStep(answers: AssessmentAnswers): boolean {
  return (
    answers.employmentType === "self-employed" &&
    (answers.amountWanted ?? 0) > LARGE_LOAN_THRESHOLD
  );
}

export function getVisibleSteps(answers: AssessmentAnswers): AssessmentStep[] {
  return ASSESSMENT_STEPS.filter((step) => {
    if (step.id === "collateral") return shouldShowCollateralStep(answers);
    return true;
  });
}

export function getVisibleQuestions(answers: AssessmentAnswers): string[] {
  const fields: string[] = [
    "loanPurpose",
    "amountWanted",
    "loanProductType",
    "age",
    "employmentType",
  ];

  const emp = answers.employmentType;

  if (emp === "salaried") {
    fields.push("netMonthlyIncome", "employerTenureMonths", "incomeStability");
  } else if (emp === "self-employed") {
    fields.push("itrIncome", "cashIncomeEstimate", "yearsInBusiness");
    if (shouldShowCollateralStep(answers)) {
      fields.push("ownsCollateral", "collateralValue");
    }
  } else if (emp === "informal") {
    fields.push("incomeMin", "incomeMax", "platformSourceCount", "hasHighCostDebt", "bouncedPaymentsLast6Months");
  }

  fields.push(
    "existingMonthlyEmis",
    "monthlyHouseholdExpenses",
    "creditScore",
    "emergencySavingsMonths",
    "pastBouncedPayments",
    "cardUtilizationPercent",
    "upcomingLargeExpenses",
    "loanProductivityReturn",
    "lenderOfferRate"
  );

  return fields;
}

export function getIncomeFields(employmentType: EmploymentType | null): string[] {
  switch (employmentType) {
    case "salaried":
      return ["netMonthlyIncome", "employerTenureMonths", "incomeStability"];
    case "self-employed":
      return ["itrIncome", "cashIncomeEstimate", "yearsInBusiness"];
    case "informal":
      return ["incomeMin", "incomeMax", "platformSourceCount"];
    default:
      return [];
  }
}
