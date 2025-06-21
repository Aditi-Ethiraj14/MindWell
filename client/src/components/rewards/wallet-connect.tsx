import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { initializePolygon, formatWalletAddress } from '@/lib/polygon';
import { useToast } from '@/hooks/use-toast';

type WalletConnectProps = {
  onConnect: (address: string) => void;
};

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!walletAddress || !privateKey) {
      toast({
        title: "Error",
        description: "Please enter both wallet address and private key",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Initialize Polygon client
      const success = await initializePolygon(privateKey);
      
      if (success) {
        onConnect(walletAddress);
        setIsOpen(false);
        toast({
          title: "Success",
          description: "Wallet connected successfully",
        });
      } else {
        throw new Error("Failed to initialize Polygon connection");
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your Polygon Wallet</DialogTitle>
          <DialogDescription className="pt-2">
            To convert points to tokens, you need to connect your Polygon wallet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium mb-1 block text-neutral-700">
              Wallet Address
            </label>
            <Input 
              placeholder="0x..." 
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block text-neutral-700">
              Private Key (stored only in your browser)
            </label>
            <Input 
              type="password" 
              placeholder="Enter your private key" 
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
            <p className="text-xs text-neutral-500 mt-1">
              We never store your private key on our servers. It's only used to sign transactions.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)} 
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={isConnecting || !walletAddress || !privateKey}
            variant="default"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}