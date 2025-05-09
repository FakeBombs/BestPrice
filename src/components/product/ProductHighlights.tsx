import { Product } from '@/data/productData';

interface ProductHighlightsProps {
  specifications: Record<string, string>;
  product: Product;
}

const ProductHighlights = ({ specifications, product }: ProductHighlightsProps) => {
  const productId = product.id;
  const productTitle = product.title.toLowerCase().replace(/\s+/g, '-'); // Convert title to lowercase and replace spaces
  
  return (
    <div className="item-header__content">
      <ul className="item-header__specs-list">
        {Object.entries(specifications).slice(0, 8).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
        <li data-no-bullet=""><a className="dotted-link" href={`/item/${productId}/${productTitle}#item-specs`}>Περισσότερα</a></li>
      </ul>
    </div>
  );
};

export default ProductHighlights;
