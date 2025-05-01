
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceSearchButton } from './VoiceSearchButton';  // Import using named export
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import SearchDropdown from './SearchDropdown';
import { Product } from '@/data/mockData';

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { recentlyViewed } = useRecentlyViewed();
  const searchBarRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setDropdownVisible(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Hide dropdown when typing
    if (newQuery.trim()) {
      setDropdownVisible(false);
    }
  };

  // Show dropdown when focused and no query
  const handleInputFocus = () => {
    if (!query.trim()) {
      setDropdownVisible(true);
    }
  };

  // Handle product selection from dropdown
  const handleProductSelect = (product: Product) => {
    setDropdownVisible(false);
    navigate(`/product/${product.id}/${product.slug || ''}`);
  };

  return (
    <form 
      ref={searchBarRef}
      onSubmit={handleSearch} 
      className={`search-bar relative ${className}`}
    >
      <div className="search__input-wrapper">
        <div className="search__input" role="combobox" aria-haspopup="listbox" aria-expanded={dropdownVisible}>
          <Input 
            type="text"
            className="search__input-field" 
            placeholder="Search for products, brands..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            aria-label="Search products"
          />
        </div>
        
        <VoiceSearchButton onVoiceInput={setQuery} />
        
        <Button type="submit" variant="ghost" className="search__button">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      
      <SearchDropdown 
        items={recentlyViewed.slice(0, 5)} 
        visible={dropdownVisible}
        onSelect={handleProductSelect}
        onClose={() => setDropdownVisible(false)}
      />
    </form>
  );
};

export default SearchBar;
