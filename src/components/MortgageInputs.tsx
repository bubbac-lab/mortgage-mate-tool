
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, getPropertyTaxRateByZip } from "@/utils/mortgageCalculations";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MortgageInputsProps {
  onInputChange: (values: MortgageInputValues) => void;
}

export interface MortgageInputValues {
  housePrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  interestRate: number;
  loanTerm: number;
  zipCode: string;
  propertyTaxRate: number;
  useCustomTaxRate: boolean;
}

const MortgageInputs: React.FC<MortgageInputsProps> = ({ onInputChange }) => {
  const { toast } = useToast();
  
  // Default values
  const defaultValues: MortgageInputValues = {
    housePrice: 350000,
    downPaymentPercent: 20,
    downPaymentAmount: 70000,
    interestRate: 4.5,
    loanTerm: 30,
    zipCode: "",
    propertyTaxRate: 1.2, // Default property tax rate
    useCustomTaxRate: false,
  };

  const [values, setValues] = useState<MortgageInputValues>(defaultValues);
  const [zipCodeError, setZipCodeError] = useState<string>("");
  const [isCalculatingTax, setIsCalculatingTax] = useState<boolean>(false);

  // Handle house price change
  const handleHousePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value.replace(/[^0-9]/g, ""));
    if (!isNaN(price)) {
      const newDownPaymentAmount = (price * values.downPaymentPercent) / 100;
      setValues({
        ...values,
        housePrice: price,
        downPaymentAmount: newDownPaymentAmount,
      });
    }
  };

  // Handle interest rate slider change
  const handleInterestRateChange = (value: number[]) => {
    setValues({
      ...values,
      interestRate: value[0],
    });
  };

  // Handle interest rate input change for precise control
  const handleInterestRateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    if (!isNaN(rate) && rate >= 0.1 && rate <= 10) {
      setValues({
        ...values,
        interestRate: rate,
      });
    }
  };

  // Handle down payment percentage slider change
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0];
    const amount = (values.housePrice * percent) / 100;
    setValues({
      ...values,
      downPaymentPercent: percent,
      downPaymentAmount: amount,
    });
  };

  // Handle down payment amount input change
  const handleDownPaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value.replace(/[^0-9]/g, ""));
    if (!isNaN(amount) && amount >= 0 && amount <= values.housePrice) {
      const percent = (amount / values.housePrice) * 100;
      setValues({
        ...values,
        downPaymentAmount: amount,
        downPaymentPercent: percent,
      });
    }
  };

  // Handle loan term change
  const handleLoanTermChange = (term: number) => {
    setValues({
      ...values,
      loanTerm: term,
    });
  };

  // Handle ZIP code change
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value.slice(0, 5);
    setValues({
      ...values,
      zipCode,
    });

    // Clear error if field is empty
    if (zipCode.length === 0) {
      setZipCodeError("");
      return;
    }

    // Validate ZIP code
    if (zipCode.length === 5 && /^\d{5}$/.test(zipCode)) {
      setZipCodeError("");
      
      // Only if not using custom tax rate
      if (!values.useCustomTaxRate) {
        setIsCalculatingTax(true);
        
        // Use the real API to get tax rate based on ZIP
        getPropertyTaxRateByZip(zipCode)
          .then(taxRate => {
            setValues(prev => ({
              ...prev,
              propertyTaxRate: taxRate,
            }));
            setIsCalculatingTax(false);
            toast({
              title: "Tax Rate Updated",
              description: `Property tax rate for ZIP ${zipCode}: ${taxRate.toFixed(2)}%`,
            });
          })
          .catch(error => {
            setIsCalculatingTax(false);
            toast({
              title: "Error Fetching Tax Rate",
              description: "Using estimated tax rate instead.",
              variant: "destructive",
            });
            console.error("Error fetching tax rate:", error);
          });
      }
    } else if (zipCode.length > 0) {
      setZipCodeError("Please enter a valid 5-digit ZIP code");
    }
  };

  // Handle property tax rate change
  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    if (!isNaN(rate) && rate >= 0) {
      setValues({
        ...values,
        propertyTaxRate: rate,
      });
    }
  };

  // Toggle custom tax rate
  const handleToggleCustomTax = () => {
    setValues({
      ...values,
      useCustomTaxRate: !values.useCustomTaxRate,
    });
  };

  // Notify parent component whenever values change
  useEffect(() => {
    onInputChange(values);
  }, [values, onInputChange]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Mortgage Details</h2>
        
        {/* House Price */}
        <div className="mb-6">
          <Label htmlFor="housePrice" className="text-sm font-medium">
            House Price
          </Label>
          <Input
            id="housePrice"
            type="text"
            value={formatCurrency(values.housePrice)}
            onChange={handleHousePriceChange}
            className="mt-1"
          />
        </div>

        {/* Interest Rate */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <Label htmlFor="interestRate" className="text-sm font-medium">
              Interest Rate
            </Label>
            <div className="flex items-center">
              <Input
                id="interestRateInput"
                type="number"
                value={values.interestRate}
                onChange={handleInterestRateInputChange}
                className="w-20 text-right"
                min={0.1}
                max={10}
                step={0.125}
              />
              <span className="ml-1">%</span>
            </div>
          </div>
          <Slider
            id="interestRate"
            min={0.1}
            max={10}
            step={0.125}
            value={[values.interestRate]}
            onValueChange={handleInterestRateChange}
            className="mt-2"
          />
        </div>

        {/* Down Payment */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <Label htmlFor="downPayment" className="text-sm font-medium">
              Down Payment ({Math.round(values.downPaymentPercent)}%)
            </Label>
            <Input
              id="downPaymentAmount"
              type="text"
              value={formatCurrency(values.downPaymentAmount)}
              onChange={handleDownPaymentAmountChange}
              className="w-32 text-right"
            />
          </div>
          <Slider
            id="downPayment"
            min={0}
            max={100}
            step={1}
            value={[values.downPaymentPercent]}
            onValueChange={handleDownPaymentPercentChange}
            className="mt-2"
          />
        </div>

        {/* Loan Term */}
        <div className="mb-6">
          <Label className="text-sm font-medium block mb-2">Loan Term</Label>
          <div className="flex gap-3">
            <button
              onClick={() => handleLoanTermChange(15)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                values.loanTerm === 15
                  ? "bg-mortgage-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              15 Years
            </button>
            <button
              onClick={() => handleLoanTermChange(30)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                values.loanTerm === 30
                  ? "bg-mortgage-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              30 Years
            </button>
          </div>
        </div>

        {/* ZIP Code and Property Tax */}
        <div className="mb-6">
          <Label htmlFor="zipCode" className="text-sm font-medium">
            ZIP Code (for property tax estimate)
          </Label>
          <div className="relative">
            <Input
              id="zipCode"
              type="text"
              value={values.zipCode}
              onChange={handleZipCodeChange}
              className="mt-1 pr-8"
              placeholder="Enter 5-digit ZIP code"
              maxLength={5}
            />
            {isCalculatingTax && (
              <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-mortgage-muted" />
            )}
          </div>
          {zipCodeError && (
            <p className="text-red-500 text-xs mt-1">{zipCodeError}</p>
          )}
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="propertyTaxRate" className="text-sm font-medium">
              Property Tax Rate
            </Label>
            <div className="flex items-center">
              {isCalculatingTax ? (
                <span className="text-xs text-mortgage-muted animate-pulse">
                  Calculating...
                </span>
              ) : (
                <>
                  <input
                    type="checkbox"
                    id="customTaxRate"
                    checked={values.useCustomTaxRate}
                    onChange={handleToggleCustomTax}
                    className="mr-2"
                  />
                  <label htmlFor="customTaxRate" className="text-xs text-mortgage-muted">
                    Use custom rate
                  </label>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center mt-1">
            <Input
              id="propertyTaxRate"
              type="number"
              value={values.propertyTaxRate}
              onChange={handleTaxRateChange}
              disabled={!values.useCustomTaxRate && !isCalculatingTax}
              className={`w-20 ${!values.useCustomTaxRate && !isCalculatingTax ? "bg-gray-100" : ""}`}
              min={0}
              step={0.01}
            />
            <span className="ml-1">%</span>
            <span className="ml-2 text-xs text-mortgage-muted">
              (annual rate)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageInputs;
