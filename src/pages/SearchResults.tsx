
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
    <div id="root" class="clr">
      <div class="root__wrapper">
        <div class="root">

          <div class="page-products">
            <aside class="page-products__filters">
              <div id="filters">
                <div class="filters__categories" data-filter-name="categories">
                  <div class="filters__header">
                    <div class="filters__header-title filters__header-title--filters">Κατηγορίες</div>
                  </div>
                  <ol>
                    <li><a data-c="2" href="/cat/3446/tablets.html?q=ipad+pro+12.9-inch+m2"><span>Tablets</span></a></li>
                    <li><a data-c="2" href="/cat/5951/screen-protectors-tablets.html?q=ipad+pro+12.9-inch+m2"><span>Προστασία Οθόνης Tablet</span></a></li>
                    <li><a data-c="3" href="/cat/5943/thikes-tablet.html?q=ipad+pro+12.9-inch+m2"><span>Θήκες Tablet</span></a></li>
                    <li><a data-c="1" href="/cat/815/grafides-afis.html?q=ipad+pro+12.9-inch+m2"><span>Γραφίδες Αφής</span></a></li>
                  </ol>
                </div>

                <div class="filters__header">
                  <div class="filters__header-title filters__header-title--filters">Φίλτρα</div>
                </div>

                <div class="filter-limit default-list" data-filter-name="limit" data-filter-id="" data-type="" data-key="limit"><div class="filter__header"><h4>Εμφάνιση μόνο</h4></div><div class="filter-container"><ol><li data-filter="certified"><a title="Πιστοποιημένα καταστήματα" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;certified=1"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-certified-16"></use></svg><span>Πιστοποιημένα καταστήματα</span></a></li><li id="filter-nearby" class="nearby-location is-set"><a title="Κοντά μου" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;nearby=1">Κοντά μου (20 χλμ)</a><div class="filter-nearby__options">Επιλογές</div></li><li data-filter="in-stock"><a title="Άμεσα διαθέσιμα" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;instock=1"><span>Άμεσα διαθέσιμα</span></a></li><li data-filter="boxnow"><a title="Παράδοση" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;boxnow=1"><svg aria-hidden="true" class="icon" width="24" height="24"><use xlink:href="/public/dist/images/icons/partners.svg#icon-boxnow"></use></svg><span class="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOXNOW"><svg aria-hidden="true" class="icon help" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-info-16"></use></svg></span><span>Παράδοση</span></a></li></ol></div></div>
                <div class="filter-brand filter-collapsed default-list" data-filter-name="Κατασκευαστής" data-filter-id="1" data-type="brand" data-key="brand"><div class="filter__header"><h4>Κατασκευαστής</h4></div><div class="filter-container"><ol data-total="4" data-hidden="-1"><li><a data-c="4" data-id="9" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;f1=9">Apple</a></li><li><a data-c="2" data-id="20028" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;f1=20028">Spigen</a></li><li><a data-c="1" data-id="128" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;f1=128">Targus</a></li><li><a data-c="1" data-id="39080" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;f1=39080">Techsuit</a></li></ol></div></div>
                <div class="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store"><div class="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div><div class="filter-container"><ol data-total="15" data-hidden="10"><li><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=plaisio.gr"><span>Plaisio</span></a></li><li><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=germanos.gr"><span>Germanos</span></a></li><li><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=you.gr"><span>You</span></a></li><li><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=e-gateway.gr"><span>e-Gateway</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=websupplies.gr"><span>Websupplies</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=adaptoras.gr"><span>Adaptoras</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=madhawk.gr"><span>Madhawk</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=plusmobi.net"><span>Plusmobi</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=metrostore.gr"><span>Metrostore</span></a></li><li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=twiinshop.gr"><span>Twiinshop</span></a></li><li class="hidden"><a data-l="2" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=electroholic.gr"><span>Electroholic</span></a></li><li class="hidden"><a data-l="2" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=3dmall.gr"><span>3dMall</span></a></li><li class="hidden"><a data-l="2" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=mobicell.gr"><span>MobiCell</span></a></li><li class="hidden"><a data-l="2" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=gadgetmart.gr"><span>GadgetMart</span></a></li><li class="hidden"><a data-l="1" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;store=techstores.gr"><span>Techstores</span></a></li></ol><div id="filter-store-prompt" class="filters-more-prompt" title="Εμφάνιση όλων των πιστοποιημένων καταστημάτων"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/icons.svg#icon-plus-more"></use></svg> Εμφάνιση όλων</div></div></div>
                <div class="filters__buttons"><button class="button" data-filters-close="">Εμφάνιση  των  προϊόντων</button></div>
                
                
              </div>
            </aside>

            <main class="page-products__main">
              <div class="page-header">
                <div class="page-header__title-wrapper">
                  <div class="page-header__title-main">
                    <h1>{query}</h1>
                    <div class="page-header__count-wrapper">
                      <div class="page-header__count">{filteredResults.length} προϊόντα</div>
                    </div>
                  </div>
                </div>

                <div class="page-header__sorting">
                  <div class="tabs">
                    <div class="tabs-wrapper">
                      <nav>
                        <a href="/search?q={query}" rel="nofollow" class="current">
                          <div class="tabs__content">Σχετικότερα</div>
                        </a>
                        <a href="/search?q={query}&amp;o=2" rel="nofollow">
                          <div class="tabs__content">Φθηνότερα</div>
                        </a>
                        <a href="/search?q={query}&amp;o=1" rel="nofollow">
                          <div class="tabs__content">Ακριβότερα</div>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>

              <div class="page-products__main-wrapper">
                <div class="p__products" data-pagination="">
                  <ProductFilter onSortChange={setSortOrder} onVendorFilter={setFilteredVendors} onPriceRangeFilter={(min, max) => console.log(min, max)} onInStockOnly={setInStockOnly} />
                  
                  {filteredResults.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-lg text-muted-foreground">No products found matching your search.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredResults.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div class="alerts">
                <button data-url="/search?q={query}" data-title="{query}" data-max-price="0" class="alerts__button pressable">
                  <svg aria-hidden="true" class="icon" width="20" height="20">
                    <use xlink:href="/public/dist/images/icons/icons.svg#icon-notification-outline-20"></use>
                  </svg>
                  <span class="alerts__label">Ειδοποίηση</span>
                </button>
                <div class="alerts__prompt"> σε 
                  <span class="alerts__title"> {query}</span>
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
