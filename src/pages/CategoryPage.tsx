import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products as allProducts, rootCategories } from '@/data/mockData'; // Adjust the path as needed
import ProductCard from '@/components/ProductCard'; // Adjust the path based on your project structure
import ScrollableSlider from '@/components/ScrollableSlider'; // Import the slider component

const CategoryPage: React.FC = () => {
  const { rootCategorySlug } = useParams<{ rootCategorySlug: string }>();
  const [activeFilters, setActiveFilters] = useState({ vendors: [], brands: [], specs: {}, inStockOnly: false });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
  const [availableBrands, setAvailableBrands] = useState({});
  const [availableSpecs, setAvailableSpecs] = useState({});
  const [sortType, setSortType] = useState('rating-desc');

  // Find the root category based on the slug
  const rootCategory = categories.find(category => category.slug === rootCategorySlug);

  // If the root category is not found, handle it with a not found message
  if (!rootCategory) {
    return <h1>Category Not Found</h1>;
  }

  // Filter products based on the root category
  const products = allProducts.filter(product => product.categoryId === rootCategory.id);

  useEffect(() => {
    const sortedResults = sortProducts(products);
    setFilteredProducts(sortedResults);
    extractAvailableFilters(sortedResults);
  }, [products]);

  useEffect(() => {
    filterProducts(activeFilters.vendors, activeFilters.brands, activeFilters.specs, activeFilters.inStockOnly, products);
  }, [activeFilters, sortType, products]);

  const extractAvailableFilters = (results) => {
    const vendors = new Set();
    const brandsCount = {};
    const specs = {};

    results.forEach((product) => {
      if (product.vendor) {
        vendors.add(product.vendor); // Collect unique vendors
      }
      if (product.brand) {
        brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1;
      }
      Object.keys(product.specifications).forEach((specKey) => {
        if (!specs[specKey]) {
          specs[specKey] = new Set();
        }
        specs[specKey].add(product.specifications[specKey]);
      });
    });

    setAvailableVendors(Array.from(vendors)); // Store vendors as an array
    setAvailableBrands(brandsCount);
    setAvailableSpecs(specs);
  };

  const filterProducts = (vendors, brands, specs, inStockOnly, results) => {
    let filtered = results;

    if (inStockOnly) {
      filtered = filtered.filter((product) => product.prices.some((price) => price.inStock));
    }

    if (vendors.length > 0) {
      filtered = filtered.filter((product) => vendors.includes(product.vendor));
    }

    if (brands.length > 0) {
      filtered = filtered.filter((product) => brands.includes(product.brand));
    }

    if (Object.keys(specs).length > 0) {
      filtered = filtered.filter((product) => {
        return Object.entries(specs).every(([key, values]) => {
          return values.includes(product.specifications[key]);
        });
      });
    }

    filtered = sortProducts(filtered);
    setFilteredProducts(filtered);
    extractAvailableFilters(filtered);
  };

  const sortProducts = (products) => {
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

  const handleVendorFilter = (vendor) => {
    const newVendors = activeFilters.vendors.includes(vendor)
      ? activeFilters.vendors.filter((v) => v !== vendor)
      : [...activeFilters.vendors, vendor];

    setActiveFilters((prev) => ({ ...prev, vendors: newVendors }));
  };

  const handleBrandFilter = (brand) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter((b) => b !== brand)
      : [...activeFilters.brands, brand];

    setActiveFilters((prev) => ({ ...prev, brands: newBrands }));
  };

  const handleSpecFilter = (specKey, specValue) => {
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

  const renderAppliedFilters = () => {
    return (
      (activeFilters.brands.length > 0 || Object.keys(activeFilters.specs).some(specKey => activeFilters.specs[specKey].length > 0)) && (
        <div className="applied-filters">
          {activeFilters.brands.map((brand) => (
            <h2 className="applied-filters__filter" key={brand}>
              <a onClick={() => handleBrandFilter(brand)}>
                <span className="applied-filters__label">{brand}</span>
              </a>
            </h2>
          ))}
          {Object.entries(activeFilters.specs).map(([specKey, specValues]) =>
            specValues.map((specValue) => (
              <h2 className="applied-filters__filter" key={`${specKey}-${specValue}`}>
                <a onClick={() => handleSpecFilter(specKey, specValue)}>
                  <span className="applied-filters__label">{`${specKey}: ${specValue}`}</span>
                </a>
              </h2>
            ))
          )}
        </div>
      )
    );
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div class="page-products">
          <aside id="filters-aside" class="page-products__filters"></aside>
          <main>
            <header className="page-header">
              <div className="page-header__title">
                <h1>{rootCategory.name}</h1>
                <div>{filteredProducts.length} products</div>
              </div>
              <ScrollableSlider></ScrollableSlider>
              {renderAppliedFilters()}
        <div className="page-header__sorting">
          <button onClick={() => setSortType('rating-desc')}>Sort by Rating</button>
          <button onClick={() => setSortType('price-asc')}>Sort by Price: Low to High</button>
          <button onClick={() => setSortType('price-desc')}>Sort by Price: High to Low</button>
        </div>
            </header>

      <div class="page-products__main-wrapper page-products__main-wrapper">
        <div class="page-products__products">
        {filteredProducts.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
