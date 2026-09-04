import { describe, it, expect } from "vitest";
import { computeLoanCapacity } from "@/domain/calculations/loanCapacity";
import { SAFE_FOIR_CAPS, LENDER_FOIR_CAPS } from "@/domain/rules/affordability.rules";

describe("loanCapacity / FOIR engine", () => {
  it("computes lender and safe ceilings for salaried", () => {
    const result = computeLoanCapacity({
      employmentType: "salaried",
      netMonthlyIncome: 80_000,
      existingMonthlyEmis: 10_000,
      annualRatePercent: 11.5,
      tenureMonths: 36,
    });

    expect(result.lenderMaxFoirPercent).toBe(LENDER_FOIR_CAPS.salaried);
    expect(result.safeMaxFoirPercent).toBe(SAFE_FOIR_CAPS.salaried);
    expect(result.safeMaxAmount).toBeLessThan(result.lenderMaxAmount);
    // Expected range: safe EMI ~22k, lender EMI ~34k → safe amount ~6-8L at 11.5%
    expect(result.safeMaxAmount).toBeGreaterThan(500_000);
    expect(result.safeMaxAmount).toBeLessThan(900_000);
  });

  it("reduces safe ceiling with upcoming expenses", () => {
    const base = computeLoanCapacity({
      employmentType: "salaried",
      netMonthlyIncome: 80_000,
      existingMonthlyEmis: 10_000,
      annualRatePercent: 11.5,
      tenureMonths: 36,
    });
    const reduced = computeLoanCapacity({
      employmentType: "salaried",
      netMonthlyIncome: 80_000,
      existingMonthlyEmis: 10_000,
      annualRatePercent: 11.5,
      tenureMonths: 36,
      upcomingLargeExpenses: 120_000,
    });
    expect(reduced.safeMaxAmount).toBeLessThan(base.safeMaxAmount);
  });
});
