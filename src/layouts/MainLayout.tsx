import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from 'react-router-dom';
import { mainCategories, categories, Brand, brands } from '@/data/mockData'; // Adjust the path as needed

// Define the custom hooks to add classes/IDs
function useBodyAttributes(classNames, id) {
  useEffect(() => {
    if (id) {
      document.body.id = id;
    }
    document.body.className = classNames.trim();  // Ensure no extra spaces
  }, [classNames, id]);
}

function useHtmlAttributes(classNames, id) {
  useEffect(() => {
    if (id) {
      document.documentElement.id = id;
    }
    document.documentElement.className = classNames.trim();  // Ensure no extra spaces
  }, [classNames, id]);
}

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { pathname } = useLocation();
  const [isSitemapVisible, setIsSitemapVisible] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(1); // Default to Technology
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [pathname]);

  const sitemapToggle = () => {
    const hasSitemap = !isSitemapVisible;
    document.documentElement.classList.toggle('has-sitemap', hasSitemap);
    setIsSitemapVisible(hasSitemap);
  };

  const handleMouseEnter = (id: number) => {
    setCurrentCategoryId(id);
  };

  const handleMouseLeave = () => {
    setCurrentCategoryId(1); // Reset to default category when mouse leaves
  };

  // Find the main category based on currentCategoryId
  const mainCategory = mainCategories.find(cat => cat.id === currentCategoryId);

  // Get subcategories of the main category
  const subCategories = categories.filter(cat => cat.parentId === currentCategoryId);

  // Define popular search queries
  const popularSearchQueries = [
    { query: 'Apple' },
    { query: 'Sony' },
    { query: 'Mac' },
    { query: 'iPad Air' },
    { query: 'Galaxy' }
  ];

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
                  <div className="sitemap sitemap-desktop">
                    <div className="sitemap-desktop__sidebar">
                      <div className="sitemap-desktop__sidebar-extra">
                        <Link to="/deals" className="sitemap-desktop__item" onMouseEnter={() => handleMouseEnter(0)} onMouseLeave={handleMouseLeave}>
                          <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M17.4706 21.187C18.7796 20.3144 19.8499 19.1286 20.5842 17.7372 21.3185 16.3458 21.6935 14.7931 21.6751 13.22 21.6827 11.3357 21.1422 9.48997 20.1194 7.9075L17.6408 10.8207C16.914 8.4335 16.9091 5.88472 17.6267 3.49476 17.6574 3.39448 17.6621 3.28805 17.6403 3.18547 17.6186 3.08289 17.5711 2.98751 17.5024 2.9083 17.4337 2.82909 17.3459 2.76865 17.2475 2.73264 17.149 2.69663 17.0429 2.68624 16.9393 2.70244 15.1927 2.98925 13.5401 3.69004 12.1197 4.74621 10.6993 5.80238 9.55238 7.18325 8.77483 8.77336L6.80352 6.71529C5.19373 8.49774 4.30951 10.8182 4.32492 13.22 4.30659 14.7931 4.68159 16.3458 5.41586 17.7372 6.15014 19.1286 7.22041 20.3144 8.52945 21.187M10.3665 17.928 15.6335 12.661" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5214 14.0553C11.2059 14.0553 11.7607 13.5004 11.7607 12.816 11.7607 12.1315 11.2059 11.5767 10.5214 11.5767 9.83696 11.5767 9.2821 12.1315 9.2821 12.816 9.2821 13.5004 9.83696 14.0553 10.5214 14.0553ZM15.4786 19.0124C16.1631 19.0124 16.7179 18.4576 16.7179 17.7731 16.7179 17.0887 16.1631 16.5338 15.4786 16.5338 14.7942 16.5338 14.2393 17.0887 14.2393 17.7731 14.2393 18.4576 14.7942 19.0124 15.4786 19.0124Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          {t('deals')} (8.450)
                          <svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </Link>
                      </div>
                      <div className="sitemap-desktop__sidebar-categories">
                        {mainCategories.map((category) => (
                          <Link to={`/cat/${category.slug}?bpref=sitemap`} className={`sitemap-desktop__item ${currentCategoryId === category.id ? 'sitemap-desktop__item--selected' : ''}`} key={category.id} onMouseEnter={() => handleMouseEnter(category.id)} onMouseLeave={handleMouseLeave}>
                            {/* Your SVG code */}
                            {t(category.name)}
                            <svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          </Link>
                        ))}
                        <Link className="sitemap-desktop__item sitemap-desktop__item--external sitemap-desktop__item--separator" to="/gifts" onMouseEnter={() => handleMouseEnter(9)} onMouseLeave={handleMouseLeave}>
                          <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M19.7335 22.9763C19.5053 22.9763 19.2864 22.8857 19.125 22.7244L15.252 18.8514C15.0908 18.6901 15.0002 18.4715 15 18.2434V15.5874C14.9999 15.4743 15.022 15.3623 15.0653 15.2578 15.1085 15.1533 15.1719 15.0583 15.2519 14.9783 15.3319 14.8984 15.4268 14.8349 15.5314 14.7917 15.6359 14.7485 15.7479 14.7263 15.861 14.7264H18.516C18.7443 14.7266 18.9633 14.8172 19.125 14.9784L23 18.8514C23.1613 19.0129 23.2519 19.2317 23.2519 19.4599 23.2519 19.6881 23.1613 19.907 23 20.0684L20.342 22.7244C20.1806 22.8857 19.9617 22.9763 19.7335 22.9763ZM15.168 15.0774 13.317 13.2264M13 19.9764H4C3.80109 19.9764 3.61032 19.8974 3.46967 19.7568 3.32902 19.6161 3.25 19.4254 3.25 19.2264V10.4764M16.75 10.4764V12.7264M17.5 6.72644H2.5C2.08579 6.72644 1.75 7.06223 1.75 7.47644V9.72644C1.75 10.1407 2.08579 10.4764 2.5 10.4764H17.5C17.9142 10.4764 18.25 10.1407 18.25 9.72644V7.47644C18.25 7.06223 17.9142 6.72644 17.5 6.72644ZM10 19.9764V6.72644M9.97601 6.72639C8.43366 6.31213 6.99083 5.59072 5.73401 4.60539 4.41601 3.28739 4.61001 2.54039 5.20001 1.95439 5.79001 1.36839 6.53701 1.16639 7.85501 2.48439 8.84094 3.74083 9.56242 5.18378 9.97601 6.72639ZM10.023 6.72639C11.5657 6.31223 13.0089 5.59081 14.266 4.60539 15.584 3.28739 15.39 2.54039 14.8 1.95439 14.21 1.36839 13.463 1.16639 12.144 2.48439 11.1585 3.74109 10.4371 5.18396 10.023 6.72639Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          {t('gifts')}
                        </Link>
                      </div>
                    </div>
                    <div className="sitemap-desktop__view sitemap-desktop__view--cat">
                      <div className="sitemap-desktop__view-title">
                        <Link to={`/cat/${mainCategory?.slug}`} onClick={sitemapToggle}>{t(mainCategory?.name)}</Link>
                      </div>
                      <div className="sitemap-desktop__category-subs">
                        {subCategories.map((sub) => (
                          <div className="sitemap-desktop__col" key={sub.id}>
                            <div className="sitemap-desktop__sub">
                              <Link to={`/cat/${mainCategory?.slug}/${sub.slug}?bpref=sitemap`} onClick={sitemapToggle}>
                                <img className="sitemap-desktop__sub-image" width="96" height="96" alt={sub.name} src={sub.image} />
                              </Link>
                              <div className="sitemap-desktop__sub-main">
                                <div className="sitemap-desktop__sub-title">
                                  <Link to={`/cat/${mainCategory?.slug}/${sub.slug}?bpref=sitemap`} onClick={sitemapToggle}>{sub.name}</Link>
                                </div>
                                <ul className="sitemap-desktop__sub-list">
                                  {categories.filter(item => item.parentId === sub.id).slice(0, 6).map(subItem => (
                                    <li key={subItem.id}>
                                      <Link to={`/cat/${mainCategory?.slug}/${sub.slug}/${subItem.slug}?bpref=sitemap`} onClick={sitemapToggle}>{subItem.name}</Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="sitemap-desktop__queries links">
                        {popularSearchQueries.map((search, index) => (
                          <Link className="sitemap-desktop__queries-query links__link pressable" key={index} to={`/search?q=${encodeURIComponent(search.query)}&bpref=sitemap`} onClick={sitemapToggle}>
                            <svg className="icon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" role="img">
                              <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="..."/> {/* SVG path here */}
                            </svg>
                            {search.query}
                          </Link>
                        ))}
                      </div>
                      <div className="sitemap-desktop__brands">
                        {brands.map(brand => (
                          <Link className="sitemap-desktop__brands-brand pressable" key={brand.id} to={`/b/${brand.id}/${brand.name.toLowerCase()}?bpref=sitemap`} onClick={sitemapToggle}>
                            <img alt={brand.name} src={brand.logo} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {React.Children.map(children, (child) => {
          return React.isValidElement(child)
            ? React.cloneElement(child, { onSitemapToggle: sitemapToggle })
            : child;
        })}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
