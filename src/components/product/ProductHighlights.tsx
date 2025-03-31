
import { Product } from '@/data/mockData';

interface ProductHighlightsProps {
  specifications: Record<string, string>;
}

const ProductHighlights = ({ specifications }: ProductHighlightsProps) => {
  return (
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
