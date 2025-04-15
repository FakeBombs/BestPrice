import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';

const useHtmlAttributes = (classes, newId) => {
  useEffect(() => {
    const htmlElement = document.documentElement;

    // Clear existing classes and ID
    htmlElement.className = '';
    htmlElement.removeAttribute('id');

    // Add new classes and ID
    const classesArray = classes.split(' ');
    classesArray.forEach(className => htmlElement.classList.add(className));
    
    // Set new ID
    if (newId) {
      htmlElement.setAttribute('id', newId);
    }

    return () => {
      // Cleanup: remove added classes and ID on unmount
      htmlElement.className = '';
      htmlElement.removeAttribute('id');
    };
  }, [classes, newId]);
};

const useBodyAttributes = (classes, newId) => {
  useEffect(() => {
    const bodyElement = document.body;

    // Clear existing classes and ID
    bodyElement.className = '';
    bodyElement.removeAttribute('id');

    // Add new classes and ID
    const classesArray = classes.split(' ');
    classesArray.forEach(className => bodyElement.classList.add(className));
    
    // Set new ID
    if (newId) {
      bodyElement.setAttribute('id', newId);
    }

    return () => {
      // Cleanup: remove added classes and ID on unmount
      bodyElement.className = '';
      bodyElement.removeAttribute('id');
    };
  }, [classes, newId]);
};

const SearchResults = () => {

  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(true);
  let classNamesForBody = '';
  let classNamesForHtml = '';

  // List of ad-related elements to check for blocking
  const adElementsToCheck = ['.adsbox', '.ad-banner', '.video-ad'];

  // Function to check if any of the ad elements are blocked
  const checkAdBlockers = () => {
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

  // Determine device type and set corresponding class names for body and html
  if (userAgent.includes('windows')) {
    classNamesForBody = 'windows no-touch not-touch supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
    classNamesForHtml = 'windows supports-webp is-desktop';
  } else if (userAgent.includes('mobile')) {
    classNamesForBody = 'mobile supports-webp is-mobile';
    classNamesForHtml = 'mobile supports-webp is-mobile';
  } else if (userAgent.includes('tablet')) {
    classNamesForBody = 'tablet supports-webp is-tablet';
    classNamesForHtml = 'tablet supports-webp is-tablet';
  } else if (userAgent.includes('mac') || userAgent.includes('linux')) {
    classNamesForBody = 'is-desktop';
    classNamesForHtml = 'is-desktop';
  } else {
    classNamesForBody = 'unknown-device';
    classNamesForHtml = 'unknown-device';
  }

  // Add class if ad blocker is detected for both <body> and <html>
  classNamesForBody += isAdBlocked ? ' adblocked' : ' adallowed';
  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';

  // Check if JavaScript is enabled
  window.addEventListener('load', () => setJsEnabled(true), { once: true });

  // Add class based on JavaScript status for both body and html
  classNamesForBody += jsEnabled ? ' js-enabled' : ' js-disabled';
  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';

  // Set a new ID for the body and html elements
  const newIdForBody = isAdBlocked ? 'adblocked' : 'adallowed';
  const newIdForHtml = isAdBlocked ? 'adblocked' : 'adallowed';

  useHtmlAttributes(classNamesForHtml, newIdForHtml);     // Use the computed class names and new ID for html
  useBodyAttributes(classNamesForBody, newIdForBody);     // Use the computed class names and new ID for body


  
  
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
