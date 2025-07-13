
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

const DEFAULT_CAGR: Record<SIPType, number> = {
  'Equity': 12,
  'Hybrid': 10,
  'Debt': 7
};

export const useFinanceCalculator = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [sips, setSips] = useState<SIP[]>([]);
  const [oneTimeInvestments, setOneTimeInvestments] = useState<OneTimeInvestment[]>([]);
  const [calculationYears, setCalculationYears] = useState<number>(10);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [result, setResult] = useState<ArbitrageResult | null>(null);

  // Income management
  const addIncome = useCallback(() => {
    const newIncome: Income = {
      id: uuidv4(),
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

  // Loan management
  const addLoan = useCallback(() => {
    const newLoan: Loan = {
      id: uuidv4(),
      type: 'Personal',
      principalRemaining: 0,
      emi: 0,
      interestType: 'Compound',
      interestRate: 0,
      tenureRemainingYears: 0,
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

  // SIP management
  const addSip = useCallback(() => {
    const newSip: SIP = {
      id: uuidv4(),
      name: '',
      type: 'Equity',
      monthlyAmount: 0,
      expectedReturn: DEFAULT_CAGR['Equity'],
      investmentHorizon: 5,
      startDelay: 0
    };
    setSips(prev => [...prev, newSip]);
  }, []);

  const updateSip = useCallback((updatedSip: SIP) => {
    setSips(prev => prev.map(sip => 
      sip.id === updatedSip.id ? updatedSip : sip
    ));
  }, []);

  const removeSip = useCallback((id: string) => {
    setSips(prev => prev.filter(sip => sip.id !== id));
  }, []);

  // One-time investment management
  const addOneTimeInvestment = useCallback(() => {
    const newInvestment: OneTimeInvestment = {
      id: uuidv4(),
      name: '',
      amount: 0,
      date: new Date(),
      autoApply: true
    };
    setOneTimeInvestments(prev => [...prev, newInvestment]);
  }, []);

  const updateOneTimeInvestment = useCallback((updatedInvestment: OneTimeInvestment) => {
    setOneTimeInvestments(prev => prev.map(investment => 
      investment.id === updatedInvestment.id ? updatedInvestment : investment
    ));
  }, []);

  const removeOneTimeInvestment = useCallback((id: string) => {
    setOneTimeInvestments(prev => prev.filter(investment => investment.id !== id));
  }, []);

  // Calculate monthly income
  const calculateMonthlyIncome = useCallback(() => {
    return incomes.reduce((total, income) => {
      if (income.frequency === 'Monthly') {
        return total + income.amount;
      } else if (income.frequency === 'Quarterly') {
        return total + (income.amount / 3);
      } else if (income.frequency === 'One-time') {
        return total + (income.amount / 12); // Spread over a year
      }
      return total;
    }, 0);
  }, [incomes]);

  // Calculate total EMI
  const calculateTotalEMI = useCallback(() => {
    return loans.reduce((total, loan) => total + loan.emi, 0);
  }, [loans]);

  // Calculate total SIP
  const calculateTotalSIP = useCallback(() => {
    return sips.reduce((total, sip) => total + sip.monthlyAmount, 0);
  }, [sips]);

  // Calculate monthly surplus
  const calculateMonthlySurplus = useCallback(() => {
    const monthlyIncome = calculateMonthlyIncome();
    const totalEMI = calculateTotalEMI();
    const totalSIP = calculateTotalSIP();
    return monthlyIncome - totalEMI - totalSIP;
  }, [calculateMonthlyIncome, calculateTotalEMI, calculateTotalSIP]);

  // Calculate SIP corpus after n years
  const calculateSIPCorpus = useCallback((sip: SIP, years: number) => {
    const monthlyRate = sip.expectedReturn / 100 / 12;
    const totalMonths = years * 12 - sip.startDelay;
    
    if (totalMonths <= 0) return 0;
    
    // SIP formula: P * ((1 + r)^n - 1) / r * (1 + r)
    return sip.monthlyAmount * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
      (1 + monthlyRate);
  }, []);

  // Calculate loan balance after n years
  const calculateLoanBalance = useCallback((loan: Loan, years: number) => {
    const totalMonths = loan.tenureRemainingYears * 12 + loan.tenureRemainingMonths;
    const monthsAfterNYears = years * 12;
    
    if (monthsAfterNYears >= totalMonths) return 0;
    
    if (loan.interestType === 'Simple') {
      // Simple interest calculation
      const monthlyPayment = loan.emi;
      const monthlyInterestRate = loan.interestRate / 100 / 12;
      const principalPaidMonthly = monthlyPayment - (loan.principalRemaining * monthlyInterestRate);
      const principalPaid = principalPaidMonthly * monthsAfterNYears;
      return Math.max(0, loan.principalRemaining - principalPaid);
    } else {
      // Compound interest calculation (standard EMI formula)
      const monthlyInterestRate = loan.interestRate / 100 / 12;
      const remainingMonths = totalMonths - monthsAfterNYears;
      
      // Calculate remaining balance: P * (1+r)^n - (EMI * ((1+r)^n - 1) / r)
      return loan.principalRemaining * Math.pow(1 + monthlyInterestRate, monthsAfterNYears) - 
        (loan.emi * ((Math.pow(1 + monthlyInterestRate, monthsAfterNYears) - 1) / monthlyInterestRate));
    }
  }, []);

  // Calculate yearly projections
  const calculateYearlyProjections = useCallback((): YearlyProjection[] => {
    const projections: YearlyProjection[] = [];
    const monthlyIncome = calculateMonthlyIncome();
    const totalEMI = calculateTotalEMI();
    const totalSIP = calculateTotalSIP();
    const monthlySurplus = calculateMonthlySurplus();
    
    for (let year = 1; year <= calculationYears; year++) {
      const loanBalances: Record<string, number> = {};
      let totalLoanBalance = 0;
      
      // Calculate loan balances
      loans.forEach(loan => {
        const balance = calculateLoanBalance(loan, year);
        loanBalances[loan.id] = balance;
        totalLoanBalance += balance;
      });
      
      const sipCorpuses: Record<string, number> = {};
      let totalSIPCorpus = 0;
      
      // Calculate SIP corpuses
      sips.forEach(sip => {
        const corpus = calculateSIPCorpus(sip, year);
        sipCorpuses[sip.id] = corpus;
        totalSIPCorpus += corpus;
      });
      
      // Calculate net worth
      const netWorth = totalSIPCorpus - totalLoanBalance;
      
      projections.push({
        year,
        totalIncome: monthlyIncome * 12,
        totalEMI: totalEMI * 12,
        totalSIP: totalSIP * 12,
        surplus: monthlySurplus * 12,
        netWorth,
        loans: loanBalances,
        sips: sipCorpuses
      });
    }
    
    return projections;
  }, [
    calculationYears, 
    calculateMonthlyIncome, 
    calculateTotalEMI, 
    calculateTotalSIP, 
    calculateMonthlySurplus, 
    calculateLoanBalance, 
    calculateSIPCorpus, 
    loans, 
    sips
  ]);

  // Calculate optimal allocations
  const calculateOptimalAllocations = useCallback((): OptimalAllocation[] => {
    const allocations: OptimalAllocation[] = [];
    const highInterestLoans = loans
      .filter(loan => loan.prepaymentAllowed && loan.interestRate > 0)
      .sort((a, b) => b.interestRate - a.interestRate);
    
    const highReturnSIPs = sips
      .sort((a, b) => b.expectedReturn - a.expectedReturn);
    
    // If we have high interest loans (>10%), prioritize paying them off
    if (highInterestLoans.length > 0 && highInterestLoans[0].interestRate > 10) {
      allocations.push({
        loanId: highInterestLoans[0].id,
        percentage: 70,
        reason: `Prioritize paying off high interest ${highInterestLoans[0].type} loan at ${highInterestLoans[0].interestRate}% first`
      });
      
      // If we have high return SIPs, allocate some portion to them
      if (highReturnSIPs.length > 0 && highReturnSIPs[0].expectedReturn > highInterestLoans[0].interestRate) {
        allocations.push({
          sipId: highReturnSIPs[0].id,
          percentage: 30,
          reason: `Allocate some portion to ${highReturnSIPs[0].type} SIP with expected return of ${highReturnSIPs[0].expectedReturn}%`
        });
      } else if (highReturnSIPs.length > 0) {
        allocations.push({
          sipId: highReturnSIPs[0].id,
          percentage: 30,
          reason: `Diversify with some investment in ${highReturnSIPs[0].type} SIP`
        });
      }
    } 
    // If highest loan interest is less than best SIP return, prioritize SIP
    else if (highReturnSIPs.length > 0 && 
             (highInterestLoans.length === 0 || 
              highReturnSIPs[0].expectedReturn > highInterestLoans[0].interestRate + 2)) {
      allocations.push({
        sipId: highReturnSIPs[0].id,
        percentage: 70,
        reason: `Prioritize investing in ${highReturnSIPs[0].type} SIP with expected return of ${highReturnSIPs[0].expectedReturn}%`
      });
      
      if (highInterestLoans.length > 0) {
        allocations.push({
          loanId: highInterestLoans[0].id,
          percentage: 30,
          reason: `Allocate some portion to paying off ${highInterestLoans[0].type} loan at ${highInterestLoans[0].interestRate}%`
        });
      } else if (highReturnSIPs.length > 1) {
        allocations.push({
          sipId: highReturnSIPs[1].id,
          percentage: 30,
          reason: `Diversify with some investment in ${highReturnSIPs[1].type} SIP`
        });
      }
    }
    // Balanced approach when interest rates and returns are comparable
    else if (highInterestLoans.length > 0 && highReturnSIPs.length > 0) {
      allocations.push({
        loanId: highInterestLoans[0].id,
        percentage: 50,
        reason: `Balance between paying off ${highInterestLoans[0].type} loan at ${highInterestLoans[0].interestRate}%`
      });
      
      allocations.push({
        sipId: highReturnSIPs[0].id,
        percentage: 50,
        reason: `and investing in ${highReturnSIPs[0].type} SIP with expected return of ${highReturnSIPs[0].expectedReturn}%`
      });
    }
    
    return allocations;
  }, [loans, sips]);

  // Calculate arbitrage score
  const calculateArbitrageScore = useCallback((): number => {
    if (loans.length === 0 || sips.length === 0) return 0;
    
    const avgLoanInterest = loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length;
    const avgSIPReturn = sips.reduce((sum, sip) => sum + sip.expectedReturn, 0) / sips.length;
    
    // Score is the difference between average SIP return and average loan interest
    // Positive score means SIPs are more beneficial, negative means loan repayment is better
    return avgSIPReturn - avgLoanInterest;
  }, [loans, sips]);

  // Generate alerts
  const generateAlerts = useCallback((): string[] => {
    const alerts: string[] = [];
    const monthlySurplus = calculateMonthlySurplus();
    
    // Check if expenses exceed income
    if (monthlySurplus < 0) {
      alerts.push('Warning: Your monthly expenses exceed your income. Consider reducing EMIs or SIPs.');
    }
    
    // Check for high interest loans
    loans.forEach(loan => {
      if (loan.interestRate > 15) {
        alerts.push(`High interest alert: Your ${loan.type} loan has a very high interest rate of ${loan.interestRate}%. Consider refinancing.`);
      }
    });
    
    // Check for unrealistic SIP returns
    sips.forEach(sip => {
      if (sip.expectedReturn > 15) {
        alerts.push(`Unrealistic return alert: Expected return of ${sip.expectedReturn}% for ${sip.name} SIP may be too optimistic.`);
      }
    });
    
    // Check loan to income ratio
    const totalEMI = calculateTotalEMI();
    const monthlyIncome = calculateMonthlyIncome();
    const emiToIncomeRatio = totalEMI / monthlyIncome;
    
    if (emiToIncomeRatio > 0.5) {
      alerts.push(`High EMI alert: Your EMIs constitute ${(emiToIncomeRatio * 100).toFixed(1)}% of your income, which is very high.`);
    }
    
    return alerts;
  }, [calculateMonthlySurplus, loans, sips, calculateTotalEMI, calculateMonthlyIncome]);

  // Calculate results
  const calculateResults = useCallback(() => {
    setIsCalculating(true);
    
    try {
      const yearlyProjections = calculateYearlyProjections();
      const optimalAllocations = calculateOptimalAllocations();
      const arbitrageScore = calculateArbitrageScore();
      const alerts = generateAlerts();
      
      setResult({
        yearlyProjections,
        optimalAllocations,
        arbitrageScore,
        alerts
      });
    } catch (error) {
      console.error('Error calculating results:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [
    calculateYearlyProjections, 
    calculateOptimalAllocations, 
    calculateArbitrageScore, 
    generateAlerts
  ]);

  // Get AI SIP suggestions based on type
  const getAISIPSuggestion = useCallback((type: SIPType): number => {
    return DEFAULT_CAGR[type];
  }, []);

  // Reset calculator
  const resetCalculator = useCallback(() => {
    setIncomes([]);
    setLoans([]);
    setSips([]);
    setOneTimeInvestments([]);
    setResult(null);
  }, []);

  // Summary stats
  const summaryStats = useMemo(() => {
    return {
      monthlyIncome: calculateMonthlyIncome(),
      totalEMI: calculateTotalEMI(),
      totalSIP: calculateTotalSIP(),
      monthlySurplus: calculateMonthlySurplus()
    };
  }, [calculateMonthlyIncome, calculateTotalEMI, calculateTotalSIP, calculateMonthlySurplus]);

  return {
    incomes,
    loans,
    sips,
    oneTimeInvestments,
    calculationYears,
    isCalculating,
    result,
    summaryStats,
    addIncome,
    updateIncome,
    removeIncome,
    addLoan,
    updateLoan,
    removeLoan,
    addSip,
    updateSip,
    removeSip,
    addOneTimeInvestment,
    updateOneTimeInvestment,
    removeOneTimeInvestment,
    setCalculationYears,
    calculateResults,
    getAISIPSuggestion,
    resetCalculator
  };
};