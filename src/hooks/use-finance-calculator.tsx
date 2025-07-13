
import { useState, useCallback } from 'react';

// Types
export interface Income {
  id: string;
  amount: number;
  type: 'Salary' | 'Freelance' | 'Farming' | 'Business' | 'Rental' | 'Other';
  frequency: 'Monthly' | 'Quarterly' | 'One-time';
}

export interface Loan {
  id: string;
  type: 'Tractor' | 'KCC' | 'Home' | 'Personal' | 'Relatives' | 'Credit Card' | 'Other';
  principalRemaining: number;
  emiPerMonth: number;
  interestType: 'Simple' | 'Compound';
  interestRate: number;
  tenureRemainingMonths: number;
  prepaymentAllowed: boolean;
  prepaymentPenalty: number;
}

export interface Sip {
  id: string;
  name: string;
  type: 'Equity' | 'Hybrid' | 'Debt' | 'Other';
  monthlyAmount: number;
  expectedReturn: number;
  investmentHorizonYears: number;
  startDelayMonths: number;
}

export interface OneTimeItem {
  id: string;
  type: 'FD Maturity' | 'Bonus' | 'Refund' | 'Insurance' | 'Gold Sale' | 'Other';
  amount: number;
  date: Date;
  autoApply: boolean;
}

export interface YearlyResult {
  year: number;
  loanBalances: Record<string, number>;
  sipValues: Record<string, number>;
  netWorth: number;
  cashFlow: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface ArbitrageRecommendation {
  loanId?: string;
  sipId?: string;
  percentage: number;
  reason: string;
}

export interface CalculationResults {
  yearlyResults: YearlyResult[];
  recommendations: ArbitrageRecommendation[];
  arbitrageScore: number;
  totalInterestSaved: number;
  totalInvestmentGrowth: number;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useFinanceCalculator = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [sips, setSips] = useState<Sip[]>([]);
  const [oneTimeItems, setOneTimeItems] = useState<OneTimeItem[]>([]);
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);

  // Income handlers
  const addIncome = useCallback(() => {
    const newIncome: Income = {
      id: generateId(),
      amount: 0,
      type: 'Salary',
      frequency: 'Monthly'
    };
    setIncomes(prev => [...prev, newIncome]);
  }, []);

  const updateIncome = useCallback((updatedIncome: Income) => {
    setIncomes(prev => prev.map(income => 
      income.id === updatedIncome.id ? updatedIncome : income
    ));
  }, []);

