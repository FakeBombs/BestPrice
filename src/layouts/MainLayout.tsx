import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from 'react-router-dom';
import { mainCategories, categories, Category, Brand, brands } from '@/data/mockData'; // Adjust the path as needed

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

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [pathname]);

  const [isSitemapVisible, setIsSitemapVisible] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(1); // Default to Technology
  const { t } = useTranslation();

  const sitemapToggle = () => {
    const hasSitemap = !isSitemapVisible;
    document.documentElement.classList.toggle('has-sitemap', hasSitemap);
    setIsSitemapVisible(hasSitemap);
  };

  // Find the main category based on currentCategoryId
  const mainCategory = mainCategories.find(cat => cat.id === currentCategoryId);

  // Get subcategories of the main category
  const subCategories = categories.filter(cat => cat.parentId === currentCategoryId);

  // Define popular search queries
  const popularSearchQueries = [
    { query: 'iphone 16' },
    { query: 'iphone 15' },
    { query: 's25 ultra' },
    { query: 'ipad air' },
    { query: 'galaxy z flip' }
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
                            <Link to="/deals" className="sitemap-desktop__item"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M17.4706 21.187C18.7796 20.3144 19.8499 19.1286 20.5842 17.7372 21.3185 16.3458 21.6935 14.7931 21.6751 13.22 21.6827 11.3357 21.1422 9.48997 20.1194 7.9075L17.6408 10.8207C16.914 8.4335 16.9091 5.88472 17.6267 3.49476 17.6574 3.39448 17.6621 3.28805 17.6403 3.18547 17.6186 3.08289 17.5711 2.98751 17.5024 2.9083 17.4337 2.82909 17.3459 2.76865 17.2475 2.73264 17.149 2.69663 17.0429 2.68624 16.9393 2.70244 15.1927 2.98925 13.5401 3.69004 12.1197 4.74621 10.6993 5.80238 9.55238 7.18325 8.77483 8.77336L6.80352 6.71529C5.19373 8.49774 4.30951 10.8182 4.32492 13.22 4.30659 14.7931 4.68159 16.3458 5.41586 17.7372 6.15014 19.1286 7.22041 20.3144 8.52945 21.187M10.3665 17.928 15.6335 12.661" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5214 14.0553C11.2059 14.0553 11.7607 13.5004 11.7607 12.816 11.7607 12.1315 11.2059 11.5767 10.5214 11.5767 9.83696 11.5767 9.2821 12.1315 9.2821 12.816 9.2821 13.5004 9.83696 14.0553 10.5214 14.0553ZM15.4786 19.0124C16.1631 19.0124 16.7179 18.4576 16.7179 17.7731 16.7179 17.0887 16.1631 16.5338 15.4786 16.5338 14.7942 16.5338 14.2393 17.0887 14.2393 17.7731 14.2393 18.4576 14.7942 19.0124 15.4786 19.0124Z" stroke-linecap="round" stroke-linejoin="round"/></svg>{t('deals')} (8.450)<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg></Link>
                          </div>
                          <div className="sitemap-desktop__sidebar-categories">
                            <Link to="/cat/technology?bpref=sitemap" className="sitemap-desktop__item sitemap-desktop__item--selected"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M17 2H7C6.44772 2 6 2.44772 6 3V21C6 21.5523 6.44772 22 7 22H17C17.5523 22 18 21.5523 18 21V3C18 2.44772 17.5523 2 17 2ZM12.5 4H14M10 4H10.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 19.5C12.5 19.7761 12.2761 20 12 20 11.7239 20 11.5 19.7761 11.5 19.5 11.5 19.2239 11.7239 19 12 19 12.2761 19 12.5 19.2239 12.5 19.5ZM15.25 6.5 8.5 13.25M12.2605 6.5 8.5 10.2316" stroke-linecap="round" stroke-linejoin="round"/></svg>{t('technology')}<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg></Link>
                            <Link to="/cat/home-garden?bpref=sitemap" className="sitemap-desktop__item"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path fill-rule="evenodd" d="M6 2H18L20 12H4L6 2Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12V19.2543M16 12V16M5 20.5C5 19.9477 5.44772 19.5 6 19.5H18C18.5523 19.5 19 19.9477 19 20.5V22H5V20.5Z" stroke-linecap="round" stroke-linejoin="round"/></svg>Σπίτι &amp; Κήπος<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg></Link>
                            <Link to="/cat/fashion?bpref=sitemap" className="sitemap-desktop__item"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M5.8777 7.5C5.93812 8.06394 5.97559 8.72578 5.97559 9.5V22H17.9756V9.5C17.9756 8.72578 18.0131 8.06394 18.0735 7.5M18.5 11.0626L22 10.0626L18.9756 4.5L14.9756 2H8.97559L4.97559 4.5L2 10.0626L5.5 11.0626" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.97559 2.25C8.97559 3.90685 10.3187 5.25 11.9756 5.25C13.6324 5.25 14.9756 3.90685 14.9756 2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>Μόδα<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg></Link>
                            <Link to="/cat/health-beauty?bpref=sitemap" className="sitemap-desktop__item"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M6 4 8 18V21C8 21.5523 8.44772 22 9 22H15C15.5523 22 16 21.5523 16 21V18L18 4V2H6V4ZM8 18H15.75M6.5 4.5H11.5M14 4.5H15" stroke-linecap="round" stroke-linejoin="round"/></svg>Υγεία &amp; Ομορφιά<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg></Link>
                            <Link to="/cat/children-baby?bpref=sitemap" className="sitemap-desktop__item"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M12.5 15.75C12.5 18.7876 10.0376 21.25 7 21.25 3.96243 21.25 1.5 18.7876 1.5 15.75 1.5 12.7124 3.96243 10.25 7 10.25 10.0376 10.25 12.5 12.7124 12.5 15.75ZM22.5 17.75C22.5 19.683 20.933 21.25 19 21.25 17.067 21.25 15.5 19.683 15.5 17.75 15.5 15.817 17.067 14.25 19 14.25 20.933 14.25 22.5 15.817 22.5 17.75Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 15.75L8.72147 5.4212C8.8822 4.45683 9.71658 3.75 10.6943 3.75H13.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 7.25C8.5 7.25 19.0288 8.87521 19.0288 17.7441" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.9683 10.75C15.9683 10.75 18.4683 10.3628 18.4683 8.25M16.7214 7.06104 19.4505 5.57244C19.9974 5.27412 20.681 5.54309 20.878 6.1341L21.0613 6.68376C21.2771 7.33129 20.7951 7.99998 20.1126 7.99998H16.9608C16.4428 7.99998 16.2666 7.30908 16.7214 7.06104Z" stroke-linecap="round" stroke-linejoin="round"/></svg>Παιδικά - Βρεφικά<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg></Link>
                            <Link to="/cat/hobby-sports?bpref=sitemap" className="sitemap-desktop__item"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.015 20.9723C11.1004 16.0277 13.8957 12.3469 10.5431 9.51942C8.07443 7.43744 5.42553 8.4672 3.05798 12.1731" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.4781 5.75014C17.2699 4.54196 13.4412 6.41178 9.92649 9.92649C6.41178 13.4412 4.54196 17.2699 5.75014 18.4781" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.3028 18.3816C20.3896 16.2947 19.2321 11.7537 15.7174 8.23899C12.2027 4.72427 7.66169 3.56676 5.57483 5.65363" stroke-linecap="round" stroke-linejoin="round"/></svg>Hobby, Αθλητισμός<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg></Link>
                            <Link to="/cat/auto-moto?bpref=sitemap" className="sitemap-desktop__item"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 12C16 14.2091 14.2091 16 12 16 9.79086 16 8 14.2091 8 12 8 9.79086 9.79086 8 12 8 14.2091 8 16 9.79086 16 12ZM6.49663 3.64925 7.84375 3.8125M6.49663 3.64925C7.92433 2.70646 9.60802 2.11998 11.421 2.01648M6.49663 3.64925C5.04056 4.61077 3.85076 5.94291 3.0616 7.51129M11.421 2.01648C11.6126 2.00554 11.8057 2 12 2 13.6147 2 15.1401 2.38271 16.4903 3.06238M11.421 2.01648 12.5 2.83594M16.4903 3.06238 17.0156 4.3125M16.4903 3.06238C18.0599 3.85252 19.3929 5.044 20.3543 6.50207M20.3543 6.50207 20.1875 7.84766M20.3543 6.50207C21.2953 7.92896 21.8804 9.61115 21.9836 11.4224M21.9836 11.4224C21.9945 11.6135 22 11.8061 22 12 22 13.6141 21.6176 15.1389 20.9384 16.4887M21.9836 11.4224 21.168 12.5M20.9384 16.4887 19.6953 17.0117M20.9384 16.4887C20.1484 18.0587 18.957 19.392 17.4989 20.3537M17.4989 20.3537 16.1562 20.1914M17.4989 20.3537C16.0739 21.2936 14.3942 21.8787 12.5856 21.9831M12.5856 21.9831C12.3919 21.9943 12.1966 22 12 22 10.3871 22 8.86346 21.6182 7.51442 20.94M12.5856 21.9831 11.5039 21.1641M7.51442 20.94 6.98828 19.6875M7.51442 20.94C5.94598 20.1515 4.61361 18.9624 3.65162 17.507M3.65162 17.507 3.81641 16.1484M3.65162 17.507C2.70796 16.0793 2.12071 14.3954 2.01665 12.582M2.01665 12.582C2.0056 12.3894 2 12.1953 2 12 2 10.3859 2.38242 8.8611 3.0616 7.51129M2.01665 12.582 2.83594 11.5039M3.0616 7.51129 4.3125 6.98828" stroke-linecap="round" stroke-linejoin="round"/></svg>Μηχανοκίνηση<svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M13 1L5 9L13 17" stroke-linecap="round" stroke-linejoin="round"/></svg></Link>
                          </div>
                          <Link className="sitemap-desktop__item sitemap-desktop__item--external sitemap-desktop__item--separator" to="/gifts"><svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M19.7335 22.9763C19.5053 22.9763 19.2864 22.8857 19.125 22.7244L15.252 18.8514C15.0908 18.6901 15.0002 18.4715 15 18.2434V15.5874C14.9999 15.4743 15.022 15.3623 15.0653 15.2578 15.1085 15.1533 15.1719 15.0583 15.2519 14.9783 15.3319 14.8984 15.4268 14.8349 15.5314 14.7917 15.6359 14.7485 15.7479 14.7263 15.861 14.7264H18.516C18.7443 14.7266 18.9633 14.8172 19.125 14.9784L23 18.8514C23.1613 19.0129 23.2519 19.2317 23.2519 19.4599 23.2519 19.6881 23.1613 19.907 23 20.0684L20.342 22.7244C20.1806 22.8857 19.9617 22.9763 19.7335 22.9763ZM15.168 15.0774 13.317 13.2264M13 19.9764H4C3.80109 19.9764 3.61032 19.8974 3.46967 19.7568 3.32902 19.6161 3.25 19.4254 3.25 19.2264V10.4764M16.75 10.4764V12.7264M17.5 6.72644H2.5C2.08579 6.72644 1.75 7.06223 1.75 7.47644V9.72644C1.75 10.1407 2.08579 10.4764 2.5 10.4764H17.5C17.9142 10.4764 18.25 10.1407 18.25 9.72644V7.47644C18.25 7.06223 17.9142 6.72644 17.5 6.72644ZM10 19.9764V6.72644M9.97601 6.72639C8.43366 6.31213 6.99083 5.59072 5.73401 4.60539 4.41601 3.28739 4.61001 2.54039 5.20001 1.95439 5.79001 1.36839 6.53701 1.16639 7.85501 2.48439 8.84094 3.74083 9.56242 5.18378 9.97601 6.72639ZM10.023 6.72639C11.5657 6.31223 13.0089 5.59081 14.266 4.60539 15.584 3.28739 15.39 2.54039 14.8 1.95439 14.21 1.36839 13.463 1.16639 12.144 2.48439 11.1585 3.74109 10.4371 5.18396 10.023 6.72639Z" stroke-linecap="round" stroke-linejoin="round"/></svg>Δώρα</Link>
                    </div>
                    <div className="sitemap-desktop__view sitemap-desktop__view--cat">
                      <div className="sitemap-desktop__view-title">
                        <Link to={`/cat/${mainCategory?.slug}`} onClick={sitemapToggle}>{t(mainCategory?.name)}</Link>
                      </div>
                      <div className="sitemap-desktop__category-subs">
                        {subCategories.map((sub) => (
                          <div className="sitemap-desktop__col" key={sub.id}>
                            <div className="sitemap-desktop__sub">
                              <Link to={`/cat/${sub.slug}?bpref=sitemap`} onClick={sitemapToggle}>
                                <img className="sitemap-desktop__sub-image" width="96" height="96" alt={sub.name} src={sub.image} />
                              </Link>
                              <div className="sitemap-desktop__sub-main">
                                <div className="sitemap-desktop__sub-title">
                                  <Link to={`/cat/${sub.slug}?bpref=sitemap`} onClick={sitemapToggle}>{sub.name}</Link>
                                </div>
                                <ul className="sitemap-desktop__sub-list">
                                  {categories.filter(item => item.parentId === sub.id).slice(0, 6).map(subItem => (
                                    <li key={subItem.id}>
                                      <Link to={`/cat/${subItem.slug}?bpref=sitemap`} onClick={sitemapToggle}>{subItem.name}</Link>
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
                          <Link className="sitemap-desktop__brands-brand pressable" key={brand.id} to={`/b/${brand.id}/${brand.name.toLowerCase()}.html?bpref=sitemap`} onClick={sitemapToggle}>
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
