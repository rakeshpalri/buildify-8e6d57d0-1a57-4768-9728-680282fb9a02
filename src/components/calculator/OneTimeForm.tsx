
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { OneTimeInvestment } from '@/types/calculator';
import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface OneTimeFormProps {
  oneTimeInvestments: OneTimeInvestment[];
  addOneTimeInvestment: () => void;
  updateOneTimeInvestment: (investment: OneTimeInvestment) => void;
  removeOneTimeInvestment: (id: string) => void;
}

const OneTimeForm: React.FC<OneTimeFormProps> = ({ 
  oneTimeInvestments, 
  addOneTimeInvestment, 
  updateOneTimeInvestment, 
  removeOneTimeInvestment 
}) => {
  const handleNameChange = (id: string, value: string) => {
    const investment = oneTimeInvestments.find(investment => investment.id === id);
    if (investment) {
      updateOneTimeInvestment({
        ...investment,
        name: value
      });
    }
  };

  const handleAmountChange = (id: string, value: string) => {
    const investment = oneTimeInvestments.find(investment => investment.id === id);
    if (investment) {
      updateOneTimeInvestment({
        ...investment,
        amount: parseFloat(value) || 0
      });
    }
  };

  const handleDateChange = (id: string, date: Date | undefined) => {
    if (!date) return;
    
    const investment = oneTimeInvestments.find(investment => investment.id === id);
    if (investment) {
      updateOneTimeInvestment({
        ...investment,
        date
      });
    }
  };

  const handleAutoApplyChange = (id: string, value: boolean) => {
    const investment = oneTimeInvestments.find(investment => investment.id === id);
    if (investment) {
      updateOneTimeInvestment({
        ...investment,
        autoApply: value
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>One-Time Investments/Income</CardTitle>
        <CardDescription>
          Add one-time investments or income like FD maturity, bonus, etc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {oneTimeInvestments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No one-time investments added yet</p>
            <Button onClick={addOneTimeInvestment}>
              <Plus className="h-4 w-4 mr-2" />
              Add One-Time Investment
            </Button>
          </div>
        ) : (
          <>
            {oneTimeInvestments.map((investment) => (
              <div key={investment.id} className="mb-8 border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`investment-name-${investment.id}`}>Name</Label>
                    <Input
                      id={`investment-name-${investment.id}`}
                      placeholder="e.g., FD Maturity, Bonus"
                      value={investment.name}
                      onChange={(e) => handleNameChange(investment.id, e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`investment-amount-${investment.id}`}>Amount (₹)</Label>
                    <Input
                      id={`investment-amount-${investment.id}`}
                      type="number"
                      placeholder="Amount"
                      value={investment.amount || ''}
                      onChange={(e) => handleAmountChange(investment.id, e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`investment-date-${investment.id}`}>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id={`investment-date-${investment.id}`}
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !investment.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {investment.date ? format(investment.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={investment.date}
                          onSelect={(date) => handleDateChange(investment.id, date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id={`investment-auto-apply-${investment.id}`}
                    checked={investment.autoApply}
                    onCheckedChange={(checked) => handleAutoApplyChange(investment.id, checked)}
                  />
                  <Label htmlFor={`investment-auto-apply-${investment.id}`}>
                    Auto apply (distribute automatically)
                  </Label>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeOneTimeInvestment(investment.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={addOneTimeInvestment}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another One-Time Investment
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OneTimeForm;