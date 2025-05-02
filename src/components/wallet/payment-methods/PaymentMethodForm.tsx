
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentMethodFormProps {
  paymentMethod: string;
}

const PaymentMethodForm = ({ paymentMethod }: PaymentMethodFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  if (paymentMethod === 'credit_card') {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="card-number">Card Number</Label>
          <Input 
            id="card-number" 
            placeholder="1234 5678 9012 3456" 
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <Input 
              id="expiry-date" 
              placeholder="MM/YY" 
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input 
              id="cvv" 
              placeholder="123" 
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="card-name">Name on Card</Label>
          <Input 
            id="card-name" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (paymentMethod === 'paypal') {
    return (
      <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
        You will be redirected to PayPal to complete your payment after clicking "Add Funds".
      </div>
    );
  }

  if (paymentMethod === 'crypto') {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-gray-700">
        You will be redirected to a cryptocurrency payment processor to complete your transaction.
      </div>
    );
  }

  return null;
};

export default PaymentMethodForm;
