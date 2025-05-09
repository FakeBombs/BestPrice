import { Star, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/productData';
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
          <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--10">-11%</div></div>
          <div className="p__badge p__badge--sales p__badge--sales p__badge--sales-first">#1 Best Seller</div>
        </div>
        
        <div className="item-title-actions">
          <hgroup className="item-hgroup">
            <h1 itemprop="name" content={product.title} className="item-title">{product.title}</h1>
            <meta itemprop="url" content="/item/2160473294/samsung-galaxy-a56-8gb-256gb.html"/>
          </hgroup>
          <div className="item-actions">
            <div className="item-actions__action item-actions__action--shortlist">
              <svg aria-hidden="true" className="icon" width="16" height="16"><use href="/dist/images/icons/actions.svg#icon-shortlist-16"></use></svg>
            </div>
            <div className="item-actions__action item-actions__action--options">
              <svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
            </div>
          </div>
          <div className="item-links">
            <div className="item-rating">
              <a href="/item/2160473294/samsung-galaxy-a56-8gb-256gb.html#reviews">
                <div className="simple-rating">
                  <div className="simple-rating__inner">
                    <div className="simple-rating__stars">
                      <svg aria-hidden="true" className="icon" width="80" height="16"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                    </div>
                    <div className="simple-rating__rated">
                      <div className="simple-rating__stars">
                        <svg aria-hidden="true" className="icon" width="80" height="16"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
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
    </>
  );
};

export default ProductHeader;
