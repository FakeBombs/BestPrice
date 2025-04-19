import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string; slug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState<string>('rating-desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // New state for filter options
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]); // Example price range (min and max)
  const [brandFilter, setBrandFilter] = useState<string[]>([]); // Example brand filter

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const subCategoryId = parseInt(categoryId);
        const subCategory = categories.find(cat => cat.id === subCategoryId);
        
        if (!subCategory) {
          throw new Error("Category not found");
        }

        setCurrentCategory(subCategory);
        const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategoryId));
        
        if (productsToDisplay.length === 0) {
          throw new Error("No products found for this category");
        }

        setFilteredProducts(productsToDisplay);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(prev => prev.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.price >= priceRange[0] && product.price <= priceRange[1] // Filter by price range if needed
      ));
    }
  }, [searchTerm, priceRange]); // Re-run if search term or price range changes

  const sortProducts = (productsToSort: Product[], sortType: string) => {
    switch (sortType) {
      case 'price-asc':
        return [...productsToSort].sort((a, b) => a.prices[0].price - b.prices[0].price);
      case 'price-desc':
        return [...productsToSort].sort((a, b) => b.prices[0].price - a.prices[0].price);
      case 'rating-desc':
      default:
        return [...productsToSort].sort((a, b) => b.rating - a.rating);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(event.target.value);
  };

  const sortedProducts = sortProducts(filteredProducts, sortType);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  if (sortedProducts.length === 0) {
    return <p>No products found in this category.</p>;
  }

  return (
    <div className="root__wrapper">
      <h2>{currentCategory.name}</h2>
      
      {/* Filter Sidebar */}
      <aside className="filter-sidebar">
        <h3>Filters</h3>
        <div>
          <label>
            Price Range:
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            />
          </label>
        </div>
        <div>
          <h4>Brand</h4>
          {/* Dummy checkboxes for brand filtering */}
          <label>
            <input
              type="checkbox"
              checked={brandFilter.includes('BrandA')}
              onChange={() => setBrandFilter(prev => 
                prev.includes('BrandA') ? prev.filter(b => b !== 'BrandA') : [...prev, 'BrandA']
              )}
            />
            Brand A
          </label>
          <label>
            <input
              type="checkbox"
              checked={brandFilter.includes('BrandB')}
              onChange={() => setBrandFilter(prev => 
                prev.includes('BrandB') ? prev.filter(b => b !== 'BrandB') : [...prev, 'BrandB']
              )}
            />
            Brand B
          </label>
        </div>
      </aside>

      <div>
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortType} onChange={handleSortChange}>
          <option value="rating-desc">Sort by Rating (High to Low)</option>
          <option value="price-asc">Sort by Price (Low to High)</option>
          <option value="price-desc">Sort by Price (High to Low)</option>
        </select>
      </div>

      <div className="products-grid">
        {sortedProducts.map(product => (
          <div key={product.id}>
            <ProductCard product={product} />
            {/* Intentionally causing a possible error for testing */}
            {causingReferenceError} {/* This line contains an intentional error */}
          </div>
        ))}
      </div>
      
      <footer>
        <p>For more information about this category, visit the <a href={`/category/${categoryId}/info`}>info page</a>.</p>
      </footer>
    </div>
  );
};

export default CategoryPage;
