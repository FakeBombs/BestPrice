import { Product } from '@/data/mockData';

interface ProductHighlightsProps {
  specifications: Record<string, string>;
}

const ProductHighlights = ({ specifications }: ProductHighlightsProps) => {
  return (
    <div className="item-header__content">
      <ul className="item-header__specs-list">
        {Object.entries(specifications).slice(0, 4).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
        <li data-no-bullet=""><a className="dotted-link" href="/item/2160473294/samsung-galaxy-a56-8gb-256gb.html#item-specs">Περισσότερα</a></li>
      </ul>
    </div>
  );
};

export default ProductHighlights;
