
import { Product } from '@/services/productService';
import { formatPrice } from '@/utils/formatters';

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  // Calculate savings if there's a discount
  const originalPrice = product.price * 1.15; // Just an example
  const discountAmount = originalPrice - product.price;
  const discountPercent = (discountAmount / originalPrice) * 100;
  
  // Determine if the product has a discount
  const hasDiscount = discountAmount > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6 shadow-sm">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          {hasDiscount && (
            <div className="mb-2 inline-flex px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300 w-fit">
              {discountPercent.toFixed(0)}% έκπτωση
            </div>
          )}
          
          <h1 className="text-2xl font-bold mb-2">{product.title || product.name}</h1>
          
          <div className="text-gray-500 dark:text-gray-400 mb-4 space-y-1">
            {product.brand && (
              <p>
                <span className="font-medium">Κατασκευαστής:</span> {product.brand}
              </p>
            )}
            
            {product.model && (
              <p>
                <span className="font-medium">Μοντέλο:</span> {product.model}
              </p>
            )}
            
            {product.sku && (
              <p>
                <span className="font-medium">Κωδικός προϊόντος:</span> {product.sku}
              </p>
            )}
          </div>
          
          <div className="text-lg font-semibold mt-auto">
            {formatPrice(product.price)}
            {hasDiscount && (
              <span className="text-gray-400 line-through ml-2">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        <div className="border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 md:pl-6 pt-4 md:pt-0">
          <h2 className="text-lg font-medium mb-2">Περιληπτικά</h2>
          
          <ul className="space-y-1 text-gray-600 dark:text-gray-300 mb-4">
            {product.highlights && product.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                {highlight}
              </li>
            ))}
            
            {!product.highlights && (
              <p className="text-gray-500 dark:text-gray-400">{product.description}</p>
            )}
          </ul>
          
          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Διαθέσιμο</span>
              </div>
              
              <div>
                <span>Σε {product.prices?.length || 0} καταστήματα</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
