import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Product, getBestPrice, getVendorById } from '@/data/mockData';
interface ProductCardProps {
  product: Product;
}
const ProductCard = ({
  product
}: ProductCardProps) => {
  const bestPrice = getBestPrice(product);
  const vendorCount = product.prices.filter(p => p.inStock).length;
  return <Card className="overflow-hidden h-full transition-all hover:shadow-md bg-[#26282c]">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform hover:scale-105" />
        </div>
        <CardContent className="p-4">
          <div className="flex items-center space-x-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          <h3 className="font-medium line-clamp-2 mb-2">{product.title}</h3>
          
          {bestPrice && <div className="mt-2">
              <div className="price-tag">${bestPrice.price.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground mt-1">
                from {vendorCount} {vendorCount === 1 ? 'vendor' : 'vendors'}
              </div>
            </div>}
        </CardContent>
      </Link>
    </Card>;
};
export default ProductCard;