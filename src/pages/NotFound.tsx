
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="root__wrapper" id="root-404">
      <div className="root">
      <h1 className="heading">Η σελίδα που ψάχνεις δεν είναι πλέον διαθέσιμη...</h1>
      <p>Αλλά μην ανησυχείς, είσαι στο πιο κατάλληλο μέρος για γρήγορη, ασφαλή και εύχρηστη έρευνα αγοράς!</p>
      </div>
    </div>
    
    <div className="top-deals__placeholder">
    <div className="top-deals">
      <div className="top-deals__header root">
        <h3 className="top-deals__title">Σημερινές προσφορές</h3>
        <div className="top-deals__more">
          <Link to="/deals" className="dotted">Όλες οι προσφορές</Link>
        </div>
      </div>
      <div className="scroll scroll--center scroll--no-scrolling">
        <div className="scroll__clip" style={{overflow: "hidden"}}>
          <div className="scroll__scroller">
            <div className="top-deals__products scroll__content">
              <div className="top-deals__product-wrapper"></div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default NotFound;
