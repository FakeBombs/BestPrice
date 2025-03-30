
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Star, ExternalLink } from 'lucide-react';
import { getVendors } from '@/data/mockData';

const Stores = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const vendors = getVendors();
  
  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Compare Prices from Top Stores</h1>
      
      <div className="mb-8">
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredVendors.slice(0, 6).map(vendor => (
            <Card key={vendor.id} className="overflow-hidden">
              <CardContent className="p-4 flex items-center">
                <div className="w-16 h-16 mr-4 flex-shrink-0">
                  <img 
                    src={vendor.logo} 
                    alt={vendor.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div>
                  <h3 className="font-medium">{vendor.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{vendor.rating.toFixed(1)}/5</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span>{vendor.productCount} products</span>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Visit Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map(vendor => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-3">
                      <img 
                        src={vendor.logo} 
                        alt={vendor.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    {vendor.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {vendor.rating.toFixed(1)}/5
                  </div>
                </TableCell>
                <TableCell>{vendor.productCount}</TableCell>
                <TableCell>{vendor.categories.join(', ')}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Store
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Stores;
