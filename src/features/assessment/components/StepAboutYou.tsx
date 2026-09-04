"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAssessment } from "@/state/AssessmentProvider";
import type { EmploymentType } from "@/types/assessment";

const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string; desc: string }[] = [
  { value: "salaried", label: "Salaried", desc: "Fixed monthly salary from employer" },
  { value: "self-employed", label: "Self-employed", desc: "Business owner or professional" },
  { value: "informal", label: "Informal / Gig", desc: "Platform work, cash income, freelance" },
];

export function StepAboutYou() {
  const { answers, updateAnswers } = useAssessment();

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="age">Your age</Label>
        <Input
          id="age"
          type="number"
          placeholder="e.g. 32"
          value={answers.age ?? ""}
          onChange={(e) =>
            updateAnswers({ age: e.target.value ? Number(e.target.value) : null })
          }
        />
      </div>

      <div>
        <Label>Employment type</Label>
        <RadioGroup
          value={answers.employmentType ?? ""}
          onValueChange={(v) => updateAnswers({ employmentType: v as EmploymentType })}
          className="mt-3"
        >
          {EMPLOYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
            >
              <RadioGroupItem value={opt.value} className="mt-1" />
              <div>
                <span className="font-medium">{opt.label}</span>
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
