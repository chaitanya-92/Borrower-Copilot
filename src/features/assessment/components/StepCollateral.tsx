"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAssessment } from "@/state/AssessmentProvider";

export function StepCollateral() {
  const { answers, updateAnswers } = useAssessment();

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        For large self-employed loans, collateral may unlock better rates via secured products.
      </p>

      <div>
        <Label>Do you own unencumbered property or collateral?</Label>
        <RadioGroup
          value={answers.ownsCollateral === null ? "" : answers.ownsCollateral ? "yes" : "no"}
          onValueChange={(v) => updateAnswers({ ownsCollateral: v === "yes" })}
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

      {answers.ownsCollateral && (
        <div>
          <Label htmlFor="collateral">Estimated collateral value (₹)</Label>
          <Input
            id="collateral"
            type="number"
            placeholder="e.g. 2500000"
            value={answers.collateralValue ?? ""}
            onChange={(e) =>
              updateAnswers({
                collateralValue: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
      )}
    </div>
  );
}
