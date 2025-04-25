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
                        <Link to="/deals" className="sitemap-desktop__item"
                              onMouseEnter={() => handleMouseEnter(0)}
                              onMouseLeave={handleMouseLeave}>
                          {/* Your SVG code */}
                          {t('deals')}
                        </Link>
                      </div>
                      <div className="sitemap-desktop__sidebar-categories">
                        {mainCategories.map((category) => (
                          <Link to={`/cat/${category.slug}?bpref=sitemap`}
                                className={`sitemap-desktop__item ${currentCategoryId === category.id ? 'sitemap-desktop__item--selected' : ''}`}
                                key={category.id}
                                onMouseEnter={() => handleMouseEnter(category.id)}
                                onMouseLeave={handleMouseLeave}>
                            {/* Your SVG code */}
                            {t(category.name)}
                          </Link>
                        ))}
                        <Link className="sitemap-desktop__item sitemap-desktop__item--external sitemap-desktop__item--separator" to="/gifts"
                              onMouseEnter={() => handleMouseEnter(9)}
                              onMouseLeave={handleMouseLeave}>
                          {/* Your SVG code */}
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
