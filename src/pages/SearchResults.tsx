
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
