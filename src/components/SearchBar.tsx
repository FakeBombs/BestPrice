
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import { VoiceSearchButton } from './VoiceSearchButton';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar = ({ initialQuery = '', onSearch, className }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
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
      setRecentSearches(JSON.parse(savedSearches).slice(0, 10));
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
  }, [location.search, location.pathname, searchQuery]);

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
      
      // Call the onSearch prop if provided
      if (onSearch) {
        onSearch(query.trim());
      }
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
    <div className={`search-container ${className || ''}`}>
      <div className="flex items-center">
        <form onSubmit={handleSearch} className="search flex-grow" ref={searchBarRef}>
          <div className="search__field relative flex items-center">
            <div role="button" className="search__icon" aria-label="Search">
              <svg className="icon" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" role="img">
                <path xmlns="http://www.w3.org/2000/svg" d="M0 7.35173C0 8.36929 0.191392 9.32363 0.574177 10.2148C0.963038 11.0998 1.49772 11.8796 2.17823 12.5539C2.85873 13.2283 3.64557 13.7551 4.53873 14.1345C5.43797 14.5138 6.39797 14.7035 7.41873 14.7035C8.17823 14.7035 8.90127 14.5951 9.58785 14.3783C10.2805 14.1555 10.9185 13.8515 11.5018 13.4661L15.6851 17.6116C15.8187 17.7441 15.9676 17.8404 16.1316 17.9007C16.3018 17.9669 16.478 18 16.6603 18C16.9215 18 17.1524 17.9398 17.3529 17.8194C17.5534 17.705 17.7114 17.5454 17.8268 17.3407C17.9423 17.136 18 16.9072 18 16.6543C18 16.4737 17.9666 16.3021 17.8997 16.1395C17.839 15.9769 17.7448 15.8354 17.6172 15.715L13.4613 11.5785C13.8927 10.9885 14.2299 10.3352 14.4729 9.61867C14.722 8.90216 14.8466 8.14651 14.8466 7.35173C14.8466 6.34019 14.6522 5.39187 14.2633 4.50677C13.8805 3.61565 13.3489 2.83292 12.6684 2.15856C11.9878 1.47817 11.198 0.948319 10.2987 0.568991C9.40557 0.189664 8.44557 0 7.41873 0C6.39797 0 5.43797 0.189664 4.53873 0.568991C3.64557 0.948319 2.85873 1.47817 2.17823 2.15856C1.49772 2.83292 0.963038 3.61565 0.574177 4.50677C0.191392 5.39187 0 6.34019 0 7.35173ZM1.94127 7.35173C1.94127 6.60512 2.08101 5.90366 2.36051 5.24737C2.64608 4.59107 3.04101 4.01305 3.54532 3.5133C4.04962 3.01355 4.63291 2.62519 5.29519 2.34822C5.95747 2.06523 6.66532 1.92373 7.41873 1.92373C8.17823 1.92373 8.88911 2.06523 9.55139 2.34822C10.2137 2.62519 10.7939 3.01355 11.2922 3.5133C11.7965 4.01305 12.1914 4.59107 12.477 5.24737C12.7625 5.90366 12.9053 6.60512 12.9053 7.35173C12.9053 8.10437 12.7625 8.80883 12.477 9.46513C12.1914 10.1214 11.7965 10.6994 11.2922 11.1992C10.7939 11.6929 10.2137 12.0813 9.55139 12.3643C8.88911 12.6473 8.17823 12.7888 7.41873 12.7888C6.66532 12.7888 5.95747 12.6473 5.29519 12.3643C4.63291 12.0813 4.04962 11.6929 3.54532 11.1992C3.04101 10.6994 2.64608 10.1214 2.36051 9.46513C2.08101 8.80883 1.94127 8.10437 1.94127 7.35173Z" />
              </svg>
            </div>
            <Input ref={inputRef} type="text" placeholder="Η καλύτερη τιμή για..." value={searchQuery} onChange={handleChange} onFocus={handleFocus} />
            {searchQuery && (
              <div role="button" className="search__icon tooltip__anchor search__clear search__icon--actionable" aria-label="Καθαρισμός" onClick={handleClearSearch}>
                <svg className="icon" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" role="img">
                  <path xmlns="http://www.w3.org/2000/svg" d="M0.363016 17.6366C0.526838 17.8006 0.716724 17.9087 0.932671 17.9609C1.15607 18.013 1.37201 18.013 1.58052 17.9609C1.79646 17.9087 1.98262 17.8043 2.139 17.6478L9.00838 10.772L15.8666 17.6478C16.023 17.8043 16.2091 17.9087 16.4251 17.9609C16.641 18.013 16.857 18.013 17.0729 17.9609C17.2889 17.9087 17.4787 17.8006 17.6426 17.6366C17.7989 17.4801 17.9032 17.2938 17.9553 17.0776C18.0074 16.8615 18.0074 16.6491 17.9553 16.4404C17.9032 16.2242 17.7989 16.0342 17.6426 15.8702L10.7844 8.99441L17.6426 2.12981C17.7989 1.96584 17.9032 1.7795 17.9553 1.57081C18.0149 1.35466 18.0149 1.13851 17.9553 0.92236C17.9032 0.706211 17.7989 0.519876 17.6426 0.363354C17.4713 0.199379 17.2777 0.0913043 17.0617 0.0391304C16.8532 -0.0130435 16.641 -0.0130435 16.4251 0.0391304C16.2091 0.0838509 16.023 0.188199 15.8666 0.352174L9.00838 7.22795L2.139 0.352174C1.98262 0.195652 1.79646 0.0913043 1.58052 0.0391304C1.36457 -0.0130435 1.14862 -0.0130435 0.932671 0.0391304C0.716724 0.0913043 0.526838 0.199379 0.363016 0.363354C0.20664 0.519876 0.102389 0.706211 0.0502637 0.92236C-0.00186162 1.13851 -0.00186162 1.35466 0.0502637 1.57081C0.102389 1.78696 0.20664 1.96957 0.363016 2.11863L7.22122 8.99441L0.363016 15.8814C0.20664 16.0304 0.0986658 16.213 0.039094 16.4292C-0.0130313 16.6453 -0.0130313 16.8615 0.039094 17.0776C0.0912194 17.2938 0.199193 17.4801 0.363016 17.6366Z" />
                </svg>
              </div>
            )}
            <Button type="submit" className="search__icon search__button search__icon--actionable">
              <svg className="icon" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" role="img">
                <path xmlns="http://www.w3.org/2000/svg" d="M0 7.35173C0 8.36929 0.191392 9.32363 0.574177 10.2148C0.963038 11.0998 1.49772 11.8796 2.17823 12.5539C2.85873 13.2283 3.64557 13.7551 4.53873 14.1345C5.43797 14.5138 6.39797 14.7035 7.41873 14.7035C8.17823 14.7035 8.90127 14.5951 9.58785 14.3783C10.2805 14.1555 10.9185 13.8515 11.5018 13.4661L15.6851 17.6116C15.8187 17.7441 15.9676 17.8404 16.1316 17.9007C16.3018 17.9669 16.478 18 16.6603 18C16.9215 18 17.1524 17.9398 17.3529 17.8194C17.5534 17.705 17.7114 17.5454 17.8268 17.3407C17.9423 17.136 18 16.9072 18 16.6543C18 16.4737 17.9666 16.3021 17.8997 16.1395C17.839 15.9769 17.7448 15.8354 17.6172 15.715L13.4613 11.5785C13.8927 10.9885 14.2299 10.3352 14.4729 9.61867C14.722 8.90216 14.8466 8.14651 14.8466 7.35173C14.8466 6.34019 14.6522 5.39187 14.2633 4.50677C13.8805 3.61565 13.3489 2.83292 12.6684 2.15856C11.9878 1.47817 11.198 0.948319 10.2987 0.568991C9.40557 0.189664 8.44557 0 7.41873 0C6.39797 0 5.43797 0.189664 4.53873 0.568991C3.64557 0.948319 2.85873 1.47817 2.17823 2.15856C1.49772 2.83292 0.963038 3.61565 0.574177 4.50677C0.191392 5.39187 0 6.34019 0 7.35173ZM1.94127 7.35173C1.94127 6.60512 2.08101 5.90366 2.36051 5.24737C2.64608 4.59107 3.04101 4.01305 3.54532 3.5133C4.04962 3.01355 4.63291 2.62519 5.29519 2.34822C5.95747 2.06523 6.66532 1.92373 7.41873 1.92373C8.17823 1.92373 8.88911 2.06523 9.55139 2.34822C10.2137 2.62519 10.7939 3.01355 11.2922 3.5133C11.7965 4.01305 12.1914 4.59107 12.477 5.24737C12.7625 5.90366 12.9053 6.60512 12.9053 7.35173C12.9053 8.10437 12.7625 8.80883 12.477 9.46513C12.1914 10.1214 11.7965 10.6994 11.2922 11.1992C10.7939 11.6929 10.2137 12.0813 9.55139 12.3643C8.88911 12.6473 8.17823 12.7888 7.41873 12.7888C6.66532 12.7888 5.95747 12.6473 5.29519 12.3643C4.63291 12.0813 4.04962 11.6929 3.54532 11.1992C3.04101 10.6994 2.64608 10.1214 2.36051 9.46513C2.08101 8.80883 1.94127 8.10437 1.94127 7.35173Z" />
              </svg>
            </Button>
          </div>
        </form>
        
        <div className="ml-1">
          <VoiceSearchButton 
            onSearchComplete={handleVoiceSearchComplete}
          />
        </div>
      </div>

      {showDropdown && recentSearches.length > 0 && (
        <div ref={dropdownRef} className="search__menu">
          <ul>
            {recentSearches.map((term, index) => (
              <li key={index} className="p-2 hover:bg-accent cursor-pointer flex items-center" onClick={() => handleRecentSearchClick(term)}>
                <div className="search__icon" focusable="false">
                  <svg fill="none" width="20" height="21" viewBox="0 0 20 21" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M5.599 11.883h4.389a.674.674 0 00.496-.2c.134-.134.2-.3.2-.497V5.479a.664.664 0 00-.2-.488.674.674 0 00-.496-.2.664.664 0 00-.488.2.664.664 0 00-.2.488v5.019H5.599a.674.674 0 00-.497.2c-.133.128-.2.29-.2.488s.067.363.2.497.3.2.497.2zm4.397 7.91c1.231 0 2.39-.234 3.475-.705a9.2 9.2 0 004.824-4.818 8.655 8.655 0 00.706-3.476c0-1.231-.235-2.39-.706-3.476a9.097 9.097 0 00-1.95-2.867A9.195 9.195 0 0013.47 2.5a8.665 8.665 0 00-3.483-.706c-1.231 0-2.39.235-3.475.706a9.224 9.224 0 00-4.807 4.818 8.655 8.655 0 00-.705 3.476c0 1.231.235 2.39.705 3.476a9.272 9.272 0 001.942 2.875 9.072 9.072 0 002.874 1.943 8.643 8.643 0 003.474.706zm0-1.776a7.13 7.13 0 01-5.111-2.109 7.312 7.312 0 01-1.542-2.3 7.098 7.098 0 01-.557-2.814c0-1 .186-1.934.557-2.805a7.284 7.284 0 011.542-2.31 7.133 7.133 0 012.29-1.55 7.13 7.13 0 012.813-.558c1.004 0 1.942.186 2.812.558a7.207 7.207 0 013.858 3.86c.372.87.557 1.806.557 2.805a7.097 7.097 0 01-.557 2.814 7.238 7.238 0 01-1.55 2.3 7.235 7.235 0 01-2.299 1.551 7.09 7.09 0 01-2.813.558z"></path></svg>
                </div>
                <div className="search__content"><strong>{term}</strong></div>
                <div role="button" className="search__icon tooltip__anchor search__remove search__icon--actionable">
                  <svg fill="none" width="18" height="19" viewBox="0 0 18 19" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M.364 17.75c.164.164.353.272.57.325.223.052.439.052.647 0a1.16 1.16 0 00.559-.313l6.87-6.876 6.857 6.876c.157.156.343.26.559.313.216.052.432.052.648 0 .216-.052.405-.16.57-.325.156-.156.26-.342.312-.559a1.319 1.319 0 000-.637 1.232 1.232 0 00-.313-.57l-6.858-6.876 6.858-6.864c.157-.164.26-.35.313-.559.06-.216.06-.432 0-.648-.053-.216-.156-.405-.313-.559-.172-.164-.36-.26-.57-.312a1.13 1.13 0 00-.648 0c-.216.045-.402.148-.559.312L9.008 7.228 2.139.352A1.13 1.13 0 001.58.04a1.197 1.197 0 00-.647 0c-.217.052-.407.148-.57.312-.157.154-.261.343-.312.56-.053.215-.053.431 0 .647.051.216.155.395.312.56l6.858 6.876-6.858 6.881c-.157.165-.261.35-.313.56-.52.215-.52.431 0 .647.051.216.155.403.313.56z"></path></svg>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
