import { describe, it, expect } from "vitest";
import { calculateEmi, maxPrincipalForEmi, compareTenures } from "@/domain/calculations/emi";

describe("emi calculations", () => {
  it("calculates standard reducing-balance EMI", () => {
    const emi = calculateEmi(500_000, 12, 36);
    expect(emi).toBeGreaterThan(16_000);
    expect(emi).toBeLessThan(17_000);
  });

  it("maxPrincipalForEmi inverts correctly", () => {
    const emi = calculateEmi(400_000, 11.5, 36);
    const maxP = maxPrincipalForEmi(emi, 11.5, 36);
    expect(maxP).toBeCloseTo(400_000, -2);
  });

  it("compareTenures returns rows for each tenure", () => {
    const rows = compareTenures(300_000, 12, [12, 24, 36], 15_000);
    expect(rows).toHaveLength(3);
    expect(rows[0].emi).toBeGreaterThan(rows[2].emi);
  });
});
