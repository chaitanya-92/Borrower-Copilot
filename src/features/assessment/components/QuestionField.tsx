"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import type { AssessmentAnswers } from "@/types/assessment";
import type { QuestionDefinition } from "@/config/assessmentQuestions";
import type { IncomeStability } from "@/types/assessment";

interface QuestionFieldProps {
  question: QuestionDefinition;
  answers: AssessmentAnswers;
  error: string | null;
  onUpdate: (partial: Partial<AssessmentAnswers>) => void;
}

export function QuestionField({ question, answers, error, onUpdate }: QuestionFieldProps) {
  const fieldId = question.id;
  const value = answers[fieldId as keyof AssessmentAnswers];
  const inputId = `question-${fieldId}`;

  if (question.inputType === "select") {
    return (
      <div>
        <Label htmlFor={inputId}>{question.label}</Label>
        <Select
          value={(value as string) ?? ""}
          onValueChange={(v) => onUpdate({ [fieldId]: v } as Partial<AssessmentAnswers>)}
        >
          <SelectTrigger id={inputId} aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : undefined}>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>}
      </div>
    );
  }

  if (question.inputType === "radio") {
    return (
      <div>
        <Label>{question.label}</Label>
        <RadioGroup
          value={(value as string) ?? ""}
          onValueChange={(v) => onUpdate({ [fieldId]: v } as Partial<AssessmentAnswers>)}
          className="mt-4 space-y-3"
          aria-invalid={!!error}
        >
          {question.options?.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/40 focus-within:border-primary/60"
            >
              <RadioGroupItem value={opt.value} className="mt-1" aria-label={opt.label} />
              <div>
                <span className="font-medium normal-case">{opt.label}</span>
                {opt.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{opt.description}</p>
                )}
              </div>
            </label>
          ))}
        </RadioGroup>
        {error && <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>}
      </div>
    );
  }

  if (question.inputType === "boolean") {
    const boolVal = value as boolean | null;
    return (
      <div>
        <Label>{question.label}</Label>
        <RadioGroup
          value={boolVal === null ? "" : boolVal ? "yes" : "no"}
          onValueChange={(v) => onUpdate({ [fieldId]: v === "yes" } as Partial<AssessmentAnswers>)}
          className="mt-4 flex flex-wrap gap-4"
          aria-invalid={!!error}
        >
          <label className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50">
            <RadioGroupItem value="yes" aria-label="Yes" /> Yes
          </label>
          <label className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50">
            <RadioGroupItem value="no" aria-label="No" /> No
          </label>
        </RadioGroup>
        {error && <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>}
      </div>
    );
  }

  if (question.inputType === "creditScore") {
    return (
      <div>
        <Label htmlFor={inputId}>{question.label}</Label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Input
            id={inputId}
            type="number"
            placeholder={question.placeholder}
            value={answers.creditScore === "unknown" ? "" : (answers.creditScore ?? "")}
            onChange={(e) =>
              onUpdate({
                creditScore: e.target.value ? Number(e.target.value) : null,
              })
            }
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className="flex-1"
            min={question.min}
            max={question.max}
          />
          <Button
            variant={answers.creditScore === "unknown" ? "default" : "outline"}
            type="button"
            onClick={() => onUpdate({ creditScore: "unknown" })}
            className="shrink-0"
            aria-pressed={answers.creditScore === "unknown"}
          >
            I don&apos;t know
          </Button>
        </div>
        {error && <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>}
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor={inputId}>{question.label}</Label>
      <Input
        id={inputId}
        type="number"
        placeholder={question.placeholder}
        step={question.step}
        min={question.min}
        max={question.max}
        value={(value as number | null) ?? ""}
        onChange={(e) =>
          onUpdate({
            [fieldId]: e.target.value ? Number(e.target.value) : null,
          } as Partial<AssessmentAnswers>)
        }
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className="mt-3"
      />
      {error && <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>}
    </div>
  );
}
