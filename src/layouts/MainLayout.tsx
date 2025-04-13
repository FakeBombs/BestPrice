import React, { useState } from 'react';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSitemapVisible, setIsSitemapVisible] = useState(false);

  // Function to toggle the visibility of the popup menu
  const toggleSitemapVisibility = () => {
    setIsSitemapVisible(prev => !prev);
  };
  return (
    <div>
      <Navbar onToggleSitemap={toggleSitemapVisibility} />
      <div id="root" className="clr">
        {isSitemapVisible && (
          <div class="sitemap-desktop__backdrop" style={{ zIndex: 2147483524 }}></div>
          <div class="sitemap-desktop__wrapper" style={{ zIndex: 2147483525 }}>
            <div class="root__wrapper">
              <div class="root"></div>
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
