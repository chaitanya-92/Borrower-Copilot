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
    setCurrentQuestionIndex(
      clampQuestionIndex(answers, currentQuestionIndex)
    );
  }, [
    activeQuestions.length,
    answers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ]);

  const currentFieldId = activeQuestions[currentQuestionIndex];
  const question = currentFieldId
    ? getQuestionById(currentFieldId)
    : undefined;

  const total = activeQuestions.length;

  const progress =
    total > 0 ? ((currentQuestionIndex + 1) / total) * 100 : 0;

  const isLast = currentQuestionIndex >= total - 1;

  if (!question || total === 0) {
    return (
      <PageContainer className="py-12">
        <p className="text-sm text-slate-500">
          Loading assessment…
        </p>
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
    <PageContainer className="max-w-2xl pb-16 pt-8 sm:pt-10">
      {/* Progress */}
      <header className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Step {currentQuestionIndex + 1} of {total}
          </p>

          <p className="text-xs font-medium text-slate-400">
            {Math.round(progress)}%
          </p>
        </div>

        <Progress
          value={progress}
          className="mt-3 h-1.5 bg-slate-100"
          aria-label="Assessment progress"
        />
      </header>

      {/* Question */}
      <article className="min-h-[390px]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          {question.category}
        </p>

        <div className="mt-4">
          <QuestionField
            question={question}
            answers={answers}
            error={error}
            onUpdate={(partial) => {
              setError(null);
              updateAnswers(partial);
            }}
          />
        </div>

        {question.description && (
          <p className="mt-3 max-w-xl text-[13px] leading-5 text-slate-500">
            {question.description}
          </p>
        )}

        {/* Reserved explanation area */}
        {question.whyAsk && (
          <div className="mt-6 min-h-[92px] border-t border-slate-200 pt-1">
            <WhyWeAsk text={question.whyAsk} />
          </div>
        )}
      </article>

      {/* Navigation */}
      <footer className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between no-print">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentQuestionIndex <= 0}
          aria-label="Go to previous question"
          className="w-full rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
        >
          ← Back
        </Button>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          {question.skippable && (
            <Button
              variant="link"
              type="button"
              onClick={handleSkip}
              className="text-slate-500 hover:text-slate-900"
              aria-label={`Skip question: ${question.label}`}
            >
              Skip
            </Button>
          )}

          <Button
            onClick={handleContinue}
            className="w-full rounded-lg bg-blue-600 px-7 font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto"
            aria-label={
              isLast
                ? "See results"
                : "Continue to next question"
            }
          >
            {isLast ? "See results →" : "Continue →"}
          </Button>
        </div>
      </footer>
    </PageContainer>
  );
}