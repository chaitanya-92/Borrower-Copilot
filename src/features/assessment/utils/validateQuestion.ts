import type { AssessmentAnswers } from "@/types/assessment";
import { getQuestionById } from "@/config/assessmentQuestions";

export function validateQuestion(
  fieldId: string,
  answers: AssessmentAnswers
): string | null {
  const def = getQuestionById(fieldId);
  if (!def) return null;

  if (answers.skippedFields.includes(fieldId)) return null;

  const raw = answers[fieldId as keyof AssessmentAnswers];

  if (def.inputType === "creditScore") {
    if (raw === "unknown") return null;
    if (raw === null || raw === undefined) {
      return def.required ? "Enter your credit score or choose \"I don't know\"." : null;
    }
    if (typeof raw === "number") {
      if (raw < 300 || raw > 900) return "Credit score should be between 300 and 900.";
    }
    return null;
  }

  if (def.required && (raw === null || raw === undefined || raw === "")) {
    return `${def.label.replace(/\?$/, "")} is required.`;
  }

  if (raw === null || raw === undefined || raw === "") return null;

  if (def.inputType === "number" && typeof raw === "number") {
    if (def.min != null && raw < def.min) {
      return `Enter a value of at least ${def.min.toLocaleString("en-IN")}.`;
    }
    if (def.max != null && raw > def.max) {
      return `Enter a value no greater than ${def.max.toLocaleString("en-IN")}.`;
    }
    if (Number.isNaN(raw)) return "Enter a valid number.";
  }

  if (fieldId === "incomeMax" && answers.incomeMin != null && typeof raw === "number") {
    if (raw < answers.incomeMin) {
      return "Maximum income should be greater than or equal to minimum income.";
    }
  }

  if (fieldId === "collateralValue" && answers.ownsCollateral && (raw === null || raw === 0)) {
    return "Enter an estimated collateral value.";
  }

  return null;
}

export function isQuestionComplete(fieldId: string, answers: AssessmentAnswers): boolean {
  if (answers.skippedFields.includes(fieldId)) return true;
  return validateQuestion(fieldId, answers) === null && hasValue(fieldId, answers);
}

function hasValue(fieldId: string, answers: AssessmentAnswers): boolean {
  const def = getQuestionById(fieldId);
  if (!def) return false;
  if (!def.required) return true;

  const raw = answers[fieldId as keyof AssessmentAnswers];
  if (raw === null || raw === undefined || raw === "") return false;
  if (def.inputType === "creditScore" && !def.required) return true;
  return true;
}
