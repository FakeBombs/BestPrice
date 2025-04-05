
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import { VoiceSearchButton } from './VoiceSearchButton';

export const SearchBar = ({ className }: { className?: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLFormElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);

  // Handle click outside to close dropdown and clear search when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown when clicking outside
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      
      // Clear search when clicking outside the search bar completely
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigate based on URL query param changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlQuery = searchParams.get('q');
    
    // Update search query if URL changes
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
    
    // Clear search query when navigating away from search page
    if (!location.pathname.includes('/search') && !urlQuery) {
      setSearchQuery('');
    }
  }, [location.search, location.pathname]);

  // Validate that the search term returns actual results
  const validateSearchTerm = (term: string): boolean => {
    const results = searchProducts(term.trim());
    return results.length > 0;
  };

  const navigateToSearchResults = (query: string) => {
    if (query.trim()) {
      // Only save searches that return valid results
      if (validateSearchTerm(query)) {
        // Save to recent searches
        const updatedSearches = [
          query.trim(),
          ...recentSearches.filter(search => search !== query.trim())
        ].slice(0, 5);
        
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      }
      
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateToSearchResults(searchQuery);
    }
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchQuery(term);
    navigateToSearchResults(term);
    setShowDropdown(false);
  };

  const handleFocus = () => {
    // Only show dropdown when focusing and there's no search query
    if (searchQuery.trim().length === 0) {
      setShowDropdown(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Hide dropdown when typing
    if (value.trim().length > 0) {
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
    }
    
    // If there's a meaningful search query, search while typing
    if (value.trim().length > 2) {
      // Use a small delay to avoid too frequent searches
      const timer = setTimeout(() => {
        navigateToSearchResults(value);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowDropdown(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleVoiceSearchComplete = (query: string) => {
    setSearchQuery(query);
    navigateToSearchResults(query);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <form onSubmit={handleSearch} className="search flex-grow" ref={searchBarRef}>
          <div className="search__field relative flex items-center">
            <div role="button" className="search__icon" aria-label="Search">
              <svg className="icon" aria-hidden="true" width="20" height="20">
                <use xlinkHref="/images/icons/search.svg#icon-search-20"></use>
              </svg>
            </div>
            <Input 
              ref={inputRef} 
              type="text" 
              placeholder="Η καλύτερη τιμή για..." 
              value={searchQuery} 
              onChange={handleChange} 
              onFocus={handleFocus} 
            />
            {searchQuery && (
              <div 
                role="button" 
                className="search__icon tooltip__anchor search__clear search__icon--actionable" 
                aria-label="Καθαρισμός"
                onClick={handleClearSearch}
              >
                <svg className="icon" aria-hidden="true" width="20" height="20">
                  <use xlinkHref="/images/icons/search.svg#icon-x-20"></use>
                </svg>
              </div>
            )}
          </div>
          <Button type="submit" className="search__icon search__button search__icon--actionable">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="ml-1">
          <VoiceSearchButton onSearchComplete={handleVoiceSearchComplete} />
        </div>
      </div>

      {showDropdown && recentSearches.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-background rounded-md border shadow-lg"
        >
          <div className="p-2 text-xs font-medium text-muted-foreground">Recent Searches</div>
          {recentSearches.map((term, index) => (
            <div 
              key={index}
              className="p-2 hover:bg-accent cursor-pointer flex items-center"
              onClick={() => handleRecentSearchClick(term)}
            >
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{term}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
