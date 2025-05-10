import React from 'react';
import { Product } from '@/data/productData';
import { getCategoryById } from '@/data/categoriesData';
import ScrollableSlider from '@/components/ScrollableSlider';
import ProductCard from '@/components/ProductCard';

interface ProductRelatedSectionsProps {
  similarProducts?: Product[];
  categoryDeals?: Product[];
  recentlyViewed?: Product[];
  productId: number;
  currentCategoryName?: string;
}

const ProductRelatedSections: React.FC<ProductRelatedSectionsProps> = ({ similarProducts, categoryDeals, recentlyViewed, productId, currentCategoryName }) => {
  const filteredRecentlyViewed = (recentlyViewed || []).filter(p => p.id !== productId);
  const categoryName = getCategoryById(categoryDeals?.[0]?.categoryIds?.[0])?.name || 'this category';
  const currentSimilarProducts = similarProducts || [];
  const currentCategoryDeals = categoryDeals || [];

  return (
    <>
      {currentSimilarProducts.length > 0 && (
        <section className="section">
          <header className="section__header"> <hgroup className="section__hgroup"> <h2 className="section__title">Παρόμοια προϊόντα</h2> </hgroup> </header>
          <ScrollableSlider>
            <div className="p__products--scroll scroll__content"> {currentSimilarProducts.map(prod => (<ProductCard key={`similar-${prod.id}`} product={prod} />))} </div>
          </ScrollableSlider>
        </section>
      )}

      {currentCategoryDeals.length > 0 && (
        <section id="item-category-deals" className="section">
          <header className="section__header"> 
            <hgroup className="section__hgroup"> 
              <h2 className="section__title">Προσφορές {currentCategoryName ? `σε ${currentCategoryName}` : 'της κατηγορίας'}</h2>
              <p class="section__subtitle">Προϊόντα με μεγάλη πτώση τιμής</p>
            </hgroup> 
          </header>
          <ScrollableSlider>
            <div className="p__products--scroll scroll__content"> {currentCategoryDeals.map(prod => (<ProductCard key={`catdeal-${prod.id}`} product={prod} />))} </div>
          </ScrollableSlider>
        </section>
      )}

      {filteredRecentlyViewed.length > 0 && (
        <section className="section history__products">
          <header className="section__header"> <hgroup className="section__hgroup"> <h2 className="section__title">Είδες πρόσφατα</h2> </hgroup> </header>
          <ScrollableSlider>
            <div className="p__products--scroll scroll__content"> {filteredRecentlyViewed.map(prod => (<ProductCard key={`recent-${prod.id}`} product={prod} />))} </div>
          </ScrollableSlider>
        </section>
      )}
    </>
  );
};

export default ProductRelatedSections;
