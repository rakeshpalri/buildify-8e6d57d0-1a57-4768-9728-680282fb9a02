
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loan, LoanType, InterestType } from '@/types/calculator';
import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface LoanFormProps {
  loans: Loan[];
  addLoan: () => void;
  updateLoan: (loan: Loan) => void;
  removeLoan: (id: string) => void;
}

const loanTypes: LoanType[] = ['Tractor', 'KCC', 'Home', 'Personal', 'Relatives', 'Credit Card'];
const interestTypes: InterestType[] = ['Simple', 'Compound'];

const LoanForm: React.FC<LoanFormProps> = ({ 
  loans, 
  addLoan, 
  updateLoan, 
  removeLoan 
}) => {
  const handleNumberChange = (id: string, field: keyof Loan, value: string) => {
    const loan = loans.find(loan => loan.id === id);
    if (loan) {
      updateLoan({
        ...loan,
        [field]: parseFloat(value) || 0
      });
    }
  };

  const handleTypeChange = (id: string, value: LoanType) => {
    const loan = loans.find(loan => loan.id === id);
    if (loan) {
      updateLoan({
        ...loan,
        type: value
      });
    }
  };

  const handleInterestTypeChange = (id: string, value: InterestType) => {
    const loan = loans.find(loan => loan.id === id);
    if (loan) {
      updateLoan({
        ...loan,
        interestType: value
      });
    }
  };

  const handlePrepaymentAllowedChange = (id: string, value: boolean) => {
    const loan = loans.find(loan => loan.id === id);
    if (loan) {
      updateLoan({
        ...loan,
        prepaymentAllowed: value
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loans</CardTitle>
        <CardDescription>
          Add all your loans to calculate your total EMI and debt burden
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No loans added yet</p>
            <Button onClick={addLoan}>
              <Plus className="h-4 w-4 mr-2" />
              Add Loan
            </Button>
          </div>
        ) : (
          <>
            {loans.map((loan) => (
              <div key={loan.id} className="mb-8 border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`loan-type-${loan.id}`}>Loan Type</Label>
                    <Select
                      value={loan.type}
                      onValueChange={(value) => handleTypeChange(loan.id, value as LoanType)}
                    >
                      <SelectTrigger id={`loan-type-${loan.id}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {loanTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`loan-principal-${loan.id}`}>Principal Remaining (₹)</Label>
                    <Input
                      id={`loan-principal-${loan.id}`}
                      type="number"
                      placeholder="Principal amount"
                      value={loan.principalRemaining || ''}
                      onChange={(e) => handleNumberChange(loan.id, 'principalRemaining', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`loan-emi-${loan.id}`}>EMI/Month (₹)</Label>
                    <Input
                      id={`loan-emi-${loan.id}`}
                      type="number"
                      placeholder="EMI amount"
                      value={loan.emi || ''}
                      onChange={(e) => handleNumberChange(loan.id, 'emi', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`loan-interest-type-${loan.id}`}>Interest Type</Label>
                    <Select
                      value={loan.interestType}
                      onValueChange={(value) => handleInterestTypeChange(loan.id, value as InterestType)}
                    >
                      <SelectTrigger id={`loan-interest-type-${loan.id}`}>
                        <SelectValue placeholder="Select interest type" />
                      </SelectTrigger>
                      <SelectContent>
                        {interestTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`loan-interest-rate-${loan.id}`}>Interest Rate (%)</Label>
                    <Input
                      id={`loan-interest-rate-${loan.id}`}
                      type="number"
                      placeholder="Interest rate"
                      value={loan.interestRate || ''}
                      onChange={(e) => handleNumberChange(loan.id, 'interestRate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`loan-tenure-years-${loan.id}`}>Tenure Remaining (Years)</Label>
                    <Input
                      id={`loan-tenure-years-${loan.id}`}
                      type="number"
                      placeholder="Years"
                      value={loan.tenureRemainingYears || ''}
                      onChange={(e) => handleNumberChange(loan.id, 'tenureRemainingYears', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`loan-tenure-months-${loan.id}`}>Tenure Remaining (Months)</Label>
                    <Input
                      id={`loan-tenure-months-${loan.id}`}
                      type="number"
                      placeholder="Months"
                      min={0}
                      max={11}
                      value={loan.tenureRemainingMonths || ''}
                      onChange={(e) => handleNumberChange(loan.id, 'tenureRemainingMonths', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`loan-prepayment-${loan.id}`}
                      checked={loan.prepaymentAllowed}
                      onCheckedChange={(checked) => handlePrepaymentAllowedChange(loan.id, checked)}
                    />
                    <Label htmlFor={`loan-prepayment-${loan.id}`}>Prepayment Allowed</Label>
                  </div>
                  {loan.prepaymentAllowed && (
                    <div>
                      <Label htmlFor={`loan-penalty-${loan.id}`}>Prepayment Penalty (%)</Label>
                      <Input
                        id={`loan-penalty-${loan.id}`}
                        type="number"
                        placeholder="Penalty percentage"
                        value={loan.prepaymentPenalty || ''}
                        onChange={(e) => handleNumberChange(loan.id, 'prepaymentPenalty', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeLoan(loan.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Loan
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={addLoan}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Loan
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanForm;