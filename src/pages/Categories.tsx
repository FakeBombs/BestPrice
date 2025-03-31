
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  categories, products, getProductsByCategory, 
  rootCategories, getCategoriesByRoot, 
  getRootCategoryBySlug, getProductsByRootCategory 
} from '@/data/mockData';
import AllCategoriesView from '@/components/category/AllCategoriesView';
import RootCategoryView from '@/components/category/RootCategoryView';
import SingleCategoryView from '@/components/category/SingleCategoryView';

const Categories = () => {
  const { categoryId, rootSlug } = useParams<{ categoryId?: string; rootSlug?: string }>();
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [filteredVendors, setFilteredVendors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Handle regular category view
  const category = categoryId 
    ? categories.find(c => c.id === categoryId) 
    : undefined;
  
  // Handle root category view
  const rootCategory = rootSlug
    ? rootCategories.find(rc => rc.slug === rootSlug)
    : undefined;
  
  // Determine which products to display
  let displayProducts = [];
  if (categoryId) {
    // Regular category view
    displayProducts = getProductsByCategory(categoryId);
  } else if (rootCategory) {
    // Root category view - get all products from all subcategories
    displayProducts = getProductsByRootCategory(rootCategory.id);
  } else {
    // Homepage view - show all products
    displayProducts = products;
  }
  
  // Get subcategories for a root category
  const subcategories = rootCategory 
    ? getCategoriesByRoot(rootCategory.id)
    : [];
  
  // Apply vendor filter
  if (filteredVendors.length > 0) {
    displayProducts = displayProducts.filter(product => 
      product.prices.some(price => 
        filteredVendors.includes(price.vendorId)
      )
    );
  }
  
  // Apply in-stock filter
  if (inStockOnly) {
    displayProducts = displayProducts.filter(product => 
      product.prices.some(price => price.inStock)
    );
  }
  
  // Apply sorting
  displayProducts = [...displayProducts].sort((a, b) => {
    const aPrice = Math.min(...a.prices.map(p => p.price));
    const bPrice = Math.min(...b.prices.map(p => p.price));
    
    switch (sortOrder) {
      case 'price-asc':
        return aPrice - bPrice;
      case 'price-desc':
        return bPrice - aPrice;
      case 'rating-desc':
        return b.rating - a.rating;
      case 'reviews-desc':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });
  
  // Handle filter changes
  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };
  
  const handleVendorFilter = (vendors: string[]) => {
    setFilteredVendors(vendors);
  };
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    console.log(min, max);
  };
  
  const handleInStockOnly = (inStock: boolean) => {
    setInStockOnly(inStock);
  };
  
  return (
    <div className="container py-8">
      {/* Show All Root Categories */}
      {!categoryId && !rootCategory && (
        <AllCategoriesView 
          rootCategories={rootCategories} 
          categories={categories} 
        />
      )}
      
      {/* Show Root Category with its Subcategories */}
      {rootCategory && !categoryId && (
        <RootCategoryView 
          rootCategory={rootCategory}
          subcategories={subcategories}
          products={displayProducts}
          onSortChange={handleSortChange}
          onVendorFilter={handleVendorFilter}
          onPriceRangeFilter={handlePriceRangeFilter}
          onInStockOnly={handleInStockOnly}
        />
      )}
      
      {/* Show Category with Products */}
      {category && (
        <SingleCategoryView 
          category={category}
          products={displayProducts}
          rootCategory={rootCategory}
          onSortChange={handleSortChange}
          onVendorFilter={handleVendorFilter}
          onPriceRangeFilter={handlePriceRangeFilter}
          onInStockOnly={handleInStockOnly}
        />
      )}
    </div>
  );
};

export default Categories;
