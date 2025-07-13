
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SIP, SIPType } from '@/types/calculator';
import { PlusCircle, Trash2, HelpCircle, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SipFormProps {
  sips: SIP[];
  addSip: (sip: Omit<SIP, 'id'>) => void;
  updateSip: (id: string, sip: Partial<SIP>) => void;
  removeSip: (id: string) => void;
  suggestSipReturn: (type: SIPType) => number;
}

const SipForm: React.FC<SipFormProps> = ({ sips, addSip, updateSip, removeSip, suggestSipReturn }) => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<SIPType>('Equity');
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');
  const [expectedReturn, setExpectedReturn] = useState<string>('');
  const [investmentHorizon, setInvestmentHorizon] = useState<string>('');
  const [startDelay, setStartDelay] = useState<string>('0');

  // Update expected return when type changes
  useEffect(() => {
    setExpectedReturn(suggestSipReturn(type).toString());
  }, [type, suggestSipReturn]);

  const handleAddSip = () => {
    if (
      !name || 
      !monthlyAmount || 
      !expectedReturn || 
      !investmentHorizon ||
      isNaN(Number(monthlyAmount)) || 
      isNaN(Number(expectedReturn)) || 
      isNaN(Number(investmentHorizon)) ||
      isNaN(Number(startDelay))
    ) return;
    
    addSip({
      name,
      type,
      monthlyAmount: Number(monthlyAmount),
      expectedReturn: Number(expectedReturn),
      investmentHorizon: Number(investmentHorizon),
      startDelay: Number(startDelay || 0)
    });
    
    // Reset form
    setName('');
    setType('Equity');
    setMonthlyAmount('');
    setExpectedReturn(suggestSipReturn('Equity').toString());
    setInvestmentHorizon('');
    setStartDelay('0');
  };

  const handleSuggestReturn = (sipId: string, sipType: SIPType) => {
    const suggestedReturn = suggestSipReturn(sipType);
    updateSip(sipId, { expectedReturn: suggestedReturn });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SIP Investments</CardTitle>
        <CardDescription>Add your Systematic Investment Plans</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* SIP list */}
        {sips.length > 0 ? (
          <div className="space-y-4">
            {sips.map((sip) => (
              <div key={sip.id} className="p-4 border rounded-md">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor={`name-${sip.id}`}>SIP Name</Label>
                    <Input
                      id={`name-${sip.id}`}
                      value={sip.name}
                      onChange={(e) => updateSip(sip.id, { name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor={`type-${sip.id}`}>SIP Type</Label>
                    <Select
                      value={sip.type}
                      onValueChange={(value: SIPType) => updateSip(sip.id, { type: value })}
                    >
                      <SelectTrigger id={`type-${sip.id}`} className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equity">Equity</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Debt">Debt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor={`monthlyAmount-${sip.id}`}>Monthly Amount (₹)</Label>
                    <Input
                      id={`monthlyAmount-${sip.id}`}
                      type="number"
                      value={sip.monthlyAmount}
                      onChange={(e) => updateSip(sip.id, { monthlyAmount: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Label htmlFor={`expectedReturn-${sip.id}`}>Expected Return (%)</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={() => handleSuggestReturn(sip.id, sip.type)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Suggest
                      </Button>
                    </div>
                    <Input
                      id={`expectedReturn-${sip.id}`}
                      type="number"
                      value={sip.expectedReturn}
                      onChange={(e) => updateSip(sip.id, { expectedReturn: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor={`investmentHorizon-${sip.id}`}>Investment Horizon (Years)</Label>
                    <Input
                      id={`investmentHorizon-${sip.id}`}
                      type="number"
                      value={sip.investmentHorizon}
                      onChange={(e) => updateSip(sip.id, { investmentHorizon: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`startDelay-${sip.id}`}>Start Delay (Years)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Years to wait before starting this SIP</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id={`startDelay-${sip.id}`}
                      type="number"
                      value={sip.startDelay}
                      onChange={(e) => updateSip(sip.id, { startDelay: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => removeSip(sip.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No SIPs added yet. Add your first SIP below.
          </div>
        )}
        
        {/* Add new SIP form */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Add New SIP</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="name">SIP Name</Label>
              <Input
                id="name"
                placeholder="e.g., HDFC Top 100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="type">SIP Type</Label>
              <Select value={type} onValueChange={(value: SIPType) => setType(value)}>
                <SelectTrigger id="type" className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Debt">Debt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="monthlyAmount">Monthly Amount (₹)</Label>
              <Input
                id="monthlyAmount"
                type="number"
                placeholder="e.g., 5000"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={() => setExpectedReturn(suggestSipReturn(type).toString())}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Suggest
                </Button>
              </div>
              <Input
                id="expectedReturn"
                type="number"
                placeholder="e.g., 12"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="investmentHorizon">Investment Horizon (Years)</Label>
              <Input
                id="investmentHorizon"
                type="number"
                placeholder="e.g., 10"
                value={investmentHorizon}
                onChange={(e) => setInvestmentHorizon(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="startDelay">Start Delay (Years)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Years to wait before starting this SIP</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="startDelay"
                type="number"
                placeholder="e.g., 0"
                value={startDelay}
                onChange={(e) => setStartDelay(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAddSip} 
          disabled={
            !name || 
            !monthlyAmount || 
            !expectedReturn || 
            !investmentHorizon ||
            isNaN(Number(monthlyAmount)) || 
            isNaN(Number(expectedReturn)) || 
            isNaN(Number(investmentHorizon)) ||
            isNaN(Number(startDelay))
          }
          className="ml-auto flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add SIP
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SipForm;