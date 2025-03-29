
import React, { useState, useEffect } from "react";
import MortgageInputs, { MortgageInputValues } from "@/components/MortgageInputs";
import MortgagePaymentSummary from "@/components/MortgagePaymentSummary";
import AmortizationSchedule from "@/components/AmortizationSchedule";
import LoanTypeSelector from "@/components/LoanTypeSelector";
import { 
  calculateMonthlyPayment, 
  calculatePropertyTax, 
  generateAmortizationSchedule, 
  AmortizationItem 
} from "@/utils/mortgageCalculations";
import { Calculator, Home, Info } from "lucide-react";

const Index = () => {
  const [mortgageValues, setMortgageValues] = useState<MortgageInputValues>({
    housePrice: 500000,
    downPaymentPercent: 20,
    downPaymentAmount: 100000,
    interestRate: 6.5,
    loanTerm: 30,
    zipCode: "",
    propertyTaxRate: 1.2,
    useCustomTaxRate: false,
  });

  const [paymentSummary, setPaymentSummary] = useState({
    principalAndInterest: 0,
    propertyTax: 0,
    totalPayment: 0,
  });

  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationItem[]>([]);

  // Calculate loan details whenever mortgage values change
  useEffect(() => {
    // Calculate loan amount (house price minus down payment)
    const loanAmount = mortgageValues.housePrice - mortgageValues.downPaymentAmount;
    
    // Calculate monthly principal and interest payment
    const monthlyPrincipalAndInterest = calculateMonthlyPayment(
      loanAmount,
      mortgageValues.interestRate,
      mortgageValues.loanTerm
    );
    
    // Calculate monthly property tax
    const monthlyPropertyTax = calculatePropertyTax(
      mortgageValues.housePrice,
      mortgageValues.propertyTaxRate
    );
    
    // Calculate total monthly payment
    const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyPropertyTax;
    
    // Update payment summary
    setPaymentSummary({
      principalAndInterest: monthlyPrincipalAndInterest,
      propertyTax: monthlyPropertyTax,
      totalPayment: totalMonthlyPayment,
    });
    
    // Generate amortization schedule
    const schedule = generateAmortizationSchedule(
      loanAmount,
      mortgageValues.interestRate,
      mortgageValues.loanTerm,
      monthlyPropertyTax
    );
    
    setAmortizationSchedule(schedule);
  }, [mortgageValues]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-mortgage-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <Calculator size={24} className="mr-2" />
          <h1 className="text-xl font-bold">Mortgage Calculator</h1>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Left column - Inputs */}
            <div className="md:w-1/3">
              <LoanTypeSelector />
              <MortgageInputs onInputChange={setMortgageValues} />
            </div>
            
            {/* Right column - Results */}
            <div className="md:w-2/3">
              <MortgagePaymentSummary 
                principalAndInterest={paymentSummary.principalAndInterest}
                propertyTax={paymentSummary.propertyTax}
                totalPayment={paymentSummary.totalPayment}
              />
              
              <div className="mt-6">
                <AmortizationSchedule 
                  schedule={amortizationSchedule}
                  loanAmount={mortgageValues.housePrice - mortgageValues.downPaymentAmount}
                  loanTerm={mortgageValues.loanTerm}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-start">
            <Info size={20} className="text-mortgage-muted mt-1 mr-2" />
            <div>
              <h2 className="text-lg font-semibold mb-2">About This Calculator</h2>
              <p className="text-gray-600 mb-3">
                This mortgage calculator helps you estimate your monthly mortgage payments based on your home price, 
                down payment, interest rate, and loan term. It also provides an amortization schedule showing how your 
                loan balance decreases over time.
              </p>
              <p className="text-gray-600 mb-3">
                The property tax estimates are based on your ZIP code and local tax rates. You can also manually 
                override the tax rate if you have more accurate information.
              </p>
              <p className="text-sm text-gray-500">
                Note: This calculator provides estimates only. Actual loan terms and payments may vary. 
                Please consult with a mortgage professional for personalized advice.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-gray-300 p-6 mt-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Home size={20} className="mr-2" />
                <h2 className="text-lg font-semibold">Mortgage Mate</h2>
              </div>
              <p className="mt-2 text-sm">
                A powerful mortgage calculator to help you make informed decisions.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Disclaimer</h3>
              <p className="text-xs text-gray-400">
                This calculator is for illustrative purposes only. Results should not be considered financial advice.
                Actual loan terms and rates will vary based on your personal circumstances and lender requirements.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Mortgage Calculator Tool. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
