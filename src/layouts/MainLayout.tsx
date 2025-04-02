
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
      <Navbar />
      <div id="root" class="clr">
        {children}
      </div>
      <Footer />
  );
};

export default MainLayout;
