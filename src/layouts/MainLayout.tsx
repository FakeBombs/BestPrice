import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { mainCategories, categories, Category, Brand, brands, products as allMockProducts, Product } from '@/data/mockData';

// --- SVG Components remain the same ---
const Technology = () => ( <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-6989-24"></use></svg> );
const HomeGarden = () => ( <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-2185-24"></use></svg> );
const Fashion = () => ( <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-2068-24"></use></svg> );
const HealthBeauty = () => ( <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-583-24"></use></svg> );
const ChildrenBaby = () => ( <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-2175-24"></use></svg> );
const HobbySports = () => ( <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-3058-24"></use></svg> );
const AutoMoto = () => ( <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width="24" height="24"><use href="/dist/images/icons/categories.svg#icon-cat-3204-24"></use></svg> );

const categorySvgMap: { [key: number]: ReactNode } = {
  1: <Technology />, 2: <HomeGarden />, 3: <Fashion />, 4: <HealthBeauty />, 5: <ChildrenBaby />, 6: <HobbySports />, 7: <AutoMoto />
};
// --- End SVG Components ---

// --- Helper Functions ---
const calculateDiscountPercentage = (originalPrice?: number, discountPrice?: number): number | null => { /* ... as before ... */
  if (typeof discountPrice !== 'number' || typeof originalPrice !== 'number' || originalPrice <= 0 || discountPrice >= originalPrice) { return null; }
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

const formatPrice = (price?: number, locale: string = 'el-GR'): string => { /* ... default to el-GR formatting ... */
    if (typeof price !== 'number') return '';
    // Ensure currency is set correctly for the locale
    try {
      return price.toLocaleString(locale.replace('_', '-'), { style: 'currency', currency: 'EUR' });
    } catch (e) {
      // Fallback to default formatting if locale is invalid
      return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    }
};

const getAllCategoryAndDescendantIds = (categoryId: number, allCats: Category[]): number[] => { /* ... as before ... */
    let ids: number[] = [categoryId];
    const children = allCats.filter(cat => cat.parentId === categoryId);
    children.forEach(child => { ids = ids.concat(getAllCategoryAndDescendantIds(child.id, allCats)); });
    return Array.from(new Set(ids));
};
// --- End Helper Functions ---


interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { pathname } = useLocation();
  const [isSitemapVisible, setIsSitemapVisible] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(1);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const { t, language } = useTranslation();

  const excludedRoutes = ['/login', '/register', '/forgot-password'];
  const shouldRenderNavAndFooter = !excludedRoutes.includes(pathname);

  const allCategoriesList = [...mainCategories, ...categories];

  // --- Calculate Deals Data ---
  const dealProducts = allMockProducts.filter(product =>
      product.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
      product.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
  ).slice(0, 12);

  const actualDealCount = allMockProducts.filter(product =>
      product.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
      product.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
  ).length;
  // --- End Deals Data ---


  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const sitemapToggle = () => { setIsSitemapVisible((prev) => { const nextState = !prev; if (nextState) { document.documentElement.classList.add('has-sitemap'); } else { document.documentElement.classList.remove('has-sitemap'); } return nextState; }); };
  const handleMouseEnter = (id: number | null) => { setCurrentCategoryId(id); };
  const handleMouseLeave = () => {};
  const removeSitemapClass = () => { setIsSitemapVisible(false); document.documentElement.classList.remove('has-sitemap'); };

  useEffect(() => { const handleClickOutside = (event: MouseEvent) => { if ( isSitemapVisible && navbarRef.current && !navbarRef.current.contains(event.target as Node) && sidebarRef.current && !sidebarRef.current.contains(event.target as Node) ) { removeSitemapClass(); } }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, [isSitemapVisible]);

  const mainCategory = mainCategories.find(cat => cat.id === currentCategoryId);
  const subCategories = currentCategoryId !== null && currentCategoryId > 0 ? allCategoriesList.filter(cat => cat.parentId === currentCategoryId) : [];

  const popularSearchQueries = [ /* ... same as before ... */
    { query: 'Apple', key: 'sitemap_popular_apple' }, { query: 'Sony', key: 'sitemap_popular_sony' }, { query: 'Mac', key: 'sitemap_popular_mac' }, { query: 'iPad Air', key: 'sitemap_popular_ipadair' }, { query: 'Galaxy', key: 'sitemap_popular_galaxy' }
  ];

  let popularBrandsForCurrentView: Brand[] = [];
  if (currentCategoryId !== null && currentCategoryId > 0 && currentCategoryId <= 7) { const relevantCategoryIds = getAllCategoryAndDescendantIds(currentCategoryId, allCategoriesList); const productsInCurrentBranch = allMockProducts.filter(p => p.categoryIds?.some(catId => relevantCategoryIds.includes(catId))); const uniqueBrandNamesInBranch = Array.from(new Set(productsInCurrentBranch.map(p => p.brand).filter(Boolean))); popularBrandsForCurrentView = uniqueBrandNamesInBranch.map(name => brands.find(b => b.name === name)).filter((b): b is Brand => !!b).slice(0, 10); }

  const translatedBrandsForAltText = brands.map(brand => ({ ...brand, translatedName: t(`brand_${brand.id}_alt`, brand.name) }));


  return (
    <>
      {shouldRenderNavAndFooter && <Navbar onSitemapToggle={sitemapToggle} onRemoveSitemap={removeSitemapClass} ref={navbarRef} isSitemapVisible={isSitemapVisible} onMouseEnter={handleMouseEnter} />}
      <div id="root" className="clr">
        <main className="clr">
          {React.Children.map(children, (child) => { return React.isValidElement(child) && typeof child.type !== 'string' ? React.cloneElement(child as React.ReactElement<any>, { onSitemapToggle: sitemapToggle }) : child; })}
        </main>
        {isSitemapVisible && (
          <>
            <div className="sitemap-desktop__backdrop" style={{ zIndex: 2147483524 }} onClick={removeSitemapClass}></div>
            <div className="sitemap-desktop__wrapper" style={{ zIndex: 2147483525 }} ref={sidebarRef}>
              <div className="root__wrapper">
                <div className="root">
                  <div className="sitemap sitemap-desktop" onMouseLeave={handleMouseLeave}>
                    {/* --- Sidebar --- */}
                    <div className="sitemap-desktop__sidebar">
                       <div className="sitemap-desktop__sidebar-extra">
                        <Link to="/deals" className={`sitemap-desktop__item ${currentCategoryId === 0 ? 'sitemap-desktop__item--selected' : ''}`} onMouseEnter={() => handleMouseEnter(0)} onClick={sitemapToggle}>
                          <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width={24} height={24}><use href="/dist/images/icons/categories.svg#icon-deals-24"></use></svg>
                          {t('deals', 'Deals')} {` (${actualDealCount.toLocaleString(language === 'el' ? 'el-GR' : 'de-DE')})`}
                          <svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg>
                        </Link>
                      </div>
                      <div className="sitemap-desktop__sidebar-categories">
                        {mainCategories.map((category) => (
                          <Link to={`/cat/${category.id}/${category.slug}?bpref=sitemap`} className={`sitemap-desktop__item ${currentCategoryId === category.id ? 'sitemap-desktop__item--selected' : ''}`} key={category.id} onMouseEnter={() => handleMouseEnter(category.id)} onClick={sitemapToggle}>
                            {categorySvgMap[category.id]}
                            {t(category.slug, category.name)}
                            <svg className="icon sitemap-desktop__item-arrow" aria-hidden="true" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-left-thin-16"></use></svg>
                          </Link>
                        ))}
                        <Link className={`sitemap-desktop__item sitemap-desktop__item--external sitemap-desktop__item--separator ${currentCategoryId === 9 ? 'sitemap-desktop__item--selected' : ''}`} to="/gifts" onMouseEnter={() => handleMouseEnter(9)} onClick={sitemapToggle}>
                          <svg className="icon sitemap-desktop__item-icon icon--outline" aria-hidden="true" width={24} height={24}><use href="/dist/images/icons/categories.svg#icon-gifts-24"></use></svg>
                          {t('gifts', 'Gifts')}
                        </Link>
                      </div>
                    </div>
                    {/* --- End Sidebar --- */}

                    {/* ==== Conditional View Rendering ==== */}
                    {currentCategoryId === 0 && (
                        // --- Deals View ---
                        <div className="sitemap-desktop__view sitemap-desktop__view--deals">
                            <div className="sitemap-desktop__view-title">{t('popular_deals_title', 'Δημοφιλείς Προσφορές')}</div>
                             <div className="p__products collection__products grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2">
                                {dealProducts.map(product => {
                                    let displayPrice = product.lowestPrice;
                                    let originalPrice = null;
                                    const bestPriceInfo = product.prices.find(p => p.vendorId === product.bestPriceVendorId);
                                    if (bestPriceInfo?.discountPrice) { displayPrice = bestPriceInfo.discountPrice; originalPrice = bestPriceInfo.price; }
                                    else if (bestPriceInfo) { displayPrice = bestPriceInfo.price; }
                                    const discountPercentage = calculateDiscountPercentage(originalPrice ?? undefined, displayPrice);
                                    const productTitle = t(product.slug ?? `product_${product.id}_title`, product.title);
                                    // Use a safe slug, defaulting to 'product' if undefined
                                    const productSlug = product.slug || 'product';

                                    return (
                                        <div key={product.id} className="p p--deal p--bare flex flex-col border border-gray-200 dark:border-gray-700 rounded overflow-hidden group">
                                            <Link to={`/item/${product.id}/${productSlug}`} className="p__cover block relative aspect-square overflow-hidden" title={productTitle} onClick={sitemapToggle}>
                                                <img width="220" height="220" loading="lazy" alt={productTitle} src={product.image || '//placehold.co/220x220?text=No+Image'} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"/>
                                                {/* Badges */}
                                                {discountPercentage !== null && (<div className="absolute top-1 right-1"><div className={`p__badge p__badge--drop drop drop--${Math.min(Math.floor(discountPercentage/10)*10, 40)} bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center`}><svg className="icon h-3 w-3 mr-0.5" aria-hidden="true" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-flame-16"></use></svg>-{discountPercentage}%</div></div>)}
                                                {product.tags?.includes('black-friday') && (<div className="absolute top-1 left-1 p__badge--deal-black-wrapper"><div className="p__badge p__badge--deal-black bg-black text-white p-1 rounded-full"><svg className="icon h-3.5 w-3.5" aria-hidden="true" width="18" height="18"><use href="/public/dist/images/icons/static.svg#icon-thunder-18"></use></svg></div></div>)}
                                            </Link>
                                            <div className="p__main p-2 flex-grow flex flex-col">
                                                <div className="p__meta flex-grow">
                                                    <h3 className="p__title p__title--lines p__title--lines-2 text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        <Link to={`/item/${product.id}/${productSlug}`} title={productTitle} onClick={sitemapToggle}>{productTitle}</Link>
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="p__footer p-2 pt-0 mt-auto">
                                                <div className="p__price-merchants">
                                                    <Link className="p__price block text-center" to={`/item/${product.id}/${productSlug}`} title={productTitle} onClick={sitemapToggle}>
                                                        <div className="p__price--current text-sm font-bold text-gray-900 dark:text-white">{formatPrice(displayPrice, language)}</div>
                                                        {originalPrice && (<del className="p__price--before text-xs text-gray-500 dark:text-gray-400">{formatPrice(originalPrice, language)}</del>)}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="sitemap-desktop__deals--actions">
                                <Link to="/deals?bpref=sitemap" onClick={sitemapToggle}>{t('todays_deals_link', 'Σημερινές προσφορές')}</Link>
                                <Link to="/deals/m?bpref=sitemap" onClick={sitemapToggle}>{t('deals_by_store_link', 'Ανά κατάστημα')}</Link>
                                <Link to="/deals/b?bpref=sitemap" onClick={sitemapToggle}>{t('deals_by_brand_link', 'Ανά brand')}</Link>
                            </div>
                        </div>
                    )}

                    {/* --- Category View (including dynamic brands) --- */}
                    {currentCategoryId !== null && currentCategoryId > 0 && mainCategory && (
                        <div className="sitemap-desktop__view sitemap-desktop__view--cat">
                            {/* ... (Category Title, Subcategories - unchanged) ... */}
                             <div className="sitemap-desktop__view-title">
                                <Link to={`/cat/${mainCategory.id}/${mainCategory.slug}`} onClick={sitemapToggle}>
                                    {t(mainCategory.slug, mainCategory.name)}
                                </Link>
                            </div>
                            <div className="sitemap-desktop__category-subs">
                                {subCategories.map((sub) => (
                                    <div className="sitemap-desktop__col" key={sub.id}>
                                        <div className="sitemap-desktop__sub">
                                          <Link to={`/cat/${sub.id}/${sub.slug}?bpref=sitemap`} onClick={sitemapToggle}>
                                            <img className="sitemap-desktop__sub-image" width="96" height="96" alt={t(sub.slug, sub.name)} src={sub.image || '//placehold.co/96x96?text=No+Img'} loading="lazy"/>
                                          </Link>
                                          <div className="sitemap-desktop__sub-main">
                                            <div className="sitemap-desktop__sub-title"><Link to={`/cat/${sub.id}/${sub.slug}?bpref=sitemap`} onClick={sitemapToggle}>{t(sub.slug, sub.name)}</Link></div>
                                            <ul className="sitemap-desktop__sub-list">
                                              {allCategoriesList.filter(item => item.parentId === sub.id).slice(0, 6).map(subItem => (
                                                <li key={subItem.id}><Link to={`/cat/${subItem.id}/${subItem.slug}?bpref=sitemap`} onClick={sitemapToggle}>{t(subItem.slug, subItem.name)}</Link></li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Popular Searches */}
                             <div className="sitemap-desktop__queries links">
                                {popularSearchQueries.map((search, index) => (
                                    <Link className="sitemap-desktop__queries-query links__link pressable" key={index} to={`/search?q=${encodeURIComponent(search.query)}&bpref=sitemap`} onClick={sitemapToggle}>
                                        <svg className="icon" aria-hidden="true" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-search-16"></use></svg>
                                        {t(search.key, search.query)}
                                    </Link>
                                ))}
                            </div>
                            {/* DYNAMIC POPULAR BRANDS */}
                            {popularBrandsForCurrentView.length > 0 && (
                                <div className="sitemap-desktop__brands mt-4">
                                    {popularBrandsForCurrentView.map(brand => (
                                    <Link className="sitemap-desktop__brands-brand pressable inline-block p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" key={brand.id} to={`/b/${brand.id}/${brand.slug || brand.name.toLowerCase()}?bpref=sitemap`} onClick={sitemapToggle} title={brand.name}>
                                        <img alt={t(`brand_${brand.id}_alt`, brand.name)} src={brand.logo} className="h-6 max-h-6 w-auto object-contain" loading="lazy"/>
                                    </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                     {/* --- Gifts View Placeholder --- */}
                     {currentCategoryId === 9 && (
                         <div className="sitemap-desktop__view sitemap-desktop__view--gifts p-4">
                            <div className="sitemap-desktop__view-title">{t('gifts', 'Gifts')}</div>
                            <p>{t('gifts_sitemap_placeholder', 'Περιεχόμενο για τα δώρα θα εμφανιστεί εδώ.')}</p>
                         </div>
                     )}
                    {/* ==== End Conditional View Rendering ==== */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {shouldRenderNavAndFooter && <Footer />}
      </div>
    </>
  );
};

export default MainLayout;
