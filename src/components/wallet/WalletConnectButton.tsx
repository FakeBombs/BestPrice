
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

type WalletType = "metamask" | "binance" | "walletconnect";

interface WalletConnectButtonProps {
  walletType: WalletType;
}

export default function WalletConnectButton({ walletType }: WalletConnectButtonProps) {
  const [connecting, setConnecting] = useState(false);
  
  const getWalletInfo = (type: WalletType) => {
    switch(type) {
      case "metamask":
        return {
          name: "MetaMask",
          icon: "https://placehold.co/30x30?text=MM",
          description: "Connect to MetaMask wallet"
        };
      case "binance":
        return {
          name: "Binance Wallet",
          icon: "https://placehold.co/30x30?text=BW",
          description: "Connect to Binance Wallet"
        };
      case "walletconnect":
        return {
          name: "WalletConnect",
          icon: "https://placehold.co/30x30?text=WC",
          description: "Connect using WalletConnect protocol"
        };
    }
  };
  
  const walletInfo = getWalletInfo(walletType);
  
  const handleConnect = () => {
    setConnecting(true);
    
    // Simulate connection attempt
    setTimeout(() => {
      setConnecting(false);
      
      // In a real app, we would check if the connection was successful
      // For now, let's just show a toast message
      toast({
        title: `${walletInfo.name} connection initiated`,
        description: "Please approve the connection request in your wallet."
      });
    }, 1500);
  };
  
  return (
    <Button 
      variant="outline" 
      className="w-full justify-between"
      onClick={handleConnect}
      disabled={connecting}
    >
      <div className="flex items-center">
        <img 
          src={walletInfo.icon} 
          alt={walletInfo.name} 
          className="mr-2 h-5 w-5 rounded-full"
        />
        <span>{walletInfo.name}</span>
      </div>
      <span className="text-sm text-muted-foreground">
        {connecting ? 'Connecting...' : 'Connect'}
      </span>
    </Button>
  );
}
