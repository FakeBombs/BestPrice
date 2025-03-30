
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';

export const SearchBar = ({ className }: { className?: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();
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

  // Handle search typing with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        const results = searchProducts(searchQuery);
        setSearchResults(results.slice(0, 5));
        setIsTyping(false);
      } else if (searchQuery.trim().length === 0) {
        setIsTyping(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to recent searches
      const updatedSearches = [
        searchQuery.trim(),
        ...recentSearches.filter(search => search !== searchQuery.trim())
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowDropdown(false);
    }
  };

  const handleRecentSearchClick = (term: string) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setShowDropdown(false);
  };

  const handleResultClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setShowDropdown(false);
  };

  const handleFocus = () => {
    if (searchQuery.trim().length === 0) {
      setShowDropdown(true);
      setIsTyping(false);
    } else if (searchQuery.trim().length > 2) {
      setShowDropdown(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsTyping(true);
    setShowDropdown(true);
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

      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-background rounded-md border shadow-lg"
        >
          {isTyping ? (
            <div className="p-2 text-sm text-muted-foreground">Searching...</div>
          ) : searchQuery.trim().length > 2 && searchResults.length > 0 ? (
            <div>
              <div className="p-2 text-xs font-medium text-muted-foreground">Search Results</div>
              {searchResults.map(product => (
                <div 
                  key={product.id}
                  className="p-2 hover:bg-accent cursor-pointer"
                  onClick={() => handleResultClick(product.id)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">${Math.min(...product.prices.map((p: any) => p.price)).toFixed(2)}</div>
                </div>
              ))}
              <div 
                className="p-2 text-center text-primary hover:bg-accent cursor-pointer border-t"
                onClick={() => handleSearch({ preventDefault: () => {} } as React.FormEvent)}
              >
                See all results
              </div>
            </div>
          ) : searchQuery.trim().length > 0 && searchQuery.trim().length <= 2 ? (
            <div className="p-2 text-sm text-muted-foreground">Type at least 3 characters to search</div>
          ) : searchQuery.trim().length === 0 && recentSearches.length > 0 ? (
            <div>
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
          ) : (
            <div className="p-2 text-sm text-muted-foreground">No recent searches</div>
          )}
        </div>
      )}
    </div>
  );
};
