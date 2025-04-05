
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'price_alert' | 'system' | 'product';
  read: boolean;
  link?: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// Helper type for notifications
type NotificationRow = Database['public']['Tables']['notifications']['Row'];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  
  // Fetch notifications when user changes
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      
      if (data) {
        setNotifications(data.map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.type as 'price_alert' | 'system' | 'product',
          read: item.read,
          link: item.link || undefined,
          createdAt: item.created_at
        })));
      }
    };
    
    fetchNotifications();
    
    // Set up a realtime subscription for new notifications
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as NotificationRow;
            const newNotification = {
              id: newData.id,
              title: newData.title,
              message: newData.message,
              type: newData.type as 'price_alert' | 'system' | 'product',
              read: newData.read,
              link: newData.link || undefined,
              createdAt: newData.created_at
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];
    const update: NotificationUpdate = { read: true };
    
    const { error } = await supabase
      .from('notifications')
      .update(update)
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }
    
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = async () => {
    if (!user) return;
    
    type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];
    const update: NotificationUpdate = { read: true };
    
    const { error } = await supabase
      .from('notifications')
      .update(update)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return;
    }
    
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const clearAll = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error clearing notifications:', error);
      return;
    }
    
    setNotifications([]);
  };
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        clearAll 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
