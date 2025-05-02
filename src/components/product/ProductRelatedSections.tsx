
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Product } from '@/services/productService';
import ProductCarousel from '../ProductCarousel';

interface ProductRelatedSectionsProps {
  productId: string | number;
  similarProducts: Product[];
  categoryDeals: Product[];
  recentlyViewed: Product[];
}

const ProductRelatedSections = ({
  productId,
  similarProducts,
  categoryDeals,
  recentlyViewed,
}: ProductRelatedSectionsProps) => {
  // Convert productId to string for comparison
  const productIdStr = String(productId);
  
  // Filter out the current product from recentlyViewed
  const filteredRecentlyViewed = recentlyViewed.filter(p => String(p.id) !== productIdStr);

  return (
    <div className="my-12">
      <Tabs defaultValue="similar" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="similar">Similar Products</TabsTrigger>
          <TabsTrigger value="deals">Category Deals</TabsTrigger>
          <TabsTrigger value="viewed">Recently Viewed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="similar">
          {similarProducts.length > 0 ? (
            <ProductCarousel 
              title="Similar Products" 
              products={similarProducts} 
            />
          ) : (
            <p className="text-center text-muted-foreground py-10">No similar products found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="deals">
          {categoryDeals.length > 0 ? (
            <ProductCarousel 
              title="Category Deals" 
              products={categoryDeals} 
            />
          ) : (
            <p className="text-center text-muted-foreground py-10">No deals available for this category.</p>
          )}
        </TabsContent>
        
        <TabsContent value="viewed">
          {filteredRecentlyViewed.length > 0 ? (
            <ProductCarousel 
              title="Recently Viewed" 
              products={filteredRecentlyViewed} 
            />
          ) : (
            <p className="text-center text-muted-foreground py-10">No recently viewed products.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductRelatedSections;
