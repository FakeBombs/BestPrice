import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge'; // Keep if you want the badge style
import { Button } from '@/components/ui/button'; // Keep if you want the button style
import { ExternalLink } from 'lucide-react'; // Keep icon
import { toast } from '@/hooks/use-toast';
// Import Vendor type if you want to use real vendor data eventually
import { Vendor, PaymentMethod } from '@/data/mockData';

interface TopVendorAdProps {
  productId: number | string; // Accept number or string
  // Optionally pass a specific vendor if the ad is always for one vendor
  // vendor?: Vendor;
}

export const TopVendorAd: React.FC<TopVendorAdProps> = ({ productId }) => {
  // --- Ad Logic ---
  // In a real app, fetch ad data based on productId or other criteria.
  // For now, mock data and random display logic.
  const showAd = useMemo(() => Math.random() < 0.7, []); // Decide once per render

  // Mock vendor data for the ad (replace with fetched data later)
  const mockAdVendor: Vendor = {
      id: 999,
      name: 'BestTech Store',
      logo: '//placehold.co/90x30?text=BestTech',
      url: 'https://www.example-besttech.com',
      rating: 4.5,
      certification: 'Gold', // Example certification
      paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.PayPal],
      telephone: ['123-456-7890']
  };
  const mockAdPrice = {
      price: 899.99,
      shippingCost: 0,
      inStock: true,
      productUrl: `https://www.example-besttech.com/product/${productId}` // Example product URL
  };
  // --- End Mock Data ---

  if (!showAd) {
    return null; // Don't show an ad
  }

  const vendor = mockAdVendor; // Use the mock vendor for rendering
  const priceInfo = mockAdPrice; // Use mock price info

  const handleAdClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default if it's inside another link, though usually the outer <a> handles it
    // e.preventDefault();
    // Track click
    toast({
      title: "Sponsored Link",
      description: `Navigating to ${vendor.name}`
    });
    // Allow navigation via the href
  };

  // Simplified vendor address logic for the example
  const vendorAddress = Array.isArray(vendor?.address) && vendor.address.length > 0 ? vendor.address[0] : '';

  return (
    // Use the same outer structure as VendorPriceCard, add specific class for styling/identification
    <div className="prices__card is-sponsored"> {/* Add 'is-sponsored' class */}
        <div className="prices__group" data-id={vendor.id} data-price={Math.round(priceInfo.price * 100)} data-mid={vendor.id} data-domain={vendor.url} data-mrating={vendor.rating?.toFixed(4) || '0'}>
          <div className="prices__root">
            <div className="prices__merchant">
              <div className="prices__merchant-meta">
                {/* Link to vendor's product page (or main site if no specific productUrl) */}
                <a
                  aria-label={vendor.name}
                  className="prices__merchant-logo"
                  rel="nofollow sponsored noopener" // Add sponsored
                  target="_blank"
                  href={priceInfo.productUrl || vendor.url}
                  onClick={handleAdClick} // Track click
                >
                  <img width="90" height="30" loading="lazy" src={vendor.logo} alt={vendor.name} title={vendor.name} />
                </a>
                {/* Link to vendor's page on your site */}
                <Link
                    data-tooltip={`Sponsored Ad: Πληροφορίες για ${vendor.name}`}
                    className="prices__merchant-link popup-anchor" // Keep popup anchor class if needed, but might not open popup for ad
                    data-mid={vendor.id}
                    to={`/m/${vendor.id}/${vendor.slug || vendor.name.toLowerCase().replace(/\s+/g, '-')}`}
                    // Remove onClick={openPopup} unless you want the info popup for ads too
                >
                  <em>{vendor.name}</em>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 ml-1">
                     Sponsored
                   </Badge>
                </Link>
                <div className="prices__merchant-props">
                  {/* Rating and Certification can still be shown */}
                  {vendor.rating && (
                    <Link className="merchant__rating" aria-label="Αξιολογήσεις καταστήματος" to={`/m/${vendor.id}/${vendor.slug || vendor.name.toLowerCase().replace(/\s+/g, '-')}/reviews`}>
                      <span className="rating rating-all" data-total={vendor.rating.toFixed(1)}>
                          <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                      </span>
                    </Link>
                  )}
                  {vendor.certification && (
                     <span className="merchant__certification-inline" data-tooltip={vendor.certification}>
                       <svg aria-hidden="true" className="icon"><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg>
                     </span>
                  )}
                </div>
              </div>
            </div>

          <div className="prices__products">
            <div className="prices__product" data-in-stock={priceInfo.inStock ? '' : undefined}>
              <div className="prices__main">
                 {/* Ad specifics can go here */}
                 <div className="prices__title">
                     {/* Link title to product page */}
                     <a data-price={Math.round(priceInfo.price * 100)} title={`Sponsored Offer for Product ID ${productId}`} rel="nofollow sponsored noopener" target="_blank" href={priceInfo.productUrl || vendor.url} onClick={handleAdClick}>
                        {/* You might display the product title here if available, or ad-specific text */}
                        <h3>{product?.title || 'Sponsored Offer'}</h3>
                        <span className="text-sm text-muted-foreground">Sponsored offer with free shipping!</span> {/* Example ad text */}
                     </a>
                 </div>
                 <div className="prices__props">
                  {/* Ad doesn't usually show stock status like regular results */}
                  {/* <span data-status={priceInfo.inStock ? "IN_STOCK" : "OUT_OF_STOCK"} ...></span> */}
                 </div>
              </div>

              <div className="prices__price">
                <div className="prices__price-wrapper">
                   {/* Link price to product page */}
                  <a title={`Sponsored Offer from ${vendor.name}`} rel="nofollow sponsored noopener" target="_blank" href={priceInfo.productUrl || vendor.url} onClick={handleAdClick}>
                     {priceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                  </a>
                  {/* Discount/drop logic could apply if ad data includes it */}
                </div>
                <div className="prices__costs">
                  <div className="prices__cost-label">Μεταφορικά</div>
                  <div className="prices__cost-value">{priceInfo.shippingCost === 0 ? 'Δωρεάν' : priceInfo.shippingCost ? `+ ${priceInfo.shippingCost.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}` : '-'}</div>
                  <div className="prices__cost-total">Τελική τιμή: <strong>{(priceInfo.price + (priceInfo.shippingCost || 0)).toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</strong></div>
                </div>
              </div>

              <div className="prices__buttons">
                <div className="prices__button">
                  {/* Main Call To Action Button */}
                   <a title={`View Offer at ${vendor.name}`} rel="nofollow sponsored noopener" target="_blank" href={priceInfo.productUrl || vendor.url} className="button button--primary" onClick={handleAdClick}>
                    <span>View Offer</span>
                    <ExternalLink className="ml-1 h-3 w-3 inline-block" /> {/* Lucide icon */}
                  </a>
                </div>
              </div>

              </div>
            </div>
          </div>

          {/* Footer section - Less likely needed for a top ad */}
          {/* <div className="prices__footer"> ... </div> */}
        </div>
    </div>
  );
}
