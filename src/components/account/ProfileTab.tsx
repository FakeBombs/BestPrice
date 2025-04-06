
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bell, CircleDollarSign, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ProfileTab = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
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
    </>
  );
};

export default ProfileTab;
