import ProductCarousel from '@/components/ProductCarousel';
import SimilarProductsSlider from '@/components/SimilarProductsSlider';
import { Product, getCategoryById } from '@/data/mockData';

interface ProductRelatedSectionsProps {
  similarProducts: Product[];
  categoryDeals: Product[];
  recentlyViewed: Product[];
  productId: number;
}

const ProductRelatedSections = ({ 
  similarProducts, 
  categoryDeals, 
  recentlyViewed,
  productId
}: ProductRelatedSectionsProps) => {
  const category = categoryDeals.length > 0 ? getCategoryById(categoryDeals[0].categoryIds[0])?.name : 'this category';
  return (
    <>
      {/* Similar Products */}
      <SimilarProductsSlider title="Similar Products" products={similarProducts} />
      
      {/* Deals in this Category */}
      <ProductCarousel 
        title={`Deals in ${category}`} 
        products={categoryDeals} 
        emptyMessage="No deals found in this category"
      />
      
      {/* Recently Viewed Products */}
      <ProductCarousel 
        title="Recently Viewed" 
        products={recentlyViewed.filter(p => p.id !== productId)} 
        emptyMessage="No recently viewed products"
      />
    </>
  );
};

export default ProductRelatedSections;
