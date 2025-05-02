
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import { Search, ArrowUpRight, ArrowDownRight, MoreHorizontal, UserIcon } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface UserWallet {
  userId: string;
  userName: string;
  balance: number;
  pendingBalance: number;
  lastTransaction: Date;
  totalEarned: number;
  totalSpent: number;
  transactionCount: number;
}

// Mock user wallets for demo
const mockWallets: UserWallet[] = [
  {
    userId: 'user1',
    userName: 'John Doe',
    balance: 245.75,
    pendingBalance: 12.50,
    lastTransaction: new Date(2025, 3, 2),
    totalEarned: 350.25,
    totalSpent: 104.50,
    transactionCount: 23
  },
  {
    userId: 'user2',
    userName: 'Jane Smith',
    balance: 87.20,
    pendingBalance: 0,
    lastTransaction: new Date(2025, 3, 1),
    totalEarned: 95.30,
    totalSpent: 8.10,
    transactionCount: 12
  },
  {
    userId: 'user3',
    userName: 'Mark Johnson',
    balance: 523.45,
    pendingBalance: 75.00,
    lastTransaction: new Date(2025, 2, 28),
    totalEarned: 600.00,
    totalSpent: 76.55,
    transactionCount: 31
  }
];

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'ad-payment' | 'ad-earnings' | 'adjustment';
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

// Mock transactions for demo
const mockTransactions: Transaction[] = [
  {
    id: 't1',
    userId: 'user1',
    amount: 50.00,
    type: 'deposit',
    description: 'Credit card deposit',
    date: new Date(2025, 3, 2),
    status: 'completed'
  },
  {
    id: 't2',
    userId: 'user1',
    amount: -10.25,
    type: 'ad-payment',
    description: 'Featured product ad payment',
    date: new Date(2025, 3, 1),
    status: 'completed'
  },
  {
    id: 't3',
    userId: 'user2',
    amount: 5.75,
    type: 'ad-earnings',
    description: 'PTC ad earnings',
    date: new Date(2025, 3, 1),
    status: 'completed'
  }
];

export default function AdminWalletsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [adjustBalanceDialog, setAdjustBalanceDialog] = useState({
    open: false,
    userId: "",
    amount: "",
    description: ""
  });
  
  // Filter wallets based on search query
  const filteredWallets = mockWallets.filter(wallet => 
    wallet.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get transactions for a specific user
  const getUserTransactions = (userId: string) => {
    return transactions.filter(t => t.userId === userId);
  };
  
  const handleAdjustBalance = () => {
    const amount = parseFloat(adjustBalanceDialog.amount);
    
    if (isNaN(amount)) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid number"
      });
      return;
    }
    
    // Create a new adjustment transaction
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      userId: adjustBalanceDialog.userId,
      amount: amount,
      type: 'adjustment',
      description: adjustBalanceDialog.description || 'Manual balance adjustment',
      date: new Date(),
      status: 'completed'
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    toast({
      title: "Balance adjusted",
      description: `User balance has been ${amount >= 0 ? 'increased' : 'decreased'} by $${Math.abs(amount).toFixed(2)}`
    });
    
    setAdjustBalanceDialog({
      open: false,
      userId: "",
      amount: "",
      description: ""
    });
  };
  
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Wallet Management"
        backLink="/admin"
      />
      
      <div className="relative w-full max-w-md mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by user name..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium text-lg mb-1">Total Balance</h3>
          <p className="text-2xl font-bold">
            ${mockWallets.reduce((sum, w) => sum + w.balance, 0).toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Across {mockWallets.length} users
          </p>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium text-lg mb-1">Pending Balance</h3>
          <p className="text-2xl font-bold">
            ${mockWallets.reduce((sum, w) => sum + w.pendingBalance, 0).toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Awaiting clearing
          </p>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium text-lg mb-1">Total Transactions</h3>
          <p className="text-2xl font-bold">
            {transactions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            Last 30 days
          </p>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Current Balance</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Total Earned</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Transaction</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  No users found matching your search
                </TableCell>
              </TableRow>
            ) : (
              filteredWallets.map((wallet) => (
                <TableRow key={wallet.userId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{wallet.userName}</div>
                        <div className="text-xs text-muted-foreground">ID: {wallet.userId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${wallet.balance.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    ${wallet.pendingBalance.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-green-600">
                    +${wallet.totalEarned.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-red-500">
                    -${wallet.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{wallet.lastTransaction.toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">{wallet.transactionCount} transactions</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedWallet(wallet)}
                      >
                        View
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setAdjustBalanceDialog({
                            open: true,
                            userId: wallet.userId,
                            amount: "",
                            description: ""
                          })}>
                            Adjust Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('View transaction history', wallet.userId)}>
                            History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Wallet Details Dialog */}
      <Dialog 
        open={selectedWallet !== null} 
        onOpenChange={(open) => !open && setSelectedWallet(null)}
      >
        {selectedWallet && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Wallet Details - {selectedWallet.userName}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm text-muted-foreground">Current Balance</h3>
                <p className="text-2xl font-bold">${selectedWallet.balance.toFixed(2)}</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm text-muted-foreground">Pending</h3>
                <p className="text-2xl font-bold">${selectedWallet.pendingBalance.toFixed(2)}</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm text-muted-foreground">Total Transactions</h3>
                <p className="text-2xl font-bold">{selectedWallet.transactionCount}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Recent Transactions</h3>
              
              <div className="border rounded-md max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getUserTransactions(selectedWallet.userId).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-12 text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      getUserTransactions(selectedWallet.userId).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-sm">
                            {transaction.date.toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {transaction.description}
                          </TableCell>
                          <TableCell className="text-sm">
                            {transaction.type === 'deposit' && 'Deposit'}
                            {transaction.type === 'withdrawal' && 'Withdrawal'}
                            {transaction.type === 'ad-payment' && 'Ad Payment'}
                            {transaction.type === 'ad-earnings' && 'Ad Earnings'}
                            {transaction.type === 'adjustment' && 'Manual Adjustment'}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center">
                              {transaction.amount >= 0 ? (
                                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                              )}
                              <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-500'}>
                                {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {transaction.status === 'completed' && <span className="text-green-600">Completed</span>}
                            {transaction.status === 'pending' && <span className="text-amber-500">Pending</span>}
                            {transaction.status === 'failed' && <span className="text-red-500">Failed</span>}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setSelectedWallet(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Adjust Balance Dialog */}
      <Dialog 
        open={adjustBalanceDialog.open} 
        onOpenChange={(open) => !open && setAdjustBalanceDialog({
          open: false,
          userId: "",
          amount: "",
          description: ""
        })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Wallet Balance</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">Amount</label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (e.g. 10.00)"
                  value={adjustBalanceDialog.amount}
                  onChange={(e) => setAdjustBalanceDialog(prev => ({
                    ...prev,
                    amount: e.target.value
                  }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a positive value to increase balance, negative to decrease
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Input
                id="description"
                placeholder="Reason for adjustment"
                value={adjustBalanceDialog.description}
                onChange={(e) => setAdjustBalanceDialog(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAdjustBalance}>
              Adjust Balance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
