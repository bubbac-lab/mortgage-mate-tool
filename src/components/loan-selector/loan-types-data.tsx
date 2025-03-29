
import { Building, Home, Banknote, Users } from "lucide-react";
import { LoanTypes } from "./types";

// Loan type information data
export const loanTypes: LoanTypes = {
  va: {
    name: "VA Loans",
    icon: <Users className="h-5 w-5 text-mortgage-primary" />,
    benefits: [
      "No down payment required",
      "No private mortgage insurance (PMI)",
      "Competitive interest rates",
      "Easier qualification requirements"
    ],
    eligibility: [
      "Active-duty military, veterans, certain reservists, and National Guard members",
      "Surviving spouses (in some cases)"
    ]
  },
  fha: {
    name: "FHA Loans",
    icon: <Home className="h-5 w-5 text-mortgage-primary" />,
    benefits: [
      "Low down payment (as low as 3.5%)",
      "More flexible credit score requirements",
      "Can be used for first-time or repeat buyers"
    ],
    eligibility: [
      "Best for buyers with lower credit scores or limited savings for a down payment"
    ]
  },
  usda: {
    name: "USDA Loans",
    icon: <Building className="h-5 w-5 text-mortgage-primary" />,
    benefits: [
      "No down payment required",
      "Lower mortgage insurance costs",
      "Competitive interest rates"
    ],
    eligibility: [
      "Home must be in a designated rural or suburban area",
      "Income limits apply"
    ]
  },
  conventional: {
    name: "Conventional Loans",
    icon: <Banknote className="h-5 w-5 text-mortgage-primary" />,
    benefits: [
      "Available from banks, credit unions, and mortgage lenders",
      "Can be used for primary homes, second homes, and investment properties"
    ],
    eligibility: [
      "Typically requires a higher credit score (620+)",
      "Minimum down payment:",
      "• 3% for first-time homebuyers",
      "• 5-20% for others"
    ]
  },
  firstTime: {
    name: "First-Time Homebuyer Programs",
    icon: <Users className="h-5 w-5 text-mortgage-primary" />,
    benefits: [
      "Down payment assistance programs",
      "Tax credits",
      "Grants for homebuyers"
    ],
    eligibility: [
      "Varies by state and program"
    ]
  }
};
