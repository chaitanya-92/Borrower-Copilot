import { calculateEmi } from "./emi";

export interface AprInput {
  principal: number;
  nominalAnnualRatePercent: number;
  tenureMonths: number;
  processingFeePercent?: number;
  otherUpfrontCharges?: number;
}

/**
 * Compute all-in APR via bisection: find flat annual rate where
 * PV of EMI stream equals net disbursed amount.
 */
export function computeApr(input: AprInput): number {
  const {
    principal,
    nominalAnnualRatePercent,
    tenureMonths,
    processingFeePercent = 0,
    otherUpfrontCharges = 0,
  } = input;

  const processingFee = (principal * processingFeePercent) / 100;
  const netDisbursed = principal - processingFee - otherUpfrontCharges;

  if (netDisbursed <= 0 || tenureMonths <= 0) return nominalAnnualRatePercent;

  const emi = calculateEmi(principal, nominalAnnualRatePercent, tenureMonths);

  let low = 0;
  let high = 100;

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const pv = presentValueOfEmiStream(emi, mid, tenureMonths);

    if (pv > netDisbursed) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.round(((low + high) / 2) * 100) / 100;
}

function presentValueOfEmiStream(
  emi: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  const r = annualRatePercent / 12 / 100;
  if (r <= 0) return emi * tenureMonths;

  let pv = 0;
  for (let month = 1; month <= tenureMonths; month++) {
    pv += emi / Math.pow(1 + r, month);
  }
  return pv;
}

export function computeAprBand(
  minNominalRate: number,
  maxNominalRate: number,
  principal: number,
  tenureMonths: number,
  processingFeePercent?: number
): { minPercent: number; maxPercent: number } {
  return {
    minPercent: computeApr({
      principal,
      nominalAnnualRatePercent: minNominalRate,
      tenureMonths,
      processingFeePercent,
    }),
    maxPercent: computeApr({
      principal,
      nominalAnnualRatePercent: maxNominalRate,
      tenureMonths,
      processingFeePercent,
    }),
  };
}
