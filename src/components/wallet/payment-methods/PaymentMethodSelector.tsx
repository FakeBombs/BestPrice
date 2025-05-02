
import { Button } from "@/components/ui/button";
import { CreditCard, Coins, Bitcoin } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }: PaymentMethodSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Payment Method</label>
      <div className="grid grid-cols-1 gap-2">
        <h4 className="text-sm font-medium text-muted-foreground mt-2">Traditional Methods</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button 
            variant={paymentMethod === 'credit-card' ? 'default' : 'outline'} 
            className="justify-start"
            onClick={() => setPaymentMethod('credit-card')}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Credit Card
          </Button>
          <Button 
            variant={paymentMethod === 'paypal' ? 'default' : 'outline'} 
            className="justify-start"
            onClick={() => setPaymentMethod('paypal')}
          >
            <Coins className="mr-2 h-4 w-4" />
            PayPal
          </Button>
        </div>
        
        <h4 className="text-sm font-medium text-muted-foreground mt-4">Cryptocurrency</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button 
            variant={paymentMethod === 'bitpay' ? 'default' : 'outline'} 
            className="justify-start"
            onClick={() => setPaymentMethod('bitpay')}
          >
            <Bitcoin className="mr-2 h-4 w-4" />
            BitPay
          </Button>
          <Button 
            variant={paymentMethod === 'coinbase' ? 'default' : 'outline'} 
            className="justify-start"
            onClick={() => setPaymentMethod('coinbase')}
          >
            <Bitcoin className="mr-2 h-4 w-4" />
            Coinbase
          </Button>
          <Button 
            variant={paymentMethod === 'coinpayments' ? 'default' : 'outline'} 
            className="justify-start"
            onClick={() => setPaymentMethod('coinpayments')}
          >
            <Bitcoin className="mr-2 h-4 w-4" />
            CoinPayments
          </Button>
          <Button 
            variant={paymentMethod === 'faucetpay' ? 'default' : 'outline'} 
            className="justify-start"
            onClick={() => setPaymentMethod('faucetpay')}
          >
            <Bitcoin className="mr-2 h-4 w-4" />
            FaucetPay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
