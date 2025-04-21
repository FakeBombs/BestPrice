import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vendors } from '@/data/mockData';

const VendorPage = () => {
    const { vendorId, vendorName } = useParams();
    const [vendor, setVendor] = useState(null);
    const displayedVendor = vendorName ? vendors.find((v) => v.name.toLowerCase() === vendorName.toLowerCase()) : null;

    useEffect(() => {
        // Set the vendor based on the displayedVendor found by name
        if (displayedVendor) {
            setVendor(displayedVendor);
        }
    }, [displayedVendor]);

    if (!vendor) {
        return <p>Vendor not found.</p>;
    }

    return (
        <div id="root" class="clr">

<section class="merchant-hero root_wrapper" style="background: #4CAF50; border-bottom: 0;">
  <div class="root">
    <div class="merchant-trail">
      <div id="trail"><nav class="breadcrumb"><ol><li><a href="/" rel="home" data-no-info=""><span>MyShop.com</span></a><span class="trail__breadcrumb-separator">›</span></li><li><a href="/m" data-no-info="" class="trail__last"><span>Stores</span></a><span class="trail__breadcrumb-separator"></span></li></ol></nav></div>      
    </div>
    
    <div class="merchant-logo">
      <img src="//myshopcdn.com/images/store_logo.svg" alt="MyShop logo" title="MyShop">
      <span class="merchant-logo--certification" data-certification="silver">
          <svg aria-hidden="true" class="icon" width="22" height="22"><use xlink:href="/public/dist/images/icons/certification.svg#icon-silver-22"></use></svg>
      </span>
    </div>
  </div>
</section>
<div class="merchant-certified--wrapper merchant-certified--silver root__wrapper">
  <div class="root merchant-certified">
    <svg aria-hidden="true" class="icon" width="22" height="22"><use xlink:href="/public/dist/images/icons/certification.svg#icon-silver-22"></use></svg>    
    <span class="hide-tablet">
      Certified Store (<a href="/certification">Silver</a>)
    </span>
    <span class="hide-mobile">
      MyShop is a certified store (<b data-certification="silver">Silver</b>)
    </span>
  </div>
</div>

<div class="masthead__wrapper root__wrapper">
  <div class="root">
    <div class="masthead">
      <div class="masthead__main">
        <div class="id">
          <div class="id__title">
            <h1 itemprop="name">MyShop</h1>
          </div>
          <div class="masthead__id">
            <div class="masthead__id-section" style="">
              <div>
                <div class="id__rating-wrapper">
                  <a class="id__rating" href="https://www.myshop.com/m/1234/myshop.html#merchant-reviews"><span class="rating rating-all" data-total="4.8"><svg aria-hidden="true" class="icon" style="clip: rect(0, 4.8em, auto, auto)" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg></span></a>
                  <a data-review-src="merchant-page-header" href="/m/1234/myshop/review" class="id__rating-link">Rate it</a>
                </div>
                <ul class="id__meta">
                  <li data-type="joined"><span class="ui-kit__text ui-kit__muted">On MyShop since 01/01/2020</span></li>
                  <li data-type="social">
                    <span class="social-links">
                      <a class="pressable new-icon" data-tooltip="Facebook" data-tooltip-small="true" rel="external nofollow noopener" target="_blank" href="https://facebook.com/myshop"><span hidden="">facebook</span><svg aria-hidden="true" class="icon icon--outline" width="16" height="16"><use xlink:href="/public/dist/images/icons/social.svg#icon-facebook"></use></svg></a>
                      <a class="pressable new-icon" data-tooltip="Instagram" data-tooltip-small="true" rel="external nofollow noopener" target="_blank" href="https://instagram.com/myshop"><span hidden="">instagram</span><svg aria-hidden="true" class="icon icon--outline" width="16" height="16"><use xlink:href="/public/dist/images/icons/social.svg#icon-instagram"></use></svg></a>
                      <a class="pressable new-icon" data-tooltip="LinkedIn" data-tooltip-small="true" rel="external nofollow noopener" target="_blank" href="https://www.linkedin.com/company/myshop"><span hidden="">linkedin</span><svg aria-hidden="true" class="icon icon--outline" width="16" height="16"><use xlink:href="/public/dist/images/icons/social.svg#icon-linkedin"></use></svg></a>
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <ul class="id__meta">
                  <li data-type="url" itemprop="url" content="https://www.myshop.com/"><a class="ui-kit__text" target="blank" href="https://www.myshop.com/" rel="external nofollow noopener"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-world-16"></use></svg>myshop.com</a></li>
                  <li data-type="telephone"><svg aria-hidden="true" class="icon icon--outline" width="14" height="14"><use xlink:href="/public/dist/images/icons/icons.svg#icon-phone-14"></use></svg><span class="ui-kit__text"><a content="1234567890" href="tel:1234567890">123 456 7890</a></span></li>
                  <li data-type="address"><a href="/m/1234/myshop.html#merchant-map"><svg aria-hidden="true" class="icon icon--outline" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-pin-12"></use></svg><span class="ui-kit__text">123 Sample St, Cityname</span></a></li>
                  <li data-type="storesCount"><a href="/m/1234/myshop.html#merchant-map"><small class="ui-kit__small ui-kit__muted">10 more stores</small></a></li>
                </ul>
              </div>
            </div>
            <div class="masthead__id-section">
              <div class="masthead__id-section--item">
                <ul class="id__meta">
                  <li data-type="brands"><h4 class="ui-kit__secondary ui-kit__pb-4">Authorized Reseller</h4>
                    <div>
                      <a href="/b/1/productA.html" title="Product A"><img width="56" height="56" alt="Product A logo" src="//myshopcdn.com/images/productA.svg"></a>
                      <a href="/b/2/productB.html" title="Product B"><img width="56" height="56" alt="Product B logo" src="//myshopcdn.com/images/productB.svg"></a>
                      <span class="foo-link id__more"><div class="id__more--counter">more</div><a href="/b/3/productC.html" title="Product C"><img width="56" height="56" alt="Product C logo" src="//myshopcdn.com/images/productC.svg"></a></span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="root__wrapper root--merchant-main-wrapper">
  <div class="root root--merchant">
    <div class="sections">
      <section id="merchant-shipping-payment">
        <section>
          <h2 class="ui-kit__secondary">Preview Website</h2>
          <div class="merchant__screenshot">
            <div class="ratio__wrapper">
              <div class="ratio"><img class="ratio__content" itemprop="image" alt="MyShop Screenshot" width="600" height="550" src="//myshopcdn.com/images/screenshot.webp" onerror="this.setAttribute('src', '/images/no-image.svg'); this.classList.add('no-image');"></div>
            </div>
          </div>
        </section>
        <section>
          <h2 class="ui-kit__secondary">Store Features</h2>
          <div class="merchant__shipping-options">
            <div>
              <h4 class="ui-kit__text ui-kit__strong ui-kit__mb-3">Payment Methods</h4>
              <ol>
                <li class="supported"><span class="ui-kit__text ">Cash on Delivery</span><span class="check-icon--supported"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-check-16"></use></svg></span></li>
                <li class="supported"><span class="ui-kit__text ">Credit Cards</span><span class="check-icon--supported"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-check-16"></use></svg></span></li>
              </ol>
            </div>
            <div>
              <h4 class="ui-kit__text ui-kit__strong ui-kit__mb-3">Shipping Options</h4>
              <ol>
                <li class="supported"><span class="ui-kit__text ">Express Delivery</span><span class="check-icon--supported"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-check-16"></use></svg></span></li>
                <li class="supported"><span class="ui-kit__text ">In-Store Pickup</span><span class="check-icon--supported"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-check-16"></use></svg></span></li>
              </ol>
            </div>
            <div>
              <h4 class="ui-kit__text ui-kit__strong ui-kit__mb-3">Additional Services</h4>
              <ol>
                <li class="supported"><span class="ui-kit__text ">Free Returns</span><span class="check-icon--supported"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-check-16"></use></svg></span></li>
                <li class="supported"><span class="ui-kit__text ">Gift Cards</span><span class="check-icon--supported"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-check-16"></use></svg></span></li>
              </ol>
            </div>
          </div>
        </section>
      </section>
      <section class="section">
        <header class="section__header">
          <hgroup class="section__hgroup">
            <h2 class="section__title"><a href="/deals/m/1234/1234/myshop.html">Deals from MyShop</a></h2>
          </hgroup>
        </header>
        <div class="scroll">
          <div class="scroll__clip">
            <div class="scroll__scroller">
              <div class="p__products--scroll scroll__content">
                <div class="p p--deal p--top-padding">
                  <div class="p__actions" data-js="">
                    <div class="p__action" role="button" aria-label="All product actions">
                      <svg aria-hidden="true" class="icon" width="100%" height="100%">
                        <use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use>
                      </svg>
                    </div>
                  </div>
                  <a class="p__cover" href="/item/2158477665/productX.html">
                    <img width="250" height="250" alt="Product X" src="//myshopcdn.com/images/productX.webp" onerror="this.src='/images/no-image.svg';">
                  </a>
                  <div class="p__main">
                    <div class="p__meta">
                      <div class="p__category">Category A</div>
                      <h4 class="p__title p__title--lines p__title--lines-3"><a href="/item/2158477665/productX.html">Product X</a></h4>
                    </div>
                    <div class="p__badges">
                      <div class="p__badges-drop">
                        <div class="p__badge p__badge--drop drop drop--20">-20%</div>
                      </div>
                    </div>
                  </div>
                  <div class="p__footer">
                    <div class="p__price-merchants">
                      <a class="p__price" href="/item/2158477665/productX.html">
                        <div class="p__price--current">199.00€</div>
                        <del class="p__price--before">249.00€</del>
                      </a>
                      <div class="p__merchants">5 stores</div>
                    </div>
                  </div>
                </div>

                <!-- Add more products as needed -->
                
              </div>
            </div>
          </div>
          <div>
            <button aria-label="Scroll arrow previous" disabled="" class="scroll__arrow scroll__arrow--previous scroll__arrow--disabled" style="left: 0px;">
              <svg class="icon" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-backwards-16"></use></svg>
            </button>
            <button aria-label="Scroll arrow next" class="scroll__arrow scroll__arrow--next" style="right: -18.4px;">
              <svg class="icon" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-forwards-16"></use></svg>
            </button>
          </div>
        </div>
      </section>

      <section class="section">
        <header class="section__header">
          <hgroup class="section__hgroup">
            <h2 class="section__title">Popular Categories from MyShop</h2>
          </hgroup>
        </header>
        <div class="categories">
          <a title="Electronics" class="categories__category" href="/cat/electronics.html"><img width="200" height="200" class="categories__image" src="//myshopcdn.com/images/electronics.webp" alt="Electronics"><h2 class="categories__title">Electronics</h2><div class="categories__cnt">172 products</div></a>
          <a title="Laptops" class="categories__category" href="/cat/laptops.html"><img width="200" height="200" class="categories__image" src="//myshopcdn.com/images/laptops.webp" alt="Laptops"><h2 class="categories__title">Laptops</h2><div class="categories__cnt">25 products</div></a>
          <a title="Smartphones" class="categories__category" href="/cat/smartphones.html"><img width="200" height="200" class="categories__image" src="//myshopcdn.com/images/smartphones.webp" alt="Smartphones"><h2 class="categories__title">Smartphones</h2><div class="categories__cnt">99 products</div></a>
        </div>
      </section>

      <div id="merchant-reviews">
        <section class="section">
          <header class="section__header">
            <hgroup class="section__hgroup">
              <h2 class="section__title">Reviews of MyShop</h2>
            </hgroup>
          </header>
          <div>
            <div class="rating-summary">
              <div class="average-rating">4.6</div>
              <div class="review-count">123 reviews</div>
            </div>
            <a data-review-src="reviews-overview" href="/m/1234/myshop/review" class="button">Rate it</a>
          </div>
        </section>
      </div>

      <section id="merchant-map" class="section">
        <header class="section__header">
          <hgroup class="section__hgroup">
            <h2 class="section__title">MyShop Locations</h2>
            <p class="section__subtitle">5 service points</p>
          </hgroup>
        </header>
        <div id="merchant-map-placeholder">
          <div class="geo__open-map leaflet-container leaflet-touch leaflet-retina leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom" tabindex="0" style="position: relative;"> 
            <!-- Map content will go here -->
          </div>
        </div>
      </section>
    </div>
  </div>
</div>
    );
};

export default VendorPage;
