"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/state/AssessmentProvider";
import { priyaFixture, raviFixture, anitaFixture } from "./fixtures";

export function DemoModePicker() {
  const { loadFixture } = useAssessment();

  return (
    <div className="mt-8 rounded-lg border border-border p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Demo mode</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/assessment" onClick={() => loadFixture(priyaFixture)}>
            Priya (salaried)
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/assessment" onClick={() => loadFixture(raviFixture)}>
            Ravi (self-employed)
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/assessment" onClick={() => loadFixture(anitaFixture)}>
            Anita (informal)
          </Link>
        </Button>
      </div>
    </div>
  );
}
