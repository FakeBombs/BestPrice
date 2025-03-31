
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Notification type definition
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'price_alert' | 'system' | 'product' | 'account';
  read: boolean;
  createdAt: string;
  link?: string;
}

// Notification context type
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

// Create notification context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on initialization
  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Add sample notifications for demo purposes
        const sampleNotifications: Notification[] = [
          {
            id: '1',
            userId: user.id,
            title: 'Price Drop Alert',
            message: 'The price of "iPhone 13" has dropped by 15%',
            type: 'price_alert',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            link: '/product/1'
          },
          {
            id: '2',
            userId: user.id,
            title: 'Welcome to Our Platform',
            message: 'Thank you for creating an account with us',
            type: 'system',
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            userId: user.id,
            title: 'New Feature Available',
            message: 'You can now track price history for your favorite products',
            type: 'system',
            read: false,
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        setNotifications(sampleNotifications);
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(sampleNotifications));
      }
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!user) return;
    
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      userId: user.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        removeNotification, 
        clearAll,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use notifications
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
