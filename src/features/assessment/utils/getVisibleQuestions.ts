import type { AssessmentAnswers } from "@/types/assessment";
import { ALL_QUESTIONS, shouldShowCollateralQuestions } from "@/config/assessmentQuestions";

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
  return shouldShowCollateralQuestions(answers);
}

export function getVisibleSteps(answers: AssessmentAnswers): AssessmentStep[] {
  return ASSESSMENT_STEPS.filter((step) => {
    if (step.id === "collateral") return shouldShowCollateralStep(answers);
    return true;
  });
}

function isQuestionVisible(answers: AssessmentAnswers, questionId: string): boolean {
  const def = ALL_QUESTIONS.find((q) => q.id === questionId);
  if (!def) return false;
  if (def.visible && !def.visible(answers)) return false;
  return true;
}

/** All questions that could appear for this profile (before skip filtering). */
export function getVisibleQuestions(answers: AssessmentAnswers): string[] {
  return ALL_QUESTIONS.filter((q) => isQuestionVisible(answers, q.id)).map((q) => q.id);
}

/** Active questions — visible and not skipped. Used for rendering and progress. */
export function getActiveQuestions(answers: AssessmentAnswers): string[] {
  return getVisibleQuestions(answers).filter((id) => !answers.skippedFields.includes(id));
}

export function getActiveQuestionIndex(answers: AssessmentAnswers, questionId: string): number {
  return getActiveQuestions(answers).indexOf(questionId);
}

export function clampQuestionIndex(answers: AssessmentAnswers, index: number): number {
  const active = getActiveQuestions(answers);
  if (active.length === 0) return 0;
  return Math.max(0, Math.min(index, active.length - 1));
}
