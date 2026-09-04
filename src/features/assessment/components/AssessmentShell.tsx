"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAssessment } from "@/state/AssessmentProvider";
import { getQuestionById } from "@/config/assessmentQuestions";
import { clampQuestionIndex } from "@/features/assessment/utils/getVisibleQuestions";
import { validateQuestion } from "@/features/assessment/utils/validateQuestion";
import { QuestionField } from "./QuestionField";
import { WhyWeAsk } from "./WhyWeAsk";

export function AssessmentShell() {
  const router = useRouter();
  const {
    answers,
    activeQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    updateAnswers,
    skipField,
    goToNextQuestion,
    goToPreviousQuestion,
    computeResults,
  } = useAssessment();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentQuestionIndex(clampQuestionIndex(answers, currentQuestionIndex));
  }, [activeQuestions.length, answers, currentQuestionIndex, setCurrentQuestionIndex]);

  const currentFieldId = activeQuestions[currentQuestionIndex];
  const question = currentFieldId ? getQuestionById(currentFieldId) : undefined;
  const total = activeQuestions.length;
  const progress = total > 0 ? ((currentQuestionIndex + 1) / total) * 100 : 0;
  const isLast = currentQuestionIndex >= total - 1;

  if (!question || total === 0) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Loading assessment…</p>
      </PageContainer>
    );
  }

  const handleContinue = () => {
    const validationError = validateQuestion(currentFieldId, answers);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    if (isLast) {
      computeResults();
      router.push("/results");
      return;
    }
    goToNextQuestion();
  };

  const handleSkip = () => {
    if (!question.skippable) return;
    setError(null);
    skipField(currentFieldId);
    if (isLast) {
      computeResults();
      router.push("/results");
    }
  };

  const handleBack = () => {
    setError(null);
    goToPreviousQuestion();
  };

  return (
    <PageContainer className="max-w-2xl pb-24">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Step {currentQuestionIndex + 1} of {total}
        </p>
        <Progress value={progress} className="mt-4 h-1.5" aria-label="Assessment progress" />
      </header>

      <article className="space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          {question.category}
        </p>

        <QuestionField
          question={question}
          answers={answers}
          error={error}
          onUpdate={(partial) => {
            setError(null);
            updateAnswers(partial);
          }}
        />

        {question.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{question.description}</p>
        )}

        {question.whyAsk && <WhyWeAsk text={question.whyAsk} />}
      </article>

      <footer className="mt-14 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between no-print">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentQuestionIndex <= 0}
          aria-label="Go to previous question"
          className="w-full sm:w-auto"
        >
          ← Back
        </Button>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {question.skippable && (
            <Button
              variant="link"
              type="button"
              onClick={handleSkip}
              className="order-2 sm:order-1 text-muted-foreground hover:text-foreground"
              aria-label={`Skip question: ${question.label}`}
            >
              Skip
            </Button>
          )}
          <Button
            onClick={handleContinue}
            className="order-1 sm:order-2 w-full sm:w-auto"
            aria-label={isLast ? "See results" : "Continue to next question"}
          >
            {isLast ? "See Results →" : "Continue →"}
          </Button>
        </div>
      </footer>
    </PageContainer>
  );
}
