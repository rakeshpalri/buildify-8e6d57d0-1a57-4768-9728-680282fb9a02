
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator';
import IncomeForm from '@/components/calculator/IncomeForm';
import LoanForm from '@/components/calculator/LoanForm';
import SipForm from '@/components/calculator/SipForm';
import OneTimeForm from '@/components/calculator/OneTimeForm';
import ResultsDashboard from '@/components/calculator/ResultsDashboard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calculator, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinanceCalculator: React.FC = () => {
  const calculator = useFinanceCalculator();
  const [activeTab, setActiveTab] = useState('income');
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    calculator.calculateResults();
    setShowResults(true);
  };

  const handleBackToInputs = () => {
    setShowResults(false);
  };

  const handleExportPDF = () => {
    alert('PDF export functionality will be implemented here');
  };

  const handleShareResults = () => {
    alert('Share results functionality will be implemented here');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Personal Finance Arbitrage Calculator</h1>
        </div>
        <div className="flex gap-2">
          {calculator.result && (
            <>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={handleShareResults}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </>
          )}
        </div>
      </div>

      {!showResults ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>
                Current financial overview based on your inputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                  <p className="text-2xl font-bold">₹{calculator.summaryStats.monthlyIncome.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total EMI</p>
                  <p className="text-2xl font-bold">₹{calculator.summaryStats.totalEMI.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total SIP</p>
                  <p className="text-2xl font-bold">₹{calculator.summaryStats.totalSIP.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Surplus</p>
                  <p className={`text-2xl font-bold ${calculator.summaryStats.monthlySurplus < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ₹{calculator.summaryStats.monthlySurplus.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="income">Income Sources</TabsTrigger>
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
                getAISIPSuggestion={calculator.getAISIPSuggestion}
              />
            </TabsContent>
            <TabsContent value="onetime">
              <OneTimeForm 
                oneTimeInvestments={calculator.oneTimeInvestments}
                addOneTimeInvestment={calculator.addOneTimeInvestment}
                updateOneTimeInvestment={calculator.updateOneTimeInvestment}
                removeOneTimeInvestment={calculator.removeOneTimeInvestment}
              />
            </TabsContent>
          </Tabs>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Calculation Settings</CardTitle>
              <CardDescription>
                Configure how far into the future you want to project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="years">Projection Years</Label>
                  <Input 
                    id="years"
                    type="number"
                    min={1}
                    max={30}
                    value={calculator.calculationYears}
                    onChange={(e) => calculator.setCalculationYears(parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={calculator.resetCalculator}>
              Reset All
            </Button>
            <Button 
              onClick={handleCalculate} 
              disabled={calculator.incomes.length === 0 || (calculator.loans.length === 0 && calculator.sips.length === 0)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Results
            </Button>
          </div>
        </>
      ) : (
        <>
          <ResultsDashboard result={calculator.result} />
          <div className="mt-6">
            <Button onClick={handleBackToInputs}>
              Back to Inputs
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceCalculator;