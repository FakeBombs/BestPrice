import ProductCarousel from '@/components/ProductCarousel';
import SimilarProductsSlider from '@/components/SimilarProductsSlider';
import { Product, getCategoryById } from '@/data/mockData';
import ScrollableSlider from '@/components/ScrollableSlider';

interface ProductRelatedSectionsProps {
  similarProducts: Product[];
  categoryDeals: Product[];
  recentlyViewed: Product[];
  productId: number;
}

const ProductRelatedSections: React.FC<ProductRelatedSectionsProps> = ({ similarProducts, categoryDeals, recentlyViewed, productId }) => {
  const filteredRecentlyViewed = recentlyViewed.filter(p => p.id !== productId);
  const category = categoryDeals.length > 0 ? getCategoryById(categoryDeals[0].categoryIds[0])?.name : 'this category';
  return (
    <div className="item-related sections">
            {similarProducts && similarProducts.length > 0 && (
                <section className="section">
                    <header className="section__header"> <hgroup className="section__hgroup"> <h2 className="section__title">Παρόμοια προϊόντα</h2> </hgroup> </header>
                    <ScrollableSlider>
                        {similarProducts.map(prod => (<ProductCard key={`similar-${prod.id}`} product={prod} />))}
                    </ScrollableSlider>
                </section>
            )}

            {categoryDeals && categoryDeals.length > 0 && (
                 <section className="section">
                    <header className="section__header"> <hgroup className="section__hgroup"> <h2 className="section__title">Προσφορές κατηγορίας</h2> </hgroup> </header>
                    <ScrollableSlider>
                        {categoryDeals.map(prod => (<ProductCard key={`catdeal-${prod.id}`} product={prod} />))}
                    </ScrollableSlider>
                 </section>
            )}

            {filteredRecentlyViewed && filteredRecentlyViewed.length > 0 && (
                <section className="section">
                    <header className="section__header"> <hgroup className="section__hgroup"> <h2 className="section__title">Είδες πρόσφατα</h2> </hgroup> </header>
                    <ScrollableSlider>
                        {filteredRecentlyViewed.map(prod => (<ProductCard key={`recent-${prod.id}`} product={prod} />))}
                    </ScrollableSlider>
                </section>
            )}
        </div>
  );
};

export default ProductRelatedSections;
