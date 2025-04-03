
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';

export const SearchBar = ({ className }: { className?: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
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

  const navigateToSearchResults = (query: string) => {
    if (query.trim()) {
      // Save to recent searches
      const updatedSearches = [
        query.trim(),
        ...recentSearches.filter(search => search !== query.trim())
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
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
    if (searchQuery.trim().length === 0) {
      setShowDropdown(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.trim().length === 0);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="search" ref={searchBarRef}>
        <div className="search__field">
          <Input ref={inputRef} type="text" placeholder="Η καλύτερη τιμή για..." className="" value={searchQuery} onChange={handleChange} onFocus={handleFocus} />
        </div>
        <Button type="submit" className="search__icon search__button search__icon--actionable">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {showDropdown && searchQuery.trim().length === 0 && recentSearches.length > 0 && (
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
