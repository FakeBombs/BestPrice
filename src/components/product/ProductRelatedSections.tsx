import React from 'react';
import { Product } from '@/data/productData';
import ScrollableSlider from '@/components/ScrollableSlider';
import ProductCard from '@/components/ProductCard';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductRelatedSectionsProps {
  products?: Product[];
  titleKey: string;
  titleOptions?: Record<string, string | number>;
  subtitleKey?: string;
  subtitleOptions?: Record<string, string | number>;
  sectionId?: string; 
}

const ProductRelatedSections: React.FC<ProductRelatedSectionsProps> = ({ products, titleKey, titleOptions, subtitleKey, subtitleOptions, sectionId }) => {
  const { t, language } = useTranslation();

  const currentProducts = products || [];

  if (currentProducts.length === 0) {
    return null;
  }

  const sectionTitle = t(titleKey, titleOptions || {});

  let sectionSubtitle = null;
  if (subtitleKey) {
    const specificSubtitle = t(subtitleKey);
    if (specificSubtitle !== subtitleKey) {
      sectionSubtitle = specificSubtitle;
    } else {
      sectionSubtitle = t('popular_in_category_subtitle_default', '');
    }
  }

  return (
    <section id={sectionId} className="section">
      <header className="section__header">
        <hgroup className="section__hgroup">
          <h2 className="section__title">{sectionTitle}</h2>
          {sectionSubtitle && (
            <p className="section__subtitle">{sectionSubtitle}</p>
          )}
        </hgroup>
      </header>
      <ScrollableSlider>
        <div className="p__products--scroll scroll__content">
          {currentProducts.map(prod => (
            <ProductCard key={`${titleKey}-${prod.id}`} product={prod} /> // Added titleKey to key for more uniqueness
          ))}
        </div>
      </ScrollableSlider>
    </section>
  );
};

export default ProductRelatedSections;
