
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationSettings from "@/components/NotificationSettings";
import { 
  User, 
  Settings, 
  Bell, 
  Heart, 
  Clock, 
  CircleDollarSign, 
  ShoppingBag,
  LayoutDashboard,
  Wallet,
  Store
} from "lucide-react";

const AccountPage = () => {
  const { user, logout } = useAuth();
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
                className="w-full justify-start" 
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => setActiveTab("favorites")}
              >
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => setActiveTab("history")}
              >
                <Clock className="mr-2 h-4 w-4" />
                <span>Recently Viewed</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => setActiveTab("alerts")}
              >
                <Bell className="mr-2 h-4 w-4" />
                <span>Price Alerts</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Link to="/wallet">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                </Button>
              </Link>
              <Link to="/wallet/ads">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                >
                  <Store className="mr-2 h-4 w-4" />
                  <span>Advertisements</span>
                </Button>
              </Link>
              
              {user.isAdmin && (
                <Link to="/admin">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-primary"
                  >
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
                <span>Logout</span>
              </Button>
            </nav>
          </div>
        </aside>
        
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
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <p className="text-sm font-medium">Name:</p>
                      <p className="text-sm col-span-2">{user.name}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <p className="text-sm font-medium">Email:</p>
                      <p className="text-sm col-span-2">{user.email}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <p className="text-sm font-medium">Member since:</p>
                      <p className="text-sm col-span-2">April 2023</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <p className="text-sm font-medium">Role:</p>
                      <p className="text-sm col-span-2">
                        {user.isAdmin ? 'Administrator' : 'Regular User'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Favorites</p>
                        <p className="text-xl font-bold">12</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Bell className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price Alerts</p>
                        <p className="text-xl font-bold">5</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <CircleDollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Wallet Balance</p>
                        <p className="text-xl font-bold">${(25.50).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Ads</p>
                        <p className="text-xl font-bold">2</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>My Favorites</CardTitle>
                  <CardDescription>
                    Manage your saved products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">You haven't saved any products yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Viewed</CardTitle>
                  <CardDescription>
                    Products you've recently viewed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No recently viewed products.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Price Alerts</CardTitle>
                  <CardDescription>
                    Get notified when prices drop
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">You don't have any price alerts set up yet.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Set Up a Price Alert</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
