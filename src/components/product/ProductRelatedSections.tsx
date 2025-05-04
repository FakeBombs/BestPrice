import React from 'react';
import { Product, getCategoryById } from '@/data/mockData';
import ScrollableSlider from '@/components/ScrollableSlider';
import ProductCard from '@/components/ProductCard';

interface ProductRelatedSectionsProps {
  similarProducts?: Product[];
  categoryDeals?: Product[];
  recentlyViewed?: Product[];
  productId: number;
}

const ProductRelatedSections: React.FC<ProductRelatedSectionsProps> = ({ similarProducts, categoryDeals, recentlyViewed, productId }) => {
  const filteredRecentlyViewed = (recentlyViewed || []).filter(p => p.id !== productId);
  const categoryName = getCategoryById(categoryDeals?.[0]?.categoryIds?.[0])?.name || 'this category';
  const currentSimilarProducts = similarProducts || [];
  const currentCategoryDeals = categoryDeals || [];

  return (
    <>
            {currentSimilarProducts.length > 0 && (
              <div className="item-related sections">
                <section className="section">
                    <header className="section__header"> <hgroup className="section__hgroup"> <h2 className="section__title">Παρόμοια προϊόντα</h2> </hgroup> </header>
                    <ScrollableSlider>
                       <div className="p__products--scroll scroll__content">
                           {currentSimilarProducts.map(prod => (<ProductCard key={`similar-${prod.id}`} product={prod} />))}
                       </div>
                    </ScrollableSlider>
                </section>
              </div>
            )}

            {currentCategoryDeals.length > 0 && (
              <div className="item-related sections">
                 <section className="section">
                    <header className="section__header"> <hgroup className="section__hgroup"> <h2 className="section__title">Προσφορές κατηγορίας</h2> </hgroup> </header>
                     <ScrollableSlider>
                       <div className="p__products--scroll scroll__content">
                          {currentCategoryDeals.map(prod => (<ProductCard key={`catdeal-${prod.id}`} product={prod} />))}
                       </div>
                    </ScrollableSlider>
                 </section>
              </div>
            )}

            {filteredRecentlyViewed.length > 0 && (
              <div className="item-related sections">
                <section className="section">
                    <header className="section__header"> <hgroup className="section__hgroup"> <h2 className="section__title">Είδες πρόσφατα</h2> </hgroup> </header>
                     <ScrollableSlider>
                       <div className="p__products--scroll scroll__content">
                           {filteredRecentlyViewed.map(prod => (<ProductCard key={`recent-${prod.id}`} product={prod} />))}
                        </div>
                    </ScrollableSlider>
                </section>
              </div>
            )}
        </>
  );
};

export default ProductRelatedSections;
