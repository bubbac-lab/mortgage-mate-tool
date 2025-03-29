
import React, { useState } from "react";
import { AmortizationItem } from "@/utils/mortgageCalculations";
import { formatCurrency } from "@/utils/mortgageCalculations";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AmortizationScheduleProps {
  schedule: AmortizationItem[];
  loanAmount: number;
  loanTerm: number;
}

const AmortizationSchedule: React.FC<AmortizationScheduleProps> = ({
  schedule,
  loanAmount,
  loanTerm,
}) => {
  const [viewMode, setViewMode] = useState<"yearly" | "monthly">("yearly");
  const [displayedYears, setDisplayedYears] = useState<number>(10);

  // Filter schedule based on view mode
  const filteredSchedule = schedule.filter((item) => {
    if (viewMode === "yearly") {
      return item.month % 12 === 0; // Only show December of each year
    }
    return true;
  });

  // Limit displayed items
  const limitedSchedule = filteredSchedule.slice(0, viewMode === "yearly" ? displayedYears : displayedYears * 12);

  // Prepare data for the line graph
  const chartData = schedule
    .filter(item => item.month % 12 === 0) // One data point per year
    .map((item) => ({
      year: Math.ceil(item.month / 12),
      balance: item.balance,
      cumulativeInterest: item.cumulativeInterest,
    }));

  // Handle CSV export
  const exportToCSV = () => {
    // Column headers
    const headers = [
      "Payment #",
      "Payment Amount",
      "Principal",
      "Interest",
      "Property Tax",
      "Remaining Balance",
      "Total Payment",
    ];
    
    // Convert data to CSV rows
    const rows = schedule.map((item) => [
      item.month,
      item.payment.toFixed(2),
      item.principalPayment.toFixed(2),
      item.interestPayment.toFixed(2),
      item.propertyTax.toFixed(2),
      item.balance.toFixed(2),
      item.totalPayment.toFixed(2),
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "mortgage_amortization.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Amortization Schedule</h2>
      
      {/* Graph */}
      <div className="mb-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              label={{ value: "Years", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(value) => `Year ${value}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="balance" 
              name="Remaining Balance" 
              stroke="#0EA5E9" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="cumulativeInterest" 
              name="Cumulative Interest" 
              stroke="#F97316" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button
            variant={viewMode === "yearly" ? "default" : "outline"}
            onClick={() => setViewMode("yearly")}
            className="mr-2"
          >
            Yearly
          </Button>
          <Button
            variant={viewMode === "monthly" ? "default" : "outline"}
            onClick={() => setViewMode("monthly")}
          >
            Monthly
          </Button>
        </div>
        <div>
          <Button variant="outline" onClick={exportToCSV}>
            Export to CSV
          </Button>
        </div>
      </div>
      
      {/* Display options for years shown */}
      <div className="flex gap-2 mb-4 text-sm">
        <span>Show:</span>
        {[5, 10, 15, loanTerm].map((year) => (
          <button
            key={year}
            onClick={() => setDisplayedYears(year)}
            className={`px-2 py-1 rounded ${
              displayedYears === year
                ? "bg-mortgage-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {year} years
          </button>
        ))}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{viewMode === "yearly" ? "Year" : "Month"}</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Property Tax</TableHead>
              <TableHead>Remaining Balance</TableHead>
              <TableHead>Total Interest Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {limitedSchedule.map((item) => (
              <TableRow key={item.month}>
                <TableCell>{viewMode === "yearly" ? item.month / 12 : item.month}</TableCell>
                <TableCell>{formatCurrency(item.payment)}</TableCell>
                <TableCell>{formatCurrency(item.principalPayment)}</TableCell>
                <TableCell>{formatCurrency(item.interestPayment)}</TableCell>
                <TableCell>{formatCurrency(item.propertyTax)}</TableCell>
                <TableCell>{formatCurrency(item.balance)}</TableCell>
                <TableCell>{formatCurrency(item.cumulativeInterest)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Loan summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Loan Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Loan Amount</p>
            <p className="text-lg font-medium">{formatCurrency(loanAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Interest Paid</p>
            <p className="text-lg font-medium">
              {schedule.length > 0 && formatCurrency(schedule[schedule.length - 1].cumulativeInterest)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Cost of Loan</p>
            <p className="text-lg font-medium">
              {schedule.length > 0 && 
                formatCurrency(loanAmount + schedule[schedule.length - 1].cumulativeInterest)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmortizationSchedule;
