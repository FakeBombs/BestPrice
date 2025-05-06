import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { brands, products, vendors, mainCategories, Category } from '@/data/mockData'; // Added Category type
import { useLanguageContext } from '@/context/LanguageContext'; // Import context for changing language

// Moved getStats outside or make it a useMemo inside if it relies on props/state not available globally
const getStatsData = () => { // Renamed to avoid conflict if getStats becomes a hook
    const totalProducts = products.length;
    const totalVendors = vendors.length;
    const totalBrands = brands.length;
    // Example: Count products that have a discount price
    const totalDeals = products.filter(p => p.prices.some(price => price.discountPrice && price.discountPrice < price.price)).length;

    return {
        totalProducts,
        totalVendors,
        totalBrands,
        totalDeals,
    };
};

// Language Modal Component (can be in a separate file later)
interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentLanguage } = useTranslation();
  const { setLanguage } = useLanguageContext(); // Get setLanguage from context

  const languages: { code: 'en' | 'el' | 'es' | 'fr' | 'de'; nameKey: string }[] = [
    { code: 'en', nameKey: 'english' },
    { code: 'el', nameKey: 'greek' },
    { code: 'es', nameKey: 'spanish' },
    { code: 'fr', nameKey: 'french' },
    { code: 'de', nameKey: 'german' },
  ];

  if (!isOpen) return null;

  const handleLanguageChange = (langCode: 'en' | 'el' | 'es' | 'fr' | 'de') => {
    setLanguage(langCode);
    onClose(); // Close modal after selection
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">{t('selectYourLanguageTitle', 'Select Your Language')}</h3>
        <ul>
          {languages.map((lang) => (
            <li key={lang.code} className="mb-2">
              <button
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left p-2 rounded hover:bg-muted ${currentLanguage === lang.code ? 'bg-primary text-primary-foreground font-semibold' : 'bg-secondary'}`}
              >
                {t(lang.nameKey, lang.code.toUpperCase())}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
        >
          {t('close', 'Close')}
        </button>
      </div>
    </div>
  );
};


const Footer: React.FC = () => {
    const { t, language } = useTranslation(); // Destructure language for date formatting
    const stats = useMemo(() => getStatsData(), []); // Memoize stats calculation

    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

    const handleClickToTop = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    
  return (
    <>
      <div id="footer-wrapper">
        <div id="back-to-top" className="pressable" onClick={handleClickToTop} style={{display: "flex"}}>{t('backToTop', 'Back to Top')}<svg aria-hidden="true" className="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-up-12"></use></svg></div>
        <div id="promo-footer"></div>
        <div className="root__wrapper bp-footer">
          <div className="footer root">
            
            <div className="footer__top">
            <div className="footer__aside">
              <Link rel="home" title={t('breadcrumbHome', 'BestPrice')} className="footer__logo pressable" to="/">
                <svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/logo.svg#icon-logo"></use></svg>
                <span>BestPrice</span> {/* Brand name likely stays untranslated */}
              </Link>
              <div className="footer__identity">
                <p>{t('bestpriceSloganShort', 'The truly best price')}</p>
                <p>{t('bestpriceSloganLong', 'BestPrice is the first and largest price comparison service in Greece.')}</p>
                <p>{t('bestpriceSloganFindDeals', 'At BestPrice you will quickly and easily find real offers and the best price from the largest stores.')}</p>
              </div>
            </div>
            
            <div className="footer__sections">
              <div className="footer__section">
                <div className="footer__section-header">
                  <div className="footer__section-label">{t('categories')}</div>
                  <div className="footer__section-icon">
                    <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div className="footer__section-scroller">
                  <div className="footer__section-content">
                    <ul>
                      {mainCategories.map(category => ( <li key={category.id}><Link to={`/cat/${category.id}/${category.slug}`}>{t(category.slug, category.name)}</Link></li> ))}
                      <li><Link to="/deals">{t('deals')}</Link></li>
                      <li><Link to="/gifts">{t('gifts')}</Link></li>
                      <li><Link to="/give">{t('bestpriceGive', 'BestPrice Give')}</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="footer__section">
                <div className="footer__section-header">
                  {t('footerBestPriceSectionTitle', 'BestPrice')}
                  <div className="footer__section-icon">
                    <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div className="footer__section-scroller">
                  <div className="footer__section-content">
                    <ul>
                      <li><Link to="/about">{t('aboutUs', 'About Us')}</Link></li>
                      <li><Link to="/blog">{t('ourBlog', 'Our Blog')}</Link></li>
                      <li><Link to="/guides">{t('buyingGuides', 'Buying Guides')}</Link></li>
                      <li><Link to="/insurance">{t('purchaseInsurance', 'Purchase Insurance')}</Link></li>
                      <li><Link to="/advertising">{t('advertising', 'Advertising')}</Link></li>
                      <li><Link to="/credits-club">{t('creditsClub', 'Credits Club')}</Link></li>
                      <li><Link to="/certification">{t('bestpriceCertification', 'BestPrice Certification')}</Link></li>
                      <li><Link to="/customer-review-awards">{t('customerReviewAwards', 'Customer Review Awards')}</Link></li>
                      <li><Link to="/awards">{t('ourAwards', 'Our Awards')}</Link></li>
                      <li><Link to="/team">{t('ourTeam', 'Our Team')}</Link></li>
                      <li><Link to="/assistant">{t('bestpriceAssistant', 'BestPrice Assistant')}</Link></li>
                      <li><Link to="/careers">{t('jobOpenings', { count: 5 })}</Link></li>
                      <li><Link to="/contact">{t('contactUs', 'Contact')}</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="footer__section footer__section--in-numbers">
                <div className="footer__section-header">
                  {t('inNumbers', 'In Numbers')}
                  <div className="footer__section-icon">
                    <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div className="footer__section-scroller">
                  <div className="footer__section-content">
                    <ul>
                      <li><Link to="/m">{t('storeCountLink', { count: stats.totalVendors })}</Link></li>
                      <li><Link to="/search">{t('productCountLink', { count: stats.totalProducts })}</Link></li>
                      <li><Link to="/brands">{t('brandCountLink', { count: stats.totalBrands })}</Link></li>
                      <li><Link to="/deals">{t('dealCountLink', { count: stats.totalDeals })}</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="footer__section footer__section--privacy">
                <div className="footer__section-header">
                  {t('termsAndPrivacy', 'Terms & Privacy')}
                  <div className="footer__section-icon">
                    <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                
                <div className="footer__section-scroller">
                  <div className="footer__section-content">
                    <ul>
                      <li><Link rel="nofollow" to="/policies/terms" title={t('termsOfUse', 'Terms of Use')}>{t('termsOfUse', 'Terms of Use')}</Link></li>
                      <li><Link rel="nofollow" to="/policies/privacy" title={t('privacyPolicy', 'Privacy Policy')}>{t('privacyPolicy', 'Privacy Policy')}</Link></li>
                      <li><Link rel="nofollow" to="/policies/cookies" title={t('cookiePolicy', 'Cookie Policy')}>{t('cookiePolicy', 'Cookie Policy')}</Link></li>
                      <li><Link rel="nofollow" to="/gdpr" title={t('gdprLink', 'GDPR')}>{t('gdprLink', 'GDPR')}</Link></li>
                      <li><Link rel="nofollow" to="/policies/dsa" title={t('dsaLink', 'DSA')}>{t('dsaLink', 'DSA')}</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="footer__section footer__section--b2b">
                <div className="footer__b2b">
                  <div className="footer__section-header">
                    {t('bestpriceForMerchants', 'BestPrice For Merchants')}
                    <div className="footer__section-icon">
                      <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <div className="footer__section-scroller">
                    <div className="footer__section-content">
                      <p>{t('merchantsSectionSlogan1', 'Do you have an online store?')}</p>
                      <p>{t('merchantsSectionSlogan2', 'See how BestPrice can help you increase your sales!')}</p>
                      <Link title={t('forMerchantsButton', 'For Merchants')} to="https://merchants.nexushub-commerce.lovable.app" className="button">{t('forMerchantsButton', 'For Merchants')}</Link>
                    </div>
                  </div>
                </div>
                
                <div className="footer__b2b">
                  <div className="footer__section-header">
                    <div>{t('bestpriceForBrands', 'BestPrice For Brands')}</div>
                    <div className="footer__section-icon">
                      <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <div className="footer__section-scroller">
                    <div className="footer__section-content">
                      <p>{t('brandsSectionSlogan', 'BestPrice for Brands will offer useful information & services to manufacturers (Brands).')}</p>
                      <Link title={t('moreInfoButton', 'More Info')} to="https://brands.nexushub-commerce.lovable.app" className="button">{t('moreInfoButton', 'More Info')}</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
            <div className="footer__social">
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnFacebook', 'BestPrice on Facebook')} to="https://www.facebook.com" data-network="facebook" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-facebook-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnX', 'BestPrice on X')} to="https://www.x.com" data-network="x" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-xcom-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnThreads', 'BestPrice on Threads')} to="https://www.threads.net" data-network="Threads" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-threads-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnInstagram', 'BestPrice on Instagram')} to="https://www.instagram.com" data-network="instagram" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-instagram-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnTikTok', 'BestPrice on TikTok')} to="https://www.tiktok.com" data-network="tiktok" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-tik-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnYouTube', 'BestPrice on YouTube')} to="https://www.youtube.com" data-network="youtube" className="footer__network"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/social.svg#icon-yt-old"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnLinkedIn', 'BestPrice on LinkedIn')} to="https://www.linkedin.com/company/" data-network="linkedin" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-linkedin-24"></use></svg></Link>
            </div>
            
            <div className="footer__bottom">
              <div className="footer__copy">
                <Link className="footer__besto" rel="home" title={t('homepageTitle', 'Homepage')} to="/">
                  <svg className="footer__besto" width="20" height="24" viewBox="0 0 20 24" role="img" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.7" fillRule="evenodd" clipRule="evenodd" d="M9.31465 7.39144L9.31034 1.94406C9.30909 0.35542 10.7761 -0.491803 12.1517 0.302442L19.391 4.48202L19.4081 4.49209C19.9694 4.82843 20.1591 5.55421 19.8307 6.12305L19.8206 6.14017C19.4843 6.70151 18.7585 6.89117 18.1897 6.56276L11.7137 2.82386L11.7173 7.38954C11.7178 8.05301 11.1804 8.59128 10.5169 8.5918C9.85345 8.59233 9.31518 8.05491 9.31465 7.39144ZM13.5325 14.6278C12.9579 14.2961 12.7611 13.5614 13.0928 12.9868C13.4245 12.4122 14.1592 12.2153 14.7338 12.5471L19.3991 15.2406C19.9737 15.5723 20.1706 16.307 19.8389 16.8816C19.5071 17.4562 18.7724 17.6531 18.1978 17.3213L13.5325 14.6278Z" fill="#7C8796"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.50285 3.8762C8.06419 3.53986 8.25386 2.81408 7.92544 2.24524C7.59371 1.67066 6.85899 1.47379 6.28441 1.80553L1.6486 4.48202L1.62029 4.4986C0.688823 5.0522 0.007475 6.24182 0.00661889 7.32305L0 15.6797L0.00010011 15.6958L0 15.7066C0 16.7987 0.694851 18.0029 1.64053 18.5513L8.89021 22.7555L8.93148 22.7789C10.2945 23.5359 11.736 22.694 11.736 21.1191V12.76L11.7358 12.7272C11.7221 11.6438 11.0317 10.4582 10.0955 9.91524L3.58377 6.139L7.48573 3.88627L7.50285 3.8762ZM2.40259 15.6816L2.40849 8.23485L8.89016 11.9937L8.90138 12.0004C9.10388 12.1276 9.33337 12.5295 9.33337 12.76L9.33333 20.235L2.8458 16.4728L2.83458 16.4661C2.63208 16.3389 2.40259 15.937 2.40259 15.7066L2.40244 15.693L2.40259 15.6816Z" fill="#758190"></path>
                  </svg>
                  The Best Company S.A. <span className="hide-mobile"> ©  {new Date().getFullYear()}</span>
                </Link>
              </div>
            
              <div className="footer__privacy">
                <Link rel="nofollow" title={t('termsOfUse', 'Terms of Use')} to="/policies/terms">{t('termsOfUse', 'Terms of Use')}</Link>
                <Link rel="nofollow" title={t('privacyPolicy', 'Privacy Policy')} to="/policies/privacy">{t('privacyPolicy', 'Privacy Policy')}</Link>
                <Link rel="nofollow" title={t('cookiePolicy', 'Cookie Policy')} to="/policies/cookies">{t('cookiePolicy', 'Cookie Policy')}</Link>
                <Link rel="nofollow" title={t('gdprLink', 'GDPR')} to="/gdpr">{t('gdprLink', 'GDPR')}</Link>
                <Link rel="nofollow" title={t('dsaLink', 'DSA')} to="/policies/dsa">{t('dsaLink', 'DSA')}</Link>
                {/* Language Selector Link */}
                <button 
                  onClick={() => setIsLanguageModalOpen(true)} 
                  className="ml-4 text-sm hover:underline" // Added some basic styling
                  title={t('changeLanguage', 'Change Language')}
                >
                  {t('changeLanguage', 'Change Language')}
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <LanguageModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
    </>
  );
};

export default Footer;
