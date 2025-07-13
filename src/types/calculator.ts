
export type IncomeType = 'Salary' | 'Freelance' | 'Farming' | 'Business' | 'Rental' | 'Other';
export type IncomeFrequency = 'Monthly' | 'Quarterly' | 'One-time';
export type LoanType = 'Tractor' | 'KCC' | 'Home' | 'Personal' | 'Relatives' | 'Credit Card';
export type InterestType = 'Simple' | 'Compound';
export type SIPType = 'Equity' | 'Hybrid' | 'Debt';

export interface Income {
  id: string;
  amount: number;
  type: IncomeType;
  frequency: IncomeFrequency;
}

export interface Loan {
  id: string;
  type: LoanType;
  principalRemaining: number;
  emi: number;
  interestType: InterestType;
  interestRate: number;
  tenureRemainingYears: number;
  tenureRemainingMonths: number;
  prepaymentAllowed: boolean;
  prepaymentPenalty: number;
}

export interface SIP {
  id: string;
  name: string;
  type: SIPType;
  monthlyAmount: number;
  expectedReturn: number;
  investmentHorizon: number;
  startDelay: number;
}

export interface OneTimeInvestment {
  id: string;
  name: string;
  amount: number;
  date: Date;
  autoApply: boolean;
}

export interface YearlyProjection {
  year: number;
  totalIncome: number;
  totalEMI: number;
  totalSIP: number;
  surplus: number;
  netWorth: number;
  loans: Record<string, number>; // loan id -> remaining amount
  sips: Record<string, number>; // sip id -> accumulated amount
}

export interface OptimalAllocation {
  loanId?: string;
  sipId?: string;
  percentage: number;
  reason: string;
}

export interface ArbitrageResult {
  yearlyProjections: YearlyProjection[];
  optimalAllocations: OptimalAllocation[];
  arbitrageScore: number;
  alerts: string[];
}