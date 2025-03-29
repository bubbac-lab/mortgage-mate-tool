
import React, { useState } from "react";
import { 
  Collapsible, 
  CollapsibleContent
} from "@/components/ui/collapsible";
import { loanTypes } from "./loan-selector/loan-types-data";
import LoanTypeDropdown from "./loan-selector/LoanTypeDropdown";
import LoanTypeDetails from "./loan-selector/LoanTypeDetails";

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
      <LoanTypeDropdown 
        value={selectedLoanType} 
        onChange={handleLoanTypeChange} 
      />

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {selectedLoan && <LoanTypeDetails loanInfo={selectedLoan} />}
      </Collapsible>
    </div>
  );
};

export default LoanTypeSelector;
