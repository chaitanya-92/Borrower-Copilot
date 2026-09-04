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
import type { IncomeStability } from "@/types/assessment";

export function StepIncome() {
  const { answers, updateAnswers } = useAssessment();
  const emp = answers.employmentType;

  if (!emp) {
    return <p className="text-muted-foreground">Select employment type in the previous step.</p>;
  }

  if (emp === "salaried") {
    return (
      <div className="space-y-8">
        <div>
          <Label htmlFor="income">Net monthly income (₹)</Label>
          <Input
            id="income"
            type="number"
            placeholder="Take-home after tax"
            value={answers.netMonthlyIncome ?? ""}
            onChange={(e) =>
              updateAnswers({
                netMonthlyIncome: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="tenure">Employer tenure (months)</Label>
          <Input
            id="tenure"
            type="number"
            placeholder="e.g. 24"
            value={answers.employerTenureMonths ?? ""}
            onChange={(e) =>
              updateAnswers({
                employerTenureMonths: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <div>
          <Label>Income stability</Label>
          <Select
            value={answers.incomeStability ?? ""}
            onValueChange={(v) =>
              updateAnswers({ incomeStability: v as IncomeStability })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Fixed vs variable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Mostly fixed</SelectItem>
              <SelectItem value="variable">Mostly variable</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if (emp === "self-employed") {
    return (
      <div className="space-y-8">
        <div>
          <Label htmlFor="itr">ITR / filed monthly income (₹)</Label>
          <Input
            id="itr"
            type="number"
            placeholder="Verifiable income from ITR"
            value={answers.itrIncome ?? ""}
            onChange={(e) =>
              updateAnswers({ itrIncome: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>
        <div>
          <Label htmlFor="cash">Cash income estimate (₹)</Label>
          <Input
            id="cash"
            type="number"
            placeholder="Unverifiable cash component"
            value={answers.cashIncomeEstimate ?? ""}
            onChange={(e) =>
              updateAnswers({
                cashIncomeEstimate: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
          <p className="mt-1 text-xs text-muted-foreground">
            We use ITR income for capacity math when both are provided.
          </p>
        </div>
        <div>
          <Label htmlFor="years">Years in business</Label>
          <Input
            id="years"
            type="number"
            placeholder="e.g. 5"
            value={answers.yearsInBusiness ?? ""}
            onChange={(e) =>
              updateAnswers({
                yearsInBusiness: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min">Min monthly income (₹)</Label>
          <Input
            id="min"
            type="number"
            value={answers.incomeMin ?? ""}
            onChange={(e) =>
              updateAnswers({ incomeMin: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>
        <div>
          <Label htmlFor="max">Max monthly income (₹)</Label>
          <Input
            id="max"
            type="number"
            value={answers.incomeMax ?? ""}
            onChange={(e) =>
              updateAnswers({ incomeMax: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>
      </div>
      <div>
        <Label htmlFor="platforms">Income source count</Label>
        <Input
          id="platforms"
          type="number"
          placeholder="Number of platforms/sources"
          value={answers.platformSourceCount ?? ""}
          onChange={(e) =>
            updateAnswers({
              platformSourceCount: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      </div>
    </div>
  );
}
