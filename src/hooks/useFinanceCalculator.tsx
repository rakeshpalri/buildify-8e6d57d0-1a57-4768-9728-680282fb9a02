
import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Income,
  Loan,
  SIP,
  OneTimeInvestment,
  YearlyProjection,
  OptimalAllocation,
  ArbitrageResult,
  SIPType
} from '@/types/calculator';

export const useFinanceCalculator = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [sips, setSips] = useState<SIP[]>([]);
  const [oneTimeInvestments, setOneTimeInvestments] = useState<OneTimeInvestment[]>([]);
  const [calculationResults, setCalculationResults] = useState<ArbitrageResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Income management
  const addIncome = useCallback((income: Omit<Income, 'id'>) => {
    setIncomes(prev => [...prev, { ...income, id: uuidv4() }]);
  }, []);

  const updateIncome = useCallback((id: string, income: Partial<Income>) => {
    setIncomes(prev => prev.map(item => item.id === id ? { ...item, ...income } : item));
  }, []);

  const removeIncome = useCallback((id: string) => {
    setIncomes(prev => prev.filter(item => item.id !== id));
  }, []);

  // Loan management
  const addLoan = useCallback((loan: Omit<Loan, 'id'>) => {
    setLoans(prev => [...prev, { ...loan, id: uuidv4() }]);
  }, []);

  const updateLoan = useCallback((id: string, loan: Partial<Loan>) => {
    setLoans(prev => prev.map(item => item.id === id ? { ...item, ...loan } : item));
  }, []);

  const removeLoan = useCallback((id: string) => {
    setLoans(prev => prev.filter(item => item.id !== id));
  }, []);

  // SIP management
  const addSip = useCallback((sip: Omit<SIP, 'id'>) => {
    setSips(prev => [...prev, { ...sip, id: uuidv4() }]);
  }, []);

  const updateSip = useCallback((id: string, sip: Partial<SIP>) => {
    setSips(prev => prev.map(item => item.id === id ? { ...item, ...sip } : item));
  }, []);

  const removeSip = useCallback((id: string) => {
    setSips(prev => prev.filter(item => item.id !== id));
  }, []);

  // One-time investment management
  const addOneTimeInvestment = useCallback((investment: Omit<OneTimeInvestment, 'id'>) => {
    setOneTimeInvestments(prev => [...prev, { ...investment, id: uuidv4() }]);
  }, []);

  const updateOneTimeInvestment = useCallback((id: string, investment: Partial<OneTimeInvestment>) => {
    setOneTimeInvestments(prev => prev.map(item => item.id === id ? { ...item, ...investment } : item));
  }, []);

  const removeOneTimeInvestment = useCallback((id: string) => {
    setOneTimeInvestments(prev => prev.filter(item => item.id !== id));
  }, []);

  // AI-based suggestions
  const suggestSipReturn = useCallback((type: SIPType): number => {
    // Historical average returns based on SIP type
    switch (type) {
      case 'Equity':
        return 12; // 12% average for equity
      case 'Hybrid':
        return 9; // 9% average for hybrid
      case 'Debt':
        return 7; // 7% average for debt
      default:
        return 10; // Default return
    }
  }, []);

  // Calculate the effective interest rate for a loan
  const calculateEffectiveInterestRate = useCallback((loan: Loan): number => {
    if (loan.interestType === 'Simple') {
      return loan.interestRate;
    } else {
      // For compound interest, calculate the effective annual rate
      return Math.pow(1 + loan.interestRate / 100 / 12, 12) - 1;
    }
  }, []);

  // Calculate monthly income
  const calculateMonthlyIncome = useMemo(() => {
    return incomes.reduce((total, income) => {
      if (income.frequency === 'Monthly') {
        return total + income.amount;
      } else if (income.frequency === 'Quarterly') {
        return total + (income.amount / 3);
      } else if (income.frequency === 'One-time') {
        // Spread one-time income over 12 months for calculation purposes
        return total + (income.amount / 12);
      }
      return total;
    }, 0);
  }, [incomes]);

  // Calculate total EMI
  const calculateTotalEMI = useMemo(() => {
    return loans.reduce((total, loan) => total + loan.emi, 0);
  }, [loans]);

  // Calculate total SIP
  const calculateTotalSIP = useMemo(() => {
    return sips.reduce((total, sip) => total + sip.monthlyAmount, 0);
  }, [sips]);

  // Calculate monthly surplus
  const calculateMonthlySurplus = useMemo(() => {
    return calculateMonthlyIncome - calculateTotalEMI - calculateTotalSIP;
  }, [calculateMonthlyIncome, calculateTotalEMI, calculateTotalSIP]);

  // Calculate arbitrage score (higher score means investing is better than loan repayment)
  const calculateArbitrageScore = useCallback((): number => {
    if (loans.length === 0 || sips.length === 0) return 0;

    // Calculate weighted average loan interest rate
    const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.principalRemaining, 0);
    const weightedLoanInterest = loans.reduce(
      (sum, loan) => sum + (loan.principalRemaining / totalLoanAmount) * calculateEffectiveInterestRate(loan),
      0
    );

    // Calculate weighted average SIP return
    const totalSipAmount = sips.reduce((sum, sip) => sum + sip.monthlyAmount, 0);
    const weightedSipReturn = sips.reduce(
      (sum, sip) => sum + (sip.monthlyAmount / totalSipAmount) * sip.expectedReturn,
      0
    );

    // Arbitrage score: difference between SIP returns and loan interest
    // Positive score means investing is better, negative means loan repayment is better
    return weightedSipReturn - weightedLoanInterest;
  }, [loans, sips, calculateEffectiveInterestRate]);

  // Generate alerts based on financial data
  const generateAlerts = useCallback((): string[] => {
    const alerts: string[] = [];

    // Check if EMI is too high compared to income
    const emiToIncomeRatio = calculateTotalEMI / calculateMonthlyIncome;
    if (emiToIncomeRatio > 0.5) {
      alerts.push(`Warning: Your EMI to income ratio is ${(emiToIncomeRatio * 100).toFixed(1)}%, which is high. Financial experts recommend keeping it below 50%.`);
    }

    // Check if any SIP has unrealistic return expectations
    sips.forEach(sip => {
      const suggestedReturn = suggestSipReturn(sip.type);
      if (sip.expectedReturn > suggestedReturn + 3) {
        alerts.push(`The expected return of ${sip.expectedReturn}% for ${sip.name} may be unrealistic. Historical average for ${sip.type} is around ${suggestedReturn}%.`);
      }
    });

    // Check if monthly surplus is negative
    if (calculateMonthlySurplus < 0) {
      alerts.push(`Your monthly expenses (EMI + SIP) exceed your income by ₹${Math.abs(calculateMonthlySurplus).toFixed(2)}. Consider reducing expenses or increasing income.`);
    }

    return alerts;
  }, [calculateTotalEMI, calculateMonthlyIncome, sips, calculateMonthlySurplus, suggestSipReturn]);

  // Calculate optimal allocation of surplus
  const calculateOptimalAllocation = useCallback((): OptimalAllocation[] => {
    const allocations: OptimalAllocation[] = [];
    
    if (calculateMonthlySurplus <= 0) {
      return allocations;
    }

    // Sort loans by effective interest rate (highest first)
    const sortedLoans = [...loans].sort((a, b) => 
      calculateEffectiveInterestRate(b) - calculateEffectiveInterestRate(a)
    );

    // Sort SIPs by expected return (highest first)
    const sortedSips = [...sips].sort((a, b) => b.expectedReturn - a.expectedReturn);

    // If highest loan interest > highest SIP return, prioritize loan repayment
    if (sortedLoans.length > 0 && sortedSips.length > 0) {
      const highestLoanInterest = calculateEffectiveInterestRate(sortedLoans[0]);
      const highestSipReturn = sortedSips[0].expectedReturn;

      if (highestLoanInterest > highestSipReturn) {
        // Prioritize loan repayment
        allocations.push({
          loanId: sortedLoans[0].id,
          percentage: 70,
          reason: `This loan has a high interest rate of ${sortedLoans[0].interestRate}%, which is higher than your best investment return of ${highestSipReturn}%.`
        });

        // Allocate some to SIP for diversification
        if (sortedSips.length > 0) {
          allocations.push({
            sipId: sortedSips[0].id,
            percentage: 30,
            reason: 'Maintaining some investment for long-term growth and diversification.'
          });
        }
      } else {
        // Prioritize investment
        allocations.push({
          sipId: sortedSips[0].id,
          percentage: 70,
          reason: `This investment has an expected return of ${highestSipReturn}%, which is higher than your highest loan interest rate of ${highestLoanInterest}%.`
        });

        // Allocate some to loan repayment
        if (sortedLoans.length > 0) {
          allocations.push({
            loanId: sortedLoans[0].id,
            percentage: 30,
            reason: 'Allocating some funds to reduce debt burden.'
          });
        }
      }
    } else if (sortedLoans.length > 0) {
      // Only loans, no SIPs
      allocations.push({
        loanId: sortedLoans[0].id,
        percentage: 100,
        reason: `Focus on paying off this high-interest loan (${sortedLoans[0].interestRate}%) before starting investments.`
      });
    } else if (sortedSips.length > 0) {
      // Only SIPs, no loans
      allocations.push({
        sipId: sortedSips[0].id,
        percentage: 100,
        reason: 'With no loans to repay, focus on maximizing your investment returns.'
      });
    }

    return allocations;
  }, [loans, sips, calculateMonthlySurplus, calculateEffectiveInterestRate]);

  // Calculate yearly projections
  const calculateYearlyProjections = useCallback((): YearlyProjection[] => {
    const projections: YearlyProjection[] = [];
    const maxYears = Math.max(
      ...loans.map(loan => loan.tenureRemainingYears + loan.tenureRemainingMonths / 12),
      ...sips.map(sip => sip.investmentHorizon)
    );

    // If no loans or SIPs, return empty projections
    if (maxYears === 0 || (loans.length === 0 && sips.length === 0)) {
      return projections;
    }

    // Initialize loan and SIP tracking
    const loanBalances: Record<string, number> = {};
    loans.forEach(loan => {
      loanBalances[loan.id] = loan.principalRemaining;
    });

    const sipBalances: Record<string, number> = {};
    sips.forEach(sip => {
      sipBalances[sip.id] = 0;
    });

    // Calculate monthly surplus
    const monthlySurplus = calculateMonthlySurplus;
    
    // Get optimal allocation
    const allocations = calculateOptimalAllocation();

    // Project for each year
    for (let year = 1; year <= Math.ceil(maxYears); year++) {
      // Calculate yearly income
      const yearlyIncome = calculateMonthlyIncome * 12;
      
      // Calculate yearly EMI
      const yearlyEMI = calculateTotalEMI * 12;
      
      // Calculate yearly SIP
      const yearlySIP = calculateTotalSIP * 12;
      
      // Calculate yearly surplus
      const yearlySurplus = monthlySurplus * 12;

      // Update loan balances
      for (const loan of loans) {
        // Regular EMI payment
        const yearlyInterest = loanBalances[loan.id] * (loan.interestRate / 100);
        const yearlyPrincipalPayment = Math.min(loan.emi * 12 - yearlyInterest, loanBalances[loan.id]);
        loanBalances[loan.id] -= yearlyPrincipalPayment;

        // Additional payment from surplus based on allocation
        const loanAllocation = allocations.find(a => a.loanId === loan.id);
        if (loanAllocation && loanBalances[loan.id] > 0) {
          const additionalPayment = yearlySurplus * (loanAllocation.percentage / 100);
          loanBalances[loan.id] = Math.max(0, loanBalances[loan.id] - additionalPayment);
        }

        // Ensure balance doesn't go below zero
        loanBalances[loan.id] = Math.max(0, loanBalances[loan.id]);
      }

      // Update SIP balances
      for (const sip of sips) {
        // Skip if still in delay period
        if (year <= sip.startDelay) continue;

        // Regular SIP contribution
        const yearlyContribution = sip.monthlyAmount * 12;
        
        // Growth on existing balance
        const yearlyGrowth = sipBalances[sip.id] * (sip.expectedReturn / 100);
        
        // Additional contribution from surplus based on allocation
        const sipAllocation = allocations.find(a => a.sipId === sip.id);
        const additionalContribution = sipAllocation 
          ? yearlySurplus * (sipAllocation.percentage / 100) 
          : 0;
        
        // Update balance
        sipBalances[sip.id] += yearlyContribution + yearlyGrowth + additionalContribution;
      }

      // Calculate net worth
      const totalLoans = Object.values(loanBalances).reduce((sum, balance) => sum + balance, 0);
      const totalSips = Object.values(sipBalances).reduce((sum, balance) => sum + balance, 0);
      const netWorth = totalSips - totalLoans;

      // Add to projections
      projections.push({
        year,
        totalIncome: yearlyIncome,
        totalEMI: yearlyEMI,
        totalSIP: yearlySIP,
        surplus: yearlySurplus,
        netWorth,
        loans: { ...loanBalances },
        sips: { ...sipBalances }
      });
    }

    return projections;
  }, [
    loans, 
    sips, 
    calculateMonthlyIncome, 
    calculateTotalEMI, 
    calculateTotalSIP, 
    calculateMonthlySurplus, 
    calculateOptimalAllocation
  ]);

  // Run the calculation
  const runCalculation = useCallback(() => {
    setIsCalculating(true);
    
    // Simulate a delay for complex calculations
    setTimeout(() => {
      try {
        const yearlyProjections = calculateYearlyProjections();
        const optimalAllocations = calculateOptimalAllocation();
        const arbitrageScore = calculateArbitrageScore();
        const alerts = generateAlerts();

        setCalculationResults({
          yearlyProjections,
          optimalAllocations,
          arbitrageScore,
          alerts
        });
      } catch (error) {
        console.error('Calculation error:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 1000);
  }, [
    calculateYearlyProjections, 
    calculateOptimalAllocation, 
    calculateArbitrageScore, 
    generateAlerts
  ]);

  // Reset all data
  const resetAll = useCallback(() => {
    setIncomes([]);
    setLoans([]);
    setSips([]);
    setOneTimeInvestments([]);
    setCalculationResults(null);
  }, []);

  return {
    // State
    incomes,
    loans,
    sips,
    oneTimeInvestments,
    calculationResults,
    isCalculating,
    
    // Income methods
    addIncome,
    updateIncome,
    removeIncome,
    
    // Loan methods
    addLoan,
    updateLoan,
    removeLoan,
    
    // SIP methods
    addSip,
    updateSip,
    removeSip,
    
    // One-time investment methods
    addOneTimeInvestment,
    updateOneTimeInvestment,
    removeOneTimeInvestment,
    
    // Calculation methods
    runCalculation,
    resetAll,
    
    // Helper methods
    suggestSipReturn,
    
    // Derived values
    monthlyIncome: calculateMonthlyIncome,
    totalEMI: calculateTotalEMI,
    totalSIP: calculateTotalSIP,
    monthlySurplus: calculateMonthlySurplus
  };
};