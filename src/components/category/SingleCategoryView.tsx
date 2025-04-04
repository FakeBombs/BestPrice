
import { Category, Product } from '@/data/mockData';
import ProductFilter from '@/components/ProductFilter';
import ProductCard from '@/components/ProductCard';
import CategoryBreadcrumb from './CategoryBreadcrumb';

interface SingleCategoryViewProps {
  category: Category;
  products: Product[];
  rootCategory?: any; // Optional if the category belongs to a root category
  onSortChange: (value: string) => void;
  onVendorFilter: (vendors: string[]) => void;
  onPriceRangeFilter: (min: number, max: number) => void;
  onInStockOnly: (inStockOnly: boolean) => void;
}

const SingleCategoryView = ({ 
  category, 
  products, 
  rootCategory,
  onSortChange,
  onVendorFilter,
  onPriceRangeFilter,
  onInStockOnly
}: SingleCategoryViewProps) => {
  return (
    <>
      <CategoryBreadcrumb category={category} rootCategory={rootCategory} />
      <h1 className="text-3xl font-bold mb-6">
        {category.name}
      </h1>
      
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
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.category} product={product} />
          ))}
        </div>
      )}
    </>
  );
};

export default SingleCategoryView;
