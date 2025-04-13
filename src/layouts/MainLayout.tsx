import React, { useState, ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Index from '@/components/Index';

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
      <Navbar onSitemapToggle={sitemapToggle} />
      <div id="root" className="clr">
        {isSitemapVisible && (
          <>
            <div className="sitemap-desktop__backdrop" style={{ zIndex: 2147483524 }} onClick={sitemapToggle}></div>
            <div className="sitemap-desktop__wrapper" style={{ zIndex: 2147483525 }}>
              <div className="root__wrapper">
                <div className="root">
                  <div className="root__wrapper">
                    <div className="root">
                      <div className="sitemap sitemap-desktop">

                        <div className="sitemap-desktop__sidebar">
                          <div className="sitemap-desktop__sidebar-extra">
                            <a className="sitemap-desktop__item" href="/deals">
                              <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use xlink:href="/public/dist/images/icons/categories.svg#icon-deals-24"></use></svg>Προσφορές (8.450)<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg>
                            </a>
                          </div>
                          <div className="sitemap-desktop__sidebar-categories"><a className="sitemap-desktop__item" href="/cat/6989/technology.html?bpref=sitemap"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use xlink:href="/public/dist/images/icons/categories.svg#icon-cat-6989-24"></use></svg>Τεχνολογία<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg></a><a className="sitemap-desktop__item" href="/cat/2185/home-garden.html?bpref=sitemap"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use xlink:href="/public/dist/images/icons/categories.svg#icon-cat-2185-24"></use></svg>Σπίτι &amp; Κήπος<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg></a><a className="sitemap-desktop__item" href="/cat/2068/fashion.html?bpref=sitemap"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use xlink:href="/public/dist/images/icons/categories.svg#icon-cat-2068-24"></use></svg>Μόδα<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg></a><a className="sitemap-desktop__item sitemap-desktop__item--selected" href="/cat/583/health-beauty.html?bpref=sitemap"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use xlink:href="/public/dist/images/icons/categories.svg#icon-cat-583-24"></use></svg>Υγεία &amp; Ομορφιά<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg></a><a className="sitemap-desktop__item" href="/cat/2175/paidika-brefika.html?bpref=sitemap"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use xlink:href="/public/dist/images/icons/categories.svg#icon-cat-2175-24"></use></svg>Παιδικά - Βρεφικά<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg></a><a className="sitemap-desktop__item" href="/cat/3058/sports-hobbies.html?bpref=sitemap"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use xlink:href="/public/dist/images/icons/categories.svg#icon-cat-3058-24"></use></svg>Hobby, Αθλητισμός<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg></a><a className="sitemap-desktop__item" href="/cat/3204/auto-moto.html?bpref=sitemap"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use xlink:href="/public/dist/images/icons/categories.svg#icon-cat-3204-24"></use></svg>Μηχανοκίνηση<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg></a></div><a className="sitemap-desktop__item sitemap-desktop__item--external sitemap-desktop__item--separator" href="/dora"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use xlink:href="/public/dist/images/icons/categories.svg#icon-gifts-24"></use></svg>Δώρα</a></div>
                      
                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pass sitemapToggle to children, including Index */}
        {React.Children.map(children, (child) => {
          return React.isValidElement(child) 
            ? React.cloneElement(child, { onSitemapToggle: sitemapToggle }) 
            : child;
        })}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
