
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, PackageCheck, PackageX, TruckDelivery } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { vendors } from '@/data/mockData';
import { Product, ProductPrice } from '@/services/productService';
import { formatPrice } from '@/utils/formatters';

interface ProductVendorsProps {
  product: Product;
  className?: string;
}

const ProductVendors = ({ product, className = "" }: ProductVendorsProps) => {
  if (!product.prices || product.prices.length === 0) {
    return (
      <div className={`rounded-lg border p-4 ${className}`}>
        <p className="text-center text-muted-foreground">No vendor information available</p>
      </div>
    );
  }

  // Sort prices - in stock first, then by price
  const sortedPrices = [...product.prices].sort((a, b) => {
    // First by availability
    const aInStock = a.inStock || a.in_stock;
    const bInStock = b.inStock || b.in_stock;
    
    if (aInStock && !bInStock) return -1;
    if (!aInStock && bInStock) return 1;
    
    // Then by price
    return a.price - b.price;
  });

  return (
    <div className={`rounded-lg border ${className}`}>
      <div className="bg-muted px-4 py-3 border-b">
        <h2 className="text-lg font-medium">Available from {sortedPrices.length} vendors</h2>
      </div>
      
      <div className="divide-y">
        {sortedPrices.map((price, index) => {
          // Find vendor data
          const vendorId = price.vendorId || price.vendor_id;
          const vendor = vendors.find(v => v.id === vendorId);
          
          // Check availability
          const isInStock = price.inStock || price.in_stock;
          
          // Calculate total price
          const shippingCost = price.shippingCost || price.shipping_cost || 0;
          const totalPrice = price.price + (shippingCost || 0);
          
          return (
            <div key={index} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {vendor && (
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center border rounded bg-white">
                    <img src={vendor.logo} alt={vendor.name} className="max-w-full max-h-full p-1" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {vendor ? vendor.name : "Unknown Vendor"}
                    {vendor?.certification && (
                      <Badge variant="outline" className="ml-2">
                        {vendor.certification}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    {isInStock ? (
                      <>
                        <PackageCheck className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">In stock</span>
                      </>
                    ) : (
                      <>
                        <PackageX className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Out of stock</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <div className="text-xl font-bold">{formatPrice(price.price)}</div>
                  {(shippingCost > 0) && (
                    <div className="flex items-center text-sm text-muted-foreground gap-1">
                      <TruckDelivery className="w-4 h-4" />
                      <span>+ {formatPrice(shippingCost)} shipping</span>
                    </div>
                  )}
                  {(shippingCost === 0) && (
                    <div className="flex items-center text-sm text-green-600 gap-1">
                      <TruckDelivery className="w-4 h-4" />
                      <span>Free shipping</span>
                    </div>
                  )}
                </div>
                
                <Button asChild className="gap-1">
                  <Link to={vendor?.website || "#"} target="_blank" rel="noopener noreferrer">
                    <span>Visit Store</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVendors;
