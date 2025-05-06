import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { mainCategories, categories, Brand, brands } from '@/data/mockData';

// SVG Component Definitions
const Technology = () => ( <svg class="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-6989-24"></use></svg> );
const HomeGarden = () => ( <svg class="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-2185-24"></use></svg> );
const Fashion = () => ( <svg class="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-2068-24"></use></svg> );
const HealthBeauty = () => ( <svg class="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-583-24"></use></svg> );
const ChildrenBaby = () => ( <svg class="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-2175-24"></use></svg> );
const HobbySports = () => ( <svg class="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-3058-24"></use></svg> );
const AutoMoto = () => ( <svg class="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-3204-24"></use></svg> );

const categorySvgMap = { 1: <Technology />, 2: <HomeGarden />, 3: <Fashion />, 4: <HealthBeauty />, 5: <ChildrenBaby />, 6: <HobbySports />, 7: <AutoMoto /> };

// Define the custom hooks to add classes/IDs
function useBodyAttributes(classNames, id) {
  useEffect(() => {
    if (id) {
      document.body.id = id;
    }
    document.body.className = classNames.trim();  // Ensure no extra spaces
  }, [classNames, id]);
}

function useHtmlAttributes(classNames, id) {
  useEffect(() => {
    if (id) {
      document.documentElement.id = id;
    }
    document.documentElement.className = classNames.trim();  // Ensure no extra spaces
  }, [classNames, id]);
}

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { pathname } = useLocation();
  const [isSitemapVisible, setIsSitemapVisible] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(1);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  // Array of routes where Navbar and Footer should be excluded
  const excludedRoutes = ['/login', '/register', '/forgot-password']; // Add your specific routes here

  // Check if the current route is in the excludedRoutes array
  const shouldRenderNavAndFooter = !excludedRoutes.includes(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const sitemapToggle = () => {
    setIsSitemapVisible((prev) => !prev);
    if (!isSitemapVisible) {
      document.documentElement.classList.add('has-sitemap');
    } else {
      document.documentElement.classList.remove('has-sitemap');
    }
  };

 const handleMouseEnter = (id: number) => {
    setCurrentCategoryId(id);
  };

  // Handle mouse leave to keep current category when hovered outside
  const handleMouseLeave = () => {};

  // Function to remove class
  const removeSitemapClass = () => {
    setIsSitemapVisible(false);
    document.documentElement.classList.remove('has-sitemap');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (navbarRef.current && !navbarRef.current.contains(event.target as Node)) &&
        (sidebarRef.current && !sidebarRef.current.contains(event.target as Node))
      ) {
        removeSitemapClass(); // Call the removal function
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const mainCategory = mainCategories.find(cat => cat.id === currentCategoryId);
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
      {shouldRenderNavAndFooter && <Navbar onSitemapToggle={sitemapToggle} onRemoveSitemap={removeSitemapClass} ref={navbarRef} isSitemapVisible={isSitemapVisible} onMouseEnter={handleMouseEnter} />}
      <div id="root" className="clr">
        {React.Children.map(children, (child) => {
          return React.isValidElement(child)
            ? React.cloneElement(child, { onSitemapToggle: sitemapToggle })
            : child;
        })}
        {isSitemapVisible && (
          <>
            <div className="sitemap-desktop__backdrop" style={{ zIndex: 2147483524 }} onClick={removeSitemapClass}></div>
            <div className="sitemap-desktop__wrapper" style={{ zIndex: 2147483525 }} ref={sidebarRef}>
              <div className="root__wrapper">
                <div className="root">
                  <div className="sitemap sitemap-desktop" onMouseLeave={handleMouseLeave}>
                    <div className="sitemap-desktop__sidebar">
                      <div className="sitemap-desktop__sidebar-extra">
                        <Link to="/deals" className="sitemap-desktop__item" onMouseEnter={() => handleMouseEnter(0)} onMouseLeave={handleMouseLeave} onClick={sitemapToggle}>
                          <svg class="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width={24} height={24}><use href="/dist/images/icons/categories.svg#icon-deals-24"></use></svg>
                          {t('deals')} (8.450)
                          <svg class="icon sitemap-desktop__item-arrow" aria-hidden="true" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg>
                        </Link>
                      </div>
                      <div className="sitemap-desktop__sidebar-categories">
                        {mainCategories.map((category) => (
                          <Link to={`/cat/${category.id}/${category.slug}?bpref=sitemap`} className={`sitemap-desktop__item ${currentCategoryId === category.id ? 'sitemap-desktop__item--selected' : ''}`} key={category.id} onMouseEnter={() => handleMouseEnter(category.id)} onMouseLeave={handleMouseLeave} onClick={sitemapToggle}>
                            {categorySvgMap[category.id]}
                            {t(category.name)}
                            <svg class="icon sitemap-desktop__item-arrow" aria-hidden="true" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg>
                          </Link>
                        ))}
                        <Link className="sitemap-desktop__item sitemap-desktop__item--external sitemap-desktop__item--separator" to="/gifts" onMouseEnter={() => handleMouseEnter(9)} onMouseLeave={handleMouseLeave} onClick={sitemapToggle}>
                          <svg class="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-gifts-24"></use></svg>
                          {t('gifts')}
                        </Link>
                      </div>
                    </div>
                    <div className="sitemap-desktop__view sitemap-desktop__view--cat">
                      <div className="sitemap-desktop__view-title">
                        <Link to={`/cat/${mainCategory?.id}/${mainCategory?.slug}`} onClick={sitemapToggle}>{t(mainCategory?.name)}</Link>
                      </div>
                      <div className="sitemap-desktop__category-subs">
                        {subCategories.map((sub) => (
                          <div className="sitemap-desktop__col" key={sub.id}>
                            <div className="sitemap-desktop__sub">
                              <Link to={`/cat/${sub.id}/${sub.slug}?bpref=sitemap`} onClick={sitemapToggle}>
                                <img className="sitemap-desktop__sub-image" width="96" height="96" alt={sub.name} src={sub.image} />
                              </Link>
                              <div className="sitemap-desktop__sub-main">
                                <div className="sitemap-desktop__sub-title">
                                  <Link to={`/cat/${sub.id}/${sub.slug}?bpref=sitemap`} onClick={sitemapToggle}>{sub.name}</Link>
                                </div>
                                <ul className="sitemap-desktop__sub-list">
                                  {categories.filter(item => item.parentId === sub.id).slice(0, 6).map(subItem => (
                                    <li key={subItem.id}>
                                      <Link to={`/cat/${subItem.id}/${subItem.slug}?bpref=sitemap`} onClick={sitemapToggle}>{subItem.name}</Link>
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
                            <svg class="icon" aria-hidden="true" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-search-16"></use></svg>
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
        {shouldRenderNavAndFooter && <Footer />}
      </div>
    </div>
  );
};

export default MainLayout;
