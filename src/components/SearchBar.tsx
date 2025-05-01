
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceSearchButton } from './VoiceSearchButton';  // Import using named export
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import SearchDropdown from './SearchDropdown';
import { Product, searchProducts } from '@/data/mockData';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [liveResults, setLiveResults] = useState<Product[]>([]);
  const { recentlyViewed } = useRecentlyViewed();
  const searchBarRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);
  
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

  // Search live as the user types
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const results = searchProducts(debouncedQuery);
      setLiveResults(results);
      
      // Navigate to search results page if user is typing
      if (debouncedQuery.length > 1) {
        navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`);
      }
    } else {
      setLiveResults([]);
    }
  }, [debouncedQuery, navigate]);

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
    
    // Hide recent items dropdown, show live results
    if (newQuery.trim()) {
      setDropdownVisible(false);
    } else {
      setDropdownVisible(true);
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
        items={dropdownVisible ? recentlyViewed.slice(0, 5) : []} 
        visible={dropdownVisible && recentlyViewed.length > 0}
        onSelect={handleProductSelect}
        onClose={() => setDropdownVisible(false)}
      />
    </form>
  );
};

export default SearchBar;
