
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator';
import IncomeForm from '@/components/calculator/IncomeForm';
import LoanForm from '@/components/calculator/LoanForm';
import SipForm from '@/components/calculator/SipForm';
import OneTimeForm from '@/components/calculator/OneTimeForm';
import ResultsDashboard from '@/components/calculator/ResultsDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinanceCalculator: React.FC = () => {
  const calculator = useFinanceCalculator();
  const [activeTab, setActiveTab] = useState('income');
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    calculator.runCalculation();
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Finance Arbitrage Calculator</h1>
        </div>
        
        {!showResults && (
          <Button 
            onClick={handleCalculate} 
            disabled={calculator.isCalculating || (calculator.incomes.length === 0 && calculator.loans.length === 0 && calculator.sips.length === 0)}
            className="flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            Calculate Results
          </Button>
        )}
        
        {showResults && (
          <Button onClick={handleBack} variant="outline">
            Back to Inputs
          </Button>
        )}
      </div>

      {!showResults ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monthly Income</CardTitle>
                <CardDescription>₹{calculator.monthlyIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monthly EMI</CardTitle>
                <CardDescription>₹{calculator.totalEMI.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monthly SIP</CardTitle>
                <CardDescription>₹{calculator.totalSIP.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Monthly Surplus</CardTitle>
              <CardDescription className={calculator.monthlySurplus < 0 ? 'text-red-500' : 'text-green-500'}>
                ₹{calculator.monthlySurplus.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </CardDescription>
            </CardHeader>
          </Card>

          {calculator.monthlySurplus < 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Your monthly expenses exceed your income. Consider reducing your EMIs or SIPs.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="sips">SIPs</TabsTrigger>
              <TabsTrigger value="onetime">One-Time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="income">
              <IncomeForm 
                incomes={calculator.incomes}
                addIncome={calculator.addIncome}
                updateIncome={calculator.updateIncome}
                removeIncome={calculator.removeIncome}
              />
            </TabsContent>
            
            <TabsContent value="loans">
              <LoanForm 
                loans={calculator.loans}
                addLoan={calculator.addLoan}
                updateLoan={calculator.updateLoan}
                removeLoan={calculator.removeLoan}
              />
            </TabsContent>
            
            <TabsContent value="sips">
              <SipForm 
                sips={calculator.sips}
                addSip={calculator.addSip}
                updateSip={calculator.updateSip}
                removeSip={calculator.removeSip}
                suggestSipReturn={calculator.suggestSipReturn}
              />
            </TabsContent>
            
            <TabsContent value="onetime">
              <OneTimeForm 
                investments={calculator.oneTimeInvestments}
                addInvestment={calculator.addOneTimeInvestment}
                updateInvestment={calculator.updateOneTimeInvestment}
                removeInvestment={calculator.removeOneTimeInvestment}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <ResultsDashboard 
          results={calculator.calculationResults}
          loans={calculator.loans}
          sips={calculator.sips}
          isCalculating={calculator.isCalculating}
        />
      )}
    </div>
  );
};

export default FinanceCalculator;