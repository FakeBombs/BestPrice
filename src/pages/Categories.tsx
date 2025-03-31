import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  categories, products, getProductsByCategory, 
  rootCategories, getCategoriesByRoot, 
  getRootCategoryBySlug, getProductsByRootCategory 
} from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import RootCategoryCard from '@/components/RootCategoryCard';
import ProductFilter from '@/components/ProductFilter';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

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

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/categories">Categories</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {rootCategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {!categoryId ? (
                  <span className="font-medium">{rootCategory.name}</span>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={`/categories/root/${rootCategory.slug}`}>
                      {rootCategory.name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          )}
          
          {category && (
            <>
              {!rootCategory && <BreadcrumbSeparator />}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="font-medium">{category.name}</span>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };
  
  return (
    <div className="container py-8">
      {/* Show All Root Categories */}
      {!categoryId && !rootCategory && (
        <>
          <h1 className="text-3xl font-bold mb-8">All Categories</h1>
          
          {/* Root Categories */}
          <h2 className="text-2xl font-semibold mb-6">Main Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {rootCategories.map((rootCat) => (
              <RootCategoryCard key={rootCat.id} category={rootCat} />
            ))}
          </div>
          
          {/* Subcategories */}
          <h2 className="text-2xl font-semibold mb-6">All Subcategories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </>
      )}
      
      {/* Show Root Category with its Subcategories */}
      {rootCategory && !categoryId && (
        <>
          {renderBreadcrumbs()}
          <h1 className="text-3xl font-bold mb-6">{rootCategory.name}</h1>
          <p className="text-muted-foreground mb-8">{rootCategory.description}</p>
          
          {/* Subcategories for this root category */}
          {subcategories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {subcategories.map((subCategory) => (
                  <CategoryCard key={subCategory.id} category={subCategory} />
                ))}
              </div>
            </div>
          )}
          
          {/* Products for this root category */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
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
              <div className="product-grid mt-6">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Show Category with Products */}
      {category && (
        <>
          {renderBreadcrumbs()}
          <h1 className="text-3xl font-bold mb-6">
            {category.name}
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
