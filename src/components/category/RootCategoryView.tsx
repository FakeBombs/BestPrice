
import { RootCategory, Category, Product } from '@/data/mockData';
import CategoryCard from '@/components/CategoryCard';
import ProductFilter from '@/components/ProductFilter';
import ProductCard from '@/components/ProductCard';
import CategoryBreadcrumb from './CategoryBreadcrumb';

interface RootCategoryViewProps {
  rootCategory: RootCategory;
  subcategories: Category[];
  products: Product[];
  onSortChange: (value: string) => void;
  onVendorFilter: (vendors: string[]) => void;
  onPriceRangeFilter: (min: number, max: number) => void;
  onInStockOnly: (inStockOnly: boolean) => void;
}

const RootCategoryView = ({ 
  rootCategory, 
  subcategories, 
  products,
  onSortChange,
  onVendorFilter,
  onPriceRangeFilter,
  onInStockOnly 
}: RootCategoryViewProps) => {
  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        <div id="trail"><CategoryBreadcrumb rootCategory={rootCategory} /></div>
        <h1 className="text-3xl font-bold mb-6">{rootCategory.name}</h1>
        <p className="text-muted-foreground mb-8">{rootCategory.description}</p>

        <div class="root-category__categories">
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
        </div>
      
      {/* Products for this root category */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ProductFilter 
          onSortChange={onSortChange}
          onVendorFilter={onVendorFilter}
          onPriceRangeFilter={onPriceRangeFilter}
          onInStockOnly={onInStockOnly}
        />
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="product-grid mt-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default RootCategoryView;
