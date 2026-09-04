"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRateBand } from "@/lib/formatters/percentage";
import type { FairRateOutput } from "@/types/assessment";
import { getProductLabel } from "@/features/lending/catalog";

export function FairRateCard({ fairRate }: { fairRate: FairRateOutput }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>O3 — Fair Rate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Nominal rate band</p>
          <p className="font-display text-3xl font-bold text-primary text-glow">
            {formatRateBand(
              fairRate.nominalRateBand.minPercent,
              fairRate.nominalRateBand.maxPercent
            )}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">All-in APR (incl. fees)</p>
          <p className="text-xl font-medium">
            {formatRateBand(fairRate.aprBand.minPercent, fairRate.aprBand.maxPercent)}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{fairRate.whyThisBand}</p>
        <p className="text-xs text-muted-foreground">
          Routed product: {getProductLabel(fairRate.routedProduct)}
        </p>
      </CardContent>
    </Card>
  );
}
