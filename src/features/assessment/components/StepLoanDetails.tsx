"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssessment } from "@/state/AssessmentProvider";
import { LOAN_PRODUCTS } from "@/features/lending/catalog";
import type { LoanPurpose } from "@/types/assessment";

const PURPOSES: { value: LoanPurpose; label: string }[] = [
  { value: "personal", label: "Personal expenses" },
  { value: "home-renovation", label: "Home renovation" },
  { value: "business", label: "Business" },
  { value: "education", label: "Education" },
  { value: "medical", label: "Medical" },
  { value: "debt-consolidation", label: "Debt consolidation" },
  { value: "other", label: "Other" },
];

export function StepLoanDetails() {
  const { answers, updateAnswers } = useAssessment();

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="purpose">Loan purpose</Label>
        <Select
          value={answers.loanPurpose ?? ""}
          onValueChange={(v) => updateAnswers({ loanPurpose: v as LoanPurpose })}
        >
          <SelectTrigger id="purpose">
            <SelectValue placeholder="Select purpose" />
          </SelectTrigger>
          <SelectContent>
            {PURPOSES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="amount">Amount wanted (₹)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="e.g. 500000"
          value={answers.amountWanted ?? ""}
          onChange={(e) =>
            updateAnswers({ amountWanted: e.target.value ? Number(e.target.value) : null })
          }
        />
      </div>

      <div>
        <Label htmlFor="product">Product type</Label>
        <Select
          value={answers.loanProductType ?? ""}
          onValueChange={(v) =>
            updateAnswers({ loanProductType: v as typeof answers.loanProductType })
          }
        >
          <SelectTrigger id="product">
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {LOAN_PRODUCTS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
