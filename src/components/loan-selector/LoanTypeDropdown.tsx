
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Building, Home, Banknote, Users, X } from "lucide-react";

interface LoanTypeDropdownProps {
  value: string | null;
  onChange: (value: string) => void;
}

const LoanTypeDropdown: React.FC<LoanTypeDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="loan-type" className="block text-lg font-semibold mb-2 text-gray-900">
        Loan Assistance Programs
      </label>
      <Select onValueChange={onChange} value={value || ""}>
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
  );
};

export default LoanTypeDropdown;
