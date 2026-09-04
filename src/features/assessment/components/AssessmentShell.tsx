"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAssessment } from "@/state/AssessmentProvider";
import { getVisibleSteps } from "@/features/assessment/utils/getVisibleQuestions";
import { StepLoanDetails } from "./StepLoanDetails";
import { StepAboutYou } from "./StepAboutYou";
import { StepIncome } from "./StepIncome";
import { StepObligations } from "./StepObligations";
import { StepHousehold } from "./StepHousehold";
import { StepCollateral } from "./StepCollateral";
import { StepOptional } from "./StepOptional";

const STEP_COMPONENTS = [
  StepLoanDetails,
  StepAboutYou,
  StepIncome,
  StepObligations,
  StepHousehold,
  StepCollateral,
  StepOptional,
];

const STEP_IDS = ["loan", "about", "income", "obligations", "household", "collateral", "optional"];

export function AssessmentShell() {
  const router = useRouter();
  const { answers, currentStep, setCurrentStep, computeResults } = useAssessment();

  const visibleSteps = getVisibleSteps(answers);
  const visibleStepIds = visibleSteps.map((s) => s.id);
  const currentStepId = STEP_IDS[currentStep];
  const visibleIndex = visibleStepIds.indexOf(currentStepId);
  const progress = visibleIndex >= 0 ? ((visibleIndex + 1) / visibleSteps.length) * 100 : 0;

  const StepComponent = STEP_COMPONENTS[currentStep] ?? StepLoanDetails;
  const stepMeta = visibleSteps.find((s) => s.id === currentStepId) ?? visibleSteps[0];

  const goNext = () => {
    const nextVisibleIdx = visibleIndex + 1;
    if (nextVisibleIdx >= visibleSteps.length) {
      computeResults();
      router.push("/results");
      return;
    }
    const nextId = visibleSteps[nextVisibleIdx].id;
    const nextGlobalIdx = STEP_IDS.indexOf(nextId);
    setCurrentStep(nextGlobalIdx >= 0 ? nextGlobalIdx : 0);
  };

  const goBack = () => {
    if (visibleIndex <= 0) return;
    const prevId = visibleSteps[visibleIndex - 1].id;
    const prevGlobalIdx = STEP_IDS.indexOf(prevId);
    setCurrentStep(prevGlobalIdx >= 0 ? prevGlobalIdx : 0);
  };

  const isLast = visibleIndex >= visibleSteps.length - 1;

  return (
    <PageContainer>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-primary">
          Step {visibleIndex + 1} of {visibleSteps.length}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold">{stepMeta?.title}</h1>
        <p className="mt-1 text-muted-foreground">{stepMeta?.description}</p>
        <Progress value={progress} className="mt-4" />
      </div>

      <StepComponent />

      <div className="mt-12 flex justify-between no-print">
        <Button variant="secondary" onClick={goBack} disabled={visibleIndex <= 0}>
          Back
        </Button>
        <Button onClick={goNext}>{isLast ? "See Results" : "Continue"}</Button>
      </div>
    </PageContainer>
  );
}
