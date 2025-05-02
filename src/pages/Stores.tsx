
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { VendorWithStats, getAllVendors } from '@/services/vendorService';

const Stores = () => {
  const [vendors, setVendors] = useState<VendorWithStats[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<VendorWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getAllVendors();
        setVendors(data);
        setFilteredVendors(data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
    
    fetchVendors();
  }, []);
  
  useEffect(() => {
    const filterVendors = () => {
      let filtered = [...vendors];
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(vendor => 
          vendor.name.toLowerCase().includes(query)
        );
      }
      
      // Apply tab filter
      if (activeTab !== 'all') {
        filtered = filtered.filter(vendor => {
          if (activeTab === 'certified') {
            return vendor.certification;
          }
          // You can add more filters here
          return true;
        });
      }
      
      setFilteredVendors(filtered);
    };
    
    filterVendors();
  }, [searchQuery, activeTab, vendors]);
  
  const handleVendorClick = (slug: string) => {
    navigate(`/store/${slug}`);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const renderAlphabeticalIndex = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    return (
      <div className="flex flex-wrap justify-center mb-8">
        {alphabet.map(letter => {
          const hasVendorsStartingWith = filteredVendors.some(
            vendor => vendor.name.toUpperCase().startsWith(letter)
          );
          
          return (
            <a 
              key={letter}
              href={`#section-${letter}`}
              className={`mx-1 px-2 py-1 ${hasVendorsStartingWith ? 'text-primary hover:underline' : 'text-gray-400'}`}
            >
              {letter}
            </a>
          );
        })}
      </div>
    );
  };
  
  const renderAlphabeticalSections = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    return alphabet.map(letter => {
      const vendorsStartingWith = filteredVendors.filter(
        vendor => vendor.name.toUpperCase().startsWith(letter)
      );
      
      if (vendorsStartingWith.length === 0) return null;
      
      return (
        <div key={letter} id={`section-${letter}`} className="mb-8">
          <h3 className="text-2xl font-bold mb-4 border-b pb-2">{letter}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendorsStartingWith.map(vendor => (
              <Card 
                key={vendor.id}
                onClick={() => handleVendorClick(vendor.id)}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-3">
                      {vendor.logo ? (
                        <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold">{vendor.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{vendor.name}</h4>
                      <div className="text-xs text-gray-500">
                        {vendor.productCount || 0} products | {vendor.categoryCount || 0} categories
                      </div>
                    </div>
                  </div>
                  
                  {vendor.certification && (
                    <div className="mb-2 text-xs">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {vendor.certification}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-600">
                    <div>{vendor.address && vendor.address[0]}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">All Stores</h1>
      
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="certified">Certified</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {renderAlphabeticalIndex()}
      
      {renderAlphabeticalSections()}
      
      {filteredVendors.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No stores found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Stores;
