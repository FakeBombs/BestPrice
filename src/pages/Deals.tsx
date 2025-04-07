
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

            <div className="deals-distr__wrapper">
              <div className="deals-distr deals-distr--center">
                <div className="scroll scroll--center scroll--small">
                  <div className="scroll__clip">
                    <div className="scroll__scroller">
                      <div className="scroll__content">
                        <div className="deals-distr__cats">
                          <Link data-id="6989" data-cnt="1131" className="deals-distr__cat" to="/deals/6989/technology.html" title="Προσφορές σε Τεχνολογία"><span>Τεχνολογία</span></Link>
                          <Link data-id="2185" data-cnt="1720" className="deals-distr__cat" to="/deals/2185/home-garden.html" title="Προσφορές σε Σπίτι &amp; Κήπος"><span>Σπίτι &amp; Κήπος</span></Link>
                          <Link data-id="2068" data-cnt="2190" className="deals-distr__cat" to="/deals/2068/fashion.html" title="Προσφορές σε Μόδα"><span>Μόδα</span></Link>
                          <Link data-id="583" data-cnt="511" className="deals-distr__cat" to="/deals/583/health-beauty.html" title="Προσφορές σε Υγεία &amp; Ομορφιά"><span>Υγεία &amp; Ομορφιά</span></Link>
                          <Link data-id="2175" data-cnt="526" className="deals-distr__cat" to="/deals/2175/paidika-brefika.html" title="Προσφορές σε Παιδικά - Βρεφικά"><span>Παιδικά - Βρεφικά</span></Link>
                          <Link data-id="3058" data-cnt="269" className="deals-distr__cat" to="/deals/3058/sports-hobbies.html" title="Προσφορές σε Hobby, Αθλητισμός"><span>Hobby, Αθλητισμός</span></Link>
                          <Link data-id="3204" data-cnt="204" className="deals-distr__cat" to="/deals/3204/auto-moto.html" title="Προσφορές σε Μηχανοκίνηση"><span>Μηχανοκίνηση</span></Link>
                        </div>
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
