
import React from 'react';
import { SearchBar } from '@/components/SearchBar';

interface SearchHeaderProps {
  query: string;
  onSearch: (query: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ query, onSearch }) => {
  return (
    <div className="search-header">
      <div className="header-search">
        <SearchBar initialQuery={query} onSearch={onSearch} />
      </div>
    </div>
  );
};

export default SearchHeader;
