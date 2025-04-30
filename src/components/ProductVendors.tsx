import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, ExternalLink } from 'lucide-react';
import { Product, ProductPrice, getVendorById } from '@/data/mockData';
import TopVendorAd from './ads/TopVendorAd';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductVendorsProps {
  product: Product;
}

const ProductVendors = ({ product }: ProductVendorsProps) => {
  const { t } = useTranslation();
  // Sort prices from lowest to highest
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);

  // State to control popup visibility
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Function to open the popup
  const openPopup = () => {
    setIsPopupVisible(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="mt-6">
      <header class="section__header">
        <hgroup class="section__hgroup">
          <h2 class="section__title">
            Καταστήματα <small><span>({product.prices.length})</span></small>
            <div class="price-filters__clear undefined dotted-link">{t('clearFilters')}</div>
          </h2>
        </hgroup>
        <div class="section__side">
          <label data-type="priceFull" data-always-available="" class="price-filters__filter">
            <input type="checkbox"/>
            <svg aria-hidden="true" class="icon" width="12" height="12"><use href="/dist/images/icons/cluster.svg#icon-calc-12"></use></svg>
            <span class="price-filters__label">{t('finalPrice')}</span>
          </label>
        </div>
      </header>

      <div className="filter-wrapper">
        <div className="scroll">
          <div className="scroll__clip">
            <div className="scroll__scroller">
              <div data-count="7" className="price-filters scroll__content">
                <label data-type="in-stock" className="price-filters__filter"><input type="checkbox"/><span className="price-filters__label">Διαθέσιμα</span></label>
                <label data-type="nearby" data-always-available="" className="price-filters__filter"><input type="checkbox"/><svg aria-hidden="true" class="icon" width="12" height="12"><use href="/dist/images/icons/cluster.svg#icon-pin-12"></use></svg><span className="price-filters__label">Κοντά μου</span></label>
                <label data-type="certified" data-tooltip="Εμφάνιση μόνο προϊόντων που παρέχονται από πιστοποιημένα καταστήματα" className="price-filters__filter"><input type="checkbox"/><svg aria-hidden="true" class="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-certified-outline-12"></use></svg><span className="price-filters__label">Πιστοποιημένα</span></label>
                <label data-type="boxnow" className="price-filters__filter"><input type="checkbox"/><span className="price-filters__label">Παράδοση με <svg aria-hidden="true" class="icon" width="100%" height="100%"><use href="/dist/images/icons/partners.svg#icon-boxnow"></use></svg></span></label>
                <label data-type="coupons" className="price-filters__filter"><input type="checkbox"/><svg aria-hidden="true" class="icon" width="20" height="20"><use href="/dist/images/icons/icons.svg#icon-coupon-20"></use></svg><span className="price-filters__label">Κουπόνια</span></label>
                <label data-type="color" data-options="[&quot;pink&quot;,&quot;grey&quot;,&quot;graphite&quot;,&quot;black&quot;,&quot;green&quot;]" className="price-filters__filter is-inline"><input type="checkbox"/><span className="price-filters__label">Χρώμα</span></label>
                <label data-type="authorized" className="price-filters__filter"><input type="checkbox"/><span className="price-filters__label">Επίσημοι μεταπωλητές</span></label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Insert the sponsored ad at the top */}
      <TopVendorAd productId={product.id} />
      
      <div className="prices" data-merchants={product.prices.length}>
        {sortedPrices.map((priceInfo) => (
          <VendorPriceCard key={priceInfo.vendorId} priceInfo={priceInfo} product={product} />
        ))}
      </div>
    </div>
  );
};

interface VendorPriceCardProps {
  priceInfo: ProductPrice;
  product: Product;
}

