
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendors } from '@/data/mockData';

const Stores = () => {
  const [storesByLetter, setStoresByLetter] = useState<Record<string, typeof vendors>>({});
  const [activeLetter, setActiveLetter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                   'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  useEffect(() => {
    // Enhance vendors with missing properties if needed
    const enhancedVendors = vendors.map(vendor => ({
      ...vendor,
      productCount: vendor.productCount || Math.floor(Math.random() * 1000) + 100,
      categoryCount: vendor.categoryCount || Math.floor(Math.random() * 20) + 5
    }));
    
    // Group stores by first letter
    const groupedStores: Record<string, typeof vendors> = {};
    
    enhancedVendors.forEach(store => {
      const firstLetter = store.name.charAt(0).toUpperCase();
      
      if (!groupedStores[firstLetter]) {
        groupedStores[firstLetter] = [];
      }
      
      groupedStores[firstLetter].push(store);
    });
    
    setStoresByLetter(groupedStores);
  }, []);

  const handleLetterClick = (letter: string) => {
    setActiveLetter(letter);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setActiveLetter('all');
  };
  
  const filteredStores = () => {
    let results = [...vendors];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      results = results.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return results;
    }
    
    // Apply letter filter
    if (activeLetter !== 'all') {
      results = storesByLetter[activeLetter] || [];
    }
    
    return results;
  };
  
  const formattedSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Online Stores</h1>
      
      {/* Search and Letter Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="md:w-1/3">
            <input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLetterClick('all')}
              className={`px-3 py-1 rounded-md ${activeLetter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            {letters.map(letter => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={!storesByLetter[letter]}
                className={`px-3 py-1 rounded-md ${
                  activeLetter === letter 
                    ? 'bg-blue-500 text-white' 
                    : storesByLetter[letter] 
                      ? 'bg-gray-200 hover:bg-gray-300' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Store Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores().map(store => (
          <Link 
            key={store.id}
            to={`/store/${store.id}/${formattedSlug(store.name)}`} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img 
                  src={store.logo || '/images/no-image.svg'} 
                  alt={`${store.name} logo`}
                  className="w-16 h-16 object-contain mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{store.name}</h3>
                  {store.certification && (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      {store.certification}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>{(store.productCount || 0).toLocaleString()} products in {(store.categoryCount || 0).toLocaleString()} categories</p>
                <div className="mt-2 flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(store.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-700">{store.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredStores().length === 0 && (
        <div className="bg-white rounded-lg p-8 shadow text-center">
          <h2 className="text-xl font-semibold mb-4">No stores found</h2>
          <p className="text-gray-600">
            We couldn't find any stores matching your search. Please try different criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Stores;
