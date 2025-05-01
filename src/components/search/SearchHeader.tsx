
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface SearchHeaderProps {
  query: string;
  resultsCount: number;
}

const SearchHeader = ({ query, resultsCount }: SearchHeaderProps) => {
  const [searchParams] = useSearchParams();
  const currentSort = searchParams.get('o') || '';
  
  // Function to get the URL with the sort parameter
  const getSortUrl = (sortOption: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('o', sortOption);
    return `/search?${params.toString()}`;
  };
  
  return (
    <div className="page-header">
      <div className="page-header__title-wrapper">
        <div className="page-header__title-main">
          <h1>{query}</h1>
          <div className="page-header__count-wrapper">
            <div className="page-header__count">{resultsCount} προϊόντα</div>
          </div>
        </div>
      </div>

      <div className="page-header__sorting">
        <div className="tabs">
          <div className="tabs-wrapper">
            <nav>
              <Link 
                to={getSortUrl('')} 
                rel="nofollow" 
                className={currentSort === '' ? 'current' : ''}
              >
                <div className="tabs__content">Σχετικότερα</div>
              </Link>
              <Link 
                to={getSortUrl('price_asc')} 
                rel="nofollow"
                className={currentSort === 'price_asc' ? 'current' : ''}
              >
                <div className="tabs__content">Φθηνότερα</div>
              </Link>
              <Link 
                to={getSortUrl('price_desc')} 
                rel="nofollow"
                className={currentSort === 'price_desc' ? 'current' : ''}
              >
                <div className="tabs__content">Ακριβότερα</div>
              </Link>
              <Link 
                to={getSortUrl('stores')} 
                rel="nofollow"
                className={currentSort === 'stores' ? 'current' : ''}
              >
                <div className="tabs__content">Αριθμός Καταστημάτων</div>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
