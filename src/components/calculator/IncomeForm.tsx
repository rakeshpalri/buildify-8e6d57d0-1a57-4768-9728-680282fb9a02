
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Income, IncomeType, IncomeFrequency } from '@/types/calculator';
import { PlusCircle, Trash2 } from 'lucide-react';

interface IncomeFormProps {
  incomes: Income[];
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  removeIncome: (id: string) => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ incomes, addIncome, updateIncome, removeIncome }) => {
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<IncomeType>('Salary');
  const [frequency, setFrequency] = useState<IncomeFrequency>('Monthly');

  const handleAddIncome = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    addIncome({
      amount: Number(amount),
      type,
      frequency
    });
    
    // Reset form
    setAmount('');
    setType('Salary');
    setFrequency('Monthly');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Sources</CardTitle>
        <CardDescription>Add your regular and one-time income sources</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Income list */}
        {incomes.length > 0 ? (
          <div className="space-y-4">
            {incomes.map((income) => (
              <div key={income.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-md">
                <div className="flex-1">
                  <Label htmlFor={`amount-${income.id}`}>Amount (₹)</Label>
                  <Input
                    id={`amount-${income.id}`}
                    type="number"
                    value={income.amount}
                    onChange={(e) => updateIncome(income.id, { amount: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex-1">
                  <Label htmlFor={`type-${income.id}`}>Income Type</Label>
                  <Select
                    value={income.type}
                    onValueChange={(value: IncomeType) => updateIncome(income.id, { type: value })}
                  >
                    <SelectTrigger id={`type-${income.id}`} className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Farming">Farming</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Rental">Rental</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Label htmlFor={`frequency-${income.id}`}>Frequency</Label>
                  <Select
                    value={income.frequency}
                    onValueChange={(value: IncomeFrequency) => updateIncome(income.id, { frequency: value })}
                  >
                    <SelectTrigger id={`frequency-${income.id}`} className="mt-1">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => removeIncome(income.id)}
                    className="mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No income sources added yet. Add your first income source below.
          </div>
        )}
        
        {/* Add new income form */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Add New Income Source</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Income Type</Label>
              <Select value={type} onValueChange={(value: IncomeType) => setType(value)}>
                <SelectTrigger id="type" className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Farming">Farming</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Rental">Rental</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={(value: IncomeFrequency) => setFrequency(value)}>
                <SelectTrigger id="frequency" className="mt-1">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="One-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAddIncome} 
          disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
          className="ml-auto flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Income Source
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IncomeForm;