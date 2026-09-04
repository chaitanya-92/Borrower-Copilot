"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VerdictOutput } from "@/types/assessment";

const VERDICT_LABELS = {
  borrow: "Borrow",
  "borrow-less": "Borrow Less",
  "dont-borrow": "Don't Borrow",
} as const;

const VERDICT_VARIANTS = {
  borrow: "success" as const,
  "borrow-less": "warning" as const,
  "dont-borrow": "destructive" as const,
};

export function VerdictCard({ verdict }: { verdict: VerdictOutput }) {
  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          O1 — Verdict
          <Badge variant={VERDICT_VARIANTS[verdict.verdict]}>
            {VERDICT_LABELS[verdict.verdict]}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{verdict.reason}</p>
        {verdict.recommendedAmount != null && (
          <p className="mt-3 text-primary font-medium">
            Recommended amount: ₹{verdict.recommendedAmount.toLocaleString("en-IN")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
