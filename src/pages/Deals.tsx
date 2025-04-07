
import { useState, useEffect } from 'react';
import { fetchDeals } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  
  useEffect(() => {
    const dealsData = fetchDeals();
    setDeals(dealsData);
    setFilteredDeals(dealsData);
  }, []);
  
  // Filter and sort functions
  const handleSortChange = (value: string) => {
    const sorted = [...filteredDeals];
    
    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return aPrice - bPrice;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return bPrice - aPrice;
        });
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews-desc':
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }
    
    setFilteredDeals(sorted);
  };
  
  const handleVendorFilter = (vendors: string[]) => {
    if (vendors.length === 0) {
      setFilteredDeals(deals);
      return;
    }
    
    const filtered = deals.filter(product => 
      product.prices.some(price => vendors.includes(price.vendorId))
    );
    
    setFilteredDeals(filtered);
  };
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    const filtered = deals.filter(product => {
      const minPrice = product.prices.length ? Math.min(...product.prices.map(p => p.price)) : 0;
      return minPrice >= min && minPrice <= max;
    });
    
    setFilteredDeals(filtered);
  };
  
  const handleInStockOnly = (inStockOnly: boolean) => {
    if (!inStockOnly) {
      setFilteredDeals(deals);
      return;
    }
    
    const filtered = deals.filter(product => 
      product.prices.some(price => price.inStock)
    );
    
    setFilteredDeals(filtered);
  };
  
  return (
    <div className="root__wrapper">
      <div className="root">




        <div className="deals-tabs">
          <a className="deals-tabs__tab deals-tabs__tab--selected" href="/deals">Προσφορές</a>
          <a className="deals-tabs__tab" href="/deals/c">Ανά κατηγορία</a>
          <a className="deals-tabs__tab" href="/deals/my">Οι Προσφορές μου</a>
          <a className="deals-tabs__tab" href="/deals/m">Ανά κατάστημα</a>
          <a className="deals-tabs__tab" href="/deals/b">Ανά κατασκευαστή</a>
        </div>

        <header className="page-header">
          <h1>Προσφορές &amp; Εκπτώσεις</h1>
          <p>6.551 προϊόντα με μεγάλη πτώση τιμής</p>
        </header>
      
        <ProductFilter onSortChange={handleSortChange} onVendorFilter={handleVendorFilter} onPriceRangeFilter={handlePriceRangeFilter} onInStockOnly={handleInStockOnly} />
        
        <div className="page-products">
          <main className="page-products__main">

            <div class="deals-distr__wrapper">
              <div class="deals-distr deals-distr--center">
                <div class="scroll scroll--center scroll--small">
                  <div class="scroll__clip">
                    <div class="scroll__scroller">
                      <div class="scroll__content">
                        <div class="deals-distr__cats"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            {filteredDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </main>
        </div>






        
      </div>
    </div>
  );
};

export default Deals;
