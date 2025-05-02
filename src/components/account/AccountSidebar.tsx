
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, Settings, Bell, Heart, Clock, 
  CircleDollarSign, ShoppingBag, LayoutDashboard, 
  Wallet, Store, LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AccountSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AccountSidebar = ({ activeTab, setActiveTab }: AccountSidebarProps) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <aside className="md:w-1/4">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-lg font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <nav className="space-y-1">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "profile" ? "bg-primary/10" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "favorites" ? "bg-primary/10" : ""}`} 
            onClick={() => setActiveTab("favorites")}
          >
            <Heart className="mr-2 h-4 w-4" />
            <span>Favorites</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "history" ? "bg-primary/10" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>Recently Viewed</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "alerts" ? "bg-primary/10" : ""}`}
            onClick={() => setActiveTab("alerts")}
          >
            <Bell className="mr-2 h-4 w-4" />
            <span>Price Alerts</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "settings" ? "bg-primary/10" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Button>
          <Link to="/wallet">
            <Button variant="ghost" className="w-full justify-start">
              <Wallet className="mr-2 h-4 w-4" />
              <span>Wallet</span>
            </Button>
          </Link>
          <Link to="/wallet/ads">
            <Button variant="ghost" className="w-full justify-start">
              <Store className="mr-2 h-4 w-4" />
              <span>Advertisements</span>
            </Button>
          </Link>
          
          {user.isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" className="w-full justify-start text-primary">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Button>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </nav>
      </div>
    </aside>
  );
};

export default AccountSidebar;
