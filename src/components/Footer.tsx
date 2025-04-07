import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <div id="footer-wrapper">
      <div id="back-to-top" className="pressable" style={{display: "flex"}}>Επιστροφή στην κορυφή</div>
      <div id="promo-footer"></div>
      <div className="root__wrapper bp-footer">
        <div className="footer root">
          
          <div className="footer__top">
          <div className="footer__aside">
            <h3 className="text-lg font-semibold mb-4">BestPrice</h3>
            <p className="text-sm text-gray-600 mb-4">Το BestPrice είναι η πρώτη και μεγαλύτερη υπηρεσία σύγκρισης τιμών στην Ελλάδα.</p>
            <p className="text-sm text-gray-600 mb-4">Στο BestPrice θα βρεις γρήγορα και εύκολα πραγματικές προσφορές και την καλύτερη τιμή από τα μεγαλύτερα καταστήματα.</p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-500 hover:text-primary"><Facebook size={20} /></Link>
              <Link to="#" className="text-gray-500 hover:text-primary"><Twitter size={20} /></Link>
              <Link to="#" className="text-gray-500 hover:text-primary"><Instagram size={20} /></Link>
              <Link to="#" className="text-gray-500 hover:text-primary"><Youtube size={20} /></Link>
            </div>
          </div>
          
          <div className="footer__sections">
            <div className="footer__section">
            <h3 className="text-lg font-semibold mb-4">Κατηγορίες</h3>
            <ul className="space-y-2">
              <li><Link to="/categories/c1" className="text-sm text-gray-600 hover:text-primary">Smartphones</Link></li>
              <li><Link to="/categories/c2" className="text-sm text-gray-600 hover:text-primary">Laptops</Link></li>
              <li><Link to="/categories/c3" className="text-sm text-gray-600 hover:text-primary">Tablets</Link></li>
              <li><Link to="/categories/c4" className="text-sm text-gray-600 hover:text-primary">Headphones</Link></li>
              <li><Link to="/categories/c5" className="text-sm text-gray-600 hover:text-primary">Cameras</Link></li>
            </ul>
            </div>

            <div className="footer__section">
            <h3 className="text-lg font-semibold mb-4">BestPrice</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-primary">Σχετικά με εμάς</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-600 hover:text-primary">Το Blog μας</Link></li>
              <li><Link to="/guides" className="text-sm text-gray-600 hover:text-primary">Οδηγοί αγοράς</Link></li>
              <li><Link to="/advertising" className="text-sm text-gray-600 hover:text-primary">Διαφήμιση</Link></li>
              <li><Link to="/awards" className="text-sm text-gray-600 hover:text-primary">Οι διακρίσεις μας</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">Προσωπικά δεδομένα</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-primary">Όροι χρήσης</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-600 hover:text-primary">Θέσεις εργασίας (5)</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-primary">Επικοινωνία</Link></li>
            </ul>
            </div>

            <div className="footer__section footer__section--in-numbers">
            <h3 className="text-lg font-semibold mb-4">Σε αριθμούς</h3>
            <ul className="space-y-2">
              <li><Link to="/stores" className="text-sm text-gray-600 hover:text-primary">3.752 καταστήματα</Link></li>
              <li><Link to="/categories" className="text-sm text-gray-600 hover:text-primary">27.155.066 προϊόντα</Link></li>
              <li><Link to="/brands" className="text-sm text-gray-600 hover:text-primary">37.297 κατασκευαστές</Link></li>
              <li><Link to="/deals" className="text-sm text-gray-600 hover:text-primary">6.624 προσφορές</Link></li>
            </ul>
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
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600"><Mail size={16} className="mr-2" />contact@bestprice.example</li>
              <li className="flex items-center text-sm text-gray-600"><Phone size={16} className="mr-2" />+1 (555) 123-4567</li>
            </ul>
            </div>
          </div>
        </div>
          
          <div className="footer__social">
            <p className="text-center text-sm text-gray-600">© {new Date().getFullYear()} BestPrice Marketplace. All rights reserved.</p>
          </div>
          
          <div className="footer__bottom">
            <div className="footer__copy">
              <Link className="footer__besto" rel="home" title="Αρχική σελίδα" to="/">
                <svg className="footer__besto" width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M9.31465 7.39144L9.31034 1.94406C9.30909 0.35542 10.7761 -0.491803 12.1517 0.302442L19.391 4.48202L19.4081 4.49209C19.9694 4.82843 20.1591 5.55421 19.8307 6.12305L19.8206 6.14017C19.4843 6.70151 18.7585 6.89117 18.1897 6.56276L11.7137 2.82386L11.7173 7.38954C11.7178 8.05301 11.1804 8.59128 10.5169 8.5918C9.85345 8.59233 9.31518 8.05491 9.31465 7.39144ZM13.5325 14.6278C12.9579 14.2961 12.7611 13.5614 13.0928 12.9868C13.4245 12.4122 14.1592 12.2153 14.7338 12.5471L19.3991 15.2406C19.9737 15.5723 20.1706 16.307 19.8389 16.8816C19.5071 17.4562 18.7724 17.6531 18.1978 17.3213L13.5325 14.6278Z" fill="#7C8796"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.50285 3.8762C8.06419 3.53986 8.25386 2.81408 7.92544 2.24524C7.59371 1.67066 6.85899 1.47379 6.28441 1.80553L1.6486 4.48202L1.62029 4.4986C0.688823 5.0522 0.007475 6.24182 0.00661889 7.32305L0 15.6797L0.00010011 15.6958L0 15.7066C0 16.7987 0.694851 18.0029 1.64053 18.5513L8.89021 22.7555L8.93148 22.7789C10.2945 23.5359 11.736 22.694 11.736 21.1191V12.76L11.7358 12.7272C11.7221 11.6438 11.0317 10.4582 10.0955 9.91524L3.58377 6.139L7.48573 3.88627L7.50285 3.8762ZM2.40259 15.6816L2.40849 8.23485L8.89016 11.9937L8.90138 12.0004C9.10388 12.1276 9.33337 12.5295 9.33337 12.76L9.33333 20.235L2.8458 16.4728L2.83458 16.4661C2.63208 16.3389 2.40259 15.937 2.40259 15.7066L2.40244 15.693L2.40259 15.6816Z" fill="#758190"></path>
                </svg>
                The Best Company S.A.&nbsp;<span className="hide-mobile">&nbsp;©&nbsp; 2025</span>
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
