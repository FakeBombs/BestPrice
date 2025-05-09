import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

import { Product, ProductPrice, Vendor, PaymentMethod, OpeningHours } from '@/data/productData';
import { vendors } from '@/data/vendorData'; 
import { useTranslation } from '@/hooks/useTranslation'; 

// Helper to clean domain name (needed for title attribute)
const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try { const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`); return parsedUrl.hostname.replace(/^www\./i, ''); }
  catch (e) { return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]; }
};

// --- Vendor Price Card Component ---
interface VendorPriceCardProps {
  priceInfo: ProductPrice;
  product: Product;
  openPopup: (vendor: Vendor, priceInfo: ProductPrice) => void;
}

export const VendorPriceCard = ({ priceInfo, product, openPopup }: VendorPriceCardProps) => { // Use NAMED export
  // Find vendor efficiently using useMemo and precomputed map idea
  const vendor = useMemo(() => vendors.find(v => v.id === priceInfo.vendorId), [priceInfo.vendorId]);
  const vendorAddress = Array.isArray(vendor?.address) && vendor.address.length > 0 ? vendor.address[0] : '';

  if (!vendor) return null; // Don't render if vendor not found

  const displayPrice = priceInfo.discountPrice ?? priceInfo.price;
  const hasDiscount = priceInfo.discountPrice && priceInfo.discountPrice < priceInfo.price;
  const priceDropPercentage = hasDiscount ? Math.round(((priceInfo.price - priceInfo.discountPrice!) / priceInfo.price) * 100) : 0;
  const dropClass = priceDropPercentage >= 40 ? 'drop--40' : priceDropPercentage >= 30 ? 'drop--30' : priceDropPercentage >= 10 ? 'drop--10' : '';

  // Check if vendor offers installments
  const offersInstallments = vendor.paymentMethods?.includes(PaymentMethod.Installments);

  return (
    <Card className={`prices__card ${!priceInfo.inStock ? 'is-unavailable' : ''}`}>
      <CardContent className="p-0"> {/* Adjust padding if needed */}
        <div className="prices__group" data-id={vendor.id} data-price={Math.round(displayPrice * 100)} data-mid={vendor.id} data-domain={vendor.url} data-mrating={vendor.rating?.toFixed(4) || '0'}>
          <div className="prices__root">
            <div className="prices__merchant">
              <div className="prices__merchant-meta">
                <a aria-label={vendor.name} className="prices__merchant-logo" rel="nofollow noopener noreferrer" target="_blank" href={priceInfo.productUrl || vendor.url} >
                  <img width={90} height={30} loading="lazy" src={vendor.logo} alt={vendor.name} title={vendor.name} />
                  {vendor.certification && (
                     <span className="merchant__certification-inline" data-tooltip={vendor.certification}>
                       <svg aria-hidden="true" className="icon"  width={22} height={22}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg>
                     </span>
                  )}
                </a>
                {/* Popup trigger link */}
                <Link data-tooltip={`Πληροφορίες για το ${vendor.name}`} className="prices__merchant-link popup-anchor" data-mid={vendor.id} to="#" onClick={(e) => { e.preventDefault(); openPopup(vendor, priceInfo); }}>
                  <svg aria-hidden="true" className="icon" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-info-12"></use></svg>
                  <em>{vendor.name}</em>
                </Link>
                <div className="prices__merchant-props">
                  {vendor.rating && (
                    <Link className="merchant__rating" aria-label="Αξιολογήσεις καταστήματος" to={`/m/${vendor.id}/${vendor.slug || vendor.name.toLowerCase().replace(/\s+/g, '-')}#merchant-reviews`}>
                      <span className="rating rating-all" data-total={vendor.rating.toFixed(1)}>
                          <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

          <div className="prices__products">
            <div className="prices__product" data-in-stock={priceInfo.inStock ? '' : undefined}>
              <div className="prices__main">
                <div className="prices__title">
                  <a data-price={Math.round(displayPrice * 100)} title={product.title} rel="nofollow noopener" target="_blank" href={priceInfo.productUrl || vendor.url}>
                     <h3>{product.title}</h3>
                  </a>
                </div>
                <div className="prices__props">
                  <span data-status={priceInfo.inStock ? "IN_STOCK" : "OUT_OF_STOCK"} className={`av ${priceInfo.inStock ? 'av--instock' : 'av--unavailable'}`}>
                    <small>
                      {priceInfo.inStock ? <span>Άμεσα διαθέσιμο</span> : <span>Εξαντλημένο</span>}
                    </small>
                  </span>
                </div>
              </div>

              <div className="prices__price">
                <div className="prices__price-wrapper">
                  <a title={`${product.title} στο ${vendor.name}`} rel="nofollow noopener" target="_blank" href={priceInfo.productUrl || vendor.url}>
                     {displayPrice.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                  </a>
                 {hasDiscount && ( <del className="p__price--before prices__price--before"> {priceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })} </del> )}
                  {priceDropPercentage > 0 && ( <div className="pi__drop prices__price--drop"> <strong className={dropClass}>-{priceDropPercentage}%</strong> </div> )}
                </div>
                 <div className="prices__costs">
                  <div className="prices__cost-label">Μεταφορικά</div>
                  <div className="prices__cost-value">{priceInfo.shippingCost ? `+ ${priceInfo.shippingCost.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}` : 'Δωρεάν'}</div>
                  {priceInfo.installments && priceInfo.installments.count > 0 && (
                      // ** Use a Fragment to group the installment lines **
                      <>
                        <div className="prices__cost-label">Άτοκες Δόσεις</div>
                        <div className="prices__cost-value">έως {priceInfo.installments.count}</div>
                        
                        {/* Conditionally render monthly amount details */}
                        {priceInfo.installments.monthlyAmount && priceInfo.installments.monthlyAmount > 0 && (
                           <>
                             <div className="prices__cost-label">Μηνιαία Δόση</div>
                             <div className="prices__cost-value">{`(${priceInfo.installments.monthlyAmount.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}/μήνα)`}</div>
                           </>
                        )}
                      </>
                    )}
                  <div className="prices__cost-total">Τελική τιμή</div>
                  <div className="prices__cost-price"><strong>{(displayPrice + (priceInfo.shippingCost || 0)).toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</strong></div>
                </div>
              </div>

              <div className="prices__buttons">
                <div className="prices__button">
                  <a title={`Αγορά ${product.title} από ${vendor.name}`} rel="nofollow noreferrer noopener" target="_blank" href={priceInfo.productUrl || vendor.url} className={`button ${!priceInfo.inStock ? 'button--disabled' : ''}`} disabled={!priceInfo.inStock}>
                    <span>Δες το στο κατάστημα</span><svg aria-hidden="true" className="icon" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-right-12"></use></svg>
                  </a>
                </div>
              </div>

              </div>
            </div>
          </div>

          {/* Footer section */}
          {(vendor.paymentMethods || vendor.certification || vendorAddress) && (
          <div className="prices__footer">
            <div className="prices__footer-items">
              {vendor.certification && ( <Link data-tooltip="Απόκτησε δωρεάν Ασφάλιση Αγοράς" to="/programma-asfaleias-agoron" className="prices__footer-item prices__footer-item--certification popup-anchor"> <svg aria-hidden="true" className="icon" width={17} height={17}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg> <span>Ασφάλιση Αγοράς</span> </Link> )}
              {vendorAddress && ( <Link className="prices__footer-item" data-mid={vendor.id} to="#" onClick={(e) => { e.preventDefault(); openPopup(vendor, priceInfo); }}><div className="dotted-link">{vendorAddress}</div></Link> )}
              {vendor.paymentMethods?.includes(PaymentMethod.Klarna) && ( <div className="prices__footer-item popup-anchor" data-tooltip-left="" data-tooltip-no-border="" data-tooltip="Δυνατότητα πληρωμής με άτοκες δόσεις μέσω της Klarna"><div className="prices__klarna-logo"><img src="/images/logos/Klarna/logo.svg" alt="Klarna logo" width={40} height={20}/></div></div> )}
              {vendor.paymentMethods?.includes(PaymentMethod.PickupVia) && ( <div className="prices__footer-item" data-tooltip-left="" data-tooltip-no-border="" data-tooltip="Δυνατότητα παραλαβής δέματος μέσω των αυτόματων μηχανημάτων (lockers) της Box Now"> <div className="prices__boxnow-logo"> <img src="/images/logos/BoxNow/logo.svg" alt="Box Now logo" width={27} height={20}/> </div> </div> )}
              {/* Add other icons like Epistrofi based on paymentMethods */}
            </div>
          </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
