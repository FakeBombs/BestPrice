import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchProducts } from '@/data/mockData'; // Ensure this function returns a promise resolving to product data
import ProductCard from '@/components/ProductCard';

const SearchResults = ({ initialVendorList }) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [vendorList, setVendorList] = useState(initialVendorList || []);

  // Fetch products based on search query
  useEffect(() => {
    const fetchProducts = async () => {
      if (searchQuery) {
        const results = await searchProducts(searchQuery); // Assuming this returns a promise
        setProducts(results);
      } else {
        setProducts([]); // Or set a default product list if needed
      }
    };
    fetchProducts();
  }, [searchQuery]);

  // Filter products based on query and vendor list
  useEffect(() => {
    let filteredResults = products;
    if (searchQuery) {
      filteredResults = filteredResults.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (vendorList.length > 0) {
      filteredResults = filteredResults.filter(product =>
        product.prices.some(price => vendorList.includes(price.vendorId))
      );
    }
    setFilteredProducts(filteredResults);
  }, [products, vendorList, searchQuery]);

  const handleSort = (sortOption) => {
    const sorted = [...filteredProducts];

    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => Math.min(...a.prices.map(p => p.price)) - Math.min(...b.prices.map(p => p.price)));
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => Math.min(...b.prices.map(p => p.price)) - Math.min(...a.prices.map(p => p.price)));
    }

    setFilteredProducts(sorted);
  };

  const handleInStockOnly = (inStockOnly) => {
    if (inStockOnly) {
      setFilteredProducts(products.filter(product => product.prices.some(price => price.inStock)));
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            <div id="filters">
              <div className="filters__header">
                <div className="filters__header-title">Φίλτρα</div>
              </div>
              <div className="filter-options">
                <h4>Ταξινόμηση κατά:</h4>
                <ol>
                  <li onClick={() => handleSort('price-asc')}>
                    <Link to={`/search?q=${searchQuery}&sort=price-asc`}>Τιμή: Χαμηλότερη προς Υψηλότερη</Link>
                  </li>
                  <li onClick={() => handleSort('price-desc')}>
                    <Link to={`/search?q=${searchQuery}&sort=price-desc`}>Τιμή: Υψηλότερη προς Χαμηλότερη</Link>
                  </li>
                </ol>
              </div>
              <div className="filter-limit default-list">
                <div className="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                <div className="filter-container">
                  <ol>
                    <li data-filter="in-stock">
                      <Link onClick={() => handleInStockOnly(true)} to={`/search?q=${searchQuery}&instock=1`}>Άμεσα διαθέσιμα</Link>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="filter-store filter-collapsed default-list">
                <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                <div className="filter-container">
                  <ol data-total={vendorList.length}>
                    {vendorList.map((vendor) => (
                      <li key={vendor.id}>
                        <Link to={`/search?q=${searchQuery}&store=${vendor.id}`}><span>{vendor.name}</span></Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </aside>

          <main className="page-products__main">
            <div className="page-header">
              <div className="page-header__title-main">
                <h1>{searchQuery}</h1>
                <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Δεν βρέθηκαν προϊόντα που να ταιριάζουν με την αναζήτησή σας.</p>
              </div>
            ) : (
              <div className="product-grid mt-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
