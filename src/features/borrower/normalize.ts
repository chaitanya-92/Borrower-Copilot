import type { AssessmentAnswers } from "@/types/assessment";

export function normalizeBorrowerProfile(answers: AssessmentAnswers) {
  return {
    employmentType: answers.employmentType,
    age: answers.age,
    creditScore: answers.creditScore,
    dependents: answers.dependents ?? 0,
  };
}
