import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const SearchResults = () => {
  const [activeFilters, setActiveFilters] = useState({ vendors: [], brands: [], specs: {}, inStockOnly: false });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableVendors, setAvailableVendors] = useState(new Set());
  const [availableBrands, setAvailableBrands] = useState({});
  const [availableSpecs, setAvailableSpecs] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (searchQuery) {
      const results = searchProducts(searchQuery);
      setProducts(results);
      setFilteredProducts(results);
      extractAvailableFilters(results);
      extractCategories(results);
    }
  }, [searchQuery]);

  const extractAvailableFilters = (results) => {
    // ... (existing filter extraction logic)
  };

  const extractCategories = (results) => {
    const categoryCount = {};
    // ... (existing category counting logic)
  };

  // ... (existing filter handling and filtering functions)

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            <div id="filters">
              {/* Existing filters (categories, vendors, brands, etc.) */}
            </div>
          </aside>

          <main className="page-products__main">
            <div className="page-header">
              <div className="page-header__title-wrapper">
                <h1>{searchQuery}</h1>
                <div>{filteredProducts.length} products</div>
              </div>
              {/* New Section for Dynamic Categories */}
              <section className="section">
                <header className="section__header">
                  <hgroup className="section__hgroup">
                    <h2 className="section__title">Κατηγορίες</h2>
                  </hgroup>
                </header>
                <div className="scroll">
                  <div className="scroll__clip">
                    <div className="scroll__scroller">
                      <Carousel>
                        {availableCategories.map((item) => (
                          <div className="categories categories--scrollable scroll__content" key={item.category}>
                            <a title={item.category} className="categories__category" href={`/#`}>
                              <img width="200" height="200" className="categories__image" src={item.image} alt={item.category} />
                              <h2 className="categories__title">{item.category}</h2>
                              <div className="categories__cnt">{item.count} προϊόντα</div>
                            </a>
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  </div>
                </div>
              </section>
              {/* End of Dynamic Categories Section */}
            </div>

            {filteredProducts.length === 0 ? (
              <p>No products found matching your search.</p>
            ) : (
              <div className="product-grid mt-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
