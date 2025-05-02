
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

interface SearchHeaderProps {
  query: string;
  count: number;
  loading: boolean;
}

const SearchHeader = ({ query, count, loading }: SearchHeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {loading ? (
          'Searching...'
        ) : (
          <>
            {count} results for <span className="text-primary">"{query}"</span>
          </>
        )}
      </h1>
      <SearchBar className="" />
    </div>
  );
};

export default SearchHeader;
