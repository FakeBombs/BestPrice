
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
       <div className="flex flex-col min-h-screen">
         <Navbar />
         <main className="flex-1">
           {children}
         </main>
         <Footer />
       </div>
    </ThemeProvider>
  );
};

export default MainLayout;
