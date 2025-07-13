
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SIP, SIPType } from '@/types/calculator';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SipFormProps {
  sips: SIP[];
  addSip: () => void;
  updateSip: (sip: SIP) => void;
  removeSip: (id: string) => void;
  getAISIPSuggestion: (type: SIPType) => number;
}

const sipTypes: SIPType[] = ['Equity', 'Hybrid', 'Debt'];

const SipForm: React.FC<SipFormProps> = ({ 
  sips, 
  addSip, 
  updateSip, 
  removeSip,
  getAISIPSuggestion
}) => {
  const handleNameChange = (id: string, value: string) => {
    const sip = sips.find(sip => sip.id === id);
    if (sip) {
      updateSip({
        ...sip,
        name: value
      });
    }
  };

  const handleNumberChange = (id: string, field: keyof SIP, value: string) => {
    const sip = sips.find(sip => sip.id === id);
    if (sip) {
      updateSip({
        ...sip,
        [field]: parseFloat(value) || 0
      });
    }
  };

  const handleTypeChange = (id: string, value: SIPType) => {
    const sip = sips.find(sip => sip.id === id);
    if (sip) {
      updateSip({
        ...sip,
        type: value
      });
    }
  };

  const handleAISuggestion = (id: string) => {
    const sip = sips.find(sip => sip.id === id);
    if (sip) {
      const suggestedReturn = getAISIPSuggestion(sip.type);
      updateSip({
        ...sip,
        expectedReturn: suggestedReturn
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SIPs (Systematic Investment Plans)</CardTitle>
        <CardDescription>
          Add your SIPs to calculate your investment growth over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sips.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No SIPs added yet</p>
            <Button onClick={addSip}>
              <Plus className="h-4 w-4 mr-2" />
              Add SIP
            </Button>
          </div>
        ) : (
          <>
            {sips.map((sip) => (
              <div key={sip.id} className="mb-8 border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`sip-name-${sip.id}`}>SIP Name</Label>
                    <Input
                      id={`sip-name-${sip.id}`}
                      placeholder="SIP name"
                      value={sip.name}
                      onChange={(e) => handleNameChange(sip.id, e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`sip-type-${sip.id}`}>SIP Type</Label>
                    <Select
                      value={sip.type}
                      onValueChange={(value) => handleTypeChange(sip.id, value as SIPType)}
                    >
                      <SelectTrigger id={`sip-type-${sip.id}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {sipTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`sip-amount-${sip.id}`}>Monthly Amount (₹)</Label>
                    <Input
                      id={`sip-amount-${sip.id}`}
                      type="number"
                      placeholder="Monthly amount"
                      value={sip.monthlyAmount || ''}
                      onChange={(e) => handleNumberChange(sip.id, 'monthlyAmount', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`sip-return-${sip.id}`}>Expected CAGR Return (%)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleAISuggestion(sip.id)}
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Get AI suggested return rate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id={`sip-return-${sip.id}`}
                      type="number"
                      placeholder="Expected return"
                      value={sip.expectedReturn || ''}
                      onChange={(e) => handleNumberChange(sip.id, 'expectedReturn', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`sip-horizon-${sip.id}`}>Investment Horizon (Years)</Label>
                    <Input
                      id={`sip-horizon-${sip.id}`}
                      type="number"
                      placeholder="Investment horizon"
                      value={sip.investmentHorizon || ''}
                      onChange={(e) => handleNumberChange(sip.id, 'investmentHorizon', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`sip-delay-${sip.id}`}>Start Delay (Months)</Label>
                    <Input
                      id={`sip-delay-${sip.id}`}
                      type="number"
                      placeholder="Start delay"
                      value={sip.startDelay || ''}
                      onChange={(e) => handleNumberChange(sip.id, 'startDelay', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSip(sip.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove SIP
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={addSip}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another SIP
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SipForm;