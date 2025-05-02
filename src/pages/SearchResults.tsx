import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAllProducts, Product, searchProducts } from '@/services/productService';
import { vendors, Vendor } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

interface SearchResultsProps { }

const SearchResults: React.FC<SearchResultsProps> = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  let classNamesForBody = '';
  let classNamesForHtml = '';

  // Check for ad blockers
  const checkAdBlockers = () => {
    const adElementsToCheck = ['.adsbox', '.ad-banner', '.video-ad'];
    return adElementsToCheck.some(selector => {
      const adElement = document.createElement('div');
      adElement.className = selector.slice(1);
      document.body.appendChild(adElement);
      const isBlocked = adElement.offsetHeight === 0 || getComputedStyle(adElement).display === 'none';
      document.body.removeChild(adElement);
      return isBlocked;
    });
  };

  const isAdBlocked = checkAdBlockers();

  // Determine device type
  if (userAgent.includes('windows')) {
    classNamesForHtml = 'windows no-touch not-touch supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
  } else if (userAgent.includes('mobile')) {
    classNamesForHtml = 'is-mobile';
    classNamesForBody = 'mobile';
  } else if (userAgent.includes('tablet')) {
    classNamesForHtml = 'is-tablet';
    classNamesForBody = 'tablet';
  } else {
    classNamesForHtml = 'unknown-device';
  }

  // Handle ad blockers
  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';

  // Set JavaScript enabled state
  useEffect(() => {
    const handleLoad = () => {
      setJsEnabled(true);
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // Add JS enabled/disabled class
  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';

  // Set attributes
  const newIdForBody = ''; // Keeping body ID empty
  const newIdForHtml = 'page-search';

  useHtmlAttributes(classNamesForHtml, newIdForHtml);
  useBodyAttributes(classNamesForBody, newIdForBody);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Vendor[] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchTerm(query);
    performSearch(query);
  }, [location.search]);

  useEffect(() => {
    // Extract brands with products
    const brandsWithProducts = vendors.filter(vendor =>
      products.some(product =>
        product.prices && product.prices.some(price => price.vendorId === vendor.id)
      )
    );
    setFilteredBrands(brandsWithProducts);
  }, [products]);

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      const searchResults = await searchProducts(query);
      setProducts(searchResults);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brandId)) {
        return prev.filter(id => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };

  const filteredProducts = products.filter(product => {
    if (selectedBrands.length === 0) {
      return true;
    }
    return product.prices && product.prices.some(price => selectedBrands.includes(price.vendorId || ''));
  });

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-6">
        <SearchBar initialQuery={searchTerm} onSearch={handleSearch} />
      </section>

      <div className="flex">
        {/* Filters Sidebar */}
        <aside className="w-1/4 pr-4">
          <div className="bg-white rounded-md shadow-md p-4">
            <h3 className="font-semibold mb-3">Filter by Brand</h3>
            {filteredBrands && Array.isArray(filteredBrands) && filteredBrands.map((brand) => (
              <div key={brand.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandToggle(brand.id)}
                  className="mr-2"
                />
                <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                  {brand.name}
                </label>
              </div>
            ))}
          </div>
        </aside>

        {/* Product Listing */}
        <main className="w-3/4">
          <h2 className="text-2xl font-bold mb-4">
            Search Results for "{searchTerm}"
          </h2>

          {loading ? (
            <div className="text-center py-10">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="text-center py-10">No products found matching your criteria.</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
