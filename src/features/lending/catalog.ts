import type { LoanProductType } from "@/types/assessment";

export interface LoanProduct {
  id: LoanProductType;
  label: string;
  description: string;
}

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: "unsecured-pl",
    label: "Personal Loan",
    description: "Unsecured — no collateral required",
  },
  {
    id: "secured-lap",
    label: "Loan Against Property",
    description: "Secured by residential/commercial property",
  },
  {
    id: "gold-loan",
    label: "Gold Loan",
    description: "Secured by gold ornaments",
  },
  {
    id: "business-loan",
    label: "Business Loan",
    description: "For business expansion or working capital",
  },
];

export function getProductLabel(id: LoanProductType): string {
  return LOAN_PRODUCTS.find((p) => p.id === id)?.label ?? id;
}
