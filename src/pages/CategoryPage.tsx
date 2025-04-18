import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products as allProducts, mainCategories } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';
import { Link } from 'react-router-dom';

const CategoryPage: React.FC = () => {
  const { rootCategorySlug } = useParams<{ rootCategorySlug: string }>();
  const [activeFilters, setActiveFilters] = useState({ vendors: [], brands: [], specs: {}, inStockOnly: false });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
  const [availableBrands, setAvailableBrands] = useState({});
  const [availableSpecs, setAvailableSpecs] = useState({});
  const [sortType, setSortType] = useState('rating-desc');

  // Find the main category matching the rootCategorySlug using slug
  const mainCategory = mainCategories.find(cat => cat.slug === rootCategorySlug);

  if (!mainCategory) {
    return <h1>Category Not Found</h1>;
  }

  // Fetch subcategories
  const subcategories = categories.filter(cat => cat.parentId === mainCategory.id);

  // If there are subcategories, display them
  if (subcategories.length > 0) {
    return (
      <div className="root__wrapper">
        <div className="root">
          <div className="page-products">
            <header className="page-header">
              <h1>{mainCategory.name}</h1>
              <div className="subcategories">
                {subcategories.map(subcategory => (
                  <Link key={subcategory.id} to={`/cat/${subcategory.slug}.html`}>
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </header>
          </div>
        </div>
      </div>
    );
  }

  // If no subcategories, show products
  const products = allProducts.filter(product => product.categoryIds.includes(mainCategory.id));

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
        vendors.add(product.vendor);
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

    setAvailableVendors(Array.from(vendors));
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
        <div className="page-products">
          <aside id="filters-aside" className="page-products__filters">
          {/* Existing filters logic here … */}
          </aside>
          <main>
            <header className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{mainCategory.name}</h1>
                  <div>{filteredProducts.length} products</div>
                </div>
              </div>
              {renderAppliedFilters()}
              <div className="page-header__sorting">
                {/* Sorting tabs here … */}
              </div>
            </header>
            {filteredProducts.length === 0 ? (<p>No products found matching your search.</p>) : (
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
