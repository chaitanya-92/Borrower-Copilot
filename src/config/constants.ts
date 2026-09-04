export const DEFAULT_TENURE_MONTHS = 36;
export const LARGE_LOAN_THRESHOLD = 500_000;
export const HIGH_COST_DEBT_APR_THRESHOLD = 24;
export const STRESS_INCOME_DROP_PERCENT = 15;
export const STRESS_RATE_RISE_POINTS = 2;
export const DEFAULT_PROCESSING_FEE_PERCENT = 1;
export const TENURE_OPTIONS_MONTHS = [12, 24, 36, 48, 60] as const;
/** Reserve kept from monthly income beyond household expenses for borrower safety */
export const BORROWER_SAFETY_BUFFER_PERCENT = 10;
