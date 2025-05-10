import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
// Button might not be needed if using simple <a> for CTA
// import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProductPrice, Vendor } from '@/data/productData';
import { PaymentMethod } from '@/data/vendorData';

interface TopVendorAdProps {
  productId: number | string; // Accept number or string
  // vendor?: Vendor; // Optional: Pass the specific ad vendor if known
}

// Helper to clean domain name (if needed for vendor links)
const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try { const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`); return parsedUrl.hostname.replace(/^www\./i, ''); }
  catch (e) { return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]; }
};


export const TopVendorAd: React.FC<TopVendorAdProps> = ({ productId }) => {
  // --- Ad Logic ---
  const showAd = useMemo(() => Math.random() < 0.9, []); // Decide once per render

  // Mock vendor data for the ad (replace with fetched data later)
  const mockAdVendor: Vendor = {
      id: 999, name: 'BestTech Store', slug: 'besttech-store', logo: '//placehold.co/90x30?text=BestTech', url: 'https://www.example-besttech.com', rating: 4.5, certification: 'Gold', paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.PayPal], telephone: ['123-456-7890']
  };
  // Mock price info for the ad (This would usually be part of the ad data)
   const mockAdPrice: ProductPrice = {
      vendorId: 999, // Matches mockAdVendor
      price: 899.99,
      shippingCost: 0,
      inStock: true,
      productUrl: `https://www.example-besttech.com/product/${productId}?ad_click=true`,
      discountPrice: 849.99
  };
  // --- End Mock Data ---

  if (!showAd) {
    return null;
  }

  const vendor = mockAdVendor;
  const priceInfo = mockAdPrice;

  const handleAdClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    toast({ title: "Sponsored Link", description: `Navigating to ${vendor.name}` });
  };

  const displayPrice = priceInfo.discountPrice ?? priceInfo.price;
  const hasDiscount = priceInfo.discountPrice && priceInfo.discountPrice < priceInfo.price;
  const priceDropPercentage = hasDiscount ? Math.round(((priceInfo.price - priceInfo.discountPrice!) / priceInfo.price) * 100) : 0;
  const dropClass = priceDropPercentage >= 40 ? 'drop--40' : priceDropPercentage >= 30 ? 'drop--30' : priceDropPercentage >= 10 ? 'drop--10' : '';


  return (
    <div id="sponsored" className="prices"> {/* Add 'is-sponsored' class */}
        <div className="prices__group" data-id={vendor.id} data-price={Math.round(displayPrice * 100)} data-mid={vendor.id} data-domain={vendor.url} data-mrating={vendor.rating?.toFixed(4) || '0'}>
          <div className="prices__root">
            <div className="prices__merchant">
              <div className="prices__merchant-meta">
                <a aria-label={vendor.name} className="prices__merchant-logo" rel="nofollow sponsored noopener" target="_blank" href={priceInfo.productUrl || vendor.url} onClick={handleAdClick}>
                  <img width="90" height="30" loading="lazy" src={vendor.logo} alt={vendor.name} title={vendor.name} />
                  {vendor.certification && ( <span className="merchant__certification-inline" data-tooltip={vendor.certification}> <svg aria-hidden="true" className="icon" width={22} height={22}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg> </span> )}
                </a>
                <Link data-tooltip={`Sponsored Ad: Πληροφορίες για ${vendor.name}`} className="prices__merchant-link popup-anchor" data-mid={vendor.id} to={`/m/${vendor.id}/${vendor.slug || vendor.name.toLowerCase().replace(/\s+/g, '-')}`} >
                  <em>{vendor.name}</em>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 ml-1">Sponsored</Badge>
                </Link>
                <div className="prices__merchant-props">
                  {vendor.rating && ( <Link className="merchant__rating" aria-label="Αξιολογήσεις καταστήματος" to={`/m/${vendor.id}/${vendor.slug || vendor.name.toLowerCase().replace(/\s+/g, '-')}/reviews`}> <span className="rating rating-all" data-total={vendor.rating.toFixed(1)}> <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg> </span> </Link> )}
                </div>
              </div>
            </div>

          <div className="prices__products">
            {/* Simplified product section for Ad */}
            <div className="prices__product" data-in-stock={priceInfo.inStock ? '' : undefined}>
              <div className="prices__main">
                 {/* Display Ad-specific text or offer details */}
                 <div className="prices__title">
                     <a data-price={Math.round(displayPrice * 100)} title={`Sponsored Offer for Product ID ${productId}`} rel="nofollow sponsored noopener" target="_blank" href={priceInfo.productUrl || vendor.url} onClick={handleAdClick}>
                        {/* Use specific Ad Text */}
                        <span>Προσφορά για το προϊόν από {vendor.name}!</span>
                     </a>
                 </div>
                 <div className="prices__props">
                   {/* Generally hide stock status for ads unless explicitly provided */}
                 </div>
              </div>

              <div className="prices__price">
                <div className="prices__price-wrapper">
                  <a title={`Sponsored Offer from ${vendor.name}`} rel="nofollow sponsored noopener" target="_blank" href={priceInfo.productUrl || vendor.url} onClick={handleAdClick}>
                     {displayPrice.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                  </a>
                 {hasDiscount && (
                      <del className="p__price--before prices__price--before">
                          {priceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                      </del>
                  )}
                  {priceDropPercentage > 0 && (
                      <div className="pi__drop prices__price--drop"> {/* Corrected class */}
                          <strong className={dropClass}>-{priceDropPercentage}%</strong>
                      </div>
                  )}
                </div>
                <div className="prices__costs">
                  <div className="prices__cost-label">Μεταφορικά</div>
                  <div className="prices__cost-value">{priceInfo.shippingCost === 0 ? 'Δωρεάν' : priceInfo.shippingCost ? `+ ${priceInfo.shippingCost.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}` : '-'}</div>
                  <div className="prices__cost-total">Τελική τιμή: <strong>{(displayPrice + (priceInfo.shippingCost || 0)).toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</strong></div>
                </div>
              </div>

              <div className="prices__buttons">
                <div className="prices__button">
                   <a title={`View Offer at ${vendor.name}`} rel="nofollow sponsored noopener" target="_blank" href={priceInfo.productUrl || vendor.url} className="button button--primary" onClick={handleAdClick}>
                    <span>View Offer</span>
                    <ExternalLink className="ml-1 h-3 w-3 inline-block" />
                  </a>
                </div>
              </div>

              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
