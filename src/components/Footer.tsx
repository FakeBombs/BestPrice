import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div id="footer-wrapper">
      <div id="back-to-top" className="pressable" style={{display: "flex"}}>Επιστροφή στην κορυφή<svg aria-hidden="true" class="icon" width="12" height="12"><path d="M1.41 9.41L6 4.83L10.59 9.41L12 8L6 2L0 8L1.41 9.41Z"/></svg></div>
      <div id="promo-footer"></div>
      <div className="root__wrapper bp-footer">
        <div className="footer root">
          
          <div className="footer__top">
          <div className="footer__aside">
            <Link rel="home" title="BestPrice" class="footer__logo pressable" to="/">
              <svg aria-hidden="true" class="icon" width="100%" height="100%"><path fill-rule="evenodd" d="M25.016 8.96052C25.3883 8.98468 25.9053 8.91067 25.9914 9.40857C26.0751 9.8923 25.5021 10.1517 25.1015 10.2202C24.1869 10.377 23.2839 10.0922 22.4875 9.65742L22.2603 9.53529L21.5837 12.7709C22.9048 13.1744 24.5267 13.2773 25.8989 13.0421C28.2431 12.6404 30.3538 10.9752 29.9109 8.4146C29.5958 6.59385 28.2426 5.91754 26.5204 5.8318L25.5998 5.7846C25.2872 5.76493 24.7914 5.79123 24.7224 5.39303C24.6462 4.95211 25.1243 4.73833 25.4674 4.67941C26.3249 4.53251 27.1299 4.76076 27.8804 5.10075L28.4475 2.25371L28.9046 4.89594L31.0457 4.42658L32.3156 11.7668L36.2322 11.0956L34.9621 3.75537L37.1378 3.48522L36.5348 0L28.3015 1.41083L28.4316 2.16237C27.2896 1.72523 26.1166 1.60942 24.8846 1.82065C22.5403 2.22231 20.4565 4.04419 20.897 6.59038C21.1853 8.25475 22.6149 8.94727 24.2052 8.95297L25.016 8.96052ZM21.0173 10.6856L17.6011 11.271L17.419 10.2184L20.435 9.70156L19.9526 6.91345L16.9366 7.43021L16.7593 6.40596L20.0612 5.84027L19.5542 2.90984L12.3072 4.15174L14.1579 14.8482L10.4896 15.4768C12.1488 15.0332 13.6351 13.9518 13.2939 11.9798C13.0699 10.6852 12.1957 9.9709 10.9379 9.76171L10.9231 9.67638C11.829 9.21345 12.129 8.22467 11.9641 7.27169C11.5359 4.79655 9.33413 4.66126 7.23299 5.02113L2.67325 5.80255L4.52388 16.4989L0 17.2742L1.85586 28L5.62947 27.3532L5.07069 24.1242L7.07183 23.7813C9.25883 23.4065 10.3948 21.8058 10.0158 19.6152C9.59539 17.1848 7.82292 16.1729 5.6015 16.3446L9.55338 15.6672L11.4041 26.3638L15.2349 25.7074L14.6393 22.2649L17.0216 25.4011L25.3117 23.9806L23.4561 13.2549L21.5193 13.5867L21.0173 10.6856ZM6.24871 20.1288C6.3988 20.9965 5.67517 21.2378 4.98913 21.3553L4.60308 21.4213L4.28066 19.5579L4.65236 19.4943C5.29557 19.3841 6.10343 19.2896 6.24871 20.1288ZM7.01763 9.30581L6.75186 7.76949L7.46648 7.64705C7.9096 7.5711 8.35118 7.65653 8.4521 8.23976C8.58017 8.97938 7.94669 9.14657 7.37499 9.24454L7.01763 9.30581ZM8.15969 13.2698L7.71658 13.3457L7.40891 11.5676L7.79485 11.5014C8.42382 11.3937 9.42193 11.2079 9.57705 12.1042C9.7296 12.986 8.78856 13.1619 8.15969 13.2698ZM14.4727 19.6861L14.2012 19.7327L13.8862 17.9121L14.1864 17.8606C14.8725 17.743 15.4591 17.7304 15.6043 18.5697C15.742 19.3663 15.1161 19.5761 14.4727 19.6861ZM18.5913 21.5436C18.3203 21.2532 18.0645 21.1359 17.823 21.0162L17.8083 20.9308C19.1658 20.1856 19.6958 19.421 19.4128 17.7851C18.9902 15.3427 17.1354 14.5573 14.9783 14.7378L19.5447 13.9552L21.3585 24.4386L18.5913 21.5436ZM28.9009 17.8439C28.6989 16.6772 29.4966 15.5885 30.6688 15.3877C31.5692 15.2333 32.4273 15.5989 33.1571 16.0744L32.3363 12.0113C31.4439 11.8715 30.5306 11.8668 29.6301 12.0211C26.4711 12.5625 24.4312 15.4897 24.9728 18.6193C25.502 21.6776 28.3144 23.6419 31.3876 23.1154C32.0881 22.9952 33.5406 22.6292 34.1009 22.2109L33.5213 18.1797C32.9985 18.8991 32.3643 19.4033 31.4495 19.56C30.2775 19.761 29.1049 19.0244 28.9009 17.8439ZM33.527 14.936L33.3689 16.574L34.5123 16.3781L34.5962 16.8616L33.8813 16.9843L33.7234 18.6223L35.167 18.3751C36.3082 20.3766 38.5222 21.5203 40.9665 21.1014C41.667 20.9814 43.1196 20.6155 43.68 20.1971L43.3099 17.463C42.1131 17.9462 40.6457 18.2271 39.598 17.6156L42.4281 17.1308L42.5863 15.4925L38.5553 16.1832C38.5311 16.1288 38.5213 16.0718 38.5116 16.015L38.4796 15.83L38.4573 15.702L42.0738 15.0823L42.2319 13.4441L38.8585 14.022C39.6472 13.052 41.2292 12.7518 42.5282 12.6902L41.9153 9.99771C41.0226 9.85784 40.1094 9.85316 39.2088 10.0075C36.6933 10.4385 34.8702 12.4061 34.5275 14.7643L33.527 14.936ZM33.2002 24.6066C32.7805 24.6066 32.3434 24.8759 32.3434 25.3336C32.3434 25.7857 32.7806 26.0431 33.2002 26.0431C33.6199 26.0431 34.0568 25.7857 34.0568 25.3336C34.0569 24.8758 33.6199 24.6066 33.2002 24.6066ZM36.443 24.4522H37.1559C37.0813 24.7097 36.765 24.83 36.5178 24.83C36.0061 24.83 35.707 24.3836 35.707 23.9086C35.707 23.388 36.0175 22.9074 36.581 22.9074C36.8342 22.9074 37.0584 23.0161 37.179 23.2392L38.6509 22.7014C38.3118 21.9632 37.2768 21.5911 36.5234 21.5911C35.1607 21.5911 34.1201 22.4438 34.1201 23.8458C34.1201 25.2304 35.1896 26.0431 36.5121 26.0431C37.179 26.0431 37.892 25.7798 38.3521 25.2763C38.8637 24.7213 38.8581 24.1433 38.8753 23.4339H36.4431L36.443 24.4522ZM41.8249 24.315V24.2805C42.4055 24.0803 42.6643 23.8171 42.6643 23.1591C42.6643 22.0719 41.8422 21.6598 40.8589 21.6598H38.9556V25.9744H40.4964V24.5896H40.5253L41.2152 25.9744H43.0322L42.0891 24.5725C42.003 24.4409 41.9111 24.378 41.8249 24.315ZM40.6058 23.5711H40.4965V22.8386H40.6174C40.8933 22.8386 41.1233 22.8729 41.1233 23.2105C41.1232 23.531 40.8646 23.5711 40.6058 23.5711Z"/></svg>
              <span>BestPrice</span>
            </Link>
            <div class="footer__identity">
              <p>Η πραγματικά καλύτερη τιμή</p>
              <p>Το BestPrice είναι η πρώτη και μεγαλύτερη υπηρεσία σύγκρισης τιμών στην Ελλάδα.</p>
              <p>Στο BestPrice θα βρεις γρήγορα και εύκολα πραγματικές προσφορές και την καλύτερη τιμή από τα μεγαλύτερα καταστήματα.</p>
            </div>
          </div>
          
          <div className="footer__sections">
            <div className="footer__section">
            <h3 className="text-lg font-semibold mb-4">{t('categories')}</h3>
              <div class="footer__section-scroller">
                <div class="footer__section-content">
                  <ul>
                    <li><Link to="/categories/c1">{t('technology')}</Link></li>
                    <li><Link to="/categories/c2">Σπίτι & Κήπος</Link></li>
                    <li><Link to="/categories/c3">Μόδα</Link></li>
                    <li><Link to="/categories/c4">Υγεία & Ομορφιά</Link></li>
                    <li><Link to="/categories/c5">Παιδικά, Βρεφικά</Link></li>
                    <li><Link to="/categories/c1">Αθλητισμός, Hobby</Link></li>
                    <li><Link to="/categories/c2">Μηχανοκίνηση</Link></li>
                    <li><Link to="/deals">{t('deals')}</Link></li>
                    <li><Link to="/gifts">{t('gifts')}</Link></li>
                    <li><Link to="/give">BestPrice Give</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer__section">
              <div class="footer__section-header">
                BestPrice
                <div class="footer__section-icon"></div>
              </div>
              <div class="footer__section-scroller">
                <div class="footer__section-content">
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
              <div class="footer__section-header">
                Σε αριθμούς
                <div class="footer__section-icon"></div>
              </div>
              <div class="footer__section-scroller">
                <div class="footer__section-content">
                  <ul>
                    <li><Link to="/stores">3.752 καταστήματα</Link></li>
                    <li><Link to="/categories">27.155.066 προϊόντα</Link></li>
                    <li><Link to="/brands">37.297 κατασκευαστές</Link></li>
                    <li><Link to="/deals">6.624 προσφορές</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer__section footer__section--privacy">
              <div className="footer__section-header">
                Όροι χρήσης &amp; ιδιωτικότητα
                <div className="footer__section-icon"></div>
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
              <div class="footer__b2b">
                <div class="footer__section-header">
                  BestPrice For Merchants
                  <div class="footer__section-icon"></div>
                </div>
                <div class="footer__section-scroller">
                  <div class="footer__section-content">
                    <p>Έχεις ηλεκτρονικό κατάστημα;</p>
                    <p>Δες πως το BestPrice μπορεί να σε βοηθήσει να αυξήσεις τις πωλήσεις σου!</p>
                    <Link title="Πληροφορίες και είσοδος στο BestPrice For Merchants" to="https://merchants.nexushub-commerce.lovable.app" class="button">Για εμπόρους</Link>
                  </div>
                </div>
              </div>
              
              <div class="footer__b2b">
                <div class="footer__section-header">
                  <div>BestPrice For Brands</div>
                  <div class="footer__section-icon"></div>
                </div>
                <div class="footer__section-scroller">
                  <div class="footer__section-content">
                    <p>Το BestPrice for Brands θα προσφέρει χρήσιμες πληροφορίες &amp; υπηρεσίες σε κατασκευαστές (Brands).</p>
                    <Link title="Εκδήλωση ενδιαφέροντος για το BestPrice For Brands" to="https://brands.nexushub-commerce.lovable.app" class="button">Περισσότερα</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          
          <div className="footer__social">
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο Facebook" to="https://www.facebook.com" data-network="facebook" class="footer__network"><Facebook size={24} /></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο Twitter" to="https://www.x.com" data-network="x" class="footer__network"><Twitter size={24} /></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο Threads" to="https://www.threads.net" data-network="Threads" class="footer__network"><Facebook size={24} /></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο Facebook" to="https://www.instagram.com" data-network="instagram" class="footer__network"><Instagram size={24} /></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο TikTok" to="https://www.tiktok.com" data-network="tiktok" class="footer__network"><Facebook size={24} /></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο YouTube" to="https://www.youtube.com" data-network="youtube" class="footer__network"><Youtube size={24} /></Link>
            <Link target="_blank" rel="external nofollow noopener" title="Το BestPrice στο LinkedIn" to="https://www.linkedin.com/company/" data-network="linkedin" class="footer__network"><Facebook size={24} /></Link>
          </div>
          
          <div className="footer__bottom">
            <div className="footer__copy">
              <Link className="footer__besto" rel="home" title="Αρχική σελίδα" to="/">
                <svg className="footer__besto" width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