  const removeIncome = useCallback((id: string) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  }, []);

  // Loan handlers
  const addLoan = useCallback(() => {
    const newLoan: Loan = {
      id: generateId(),
      type: 'Personal',
      principalRemaining: 0,
      emiPerMonth: 0,
      interestType: 'Compound',
      interestRate: 0,
      tenureRemainingMonths: 0,
      prepaymentAllowed: true,
      prepaymentPenalty: 0
    };
    setLoans(prev => [...prev, newLoan]);
  }, []);

  const updateLoan = useCallback((updatedLoan: Loan) => {
    setLoans(prev => prev.map(loan => 
      loan.id === updatedLoan.id ? updatedLoan : loan
    ));
  }, []);

  const removeLoan = useCallback((id: string) => {
    setLoans(prev => prev.filter(loan => loan.id !== id));
  }, []);

  // SIP handlers
  const addSip = useCallback(() => {
    const newSip: Sip = {
      id: generateId(),
      name: '',
      type: 'Equity',
      monthlyAmount: 0,
      expectedReturn: 12, // Default 12% for equity
      investmentHorizonYears: 5,
      startDelayMonths: 0
    };
    setSips(prev => [...prev, newSip]);
  }, []);

  const updateSip = useCallback((updatedSip: Sip) => {
    setSips(prev => prev.map(sip => 
      sip.id === updatedSip.id ? updatedSip : sip
    ));
  }, []);

  const removeSip = useCallback((id: string) => {
    setSips(prev => prev.filter(sip => sip.id !== id));
  }, []);

  // One-time item handlers
  const addOneTimeItem = useCallback(() => {
    const newItem: OneTimeItem = {
      id: generateId(),
      type: 'Bonus',
      amount: 0,
      date: new Date(),
      autoApply: true
    };
    setOneTimeItems(prev => [...prev, newItem]);
  }, []);

  const updateOneTimeItem = useCallback((updatedItem: OneTimeItem) => {
    setOneTimeItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  }, []);

  const removeOneTimeItem = useCallback((id: string) => {
    setOneTimeItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Calculate monthly income
  const calculateMonthlyIncome = useCallback(() => {
    return incomes.reduce((total, income) => {
      switch (income.frequency) {
        case 'Monthly':
          return total + income.amount;
        case 'Quarterly':
          return total + (income.amount / 3);
        case 'One-time':
          return total; // One-time incomes are handled separately
        default:
          return total;
      }
    }, 0);
  }, [incomes]);

  // Calculate results
  const calculateResults = useCallback(() => {
    const monthlyIncome = calculateMonthlyIncome();
    const maxYears = Math.max(
      ...loans.map(loan => Math.ceil(loan.tenureRemainingMonths / 12)),
      ...sips.map(sip => sip.investmentHorizonYears),
      5 // Minimum 5 years projection
    );

    // Initialize loan balances
    const initialLoanBalances: Record<string, number> = {};
    loans.forEach(loan => {
      initialLoanBalances[loan.id] = loan.principalRemaining;
    });

    // Initialize SIP values
    const initialSipValues: Record<string, number> = {};
    sips.forEach(sip => {
      initialSipValues[sip.id] = 0;
    });

    const yearlyResults: YearlyResult[] = [];
    let currentLoanBalances = { ...initialLoanBalances };
    let currentSipValues = { ...initialSipValues };

    // Calculate year by year
    for (let year = 1; year <= maxYears; year++) {
      // Process loans
      const newLoanBalances: Record<string, number> = {};
      loans.forEach(loan => {
        const currentBalance = currentLoanBalances[loan.id];
        if (currentBalance <= 0) {
          newLoanBalances[loan.id] = 0;
          return;
        }

        // Simple calculation for demo - in real implementation, this would be more complex
        const yearlyInterest = currentBalance * (loan.interestRate / 100);
        const yearlyPrincipalPayment = loan.emiPerMonth * 12 - yearlyInterest;
        const newBalance = Math.max(0, currentBalance - yearlyPrincipalPayment);
        newLoanBalances[loan.id] = newBalance;
      });

      // Process SIPs
      const newSipValues: Record<string, number> = {};
      sips.forEach(sip => {
        const currentValue = currentSipValues[sip.id];
        const startDelayYears = Math.ceil(sip.startDelayMonths / 12);
        
        if (year <= startDelayYears) {
          newSipValues[sip.id] = currentValue;
          return;
        }

        // Calculate SIP growth
        const yearlyContribution = sip.monthlyAmount * 12;
        const returns = currentValue * (sip.expectedReturn / 100);
        newSipValues[sip.id] = currentValue + yearlyContribution + returns;
      });

      // Calculate totals
      const totalAssets = Object.values(newSipValues).reduce((sum, value) => sum + value, 0);
      const totalLiabilities = Object.values(newLoanBalances).reduce((sum, value) => sum + value, 0);
      const netWorth = totalAssets - totalLiabilities;

      // Calculate cash flow
      const totalEMIs = loans.reduce((sum, loan) => sum + (loan.emiPerMonth * 12), 0);
      const totalSIPs = sips.reduce((sum, sip) => sum + (sip.monthlyAmount * 12), 0);
      const cashFlow = (monthlyIncome * 12) - totalEMIs - totalSIPs;

      yearlyResults.push({
        year,
        loanBalances: newLoanBalances,
        sipValues: newSipValues,
        netWorth,
        cashFlow,
        totalAssets,
        totalLiabilities
      });

      currentLoanBalances = newLoanBalances;
      currentSipValues = newSipValues;
    }

    // Generate recommendations
    const recommendations: ArbitrageRecommendation[] = [];
    
    // Find highest interest loan
    const highestInterestLoan = loans.reduce((highest, loan) => 
      loan.interestRate > (highest?.interestRate || 0) ? loan : highest, 
      loans[0] || null
    );

    // Find highest return SIP
    const highestReturnSip = sips.reduce((highest, sip) => 
      sip.expectedReturn > (highest?.expectedReturn || 0) ? sip : highest, 
      sips[0] || null
    );

    if (highestInterestLoan && highestReturnSip) {
      if (highestInterestLoan.interestRate > highestReturnSip.expectedReturn) {
        recommendations.push({
          loanId: highestInterestLoan.id,
          percentage: 70,
          reason: `Prioritize paying off your ${highestInterestLoan.type} loan with ${highestInterestLoan.interestRate}% interest before investing more in SIPs.`
        });
        recommendations.push({
          sipId: highestReturnSip.id,
          percentage: 30,
          reason: `Maintain some investment in ${highestReturnSip.type} SIP for long-term growth.`
        });
      } else {
        recommendations.push({
          sipId: highestReturnSip.id,
          percentage: 70,
          reason: `Prioritize investing in ${highestReturnSip.type} SIP with expected return of ${highestReturnSip.expectedReturn}%.`
        });
        recommendations.push({
          loanId: highestInterestLoan.id,
          percentage: 30,
          reason: `Continue paying off your ${highestInterestLoan.type} loan, but focus more on investments.`
        });
      }
    }

    // Calculate arbitrage score (simple version)
    const arbitrageScore = highestReturnSip && highestInterestLoan 
      ? (highestReturnSip.expectedReturn / highestInterestLoan.interestRate) * 100 
      : 100;

    // Calculate total interest saved and investment growth
    const totalInterestSaved = loans.reduce((sum, loan) => {
      const originalInterest = loan.principalRemaining * (loan.interestRate / 100) * (loan.tenureRemainingMonths / 12);
      return sum + originalInterest;
    }, 0);

    const totalInvestmentGrowth = yearlyResults.length > 0 
      ? Object.values(yearlyResults[yearlyResults.length - 1].sipValues).reduce((sum, value) => sum + value, 0) 
      : 0;

    setCalculationResults({
      yearlyResults,
      recommendations,
      arbitrageScore,
      totalInterestSaved,
      totalInvestmentGrowth
    });
  }, [incomes, loans, sips, oneTimeItems, calculateMonthlyIncome]);

  const resetCalculator = useCallback(() => {
    setIncomes([]);
    setLoans([]);
    setSips([]);
    setOneTimeItems([]);
    setCalculationResults(null);
  }, []);

  return {
    incomes,
    loans,
    sips,
    oneTimeItems,
    addIncome,
    updateIncome,
    removeIncome,
    addLoan,
    updateLoan,
    removeLoan,
    addSip,
    updateSip,
    removeSip,
    addOneTimeItem,
    updateOneTimeItem,
    removeOneTimeItem,
    calculationResults,
    calculateResults,
    resetCalculator
  };
};