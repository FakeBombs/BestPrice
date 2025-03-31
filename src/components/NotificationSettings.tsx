
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { ScrollArea } from '@/components/ui/scroll-area';

const NotificationSettings = () => {
  const { notifications, markAllAsRead, clearAll } = useNotifications();
  const [emailSettings, setEmailSettings] = useState({
    priceAlerts: true,
    productUpdates: false,
    accountNotifications: true,
    marketingEmails: false
  });
  
  const [pushSettings, setPushSettings] = useState({
    priceAlerts: true,
    productUpdates: true,
    accountNotifications: true,
    newDeals: false
  });
  
  const toggleEmailSetting = (setting: keyof typeof emailSettings) => {
    setEmailSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const togglePushSetting = (setting: keyof typeof pushSettings) => {
    setPushSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  return (
    <Tabs defaultValue="history">
      <TabsList className="w-full">
        <TabsTrigger value="history">Notification History</TabsTrigger>
        <TabsTrigger value="settings">Notification Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="history" className="mt-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notification History</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear all
                </Button>
              </div>
            </div>
            <CardDescription>
              View and manage your notification history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>You have no notifications.</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg ${!notification.read ? 'bg-muted/20' : ''}`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{notification.message}</p>
                      <div className="mt-2 text-xs">
                        <span className={`px-2 py-1 rounded-full inline-block ${
                          notification.type === 'price_alert' 
                            ? 'bg-green-100 text-green-800' 
                            : notification.type === 'system' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-orange-100 text-orange-800'
                        }`}>
                          {notification.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Manage the emails you receive from us
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="price-alerts-email" className="flex flex-col">
                  <span>Price Alerts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get emails when prices drop on your tracked products
                  </span>
                </Label>
                <Switch 
                  id="price-alerts-email" 
                  checked={emailSettings.priceAlerts} 
                  onCheckedChange={() => toggleEmailSetting('priceAlerts')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="product-updates-email" className="flex flex-col">
                  <span>Product Updates</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Notifications about new features and product updates
                  </span>
                </Label>
                <Switch 
                  id="product-updates-email" 
                  checked={emailSettings.productUpdates} 
                  onCheckedChange={() => toggleEmailSetting('productUpdates')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="account-notifications-email" className="flex flex-col">
                  <span>Account Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Security alerts and account activity updates
                  </span>
                </Label>
                <Switch 
                  id="account-notifications-email" 
                  checked={emailSettings.accountNotifications} 
                  onCheckedChange={() => toggleEmailSetting('accountNotifications')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing-emails" className="flex flex-col">
                  <span>Marketing Emails</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive special offers, promotions, and newsletters
                  </span>
                </Label>
                <Switch 
                  id="marketing-emails" 
                  checked={emailSettings.marketingEmails} 
                  onCheckedChange={() => toggleEmailSetting('marketingEmails')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>
              Manage in-app notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="price-alerts-push" className="flex flex-col">
                  <span>Price Alerts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get notified when prices drop on your tracked products
                  </span>
                </Label>
                <Switch 
                  id="price-alerts-push" 
                  checked={pushSettings.priceAlerts} 
                  onCheckedChange={() => togglePushSetting('priceAlerts')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="product-updates-push" className="flex flex-col">
                  <span>Product Updates</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Notifications about new features and product updates
                  </span>
                </Label>
                <Switch 
                  id="product-updates-push" 
                  checked={pushSettings.productUpdates} 
                  onCheckedChange={() => togglePushSetting('productUpdates')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="account-notifications-push" className="flex flex-col">
                  <span>Account Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Security alerts and account activity updates
                  </span>
                </Label>
                <Switch 
                  id="account-notifications-push" 
                  checked={pushSettings.accountNotifications} 
                  onCheckedChange={() => togglePushSetting('accountNotifications')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="new-deals-push" className="flex flex-col">
                  <span>New Deals</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get notified about special offers and deals
                  </span>
                </Label>
                <Switch 
                  id="new-deals-push" 
                  checked={pushSettings.newDeals} 
                  onCheckedChange={() => togglePushSetting('newDeals')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default NotificationSettings;
