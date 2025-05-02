import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { brands, products , vendors, mainCategories } from '@/data/mockData';

// Define the getStats function inside the Footer component
const getStats = () => {
    const totalProducts = products.length;
    const totalVendors = vendors.length;
    const totalBrands = brands.length;
    const totalDeals = products.length >= 5 ? 5 : products.length;

    return {
        totalProducts,
        totalVendors,
        totalBrands,
        totalDeals,
    };
};

const Footer: React.FC = () => {
    const stats = getStats();

    const totalProductsMessage = `Total Products: ${stats.totalProducts}`;
    const totalVendorsMessage = `Total Vendors: ${stats.totalVendors}`;
    const totalBrandsMessage = `Total Brands: ${stats.totalBrands}`;
    const totalDealsMessage = `Total Deals: ${stats.totalDeals}`;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    
    const { t } = useTranslation();
  return (
    <div id="footer-wrapper">
      <div id="back-to-top" className="pressable" onClick={handleClick} style={{display: "flex"}}>Επιστροφή στην κορυφή<svg aria-hidden="true" className="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-up-12"></use></svg></div>
      <div id="promo-footer"></div>
      <div className="root__wrapper bp-footer">
        <div className="footer root">
          
          <div className="footer__top">
          <div className="footer__aside">
            <Link rel="home" title="BestPrice" className="footer__logo pressable" to="/">
              <svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/logo.svg#icon-logo"></use></svg>
              <span>BestPrice</span>
            </Link>
            <div className="footer__identity">
              <p>Η πραγματικά καλύτερη τιμή</p>
              <p>Το BestPrice είναι η πρώτη και μεγαλύτερη υπηρεσία σύγκρισης τιμών στην Ελλάδα.</p>
              <p>Στο BestPrice θα βρεις γρήγορα και εύκολα πραγματικές προσφορές και την καλύτερη τιμή από τα μεγαλύτερα καταστήματα.</p>
            </div>
          </div>
          
          <div className="footer__sections">
            <div className="footer__section">
              <div className="footer__section-header">
                <div className="footer__section-label">{t('categories')}</div>
                <div className="footer__section-icon">
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>
              <div className="footer__section-scroller">
                <div className="footer__section-content">
                  <ul>
                    {mainCategories.map(category => ( <li><Link key={category.id} to={`/cat/${category.id}/${category.slug}`}>{t(category.name)}</Link></li> ))}
                    <li><Link to="/deals">{t('deals')}</Link></li>
                    <li><Link to="/gifts">{t('gifts')}</Link></li>
                    <li><Link to="/give">BestPrice Give</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer__section">
              <div className="footer__section-header">
                BestPrice
                <div className="footer__section-icon">
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>
              <div className="footer__section-scroller">
                <div className="footer__section-content">
                  <ul>
                    <li><Link to="/about">Σχετικά με εμάς</Link></li>
                    <li><Link to="/blog">Το Blog μας</Link></li>
                    <li><Link to="/guides">Οδηγοί αγοράς</Link></li>
                    <li><Link to="/insurance">Ασφάλιση Αγορών</Link></li>
                    <li><Link to="/advertising">Διαφήμιση</Link></li>
                    <li><Link to="/credits-club">Credits Club</Link></li>
                    <li><Link to="/certification">Πιστοποίηση BestPrice</Link></li>
                    <li><Link to="/customer-review-awards">Customer Review Awards</Link></li>
                    <li><Link to="/awards">Οι διακρίσεις μας</Link></li>
                    <li><Link to="/team">Η ομάδα μας</Link></li>
                    <li><Link to="/assistant">BestPrice Assistant</Link></li>
                    <li><Link to="/careers">Θέσεις εργασίας (5)</Link></li>
                    <li><Link to="/contact">Επικοινωνία</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer__section footer__section--in-numbers">
              <div className="footer__section-header">
                Σε αριθμούς
                <div className="footer__section-icon">
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>
              <div className="footer__section-scroller">
                <div className="footer__section-content">
                  <ul>
                    <li><Link to="/m">{stats.totalVendors} καταστήματα</Link></li>
                    <li><Link to="/search">{stats.totalProducts} προϊόντα</Link></li>
                    <li><Link to="/brands">{stats.totalBrands} κατασκευαστές</Link></li>
                    <li><Link to="/deals">{stats.totalDeals} προσφορές</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer__section footer__section--privacy">
              <div className="footer__section-header">
                Όροι χρήσης &amp; ιδιωτικότητα
                <div className="footer__section-icon">
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>
              
              <div className="footer__section-scroller">
                <div className="footer__section-content">
                  <ul>
                    <li><Link rel="nofollow" to="/policies/terms">Όροι χρήσης</Link></li>
                    <li><Link rel="nofollow" to="/policies/privacy">Πολιτική προσωπικών δεδομένων</Link></li>
                    <li><Link rel="nofollow" to="/policies/cookies">Χρήση cookies</Link></li>
                    <li><Link rel="nofollow" to="/gdpr">GDPR</Link></li>
                    <li><Link rel="nofollow" to="/policies/dsa">DSA</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer__section footer__section--b2b">
              <div className="footer__b2b">
                <div className="footer__section-header">
                  BestPrice For Merchants
                  <div className="footer__section-icon">
                    <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                </div>
                <div className="footer__section-scroller">
                  <div className="footer__section-content">
                    <p>Έχεις ηλεκτρονικό κατάστημα;</p>
                    <p>Δες πως το BestPrice μπορεί να σε βοηθήσει να αυξήσεις τις πωλήσεις σου!</p>
                    <Link title="Πληροφορίες και είσοδος στο BestPrice For Merchants" to="https://merchants.nexushub-commerce.lovable.app" className="button">Για εμπόρους</Link>
                  </div>
                </div>
              </div>
              
              <div className="footer__b2b">
                <div className="footer__section-header">
                  <div>BestPrice For Brands</div>
                  <div className="footer__section-icon">
                    <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                </div>
                <div className="footer__section-scroller">
                  <div className="footer__section-content">
                    <p>Το BestPrice for Brands θα προσφέρει χρήσιμες πληροφορίες &amp; υπηρεσίες σε κατασκευαστές (Brands).</p>
                    <Link title="Εκδήλωση ενδιαφέροντος για το BestPrice For Brands" to="https://brands.nexushub-commerce.lovable.app" className="button">Περισσότερα</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          
          <div className="footer__social">
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο Facebook" to="https://www.facebook.com" data-network="facebook" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-facebook-24"></use></svg></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο Twitter" to="https://www.x.com" data-network="x" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-xcom-24"></use></svg></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο Threads" to="https://www.threads.net" data-network="Threads" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-threads-24"></use></svg></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο Instagram" to="https://www.instagram.com" data-network="instagram" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-instagram-24"></use></svg></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο TikTok" to="https://www.tiktok.com" data-network="tiktok" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-tik-24"></use></svg></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο YouTube" to="https://www.youtube.com" data-network="youtube" className="footer__network"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/social.svg#icon-yt-old"></use></svg></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο LinkedIn" to="https://www.linkedin.com/company/" data-network="linkedin" className="footer__network"><svg aria-hidden="true" className="icon" width="24" height="24"><use href="/dist/images/icons/social.svg#icon-linkedin-24"></use></svg></Link>
          </div>
          
          <div className="footer__bottom">
            <div className="footer__copy">
              <Link className="footer__besto" rel="home" title="Αρχική σελίδα" to="/">
                <svg className="footer__besto" width="20" height="24" viewBox="0 0 20 24" role="img" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M9.31465 7.39144L9.31034 1.94406C9.30909 0.35542 10.7761 -0.491803 12.1517 0.302442L19.391 4.48202L19.4081 4.49209C19.9694 4.82843 20.1591 5.55421 19.8307 6.12305L19.8206 6.14017C19.4843 6.70151 18.7585 6.89117 18.1897 6.56276L11.7137 2.82386L11.7173 7.38954C11.7178 8.05301 11.1804 8.59128 10.5169 8.5918C9.85345 8.59233 9.31518 8.05491 9.31465 7.39144ZM13.5325 14.6278C12.9579 14.2961 12.7611 13.5614 13.0928 12.9868C13.4245 12.4122 14.1592 12.2153 14.7338 12.5471L19.3991 15.2406C19.9737 15.5723 20.1706 16.307 19.8389 16.8816C19.5071 17.4562 18.7724 17.6531 18.1978 17.3213L13.5325 14.6278Z" fill="#7C8796"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.50285 3.8762C8.06419 3.53986 8.25386 2.81408 7.92544 2.24524C7.59371 1.67066 6.85899 1.47379 6.28441 1.80553L1.6486 4.48202L1.62029 4.4986C0.688823 5.0522 0.007475 6.24182 0.00661889 7.32305L0 15.6797L0.00010011 15.6958L0 15.7066C0 16.7987 0.694851 18.0029 1.64053 18.5513L8.89021 22.7555L8.93148 22.7789C10.2945 23.5359 11.736 22.694 11.736 21.1191V12.76L11.7358 12.7272C11.7221 11.6438 11.0317 10.4582 10.0955 9.91524L3.58377 6.139L7.48573 3.88627L7.50285 3.8762ZM2.40259 15.6816L2.40849 8.23485L8.89016 11.9937L8.90138 12.0004C9.10388 12.1276 9.33337 12.5295 9.33337 12.76L9.33333 20.235L2.8458 16.4728L2.83458 16.4661C2.63208 16.3389 2.40259 15.937 2.40259 15.7066L2.40244 15.693L2.40259 15.6816Z" fill="#758190"></path>
                </svg>
                The Best Company S.A.&nbsp;<span className="hide-mobile">&nbsp;©&nbsp; {new Date().getFullYear()}</span>
              </Link>
            </div>
          
            <div className="footer__privacy">
              <Link rel="nofollow" title="Όροι χρήσης" to="/policies/terms">Όροι χρήσης</Link>
              <Link rel="nofollow" title="Προσωπικά δεδομένα" to="/policies/privacy">Προσωπικά δεδομένα</Link>
              <Link rel="nofollow" title="Cookies" to="/policies/cookies">Cookies</Link>
              <Link rel="nofollow" title="GDPR" to="/gdpr">GDPR</Link>
              <Link rel="nofollow" title="GDPR" to="/policies/dsa">DSA</Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Footer;
