
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div class="root__wrapper" id="root-404">
      <div class="root">
      <h1 class="heading">Η σελίδα που ψάχνεις δεν είναι πλέον διαθέσιμη...</h1>
      <p>Αλλά μην ανησυχείς, είσαι στο πιο κατάλληλο μέρος για γρήγορη, ασφαλή και εύχρηστη έρευνα αγοράς!</p>
      </div>
    </div>
    
    <div class="actions__404">
    <Link to="/" class="button button--outline">Επιστροφή στην αρχική σελίδα</Link>
    <button data-sitemap="" class="button button--outline hide-mobile"><svg aria-hidden="true" class="icon" width="16" height="16"><use xLink:href="/public/dist/images/icons/actions.svg#icon-collection-rows-16"></use></svg> Κατηγορίες προϊόντων</button>
    </div>
    
    <div class="top-deals__placeholder">
    <div class="top-deals">
      <div class="top-deals__header root">
        <h3 class="top-deals__title">Σημερινές προσφορές</h3>
        <div class="top-deals__more">
          <Link href="/deals" class="dotted">Όλες οι προσφορές</Link>
        </div>
      </div>
      <div class="scroll scroll--center scroll--no-scrolling">
        <div class="scroll__clip" style="{{overflow: "hidden"}}>
          <div class="scroll__scroller">
            <div class="top-deals__products scroll__content">
              <div class="top-deals__product-wrapper"></div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default NotFound;
