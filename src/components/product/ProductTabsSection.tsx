
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductSpecTable from '@/components/ProductSpecTable';
import UserReviews from '@/components/UserReviews';
import { Product } from '@/data/mockData';

interface ProductTabsSectionProps {
  product: Product;
}

const ProductTabsSection = ({ product }: ProductTabsSectionProps) => {
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
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu 
              pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="p-4 border rounded-lg mt-4">
          <UserReviews productId={product.id} rating={product.rating} reviewCount={product.reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductTabsSection;
