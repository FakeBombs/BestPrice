import React, { useState } from 'react';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSitemapVisible, setIsSitemapVisible] = useState(false);
  return (
    <div>
      <Navbar />
      <div id="root" className="clr">
        {isSitemapVisible && (
          <div className="sitemap-desktop__backdrop" style={{ zIndex: 2147483524 }}></div>
          <div className="sitemap-desktop__wrapper" style={{ zIndex: 2147483525 }}>
            <div className="root__wrapper">
              <div className="root"></div>
            </div>
          </div>
        )}
        
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
