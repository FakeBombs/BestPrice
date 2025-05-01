
import { Star } from "lucide-react";
import { Product } from "@/data/mockData";

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  // Determine if we should use name or title property
  const productTitle = product.title || product.name;
  const reviewCount = product.reviews || product.reviewCount || 0;

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div className="flex-1">
          {/* Product title */}
          <h1 
            itemProp="name" 
            content={productTitle} 
            className="text-2xl md:text-3xl font-bold"
          >
            {productTitle}
          </h1>
          <meta itemProp="brand" content={product.brand} />
          
          {/* Brand & SKU info */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-2">
            <span className="font-medium">{product.brand}</span>
            {product.model && (
              <>
                <span className="inline-block mx-1">•</span>
                <span>Model: {product.model}</span>
              </>
            )}
            {product.sku && (
              <>
                <span className="inline-block mx-1">•</span>
                <span>SKU: {product.sku}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center mt-2 md:mt-0">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground ml-1">
            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
