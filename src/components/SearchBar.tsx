
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import SearchDropdown from '@/components/SearchDropdown';
import VoiceSearchButton from '@/components/VoiceSearchButton';
import { searchProducts, Product } from '@/services/productService';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', onSearch, className = '' }) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Search when query changes
    const delaySearch = setTimeout(() => {
      if (query.trim().length > 1) {
        performSearch();
      } else {
        setResults([]);
        setIsDropdownOpen(false);
      }
    }, 300);
    
    return () => clearTimeout(delaySearch);
  }, [query]);

  const performSearch = async () => {
    if (query.trim().length > 1) {
      setLoading(true);
      try {
        const searchResults = await searchProducts(query);
        setResults(searchResults.slice(0, 5)); // Only show top 5 results in dropdown
        setIsDropdownOpen(searchResults.length > 0);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsDropdownOpen(false);
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleViewAllResults = () => {
    setIsDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSearchComplete = (voiceQuery: string) => {
    setQuery(voiceQuery);
    if (voiceQuery.trim()) {
      if (onSearch) {
        onSearch(voiceQuery);
      } else {
        navigate(`/search?q=${encodeURIComponent(voiceQuery)}`);
      }
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <div ref={searchRef} className={`search ${className}`}>
      <form 
        className="search__form"
        onSubmit={handleSubmit}
      >
        <div className="search__input-wrapper">
          <div className="search__input">
            <div className="search__bar">
              <div className="search__icon tooltip__anchor search__lens">
                <Search size={18} />
              </div>
              <input
                type="search"
                name="q"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search__field"
                autoComplete="off"
              />
              {query && (
                <div 
                  role="button" 
                  className="search__icon tooltip__anchor search__remove search__icon--actionable"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X size={18} />
                </div>
              )}
            </div>
            <VoiceSearchButton onSearchComplete={handleSearchComplete} />
          </div>
          <button 
            type="submit"
            className="search__button"
            aria-label="Search"
          >
            <Search size={18} />
            <span className="search__text">Search</span>
          </button>
        </div>
      </form>

      <SearchDropdown
        results={results}
        isOpen={isDropdownOpen}
        onResultClick={() => setIsDropdownOpen(false)}
        onViewAllResults={handleViewAllResults}
        searchTerm={query}
      />
    </div>
  );
};

export default SearchBar;
