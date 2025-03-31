
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/theme-provider';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

    </ThemeProvider>
  );
};

export default MainLayout;
