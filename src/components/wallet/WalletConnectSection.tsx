
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import WalletConnectButton from "./WalletConnectButton";

const WalletConnectSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect External Wallet</CardTitle>
        <CardDescription>
          Connect your Web3 wallet to deposit or withdraw funds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <WalletConnectButton walletType="metamask" />
          <WalletConnectButton walletType="binance" />
          <WalletConnectButton walletType="walletconnect" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground mb-2">
          Connecting a wallet allows you to pay for ads and receive earnings directly through your preferred Web3 wallet.
        </p>
        <div className="flex items-center">
          <Button variant="link" className="h-auto p-0">
            Learn more about Web3 wallets
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WalletConnectSection;
