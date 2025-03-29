
import { ReactNode } from "react";

// Define the loan type data structure
export interface LoanTypeInfo {
  name: string;
  icon: ReactNode;
  benefits: string[];
  eligibility: string[];
}

// Loan types record type
export type LoanTypes = Record<string, LoanTypeInfo>;
