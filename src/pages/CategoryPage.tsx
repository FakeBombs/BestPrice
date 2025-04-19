import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { categories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string; slug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState({
    specs: {},
  });
  const [availableSpecs, setAvailableSpecs] = useState<Record<string, Set<string>>>({});
  const [sortType, setSortType] = useState('rating-desc'); // Default sort type

  useEffect(() => {
    const subCategoryId = parseInt(categoryId);
    const subCategory = categories.find(cat => cat.id === subCategoryId);

    if (subCategory) {
      setCurrentCategory(subCategory);
      const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategoryId));
      setFilteredProducts(productsToDisplay);
      extractAvailableFilters(productsToDisplay); 
    }
  }, [categoryId]);

  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  useEffect(() => {
    filterProducts(activeFilters.specs, filteredProducts);
  }, [activeFilters, filteredProducts]);

  const extractAvailableFilters = (results: Product[]) => {
    const specs: Record<string, Set<string>> = {};

    results.forEach((product) => {
      Object.keys(product.specifications).forEach((specKey) => {
        if (!specs[specKey]) {
          specs[specKey] = new Set();
        }
        specs[specKey].add(product.specifications[specKey]);
      });
    });

    setAvailableSpecs(specs);
  };

  const filterProducts = (specs: Record<string, string[]>, results: Product[]) => {
    let filtered = results;

    if (Object.keys(specs).length > 0) {
      filtered = filtered.filter((product) => {
        return Object.entries(specs).every(([key, values]) => {
          return values.includes(product.specifications[key]);
        });
      });
    }

    setFilteredProducts(sortProducts(filtered));
  };

  const sortProducts = (products: Product[]) => {
    switch (sortType) {
      case 'price-asc':
        return [...products].sort((a, b) => a.prices[0].price - b.prices[0].price);
      case 'price-desc':
        return [...products].sort((a, b) => b.prices[0].price - a.prices[0].price);
      case 'rating-desc':
      default:
        return [...products].sort((a, b) => b.rating - a.rating);
    }
  };

  const handleSpecFilter = (specKey: string, specValue: string) => {
    const currentSpecs = { ...activeFilters.specs };
    const specValues = currentSpecs[specKey] || [];
    if (specValues.includes(specValue)) {
      currentSpecs[specKey] = specValues.filter((v) => v !== specValue);
      if (currentSpecs[specKey].length === 0) delete currentSpecs[specKey];
    } else {
      currentSpecs[specKey] = [...specValues, specValue];
    }
    setActiveFilters((prev) => ({ ...prev, specs: currentSpecs }));
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            {Object.keys(availableSpecs).length > 0 &&
              Object.keys(availableSpecs).map((specKey) => (
                <div key={specKey} className={`filter-${specKey.toLowerCase()} default-list`} data-filter-name={specKey.toLowerCase()} data-type data-key={specKey.toLowerCase()}>
                  <div className="filter__header"><h4>{specKey}</h4></div>
                  <div className="filter-container">
                    <ol>
                      {Array.from(availableSpecs[specKey]).map((specValue) => (
                        <li key={specValue} className={activeFilters.specs[specKey]?.includes(specValue) ? 'selected' : ''} onClick={() => handleSpecFilter(specKey, specValue)}>
                          <span>{specValue}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
          </aside>

          <main className="page-products__main">
            <header className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{currentCategory.name}</h1>
                  <div className="page-header__count-wrapper">
                    <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
                  </div>
                </div>
              </div>
            </header>

            <div className="page-header__sorting">
              <div className="tabs">
                <div className="tabs-wrapper">
                  <nav>
                    <a data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={() => setSortType('rating-desc')}>
                      <div className="tabs__content">Δημοφιλέστερα</div>
                    </a>
                    <a data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={() => setSortType('price-asc')}>
                      <div className="tabs__content">Φθηνότερα</div>
                    </a>
                    <a data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={() => setSortType('price-desc')}>
                      <div className="tabs__content">Ακριβότερα</div>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
            {filteredProducts.length === 0 ? (
              <p>No products found in this category.</p>
            ) : (
              <div className="page-products__main-wrapper">
                <div className="p__products" data-pagination="">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
