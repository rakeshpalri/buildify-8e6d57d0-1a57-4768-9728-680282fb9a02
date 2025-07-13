
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { OneTimeInvestment } from '@/types/calculator';
import { PlusCircle, Trash2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

interface OneTimeFormProps {
  investments: OneTimeInvestment[];
  addInvestment: (investment: Omit<OneTimeInvestment, 'id'>) => void;
  updateInvestment: (id: string, investment: Partial<OneTimeInvestment>) => void;
  removeInvestment: (id: string) => void;
}

const OneTimeForm: React.FC<OneTimeFormProps> = ({ 
  investments, 
  addInvestment, 
  updateInvestment, 
  removeInvestment 
}) => {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [autoApply, setAutoApply] = useState<boolean>(true);

  const handleAddInvestment = () => {
    if (
      !name || 
      !amount || 
      !date ||
      isNaN(Number(amount))
    ) return;
    
    addInvestment({
      name,
      amount: Number(amount),
      date: new Date(date),
      autoApply
    });
    
    // Reset form
    setName('');
    setAmount('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setAutoApply(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>One-Time Investments/Income</CardTitle>
        <CardDescription>Add expected one-time investments or income</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Investment list */}
        {investments.length > 0 ? (
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-md">
                <div className="flex-1">
                  <Label htmlFor={`name-${investment.id}`}>Name</Label>
                  <Input
                    id={`name-${investment.id}`}
                    value={investment.name}
                    onChange={(e) => updateInvestment(investment.id, { name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex-1">
                  <Label htmlFor={`amount-${investment.id}`}>Amount (₹)</Label>
                  <Input
                    id={`amount-${investment.id}`}
                    type="number"
                    value={investment.amount}
                    onChange={(e) => updateInvestment(investment.id, { amount: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex-1">
                  <Label htmlFor={`date-${investment.id}`}>Expected Date</Label>
                  <Input
                    id={`date-${investment.id}`}
                    type="date"
                    value={format(new Date(investment.date), 'yyyy-MM-dd')}
                    onChange={(e) => updateInvestment(investment.id, { date: new Date(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`autoApply-${investment.id}`}>Auto Apply</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Automatically apply to best loan/investment</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Switch
                      id={`autoApply-${investment.id}`}
                      checked={investment.autoApply}
                      onCheckedChange={(checked) => updateInvestment(investment.id, { autoApply: checked })}
                    />
                    <Label htmlFor={`autoApply-${investment.id}`}>
                      {investment.autoApply ? 'Yes' : 'No'}
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => removeInvestment(investment.id)}
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
            No one-time investments added yet. Add your first one-time investment below.
          </div>
        )}
        
        {/* Add new investment form */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Add New One-Time Investment/Income</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., FD Maturity, Bonus"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 100000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Expected Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="autoApply">Auto Apply</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Automatically apply to best loan/investment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  id="autoApply"
                  checked={autoApply}
                  onCheckedChange={setAutoApply}
                />
                <Label htmlFor="autoApply">
                  {autoApply ? 'Yes' : 'No'}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAddInvestment} 
          disabled={
            !name || 
            !amount || 
            !date ||
            isNaN(Number(amount))
          }
          className="ml-auto flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add One-Time Investment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OneTimeForm;