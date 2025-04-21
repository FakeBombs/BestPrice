import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { vendors } from '@/data/mockData';
import PaymentMethodsComponent from '@/components/PaymentMethods';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

interface VendorPageProps { }

const VendorPage: React.FC<VendorPageProps> = () => {
    useEffect(() => {
        document.title = `● ${selectedVendor.name} | BestPrice`;
        document.description = `Πληροφορίες, αξιολογήσεις χρηστών, διεύθυνση, τηλέφωνα επικοινωνίας και ωράριο λειτουργίας. Δες τα προϊόντα και τις προσφορές του ${selectedVendor.name}`;
    }, [selectedVendor]);
    const userAgent = navigator.userAgent.toLowerCase();
    const [jsEnabled, setJsEnabled] = useState(false);
    let classNamesForBody = '';
    let classNamesForHtml = '';

    // Check for ad blockers
    const checkAdBlockers = () => {
        const adElementsToCheck = ['.adsbox', '.ad-banner', '.video-ad'];
        return adElementsToCheck.some(selector => {
            const adElement = document.createElement('div');
            adElement.className = selector.slice(1);
            document.body.appendChild(adElement);
            const isBlocked = adElement.offsetHeight === 0 || getComputedStyle(adElement).display === 'none';
            document.body.removeChild(adElement);
            return isBlocked;
        });
    };

    const isAdBlocked = checkAdBlockers();

    // Determine device type
    if (userAgent.includes('windows')) {
        classNamesForHtml = 'windows no-touch not-touch supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
    } else if (userAgent.includes('mobile')) {
        classNamesForHtml = 'is-mobile';
        classNamesForBody = 'mobile';
    } else if (userAgent.includes('tablet')) {
        classNamesForHtml = 'is-tablet';
        classNamesForBody = 'tablet';
    } else {
        classNamesForHtml = 'unknown-device';
    }

    // Handle ad blockers
    classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';

    // Set JavaScript enabled state
    useEffect(() => {
        const handleLoad = () => {
            setJsEnabled(true);
        };

        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
    }, []);

    // Add JS enabled/disabled class
    classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';

    // Set attributes
    const newIdForBody = ''; // Keeping body ID empty
    const newIdForHtml = 'page-merchant';

    useHtmlAttributes(classNamesForHtml, newIdForHtml);
    useBodyAttributes(classNamesForBody, newIdForBody);
    
    const { vendorId, vendorName } = useParams();
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [additionalLocations, setAdditionalLocations] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state

    const displayedVendor = vendorName ? 
    vendors.find(v => v.name.toLowerCase().replace(/\s+/g, '-') === vendorName) : null;

    useEffect(() => {
    if (selectedVendor && selectedVendor.location) {
        const count = selectedVendor.location.length > 1 ? selectedVendor.location.length - 1 : 0;
        setAdditionalLocations(count);
    }
    }, [selectedVendor]);

    useEffect(() => {
        if (displayedVendor) {
            setSelectedVendor(displayedVendor);
        }
    }, [displayedVendor]);

    useEffect(() => {
        setLoading(true); // Start loading when vendorName changes

        const foundVendor = vendors.find(v =>
            v.name.toLowerCase().replace(/\s+/g, '-') === vendorName
        );
        
        // Delay the setting of selectedVendor to simulate data fetching
        setSelectedVendor(foundVendor);
        setLoading(false); // End loading state
    }, [vendorName]);

    // While loading, return null or a spinner, you can implement loading feedback here
    if (loading) {
        return null; // Or some loading indicator
    }

    // Vendor is not found, show NotFound component
    if (!selectedVendor) {
        return <NotFound />;
    }

    return (
        <div id="root" className="clr">
            <section className="merchant-hero root_wrapper" style={{ background: 'var(--colors-themed-card-bg)', borderBottom: 0 }}>
                <div className="root">
                    <div className="merchant-trail">
                        <div id="trail">
                            <nav className="breadcrumb">
                                <ol>
                                    <li><Link to="/" rel="home" data-no-info=""><span>BestPrice</span></Link><span className="trail__breadcrumb-separator">›</span></li>
                                    <li><Link to="/m" data-no-info="" className="trail__last"><span>Καταστήματα</span></Link></li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="merchant-logo">
                        <img src={selectedVendor.logo} alt={`${selectedVendor.name} logo`} title={selectedVendor.name} />
                        <span className="merchant-logo--certification" data-certification="silver">
                            <svg aria-hidden="true" className="icon" width="22" height="22">
                                <use xlinkHref="/public/dist/images/icons/certification.svg#icon-silver-22"></use>
                            </svg>
                        </span>
                    </div>
                </div>
            </section>

            <div className="merchant-certified--wrapper merchant-certified--silver root__wrapper">
                <div className="root merchant-certified">
                    <svg aria-hidden="true" className="icon" width="22" height="22">
                        <use xlinkHref="/public/dist/images/icons/certification.svg#icon-silver-22"></use>
                    </svg>
                    <span className="hide-tablet">
                        Certified Store (<Link to="/certification">Silver</Link>)
                    </span>
                    <span className="hide-mobile">
                        {selectedVendor.name} is a certified store (<b data-certification="silver">Silver</b>)
                    </span>
                </div>
            </div>

            <div className="masthead__wrapper root__wrapper">
                <div className="root">
                    <div className="masthead">
                        <div className="masthead__main">
                            <div className="id">
                                <div className="id__title">
                                    <h1 itemProp="name">{selectedVendor.name}</h1>
                                </div>
                                <div className="masthead__id">
                                    <div className="masthead__id-section">
                                        <div>
                                            <div className="id__rating-wrapper">
                                                <a className="id__rating" href="https://www.myshop.com/m/1234/myshop.html#merchant-reviews">
                                                    <span className="rating rating-all" data-total="4.8">
                                                        <svg aria-hidden="true" className="icon" style={{ clip: 'rect(0, 4.8em, auto, auto)' }} width="100%" height="100%">
                                                            <use xlinkHref="/public/dist/images/icons/stars.svg#icon-stars-all"></use>
                                                        </svg>
                                                    </span>
                                                </a>
                                                <a data-review-src="merchant-page-header" href="/m/1234/myshop/review" className="id__rating-link">Rate it</a>
                                            </div>
                                            <ul className="id__meta">
                                                <li data-type="joined">
                                                    <span className="ui-kit__text ui-kit__muted">On {selectedVendor.name} since 01/01/2020</span>
                                                </li>
                                                <li data-type="social" style={{ display: 'flex' }}>
                                                    <span className="social-links">
                                                        <a className="pressable new-icon" data-tooltip="Facebook" rel="external nofollow noopener" target="_blank" href="https://facebook.com/myshop">
                                                            <svg aria-hidden="true" className="icon icon--outline" width="16" height="16">
                                                                <use xlinkHref="/public/dist/images/icons/social.svg#icon-facebook"></use>
                                                            </svg>
                                                        </a>
                                                        <a className="pressable new-icon" data-tooltip="Instagram" rel="external nofollow noopener" target="_blank" href="https://instagram.com/myshop">
                                                            <svg aria-hidden="true" className="icon icon--outline" width="16" height="16">
                                                                <use xlinkHref="/public/dist/images/icons/social.svg#icon-instagram"></use>
                                                            </svg>
                                                        </a>
                                                        <a className="pressable new-icon" data-tooltip="LinkedIn" rel="external nofollow noopener" target="_blank" href="https://www.linkedin.com/company/myshop">
                                                            <svg aria-hidden="true" className="icon icon--outline" width="16" height="16">
                                                                <use xlinkHref="/public/dist/images/icons/social.svg#icon-linkedin"></use>
                                                            </svg>
                                                        </a>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <ul className="id__meta">
                                                <li data-type="url" itemProp="url" content={selectedVendor.url}>
                                                    <a className="ui-kit__text" target="_blank" href={selectedVendor.url} rel="external nofollow noopener">
                                                        <svg aria-hidden="true" className="icon" width="16" height="16">
                                                            <use xlinkHref="/public/dist/images/icons/icons.svg#icon-world-16"></use>
                                                        </svg>
                                                        {selectedVendor.url}
                                                    </a>
                                                </li>
                                                <li data-type="telephone">
                                                    <svg aria-hidden="true" className="icon icon--outline" width="14" height="14">
                                                        <use xlinkHref="/public/dist/images/icons/icons.svg#icon-phone-14"></use>
                                                    </svg>
                                                    <span className="ui-kit__text">
                                                        <a href={`tel:${selectedVendor.telephone.join(',')}`}>{selectedVendor.telephone.join(', ')}</a>
                                                    </span>
                                                </li>
                                                <li data-type="address">
                                                    <a href="/m/1234/myshop.html#merchant-map">
                                                        <svg aria-hidden="true" className="icon icon--outline" width="16" height="16">
                                                            <use xlinkHref="/public/dist/images/icons/icons.svg#icon-pin-12"></use>
                                                        </svg>
                                                        <span className="ui-kit__text">{selectedVendor.location && selectedVendor.location.length > 0 ? selectedVendor.location.slice(0, 1).join(', ') : 'No locations available'}</span>
                                                    </a>
                                                </li>
                                                <li data-type="storesCount">
                                                    <a href="/m/1234/myshop.html#merchant-map">
                                                        <small className="ui-kit__small ui-kit__muted">{additionalLocations > 0 ? `${additionalLocations} more stores` : 'No more stores'}</small>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="masthead__id-section">
                                        <ul className="id__meta">
                                            <li data-type="brands">
                                                <h4 className="ui-kit__secondary ui-kit__pb-4">Authorized Reseller</h4>
                                                <div>
                                                    <a href="/b/1/productA.html" title="Product A"><img width="56" height="56" alt="Product A logo" src="//myshopcdn.com/images/productA.svg" /></a>
                                                    <a href="/b/2/productB.html" title="Product B"><img width="56" height="56" alt="Product B logo" src="//myshopcdn.com/images/productB.svg" /></a>
                                                    <span className="foo-link id__more">
                                                        <div className="id__more--counter">more</div>
                                                        <a href="/b/3/productC.html" title="Product C"><img width="56" height="56" alt="Product C logo" src="//myshopcdn.com/images/productC.svg" /></a>
                                                    </span>
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

            <div className="root__wrapper root--merchant-main-wrapper">
                <div className="root root--merchant">
                    <div className="sections">
                        {/* Shipping Payment Section */}
                        <section id="merchant-shipping-payment">
                            <section>
                                <h2 className="ui-kit__secondary">Preview Website</h2>
                                <div className="merchant__screenshot">
                                    <div className="ratio__wrapper">
                                        <div className="ratio">
                                            <img className="ratio__content" itemProp="image" alt="MyShop Screenshot" width="600" height="550" src="//myshopcdn.com/images/screenshot.webp" onError={(e) => { e.currentTarget.src = '/images/no-image.svg'; e.currentTarget.classList.add('no-image'); }} />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <PaymentMethodsComponent paymentMethods={selectedVendor.paymentMethods} />
                        </section>

                        {/* Deals Section */}
                        <section className="section">
                            <header className="section__header">
                                <hgroup className="section__hgroup">
                                    <h2 className="section__title"><a href="/deals/m/1234/1234/myshop.html">Deals from {selectedVendor.name}</a></h2>
                                </hgroup>
                            </header>
                            <div className="scroll">
                                <div className="scroll__clip">
                                    <div className="scroll__scroller">
                                        <div className="p__products--scroll scroll__content">
                                            {/* Example product, populate dynamically */}
                                            <div className="p p--deal p--top-padding">
                                                <div className="p__actions" data-js="">
                                                    <div className="p__action" role="button" aria-label="All product actions">
                                                        <svg aria-hidden="true" className="icon" width="100%" height="100%">
                                                            <use xlinkHref="/public/dist/images/icons/actions.svg#icon-more-vertical"></use>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <a className="p__cover" href="/item/2158477665/productX.html">
                                                    <img width="250" height="250" alt="Product X" src="//myshopcdn.com/images/productX.webp" onError={(e) => { e.currentTarget.src = '/images/no-image.svg'; }} />
                                                </a>
                                                <div className="p__main">
                                                    <div className="p__meta">
                                                        <div className="p__category">Category A</div>
                                                        <h4 className="p__title p__title--lines p__title--lines-3"><a href="/item/2158477665/productX.html">Product X</a></h4>
                                                    </div>
                                                    <div className="p__badges">
                                                        <div className="p__badges-drop">
                                                            <div className="p__badge p__badge--drop drop drop--20">-20%</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p__footer">
                                                    <div className="p__price-merchants">
                                                        <a className="p__price" href="/item/2158477665/productX.html">
                                                            <div className="p__price--current">199.00€</div>
                                                            <del className="p__price--before">249.00€</del>
                                                        </a>
                                                        <div className="p__merchants">5 stores</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Add more products as needed */}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button aria-label="Scroll arrow previous" disabled="" className="scroll__arrow scroll__arrow--previous scroll__arrow--disabled" style={{ left: 0 }}>
                                        <svg className="icon" aria-hidden="true" width="16" height="16"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-backwards-16"></use></svg>
                                    </button>
                                    <button aria-label="Scroll arrow next" className="scroll__arrow scroll__arrow--next" style={{ right: -18.4 }}>
                                        <svg className="icon" aria-hidden="true" width="16" height="16"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-forwards-16"></use></svg>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Popular Categories Section */}
                        <section className="section">
                            <header className="section__header">
                                <hgroup className="section__hgroup">
                                    <h2 className="section__title">Popular Categories from {selectedVendor.name}</h2>
                                </hgroup>
                            </header>
                            <div className="categories">
                                <a title="Electronics" className="categories__category" href="/cat/electronics.html">
                                    <img width="200" height="200" className="categories__image" src="//myshopcdn.com/images/electronics.webp" alt="Electronics" />
                                    <h2 className="categories__title">Electronics</h2>
                                    <div className="categories__cnt">172 products</div>
                                </a>
                                <a title="Laptops" className="categories__category" href="/cat/laptops.html">
                                    <img width="200" height="200" className="categories__image" src="//myshopcdn.com/images/laptops.webp" alt="Laptops" />
                                    <h2 className="categories__title">Laptops</h2>
                                    <div className="categories__cnt">25 products</div>
                                </a>
                                <a title="Smartphones" className="categories__category" href="/cat/smartphones.html">
                                    <img width="200" height="200" className="categories__image" src="//myshopcdn.com/images/smartphones.webp" alt="Smartphones" />
                                    <h2 className="categories__title">Smartphones</h2>
                                    <div className="categories__cnt">99 products</div>
                                </a>
                            </div>
                        </section>

                        {/* Reviews Section */}
                        <div id="merchant-reviews">
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">Reviews of {selectedVendor.name}</h2>
                                    </hgroup>
                                </header>
                                <div>
                                    <div className="rating-summary">
                                        <div className="average-rating">4.6</div>
                                        <div className="review-count">123 reviews</div>
                                    </div>
                                    <a data-review-src="reviews-overview" href="/m/1234/myshop/review" className="button">Rate it</a>
                                </div>
                            </section>
                        </div>

                        {/* Map Section */}
                        <section id="merchant-map" className="section">
                            <header className="section__header">
                                <hgroup className="section__hgroup">
                                    <h2 className="section__title">{selectedVendor.name} Locations</h2>
                                    <p className="section__subtitle">5 service points</p>
                                </hgroup>
                            </header>
                            <div id="merchant-map-placeholder">
                                <div className="geo__open-map leaflet-container leaflet-touch leaflet-retina leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom" tabIndex={0} style={{ position: 'relative' }}>
                                    {/* Map content will go here */}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorPage;
