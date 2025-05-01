import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts, fetchDeals, fetchNewArrivals, formatSlug } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import ScrollableSlider from '@/components/ScrollableSlider';
import TopVendorAd from '@/components/ads/TopVendorAd';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  
  // Create an array of root categories to display
  const rootCategories = [
    { id: '1', name: 'Electronics', image: '/dist/images/cat/electronics.webp', slug: 'electronics' },
    { id: '2', name: 'Fashion', image: '/dist/images/cat/fashion.webp', slug: 'fashion' },
    { id: '3', name: 'Home & Garden', image: '/dist/images/cat/home-garden.webp', slug: 'home-garden' },
    { id: '4', name: 'Health & Beauty', image: '/dist/images/cat/health-beauty.webp', slug: 'health-beauty' },
    { id: '5', name: 'Sports & Outdoors', image: '/dist/images/cat/sports.webp', slug: 'sports-outdoors' }
  ];
  
  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const featured = await fetchFeaturedProducts();
        setFeaturedProducts(featured);
        
        const dealsData = await fetchDeals();
        setDeals(dealsData);
        
        const newItems = await fetchNewArrivals();
        setNewArrivals(newItems);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* Main Hero Banner */}
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 h-96">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center p-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the Best Deals Online</h1>
            <p className="text-xl mb-8">Compare prices from hundreds of stores in one place</p>
            <Link to="/categories" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-opacity-90 transition">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
      
      {/* Top Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {rootCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/categories" className="text-blue-600 font-medium hover:underline">
            View All Categories
          </Link>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <ScrollableSlider>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollableSlider>
      </section>
      
      {/* Vendor Ad */}
      <section className="mb-12">
        <TopVendorAd productId="1" />
      </section>
      
      {/* Deals */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Hot Deals</h2>
        <ScrollableSlider>
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollableSlider>
        <div className="mt-6 text-center">
          <Link to="/deals" className="text-blue-600 font-medium hover:underline">
            View All Deals
          </Link>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
        <ScrollableSlider>
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollableSlider>
      </section>
    </div>
  );
};

export default Index;
