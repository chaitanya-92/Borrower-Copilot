import { describe, it, expect } from "vitest";
import { runEngine } from "@/domain/engine";
import { priyaFixture } from "../fixtures/priya";
import { raviFixture } from "../fixtures/ravi";
import { anitaFixture, anitaDistressFixture } from "../fixtures/anita";

describe("engine integration", () => {
  it("Priya (salaried, prime) — expect Borrow verdict, high capacity", () => {
    const out = runEngine({ answers: priyaFixture });
    // Expected: comfortable borrow, safe max ~6-9L, rate band 10.5-12.5%
    expect(out.verdict.verdict).toBe("borrow");
    expect(out.loanCapacity.safeMaxAmount).toBeGreaterThan(500_000);
    expect(out.fairRate.nominalRateBand.minPercent).toBeGreaterThanOrEqual(10.5);
    expect(out.fairRate.nominalRateBand.maxPercent).toBeLessThanOrEqual(12.5);
    expect(out.confidence).toMatch(/high|medium/);
  });

  it("Ravi (self-employed, large loan) — routes to secured LAP", () => {
    const out = runEngine({ answers: raviFixture });
    // Expected: secured routing, ITR income used (~95k), borrow-less or borrow
    expect(out.fairRate.routedProduct).toBe("secured-lap");
    expect(out.loanCapacity.safeMaxAmount).toBeGreaterThan(250_000);
    expect(out.fairRate.nominalRateBand.minPercent).toBeLessThanOrEqual(11);
  });

  it("Anita (informal) — wider rate band, unknown score", () => {
    const out = runEngine({ answers: anitaFixture });
    // Expected: informal band 14-20%, stretch or borrow-less likely
    expect(out.fairRate.nominalRateBand.minPercent).toBeGreaterThanOrEqual(14);
    expect(["borrow-less", "dont-borrow", "borrow"]).toContain(out.verdict.verdict);
    expect(out.negotiationCard.lenderOfferComparison?.hasOffer).toBe(true);
  });

  it("Anita distress — forced don't borrow", () => {
    const out = runEngine({ answers: anitaDistressFixture });
    expect(out.verdict.verdict).toBe("dont-borrow");
  });
});
