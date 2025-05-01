
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceSearchButton } from './VoiceSearchButton';

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`search-bar ${className}`}>
      <div className="search__input-wrapper">
        <div className="search__input" role="combobox" aria-haspopup="listbox" aria-expanded="false">
          <input 
            type="text"
            className="search__input-field" 
            placeholder="Search for products, brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </div>
        
        <VoiceSearchButton onVoiceInput={setQuery} />
        
        <Button type="submit" variant="ghost" className="search__button">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      
      {/* Additional search components like suggestions would go here */}
    </form>
  );
};

export default SearchBar;
