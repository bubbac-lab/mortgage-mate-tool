
import React from "react";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/mortgageCalculations";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface MortgagePaymentSummaryProps {
  principalAndInterest: number;
  propertyTax: number;
  totalPayment: number;
}

const MortgagePaymentSummary: React.FC<MortgagePaymentSummaryProps> = ({
  principalAndInterest,
  propertyTax,
  totalPayment,
}) => {
  const isMobile = useIsMobile();
  
  // Prepare data for pie chart
  const chartData = [
    {
      name: "Principal & Interest",
      value: principalAndInterest,
      color: "#143D60", // Updated to dark blue (primary)
    },
    {
      name: "Property Tax",
      value: propertyTax,
      color: "#EB5B00", // Updated to orange (secondary)
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h2>
      
      <div className="mb-6">
        <div className="text-center">
          <h3 className="text-sm font-medium text-mortgage-muted">Monthly Payment</h3>
          <p className="text-3xl sm:text-4xl font-bold text-mortgage-primary">
            {formatCurrency(totalPayment)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={isMobile ? 180 : 200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 40 : 60}
              outerRadius={isMobile ? 60 : 80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout={isMobile ? "horizontal" : "vertical"}
              verticalAlign={isMobile ? "bottom" : "middle"}
              align={isMobile ? "center" : "right"}
              formatter={(value, entry, index) => {
                return (
                  <span className="text-xs sm:text-sm">
                    {value}: {formatCurrency(chartData[index!].value)}
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <div className="flex justify-between text-xs sm:text-sm mb-1">
            <span>Principal & Interest</span>
            <span className="font-medium">{formatCurrency(principalAndInterest)}</span>
          </div>
          <Progress value={(principalAndInterest / totalPayment) * 100} className="h-2 bg-gray-200" indicatorClassName="bg-mortgage-primary" />
        </div>

        <div>
          <div className="flex justify-between text-xs sm:text-sm mb-1">
            <span>Property Tax</span>
            <span className="font-medium">{formatCurrency(propertyTax)}</span>
          </div>
          <Progress value={(propertyTax / totalPayment) * 100} className="h-2 bg-gray-200" indicatorClassName="bg-mortgage-secondary" />
        </div>

        <div className="pt-3 mt-3 border-t">
          <div className="flex justify-between text-sm sm:text-base">
            <span className="font-medium">Total Monthly Payment</span>
            <span className="font-bold">{formatCurrency(totalPayment)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgagePaymentSummary;
