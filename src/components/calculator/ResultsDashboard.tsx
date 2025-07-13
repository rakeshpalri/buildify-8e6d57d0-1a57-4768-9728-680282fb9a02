
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArbitrageResult, Loan, SIP } from '@/types/calculator';
import { AlertCircle, TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface ResultsDashboardProps {
  result: ArbitrageResult | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!result) {
    return (
      <div className="text-center py-12">
        <p>No calculation results available. Please calculate first.</p>
      </div>
    );
  }

  // Format data for charts
  const netWorthData = result.yearlyProjections.map(projection => ({
    year: projection.year,
    netWorth: projection.netWorth
  }));

  const cashFlowData = result.yearlyProjections.map(projection => ({
    year: projection.year,
    income: projection.totalIncome,
    emi: projection.totalEMI,
    sip: projection.totalSIP,
    surplus: projection.surplus
  }));

  // Get the last year projection for pie charts
  const lastYearProjection = result.yearlyProjections[result.yearlyProjections.length - 1];
  
  // Prepare loan distribution data
  const loanDistributionData = Object.entries(lastYearProjection.loans)
    .filter(([_, value]) => value > 0)
    .map(([id, value]) => ({
      name: `Loan ${id.substring(0, 4)}`,
      value
    }));

  // Prepare SIP distribution data
  const sipDistributionData = Object.entries(lastYearProjection.sips)
    .filter(([_, value]) => value > 0)
    .map(([id, value]) => ({
      name: `SIP ${id.substring(0, 4)}`,
      value
    }));

  return (
    <div>
      {result.alerts.length > 0 && (
        <div className="mb-6 space-y-4">
          {result.alerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Alert</AlertTitle>
              <AlertDescription>
                {alert}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Arbitrage Score: {result.arbitrageScore.toFixed(2)}</CardTitle>
          <CardDescription>
            {result.arbitrageScore > 0 
              ? 'Positive score indicates investing in SIPs may be more beneficial than loan prepayment'
              : 'Negative score indicates loan prepayment may be more beneficial than investing in SIPs'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            {result.arbitrageScore > 0 ? (
              <div className="flex items-center text-green-500">
                <TrendingUp className="h-8 w-8 mr-2" />
                <span className="text-2xl font-bold">Favor Investment</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <TrendingDown className="h-8 w-8 mr-2" />
                <span className="text-2xl font-bold">Favor Loan Repayment</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Optimal Allocation Suggestions</CardTitle>
          <CardDescription>
            How to best allocate your surplus cash flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.optimalAllocations.map((allocation, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">
                    {allocation.loanId 
                      ? `Loan Repayment (${allocation.percentage}%)`
                      : `SIP Investment (${allocation.percentage}%)`}
                  </p>
                  <p className="text-sm text-muted-foreground">{allocation.reason}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold">{allocation.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="networth">Net Worth</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Year-by-Year Projection</CardTitle>
              <CardDescription>
                Detailed financial projection over the calculation period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Year</th>
                      <th className="p-2 text-right">Income</th>
                      <th className="p-2 text-right">EMI</th>
                      <th className="p-2 text-right">SIP</th>
                      <th className="p-2 text-right">Surplus</th>
                      <th className="p-2 text-right">Net Worth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlyProjections.map((projection) => (
                      <tr key={projection.year} className="border-b">
                        <td className="p-2 text-left">{projection.year}</td>
                        <td className="p-2 text-right">₹{projection.totalIncome.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-right">₹{projection.totalEMI.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-right">₹{projection.totalSIP.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-right">₹{projection.surplus.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-right">₹{projection.netWorth.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="networth">
          <Card>
            <CardHeader>
              <CardTitle>Net Worth Growth</CardTitle>
              <CardDescription>
                Visualization of your net worth growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={netWorthData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }} />
                    <YAxis 
                      tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                      label={{ value: 'Net Worth (₹)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Net Worth']} />
                    <Legend />
                    <Line type="monotone" dataKey="netWorth" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>
                Breakdown of your income, expenses, and surplus over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cashFlowData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#8884d8" />
                    <Bar dataKey="emi" name="EMI" fill="#82ca9d" />
                    <Bar dataKey="sip" name="SIP" fill="#ffc658" />
                    <Bar dataKey="surplus" name="Surplus" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Distribution</CardTitle>
                <CardDescription>
                  Breakdown of your loans at the end of the projection period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {loanDistributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={loanDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {loanDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No outstanding loans at the end of projection period</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SIP Distribution</CardTitle>
                <CardDescription>
                  Breakdown of your SIP investments at the end of the projection period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {sipDistributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={sipDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sipDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No SIP investments at the end of projection period</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDashboard;