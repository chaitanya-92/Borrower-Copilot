"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/state/AssessmentProvider";

function YesNoField({
  label,
  value,
  onChange,
  onSkip,
  field,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  onSkip: () => void;
  field: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button variant="ghost" size="sm" type="button" onClick={onSkip}>
          Skip
        </Button>
      </div>
      <RadioGroup
        value={value === null ? "" : value ? "yes" : "no"}
        onValueChange={(v) => onChange(v === "yes")}
        className="mt-2 flex gap-4"
      >
        <label className="flex items-center gap-2">
          <RadioGroupItem value="yes" /> Yes
        </label>
        <label className="flex items-center gap-2">
          <RadioGroupItem value="no" /> No
        </label>
      </RadioGroup>
    </div>
  );
}

export function StepObligations() {
  const { answers, updateAnswers, skipField } = useAssessment();

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="emis">Existing monthly EMIs total (₹)</Label>
        <Input
          id="emis"
          type="number"
          placeholder="All loan EMIs combined"
          value={answers.existingMonthlyEmis ?? ""}
          onChange={(e) =>
            updateAnswers({
              existingMonthlyEmis: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      </div>

      {answers.employmentType === "informal" && (
        <>
          <YesNoField
            label="Any high-cost debt (>24% APR)?"
            value={answers.hasHighCostDebt}
            onChange={(v) => updateAnswers({ hasHighCostDebt: v })}
            onSkip={() => skipField("hasHighCostDebt")}
            field="hasHighCostDebt"
          />
          <YesNoField
            label="Bounced payments in last 6 months?"
            value={answers.bouncedPaymentsLast6Months}
            onChange={(v) => updateAnswers({ bouncedPaymentsLast6Months: v })}
            onSkip={() => skipField("bouncedPaymentsLast6Months")}
            field="bouncedPaymentsLast6Months"
          />
        </>
      )}

      <div>
        <Label htmlFor="credit">Credit score</Label>
        <div className="mt-2 flex gap-3">
          <Input
            id="credit"
            type="number"
            placeholder="e.g. 780"
            value={answers.creditScore === "unknown" ? "" : (answers.creditScore ?? "")}
            onChange={(e) =>
              updateAnswers({
                creditScore: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="flex-1"
          />
          <Button
            variant={answers.creditScore === "unknown" ? "default" : "outline"}
            type="button"
            onClick={() => updateAnswers({ creditScore: "unknown" })}
          >
            I don&apos;t know
          </Button>
        </div>
      </div>
    </div>
  );
}
