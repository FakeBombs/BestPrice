
import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Bell, 
  Heart, 
  Clock, 
  LogOut, 
  CreditCard, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationSettings from '@/components/NotificationSettings';
import AuthModal from '@/components/AuthModal';

const AccountPage = () => {
  const { section = 'profile' } = useParams<{ section: string }>();
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // If user is not logged in, show login modal or redirect
  if (!user) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Account Access</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to access your account features and preferences.
          </p>
          <Button onClick={() => setAuthModalOpen(true)}>
            Sign In
          </Button>
          <AuthModal 
            isOpen={authModalOpen} 
            onClose={() => setAuthModalOpen(false)} 
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link to="/account/profile">
                <div className={`flex items-center px-3 py-2 rounded-md text-sm ${section === 'profile' ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </div>
              </Link>
              <Link to="/account/notifications">
                <div className={`flex items-center px-3 py-2 rounded-md text-sm ${section === 'notifications' ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </div>
              </Link>
              <Link to="/account/favorites">
                <div className={`flex items-center px-3 py-2 rounded-md text-sm ${section === 'favorites' ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favorites</span>
                </div>
              </Link>
              <Link to="/account/price-alerts">
                <div className={`flex items-center px-3 py-2 rounded-md text-sm ${section === 'price-alerts' ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Price Alerts</span>
                </div>
              </Link>
              <Link to="/account/settings">
                <div className={`flex items-center px-3 py-2 rounded-md text-sm ${section === 'settings' ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </div>
              </Link>
              <Separator className="my-2" />
              <div 
                className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted/50 cursor-pointer"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </div>
            </nav>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div>
          {section === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Name</p>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Email</p>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {section === 'notifications' && (
            <NotificationSettings />
          )}
          
          {section === 'favorites' && (
            <Card>
              <CardHeader>
                <CardTitle>Favorites</CardTitle>
                <CardDescription>
                  Products you've saved to track price changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't saved any favorites yet.</p>
                  <Button variant="link" asChild>
                    <Link to="/categories">Browse Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {section === 'price-alerts' && (
            <Card>
              <CardHeader>
                <CardTitle>Price Alerts</CardTitle>
                <CardDescription>
                  Get notified when prices drop for products you're interested in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>You don't have any price alerts set up.</p>
                  <Button variant="link" asChild>
                    <Link to="/categories">Browse Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {section === 'settings' && (
            <Tabs defaultValue="account">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline">Change Password</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize the app appearance and theme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Appearance settings will be available soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy</CardTitle>
                    <CardDescription>
                      Manage your privacy settings and data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Privacy settings will be available soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
