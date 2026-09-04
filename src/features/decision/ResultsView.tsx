"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useAssessment } from "@/state/AssessmentProvider";
import { VerdictCard } from "@/features/decision/VerdictCard";
import { LoanCapacityCard } from "@/features/decision/LoanCapacityCard";
import { FairRateCard } from "@/features/decision/FairRateCard";
import { EmiCard } from "@/features/decision/EmiCard";
import { ConfidenceBadge, NegotiationCard } from "@/features/negotiation/NegotiationCard";

export function ResultsView() {
  const router = useRouter();
  const { results, computeResults, resetAssessment } = useAssessment();

  useEffect(() => {
    if (!results) computeResults();
  }, [results, computeResults]);

  if (!results) {
    return (
      <PageContainer>
        <EmptyState
          title="No results yet"
          description="Complete the assessment to see your borrowing guidance."
          actionLabel="Start Assessment"
          onAction={() => router.push("/assessment")}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h1 className="font-display text-3xl font-bold">Your Results</h1>
          <p className="mt-1 text-muted-foreground">
            Four answers before you walk into the lender.
          </p>
        </div>
        <ConfidenceBadge level={results.confidence} />
      </div>

      <VerdictCard verdict={results.verdict} />
      <LoanCapacityCard capacity={results.loanCapacity} />
      <FairRateCard fairRate={results.fairRate} />
      <EmiCard emi={results.emi} />
      <NegotiationCard data={results.negotiationCard} />

      <div className="flex flex-wrap gap-4 no-print pt-4">
        <Button onClick={() => window.print()}>Print Negotiation Card</Button>
        <Button variant="secondary" asChild>
          <Link href="/assessment">Edit Answers</Link>
        </Button>
        <Button variant="outline" onClick={() => { resetAssessment(); router.push("/"); }}>
          Start Over
        </Button>
      </div>
    </PageContainer>
  );
}
