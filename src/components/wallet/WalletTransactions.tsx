
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "./types";

interface WalletTransactionsProps {
  transactions: Transaction[];
}

const WalletTransactions = ({ transactions }: WalletTransactionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View your recent transactions and payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)} $
                    </p>
                    <p className="text-xs">
                      {transaction.status === 'completed' && <span className="text-green-600">Completed</span>}
                      {transaction.status === 'pending' && <span className="text-amber-500">Pending</span>}
                      {transaction.status === 'failed' && <span className="text-red-500">Failed</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletTransactions;
