
import React, { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Building, Home, Banknote, Users, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Define the loan type data structure
interface LoanTypeInfo {
  name: string;
  icon: React.ReactNode;
  benefits: string[];
  eligibility: string[];
}

// Loan type information data
const loanTypes: Record<string, LoanTypeInfo> = {
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

const LoanTypeSelector: React.FC = () => {
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleLoanTypeChange = (value: string) => {
    // If the value is "none", set selectedLoanType to null
    if (value === "none") {
      setSelectedLoanType(null);
      setIsOpen(false);
      return;
    }
    
    setSelectedLoanType(value);
    setIsOpen(!!value);
  };

  const selectedLoan = selectedLoanType ? loanTypes[selectedLoanType] : null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="mb-4">
        <label htmlFor="loan-type" className="block text-sm font-medium mb-1 text-gray-700">
          Loan Assistance Programs
        </label>
        <Select onValueChange={handleLoanTypeChange} value={selectedLoanType || ""}>
          <SelectTrigger id="loan-type" className="w-full" aria-label="Select loan type">
            <SelectValue placeholder="Select loan type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <div className="flex items-center">
                <X className="h-4 w-4 mr-2 text-gray-500" />
                <span>None / Clear selection</span>
              </div>
            </SelectItem>
            <SelectItem value="va">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-mortgage-primary" />
                <span>VA Loans (For Military Veterans & Active Service Members)</span>
              </div>
            </SelectItem>
            <SelectItem value="fha">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2 text-mortgage-primary" />
                <span>FHA Loans (For First-Time and Low-Income Buyers)</span>
              </div>
            </SelectItem>
            <SelectItem value="usda">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-mortgage-primary" />
                <span>USDA Loans (For Rural and Suburban Homebuyers)</span>
              </div>
            </SelectItem>
            <SelectItem value="conventional">
              <div className="flex items-center">
                <Banknote className="h-4 w-4 mr-2 text-mortgage-primary" />
                <span>Conventional Loans (For Buyers with Good Credit & Savings)</span>
              </div>
            </SelectItem>
            <SelectItem value="firstTime">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-mortgage-primary" />
                <span>First-Time Homebuyer Programs (Various Assistance Programs)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {selectedLoan && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2">
              {selectedLoan.icon}
              <h3 className="text-lg font-semibold">{selectedLoan.name}</h3>
            </div>
            
            <Card className="mb-3">
              <CardContent className="pt-6">
                <h4 className="text-md font-medium mb-2 text-mortgage-primary">Benefits</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedLoan.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-md font-medium mb-2 text-mortgage-primary">Eligibility</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedLoan.eligibility.map((criterion, index) => (
                    <li key={index} className="text-sm text-gray-700">{criterion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </Collapsible>
    </div>
  );
};

export default LoanTypeSelector;
