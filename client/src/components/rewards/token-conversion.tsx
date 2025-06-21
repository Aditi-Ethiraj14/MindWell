import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { convertPointsToTokens, getTokenBalance, formatWalletAddress } from '@/lib/polygon';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TokenConversionProps = {
  walletAddress: string;
  availablePoints: number;
  onPointsConverted: (pointsSpent: number) => void;
};

export default function TokenConversion({ 
  walletAddress, 
  availablePoints, 
  onPointsConverted 
}: TokenConversionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [pointsToConvert, setPointsToConvert] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const { toast } = useToast();

  // Load token balance when wallet address is available
  useEffect(() => {
    if (walletAddress) {
      loadTokenBalance();
    }
  }, [walletAddress]);

  const loadTokenBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const balance = await getTokenBalance(walletAddress);
      setTokenBalance(balance);
    } catch (error) {
      console.error('Failed to load token balance:', error);
      toast({
        title: "Error",
        description: "Failed to load token balance",
        variant: "destructive"
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleConvertPoints = async () => {
    if (pointsToConvert <= 0) {
      toast({
        title: "Error",
        description: "Please enter the amount of points to convert",
        variant: "destructive"
      });
      return;
    }

    if (pointsToConvert > availablePoints) {
      toast({
        title: "Error",
        description: "You don't have enough points to convert",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await convertPointsToTokens(walletAddress, pointsToConvert);
      
      if (result.success) {
        // Update token balance
        loadTokenBalance();
        
        // Notify parent component about points conversion
        onPointsConverted(pointsToConvert);
        
        // Reset input
        setPointsToConvert(0);
        
        toast({
          title: "Success",
          description: `Successfully converted ${pointsToConvert} points to tokens!`,
        });
      } else {
        throw new Error(result.error || 'Unknown error during conversion');
      }
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: error instanceof Error ? error.message : "Failed to convert points to tokens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Convert Points to Tokens</CardTitle>
        <CardDescription>
          Connected wallet: {formatWalletAddress(walletAddress)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Available Points:</span>
            <span className="font-bold text-lg">{availablePoints}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">MindWell Token Balance:</span>
            {isLoadingBalance ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="font-bold text-lg">{tokenBalance !== null ? tokenBalance : '—'}</span>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="pointsToConvert" className="text-sm font-medium">
              Points to Convert
            </label>
            <Input
              id="pointsToConvert"
              type="number"
              min={0}
              max={availablePoints}
              value={pointsToConvert || ''}
              onChange={(e) => setPointsToConvert(parseInt(e.target.value) || 0)}
              placeholder="Enter points amount"
            />
            <p className="text-xs text-neutral-500">
              Conversion rate: 100 points = 1 token
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleConvertPoints}
          disabled={isLoading || pointsToConvert <= 0 || pointsToConvert > availablePoints}
          variant="default"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            'Convert to Tokens'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}