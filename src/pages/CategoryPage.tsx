import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '@/data/mockData'; // Adjust import paths as necessary
import ProductCard from '@/components/ProductCard'; // Adjust the import path

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string; slug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState({
    vendors: [],
    brands: [],
    specs: {},
    inStockOnly: false,
  });
  const [availableVendors, setAvailableVendors] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<Record<string, number>>({});
  const [availableSpecs, setAvailableSpecs] = useState<Record<string, Set<string>>>({});
  const [sortType, setSortType] = useState('rating-desc'); // Default sort type

  useEffect(() => {
    const subCategoryId = parseInt(categoryId);
    const subCategory = categories.find(cat => cat.id === subCategoryId);

    if (subCategory) {
      setCurrentCategory(subCategory);
      const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategoryId));
      setFilteredProducts(productsToDisplay);
      extractAvailableFilters(productsToDisplay); // Extract filters using products directly
    }
  }, [categoryId]); // Removed slug since it's not needed for filtering or fetching categories

  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  const productsToDisplay = filteredProducts;

  useEffect(() => {
    filterProducts(activeFilters.vendors, activeFilters.brands, activeFilters.specs, activeFilters.inStockOnly, productsToDisplay);
  }, [activeFilters, productsToDisplay]); // Ensure active filters are applied on products to display

  const extractAvailableFilters = (results) => {
    const vendors = new Set();
    const brandsCount: Record<string, number> = {};
    const specs: Record<string, Set<string>> = {};

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
          <aside className="page-products__filters">
                        <div id="filters">
                            <div className="filters__categories" data-filter-name="categories">
                                <div className="filters__header">
                                    <div className="filters__header-title filters__header-title--filters">Κατηγορίες</div>
                                </div>
                                <ol>
                                    {availableCategories.slice(0, showMoreCategories ? availableCategories.length : 8).map((item) => (
                                        <li key={item.id}>
                                            <Link to={`/cat/${item.id}/${item.slug}.html`}>
                                                <span>{item.category} ({item.count})</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ol>
                                {availableCategories.length > 8 && (
                                    <div className="filters-more-prompt" onClick={() => setShowMoreCategories((prev) => !prev)} title="Show all categories">
                                        <svg aria-hidden="true" className="icon" width="100%" height="100%">
                                            <use xlinkHref="/public/dist/images/icons/icons.svg#icon-plus-more"></use>
                                        </svg>
                                        Show all
                                    </div>
                                )}
                            </div>

                            {availableVendors.length > 0 && (
                                <div className="filter-vendor default-list">
                                    <div className="filter__header"><h4>Vendors</h4></div>
                                    <div className="filter-container">
                                        <ol>
                                            {availableVendors.map((vendor) => (
                                                <li key={vendor} className={activeFilters.vendors.includes(vendor) ? 'selected' : ''} onClick={() => handleVendorFilter(vendor)}>
                                                    <span>{vendor}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            )}

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

                            {Object.keys(availableSpecs).length > 0 && (
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
                                ))
                            )}

                            <div className="filter-in-stock default-list">
                                <div className="filter__header"><h4>In Stock</h4></div>
                                <div className="filter-container">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={activeFilters.inStockOnly}
                                            onChange={() => {
                                                const newInStockOnly = !activeFilters.inStockOnly;
                                                setActiveFilters((prev) => ({ ...prev, inStockOnly: newInStockOnly }));
                                                filterProducts(activeFilters.vendors, activeFilters.brands, activeFilters.specs, newInStockOnly, products);
                                            }} 
                                        />
                                        Show only in-stock products
                                    </label>
                                </div>
                            </div>
                            <button className="button button--outline" id="filters__scrollback"><svg className="icon" aria-hidden="true" width="12" height="12"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-up-12"></use></svg><div>Φίλτρα</div></button>
                        </div>
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
              {/* Put sorting tabs logic here if necessary */}
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
