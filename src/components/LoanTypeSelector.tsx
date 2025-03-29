
import React, { useState } from "react";
import { 
  Collapsible, 
  CollapsibleContent
} from "@/components/ui/collapsible";
import { loanTypes } from "./loan-selector/loan-types-data";
import LoanTypeDropdown from "./loan-selector/LoanTypeDropdown";
import LoanTypeDetails from "./loan-selector/LoanTypeDetails";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoanTypeSelector: React.FC = () => {
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

      <Button 
        variant="default" 
        className="w-full mt-3 mb-1 bg-mortgage-secondary hover:bg-mortgage-secondary/90 text-white font-medium py-2 flex items-center justify-center gap-2 shadow-sm"
        onClick={() => navigate('/contact-us')}
      >
        <MessageCircle className="h-5 w-5" />
        Not Sure? Talk to us!
      </Button>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {selectedLoan && <LoanTypeDetails loanInfo={selectedLoan} />}
      </Collapsible>
    </div>
  );
};

export default LoanTypeSelector;
