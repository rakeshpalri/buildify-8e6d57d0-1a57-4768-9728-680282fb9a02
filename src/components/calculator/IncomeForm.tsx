
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Income, IncomeType, IncomeFrequency } from '@/types/calculator';
import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface IncomeFormProps {
  incomes: Income[];
  addIncome: () => void;
  updateIncome: (income: Income) => void;
  removeIncome: (id: string) => void;
}

const incomeTypes: IncomeType[] = ['Salary', 'Freelance', 'Farming', 'Business', 'Rental', 'Other'];
const incomeFrequencies: IncomeFrequency[] = ['Monthly', 'Quarterly', 'One-time'];

const IncomeForm: React.FC<IncomeFormProps> = ({ 
  incomes, 
  addIncome, 
  updateIncome, 
  removeIncome 
}) => {
  const handleAmountChange = (id: string, value: string) => {
    const income = incomes.find(income => income.id === id);
    if (income) {
      updateIncome({
        ...income,
        amount: parseFloat(value) || 0
      });
    }
  };

  const handleTypeChange = (id: string, value: IncomeType) => {
    const income = incomes.find(income => income.id === id);
    if (income) {
      updateIncome({
        ...income,
        type: value
      });
    }
  };

  const handleFrequencyChange = (id: string, value: IncomeFrequency) => {
    const income = incomes.find(income => income.id === id);
    if (income) {
      updateIncome({
        ...income,
        frequency: value
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Sources</CardTitle>
        <CardDescription>
          Add all your income sources to calculate your total monthly cash flow
        </CardDescription>
      </CardHeader>
      <CardContent>
        {incomes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No income sources added yet</p>
            <Button onClick={addIncome}>
              <Plus className="h-4 w-4 mr-2" />
              Add Income Source
            </Button>
          </div>
        ) : (
          <>
            {incomes.map((income, index) => (
              <div key={income.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label htmlFor={`income-amount-${income.id}`}>Amount (₹)</Label>
                  <Input
                    id={`income-amount-${income.id}`}
                    type="number"
                    placeholder="Amount"
                    value={income.amount || ''}
                    onChange={(e) => handleAmountChange(income.id, e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`income-type-${income.id}`}>Income Type</Label>
                  <Select
                    value={income.type}
                    onValueChange={(value) => handleTypeChange(income.id, value as IncomeType)}
                  >
                    <SelectTrigger id={`income-type-${income.id}`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`income-frequency-${income.id}`}>Frequency</Label>
                  <Select
                    value={income.frequency}
                    onValueChange={(value) => handleFrequencyChange(income.id, value as IncomeFrequency)}
                  >
                    <SelectTrigger id={`income-frequency-${income.id}`}>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeFrequencies.map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeIncome(income.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={addIncome}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Income Source
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeForm;