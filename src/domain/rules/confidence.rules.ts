import type { AssessmentAnswers, ConfidenceLevel, EmploymentType } from "@/types/assessment";
import { QUESTION_LABELS } from "@/config/assessmentQuestions";

const BRANCH_MUST: Record<EmploymentType, string[]> = {
  salaried: ["netMonthlyIncome"],
  "self-employed": ["itrAnnualIncome"],
  informal: ["incomeMin", "incomeMax"],
};

const CORE_MUST = [
  "loanPurpose",
  "amountWanted",
  "loanProductType",
  "employmentType",
  "existingMonthlyEmis",
  "monthlyHouseholdExpenses",
  "age",
];

const BRANCH_OPTIONAL: Record<EmploymentType, string[]> = {
  salaried: [
    "employerTenureMonths",
    "incomeStability",
    "creditScore",
    "emergencySavingsMonths",
    "pastBouncedPayments",
    "cardUtilizationPercent",
    "upcomingLargeExpenses",
    "lenderOfferRate",
    "lenderOfferAmount",
    "lenderOfferTenureMonths",
    "incomeNegativeShock",
    "dependents",
  ],
  "self-employed": [
    "yearsInBusiness",
    "cashIncomeEstimate",
    "ownsCollateral",
    "collateralValue",
    "creditScore",
    "emergencySavingsMonths",
    "pastBouncedPayments",
    "cardUtilizationPercent",
    "upcomingLargeExpenses",
    "loanProductivityReturn",
    "lenderOfferRate",
    "lenderOfferAmount",
    "lenderOfferTenureMonths",
    "incomeNegativeShock",
    "dependents",
  ],
  informal: [
    "platformSourceCount",
    "hasHighCostDebt",
    "bouncedPaymentsLast6Months",
    "creditScore",
    "emergencySavingsMonths",
    "pastBouncedPayments",
    "cardUtilizationPercent",
    "upcomingLargeExpenses",
    "lenderOfferRate",
    "lenderOfferAmount",
    "lenderOfferTenureMonths",
    "incomeNegativeShock",
    "dependents",
  ],
};

export function isAnswered(answers: AssessmentAnswers, field: string): boolean {
  if (answers.skippedFields.includes(field)) return false;
  const value = answers[field as keyof AssessmentAnswers];
  if (value === null || value === undefined) return false;
  if (value === "") return false;
  return true;
}

export function isUnknown(answers: AssessmentAnswers, field: string): boolean {
  if (field === "creditScore" && answers.creditScore === "unknown") return true;
  return false;
}

export function computeConfidence(answers: AssessmentAnswers): ConfidenceLevel {
  return computeConfidenceDetail(answers).level;
}

export function computeConfidenceDetail(answers: AssessmentAnswers): {
  level: ConfidenceLevel;
  headline: string;
  summary: string;
  knownFields: string[];
  unknownFields: string[];
  improvements: string[];
} {
  const employmentType = answers.employmentType;
  const knownFields: string[] = [];
  const unknownFields: string[] = [];
  const improvements: string[] = [];

  const mustFields = employmentType
    ? [...CORE_MUST, ...BRANCH_MUST[employmentType]]
    : CORE_MUST;

  for (const field of mustFields) {
    if (answers.skippedFields.includes(field)) {
      return buildDetail("low", knownFields, unknownFields, [
        "Answer required questions instead of skipping them.",
      ]);
    }
    if (!isAnswered(answers, field)) {
      return buildDetail("low", knownFields, unknownFields, [
        `Provide ${QUESTION_LABELS[field] ?? field} to improve estimate reliability.`,
      ]);
    }
    knownFields.push(QUESTION_LABELS[field] ?? field);
  }

  if (!employmentType) {
    return buildDetail("low", knownFields, unknownFields, ["Select your employment type."]);
  }

  const optionalFields = BRANCH_OPTIONAL[employmentType];
  for (const field of optionalFields) {
    if (answers.skippedFields.includes(field)) continue;
    if (isUnknown(answers, field)) {
      unknownFields.push(QUESTION_LABELS[field] ?? field);
    } else if (isAnswered(answers, field)) {
      knownFields.push(QUESTION_LABELS[field] ?? field);
    } else {
      unknownFields.push(QUESTION_LABELS[field] ?? field);
      improvements.push(`Add ${QUESTION_LABELS[field] ?? field} for a tighter estimate.`);
    }
  }

  const answeredCount = optionalFields.filter((f) => isAnswered(answers, f)).length;
  const ratio = optionalFields.length > 0 ? answeredCount / optionalFields.length : 1;

  if (unknownFields.length > 0 && !improvements.some((i) => i.includes("credit"))) {
    if (answers.creditScore === "unknown" || answers.creditScore === null) {
      improvements.unshift("Add your credit score if you know it — unknown score widens the rate band.");
    }
  }

  let level: ConfidenceLevel;
  if (ratio >= 0.8 && unknownFields.length <= 2) {
    level = "high";
  } else if (ratio >= 0.4) {
    level = "medium";
  } else {
    level = "low";
  }

  if (answers.skippedFields.some((f) => mustFields.includes(f))) {
    level = "low";
  }

  return buildDetail(level, knownFields, unknownFields, improvements.slice(0, 4));
}

function buildDetail(
  level: ConfidenceLevel,
  knownFields: string[],
  unknownFields: string[],
  improvements: string[]
): {
  level: ConfidenceLevel;
  headline: string;
  summary: string;
  knownFields: string[];
  unknownFields: string[];
  improvements: string[];
} {
  const headlines: Record<ConfidenceLevel, string> = {
    high: "HIGH CONFIDENCE",
    medium: "MEDIUM CONFIDENCE",
    low: "LOW CONFIDENCE",
  };

  const summaries: Record<ConfidenceLevel, string> = {
    high: "We have strong inputs to estimate your borrowing position with a tighter range.",
    medium:
      "We have enough information to estimate your borrowing position, but some inputs are still unknown.",
    low: "Several important inputs are missing or skipped — treat these numbers as directional only.",
  };

  return {
    level,
    headline: headlines[level],
    summary: summaries[level],
    knownFields,
    unknownFields,
    improvements,
  };
}

export function getBranchOptionalFields(employmentType: EmploymentType): string[] {
  return BRANCH_OPTIONAL[employmentType];
}
