
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PaymentMethodSelector from "./payment-methods/PaymentMethodSelector";
import { useWalletDeposit } from "./hooks/useWalletDeposit";

interface WalletDepositProps {
  userId: string;
  onDepositComplete: () => void;
}

const WalletDeposit = ({ userId, onDepositComplete }: WalletDepositProps) => {
  const {
    depositAmount,
    setDepositAmount,
    paymentMethod,
    setPaymentMethod,
    loading,
    handleDeposit
  } = useWalletDeposit(userId, onDepositComplete);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Funds</CardTitle>
        <CardDescription>
          Deposit money to your account to pay for advertising
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="text-sm font-medium">Amount ($)</label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              min="1"
              step="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
          </div>
          
          <PaymentMethodSelector 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDeposit} 
          disabled={!depositAmount || parseFloat(depositAmount) <= 0 || loading}
          className="w-full"
        >
          {loading ? 'Processing...' : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Funds
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalletDeposit;
