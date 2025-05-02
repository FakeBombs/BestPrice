
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/formatters';
import { Product } from '@/services/productService';

interface SearchDropdownProps {
  results: Product[];
  isOpen: boolean;
  onResultClick: () => void;
  onViewAllResults: () => void;
  searchTerm: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  results,
  isOpen,
  onResultClick,
  onViewAllResults,
  searchTerm,
}) => {
  if (!isOpen || results.length === 0) {
    return null;
  }

  return (
    <div className="search__results">
      <div className="search__title">Quick Results</div>
      <div className="search__items">
        {results.map((product) => (
          <Link
            key={product.id}
            to={`/item/${product.id}/${product.slug}`}
            className="search__item"
            onClick={onResultClick}
          >
            <div className="search__item-image">
              <img src={product.imageUrl || product.image || product.image_url || '/placeholder.svg'} alt={product.name} />
            </div>
            <div className="search__item-details">
              <div className="search__item-name">{product.name}</div>
              <div className="search__item-category">
                {product.category || 
                 (product.categoryIds && product.categoryIds.length > 0 
                  ? `Category ID: ${product.categoryIds[0]}` 
                  : 'Unknown Category')}
              </div>
              <div className="search__item-price">{formatPrice(product.price)}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="search__footer">
        <button className="search__view-all" onClick={onViewAllResults}>
          View all results for "{searchTerm}"
        </button>
      </div>
    </div>
  );
};

export default SearchDropdown;
