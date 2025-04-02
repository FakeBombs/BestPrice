
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';

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
      {children}
    </ThemeProvider>
  );
}
