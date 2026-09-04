"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AssessmentAnswers, EngineOutput } from "@/types/assessment";
import { EMPTY_ASSESSMENT } from "@/types/assessment";
import { runEngine } from "@/domain/engine";

interface AssessmentContextValue {
  answers: AssessmentAnswers;
  updateAnswers: (partial: Partial<AssessmentAnswers>) => void;
  skipField: (field: string) => void;
  resetAssessment: () => void;
  loadFixture: (answers: AssessmentAnswers) => void;
  results: EngineOutput | null;
  computeResults: () => EngineOutput | null;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<AssessmentAnswers>(EMPTY_ASSESSMENT);
  const [results, setResults] = useState<EngineOutput | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const updateAnswers = useCallback((partial: Partial<AssessmentAnswers>) => {
    setAnswers((prev) => {
      const next = { ...prev, ...partial };
      const updatedFields = Object.keys(partial);
      const skipped = prev.skippedFields.filter((f) => !updatedFields.includes(f));
      return { ...next, skippedFields: skipped };
    });
  }, []);

  const skipField = useCallback((field: string) => {
    setAnswers((prev) => ({
      ...prev,
      skippedFields: prev.skippedFields.includes(field)
        ? prev.skippedFields
        : [...prev.skippedFields, field],
    }));
  }, []);

  const resetAssessment = useCallback(() => {
    setAnswers(EMPTY_ASSESSMENT);
    setResults(null);
    setCurrentStep(0);
  }, []);

  const loadFixture = useCallback((fixture: AssessmentAnswers) => {
    setAnswers(fixture);
    setCurrentStep(0);
    setResults(null);
  }, []);

  const computeResults = useCallback(() => {
    const output = runEngine({ answers });
    setResults(output);
    return output;
  }, [answers]);

  const value = useMemo(
    () => ({
      answers,
      updateAnswers,
      skipField,
      resetAssessment,
      loadFixture,
      results,
      computeResults,
      currentStep,
      setCurrentStep,
    }),
    [
      answers,
      updateAnswers,
      skipField,
      resetAssessment,
      loadFixture,
      results,
      computeResults,
      currentStep,
    ]
  );

  return (
    <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}
