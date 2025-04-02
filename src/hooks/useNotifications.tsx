
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'price_alert' | 'system' | 'product';
  read: boolean;
  link?: string;
  createdAt: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Πτώση τιμής!',
    message: 'Το iPhone 14 Pro Max μειώθηκε κατά 50€',
    type: 'price_alert',
    read: false,
    link: '/product/p1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    id: 'n2',
    title: 'Νέο προϊόν διαθέσιμο',
    message: 'Το Samsung S23 Ultra είναι τώρα διαθέσιμο',
    type: 'product',
    read: false,
    link: '/product/p2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'n3',
    title: 'Καλώς ήρθατε στο BestPrice!',
    message: 'Ευχαριστούμε που εγγραφήκατε στην υπηρεσία μας.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: 'n4',
    title: 'Black Friday Προσφορές',
    message: 'Μην χάσετε τις προσφορές Black Friday που ξεκινούν σύντομα!',
    type: 'system',
    read: true,
    link: '/deals',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  }
];

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Initialize with mock data
  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const clearAll = () => {
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
