
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

      <div className="item-meta">
        <div className="item-badges">
          <div className="p__badges-drop">
            <div className="p__badge p__badge--drop drop drop--10">-11%</div>
          </div>
          <div className="p__badge p__badge--sales p__badge--sales p__badge--sales-first">#1 Best Seller</div>
        </div>
        
        <div className="item-title-actions">
          <hgroup className="item-hgroup">
            <h1 itemprop="name" content={product.title} className="item-title">{product.title}</h1>
            <meta itemprop="url" content="/item/2160473294/samsung-galaxy-a56-8gb-256gb.html"/>
          </hgroup>
          <div className="item-actions">
            <div className="item-actions__action item-actions__action--shortlist">
              <svg aria-hidden="true" className="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/actions.svg#icon-shortlist-16"></use></svg>
            </div>
            <div className="item-actions__action item-actions__action--options">
              <svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
            </div>
          </div>
          <div className="item-links">
            <div className="item-rating">
              <a href="/item/2160473294/samsung-galaxy-a56-8gb-256gb.html#reviews">
                <div className="simple-rating">
                  <div className="simple-rating__inner">
                    <div className="simple-rating__stars">
                      <svg aria-hidden="true" className="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                    </div>
                    <div className="simple-rating__rated">
                      <div className="simple-rating__stars">
                        <svg aria-hidden="true" className="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                      </div>
                    </div>
                  </div>
                  <div className="simple-rating__total">({product.reviews})</div>
                </div>
              </a>
              
              <a data-review-src="cluster-header" className="item-link__review dotted-link" href="/item/2160473294/samsung-galaxy-a56-8gb-256gb/review">Αξιολόγησέ το</a>
            </div>
            <a className="item-link__qna dotted-link" href="/item/2160473294/samsung-galaxy-a56-8gb-256gb.html#qna">Κάνε ερώτηση</a>
            <a className="item-link__graph dotted-link" href="/item/2160473294/samsung-galaxy-a56-8gb-256gb.html#graph">Γράφημα τιμής</a>
          </div>
        </div>
      </div>

      
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
