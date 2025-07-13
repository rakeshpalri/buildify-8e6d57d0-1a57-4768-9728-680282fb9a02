
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, Share2 } from 'lucide-react';
import { ArbitrageResult, Loan, SIP } from '@/types/calculator';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsDashboardProps {
  results: ArbitrageResult | null;
  loans: Loan[];
  sips: SIP[];
  isCalculating: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, loans, sips, isCalculating }) => {
  const [activeTab, setActiveTab] = useState('summary');

  if (isCalculating) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Calculating your financial projections...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Results Available</h2>
        <p className="text-muted-foreground">Please enter your financial details and run the calculation.</p>
      </div>
    );
  }

  const { yearlyProjections, optimalAllocations, arbitrageScore, alerts } = results;

  // Prepare data for charts
  const netWorthData = yearlyProjections.map(projection => ({
    year: `Year ${projection.year}`,
    netWorth: projection.netWorth
  }));

  const loanBalanceData = yearlyProjections.map(projection => {
    const data: any = { year: `Year ${projection.year}` };
    loans.forEach(loan => {
      data[loan.type] = projection.loans[loan.id] || 0;
    });
    return data;
  });

  const sipGrowthData = yearlyProjections.map(projection => {
    const data: any = { year: `Year ${projection.year}` };
    sips.forEach(sip => {
      data[sip.name] = projection.sips[sip.id] || 0;
    });
    return data;
  });

  const cashFlowData = yearlyProjections.map(projection => ({
    year: `Year ${projection.year}`,
    Income: projection.totalIncome,
    EMI: projection.totalEMI,
    SIP: projection.totalSIP,
    Surplus: projection.surplus
  }));

  // Prepare data for pie charts
  const loanBreakupData = loans.map(loan => ({
    name: loan.type,
    value: loan.principalRemaining
  }));

  const sipAllocationData = sips.map(sip => ({
    name: sip.name,
    value: sip.monthlyAmount * 12
  }));

  const handleDownloadPDF = () => {
    alert('PDF download functionality would be implemented here');
  };

  const handleShareResults = () => {
    alert('Share results functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Alert key={index} variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Financial Alert</AlertTitle>
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Arbitrage Score</CardTitle>
            <CardDescription>
              {arbitrageScore > 0 
                ? 'Investing is better than loan repayment' 
                : 'Loan repayment is better than investing'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${arbitrageScore > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {arbitrageScore.toFixed(2)}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {arbitrageScore > 0 
                ? 'Your investments are likely to outperform your loan interest costs' 
                : 'Your loan interest costs are higher than expected investment returns'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Worth Growth</CardTitle>
            <CardDescription>Projected over time</CardDescription>
          </CardHeader>
          <CardContent>
            {yearlyProjections.length > 0 && (
              <div className="text-3xl font-bold">
                ₹{yearlyProjections[yearlyProjections.length - 1].netWorth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Projected net worth after {yearlyProjections.length} years
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimal Allocation</CardTitle>
            <CardDescription>For your surplus funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {optimalAllocations.map((allocation, index) => {
                const loanName = allocation.loanId ? loans.find(l => l.id === allocation.loanId)?.type : null;
                const sipName = allocation.sipId ? sips.find(s => s.id === allocation.sipId)?.name : null;
                
                return (
                  <div key={index} className="flex justify-between">
                    <span>{loanName || sipName}</span>
                    <span className="font-medium">{allocation.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleShareResults}>
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
      </div>

      {/* Detailed Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Net Worth Projection</CardTitle>
              <CardDescription>Your projected net worth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={netWorthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Net Worth']} />
                    <Legend />
                    <Line type="monotone" dataKey="netWorth" stroke="#8884d8" activeDot={{ r: 8 }} name="Net Worth" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimal Allocation Reasons</CardTitle>
                <CardDescription>Why we recommend this allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimalAllocations.map((allocation, index) => {
                    const loanName = allocation.loanId ? loans.find(l => l.id === allocation.loanId)?.type : null;
                    const sipName = allocation.sipId ? sips.find(s => s.id === allocation.sipId)?.name : null;
                    
                    return (
                      <div key={index} className="p-4 border rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{loanName || sipName}</span>
                          <span className="font-bold">{allocation.percentage}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{allocation.reason}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Year-by-Year Projection</CardTitle>
                <CardDescription>Detailed yearly financial data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Year</th>
                        <th className="text-right py-2">Income</th>
                        <th className="text-right py-2">EMI</th>
                        <th className="text-right py-2">SIP</th>
                        <th className="text-right py-2">Net Worth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyProjections.map((projection) => (
                        <tr key={projection.year} className="border-b">
                          <td className="py-2">Year {projection.year}</td>
                          <td className="text-right py-2">₹{projection.totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="text-right py-2">₹{projection.totalEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="text-right py-2">₹{projection.totalSIP.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="text-right py-2">₹{projection.netWorth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="loans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Balance Projection</CardTitle>
                <CardDescription>How your loans will decrease over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={loanBalanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
                      <Legend />
                      {loans.map((loan, index) => (
                        <Line 
                          key={loan.id} 
                          type="monotone" 
                          dataKey={loan.type} 
                          stroke={COLORS[index % COLORS.length]} 
                          activeDot={{ r: 8 }} 
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Breakup</CardTitle>
                <CardDescription>Distribution of your current loans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={loanBreakupData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {loanBreakupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="investments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SIP Growth Projection</CardTitle>
                <CardDescription>How your investments will grow over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sipGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
                      <Legend />
                      {sips.map((sip, index) => (
                        <Line 
                          key={sip.id} 
                          type="monotone" 
                          dataKey={sip.name} 
                          stroke={COLORS[index % COLORS.length]} 
                          activeDot={{ r: 8 }} 
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SIP Allocation</CardTitle>
                <CardDescription>Distribution of your current SIPs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sipAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {sipAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}/year`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>Your income, expenses, and surplus over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
                    <Legend />
                    <Bar dataKey="Income" fill="#8884d8" />
                    <Bar dataKey="EMI" fill="#82ca9d" />
                    <Bar dataKey="SIP" fill="#ffc658" />
                    <Bar dataKey="Surplus" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDashboard;