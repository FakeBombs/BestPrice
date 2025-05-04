const VendorPage: React.FC<VendorPageProps> = () => {
    // ... (hooks and document attribute logic) ...

    const { vendorId, vendorName } = useParams<{ vendorId?: string, vendorName?: string }>(); // Add type for params
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null | undefined>(undefined); // Initial state undefined
    const [vendorProducts, setVendorProducts] = useState<Product[]>([]); // All products from this vendor
    const [vendorDeals, setVendorDeals] = useState<Product[]>([]); // Deals from this vendor
    const [vendorPopularCategories, setVendorPopularCategories] = useState<Category[]>([]); // Popular cats for this vendor
    const [vendorBrands, setVendorBrands] = useState<Brand[]>([]); // Brands sold by this vendor
    const [loading, setLoading] = useState(true);

    // --- Find Vendor Effect ---
    useEffect(() => {
        setLoading(true);
        let foundVendor: Vendor | undefined = undefined;

        if (vendorId) {
            foundVendor = vendors.find(v => v.id.toString() === vendorId);
        } else if (vendorName) {
            // Find by cleaned slug-like name
            foundVendor = vendors.find(v =>
                v.name.toLowerCase().replace(/\s+/g, '-') === vendorName || // Check simple slug
                cleanDomainName(v.url).split('.')[0] === vendorName // Check first part of domain
            );
        }

        setSelectedVendor(foundVendor); // Set found vendor or undefined if not found
        setLoading(false);

    }, [vendorId, vendorName]); // Re-run when params change


    // --- Fetch Vendor-Specific Data Effect ---
    useEffect(() => {
        if (selectedVendor) {
            // 1. Get all products offered by this vendor
            const productsFromVendor = allMockProducts.filter(p =>
                p.prices.some(price => price.vendorId === selectedVendor.id)
            );
            setVendorProducts(productsFromVendor);

            // 2. Find Deals from this vendor's products
            const deals = productsFromVendor
                .filter(p => p.prices.some(pr => pr.vendorId === selectedVendor.id && pr.discountPrice && pr.discountPrice < pr.price))
                .slice(0, 10); // Limit deals shown
            setVendorDeals(deals);

            // 3. Find Popular Categories for this vendor
            const categoryCounts: Record<number, number> = {};
            productsFromVendor.forEach(p => {
                p.categoryIds.forEach(catId => {
                    categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
                });
            });
            const allCatsMap = new Map([...mainCategories, ...categories].map(c => [c.id, c]));
            const popularCats = Object.entries(categoryCounts)
                .sort(([, countA], [, countB]) => countB - countA) // Sort by count desc
                .slice(0, 6) // Take top 6 categories
                .map(([idStr]) => allCatsMap.get(parseInt(idStr)))
                .filter((cat): cat is Category => cat !== undefined); // Type guard
            setVendorPopularCategories(popularCats);

            // 4. Find Brands sold by this vendor (based on products)
            const brandIds = new Set<number>();
            productsFromVendor.forEach(p => {
                const brandData = allBrands.find(b => b.name === p.brand);
                if (brandData) {
                    brandIds.add(brandData.id);
                }
            });
            setVendorBrands(allBrands.filter(b => brandIds.has(b.id)).slice(0, 10)); // Limit brands shown initially


        } else {
            // Reset if no vendor is selected
            setVendorProducts([]);
            setVendorDeals([]);
            setVendorPopularCategories([]);
            setVendorBrands([]);
        }
    }, [selectedVendor]); // Re-run when the selected vendor changes

    // --- Loading / Not Found ---
    if (loading) {
        return <div>Loading Vendor...</div>; // Or a spinner component
    }
    if (selectedVendor === undefined) { // Explicitly check for undefined (not found)
        return <NotFound />;
    }
    // Vendor is found (selectedVendor is not null or undefined)
    const vendor = selectedVendor; // Type assertion is safe here

    // --- Dynamic Calculation for Address Count ---
    const additionalAddresses = (vendor.address?.length || 0) > 1 ? (vendor.address.length - 1) : 0;

    return (
        // Keep the outer div if necessary for styling, otherwise Fragment might suffice
        // <div id="root" className="clr">
        <>
            <section className="merchant-hero root_wrapper" style={{ background: 'var(--colors-themed-card-bg)', borderBottom: 0 }}>
                <div className="root">
                    <div className="merchant-trail">
                        <div id="trail">
                            <nav className="breadcrumb">
                                <ol>
                                    <li><Link to="/" rel="home"><span>BestPrice</span></Link><span className="trail__breadcrumb-separator">›</span></li>
                                    <li><Link to="/m"><span>Καταστήματα</span></Link><span className="trail__breadcrumb-separator">›</span></li> {/* Link to merchants list */}
                                    <li><span className="trail__last">{vendor.name}</span></li> {/* Current vendor name */}
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="merchant-logo">
                        <img src={vendor.logo} alt={`${vendor.name} logo`} title={vendor.name} loading="lazy" /> {/* Dynamic logo */}
                        {vendor.certification && (
                            <span className="merchant-logo--certification" data-certification={vendor.certification.toLowerCase()}>
                                <svg aria-hidden="true" className="icon" width="22" height="22"><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg>
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {vendor.certification && (
            <div className={`merchant-certified--wrapper merchant-certified--${vendor.certification.toLowerCase()} root__wrapper`}>
                <div className="root merchant-certified">
                    <svg aria-hidden="true" className="icon" width={22} height={22}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg>
                    {/* Dynamic Certification Text */}
                    <span className="hide-tablet">Certified Store (<Link to="/certification">{vendor.certification}</Link>)</span>
                    <span className="hide-mobile">{vendor.name} is a certified store (<b data-certification={vendor.certification.toLowerCase()}>{vendor.certification}</b>)</span>
                </div>
            </div>
            )}

            <div className="masthead__wrapper root__wrapper">
                <div className="root">
                    <div className="masthead">
                        <div className="masthead__main">
                            <div className="id">
                                <div className="id__title">
                                    <h1 itemProp="name">{vendor.name}</h1>
                                </div>
                                <div className="masthead__id">
                                    <div className="masthead__id-section">
                                        <div>
                                            {/* Dynamic Rating */}
                                            {vendor.rating && (
                                                <div className="id__rating-wrapper">
                                                    {/* Link to reviews section on this page */}
                                                    <a className="id__rating" href={`#merchant-reviews`} title={`${vendor.rating} αστέρια από ${vendor.numberOfRatings || '?'} αξιολογήσεις`}>
                                                        <span className="rating rating-all" data-total={vendor.rating.toFixed(1)}>
                                                            {/* Dynamic star clipping */}
                                                            <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)` }} width="100%" height="100%">
                                                                <use href="/dist/images/icons/stars.svg#icon-stars-all"></use>
                                                            </svg>
                                                        </span>
                                                        {vendor.numberOfRatings && <span className="id__rating-count">({vendor.numberOfRatings})</span>}
                                                    </a>
                                                    {/* Optionally link to a separate review submission page if needed */}
                                                    {/* <a data-review-src="merchant-page-header" href={`/m/${vendor.id}/${vendor.name?.toLowerCase()}/review`} className="id__rating-link">Rate it</a> */}
                                                </div>
                                            )}
                                            <ul className="id__meta">
                                                {/* Add 'date joined' if available in your data */}
                                                {/* <li data-type="joined">...</li> */}
                                                {/* Add social links dynamically if available */}
                                                {/* <li data-type="social">...</li> */}
                                                {/* Add opening status dynamically if available */}
                                                {/* <li><span class="id__status ...">...</span></li> */}
                                            </ul>
                                        </div>
                                        <div>
                                            <ul className="id__meta">
                                                <li data-type="url" itemProp="url" content={vendor.url}>
                                                    <a className="ui-kit__text" target="_blank" href={vendor.url} rel="external nofollow noopener">
                                                        <svg aria-hidden="true" className="icon" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-world-16"></use></svg>
                                                        {cleanDomainName(vendor.url)} {/* Show cleaned domain */}
                                                    </a>
                                                </li>
                                                {vendor.telephone && vendor.telephone.length > 0 && (
                                                    <li data-type="telephone">
                                                        <svg aria-hidden="true" className="icon icon--outline" width="14" height="14"><use href="/dist/images/icons/icons.svg#icon-phone-14"></use></svg>
                                                        <span className="ui-kit__text">
                                                            {/* Map multiple phone numbers */}
                                                            {vendor.telephone.map((tel, index) => (
                                                                <React.Fragment key={tel}>
                                                                    <a href={`tel:${tel}`}>{tel}</a>
                                                                    {index < vendor.telephone.length - 1 && ', '}
                                                                </React.Fragment>
                                                            ))}
                                                        </span>
                                                    </li>
                                                )}
                                                 {vendor.address && vendor.address.length > 0 && (
                                                    <li data-type="address">
                                                        <a href={`#merchant-map`}> {/* Link to map section */}
                                                            <svg aria-hidden="true" className="icon icon--outline" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-pin-12"></use></svg>
                                                            <span className="ui-kit__text">{vendor.address[0]}</span> {/* Show first address */}
                                                        </a>
                                                    </li>
                                                )}
                                                {additionalAddresses > 0 && ( // Show only if there are more addresses
                                                    <li data-type="storesCount">
                                                        <a href={`#merchant-map`}> {/* Link to map section */}
                                                            <small className="ui-kit__small ui-kit__muted">{additionalAddresses} ακόμη {additionalAddresses === 1 ? 'κατάστημα' : 'καταστήματα'}</small>
                                                        </a>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    {/* Dynamic Brands Section */}
                                    {vendorBrands.length > 0 && (
                                        <div className="masthead__id-section">
                                            <ul className="id__meta">
                                                <li data-type="brands">
                                                    <h4 className="ui-kit__secondary ui-kit__pb-4">Authorized Reseller</h4> {/* Adjust title if needed */}
                                                    <div>
                                                        {vendorBrands.map((brand) => (
                                                            <Link key={brand.id} to={`/b/${brand.id}/${brand.slug || brand.name.toLowerCase()}.html`} title={brand.name}>
                                                                <img width="56" height="56" alt={`${brand.name} logo`} src={brand.logo} loading="lazy" />
                                                            </Link>
                                                        ))}
                                                        {/* Add "more" logic if needed */}
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
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
                                {selectedVendor.url && ( // Only show screenshot if URL exists
                                    <>
                                     <h2 className="ui-kit__secondary">Preview Website</h2>
                                        <div className="merchant__screenshot">
                                            <a href={selectedVendor.url} target="_blank" rel="noopener noreferrer nofollow external">
                                            <div className="ratio__wrapper">
                                                <div className="ratio">
                                                    {/* Placeholder or actual screenshot service */}
                                                    <img className="ratio__content" itemProp="image" alt={`${selectedVendor.name} Screenshot`} width="600" height="550" src={`//image.thum.io/get/width/600/crop/800/noanimate/${selectedVendor.url}`} onError={(e) => { e.currentTarget.src = '/images/no-image.svg'; e.currentTarget.classList.add('no-image'); }} loading="lazy" />
                                                </div>
                                            </div>
                                            </a>
                                        </div>
                                    </>
                                )}
                            </section>
                            {/* Dynamic Payment Methods */}
                            {vendor.paymentMethods && vendor.paymentMethods.length > 0 && (
                                 <PaymentMethodsComponent paymentMethods={vendor.paymentMethods} />
                            )}
                        </section>

                        {/* Deals Section - Dynamic */}
                        {vendorDeals.length > 0 && (
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        {/* Link to a potential deals page filtered by this vendor */}
                                        <h2 className="section__title"><Link to={`/search?store=${cleanDomainName(vendor.url).toLowerCase()}&deals=1`}>Προσφορές από {vendor.name}</Link></h2>
                                    </hgroup>
                                </header>
                                <ScrollableSlider>
                                  <div className="p__products--scroll scroll__content">
                                      {vendorDeals.map(dealProduct => (
                                         // Use InlineProductItem for consistency if available, or adapt ProductCard
                                         <ProductCard key={`deal-${dealProduct.id}`} product={dealProduct} />
                                         // Or <InlineProductItem key={`deal-${dealProduct.id}`} product={dealProduct} bpref={`merchant-deals-${vendor.id}`} />
                                      ))}
                                  </div>
                                </ScrollableSlider>
                            </section>
                        )}

                        {/* Popular Categories Section - Dynamic */}
                        {vendorPopularCategories.length > 0 && (
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">Δημοφιλείς Κατηγορίες από {vendor.name}</h2>
                                    </hgroup>
                                </header>
                                <div className="categories">
                                    {vendorPopularCategories.map(cat => (
                                        <Link key={cat.id} title={cat.name} className="categories__category" to={`/cat/${cat.id}/${cat.slug}?store=${cleanDomainName(vendor.url).toLowerCase()}`}>
                                            <img width="200" height="200" className="categories__image" src={cat.image || '/dist/images/cat/placeholder.webp'} alt={cat.name} loading="lazy"/>
                                            <h2 className="categories__title">{cat.name}</h2>
                                            <div className="categories__cnt">{cat.count} {cat.count === 1 ? 'προϊόν' : 'προϊόντα'}</div>
                                        </Link>
                                    ))}
                                </div>
                                <div id="popular-categories" className="popular-categories">
                                    <div className="expand popular-categories__view-wrapper">
                                        {/* Link to all products filtered by this vendor */}
                                        <Link className="button popular-categories__view-all" rel="nofollow" to={`/search?store=${cleanDomainName(vendor.url).toLowerCase()}`}>
                                            <span>Δες όλα τα προϊόντα<span className="hide-mobile"> του καταστήματος</span></span>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Reviews Section - Placeholder Data */}
                        <div id="merchant-reviews">
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">Αξιολογήσεις Καταστήματος {vendor.name}</h2>
                                    </hgroup>
                                </header>
                                <div>
                                    {vendor.rating && vendor.numberOfRatings && ( // Show summary only if data exists
                                        <div className="rating-summary">
                                            <div className="average-rating">{vendor.rating.toFixed(1)}</div>
                                            <div className="review-count">{vendor.numberOfRatings} αξιολογήσεις</div>
                                             {/* Add star display matching the rating */}
                                             <span className="rating rating-all" data-total={vendor.rating.toFixed(1)} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '5px' }}>
                                                 <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}>
                                                     <use href="/dist/images/icons/stars.svg#icon-stars-all"></use>
                                                 </svg>
                                             </span>
                                        </div>
                                    )}
                                    {/* Link to submit review - might need dynamic URL or different handling */}
                                    <Link data-review-src="reviews-overview" to={`/m/${vendor.id}/${vendor.name?.toLowerCase()}/review`} className="button">Αξιολόγησε το</Link>
                                    {/* Placeholder for displaying actual reviews */}
                                    <div className="reviews-list" style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                                        <p><i>(Εδώ θα εμφανίζονται οι πραγματικές αξιολογήσεις)</i></p>
                                        {/* Example Review Item */}
                                        {/* <div class="review-item">...</div> */}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Map Section - Placeholder Map, Dynamic Addresses */}
                        {vendor.address && vendor.address.length > 0 && (
                            <section id="merchant-map" className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">Σημεία Εξυπηρέτησης {vendor.name}</h2>
                                        {vendor.address.length > 1 && <p className="section__subtitle">{vendor.address.length} σημεία</p>}
                                    </hgroup>
                                </header>
                                <div id="merchant-map-placeholder">
                                    <div className="geo__open-map leaflet-container leaflet-touch leaflet-retina leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom" tabIndex={0} style={{ position: 'relative', height: '300px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                        {/* Basic Map Placeholder - Replace with actual map component (e.g., Leaflet, Google Maps) */}
                                        <span>Map Placeholder</span>
                                    </div>
                                </div>
                                {vendor.address.length > 1 && ( // Show slider only if multiple addresses
                                <ScrollableSlider>
                                    <div className="merchant-map__pops grid scroll__content">
                                        {vendor.address.map((addr, index) => (
                                        <div className="merchant-map__pop-wrapper" key={`${vendor.id}-${index}`}>
                                            <div className="merchant-map__pop pressable" data-id={vendor.id} /* Add onClick to focus map if implemented */ >
                                            <div className="merchant-map__pop-meta">
                                                <address itemProp="address" className="ui-kit__tertiary ui-kit__pb-2">{addr}</address>
                                                <small className="ui-kit__small ui-kit__muted">Κατάστημα / Παραλαβή</small>
                                            </div>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </ScrollableSlider>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VendorPage;
