import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import { Product } from '@/data/mockData';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [filteredVendors, setFilteredVendors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  useEffect(() => {
    if (query) {
      const searchResults = searchProducts(query);
      setResults(searchResults);
      setFilteredResults(searchResults);
    }
  }, [query]);
  
  useEffect(() => {
    let filtered = [...results];
    
    // Apply vendor filter
    if (filteredVendors.length > 0) {
      filtered = filtered.filter(product => 
        product.prices.some(price => 
          filteredVendors.includes(price.vendorId)
        )
      );
    }
    
    // Apply in-stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => 
        product.prices.some(price => price.inStock)
      );
    }
    
    // Apply sorting
    filtered = filtered.sort((a, b) => {
      const aPrice = Math.min(...a.prices.map(p => p.price));
      const bPrice = Math.min(...b.prices.map(p => p.price));
      
      switch (sortOrder) {
        case 'price-asc':
          return aPrice - bPrice;
        case 'price-desc':
          return bPrice - aPrice;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'reviews-desc':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });
    
    setFilteredResults(filtered);
  }, [results, sortOrder, filteredVendors, inStockOnly]);
  
  return (
    <div id="root" className="clr">
      <div className="root__wrapper">
        <div className="root">
          <div className="page-products">
            <aside className="page-products__filters">
              <div id="filters">
                <div className="filters__categories" data-filter-name="categories">
                  <div className="filters__header">
                    <div className="filters__header-title filters__header-title--filters">Κατηγορίες</div>
                  </div>
                  <ol>
                    <li><a data-c="2" href="/cat/3446/tablets.html?q={query}"><span>Tablets</span></a></li>
                    <li><a data-c="2" href="/cat/5951/screen-protectors-tablets.html?q={query}"><span>Προστασία Οθόνης Tablet</span></a></li>
                    <li><a data-c="3" href="/cat/5943/thikes-tablet.html?q={query}"><span>Θήκες Tablet</span></a></li>
                    <li><a data-c="1" href="/cat/815/grafides-afis.html?q={query}"><span>Γραφίδες Αφής</span></a></li>
                  </ol>
                </div>

                <div className="filters__header">
                  <div className="filters__header-title filters__header-title--filters">Φίλτρα</div>
                </div>

                <div className="filter-limit default-list" data-filter-name="limit" data-filter-id="" data-type="" data-key="limit">
                  <div className="filter__header">
                    <h4>Εμφάνιση μόνο</h4>
                  </div>
                  <div className="filter-container">
                    <ol>
                      <li data-filter="certified">
                        <a title="Πιστοποιημένα καταστήματα" rel="nofollow" href="/search?q={query}&amp;certified=1">
                          <svg aria-hidden="true" class="icon" width="16" height="16">
                            <use xlink:href="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-certified-16"></use>
                          </svg>
                          <span>Πιστοποιημένα καταστήματα</span>
                        </a>
                      </li>
                      <li id="filter-nearby" class="nearby-location is-set">
                        <a title="Κοντά μου" rel="nofollow" href="/search?q={query}&amp;nearby=1">Κοντά μου (20 χλμ)</a>
                        <div className="filter-nearby__options">Επιλογές</div>
                      </li>
                      <li data-filter="in-stock">
                        <a title="Άμεσα διαθέσιμα" rel="nofollow" href="/search?q={query}&amp;instock=1"><span>Άμεσα διαθέσιμα</span></a>
                      </li>
                      <li data-filter="boxnow">
                        <a title="Παράδοση" rel="nofollow" href="/search?q={query}&amp;boxnow=1">
                          <svg aria-hidden="true" class="icon" width="24" height="24">
                            <use xlink:href="//www.bestprice.gr/public/dist/images/icons/partners.svg#icon-boxnow"></use>
                          </svg>
                          <span class="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOXNOW">
                            <svg aria-hidden="true" class="icon help" width="16" height="16">
                              <use xlink:href="//www.bestprice.gr//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-info-16"></use>
                            </svg>
                          </span><span>Παράδοση</span>
                        </a>
                      </li>
                    </ol>
                  </div>
                </div>
                
                <div className="filter-brand filter-collapsed default-list" data-filter-name="Κατασκευαστής" data-filter-id="1" data-type="brand" data-key="brand"><div className="filter__header"><h4>Κατασκευαστής</h4></div><div className="filter-container"><ol data-total="4" data-hidden="-1"><li><a data-c="4" data-id="9" rel="nofollow" href="/search?q={query}&amp;f1=9">Apple</a></li><li><a data-c="2" data-id="20028" rel="nofollow" href="/search?q={query}&amp;f1=20028">Spigen</a></li><li><a data-c="1" data-id="128" rel="nofollow" href="/search?q={query}&amp;f1=128">Targus</a></li><li><a data-c="1" data-id="39080" rel="nofollow" href="/search?q={query}&amp;f1=39080">Techsuit</a></li></ol></div></div>
                <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store"><div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div><div className="filter-container"><ol data-total="15" data-hidden="10"><li><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=plaisio.gr"><span>Plaisio</span></a></li><li><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=germanos.gr"><span>Germanos</span></a></li><li><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=you.gr"><span>You</span></a></li><li><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=e-gateway.gr"><span>e-Gateway</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=websupplies.gr"><span>Websupplies</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=adaptoras.gr"><span>Adaptoras</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=madhawk.gr"><span>Madhawk</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=plusmobi.net"><span>Plusmobi</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=metrostore.gr"><span>Metrostore</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q={query}&amp;store=twiinshop.gr"><span>Twiinshop</span></a></li><li class="hidden"><a data-l="2" rel="nofollow" href="/search?q={query}&amp;store=electroholic.gr"><span>Electroholic</span></a></li><li class="hidden"><a data-l="2" rel="nofollow" href="/search?q={query}&amp;store=3dmall.gr"><span>3dMall</span></a></li><li class="hidden"><a data-l="2" rel="nofollow" href="/search?q={query}&amp;store=mobicell.gr"><span>MobiCell</span></a></li><li class="hidden"><a data-l="2" rel="nofollow" href="/search?q={query}&amp;store=gadgetmart.gr"><span>GadgetMart</span></a></li><li class="hidden"><a data-l="1" rel="nofollow" href="/search?q={query}&amp;store=techstores.gr"><span>Techstores</span></a></li></ol><div id="filter-store-prompt" className="filters-more-prompt" title="Εμφάνιση όλων των πιστοποιημένων καταστημάτων"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-plus-more"></use></svg> Εμφάνιση όλων</div></div></div>
                <div className="filters__buttons"><button className="button" data-filters-close="">Εμφάνιση  των  προϊόντων</button></div>
                <div className="filters__md-toggler" hidden="" role="button"><h5><svg aria-hidden="true" class="icon" width="18" height="18"><use xlink:href="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-filters-18"></use></svg>ΦΙΛΤΡΑ</h5></div>
          
                
              </div>
            </aside>

            <main className="page-products__main">
              <div className="page-header">
                <div className="page-header__title-wrapper">
                  <div className="page-header__title-main">
                    <h1>{query}</h1>
                    <div className="page-header__count-wrapper">
                      <div className="page-header__count">{filteredResults.length} προϊόντα</div>
                    </div>
                  </div>
                </div>

                <div className="page-header__sorting">
                  <div className="tabs">
                    <div className="tabs-wrapper">
                      <nav>
                        <a href="/search?q={query}" rel="nofollow" class="current">
                          <div className="tabs__content">Σχετικότερα</div>
                        </a>
                        <a href="/search?q={query}&amp;o=2" rel="nofollow">
                          <div className="tabs__content">Φθηνότερα</div>
                        </a>
                        <a href="/search?q={query}&amp;o=1" rel="nofollow">
                          <div className="tabs__content">Ακριβότερα</div>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>

              <div className="page-products__main-wrapper">
                <div className="p__products" data-pagination="">
                  <ProductFilter 
                    onSortChange={setSortOrder} 
                    onVendorFilter={setFilteredVendors} 
                    onPriceRangeFilter={(min, max) => console.log(min, max)} 
                    onInStockOnly={setInStockOnly} 
                  />
                  
                  {filteredResults.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-lg text-muted-foreground">No products found matching your search.</p>
                    </div>
                  ) : (
                    filteredResults.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  )}
                </div>
              </div>

              <div className="alerts">
                <button data-url="/search?q={query}" data-title="{query}" data-max-price="0" class="alerts__button pressable">
                  <svg aria-hidden="true" class="icon" width="20" height="20">
                    <use xlink:href="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-notification-outline-20"></use>
                  </svg>
                  <span className="alerts__label">Ειδοποίηση</span>
                </button>
                <div className="alerts__prompt"> σε 
                  <span className="alerts__title"> {query}</span>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
