
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSidebar from "@/components/account/AccountSidebar";
import ProfileTab from "@/components/account/ProfileTab";
import FavoritesTab from "@/components/account/FavoritesTab";
import HistoryTab from "@/components/account/HistoryTab";
import AlertsTab from "@/components/account/AlertsTab";
import SettingsTab from "@/components/account/SettingsTab";

const AccountPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="hidden">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            
            <TabsContent value="favorites">
              <FavoritesTab />
            </TabsContent>
            
            <TabsContent value="history">
              <HistoryTab />
            </TabsContent>
            
            <TabsContent value="alerts">
              <AlertsTab />
            </TabsContent>
            
            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
