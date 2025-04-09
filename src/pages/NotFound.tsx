
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div>
      
    <div className="root__wrapper" id="root-404">
      <div className="root">
      <h1 className="heading">Η σελίδα που ψάχνεις δεν είναι πλέον διαθέσιμη...</h1>
      <p>Αλλά μην ανησυχείς, είσαι στο πιο κατάλληλο μέρος για γρήγορη, ασφαλή και εύχρηστη έρευνα αγοράς!</p>
      </div>
    </div>
    
    <div className="actions__404">
    <Link to="/" className="button button--outline">Επιστροφή στην αρχική σελίδα</Link>
    <button data-sitemap="" className="button button--outline hide-mobile"><svg aria-hidden="true" className="icon" width="16" height="16"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" d="M2 3H14V6H2V3ZM2 11H14V14H2V11ZM14 7H2V10H14V7Z"/></svg> Κατηγορίες προϊόντων</button>
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
              <div className="top-deals__product-wrapper"><a href="/item/2160473294/samsung-galaxy-a56-8gb-256gb.html?bpref=top-deals" class="top-deals__product pressable"><div class="top-deals__drop"><svg class="drop drop--30" width="84" height="85" viewBox="0 0 84 85"><path fill-rule="evenodd" d="M0 0h84v85z"></path></svg><span class="drop drop--30">-36%</span></div><div class="ratio__wrapper top-deals__img"><div class="ratio"><img width="200" height="200" alt="Samsung Galaxy A56 8GB 256GB" class="ratio__content" loading="lazy" srcset="//bbpcdn.pstatic.gr/bpimg14/2md7Ns/1TUbSO_SX400Y400/1742223362/image.webp" src="//bbpcdn.pstatic.gr/bpimg14/2md7Ns/1TUbSO_SX200Y200/1742223362/image.webp"/></div></div><h4 class="top-deals__product-title">Samsung Galaxy A56 8GB 256GB</h4><div class="top-deals__price"><div class="top-deals__price-before">545,31€</div><strong>349,00€</strong></div></a></div>
              <div class="top-deals__product-wrapper"><a href="/item/2159726615/huawei-matepad-115s-256gb-with-smart-magnetic-keyboard.html?bpref=top-deals" class="top-deals__product pressable"><div class="top-deals__drop"><svg class="drop drop--20" width="84" height="85" viewBox="0 0 84 85"><path fill-rule="evenodd" d="M0 0h84v85z"></path></svg><span class="drop drop--20">-29%</span></div><div class="ratio__wrapper top-deals__img"><div class="ratio"><img width="200" height="200" alt="Huawei MatePad 11.5&quot;S 256GB with Smart Magnetic Keyboard" class="ratio__content" loading="lazy" srcset="//bbpcdn.pstatic.gr/bpimg3/aLfxx/1SYzV1_SX400Y400/1728492731/image.webp" src="//bbpcdn.pstatic.gr/bpimg3/aLfxx/1SYzV1_SX200Y200/1728492731/image.webp"/></div></div><h4 class="top-deals__product-title">Huawei MatePad 11.5"S 256GB with Smart Magnetic Keyboard</h4><div class="top-deals__price"><div class="top-deals__price-before">492,80€</div><strong>349,89€</strong></div></a></div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    </div>
      
    </div>
  );
};

export default NotFound;
