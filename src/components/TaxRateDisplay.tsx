
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartPie, PercentIcon } from "lucide-react";

interface TaxRateDisplayProps {
  zipCode: string;
  propertyTaxRate: number;
  isCalculatingTax: boolean;
  useCustomTaxRate: boolean;
}

const TaxRateDisplay: React.FC<TaxRateDisplayProps> = ({
  zipCode,
  propertyTaxRate,
  isCalculatingTax,
  useCustomTaxRate,
}) => {
  // Compare to national average tax rate (approximately 1.07%)
  const nationalAverageTaxRate = 1.07;
  const comparisonPercentage = Math.min(
    Math.round((propertyTaxRate / nationalAverageTaxRate) * 100),
    200
  );

  const getRatingText = () => {
    if (propertyTaxRate < nationalAverageTaxRate * 0.75) return "Low";
    if (propertyTaxRate > nationalAverageTaxRate * 1.25) return "High";
    return "Average";
  };

  const getRatingColor = () => {
    if (propertyTaxRate < nationalAverageTaxRate * 0.75) return "text-green-600";
    if (propertyTaxRate > nationalAverageTaxRate * 1.25) return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ChartPie className="h-5 w-5 mr-2 text-mortgage-secondary" />
            <CardTitle className="text-lg">Property Tax Rate</CardTitle>
          </div>
          <div className="flex items-center text-sm font-medium">
            <PercentIcon className="h-4 w-4 mr-1 text-mortgage-muted" />
            <span className="text-xl font-bold text-mortgage-primary">{propertyTaxRate.toFixed(2)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {zipCode ? (
          <>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">
                {useCustomTaxRate ? (
                  <span>Using custom tax rate</span>
                ) : isCalculatingTax ? (
                  <span className="animate-pulse">Fetching tax data...</span>
                ) : (
                  <span>
                    Tax rate for ZIP code <strong>{zipCode}</strong> via SmartAsset
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">US Avg (1.07%)</span>
                <span className={`text-sm font-medium ${getRatingColor()}`}>
                  {getRatingText()} Rate
                </span>
              </div>
              <Progress
                value={comparisonPercentage}
                className="h-2 mt-1 bg-gray-100"
                indicatorClassName={
                  getRatingText() === "Low"
                    ? "bg-mortgage-highlight" // Green - A0C878
                    : getRatingText() === "High"
                    ? "bg-mortgage-secondary" // Orange - EB5B00
                    : "bg-mortgage-accent" // Pale Green - DDEB9D
                }
              />
            </div>

            <div className="text-xs text-gray-500 mt-2">
              {!useCustomTaxRate && !isCalculatingTax && (
                <p>
                  This property tax rate affects your monthly payment calculation.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Enter a ZIP code to see the property tax rate
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxRateDisplay;
