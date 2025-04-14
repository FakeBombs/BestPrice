import { Product } from '@/data/mockData';

interface ProductHighlightsProps {
  specifications: Record<string, string>;
}

const ProductHighlights = ({ specifications }: ProductHighlightsProps) => {
  return (
    <div class="item-header__content">
      <ul class="item-header__specs-list">
        {Object.entries(specifications).slice(0, 4).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      <li data-no-bullet=""><a class="dotted-link" href="/item/2160473294/samsung-galaxy-a56-8gb-256gb.html#item-specs">Περισσότερα</a></li>
      </ul>
    </div>

    

    
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Highlights</h3>
      <ul className="list-disc list-inside space-y-1 text-sm">
        {Object.entries(specifications).slice(0, 4).map(([key, value]) => (
          <li key={key}>
            <span className="font-medium">{key}:</span> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductHighlights;
