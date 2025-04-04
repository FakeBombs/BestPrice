
import WalletPanel from "../components/wallet/WalletPanel";
import AdManager from "../components/ads/AdManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function WalletPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const activeTab = tab || "wallet";
  
  useEffect(() => {
    if (!user) {
      navigate("/account");
    }
  }, [user, navigate]);
  
  const handleTabChange = (value: string) => {
    navigate(`/wallet/${value}`);
  };
  
  if (!user) {
    return null; // Will redirect via the useEffect
  }
  
  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="ads">Advertisements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallet" className="space-y-6">
          <WalletPanel />
        </TabsContent>
        
        <TabsContent value="ads" className="space-y-6">
          <AdManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
