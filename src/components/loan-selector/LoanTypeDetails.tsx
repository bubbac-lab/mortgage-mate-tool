
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LoanTypeInfo } from "./types";

interface LoanTypeDetailsProps {
  loanInfo: LoanTypeInfo;
}

const LoanTypeDetails: React.FC<LoanTypeDetailsProps> = ({ loanInfo }) => {
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2">
        {loanInfo.icon}
        <h3 className="text-lg font-semibold">{loanInfo.name}</h3>
      </div>
      
      <Card className="mb-3">
        <CardContent className="pt-6">
          <h4 className="text-md font-medium mb-2 text-mortgage-primary">Benefits</h4>
          <ul className="list-disc pl-5 space-y-1">
            {loanInfo.benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-gray-700">{benefit}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-md font-medium mb-2 text-mortgage-primary">Eligibility</h4>
          <ul className="list-disc pl-5 space-y-1">
            {loanInfo.eligibility.map((criterion, index) => (
              <li key={index} className="text-sm text-gray-700">{criterion}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanTypeDetails;
