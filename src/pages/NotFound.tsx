
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Page Not Found</h1>
        <p className="text-gray-600 mb-8 text-lg">
          We couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
        </p>
        
        <div className="mb-10">
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="text-center">
            <h3 className="font-medium text-lg mb-2">Popular Categories</h3>
            <ul className="space-y-1">
              <li><Link to="/cat/1/electronics" className="text-primary hover:underline">Electronics</Link></li>
              <li><Link to="/cat/2/clothing-apparel" className="text-primary hover:underline">Clothing & Apparel</Link></li>
              <li><Link to="/cat/3/home-garden" className="text-primary hover:underline">Home & Garden</Link></li>
            </ul>
          </div>
          
          <div className="text-center">
            <h3 className="font-medium text-lg mb-2">Featured Deals</h3>
            <ul className="space-y-1">
              <li><Link to="/deals" className="text-primary hover:underline">Today's Deals</Link></li>
              <li><Link to="/search?sort=newest" className="text-primary hover:underline">New Arrivals</Link></li>
              <li><Link to="/search?featured=true" className="text-primary hover:underline">Featured Products</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h3 className="text-xl font-medium text-center mb-6">You might be interested in</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/" className="block hover:opacity-90 transition">
            <img width="225" height="225" alt="Popular product" className="rounded-lg w-full h-auto" loading="lazy" srcSet="/dist/images/products/smartphone1.jpg" src="/dist/images/products/smartphone1.jpg" />
          </Link>
          <Link to="/" className="block hover:opacity-90 transition">
            <img width="225" height="225" alt="Popular product" className="rounded-lg w-full h-auto" loading="lazy" srcSet="/dist/images/products/headphones1.jpg" src="/dist/images/products/headphones1.jpg" />
          </Link>
          <Link to="/" className="block hover:opacity-90 transition">
            <img width="225" height="225" alt="Popular product" className="rounded-lg w-full h-auto" loading="lazy" srcSet="/dist/images/products/laptop1.jpg" src="/dist/images/products/laptop1.jpg" />
          </Link>
          <Link to="/" className="block hover:opacity-90 transition">
            <img width="225" height="225" alt="Popular product" className="rounded-lg w-full h-auto" loading="lazy" srcSet="/dist/images/products/smartwatch1.jpg" src="/dist/images/products/smartwatch1.jpg" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
