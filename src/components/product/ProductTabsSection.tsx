
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockReviews } from "../reviews/mockData";
import ReviewsList from "../reviews/ReviewsList";

interface ProductTabsSectionProps {
  product: {
    id: string | number;
    name: string;
    description: string;
    specifications?: Record<string, string>; 
    highlights?: string[];
    [key: string]: any;
  };
}

const ProductTabsSection = ({ product }: ProductTabsSectionProps) => {
  // Convert product id to string for comparison with review productId
  const productIdString = String(product.id);
  
  // Filter reviews for this product
  const productReviews = mockReviews.filter(review => review.productId === productIdString);
  
  // Handlers for review actions
  const handleVote = (reviewId: string, isHelpful: boolean) => {
    console.log('Vote recorded:', reviewId, isHelpful ? 'helpful' : 'not helpful');
    // Implementation would go here in a real app
  };
  
  const handleWriteReview = () => {
    console.log('Write review for product:', product.id);
    // Implementation would go here in a real app
  };
  
  return (
    <div className="my-8">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid grid-cols-4 max-w-2xl">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
          <TabsTrigger value="related">Related</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="pt-6">
          <div className="prose max-w-none">
            <p>{product.description}</p>
            
            {product.highlights && product.highlights.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mt-4 mb-2">Highlights</h3>
                <ul>
                  {product.highlights.map((highlight: string, index: number) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="pt-6">
          {product.specifications ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
                        {key}
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 w-2/3">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No specifications available for this product.</p>
          )}
        </TabsContent>
        
        <TabsContent value="reviews" className="pt-6">
          {productReviews.length > 0 ? (
            <ReviewsList 
              reviews={productReviews}
              onVote={handleVote}
              onWriteReview={handleWriteReview}
            />
          ) : (
            <p className="text-muted-foreground">No reviews available for this product yet.</p>
          )}
        </TabsContent>
        
        <TabsContent value="related" className="pt-6">
          <p className="text-muted-foreground">Related products will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductTabsSection;
