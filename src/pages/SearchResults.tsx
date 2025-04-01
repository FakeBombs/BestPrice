
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


                <div class="filter-price default-list" data-filter-name="Τιμή" data-filter-id="price" data-type="price" data-key="price"><div class="filter__header"><h4>Τιμή</h4></div><div class="filter-container"><div class="filter__range filter__range--price" data-props="{&quot;ranges&quot;:[{&quot;title&quot;:&quot;\u039c\u03ad\u03c7\u03c1\u03b9 300\u20ac&quot;,&quot;url&quot;:&quot;\/search?q=ipad+pro+12.9-inch+m2&amp;max=30000&quot;,&quot;min&quot;:0,&quot;max&quot;:30000,&quot;cnt&quot;:6,&quot;selected&quot;:false},{&quot;title&quot;:&quot;\u03a0\u03ac\u03bd\u03c9 \u03b1\u03c0\u03cc 300\u20ac&quot;,&quot;url&quot;:&quot;\/search?q=ipad+pro+12.9-inch+m2&amp;min=30000&quot;,&quot;min&quot;:30000,&quot;max&quot;:0,&quot;cnt&quot;:2,&quot;selected&quot;:false}],&quot;from&quot;:1450,&quot;to&quot;:129195,&quot;min&quot;:14.5,&quot;max&quot;:1291.95,&quot;toLastRange&quot;:true,&quot;searchParams&quot;:{&quot;max&quot;:0,&quot;min&quot;:0}}"><div class="range"><div class="range__slider range__slider--has-graph"><div class="range__bar"></div><div class="range__bar range__bar--active" style="left: 0%; right: 0%;"></div><div class="range__knob" style="left: 0%;"></div><div class="range__knob" style="left: 100%;"></div><div class="range__graph"><div class="range__graph-item" style="height: 100%; left: 0%; width: 100%;"></div></div></div><div class="range__footer"><div class="range__form-wrapper"><div class="range__ranges"><div class="range__ranges-button"><svg class="icon" aria-hidden="true" width="12" height="12"><use xlink:href="/public/dist/images/icons/icons.svg#icon-up-12"></use></svg></div></div><form autocomplete="off" class="range__form"><input class="range__input" min="14.5" max="300" step="1" autocomplete="off" placeholder="Από" type="text" value="14€" name="min"><div class="range__form-label"> μέχρι </div><input class="range__input" min="14.5" max="1291.95" step="1" autocomplete="off" placeholder="Μέχρι" type="text" value="300€+" name="max"></form></div></div></div></div></div></div>
                <div class="filter-limit default-list" data-filter-name="limit" data-filter-id="" data-type="" data-key="limit"><div class="filter__header"><h4>Εμφάνιση μόνο</h4></div><div class="filter-container"><ol><li data-filter="certified"><a title="Πιστοποιημένα καταστήματα" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;certified=1"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-certified-16"></use></svg><span>Πιστοποιημένα καταστήματα</span></a></li><li id="filter-nearby" class="nearby-location is-set"><a title="Κοντά μου" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;nearby=1">Κοντά μου (20 χλμ)</a><div class="filter-nearby__options">Επιλογές</div></li><li data-filter="in-stock"><a title="Άμεσα διαθέσιμα" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;instock=1"><span>Άμεσα διαθέσιμα</span></a></li><li data-filter="boxnow"><a title="Παράδοση" rel="nofollow" href="/search?q=ipad+pro+12.9-inch+m2&amp;boxnow=1"><svg aria-hidden="true" class="icon" width="24" height="24"><use xlink:href="/public/dist/images/icons/partners.svg#icon-boxnow"></use></svg><span class="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOXNOW"><svg aria-hidden="true" class="icon help" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-info-16"></use></svg></span><span>Παράδοση</span></a></li></ol></div></div>
                
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
