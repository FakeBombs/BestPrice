
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Mock brands data - in a real app, this would come from your backend
const BRANDS = [
  { id: 'b1', name: 'Apple', logo: 'https://placehold.co/200x200?text=Apple', productCount: 245 },
  { id: 'b2', name: 'Samsung', logo: 'https://placehold.co/200x200?text=Samsung', productCount: 312 },
  { id: 'b3', name: 'Sony', logo: 'https://placehold.co/200x200?text=Sony', productCount: 189 },
  { id: 'b4', name: 'LG', logo: 'https://placehold.co/200x200?text=LG', productCount: 156 },
  { id: 'b5', name: 'Microsoft', logo: 'https://placehold.co/200x200?text=Microsoft', productCount: 98 },
  { id: 'b6', name: 'Lenovo', logo: 'https://placehold.co/200x200?text=Lenovo', productCount: 124 },
  { id: 'b7', name: 'HP', logo: 'https://placehold.co/200x200?text=HP', productCount: 145 },
  { id: 'b8', name: 'Dell', logo: 'https://placehold.co/200x200?text=Dell', productCount: 89 },
  { id: 'b9', name: 'Asus', logo: 'https://placehold.co/200x200?text=Asus', productCount: 176 },
  { id: 'b10', name: 'Acer', logo: 'https://placehold.co/200x200?text=Acer', productCount: 132 },
  { id: 'b11', name: 'Huawei', logo: 'https://placehold.co/200x200?text=Huawei', productCount: 87 },
  { id: 'b12', name: 'Google', logo: 'https://placehold.co/200x200?text=Google', productCount: 56 },
  { id: 'b13', name: 'Xiaomi', logo: 'https://placehold.co/200x200?text=Xiaomi', productCount: 122 },
  { id: 'b14', name: 'Oppo', logo: 'https://placehold.co/200x200?text=Oppo', productCount: 63 },
  { id: 'b15', name: 'Philips', logo: 'https://placehold.co/200x200?text=Philips', productCount: 155 },
  { id: 'b16', name: 'Bose', logo: 'https://placehold.co/200x200?text=Bose', productCount: 43 },
  { id: 'b17', name: 'Canon', logo: 'https://placehold.co/200x200?text=Canon', productCount: 87 },
  { id: 'b18', name: 'Nikon', logo: 'https://placehold.co/200x200?text=Nikon', productCount: 76 },
];

const alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Brands = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  
  const filteredBrands = BRANDS.filter(brand => {
    if (searchQuery) {
      return brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (selectedLetter) {
      return brand.name.startsWith(selectedLetter);
    }
    return true;
  });
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Products by Brand</h1>
      
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {alphabetLetters.map(letter => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              selectedLetter === letter 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredBrands.map(brand => (
          <Card key={brand.id} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-3 p-2">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h3 className="font-medium text-sm">{brand.name}</h3>
              <p className="text-xs text-muted-foreground">{brand.productCount} products</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Brands;
