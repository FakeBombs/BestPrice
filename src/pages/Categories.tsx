
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products, getProductsByCategory } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import ProductFilter from '@/components/ProductFilter';

const Categories = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [filteredVendors, setFilteredVendors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const category = categoryId 
    ? categories.find(c => c.id === categoryId) 
    : undefined;
  
  let displayProducts = categoryId 
    ? getProductsByCategory(categoryId) 
    : products;
  
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
  
  return (
    <div className="container py-8">
      {!categoryId ? (
        <>
          <h1 className="text-3xl font-bold mb-8">All Categories</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">
            {category ? category.name : 'Products'}
          </h1>
          
          <ProductFilter 
            onSortChange={setSortOrder}
            onVendorFilter={setFilteredVendors}
            onPriceRangeFilter={(min, max) => console.log(min, max)}
            onInStockOnly={setInStockOnly}
          />
          
          {displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="product-grid">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Categories;
