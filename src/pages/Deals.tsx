
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
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
              <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
              <TabsTrigger value="friends" className="flex-1">Friends</TabsTrigger>
              <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
            </TabsList>
      
            <TabsContent value="timeline"></TabsContent>
            <TabsContent value="about"></TabsContent>
            <TabsContent value="friends"></TabsContent>
            <TabsContent value="photos"></TabsContent>
          </Tabs>
        </div>

        <header className="page-header">
          <h1>Προσφορές &amp; Εκπτώσεις</h1>
          <p>6.551 προϊόντα με μεγάλη πτώση τιμής</p>
        </header>
      
        <ProductFilter onSortChange={handleSortChange} onVendorFilter={handleVendorFilter} onPriceRangeFilter={handlePriceRangeFilter} onInStockOnly={handleInStockOnly} />
        
        <div className="product-grid mt-6">
          {filteredDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>






        
      </div>
    </div>
  );
};

export default Deals;
