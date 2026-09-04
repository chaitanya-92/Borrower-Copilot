"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAssessment } from "@/state/AssessmentProvider";

export function StepOptional() {
  const { answers, updateAnswers, skipField } = useAssessment();

  return (
    <div className="space-y-8">
      <p className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
        Optional — improves accuracy. Skipping widens ranges and lowers confidence.
      </p>

      <div>
        <div className="flex items-center justify-between">
          <Label>Past bounced payments?</Label>
          <Button variant="ghost" size="sm" type="button" onClick={() => skipField("pastBouncedPayments")}>
            Skip
          </Button>
        </div>
        <RadioGroup
          value={answers.pastBouncedPayments === null ? "" : answers.pastBouncedPayments ? "yes" : "no"}
          onValueChange={(v) => updateAnswers({ pastBouncedPayments: v === "yes" })}
          className="mt-2 flex gap-4"
        >
          <label className="flex items-center gap-2"><RadioGroupItem value="yes" /> Yes</label>
          <label className="flex items-center gap-2"><RadioGroupItem value="no" /> No</label>
        </RadioGroup>
        <p className="mt-1 text-xs text-muted-foreground">Feeds distress-override rule.</p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="util">Credit card utilization (%)</Label>
          <Button variant="ghost" size="sm" type="button" onClick={() => skipField("cardUtilizationPercent")}>
            Skip
          </Button>
        </div>
        <Input
          id="util"
          type="number"
          placeholder="e.g. 40"
          value={answers.cardUtilizationPercent ?? ""}
          onChange={(e) =>
            updateAnswers({
              cardUtilizationPercent: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">Narrows your interest rate estimate.</p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="upcoming">Upcoming large expenses (₹)</Label>
          <Button variant="ghost" size="sm" type="button" onClick={() => skipField("upcomingLargeExpenses")}>
            Skip
          </Button>
        </div>
        <Input
          id="upcoming"
          type="number"
          placeholder="Wedding, medical, etc."
          value={answers.upcomingLargeExpenses ?? ""}
          onChange={(e) =>
            updateAnswers({
              upcomingLargeExpenses: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">Reduces your safe EMI ceiling.</p>
      </div>

      {answers.employmentType === "self-employed" && (
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="return">Expected monthly return from loan (₹)</Label>
            <Button variant="ghost" size="sm" type="button" onClick={() => skipField("loanProductivityReturn")}>
              Skip
            </Button>
          </div>
          <Input
            id="return"
            type="number"
            value={answers.loanProductivityReturn ?? ""}
            onChange={(e) =>
              updateAnswers({
                loanProductivityReturn: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
      )}

      <div className="border-t border-border pt-6">
        <p className="mb-4 font-display text-sm font-bold uppercase text-primary">
          Lender offer (optional)
        </p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="offerRate">Offer rate (% p.a.)</Label>
            <Input
              id="offerRate"
              type="number"
              step="0.1"
              value={answers.lenderOfferRate ?? ""}
              onChange={(e) =>
                updateAnswers({ lenderOfferRate: e.target.value ? Number(e.target.value) : null })
              }
            />
          </div>
          <div>
            <Label htmlFor="offerAmount">Offer amount (₹)</Label>
            <Input
              id="offerAmount"
              type="number"
              value={answers.lenderOfferAmount ?? ""}
              onChange={(e) =>
                updateAnswers({
                  lenderOfferAmount: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="offerTenure">Offer tenure (months)</Label>
            <Input
              id="offerTenure"
              type="number"
              value={answers.lenderOfferTenureMonths ?? ""}
              onChange={(e) =>
                updateAnswers({
                  lenderOfferTenureMonths: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Powers side-by-side comparison on your Negotiation Card.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Recent income shock (job loss / co-earner loss)?</Label>
          <Button variant="ghost" size="sm" type="button" onClick={() => skipField("incomeNegativeShock")}>
            Skip
          </Button>
        </div>
        <RadioGroup
          value={answers.incomeNegativeShock === null ? "" : answers.incomeNegativeShock ? "yes" : "no"}
          onValueChange={(v) => updateAnswers({ incomeNegativeShock: v === "yes" })}
          className="mt-2 flex gap-4"
        >
          <label className="flex items-center gap-2"><RadioGroupItem value="yes" /> Yes</label>
          <label className="flex items-center gap-2"><RadioGroupItem value="no" /> No</label>
        </RadioGroup>
      </div>
    </div>
  );
}
