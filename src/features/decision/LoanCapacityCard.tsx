"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters/currency";
import type { LoanCapacityOutput } from "@/types/assessment";

export function LoanCapacityCard({ capacity }: { capacity: LoanCapacityOutput }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>O2 — Loan Capacity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs uppercase text-muted-foreground">Lender max</p>
            <p className="font-display text-2xl font-bold">
              {formatCurrency(capacity.lenderMaxAmount)}
            </p>
            <p className="text-sm text-muted-foreground">
              EMI room: {formatCurrency(capacity.lenderMaxEmi)}
            </p>
          </div>
          <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
            <p className="text-xs uppercase text-primary">Safe max ✓</p>
            <p className="font-display text-2xl font-bold text-primary text-glow">
              {formatCurrency(capacity.safeMaxAmount)}
            </p>
            <p className="text-sm text-muted-foreground">
              EMI room: {formatCurrency(capacity.safeMaxEmi)}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{capacity.recommendation}</p>
      </CardContent>
    </Card>
  );
}
