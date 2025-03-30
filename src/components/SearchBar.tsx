
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

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigate to search results or home based on search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        navigateToSearchResults(searchQuery);
      } else if (searchQuery === '' && location.pathname === '/search') {
        // Redirect to homepage if search is cleared and we're on the search page
        navigate('/');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, location.pathname]);

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
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          className="w-full"
          value={searchQuery}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <Button type="submit" className="ml-2">
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
