
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tag, Percent, ArrowDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/mockData';

const Deals = () => {
  // We'll just show a random selection of products as "deals" for this demo
  const dealsProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Today's Best Deals</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <Button variant="outline" className="flex items-center">
          <Tag className="mr-2 h-4 w-4" />
          All Deals
        </Button>
        <Button variant="outline" className="flex items-center">
          <Percent className="mr-2 h-4 w-4" />
          Discounts over 20%
        </Button>
        <Button variant="outline" className="flex items-center">
          <ArrowDown className="mr-2 h-4 w-4" />
          Price Drops
        </Button>
      </div>
      
      <div className="product-grid">
        {dealsProducts.map((product) => (
          <div key={product.id} className="relative">
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                Deal
              </span>
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deals;
