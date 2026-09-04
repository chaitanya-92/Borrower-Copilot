import { describe, it, expect } from "vitest";
import { getVerdict } from "@/domain/rules/verdict.rules";

describe("verdict rules", () => {
  it("returns Borrow when EMI within safe ceiling", () => {
    const result = getVerdict({
      requestedEmi: 10_000,
      safeMaxEmi: 15_000,
      lenderMaxEmi: 25_000,
      safeMaxAmount: 400_000,
      recentBouncedPayment: false,
      hasHighCostDebt: false,
      incomeNegativeShock: false,
    });
    expect(result.verdict).toBe("borrow");
  });

  it("returns Borrow less when between safe and lender ceiling", () => {
    const result = getVerdict({
      requestedEmi: 20_000,
      safeMaxEmi: 15_000,
      lenderMaxEmi: 25_000,
      safeMaxAmount: 400_000,
      recentBouncedPayment: false,
      hasHighCostDebt: false,
      incomeNegativeShock: false,
    });
    expect(result.verdict).toBe("borrow-less");
    expect(result.recommendedAmount).toBe(400_000);
  });

  it("forces Don't borrow on distress override (all three signals)", () => {
    const result = getVerdict({
      requestedEmi: 5_000,
      safeMaxEmi: 20_000,
      lenderMaxEmi: 30_000,
      safeMaxAmount: 500_000,
      recentBouncedPayment: true,
      hasHighCostDebt: true,
      incomeNegativeShock: true,
    });
    expect(result.verdict).toBe("dont-borrow");
  });

  it("does NOT force distress on single bounce alone", () => {
    const result = getVerdict({
      requestedEmi: 10_000,
      safeMaxEmi: 15_000,
      lenderMaxEmi: 25_000,
      safeMaxAmount: 400_000,
      recentBouncedPayment: true,
      hasHighCostDebt: false,
      incomeNegativeShock: false,
    });
    expect(result.verdict).toBe("borrow");
  });
});
