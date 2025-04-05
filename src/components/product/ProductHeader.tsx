
import { Star, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ProductHeaderProps {
  product: Product;
  onAddToFavorites: () => void;
  onShareProduct: () => void;
}

const ProductHeader = ({ product, onAddToFavorites, onShareProduct }: ProductHeaderProps) => {
  return (
    <>
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <Button onClick={onAddToFavorites} variant="outline" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button onClick={onShareProduct} variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
      
      <div className="flex items-center mb-4">
        <div className="flex items-center text-yellow-400 mr-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-current' : ''}`} />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {product.rating.toFixed(1)} ({product.reviews} reviews)
        </span>
      </div>
    </>
  );
};

export default ProductHeader;
