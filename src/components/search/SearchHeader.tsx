
import React from 'react';

interface SearchHeaderProps {
  query: string;
  resultsCount: number;
}

const SearchHeader = ({ query, resultsCount }: SearchHeaderProps) => {
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
              <a href={`/search?q=${query}`} rel="nofollow" className="current">
                <div className="tabs__content">Σχετικότερα</div>
              </a>
              <a href={`/search?q=${query}&amp;o=2`} rel="nofollow">
                <div className="tabs__content">Φθηνότερα</div>
              </a>
              <a href={`/search?q=${query}&amp;o=1`} rel="nofollow">
                <div className="tabs__content">Ακριβότερα</div>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