const VendorPriceCard = ({ priceInfo, product }: VendorPriceCardProps) => {
  const vendor = getVendorById(priceInfo.vendorId);
  const vendorAddress = Array.isArray(vendor.address) && vendor.address.length > 0 ? vendor.address[0] : '';
  
  if (!vendor) return null;
  
  const totalPrice = priceInfo.price + priceInfo.shippingCost;
  
  return (
    <Card className={!priceInfo.inStock ? 'opacity-70' : ''}>
      <CardContent className="p-4">
        <div className="prices__group" data-id="1" data-price="34650" data-hash="8c716c298df6afe61ed05f25374c5d48" data-is-open="" data-mid="11217" data-ts="1744146001" data-domain={vendor.url} data-mrating="4.6029">
          <div className="prices__root">
            <div className="prices__merchant">
              <div className="prices__merchant-meta">
                <a aria-label={vendor.name} className="prices__merchant-logo" rel="nofollow" href="/to/181077790/samsung-galaxy-a56-5g-dual-sim-awesome-pink.html?from=2160473294&amp;seq=1">
                  <img width="90" height="30" loading="lazy" src={vendor.logo} alt={vendor.name} title={vendor.name} />
                </a>
                <Link data-tooltip={`Πληροφορίες για το ${vendor.name}`} className="prices__merchant-link popup-anchor" data-mid={vendor.id} to={`/m/${vendor.id}/${vendor.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <svg aria-hidden="true" class="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-info-12"></use></svg>
                  <em>{vendor.name}</em>
                </Link>
                <div className="prices__merchant-props">
                  <Link className="merchant__rating" aria-label="Merchant reviews" to={`/m/${vendor.id}/${vendor.name.toLowerCase().replace(/\s+/g, '-')}/reviews`}>
                    <span className="rating rating-all" data-total="150">
                      <svg aria-hidden="true" class="icon" style={{ clipPath: 'rect(0, 4.7em, auto, auto)' }} width="100%" height="100%"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                      <svg aria-hidden="true" class="icon" width="100%" height="100%"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          
          <div className="prices__products">
            <div id="p-180878146" className="prices__product" data-is-variation="" data-is-variation-first-visible="yes" data-index="1" data-price="54990" data-mid={vendor.id} data-payment-costs="{&quot;bank&quot;:0,&quot;ondelivery&quot;:0,&quot;cc&quot;:0,&quot;paypal&quot;:0}" data-shipping-cost="0" data-certified="" data-free-return="" data-distance="65.304230506616" data-in-stock="" data-free-shipping="" data-product-id="180878146" data-mobile-friendly="" data-authorized="" data-boxnow="" data-av="0" data-color="pink">
              <div className="prices__main">
                <div className="prices__title">
                  <a data-price="54990" title={product.title} rel="nofollow noopener" href="/to/180878146/samsung-galaxy-a56-5g-8256gb-awesome-pink.html?from=2160473294&amp;seq=131&amp;bpref=itemPage&amp;vid=gxQGGCNEJhq">
                    <h3>{product.title}</h3>
                  </a>
                </div>
                <div className="prices__props">
                  <span data-status="IN_STOCK" className="av">
                    <small>
                      {priceInfo.inStock
                        ? <span>Άμεσα διαθέσιμο</span>
                        : <span>Out of stock</span>
                      }
                    </small>
                  </span>
                </div>
                <div role="button" aria-label="All variations from store" data-id="45" className="prices__group-variations-button prices__group-variations-button--inside">
                  <span className="prices__group-variations-label">4  παραλλαγές</span>
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M1 13L9 5L17 13" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="product-report__trigger-wrapper">
                  <div class="product-report__trigger pressable">
                    <div class="product-report__trigger-prompt">
                      <div class="product-report__trigger-prompt-label">Αντιμετώπισες πρόβλημα με το προϊόν;</div>
                      <svg class="icon" aria-hidden="true" width="8" height="8" viewBox="0 0 8 8" role="img"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" d="M2 7L5 4L2 1L3 0L7 4L3 8L2 7Z"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prices__price">
                <div className="prices__price-wrapper">
                  <a title={product.title} rel="nofollow" href="/to/180878146/samsung-galaxy-a56-5g-8256gb-awesome-pink.html?from=2160473294&amp;seq=131&amp;bpref=itemPage&amp;vid=gxQGGCNEJhq">${priceInfo.price.toFixed(2)}</a>
                </div>
                <div className="prices__costs">
                  <div className="prices__cost-label">Μεταφορικά</div>
                  <div className="prices__cost-value">{priceInfo.shippingCost > 0 ? `+ $${priceInfo.shippingCost.toFixed(2)}` : 'Δωρεάν'}</div>
                </div>
              </div>

              <div className="prices__buttons">
                <div className="prices__button">
                  <a title={product.title} rel="nofollow" href="/to/180878146/samsung-galaxy-a56-5g-8256gb-awesome-pink.html?from=2160473294&amp;seq=131&amp;bpref=itemPage&amp;vid=gxQGGCNEJhq" className="button" disabled={!priceInfo.inStock}>
                    <span>Δες το στο κατάστημα</span><svg aria-hidden="true" class="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-right-12"></use></svg>
                  </a>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">Rating: {vendor.rating.toFixed(1)}/5.0</div>
              </div>
            </div>
          </div>

          <div className="prices__footer">
            <div className="prices__footer-items">
              <div data-tooltip="Με την αγορά κερδίζεις 0,5 BestPrice Credit" data-tooltip-no-border="" data-is_certified="false" className="prices__footer-item prices__footer-item--loyalty loyalty-actions popup-anchor" data-listener-added="true">
                <span>0,5</span>
                <svg aria-hidden="true" class="icon" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-white-credits-16"></use></svg>
              </div>
              {vendor.certification && (
              <Link data-tooltip="Απόκτησε δωρεάν Ασφάλιση Αγοράς" href="/programma-asfaleias-agoron?bpref=cluster-footer" class="prices__footer-item prices__footer-item--certification popup-anchor">
                <svg aria-hidden="true" className="icon" width="17" height="17"><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg>
                <span>Ασφάλιση Αγοράς</span>
              </Link>
              )}
              <Link className="prices__footer-item" data-mid="11217" to={`/m/${vendor.id}/${vendor.name.toLowerCase().replace(/\s+/g, '-')}`} onClick={openPopup}><div className="dotted-link">{vendorAddress}</div></Link>
              <div class="prices__footer-item prices__footer-item--authorized"><svg aria-hidden="true" class="icon" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-authorized-18"></use></svg>Επίσημος μεταπωλητής</div>
              <div class="prices__footer-item popup-anchor" data-tooltip-left="" data-tooltip-no-border="" data-tooltip="Δυνατότητα πληρωμής με άτοκες δόσεις μέσω της Klarna"><div class="prices__klarna-logo"><img src="https://www.bestprice.gr/images/logos/Klarna/logo.svg" alt="Klarna logo" width="40" height="20"/></div></div>
              <div class="prices__footer-item" data-tooltip-left="" data-tooltip-no-border="" data-tooltip="Δυνατότητα παραλαβής δέματος μέσω των αυτόματων μηχανημάτων (lockers) της BOX NOW">
                <div class="prices__boxnow-logo">
                  <img src="https://www.bestprice.gr/images/logos/BoxNow/logo.svg" alt="BOX NOW logo" width="27" height="20"/>
                </div>
              </div>
              <a class="prices__footer-item" data-tooltip-left="" href="/blog/928/eurobank-epistrofi" target="_blank" data-tooltip-no-border="" data-tooltip="Το κατάστημα συμμετέχει στο πρόγραμμα επιβράβευσης €πιστροφή της Eurobank" data-adman="69482">
                <div class="prices__epistrofi-logo"><img src="https://www.bestprice.gr/images/logos/Epistrofi/logo.svg" alt="Επιτροοφή logo" width="94" height="20"/></div>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2>Popup Title</h2>
            <p>This is your popup content!</p>
          </div>
        </div>
      )}
    
  );
};

export default ProductVendors;
