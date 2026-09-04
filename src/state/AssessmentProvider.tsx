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
import {
  clampQuestionIndex,
  getActiveQuestions,
} from "@/features/assessment/utils/getVisibleQuestions";

interface AssessmentContextValue {
  answers: AssessmentAnswers;
  updateAnswers: (partial: Partial<AssessmentAnswers>) => void;
  skipField: (field: string) => void;
  resetAssessment: () => void;
  loadFixture: (answers: AssessmentAnswers) => void;
  results: EngineOutput | null;
  computeResults: () => EngineOutput | null;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  activeQuestions: string[];
  goToNextQuestion: () => boolean;
  goToPreviousQuestion: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<AssessmentAnswers>(EMPTY_ASSESSMENT);
  const [results, setResults] = useState<EngineOutput | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndexState] = useState(0);

  const activeQuestions = useMemo(() => getActiveQuestions(answers), [answers]);

  const setCurrentQuestionIndex = useCallback(
    (index: number) => {
      setCurrentQuestionIndexState(clampQuestionIndex(answers, index));
    },
    [answers]
  );

  const updateAnswers = useCallback((partial: Partial<AssessmentAnswers>) => {
    setAnswers((prev) => {
      const next = { ...prev, ...partial };
      const updatedFields = Object.keys(partial);
      const skipped = prev.skippedFields.filter((f) => !updatedFields.includes(f));
      return { ...next, skippedFields: skipped };
    });
  }, []);

  const skipField = useCallback((field: string) => {
    setAnswers((prev) => {
      if (prev.skippedFields.includes(field)) return prev;
      const nextAnswers = {
        ...prev,
        skippedFields: [...prev.skippedFields, field],
      };

      setCurrentQuestionIndexState((prevIndex) => {
        const prevActive = getActiveQuestions(prev);
        const nextActive = getActiveQuestions(nextAnswers);
        const currentField = prevActive[prevIndex];
        if (currentField === field) {
          return Math.min(prevIndex, Math.max(0, nextActive.length - 1));
        }
        const newIdx = nextActive.indexOf(currentField);
        return newIdx >= 0 ? newIdx : clampQuestionIndex(nextAnswers, prevIndex);
      });

      return nextAnswers;
    });
  }, []);

  const resetAssessment = useCallback(() => {
    setAnswers(EMPTY_ASSESSMENT);
    setResults(null);
    setCurrentQuestionIndexState(0);
  }, []);

  const loadFixture = useCallback((fixture: AssessmentAnswers) => {
    setAnswers(fixture);
    setCurrentQuestionIndexState(0);
    setResults(null);
  }, []);

  const computeResults = useCallback(() => {
    const output = runEngine({ answers });
    setResults(output);
    return output;
  }, [answers]);

  const goToNextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= activeQuestions.length) {
      return false;
    }
    setCurrentQuestionIndexState(nextIndex);
    return true;
  }, [activeQuestions.length, currentQuestionIndex]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex <= 0) return;
    setCurrentQuestionIndexState(currentQuestionIndex - 1);
  }, [currentQuestionIndex]);

  const value = useMemo(
    () => ({
      answers,
      updateAnswers,
      skipField,
      resetAssessment,
      loadFixture,
      results,
      computeResults,
      currentQuestionIndex,
      setCurrentQuestionIndex,
      activeQuestions,
      goToNextQuestion,
      goToPreviousQuestion,
    }),
    [
      answers,
      updateAnswers,
      skipField,
      resetAssessment,
      loadFixture,
      results,
      computeResults,
      currentQuestionIndex,
      setCurrentQuestionIndex,
      activeQuestions,
      goToNextQuestion,
      goToPreviousQuestion,
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
