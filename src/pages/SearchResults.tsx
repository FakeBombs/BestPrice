import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';

const useClassList = (classNames) => {
  useEffect(() => {
    // Clear existing classes
    document.documentElement.className = '';

    // Add new classes
    const classes = classNames.split(' ');
    classes.forEach(className => document.documentElement.classList.add(className));
  
    // Cleanup function to reset classes when the component unmounts
    return () => {
      document.documentElement.className = '';
    };
  }, [classNames]);
};

const SearchResults = () => {

  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(true); // State to track if JS is enabled
  let classNames = '';

  // List of ad-related elements to check for blocking
  const adElementsToCheck = ['.adsbox', '.ad-banner', '.video-ad'];

  // Function to check if any of the ad elements are blocked
  const checkAdBlockers = () => {
    return adElementsToCheck.some(selector => {
      const adElement = document.createElement('div');
      adElement.className = selector.slice(1); // Remove the dot for the class name
      document.body.appendChild(adElement);
      
      // Check if the element is blocked by height or display property
      const isBlocked = adElement.offsetHeight === 0 || getComputedStyle(adElement).display === 'none';
      
      document.body.removeChild(adElement); // Clean up
      return isBlocked;
    });
  };

  const isAdBlocked = checkAdBlockers(); // Check if any ad elements are blocked

  // Determine device type and set corresponding class names
  if (userAgent.includes('windows')) {
    classNames = 'windows supports-webp is-desktop';
  } else if (userAgent.includes('mobile')) {
    classNames = 'mobile supports-webp is-mobile';
  } else if (userAgent.includes('tablet')) {
    classNames = 'tablet supports-webp is-tablet';
  } else if (userAgent.includes('mac') || userAgent.includes('linux')) {
    classNames = 'is-desktop';
  } else {
    classNames = 'unknown-device';
  }

  // Add class if ad blocker is detected
  classNames += isAdBlocked ? ' ad-blocked' : ' ad-allowed';

  // Check if JavaScript is enabled
  window.addEventListener('load', () => {
    setJsEnabled(true);
  });

  // Add class based on JavaScript status
  classNames += jsEnabled ? ' js-enabled' : ' js-disabled';

  useClassList(classNames); // Use the computed class names
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    if (searchQuery) {
      const results = searchProducts(searchQuery);
      setProducts(results);
      setFilteredProducts(results);
    }
  }, [searchQuery]);
  
  // Filter and sort functions
  const handleSortChange = (value: string) => {
    const sorted = [...filteredProducts];
    
    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return aPrice - bPrice;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return bPrice - aPrice;
        });
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews-desc':
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  };
  
  const handleVendorFilter = (vendors: string[]) => {
    if (vendors.length === 0) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.prices.some(price => vendors.includes(price.vendorId))
    );
    
    setFilteredProducts(filtered);
  };
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    const filtered = products.filter(product => {
      const minPrice = product.prices.length ? Math.min(...product.prices.map(p => p.price)) : 0;
      return minPrice >= min && minPrice <= max;
    });
    
    setFilteredProducts(filtered);
  };
  
  const handleInStockOnly = (inStockOnly: boolean) => {
    if (!inStockOnly) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.prices.some(price => price.inStock)
    );
    
    setFilteredProducts(filtered);
  };
  
  return (
    <div className="root__wrapper">
      <div class="root">
      <h1 className="text-3xl font-bold mb-2">Αποτελέσματα Αναζήτησης</h1>
      <p className="text-muted-foreground mb-6">
        {filteredProducts.length} αποτελέσματα για "{searchQuery}"
      </p>
      
      <ProductFilter
        onSortChange={handleSortChange}
        onVendorFilter={handleVendorFilter}
        onPriceRangeFilter={handlePriceRangeFilter}
        onInStockOnly={handleInStockOnly}
      />
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Δεν βρέθηκαν προϊόντα που να ταιριάζουν με την αναζήτησή σας.
          </p>
        </div>
      ) : (
        <div className="product-grid mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default SearchResults;
