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
        <div className="flex min-h-[240px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading assessment…
          </p>
        </div>
      </PageContainer>
    );
  }

  const handleContinue = () => {
    const validationError = validateQuestion(
      currentFieldId,
      answers
    );

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
    <PageContainer className="max-w-2xl pb-12 pt-8 sm:pt-10">
      {/* Progress */}
      <header className="mb-9">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

            <p className="text-xs font-semibold tracking-wide text-blue-600">
              Step {currentQuestionIndex + 1} of {total}
            </p>
          </div>

          <p className="text-xs font-medium tabular-nums text-slate-400">
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
      <article>
        {/* Category */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {question.category}
        </p>

        {/* Question + answer */}
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

        {/* Helper description */}
        {question.description && (
          <div className="mt-3 flex max-w-xl items-start gap-2">
            <span
              className="mt-0.5 shrink-0 text-xs text-slate-400"
              aria-hidden="true"
            >
              ↳
            </span>

            <p className="text-[13px] leading-5 text-slate-500">
              {question.description}
            </p>
          </div>
        )}

        {/* Why we ask */}
        {question.whyAsk && (
          <WhyWeAsk text={question.whyAsk} />
        )}
      </article>

      {/* Navigation */}
      <footer className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 no-print">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentQuestionIndex <= 0}
          aria-label="Go to previous question"
          className="
            rounded-lg
            border-slate-200
            bg-white
            px-5
            text-sm
            font-medium
            text-slate-600
            shadow-none
            hover:bg-slate-50
            hover:text-slate-900
            disabled:opacity-40
          "
        >
          ← Back
        </Button>

        <div className="flex items-center gap-2 sm:gap-3">
          {question.skippable && (
            <Button
              variant="ghost"
              type="button"
              onClick={handleSkip}
              className="
                rounded-lg
                px-3
                text-sm
                font-medium
                text-slate-500
                hover:bg-slate-100
                hover:text-slate-900
              "
              aria-label={`Skip question: ${question.label}`}
            >
              Skip
            </Button>
          )}

          <Button
            onClick={handleContinue}
            className="
              rounded-lg
              bg-blue-600
              px-6
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-colors
              hover:bg-blue-700
              sm:px-7
            "
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