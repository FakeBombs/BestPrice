
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationProvider } from '@/hooks/useNotifications';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark", "default"]}
    >
      <NotificationProvider>
        {children}
        <Toaster />
      </NotificationProvider>
    </ThemeProvider>
  );
}
