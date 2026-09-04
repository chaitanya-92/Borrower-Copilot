"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatRateBand } from "@/lib/formatters/percentage";
import type { ConfidenceLevel, NegotiationCardOutput } from "@/types/assessment";

const CONFIDENCE_VARIANTS: Record<
  ConfidenceLevel,
  "success" | "warning" | "destructive"
> = {
  high: "success",
  medium: "warning",
  low: "destructive",
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return (
    <Badge variant={CONFIDENCE_VARIANTS[level]} className="text-sm">
      {level} confidence
    </Badge>
  );
}

export function NegotiationCard({ data }: { data: NegotiationCardOutput }) {
  return (
    <Card className="border-2 border-primary print:border-black">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Negotiation Card
          <span className="text-xs font-normal normal-case text-muted-foreground">
            Print & share with lender
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Fair rate</p>
            <p className="font-display text-lg font-bold text-primary">
              {formatRateBand(data.fairRateBand.minPercent, data.fairRateBand.maxPercent)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Safe EMI</p>
            <p className="font-display text-lg font-bold">
              {formatCurrency(data.safeEmiCeiling)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Safe amount</p>
            <p className="font-display text-lg font-bold">
              {formatCurrency(data.safeLoanAmount)}
            </p>
          </div>
        </div>

        {data.lenderOfferComparison?.hasOffer && (
          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 font-display text-sm font-bold uppercase">Offer comparison</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Fair total interest</p>
                <p className="font-medium">
                  {formatCurrency(data.lenderOfferComparison.fairTotalInterest)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Offer total interest</p>
                <p className="font-medium">
                  {formatCurrency(data.lenderOfferComparison.offerTotalInterest)}
                </p>
              </div>
            </div>
            <p
              className={`mt-3 font-display text-lg font-bold ${
                data.lenderOfferComparison.savings > 0
                  ? "text-destructive"
                  : "text-primary"
              }`}
            >
              {data.lenderOfferComparison.savings > 0
                ? `Offer costs ${formatCurrency(data.lenderOfferComparison.savings)} more over loan life`
                : `Fair rate saves ${formatCurrency(Math.abs(data.lenderOfferComparison.savings))}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
