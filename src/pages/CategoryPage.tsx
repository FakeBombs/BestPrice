import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { categories, products, brands } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string; slug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState({
    brands: [],
  });
  const [availableBrands, setAvailableBrands] = useState<Record<string, number>>({});
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
    filterProducts(activeFilters.brands, filteredProducts);
  }, [activeFilters, filteredProducts]);

  const extractAvailableFilters = (results: Product[]) => {
    const brandsCount: Record<string, number> = {};
    results.forEach((product) => {
      if (product.brand) {
        brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1;
      }
    });

    setAvailableBrands(brandsCount);
  };

  const filterProducts = (brands: string[], results: Product[]) => {
    let filtered = results;

    if (brands.length > 0) {
      filtered = filtered.filter((product) => brands.includes(product.brand));
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

  const handleBrandFilter = (brand: string) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter((b) => b !== brand)
      : [...activeFilters.brands, brand];
    setActiveFilters((prev) => ({ ...prev, brands: newBrands }));
  };

  const renderAppliedFilters = () => {
    return (
      activeFilters.brands.length > 0 && (
        <div className="applied-filters">
          {activeFilters.brands.map((brand) => (
            <h2 className="applied-filters__filter" key={brand}>
              <a onClick={() => handleBrandFilter(brand)}>
                <span className="applied-filters__label">{brand}</span>
              </a>
            </h2>
          ))}
        </div>
      )
    );
  };

  const displayedBrand = activeFilters.brands.length > 0 ? availableBrands[activeFilters.brands[0]] : null;

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            {Object.keys(availableBrands).length > 0 && (
              <div className="filter-brand default-list" data-filter-name data-type data-key>
                <div className="filter__header"><h4>Κατασκευαστής</h4></div>
                <div className="filter-container">
                  <ol>
                    {Object.keys(availableBrands).map((brand) => (
                      <li key={brand} className={activeFilters.brands.includes(brand) ? 'selected' : ''} onClick={() => handleBrandFilter(brand)}>
                        <span>{brand} ({availableBrands[brand]})</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
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
                <div className="page-header__title-aside">
                  {displayedBrand && (
                    <a href={`/b/${displayedBrand.id}/${displayedBrand.name.toLowerCase()}.html`} title={displayedBrand.name} className="page-header__brand">
                      <img itemProp="logo" title={`${displayedBrand.name} logo`} alt={`${displayedBrand.name} logo`} height="70" loading="lazy" src={displayedBrand.logo} />
                    </a>
                  )}
                </div>
              </div>
              {renderAppliedFilters()}
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
