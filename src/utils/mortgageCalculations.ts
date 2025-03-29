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
 * Get property tax rate by ZIP code from SmartAsset API
 * @param zipCode ZIP code
 * @returns Promise resolving to tax rate percentage
 */
export const getPropertyTaxRateByZip = async (zipCode: string): Promise<number> => {
  try {
    // First validate if this is a valid US ZIP code
    if (!/^\d{5}$/.test(zipCode)) {
      console.error('Invalid ZIP code format');
      return 1.2; // Return default rate if invalid
    }
    
    // Use SmartAsset's Property Tax Calculator API
    const response = await fetch(`https://smartasset.com/taxes/property-taxes/api/rates?zip=${zipCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // SmartAsset returns tax rates as decimal (e.g., 0.0125 for 1.25%)
    // Extract the effective tax rate and convert to percentage
    if (data && data.effective_tax_rate) {
      // Convert from decimal to percentage (e.g., 0.0125 -> 1.25)
      return data.effective_tax_rate * 100;
    }
    
    // If we can't get data for some reason, use fallback calculation
    // This is similar to our original mock but serves as a reasonable fallback
    console.warn('Using fallback tax rate calculation');
    const firstDigit = parseInt(zipCode.charAt(0));
    return 0.8 + (firstDigit * 0.2); // Ranges from 0.8% to 2.6%
    
  } catch (error) {
    console.error('Error fetching property tax rate:', error);
    
    // Fallback to our original estimation if API fails
    const firstDigit = parseInt(zipCode.charAt(0));
    return 0.8 + (firstDigit * 0.2); // Ranges from 0.8% to 2.6%
  }
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
