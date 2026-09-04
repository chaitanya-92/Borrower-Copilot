"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/state/AssessmentProvider";

export function StepHousehold() {
  const { answers, updateAnswers, skipField } = useAssessment();

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="expenses">Monthly household expenses (₹)</Label>
        <Input
          id="expenses"
          type="number"
          placeholder="Rent, food, utilities, etc."
          value={answers.monthlyHouseholdExpenses ?? ""}
          onChange={(e) =>
            updateAnswers({
              monthlyHouseholdExpenses: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      </div>

      <div>
        <Label htmlFor="dependents">Dependents</Label>
        <Input
          id="dependents"
          type="number"
          placeholder="e.g. 2"
          value={answers.dependents ?? ""}
          onChange={(e) =>
            updateAnswers({ dependents: e.target.value ? Number(e.target.value) : null })
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="savings">Emergency savings (months of expenses)</Label>
          <Button variant="ghost" size="sm" type="button" onClick={() => skipField("emergencySavingsMonths")}>
            Skip
          </Button>
        </div>
        <Input
          id="savings"
          type="number"
          placeholder="e.g. 3"
          value={answers.emergencySavingsMonths ?? ""}
          onChange={(e) =>
            updateAnswers({
              emergencySavingsMonths: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Narrows your safe FOIR cap and confidence score.
        </p>
      </div>
    </div>
  );
}
