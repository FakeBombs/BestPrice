import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSitemapVisible, setIsSitemapVisible] = useState(false);

  // Function to toggle 'has-sitemap' class and manage visibility
  const sitemapToggle = () => {
    const hasSitemap = !isSitemapVisible; // Determine the new visibility state
    document.documentElement.classList.toggle('has-sitemap', hasSitemap); // Set the class accordingly
    setIsSitemapVisible(hasSitemap); // Update state
  };

  return (
    <div>
      <Navbar onSitemapToggle={sitemapToggle} />}
      <div id="root" className="clr">
        {isSitemapVisible && (
          <>
            <div className="sitemap-desktop__backdrop" style={{ zIndex: 2147483524 }}></div>
            <div className="sitemap-desktop__wrapper" style={{ zIndex: 2147483525 }}>
              <div className="root__wrapper">
                <div className="root"></div>
              </div>
            </div>
          </>
        )}
        
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
