import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const NotificationButton = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  
  if (!user) return null;
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      // Wait a bit before marking as read so user can see which ones are new
      setTimeout(() => {
        markAllAsRead();
      }, 3000);
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price_alert':
        return <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />;
      case 'system':
        return <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />;
      case 'product':
        return <div className="w-2 h-2 rounded-full bg-orange-500 mr-2" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" />;
    }
  };
  
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="font-medium text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto py-1 px-2 text-xs" 
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 text-sm hover:bg-muted/50 ${!notification.read ? 'bg-muted/20' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-center mb-1">
                    {getTypeIcon(notification.type)}
                    <span className="font-medium">{notification.title}</span>
                  </div>
                  <p className="text-muted-foreground ml-4">{notification.message}</p>
                  <div className="ml-4 mt-1 text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                  {notification.link && (
                    <div className="ml-4 mt-2">
                      <Link 
                        to={notification.link}
                        className="text-primary text-xs hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        View details
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t text-center">
          <Link 
            to="/account/notifications" 
            className="text-primary text-sm hover:underline inline-block p-2"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationButton;
