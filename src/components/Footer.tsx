
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <div id="footer-wrapper">
      <div id="back-to-top" className="pressable" style={{display: "flex"}}>Επιστροφή στην κορυφή</div>
      <div id="promo-footer"></div>
      <div className="root__wrapper bp-footer">
        <div className="footer root">
          <div class="footer__top">
          <div>
            <h3 className="text-lg font-semibold mb-4">BestPrice</h3>
            <p className="text-sm text-gray-600 mb-4">Το BestPrice είναι η πρώτη και μεγαλύτερη υπηρεσία σύγκρισης τιμών στην Ελλάδα.</p>
            <p className="text-sm text-gray-600 mb-4">Στο BestPrice θα βρεις γρήγορα και εύκολα πραγματικές προσφορές και την καλύτερη τιμή από τα μεγαλύτερα καταστήματα.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary"><Facebook size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-primary"><Twitter size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-primary"><Instagram size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-primary"><Youtube size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Κατηγορίες</h3>
            <ul className="space-y-2">
              <li><Link to="/categories/c1" className="text-sm text-gray-600 hover:text-primary">Smartphones</Link></li>
              <li><Link to="/categories/c2" className="text-sm text-gray-600 hover:text-primary">Laptops</Link></li>
              <li><Link to="/categories/c3" className="text-sm text-gray-600 hover:text-primary">Tablets</Link></li>
              <li><Link to="/categories/c4" className="text-sm text-gray-600 hover:text-primary">Headphones</Link></li>
              <li><Link to="/categories/c5" className="text-sm text-gray-600 hover:text-primary">Cameras</Link></li>
            </ul>
          </div>
          
          <div>
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
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Σε αριθμούς</h3>
            <ul className="space-y-2">
              <li><Link to="/stores" className="text-sm text-gray-600 hover:text-primary">3.752 καταστήματα</Link></li>
              <li><Link to="/categories" className="text-sm text-gray-600 hover:text-primary">27.155.066 προϊόντα</Link></li>
              <li><Link to="/brands" className="text-sm text-gray-600 hover:text-primary">37.297 κατασκευαστές</Link></li>
              <li><Link to="/deals" className="text-sm text-gray-600 hover:text-primary">6.624 προσφορές</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600"><Mail size={16} className="mr-2" />contact@bestprice.example</li>
              <li className="flex items-center text-sm text-gray-600"><Phone size={16} className="mr-2" />+1 (555) 123-4567</li>
            </ul>
          </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6">
          <p className="text-center text-sm text-gray-600">© {new Date().getFullYear()} BestPrice Marketplace. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
