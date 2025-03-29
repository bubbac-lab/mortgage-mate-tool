
// Mortgage calculation utilities

/**
 * Calculate monthly mortgage payment
 * @param loanAmount Principal loan amount
 * @param interestRate Annual interest rate (percentage)
 * @param loanTermYears Term of loan in years
 * @returns Monthly payment
 */
export const calculateMonthlyPayment = (
  loanAmount: number,
  interestRate: number,
  loanTermYears: number
): number => {
  // Convert interest rate to monthly decimal
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // Edge case: if interest rate is 0
  if (interestRate === 0) {
    return loanAmount / numberOfPayments;
  }
  
  // Use standard mortgage formula: M = P[r(1+r)^n]/[(1+r)^n-1]
  const payment = 
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return payment;
};

/**
 * Calculate property tax based on home value and tax rate
 * @param homeValue Total home value
 * @param taxRate Annual property tax rate percentage
 * @returns Monthly tax amount
 */
export const calculatePropertyTax = (
  homeValue: number,
  taxRate: number
): number => {
  // Annual tax amount divided by 12
  return (homeValue * taxRate / 100) / 12;
};

/**
 * Format currency for display
 * @param amount Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get property tax rate by ZIP code (mock function)
 * @param zipCode ZIP code
 * @returns Tax rate percentage
 */
export const getPropertyTaxRateByZip = (zipCode: string): Promise<number> => {
  // Mock function that returns a tax rate based on first digit of ZIP
  // In a real app, this would call an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple logic that gives different rates based on first digit of ZIP
      const firstDigit = parseInt(zipCode.charAt(0));
      const taxRate = 0.8 + (firstDigit * 0.2); // Ranges from 0.8% to 2.6%
      resolve(taxRate);
    }, 300);
  });
};

/**
 * Generate full amortization schedule
 * @param loanAmount Principal loan amount
 * @param interestRate Annual interest rate (percentage)
 * @param loanTermYears Term of loan in years
 * @param propertyTax Monthly property tax amount
 * @returns Amortization schedule
 */
export const generateAmortizationSchedule = (
  loanAmount: number,
  interestRate: number,
  loanTermYears: number,
  propertyTax: number
): AmortizationItem[] => {
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTermYears);
  
  let balance = loanAmount;
  let schedule: AmortizationItem[] = [];
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  
  for (let month = 1; month <= numberOfPayments; month++) {
    // Calculate interest and principal
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    // Update running balance and cumulative values
    balance -= principalPayment;
    balance = Math.max(0, balance); // Ensure balance never goes below 0
    
    cumulativeInterest += interestPayment;
    cumulativePrincipal += principalPayment;
    
    // Add to schedule
    schedule.push({
      month,
      payment: monthlyPayment,
      principalPayment,
      interestPayment,
      propertyTax,
      balance,
      cumulativeInterest,
      cumulativePrincipal,
      totalPayment: monthlyPayment + propertyTax,
    });
  }
  
  return schedule;
};

export interface AmortizationItem {
  month: number;
  payment: number;
  principalPayment: number;
  interestPayment: number;
  propertyTax: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  totalPayment: number;
}

export interface MortgageSummary {
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  totalMonthlyPayment: number;
}
