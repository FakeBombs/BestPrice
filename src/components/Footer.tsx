import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { brands, products, vendors, mainCategories, Category } from '@/data/mockData';
import { useLanguageContext } from '@/context/LanguageContext';

const getStatsData = () => {
    const totalProducts = products.length;
    const totalVendors = vendors.length;
    const totalBrands = brands.length;
    const totalDeals = products.filter(p => p.prices.some(price => price.discountPrice && price.discountPrice < price.price)).length;
    return { totalProducts, totalVendors, totalBrands, totalDeals };
};

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LanguageOption = {
  code: string; 
  name: string; 
  englishName: string;
  regionKey: string; 
};

const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryEurope' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas' },
  { code: 'es-ES', name: 'Español (España)', englishName: 'Spanish (Spain)', regionKey: 'languageCategoryEurope' },
  { code: 'sq', name: 'Shqip', englishName: 'Albanian', regionKey: 'languageCategoryEurope' },
  { code: 'en-GB', name: 'English (UK)', englishName: 'English (UK)', regionKey: 'languageCategoryEurope' },
  { code: 'fr-FR', name: 'Français (France)', englishName: 'French (France)', regionKey: 'languageCategoryEurope' },
  { code: 'de-DE', name: 'Deutsch', englishName: 'German', regionKey: 'languageCategoryEurope' },
  { code: 'it-IT', name: 'Italiano', englishName: 'Italian', regionKey: 'languageCategoryEurope' },
  { code: 'pt-PT', name: 'Português (Portugal)', englishName: 'Portuguese (Portugal)', regionKey: 'languageCategoryEurope' },
  { code: 'es-MX', name: 'Español (México)', englishName: 'Spanish (Mexico)', regionKey: 'languageCategoryAmericas' },
  { code: 'pt-BR', name: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', regionKey: 'languageCategoryAmericas' },
  { code: 'fr-CA', name: 'Français (Canada)', englishName: 'French (Canada)', regionKey: 'languageCategoryAmericas' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', regionKey: 'languageCategoryAsia' },
  { code: 'ko', name: '한국어', englishName: 'Korean', regionKey: 'languageCategoryAsia' },
  { code: 'zh-CN', name: '中文(简体)', englishName: 'Chinese (Simplified)', regionKey: 'languageCategoryAsia' },
  { code: 'zh-TW', name: '中文(台灣)', englishName: 'Chinese (Traditional)', regionKey: 'languageCategoryAsia' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', regionKey: 'languageCategoryAsia' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', regionKey: 'languageCategoryAfrica' },
  { code: 'he', name: 'עברית', englishName: 'Hebrew', regionKey: 'languageCategoryAfrica' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', regionKey: 'languageCategoryAfrica' },
  { code: 'sw', name: 'Kiswahili', englishName: 'Swahili', regionKey: 'languageCategoryAfrica' },
];

const LANGUAGE_REGIONS_FOR_MODAL = [
    { key: "suggested", nameKey: "suggestedLanguages" },
    { key: "languageCategoryEurope", nameKey: "languageCategoryEurope" },
    { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
    { key: "languageCategoryAsia", nameKey: "languageCategoryAsia" },
    { key: "languageCategoryAfrica", nameKey: "languageCategoryAfrica" },
];

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook, isLoaded } = useTranslation();
  const { setLanguage: setContextLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  const currentContextLangForSort = isLoaded ? currentContextLangFromHook : 'en';

  if (!isOpen) return null;

  const handleLanguageChange = (langCode: string) => {
    const simpleLangCode = langCode.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    if (['en', 'el', 'es', 'fr', 'de'].includes(simpleLangCode)) {
        setContextLanguage(simpleLangCode);
    } else {
        console.warn(`Unsupported language code: ${langCode}.`);
        if (['en', 'el', 'es', 'fr', 'de'].includes(simpleLangCode)){
            setContextLanguage(simpleLangCode);
        }
    }
    onClose();
  };

  const suggestedLangsToDisplay = useMemo(() => {
    return ALL_AVAILABLE_LANGUAGES.filter(lang => 
        ['el', 'en-US', 'sq', 'es-ES'].includes(lang.code)
    );
  }, []); 

  const languagesToDisplay = useMemo(() => {
    let list;
    if (selectedRegion === "suggested") {
        list = suggestedLangsToDisplay;
    } else {
        list = ALL_AVAILABLE_LANGUAGES.filter(lang => lang.regionKey === selectedRegion);
    }
    return [...list].sort((a,b) => a.name.localeCompare(b.name, currentContextLangForSort));
  }, [selectedRegion, suggestedLangsToDisplay, currentContextLangForSort]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2147483647] p-4" onClick={onClose}>
      <div 
        className="bg-background rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border relative">
          <h3 className="text-xl font-semibold text-center">{t('selectYourLanguageTitle')}</h3>
          <button 
            onClick={onClose} 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted"
            aria-label={t('close', 'Close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-1/3 border-r border-border overflow-y-auto p-2 space-y-1 bg-muted/20">
            {LANGUAGE_REGIONS_FOR_MODAL.map(region => (
              <button
                key={region.key}
                onClick={() => setSelectedRegion(region.key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary
                  ${selectedRegion === region.key ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}
              >
                {t(region.nameKey, region.key === "suggested" ? t('suggestedLanguages') : t(region.nameKey, region.key.replace('languageCategory','')))}
              </button>
            ))}
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1">
              {languagesToDisplay.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary
                      ${currentContextLangFromHook === lang.code.split('-')[0] ? 'font-semibold text-primary' : 'text-foreground'}`}
                  >
                    {lang.name}
                    {currentContextLangFromHook === lang.code.split('-')[0] && <span className="ml-2">✓</span>}
                  </button>
                </li>
              ))}
               {languagesToDisplay.length === 0 && selectedRegion !== "suggested" && (
                <li className="px-3 py-2 text-sm text-muted-foreground">{t('noLanguagesInRegion', 'No languages listed for this region yet.')}</li>
              )}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
};


const Footer: React.FC = () => {
    const { t, language } = useTranslation();
    const stats = useMemo(() => getStatsData(), []); 
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
        <div id="back-to-top" className="pressable" onClick={handleClickToTop} style={{display: "flex"}}>{t('backToTop')}<svg aria-hidden="true" className="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-up-12"></use></svg></div>
        <div id="promo-footer"></div>
        <div className="root__wrapper bp-footer">
          <div className="footer root">
            
            <div className="footer__top">
            <div className="footer__aside">
              <Link rel="home" title={t('breadcrumbHome')} className="footer__logo pressable" to="/">
                <svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/logo.svg#icon-logo"></use></svg>
                <span>BestPrice</span>
              </Link>
              <div className="footer__identity">
                <p>{t('bestpriceSloganShort')}</p>
                <p>{t('bestpriceSloganLong')}</p>
                <p>{t('bestpriceSloganFindDeals')}</p>
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
                      <li><Link to="/give">{t('bestpriceGive')}</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="footer__section">
                <div className="footer__section-header">
                  {t('footerBestPriceSectionTitle')}
                  <div className="footer__section-icon">
                    <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div className="footer__section-scroller">
                  <div className="footer__section-content">
                    <ul>
                      <li><Link to="/about">{t('aboutUs')}</Link></li>
                      <li><Link to="/blog">{t('ourBlog')}</Link></li>
                      <li><Link to="/guides">{t('buyingGuides')}</Link></li>
                      <li><Link to="/insurance">{t('purchaseInsurance')}</Link></li>
                      <li><Link to="/advertising">{t('advertising')}</Link></li>
                      <li><Link to="/credits-club">{t('creditsClub')}</Link></li>
                      <li><Link to="/certification">{t('bestpriceCertification')}</Link></li>
                      <li><Link to="/customer-review-awards">{t('customerReviewAwards')}</Link></li>
                      <li><Link to="/awards">{t('ourAwards')}</Link></li>
                      <li><Link to="/team">{t('ourTeam')}</Link></li>
                      <li><Link to="/assistant">{t('bestpriceAssistant')}</Link></li>
                      <li><Link to="/careers">{t('jobOpenings', { count: 5 })}</Link></li>
                      <li><Link to="/contact">{t('contactUs')}</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="footer__section footer__section--in-numbers">
                <div className="footer__section-header">
                  {t('inNumbers')}
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
                  {t('termsAndPrivacy')}
                  <div className="footer__section-icon">
                    <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                
                <div className="footer__section-scroller">
                  <div className="footer__section-content">
                    <ul>
                      <li><Link rel="nofollow" to="/policies/terms" title={t('termsOfUse')}>{t('termsOfUse')}</Link></li>
                      <li><Link rel="nofollow" to="/policies/privacy" title={t('privacyPolicy')}>{t('privacyPolicy')}</Link></li>
                      <li><Link rel="nofollow" to="/policies/cookies" title={t('cookiePolicy')}>{t('cookiePolicy')}</Link></li>
                      <li><Link rel="nofollow" to="/gdpr" title={t('gdprLink')}>{t('gdprLink')}</Link></li>
                      <li><Link rel="nofollow" to="/policies/dsa" title={t('dsaLink')}>{t('dsaLink')}</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="footer__section footer__section--b2b">
                <div className="footer__b2b">
                  <div className="footer__section-header">
                    {t('bestpriceForMerchants')}
                    <div className="footer__section-icon">
                      <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <div className="footer__section-scroller">
                    <div className="footer__section-content">
                      <p>{t('merchantsSectionSlogan1')}</p>
                      <p>{t('merchantsSectionSlogan2')}</p>
                      <Link title={t('forMerchantsButton')} to="https://merchants.nexushub-commerce.lovable.app" className="button">{t('forMerchantsButton')}</Link>
                    </div>
                  </div>
                </div>
                
                <div className="footer__b2b">
                  <div className="footer__section-header">
                    <div>{t('bestpriceForBrands')}</div>
                    <div className="footer__section-icon">
                      <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <div className="footer__section-scroller">
                    <div className="footer__section-content">
                      <p>{t('brandsSectionSlogan')}</p>
                      <Link title={t('moreInfoButton')} to="https://brands.nexushub-commerce.lovable.app" className="button">{t('moreInfoButton')}</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
            <div className="footer__social">
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnFacebook')} to="https://www.facebook.com" data-network="facebook" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-facebook-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnX')} to="https://www.x.com" data-network="x" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-xcom-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnThreads')} to="https://www.threads.net" data-network="Threads" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-threads-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnInstagram')} to="https://www.instagram.com" data-network="instagram" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-instagram-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnTikTok')} to="https://www.tiktok.com" data-network="tiktok" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-tik-24"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnYouTube')} to="https://www.youtube.com" data-network="youtube" className="footer__network"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/social.svg#icon-yt-old"></use></svg></Link>
              <Link target="_blank" rel="external nofollow noopener" title={t('bestpriceOnLinkedIn')} to="https://www.linkedin.com/company/" data-network="linkedin" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-linkedin-24"></use></svg></Link>
            </div>
            
            <div className="footer__bottom">
              <div className="footer__copy">
                <Link className="footer__besto" rel="home" title={t('homepageTitle')} to="/">
                  <svg className="footer__besto" width="20" height="24" viewBox="0 0 20 24" role="img" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.7" fillRule="evenodd" clipRule="evenodd" d="M9.31465 7.39144L9.31034 1.94406C9.30909 0.35542 10.7761 -0.491803 12.1517 0.302442L19.391 4.48202L19.4081 4.49209C19.9694 4.82843 20.1591 5.55421 19.8307 6.12305L19.8206 6.14017C19.4843 6.70151 18.7585 6.89117 18.1897 6.56276L11.7137 2.82386L11.7173 7.38954C11.7178 8.05301 11.1804 8.59128 10.5169 8.5918C9.85345 8.59233 9.31518 8.05491 9.31465 7.39144ZM13.5325 14.6278C12.9579 14.2961 12.7611 13.5614 13.0928 12.9868C13.4245 12.4122 14.1592 12.2153 14.7338 12.5471L19.3991 15.2406C19.9737 15.5723 20.1706 16.307 19.8389 16.8816C19.5071 17.4562 18.7724 17.6531 18.1978 17.3213L13.5325 14.6278Z" fill="#7C8796"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.50285 3.8762C8.06419 3.53986 8.25386 2.81408 7.92544 2.24524C7.59371 1.67066 6.85899 1.47379 6.28441 1.80553L1.6486 4.48202L1.62029 4.4986C0.688823 5.0522 0.007475 6.24182 0.00661889 7.32305L0 15.6797L0.00010011 15.6958L0 15.7066C0 16.7987 0.694851 18.0029 1.64053 18.5513L8.89021 22.7555L8.93148 22.7789C10.2945 23.5359 11.736 22.694 11.736 21.1191V12.76L11.7358 12.7272C11.7221 11.6438 11.0317 10.4582 10.0955 9.91524L3.58377 6.139L7.48573 3.88627L7.50285 3.8762ZM2.40259 15.6816L2.40849 8.23485L8.89016 11.9937L8.90138 12.0004C9.10388 12.1276 9.33337 12.5295 9.33337 12.76L9.33333 20.235L2.8458 16.4728L2.83458 16.4661C2.63208 16.3389 2.40259 15.937 2.40259 15.7066L2.40244 15.693L2.40259 15.6816Z" fill="#758190"></path>
                  </svg>
                  The Best Company S.A. <span className="hide-mobile"> ©  {new Date().getFullYear()}</span>
                </Link>
              </div>
            
              <div className="footer__privacy">
                <Link rel="nofollow" title={t('termsOfUse')} to="/policies/terms">{t('termsOfUse')}</Link>
                <Link rel="nofollow" title={t('privacyPolicy')} to="/policies/privacy">{t('privacyPolicy')}</Link>
                <Link rel="nofollow" title={t('cookiePolicy')} to="/policies/cookies">{t('cookiePolicy')}</Link>
                <Link rel="nofollow" title={t('gdprLink')} to="/gdpr">{t('gdprLink')}</Link>
                <Link rel="nofollow" title={t('dsaLink')} to="/policies/dsa">{t('dsaLink')}</Link>
                <button 
                  onClick={() => setIsLanguageModalOpen(true)} 
                  className="ml-4 text-sm hover:underline"
                  title={t('changeLanguage')}
                >
                  {t('changeLanguage')}
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
