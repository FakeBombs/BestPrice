
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductSpecTable from '@/components/ProductSpecTable';
import UserReviews from '@/components/UserReviews';
import { Product } from '@/data/mockData';

interface ProductTabsSectionProps {
  product: Product;
}

const ProductTabsSection = ({ product }: ProductTabsSectionProps) => {
  // Convert number to string if needed for compatibility
  const productId = typeof product.id === 'number' ? String(product.id) : product.id;
  const reviewCount = product.reviews || product.reviewCount || 0;
  
  return (
    <div className="mt-12">
      <Tabs defaultValue="specifications">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="specifications" className="p-4 border rounded-lg mt-4">
          <ProductSpecTable specifications={product.specifications} />
        </TabsContent>
        <TabsContent value="description" className="p-4 border rounded-lg mt-4">
          <h3 className="text-xl font-medium mb-4">Product Description</h3>
          <div className="prose max-w-none">
            <p className="mb-4">{product.description}</p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="p-4 border rounded-lg mt-4">
          <UserReviews productId={productId} rating={product.rating} reviewCount={reviewCount} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductTabsSection;
