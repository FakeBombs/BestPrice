
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/services/productService';
import { formatPrice } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ExternalLink } from 'lucide-react';

interface ProductVendorsProps {
  product: Product;
}

const ProductVendors = ({ product }: ProductVendorsProps) => {
  const [showAllVendors, setShowAllVendors] = useState(false);
  
  const prices = product.prices || [];
  // Sort by price
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  
  // Initially show only 5 vendors, show more on button click
  const displayPrices = showAllVendors ? sortedPrices : sortedPrices.slice(0, 5);
  const hasMoreVendors = sortedPrices.length > 5;

  if (prices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Τιμές στα καταστήματα</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Δεν υπάρχουν διαθέσιμες τιμές για αυτό το προϊόν.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Τιμές σε {prices.length} καταστήματα</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayPrices.map((price, index) => (
            <div 
              key={price.id} 
              className={`flex flex-col p-3 rounded-md ${
                index === 0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900' : 
                'border'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${index === 0 ? 'text-green-700 dark:text-green-400' : ''}`}>
                  Vendor {price.vendor_id}
                </span>
                <span className={`text-xl font-bold ${index === 0 ? 'text-green-700 dark:text-green-400' : ''}`}>
                  {formatPrice(price.price)}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className={price.in_stock ? 'text-green-600' : 'text-red-600'}>
                  {price.in_stock ? 'Άμεσα διαθέσιμο' : 'Μη διαθέσιμο'}
                </span>
                
                {price.shipping_cost !== undefined ? (
                  <span>
                    + {formatPrice(price.shipping_cost)} μεταφορικά
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Δωρεάν μεταφορικά
                  </span>
                )}
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  variant={index === 0 ? "default" : "outline"} 
                  size="sm"
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" /> Αγορά
                </Button>
                
                <Button variant="outline" size="sm" className="px-2">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Επίσκεψη καταστήματος</span>
                </Button>
              </div>
            </div>
          ))}
          
          {hasMoreVendors && !showAllVendors && (
            <Button 
              variant="ghost" 
              className="w-full mt-2" 
              onClick={() => setShowAllVendors(true)}
            >
              Δείτε όλα τα καταστήματα ({prices.length})
            </Button>
          )}
          
          {showAllVendors && (
            <Button 
              variant="ghost" 
              className="w-full mt-2" 
              onClick={() => setShowAllVendors(false)}
            >
              Εμφάνιση λιγότερων
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductVendors;
