"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters/currency";
import type { EmiOutput } from "@/types/assessment";

export function EmiCard({ emi }: { emi: EmiOutput }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>O4 — EMI Guidance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Recommended ceiling</p>
            <p className="font-display text-2xl font-bold text-primary">
              {formatCurrency(emi.recommendedEmiCeiling)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Your requested EMI</p>
            <p className="font-display text-2xl font-bold">
              {formatCurrency(emi.requestedEmi)}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase text-muted-foreground">Tenure trade-off</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-4">Tenure</th>
                  <th className="py-2 pr-4">EMI</th>
                  <th className="py-2 pr-4">Total interest</th>
                  <th className="py-2">Max loan (safe EMI)</th>
                </tr>
              </thead>
              <tbody>
                {emi.tenureComparisons.map((row) => (
                  <tr key={row.tenureMonths} className="border-b border-border/50">
                    <td className="py-2 pr-4">{row.tenureMonths} mo</td>
                    <td className="py-2 pr-4">{formatCurrency(row.emi)}</td>
                    <td className="py-2 pr-4">{formatCurrency(row.totalInterest)}</td>
                    <td className="py-2">{formatCurrency(row.maxLoanForSafeEmi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <p className="mb-2 text-xs uppercase text-muted-foreground">Stress test</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>If income drops 15%:</p>
              <p className="font-medium text-destructive">
                +{formatCurrency(Math.max(0, emi.stressTest.incomeDropDeltaEmi))} over safe ceiling
              </p>
            </div>
            <div>
              <p>If rate rises 2 pts:</p>
              <p className="font-medium text-destructive">
                +{formatCurrency(emi.stressTest.rateRiseDeltaEmi)} EMI
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
