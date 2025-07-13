
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loan, LoanType, InterestType } from '@/types/calculator';
import { PlusCircle, Trash2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LoanFormProps {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  removeLoan: (id: string) => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ loans, addLoan, updateLoan, removeLoan }) => {
  const [type, setType] = useState<LoanType>('Home');
  const [principalRemaining, setPrincipalRemaining] = useState<string>('');
  const [emi, setEmi] = useState<string>('');
  const [interestType, setInterestType] = useState<InterestType>('Compound');
  const [interestRate, setInterestRate] = useState<string>('');
  const [tenureRemainingYears, setTenureRemainingYears] = useState<string>('');
  const [tenureRemainingMonths, setTenureRemainingMonths] = useState<string>('');
  const [prepaymentAllowed, setPrepaymentAllowed] = useState<boolean>(true);
  const [prepaymentPenalty, setPrepaymentPenalty] = useState<string>('0');

  const handleAddLoan = () => {
    if (
      !principalRemaining || 
      !emi || 
      !interestRate || 
      (!tenureRemainingYears && !tenureRemainingMonths) ||
      isNaN(Number(principalRemaining)) || 
      isNaN(Number(emi)) || 
      isNaN(Number(interestRate)) || 
      (tenureRemainingYears && isNaN(Number(tenureRemainingYears))) || 
      (tenureRemainingMonths && isNaN(Number(tenureRemainingMonths)))
    ) return;
    
    addLoan({
      type,
      principalRemaining: Number(principalRemaining),
      emi: Number(emi),
      interestType,
      interestRate: Number(interestRate),
      tenureRemainingYears: Number(tenureRemainingYears || 0),
      tenureRemainingMonths: Number(tenureRemainingMonths || 0),
      prepaymentAllowed,
      prepaymentPenalty: Number(prepaymentPenalty || 0)
    });
    
    // Reset form
    setType('Home');
    setPrincipalRemaining('');
    setEmi('');
    setInterestType('Compound');
    setInterestRate('');
    setTenureRemainingYears('');
    setTenureRemainingMonths('');
    setPrepaymentAllowed(true);
    setPrepaymentPenalty('0');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Details</CardTitle>
        <CardDescription>Add your existing loans and their details</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Loan list */}
        {loans.length > 0 ? (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="p-4 border rounded-md">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor={`type-${loan.id}`}>Loan Type</Label>
                    <Select
                      value={loan.type}
                      onValueChange={(value: LoanType) => updateLoan(loan.id, { type: value })}
                    >
                      <SelectTrigger id={`type-${loan.id}`} className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tractor">Tractor</SelectItem>
                        <SelectItem value="KCC">KCC</SelectItem>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Relatives">Relatives</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor={`principal-${loan.id}`}>Principal Remaining (₹)</Label>
                    <Input
                      id={`principal-${loan.id}`}
                      type="number"
                      value={loan.principalRemaining}
                      onChange={(e) => updateLoan(loan.id, { principalRemaining: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor={`emi-${loan.id}`}>EMI/Month (₹)</Label>
                    <Input
                      id={`emi-${loan.id}`}
                      type="number"
                      value={loan.emi}
                      onChange={(e) => updateLoan(loan.id, { emi: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor={`interestType-${loan.id}`}>Interest Type</Label>
                    <Select
                      value={loan.interestType}
                      onValueChange={(value: InterestType) => updateLoan(loan.id, { interestType: value })}
                    >
                      <SelectTrigger id={`interestType-${loan.id}`} className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Simple">Simple</SelectItem>
                        <SelectItem value="Compound">Compound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor={`interestRate-${loan.id}`}>Interest Rate (%)</Label>
                    <Input
                      id={`interestRate-${loan.id}`}
                      type="number"
                      value={loan.interestRate}
                      onChange={(e) => updateLoan(loan.id, { interestRate: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`tenureYears-${loan.id}`}>Years Left</Label>
                      <Input
                        id={`tenureYears-${loan.id}`}
                        type="number"
                        value={loan.tenureRemainingYears}
                        onChange={(e) => updateLoan(loan.id, { tenureRemainingYears: Number(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`tenureMonths-${loan.id}`}>Months Left</Label>
                      <Input
                        id={`tenureMonths-${loan.id}`}
                        type="number"
                        value={loan.tenureRemainingMonths}
                        onChange={(e) => updateLoan(loan.id, { tenureRemainingMonths: Number(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`prepaymentAllowed-${loan.id}`}>Prepayment Allowed</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Can you pay extra amount to reduce principal?</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Switch
                        id={`prepaymentAllowed-${loan.id}`}
                        checked={loan.prepaymentAllowed}
                        onCheckedChange={(checked) => updateLoan(loan.id, { prepaymentAllowed: checked })}
                      />
                      <Label htmlFor={`prepaymentAllowed-${loan.id}`}>
                        {loan.prepaymentAllowed ? 'Yes' : 'No'}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor={`prepaymentPenalty-${loan.id}`}>Prepayment Penalty (%)</Label>
                    <Input
                      id={`prepaymentPenalty-${loan.id}`}
                      type="number"
                      value={loan.prepaymentPenalty}
                      onChange={(e) => updateLoan(loan.id, { prepaymentPenalty: Number(e.target.value) })}
                      disabled={!loan.prepaymentAllowed}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => removeLoan(loan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No loans added yet. Add your first loan below.
          </div>
        )}
        
        {/* Add new loan form */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Add New Loan</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="type">Loan Type</Label>
              <Select value={type} onValueChange={(value: LoanType) => setType(value)}>
                <SelectTrigger id="type" className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tractor">Tractor</SelectItem>
                  <SelectItem value="KCC">KCC</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Relatives">Relatives</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="principalRemaining">Principal Remaining (₹)</Label>
              <Input
                id="principalRemaining"
                type="number"
                placeholder="e.g., 1000000"
                value={principalRemaining}
                onChange={(e) => setPrincipalRemaining(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="emi">EMI/Month (₹)</Label>
              <Input
                id="emi"
                type="number"
                placeholder="e.g., 15000"
                value={emi}
                onChange={(e) => setEmi(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="interestType">Interest Type</Label>
              <Select value={interestType} onValueChange={(value: InterestType) => setInterestType(value)}>
                <SelectTrigger id="interestType" className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simple">Simple</SelectItem>
                  <SelectItem value="Compound">Compound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                placeholder="e.g., 8.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="tenureRemainingYears">Years Left</Label>
                <Input
                  id="tenureRemainingYears"
                  type="number"
                  placeholder="Years"
                  value={tenureRemainingYears}
                  onChange={(e) => setTenureRemainingYears(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="tenureRemainingMonths">Months Left</Label>
                <Input
                  id="tenureRemainingMonths"
                  type="number"
                  placeholder="Months"
                  value={tenureRemainingMonths}
                  onChange={(e) => setTenureRemainingMonths(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="prepaymentAllowed">Prepayment Allowed</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Can you pay extra amount to reduce principal?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  id="prepaymentAllowed"
                  checked={prepaymentAllowed}
                  onCheckedChange={setPrepaymentAllowed}
                />
                <Label htmlFor="prepaymentAllowed">
                  {prepaymentAllowed ? 'Yes' : 'No'}
                </Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="prepaymentPenalty">Prepayment Penalty (%)</Label>
              <Input
                id="prepaymentPenalty"
                type="number"
                placeholder="e.g., 2"
                value={prepaymentPenalty}
                onChange={(e) => setPrepaymentPenalty(e.target.value)}
                disabled={!prepaymentAllowed}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAddLoan} 
          disabled={
            !principalRemaining || 
            !emi || 
            !interestRate || 
            (!tenureRemainingYears && !tenureRemainingMonths) ||
            isNaN(Number(principalRemaining)) || 
            isNaN(Number(emi)) || 
            isNaN(Number(interestRate)) || 
            (tenureRemainingYears && isNaN(Number(tenureRemainingYears))) || 
            (tenureRemainingMonths && isNaN(Number(tenureRemainingMonths)))
          }
          className="ml-auto flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Loan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanForm;