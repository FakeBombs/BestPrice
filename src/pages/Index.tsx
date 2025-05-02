
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';
import { mainCategories } from '@/data/mockData';
import { getAllProducts, Product } from '@/services/productService';

const IndexPage = () => {
  const [trending, setTrending] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        
        // Simulate trending products (highest rated)
        const trendingProducts = [...allProducts]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
        
        // Simulate deals (lowest price)
        const dealsProducts = [...allProducts]
          .sort((a, b) => a.price - b.price)
          .slice(0, 8);
        
        // Simulate new arrivals (random selection)
        const newArrivalsProducts = [...allProducts]
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        
        setTrending(trendingProducts);
        setDeals(dealsProducts);
        setNewArrivals(newArrivalsProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      
      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mainCategories.map(category => (
            <CategoryCard 
              key={category.id}
              id={category.id}
              name={category.name}
              image={category.image}
              slug={category.slug}
            />
          ))}
        </div>
      </section>
      
      {/* Trending Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <Link to="/search?sort=trending" className="text-blue-500 hover:underline">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <ScrollableSlider>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-w-max">
              {trending.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </ScrollableSlider>
        )}
      </section>
      
      {/* Deals */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Best Deals</h2>
          <Link to="/deals" className="text-blue-500 hover:underline">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <ScrollableSlider>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-w-max">
              {deals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </ScrollableSlider>
        )}
      </section>
      
      {/* New Arrivals */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <Link to="/search?sort=newest" className="text-blue-500 hover:underline">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <ScrollableSlider>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-w-max">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </ScrollableSlider>
        )}
      </section>
    </div>
  );
};

export default IndexPage;
